/**
 *
 * Torque library
 * 
 * A tool for mapping temporal data from CartoDB
 * Still in development and being finalized for
 * CartoDB 2.0
 *
 * Authors: Andrew Hill, Simon Tokumine, Javier Santana
 *
 */

// iOS fix
if (Function.prototype.bind == undefined) {
    Function.prototype.bind = function (bind) {
        var self = this;
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return self.apply(bind || null, args);
        };
    };
}

function Torque() {
    var args = Array.prototype.slice.call(arguments),
        callback = args.pop(),
        modules = (args[0] && typeof args[0] === "string") ? args : args[0],
        config,
        i;

    if (!(this instanceof Torque)) {
        return new Torque(modules, callback);
    }

    if (!modules || modules === '*') {
        modules = [];
        for (i in Torque.modules) {
            if (Torque.modules.hasOwnProperty(i)) {
                modules.push(i);
            }
        }
    }

    for (i = 0; i < modules.length; i += 1) {
        Torque.modules[modules[i]](this);
    }

    callback(this);
    return this;
}
;

Torque.modules = {};

Torque.modules.app = function (torque) {
    torque.app = {};
    torque.app.Instance = Class.extend(
        {
            init:function (logging) {
                this.layers = {};
                torque.log.enabled = logging ? logging : false;
            },
            addLayer:function (map, options) {
                var layer = new torque.layer.Engine(map, options);
                return layer
            }
        }
    );
};

Torque.modules.layer = function (torque) {
    torque.layer = {};
    torque.layer.Engine = Class.extend({
        init:function (map, options) {
            this._defaults = {
                user:'viz2',
                table:'ny_bus',
                column:'timestamp',
                steps:250,
                resolution:3,
                cumulative:false,
                fps:24,
                autoplay:true,
                clock:false,
                zindex:0,
                fitbounds:false,
                countby:'count(i.cartodb_id)',
                blendmode:'source-over',
                trails:false,
                point_type:'square',
                subtitles:false
            }
            this.options = _.defaults(options, this._defaults);

            this._map = map;
            this._index = this.options.zindex;

            while (this._map.overlayMapTypes.length < this.options.zindex) {
                this._map.overlayMapTypes.push(null);
            }

            this._cartodb = new Backbone.CartoDB({user:this.options.user});
            this.bounds = new google.maps.LatLngBounds();

            torque.clock.enabled = this.options.clock ? this.options.clock : false;
            torque.clock.set('loading...');

            this.getDeltas();
        },
        pause:function () {
            if (this.running == true) {
                this.running = false;
            } else {
                this.running = true;
                this.play();
            }
        },
        setOptions:function (new_options) {

            this.running = false;
            this.options = _.defaults(new_options, this._defaults);

            torque.clock.enabled = this.options.clock ? this.options.clock : false;
            torque.clock.set('loading...');

            this._cartodb = new Backbone.CartoDB({user:this.options.user});
            this.bounds = new google.maps.LatLngBounds();

            this._map.overlayMapTypes.setAt(this._index, null);
            this.getDeltas();
        },
        run:function () {
            this.start = new Date(this.options.start).getTime();
            this.end = new Date(this.options.end).getTime();

            this._current = this.start;
            this._step = Math.floor((this.end - this.start) / this.options.steps);

            this._setupListeners();

            this._display = new TimePlayer(this.start, (this.start - this.end), this._step, this.options);

            this._map.overlayMapTypes.setAt(this._index, this._display);

            this.fitBounds(this.options.fitbounds);

            this.running = false;
            torque.clock.clear();

            if (this.options.autoplay) {
                this.running = true;
                this.play();
            }

            torque.log.info('Layer is now running!');
        },
        _setupListeners:function () {
            var that = this;
            google.maps.event.addListener(this._map, 'zoom_changed', function () {
                that._display.reset_max_value();
            });
        },
        getBounds:function () {
            return this.bounds;
        },
        fitBounds:function (f) {
            if (f !== false) {
                this._map.fitBounds(this.bounds);
                if (typeof f == 'number') {
                    this._map.setZoom(this._map.getZoom() + f);
                } else {
                    this._map.setZoom(this._map.getZoom());
                }
            }
        },
        getDeltas:function (options) {
            var that = this;
            var sql = "SELECT st_xmax(st_envelope(st_collect(the_geom))) xmax,st_ymax(st_envelope(st_collect(the_geom))) ymax, st_xmin(st_envelope(st_collect(the_geom))) xmin, st_ymin(st_envelope(st_collect(the_geom))) ymin, date_part('epoch',max({0})) max, date_part('epoch',min({0})) min FROM {1}".format(this.options.column, this.options.table);

            var timeExtents = this._cartodb.CartoDBCollection.extend({
                sql:sql
            });
            var times = new timeExtents();
            times.fetch();
            times.bind('reset', function () {
                times.each(function (p) {
                    that.options.start = p.get('min');
                    that.options.end = p.get('max');
                    that.bounds.extend(new google.maps.LatLng(p.get('ymin'), p.get('xmax')));
                    that.bounds.extend(new google.maps.LatLng(p.get('ymax'), p.get('xmin')));
                    that.bounds.extend(new google.maps.LatLng((p.get('ymax') + p.get('ymin')) / 2, (p.get('xmax') + p.get('xmin')) / 2));
                });
                that.run();
            });
        },
        advance:function () {
            if (this._current < this.end) {
                this._current = this._current + this._step
            } else {
                this._current = this.start;
            }
            this._display.set_time((this._current - this.start) / this._step);
        },
        play:function () {
            var pause = 0;
            if (this._current < this.end) {
                this._current = this._current + this._step
                if (this.end < this._current) {
                    pause = 2500;
                }
            } else {
                this._current = this.start;
            }

            var date = new Date(this._current * 1000);
            var date_arry = date.toString().substr(4).split(' ');
            torque.clock.set('<span id="month">' + date_arry[0] + '</span> <span id="year">' + date_arry[2] + '</span>');

            if (this.options.subtitles) {
                torque.subtitles.set(date);
            }

            this._display.set_time((this._current - this.start) / this._step);

            if (this.running) {
                setTimeout(function () {
                    this.play()
                }.bind(this), pause + 1000 * 1 / this.options.fps);
            }
        }
    });
}

Torque.modules.clock = function (torque) {
    torque.clock = {};

    torque.clock.clear = function () {
        $('.torque_time').html('');
    };
    torque.clock.set = function (msg) {
        torque.clock._hand(msg);
    };
    torque.clock._hand = function (msg) {
        var clockger = window.console;
        if (torque.clock.enabled) {
            $('.torque_time').html(msg);
        }
    };
};

Torque.modules.subtitles = function (torque) {
    torque.subtitles = {
        subs:[
            {
                from:new Date("March 01, 1913 00:00:00"),
                to:new Date("July 01, 1914 00:00:00"),
                sub:"Pre war"
            },
            {
                from:new Date("August 01, 1914 00:00:00"),
                to:new Date("February 01, 1915 00:00:00"),
                sub:"War begins with Germany"
            },
            {
                from:new Date("February 02, 1915 00:00:00"),
                to:new Date("October 01, 1916 00:00:00"),
                sub:"North Sea naval blockade"
            },
            {
                from:new Date("October 02, 1917 00:00:00"),
                to:new Date("April 01, 1917 00:00:00"),
                sub:"Atlantic U-boat warfare"
            },
            {
                from:new Date("April 02, 1917 00:00:00"),
                to:new Date("September 01, 1917 00:00:00"),
                sub:"USA enters war"
            },
            {
                from:new Date("September 02, 1917 00:00:00"),
                to:new Date("November 01, 1918 00:00:00"),
                sub:"Destroyers begin to escort convoys in Atlantic"
            },
            {
                from:new Date("November 02, 1918 00:00:00"),
                to:new Date("August 01, 1920 00:00:00"),
                sub:"End of WWI"
            },
            {
                from:new Date("August 02, 1920 00:00:00"),
                to:new Date("August 01, 1925 00:00:00"),
                sub:"Trade routes resume"
            }

        ]
    };

    torque.subtitles.clear = function () {
        $('.torque_subs').html('');
    };
    torque.subtitles.set = function (date) {
        $.each(this.subs, function () {
            if (this.from < date && this.to > date) {
                torque.subtitles._update(this.sub);
            }
        });
    };
    torque.subtitles._update = function (msg) {
        $('.torque_subs').html(msg);
    };
};

/**
 * Logging module that torquetes log messages to the console and to the Speed
 * Tracer API. It contains convenience methods for info(), warn(), error(),
 * and todo().
 *
 */
Torque.modules.log = function (torque) {
    torque.log = {};

    torque.log.info = function (msg) {
        torque.log._torquete('INFO: ' + msg);
    };

    torque.log.warn = function (msg) {
        torque.log._torquete('WARN: ' + msg);
    };

    torque.log.error = function (msg) {
        torque.log._torquete('ERROR: ' + msg);
    };

    torque.log.todo = function (msg) {
        torque.log._torquete('TODO: ' + msg);
    };

    torque.log._torquete = function (msg) {
        var logger = window.console;
        if (torque.log.enabled) {
            if (logger && logger.markTimeline) {
                logger.markTimeline(msg);
            }
            console.log(msg);
        }
    };
};

var originShift = 2 * Math.PI * 6378137 / 2.0;
var initialResolution = 2 * Math.PI * 6378137 / 256.0;
function meterToPixels(mx, my, zoom) {
    var res = initialResolution / (1 << zoom);
    var px = (mx + originShift) / res;
    var py = (my + originShift) / res;
    return [px, py];
}
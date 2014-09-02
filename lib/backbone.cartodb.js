
/**
 *
 * backbone cartodb adapter
 *
 * this is a small library that allows to use Backbone with models
 * to work with data stored in CartoDB (a geospatial database on 
 * the cloud, see more info at http://cartodb.com).
 *
 * it does NOT overrride Backbone.sync
 *
 */

Backbone.CartoDB = function(options, query, cache) {

    options = _.defaults(options, {
        USE_PROXY: false,
        user: ''
    });

    function _SQL(sql) {
        this.sql = sql;
    }
    function SQL(sql) {
        return new _SQL(sql);
    }

    // SQL("{0} is {1}").format("CartoDB", "epic!");
    _SQL.prototype.format = function() {
      var str = this.sql,
          len = arguments.length+1;
      var safe, arg;
      for (i=0; i < len; arg = arguments[i++]) {
          safe = typeof arg === 'object' ? JSON.stringify(arg) : arg;
          str = str.replace(RegExp('\\{'+(i-1)+'\\}', 'g'), safe);
      }
      return str;
    };


    var resource_path= options.user + '.cartodb.com/api/v2/sql';
    var resource_url = 'https://' + resource_path;

    /**
     * fetch sql from the server
     *
     * this function should be changed if you're working on node
     * 
     */
    query = query || function(sql, callback, proxy) {
        var url = resource_url;
        var crossDomain = true;
        if(proxy) {
            url = 'api/v0/proxy/' + resource_url;
            crossDomain = false;
        }
        if(sql.length > 1500) {
            $.ajax({
              url: url,
              crossDomain: crossDomain,
              type: 'POST',
              dataType: 'json',
              data: 'q=' + encodeURIComponent(sql),
              success: callback,
              error: function(){ 
                if(proxy) {
                    callback(); 
                } else {
                    //try fallback
                    if(USE_PROXY) {
                        query(sql, callback, true);
                    }
                }
              }
            });
        } else {
             // TODO: add timeout
             $.getJSON(resource_url + '?q=' + encodeURIComponent(sql) + '&callback=?')
             .success(callback)
             .fail(function(){ 
                    callback(); 
             }).complete(function() {
             });
        }
    };

    var dummy_cache = {
        setItem: function(key, value) { },
        getItem: function(key) { return null; },
        removeItem: function(key) { }
    };

    cache = cache && dummy_cache;


    var CartoDBModel = Backbone.Model.extend({

      _create_sql: function() {
        var where = SQL(" where {0} = '{1}'").format(
            this.columns[this.what], 
            this.get(this.what).replace("'", "''")
        );
        var select = this._sql_select();
        var sql = 'select ' + select.join(',') + ' from ' + this.table + where;
        return sql;
      },

      _sql_select: function() {
        var select = [];
        for(var k in this.columns) {
          var w = this.columns[k];
          if(w.indexOf('ST_') !== -1 || w === "the_geom") {
            select.push(SQL('ST_AsGeoJSON({1}) as {0}').format(k,w));
          } else {
            select.push(SQL('{1} as {0}').format(k, w));
          }
        }
        return select;
      },

      _parse_columns: function(row) {
        var parsed = {};
        for(var k in row) {
          var v = row[k];
          var c = this.columns[k];
          if (c.indexOf('ST_') !== -1 || c === "the_geom") {
            parsed[k] = JSON.parse(v);
          } else {
            parsed[k] = row[k];
          }
        }
        return parsed;
      },

      fetch: function() {
        var self = this;
        query(this._create_sql(), function(data) {
          self.set(self._parse_columns(data.rows[0]));
        });
      }
    });


    /**
     * cartodb collection created from a sql composed using 'columns' and
     * 'table' attributes defined in a child class
     *
     * var C = CartoDBCollection.extend({
     *  table: 'table',
     *  columns: ['c1', 'c2']
     * });
     * var c = new C();
     * c.fetch();
     */
    var CartoDBCollection = Backbone.Collection.extend({

      _create_sql: function() {
        var tables = this.table;
        if(!_.isArray(this.table)) {
            tables = [this.table];
        }
        tables = tables.join(',');
        var select = CartoDBModel.prototype._sql_select.call(this);
        var sql = 'select ' + select.join(',') + ' from ' + this.table;
        if (this.where) {
            sql += " WHERE " + this.where;
        }
        return sql;
      },

      fetch: function() {
        var self = this;
        var sql = this.sql || this._create_sql();
        if(typeof(sql) === "function") {
          sql = sql.call(this);
        }
        var item = this.cache ? cache.getItem(sql): false;
        if(!item) {
            query(sql, function(data) {
              if(this.cache) {
                  try {
                    cache.setItem(sql, JSON.stringify(data.rows));
                  } catch(e) {}
              }
              var rows;
              if(!self.sql) {
                  rows = _.map(data.rows, function(r) {
                    return CartoDBModel.prototype._parse_columns.call(self, r);
                  });
              } else {
                  rows = data.rows;
              }
              self.reset(rows);
            });
        } else {
            self.reset(JSON.parse(item));
        }
      }

    });


    return {
      query: query,
      CartoDBCollection: CartoDBCollection,
      CartoDBModel: CartoDBModel,
      SQL: SQL
    };

};

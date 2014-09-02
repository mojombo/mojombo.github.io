// Reqwest
/*!
  * Reqwest! A x-browser general purpose XHR connection manager
  * copyright Dustin Diaz 2011
  * https://github.com/ded/reqwest
  * license MIT
  */
!function(window){function serial(a){var b=a.name;if(a.disabled||!b)return"";b=enc(b);switch(a.tagName.toLowerCase()){case"input":switch(a.type){case"reset":case"button":case"image":case"file":return"";case"checkbox":case"radio":return a.checked?b+"="+(a.value?enc(a.value):!0)+"&":"";default:return b+"="+(a.value?enc(a.value):"")+"&"}break;case"textarea":return b+"="+enc(a.value)+"&";case"select":return b+"="+enc(a.options[a.selectedIndex].value)+"&"}return""}function enc(a){return encodeURIComponent(a)}function reqwest(a,b){return new Reqwest(a,b)}function init(o,fn){function error(a){o.error&&o.error(a),complete(a)}function success(resp){o.timeout&&clearTimeout(self.timeout)&&(self.timeout=null);var r=resp.responseText;switch(type){case"json":resp=eval("("+r+")");break;case"js":resp=eval(r);break;case"html":resp=r}fn(resp),o.success&&o.success(resp),complete(resp)}function complete(a){o.complete&&o.complete(a)}this.url=typeof o=="string"?o:o.url,this.timeout=null;var type=o.type||setType(this.url),self=this;fn=fn||function(){},o.timeout&&(this.timeout=setTimeout(function(){self.abort(),error()},o.timeout)),this.request=getRequest(o,success,error)}function setType(a){if(/\.json$/.test(a))return"json";if(/\.jsonp$/.test(a))return"jsonp";if(/\.js$/.test(a))return"js";if(/\.html?$/.test(a))return"html";if(/\.xml$/.test(a))return"xml";return"js"}function Reqwest(a,b){this.o=a,this.fn=b,init.apply(this,arguments)}function getRequest(a,b,c){if(a.type!="jsonp"){var f=xhr();f.open(a.method||"GET",typeof a=="string"?a:a.url,!0),setHeaders(f,a),f.onreadystatechange=readyState(f,b,c),a.before&&a.before(f),f.send(a.data||null);return f}var d=doc.createElement("script");window[getCallbackName(a)]=generalCallback,d.type="text/javascript",d.src=a.url,d.async=!0;var e=function(){a.success&&a.success(lastValue),lastValue=undefined,head.removeChild(d)};d.onload=e,d.onreadystatechange=function(){/^loaded|complete$/.test(d.readyState)&&e()},head.appendChild(d)}function generalCallback(a){lastValue=a}function getCallbackName(a){var b=a.jsonpCallback||"callback";if(a.url.slice(-(b.length+2))==b+"=?"){var c="reqwest_"+uniqid++;a.url=a.url.substr(0,a.url.length-1)+c;return c}var d=new RegExp(b+"=([\\w]+)");return a.url.match(d)[1]}function setHeaders(a,b){var c=b.headers||{};c.Accept="text/javascript, text/html, application/xml, text/xml, */*",c["X-Requested-With"]=c["X-Requested-With"]||"XMLHttpRequest";if(b.data){c["Content-type"]=c["Content-type"]||"application/x-www-form-urlencoded";for(var d in c)c.hasOwnProperty(d)&&a.setRequestHeader(d,c[d],!1)}}function readyState(a,b,c){return function(){a&&a.readyState==4&&(twoHundo.test(a.status)?b(a):c(a))}}var twoHundo=/^20\d$/,doc=document,byTag="getElementsByTagName",head=doc[byTag]("head")[0],xhr="XMLHttpRequest"in window?function(){return new XMLHttpRequest}:function(){return new ActiveXObject("Microsoft.XMLHTTP")},uniqid=0,lastValue;Reqwest.prototype={abort:function(){this.request.abort()},retry:function(){init.call(this,this.o,this.fn)}},reqwest.serialize=function(a){var b=a[byTag]("input"),c=a[byTag]("select"),d=a[byTag]("textarea");return(v(b).chain().toArray().map(serial).value().join("")+v(c).chain().toArray().map(serial).value().join("")+v(d).chain().toArray().map(serial).value().join("")).replace(/&$/,"")},reqwest.serializeArray=function(a){for(var b=this.serialize(a).split("&"),c=0,d=b.length,e=[],f;c<d;c++)b[c]&&(f=b[c].split("="))&&e.push({name:f[0],value:f[1]});return e};var old=window.reqwest;reqwest.noConflict=function(){window.reqwest=old;return this},window.reqwest=reqwest}(this)
// 


var carto_initialize = function(carto, uri, callback) {
    reqwest(uri, function (resp) {
        carto.tree.Reference.data = resp;
        // regenerate cache
        carto.tree.Reference.selectors = (function() {
            var list = [];
            for (var i in tree.Reference.data.symbolizers) {
                for (var j in tree.Reference.data.symbolizers[i]) {
                    if (tree.Reference.data.symbolizers[i][j].hasOwnProperty('css')) {
                        list.push(tree.Reference.data.symbolizers[i][j].css);
                    }
                }
            }
            return list;
        })();
        callback(carto);
    });
};    
//
// Stub out `require` in the browser
//
function require(arg) {
    return window.carto[arg.split('/')[1]];
};
var carto, tree;

if (typeof(process) !== 'undefined') {
    carto = exports;
    tree = require('carto/tree');
} else {
    if (typeof(window.carto) === 'undefined') { window.carto = {}; }
    carto = window.carto;
    tree = window.carto.tree = {};
}
//
// carto.js - parser
//
//    A relatively straight-forward predictive parser.
//    There is no tokenization/lexing stage, the input is parsed
//    in one sweep.
//
//    To make the parser fast enough to run in the browser, several
//    optimization had to be made:
//
//    - Matching and slicing on a huge input is often cause of slowdowns.
//      The solution is to chunkify the input into smaller strings.
//      The chunks are stored in the `chunks` var,
//      `j` holds the current chunk index, and `current` holds
//      the index of the current chunk in relation to `input`.
//      This gives us an almost 4x speed-up.
//
//    - In many cases, we don't need to match individual tokens;
//      for example, if a value doesn't hold any variables, operations
//      or dynamic references, the parser can effectively 'skip' it,
//      treating it as a literal.
//      An example would be '1px solid #000' - which evaluates to itself,
//      we don't need to know what the individual components are.
//      The drawback, of course is that you don't get the benefits of
//      syntax-checking on the CSS. This gives us a 50% speed-up in the parser,
//      and a smaller speed-up in the code-gen.
//
//
//    Token matching is done with the `$` function, which either takes
//    a terminal string or regexp, or a non-terminal function to call.
//    It also takes care of moving all the indices forwards.
//
//
carto.Parser = function Parser(env) {
    var input,       // LeSS input string
        i,           // current index in `input`
        j,           // current chunk
        temp,        // temporarily holds a chunk's state, for backtracking
        memo,        // temporarily holds `i`, when backtracking
        furthest,    // furthest index the parser has gone to
        chunks,      // chunkified input
        current,     // index of current chunk, in `input`
        parser;

    var that = this;

    // This function is called after all files
    // have been imported through `@import`.
    var finish = function() {};

    var imports = this.imports = {
        paths: env && env.paths || [],  // Search paths, when importing
        queue: [],                      // Files which haven't been imported yet
        files: {},                      // Holds the imported parse trees
        mime: env && env.mime,         // MIME type of .carto files
        push: function(path, callback) {
            var that = this;
            this.queue.push(path);

            //
            // Import a file asynchronously
            //
            carto.Parser.importer(path, this.paths, function(root) {
                that.queue.splice(that.queue.indexOf(path), 1); // Remove the path from the queue
                that.files[path] = root;                        // Store the root

                callback(root);

                if (that.queue.length === 0) { finish(); }       // Call `finish` if we're done importing
            }, env);
        }
    };

    function save()    {
        temp = chunks[j];
        memo = i;
        current = i;
    }
    function restore() {
        chunks[j] = temp;
        i = memo;
        current = i;
    }

    function sync() {
        if (i > current) {
            chunks[j] = chunks[j].slice(i - current);
            current = i;
        }
    }
    //
    // Parse from a token, regexp or string, and move forward if match
    //
    function $(tok) {
        var match, args, length, c, index, endIndex, k;

        //
        // Non-terminal
        //
        if (tok instanceof Function) {
            return tok.call(parser.parsers);
        //
        // Terminal
        //
        //     Either match a single character in the input,
        //     or match a regexp in the current chunk (chunk[j]).
        //
        } else if (typeof(tok) === 'string') {
            match = input.charAt(i) === tok ? tok : null;
            length = 1;
            sync();
        } else {
            sync();

            if (match = tok.exec(chunks[j])) {
                length = match[0].length;
            } else {
                return null;
            }
        }

        // The match is confirmed, add the match length to `i`,
        // and consume any extra white-space characters (' ' || '\n')
        // which come after that. The reason for this is that LeSS's
        // grammar is mostly white-space insensitive.
        //
        if (match) {
            mem = i += length;
            endIndex = i + chunks[j].length - length;

            while (i < endIndex) {
                c = input.charCodeAt(i);
                if (! (c === 32 || c === 10 || c === 9)) { break; }
                i++;
            }
            chunks[j] = chunks[j].slice(length + (i - mem));
            current = i;

            if (chunks[j].length === 0 && j < chunks.length - 1) { j++; }

            if (typeof(match) === 'string') {
                return match;
            } else {
                return match.length === 1 ? match[0] : match;
            }
        }
    }

    // Same as $(), but don't change the state of the parser,
    // just return the match.
    function peek(tok) {
        if (typeof(tok) === 'string') {
            return input.charAt(i) === tok;
        } else {
            if (tok.test(chunks[j])) {
                return true;
            } else {
                return false;
            }
        }
    }

    function errorMessage(message, i) {
        if (typeof i === 'undefined') i = furthest;
        lines = input.split('\n');
        line = (input.slice(0, i).match(/\n/g) || '').length + 1;

        for (var n = i, column = -1; n >= 0 && input.charAt(n) !== '\n'; n--) { column++; }

        return {
            name: 'ParseError',
            message: (message || 'Syntax Error') + ' on line ' + line,
            filename: env.filename,
            line: line,
            index: i,
            column: column,
            extract: [
                lines[line - 2],
                lines[line - 1],
                lines[line]
            ]
        };
    }

    this.env = env = env || {};
    this.env.filename = this.env.filename || null;

    //
    // The Parser
    //
    return parser = {

        imports: imports,
        //
        // Parse an input string into an abstract syntax tree,
        // call `callback` when done.
        //
        parse: function(str, callback) {
            var root, start, end, zone, line, lines, buff = [], c, error = null;

            i = j = current = furthest = 0;
            chunks = [];
            input = str.replace(/\r\n/g, '\n');

            var early_exit = false;
            // Split the input into chunks.
            chunks = (function(chunks) {
                var j = 0,
                    skip = /[^"'`\{\}\/]+/g,
                    comment = /\/\*(?:[^*]|\*+[^\/*])*\*+\/|\/\/.*/g,
                    level = 0,
                    match,
                    chunk = chunks[0],
                    inString;

                chunker: for (var i = 0, c, cc; i < input.length; i++) {
                    skip.lastIndex = i;
                    if (match = skip.exec(input)) {
                        if (match.index === i) {
                            i += match[0].length;
                            chunk.push(match[0]);
                        }
                    }
                    c = input.charAt(i);
                    comment.lastIndex = i;

                    if (!inString && c === '/') {
                        cc = input.charAt(i + 1);
                        if (cc === '/' || cc === '*') {
                            if (match = comment.exec(input)) {
                                if (match.index === i) {
                                    i += match[0].length - 1;
                                    chunk.push(match[0]);
                                    c = input.charAt(i);
                                    continue chunker;
                                }
                            }
                        }
                    }

                    if (c === '{' && !inString) { level++;
                        chunk.push(c);
                    } else if (c === '}' && !inString) { level--;
                        chunk.push(c);
                        chunks[++j] = chunk = [];
                    } else {
                        if (c === '"' || c === "'" || c === '`') {
                            if (! inString) {
                                inString = c;
                            } else {
                                inString = inString === c ? false : inString;
                            }
                        }
                        chunk.push(c);
                    }
                }
                if (level > 0) {
                    // TODO: make invalid instead
                    callback([{
                        index: i,
                        line: 0,
                        filename: env.filename,
                        message: 'Missing closing `}`'
                    }]);
                    early_exit = true;
                }

                return chunks.map(function(c) { return c.join('') });
            })([[]]);

            // callback has been called, chunker failed so that this isn't doable.
            if (early_exit) return;

            // Start with the primary rule.
            // The whole syntax tree is held under a Ruleset node,
            // with the `root` property set to true, so no `{}` are
            // output. The callback is called when the input is parsed.
            root = new tree.Ruleset([], $(this.parsers.primary));
            root.root = true;

            root.getLine = function(index) {
                return index ? (input.slice(0, index).match(/\n/g) || '').length : null;
            };

            root.makeError = function(e) {
                lines = input.split('\n');
                line = root.getLine(e.index);

                for (var n = e.index, column = -1;
                         n >= 0 && input.charAt(n) !== '\n';
                         n--) { column++ }

                return {
                    type: e.type,
                    message: e.message,
                    filename: e.filename,
                    index: e.index,
                    line: typeof(line) === 'number' ? line + 1 : null,
                    column: column,
                    extract: [
                        lines[line - 1],
                        lines[line],
                        lines[line + 1]
                    ]
                }
            }

            // Get an array of Ruleset objects, flattened
            // and sorted according to specificitySort
            root.toList = (function() {
                var line, lines, column;
                if (!(window && window._)) {
                    var _ = require('underscore')._;
                }
                return function(env) {
                    env.error = function(e) {
                        if (!env.errors) env.errors = [];
                        env.errors.push(root.makeError(e));
                    };
                    env.errors = [];
                    env.frames = env.frames || [];

                    // call populates Invalid-caused errors
                    var definitions = this.flatten([], [], env);
                    definitions.sort(specificitySort);
                    return definitions;
                };
            })();

            // Sort rules by specificity: this function expects selectors to be
            // split already.
            //
            // Written to be used as a .sort(Function);
            // argument.
            //
            // [1, 0, 0, 467] > [0, 0, 1, 520]
            var specificitySort = function(a, b) {
                var as = a.specificity;
                var bs = b.specificity;

                if (as[0] != bs[0]) return bs[0] - as[0];
                if (as[1] != bs[1]) return bs[1] - as[1];
                if (as[2] != bs[2]) return bs[2] - as[2];
                return bs[3] - as[3];
            };

            // If `i` is smaller than the `input.length - 1`,
            // it means the parser wasn't able to parse the whole
            // string, so we've got a parsing error.
            //
            // We try to extract a \n delimited string,
            // showing the line where the parse error occured.
            // We split it up into two parts (the part which parsed,
            // and the part which didn't), so we can color them differently.
            if (i < input.length - 1) {
                error = errorMessage('Parse error', i);
            }

            callback(error, root);
        },

        //
        // Here in, the parsing rules/functions
        //
        // The basic structure of the syntax tree generated is as follows:
        //
        //   Ruleset ->  Rule -> Value -> Expression -> Entity
        //
        // Here's some LESS code:
        //
        //    .class {
        //      color: #fff;
        //      border: 1px solid #000;
        //      width: @w + 4px;
        //      > .child {...}
        //    }
        //
        // And here's what the parse tree might look like:
        //
        //     Ruleset (Selector '.class', [
        //         Rule ("color",  Value ([Expression [Color #fff]]))
        //         Rule ("border", Value ([Expression [Dimension 1px][Keyword "solid"][Color #000]]))
        //         Rule ("width",  Value ([Expression [Operation "+" [Variable "@w"][Dimension 4px]]]))
        //         Ruleset (Selector [Element '>', '.child'], [...])
        //     ])
        //
        //  In general, most rules will try to parse a token with the `$()` function, and if the return
        //  value is truly, will return a new node, of the relevant type. Sometimes, we need to check
        //  first, before parsing, that's when we use `peek()`.
        //
        parsers: {
            //
            // The `primary` rule is the *entry* and *exit* point of the parser.
            // The rules here can appear at any level of the parse tree.
            //
            // The recursive nature of the grammar is an interplay between the `block`
            // rule, which represents `{ ... }`, the `ruleset` rule, and this `primary` rule,
            // as represented by this simplified grammar:
            //
            //     primary  →  (ruleset | rule)+
            //     ruleset  →  selector+ block
            //     block    →  '{' primary '}'
            //
            // Only at one point is the primary rule not called from the
            // block rule: at the root level.
            //
            primary: function() {
                var node, root = [];

                while ((node = $(this.mixin.definition) || $(this.rule) || $(this.ruleset) ||
                               $(this.mixin.call) || $(this.comment))
                               || $(/^[\s\n]+/) || (node = $(this.invalid))) {
                    node && root.push(node);
                }
                return root;
            },

            invalid: function () {
                var chunk;

                // To fail gracefully, match everything until a semicolon or linebreak.
                if (chunk = $(/^[^;\n]*[;\n]/)) {
                    return new(tree.Invalid)(chunk, memo);
                }
            },

            // We create a Comment node for CSS comments `/* */`,
            // but keep the LeSS comments `//` silent, by just skipping
            // over them.
            comment: function() {
                var comment;

                if (input.charAt(i) !== '/') return;

                if (input.charAt(i + 1) === '/') {
                    return new tree.Comment($(/^\/\/.*/), true);
                } else if (comment = $(/^\/\*(?:[^*]|\*+[^\/*])*\*+\/\n?/)) {
                    return new tree.Comment(comment);
                }
            },

            //
            // Entities are tokens which can be found inside an Expression
            //
            entities: {
                //
                // A string, which supports escaping " and '
                //
                //     "milky way" 'he\'s the one!'
                //
                quoted: function() {
                    var str;
                    if (input.charAt(i) !== '"' && input.charAt(i) !== "'") return;

                    if (str = $(/^"((?:[^"\\\r\n]|\\.)*)"|'((?:[^'\\\r\n]|\\.)*)'/)) {
                        return new tree.Quoted(str[0], str[1] || str[2]);
                    }
                },

                comparison: function() {
                    var str;
                    if (str = $(/^=|!=|<=|>=|<|>/)) {
                        return str;
                    }
                },

                //
                // A catch-all word, such as:
                //
                //     black border-collapse
                //
                keyword: function() {
                    var k;
                    if (k = $(/^[A-Za-z-]+[A-Za-z-0-9]*/)) { return new tree.Keyword(k) }
                },

                //
                // A function call
                //
                //     rgb(255, 0, 255)
                //
                // The arguments are parsed with the `entities.arguments` parser.
                //
                call: function() {
                    var name, args;

                    if (! (name = /^([\w-]+|%)\(/.exec(chunks[j]))) return;

                    name = name[1].toLowerCase();

                    if (name === 'url') { return null }
                    else { i += name.length + 1 }

                    args = $(this.entities.arguments);

                    if (! $(')')) return;

                    if (name) { return new tree.Call(name, args) }
                },
                arguments: function() {
                    var args = [], arg;

                    while (arg = $(this.expression)) {
                        args.push(arg);
                        if (! $(',')) { break }
                    }
                    return args;
                },
                literal: function() {
                    return $(this.entities.dimension) ||
                           $(this.entities.color) ||
                           $(this.entities.quoted);
                },

                //
                // Parse url() tokens
                //
                // We use a specific rule for urls, because they don't really behave like
                // standard function calls. The difference is that the argument doesn't have
                // to be enclosed within a string, so it can't be parsed as an Expression.
                //
                url: function() {
                    var value;

                    if (input.charAt(i) !== 'u' || !$(/^url\(/)) return;
                    value = $(this.entities.quoted) || $(this.entities.variable) ||
                            $(/^[-\w%@$\/.&=:;#+?]+/) || '';
                    if (! $(')')) {
                        return new tree.Invalid(value, memo, 'Missing closing ) in URL.');
                    } else {
                        return new tree.URL((value.value || value.data || value instanceof tree.Variable)
                            ? value : new tree.Anonymous(value), imports.paths);
                    }
                },

                //
                // A Variable entity, such as `@fink`, in
                //
                //     width: @fink + 2px
                //
                // We use a different parser for variable definitions,
                // see `parsers.variable`.
                //
                variable: function() {
                    var name, index = i;

                    if (input.charAt(i) === '@' && (name = $(/^@[\w-]+/))) {
                        return new tree.Variable(name, index, env.filename);
                    }
                },

                //
                // A Hexadecimal color
                //
                //     #4F3C2F
                //
                // `rgb` and `hsl` colors are parsed through the `entities.call` parser.
                //
                color: function() {
                    var rgb;

                    if (input.charAt(i) === '#' && (rgb = $(/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})/))) {
                        return new tree.Color(rgb[1]);
                    } else {
                        rgb = chunks[j].match(/^[a-z]+/);
                        if (rgb && rgb[0] in tree.Reference.data.colors) {
                            return new tree.Color(tree.Reference.data.colors[$(/^[a-z]+/)]);
                        }
                    }
                },

                //
                // A Dimension, that is, a number and a unit
                //
                //     0.5em 95%
                //
                dimension: function() {
                    var value, c = input.charCodeAt(i);
                    if ((c > 57 || c < 45) || c === 47) return;

                    if (value = $(/^(-?\d*\.?\d+)(px|%|em|pc|ex|in|deg|s|ms|pt|cm|mm|rad|grad|turn)?/)) {
                        return new tree.Dimension(value[1], value[2], memo);
                    }
                },

                //
                // JavaScript code to be evaluated
                //
                //     `window.location.href`
                //
                javascript: function() {
                    var str;

                    if (input.charAt(i) !== '`') { return }

                    if (str = $(/^`([^`]*)`/)) {
                        return new tree.JavaScript(str[1], i);
                    }
                }
            },

            //
            // The variable part of a variable definition. Used in the `rule` parser
            //
            //     @fink:
            //
            variable: function() {
                var name;

                if (input.charAt(i) === '@' && (name = $(/^(@[\w-]+)\s*:/))) { return name[1] }
            },

            //
            // Mixins
            //
            mixin: {
                //
                // A Mixin call, with an optional argument list
                //
                //     #mixins > .square(#fff);
                //     .rounded(4px, black);
                //     .button;
                //
                // The `while` loop is there because mixins can be
                // namespaced, but we only support the child and descendant
                // selector for now.
                //
                call: function() {
                    var elements = [], e, c, args, index = i, s = input.charAt(i);

                    if (s !== '.' && s !== '#') { return }

                    while (e = $(/^[#.](?:[\w-]|\\(?:[a-fA-F0-9]{1,6} ?|[^a-fA-F0-9]))+/)) {
                        elements.push(new tree.Element(c, e));
                        c = $('>');
                    }
                    $('(') && (args = $(this.entities.arguments)) && $(')');

                    if (elements.length > 0 && ($(';') || peek('}'))) {
                        throw 'Calls are not yet supported';
                        return new tree.mixin.Call(elements, args, index);
                    }
                },

                //
                // A Mixin definition, with a list of parameters
                //
                //     .rounded (@radius: 2px, @color) {
                //        ...
                //     }
                //
                // Until we have a finer grained state-machine, we have to
                // do a look-ahead, to make sure we don't have a mixin call.
                // See the `rule` function for more information.
                //
                // We start by matching `.rounded (`, and then proceed on to
                // the argument list, which has optional default values.
                // We store the parameters in `params`, with a `value` key,
                // if there is a value, such as in the case of `@radius`.
                //
                // Once we've got our params list, and a closing `)`, we parse
                // the `{...}` block.
                //
                definition: function() {
                    var name, params = [], match, ruleset, param, value;

                    if ((input.charAt(i) !== '.' && input.charAt(i) !== '#') ||
                        peek(/^[^{]*(;|})/)) return;

                    if (match = $(/^([#.](?:[\w-]|\\(?:[a-fA-F0-9]{1,6} ?|[^a-fA-F0-9]))+)[\s,]*\(/)) {
                        name = match[1];

                        while (param = $(this.entities.variable) || $(this.entities.literal)
                                                                 || $(this.entities.keyword)) {
                            // Variable
                            if (param instanceof tree.Variable) {
                                if ($(':')) {
                                    if (value = $(this.expression)) {
                                        params.push({ name: param.name, value: value });
                                    } else {
                                        throw new Error('Expected value');
                                    }
                                } else {
                                    params.push({ name: param.name });
                                }
                            } else {
                                params.push({ value: param });
                            }
                            if (! $(',')) { break }
                        }
                        if (! $(')')) throw new Error('Expected )');

                        ruleset = $(this.block);

                        if (ruleset) {
                            throw 'Definitions should not exist here';
                            return new tree.mixin.Definition(name, params, ruleset);
                        }
                    }
                }
            },

            //
            // Entities are the smallest recognized token,
            // and can be found inside a rule's value.
            //
            entity: function() {
                return $(this.entities.literal) || $(this.entities.variable) || $(this.entities.url) ||
                       $(this.entities.call) || $(this.entities.keyword) || $(this.entities.javascript);
            },

            //
            // A Rule terminator. Note that we use `peek()` to check for '}',
            // because the `block` rule will be expecting it, but we still need to make sure
            // it's there, if ';' was ommitted.
            //
            end: function() {
                return $(';') || peek('}');
            },

            //
            // A Selector Element
            //
            //     div
            //     .classname
            //     #socks
            //     input[type="text"]
            //
            // Elements are the building blocks for Selectors. They consist of
            // an element name, such as a tag a class, or `*`.
            //
            element: function() {
                var e;
                if (e = $(/^(?:[.#]?[\w-]+|\*)/)) {
                    return new tree.Element(e);
                }
            },

            //
            // Attachments allow adding multiple lines, polygons etc. to an
            // object. There can only be one attachment per selector.
            //
            attachment: function() {
                var s;
                if (s = $(/^::([\w-]+(?:\/[\w-]+)*)/)) {
                    // There's no object for attachment names.
                    return s[1];
                }
            },

            //
            // A CSS Selector
            //
            //     .class > div + h1
            //     li a:hover
            //
            // Selectors are made out of one or more Elements, see above.
            //
            selector: function() {
                var a, attachment;
                var e, elements = [];
                var f, filters = new tree.Filterset();
                var z, zoom = tree.Zoom.all;
                var segments = 0, conditions = 0;

                while (
                        (e = $(this.element)) ||
                        (z = $(this.zoom)) ||
                        (f = $(this.filter)) ||
                        (a = $(this.attachment))
                    ) {
                    segments++;
                    if (e) {
                        elements.push(e);
                    } else if (z) {
                        zoom &= z;
                        conditions++;
                    } else if (f) {
                        filters.add(f);
                        conditions++;
                    } else if (attachment) {
                        throw errorMessage('Encountered second attachment name', i - 1);
                    } else {
                        attachment = a;
                    }

                    var c = input.charAt(i);
                    if (c === '{' || c === '}' || c === ';' || c === ',') { break }
                }

                if (segments) {
                    return new tree.Selector(filters, zoom, elements, attachment, conditions, memo);
                }
            },

            filter: function() {
                save();
                var key, op, val;
                if (! $('[')) return;
                if (key = $(/^[a-zA-Z0-9-_]+/) || $(this.entities.quoted)) {
                    if ((op = $(this.entities.comparison)) &&
                        (val = $(this.entities.quoted) || $(this.entities.variable) || $(/^[\w-\.]+/))) {
                        if (! $(']')) return;
                        return new tree.Filter(key, op, val, memo);
                    }
                }
            },

            zoom: function() {
                save();
                var op, val;
                if ($(/^\[zoom/g) &&
                    (op = $(this.entities.comparison)) &&
                    (val = $(/^\d+/)) &&
                    $(']')) {
                        return tree.Zoom(op, val, memo);
                }
            },

            //
            // The `block` rule is used by `ruleset` and `mixin.definition`.
            // It's a wrapper around the `primary` rule, with added `{}`.
            //
            block: function() {
                var content;

                if ($('{') && (content = $(this.primary)) && $('}')) {
                    return content;
                }
            },

            //
            // div, .class, body > p {...}
            //
            ruleset: function() {
                var selectors = [], s, f, l, rules, filters = [];
                save();

                while (s = $(this.selector)) {
                    selectors.push(s);
                    if (! $(',')) { break }
                }
                if (s) $(this.comment);

                if (selectors.length > 0 && (rules = $(this.block))) {
                    if (selectors.length === 1 &&
                        selectors[0].elements.length &&
                        selectors[0].elements[0].value === 'Map') {
                        var rs = new tree.Ruleset(selectors, rules);
                        rs.isMap = true;
                        return rs;
                    }
                    return new tree.Ruleset(selectors, rules);
                } else {
                    // Backtrack
                    restore();
                }
            },
            rule: function() {
                var name, value, c = input.charAt(i);
                save();

                if (c === '.' || c === '#' || c === '&') { return }

                if (name = $(this.variable) || $(this.property)) {
                    value = $(this.value);

                    if (value && $(this.end)) {
                        return new tree.Rule(name, value, memo, env.filename);
                    } else {
                        furthest = i;
                        restore();
                    }
                }
            },

            font: function() {
                var value = [], expression = [], weight, shorthand, font, e;

                while (e = $(this.shorthand) || $(this.entity)) {
                    expression.push(e);
                }
                value.push(new tree.Expression(expression));

                if ($(',')) {
                    while (e = $(this.expression)) {
                        value.push(e);
                        if (! $(',')) { break }
                    }
                }
                return new tree.Value(value);
            },

            //
            // A Value is a comma-delimited list of Expressions
            //
            //     font-family: Baskerville, Georgia, serif;
            //
            // In a Rule, a Value represents everything after the `:`,
            // and before the `;`.
            //
            value: function() {
                var e, expressions = [];

                while (e = $(this.expression)) {
                    expressions.push(e);
                    if (! $(',')) { break }
                }

                if (expressions.length > 0) {
                    return new tree.Value(expressions);
                }
            },
            sub: function() {
                var e;

                if ($('(') && (e = $(this.expression)) && $(')')) {
                    return e;
                }
            },
            multiplication: function() {
                var m, a, op, operation;
                if (m = $(this.operand)) {
                    while ((op = ($('/') || $('*'))) && (a = $(this.operand))) {
                        operation = new tree.Operation(op, [operation || m, a], memo);
                    }
                    return operation || m;
                }
            },
            addition: function() {
                var m, a, op, operation;
                if (m = $(this.multiplication)) {
                    while ((op = $(/^[-+]\s+/) || (input.charAt(i - 1) != ' ' && ($('+') || $('-')))) &&
                           (a = $(this.multiplication))) {
                        operation = new tree.Operation(op, [operation || m, a], memo);
                    }
                    return operation || m;
                }
            },

            //
            // An operand is anything that can be part of an operation,
            // such as a Color, or a Variable
            //
            operand: function() {
                return $(this.sub) || $(this.entities.dimension) ||
                       $(this.entities.color) || $(this.entities.variable) ||
                       $(this.entities.call);
            },

            //
            // Expressions either represent mathematical operations,
            // or white-space delimited Entities.
            //
            //     1px solid black
            //     @var * 2
            //
            expression: function() {
                var e, delim, entities = [], d;

                while (e = $(this.addition) || $(this.entity)) {
                    entities.push(e);
                }
                if (entities.length > 0) {
                    return new tree.Expression(entities);
                }
            },
            property: function() {
                var name;

                if (name = $(/^(\*?-?[-a-z_0-9]+)\s*:/)) {
                    return name[1];
                }
            }
        }
    };
};

if (typeof(process) === 'undefined') {
    //
    // Used by `@import` directives
    //
    carto.Parser.importer = function(path, paths, callback, env) {
        if (path.charAt(0) !== '/' && paths.length > 0) {
            path = paths[0] + path;
        }
        // We pass `true` as 3rd argument, to force the reload of the import.
        // This is so we can get the syntax tree as opposed to just the CSS output,
        // as we need this to evaluate the current stylesheet.
        loadStyleSheet({ href: path, title: path, type: env.mime }, callback, true);
    };
}
/**
 * TODO: document this. What does this do?
 */
require('carto/tree').find = function (obj, fun) {
    for (var i = 0, r; i < obj.length; i++) {
        if (r = fun.call(obj, obj[i])) { return r }
    }
    return null;
};
(function(tree) {

tree.Alpha = function Alpha(val) {
    this.value = val;
};
tree.Alpha.prototype = {
    toString: function() {
        return 'alpha(opacity=' +
               (this.value.toString ? this.value.toString() : this.value) + ')';
    },
    eval: function() { return this; }
};

})(require('carto/tree'));
(function(tree) {

tree.Anonymous = function Anonymous(string) {
    this.value = string.value || string;
};
tree.Anonymous.prototype = {
    toString: function() {
        return this.value;
    },
    eval: function() { return this; }
};

})(require('carto/tree'));
(function(tree) {

//
// A function call node.
//
tree.Call = function Call(name, args) {
    this.name = name;
    this.args = args;
};
tree.Call.prototype = {
    //
    // When evaluating a function call,
    // we either find the function in `tree.functions` [1],
    // in which case we call it, passing the  evaluated arguments,
    // or we simply print it out as it appeared originally [2].
    //
    // The *functions.js* file contains the built-in functions.
    //
    // The reason why we evaluate the arguments, is in the case where
    // we try to pass a variable to a function, like: `saturate(@color)`.
    // The function should receive the value, not the variable.
    //
    eval: function(env) {
        var args = this.args.map(function(a) { return a.eval(env); });

        for (var i = 0; i < args.length; i++) {
            if (args[i].is === 'undefined') {
                return {
                    is: 'undefined',
                    value: 'undefined'
                };
            }
        }

        if (this.name in tree.functions) { // 1.
            return tree.functions[this.name].apply(tree.functions, args);
        } else { // 2.
            return new tree.Anonymous(this.name +
                   '(' + args.map(function(a) { return a.toString(); }).join(', ') + ')');
        }
    },

    toString: function(env) {
        return this.eval(env).toString();
    }
};

})(require('carto/tree'));
(function(tree) {
//
// RGB Colors - #ff0014, #eee
//
tree.Color = function Color(rgb, a) {
    //
    // The end goal here, is to parse the arguments
    // into an integer triplet, such as `128, 255, 0`
    //
    // This facilitates operations and conversions.
    //
    if (Array.isArray(rgb)) {
        this.rgb = rgb;
    } else if (rgb.length == 6) {
        this.rgb = rgb.match(/.{2}/g).map(function(c) {
            return parseInt(c, 16);
        });
    } else {
        this.rgb = rgb.split('').map(function(c) {
            return parseInt(c + c, 16);
        });
    }
    this.is = 'color';
    this.alpha = typeof(a) === 'number' ? a : 1;
};
tree.Color.prototype = {
    eval: function() { return this; },

    //
    // If we have some transparency, the only way to represent it
    // is via `rgba`. Otherwise, we use the hex representation,
    // which has better compatibility with older browsers.
    // Values are capped between `0` and `255`, rounded and zero-padded.
    //
    toString: function() {
        if (this.alpha < 1.0) {
            return 'rgba(' + this.rgb.map(function(c) {
                return Math.round(c);
            }).concat(this.alpha).join(', ') + ')';
        } else {
            return '#' + this.rgb.map(function(i) {
                i = Math.round(i);
                i = (i > 255 ? 255 : (i < 0 ? 0 : i)).toString(16);
                return i.length === 1 ? '0' + i : i;
            }).join('');
        }
    },

    //
    // Operations have to be done per-channel, if not,
    // channels will spill onto each other. Once we have
    // our result, in the form of an integer triplet,
    // we create a new Color node to hold the result.
    //
    operate: function(op, other) {
        var result = [];

        if (! (other instanceof tree.Color)) {
            other = other.toColor();
        }

        for (var c = 0; c < 3; c++) {
            result[c] = tree.operate(op, this.rgb[c], other.rgb[c]);
        }
        return new tree.Color(result);
    },

    toHSL: function() {
        var r = this.rgb[0] / 255,
            g = this.rgb[1] / 255,
            b = this.rgb[2] / 255,
            a = this.alpha;

        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2, d = max - min;

        if (max === min) {
            h = s = 0;
        } else {
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return { h: h * 360, s: s, l: l, a: a };
    }
};


})(require('carto/tree'));
(function(tree) {

tree.Comment = function Comment(value, silent) {
    this.value = value;
    this.silent = !!silent;
};
tree.Comment.prototype = {
    toString: function(env) {
        return '<!--' + this.value + '-->';
    },
    eval: function() { return this; }
};

})(require('carto/tree'));
(function(tree) {
var assert = require('assert') || {
    ok: function() { }
};

tree.Definition = function Definition(selector, rules) {
    this.elements = selector.elements;
    assert.ok(selector.filters instanceof tree.Filterset);
    this.rules = rules;
    this.ruleIndex = [];
    for (var i = 0; i < this.rules.length; i++) {
        if ('zoom' in this.rules[i]) this.rules[i] = this.rules[i].clone();
        this.rules[i].zoom = selector.zoom;
        this.ruleIndex.push(this.rules[i].updateID());
    }
    this.filters = selector.filters;
    this.zoom = selector.zoom;
    this.attachment = selector.attachment || '__default__';
    this.specificity = selector.specificity();
};

tree.Definition.prototype.toString = function() {
    var str = this.filters.toString();
    for (var i = 0; i < this.rules.length; i++) {
        str += '\n    ' + this.rules[i];
    }
    return str;
};

tree.Definition.prototype.clone = function(filters) {
    assert.ok(filters instanceof tree.Filterset);
    var clone = Object.create(tree.Definition.prototype);
    clone.rules = this.rules.slice();
    clone.ruleIndex = this.ruleIndex.slice();
    clone.filters = filters;
    clone.attachment = this.attachment;
    return clone;
};

tree.Definition.prototype.addRules = function(rules) {
    var added = 0;

    // Add only unique rules.
    for (var i = 0; i < rules.length; i++) {
        if (this.ruleIndex.indexOf(rules[i].id) < 0) {
            this.rules.push(rules[i]);
            this.ruleIndex.push(rules[i].id);
            added++;
        }
    }

    return added;
};

/**
 * Determine whether this selector matches a given id
 * and array of classes, by determining whether
 * all elements it contains match.
 */
tree.Definition.prototype.appliesTo = function(id, classes) {
    for (var i = 0; i < this.elements.length; i++) {
        if (!this.elements[i].matches(id, classes)) {
            return false;
        }
    }
    return true;
};

tree.Definition.prototype.hasSymbolizer = function(symbolizer) {
    for (var i = 0; i < this.rules.length; i++) {
        if (this.rules[i].symbolizer === symbolizer) {
            return true;
        }
    }
    return false;
};

tree.Definition.prototype.symbolizersToXML = function(env, symbolizers, zoom) {
    var xml = '  <Rule>\n';
    xml += tree.Zoom.toXML(zoom).join('');
    xml += this.filters.toXML(env);

    for (var symbolizer in symbolizers) {
        attributes = symbolizers[symbolizer];
        if (fail = tree.Reference.requiredProperties(symbolizer, attributes)) {
            var rule = attributes[Object.keys(attributes).shift()];
            env.error({
                message: fail,
                index: rule.index,
                filename: rule.filename
            });
        }

        name = symbolizer.charAt(0).toUpperCase() +
               symbolizer.slice(1).replace(/\-./, function(str) {
                   return str[1].toUpperCase();
               }) + 'Symbolizer';

        xml += '    <' + name + ' ';
        for (var key in attributes) {
            xml += attributes[key].eval(env).toXML(env) + ' ';
        }
        xml += '/>\n';
    }
    xml += '  </Rule>\n';
    return xml;
};

tree.Definition.prototype.collectSymbolizers = function(zooms, i) {
    var symbolizers = {}, child;

    for (var j = i; j < this.rules.length; j++) {
        child = this.rules[j];
        if (zooms.current & child.zoom &&
           (!(child.symbolizer in symbolizers) ||
           (!(child.name in symbolizers[child.symbolizer])))) {
            zooms.current &= child.zoom;
            if (!(child.symbolizer in symbolizers)) {
                symbolizers[child.symbolizer] = {};
            }
            symbolizers[child.symbolizer][child.name] = child;
        }
    }

    if (Object.keys(symbolizers).length) {
        zooms.rule &= (zooms.available &= ~zooms.current);
        return symbolizers;
    }
};

tree.Definition.prototype.toXML = function(env, existing) {
    // The tree.Zoom.toString function ignores the holes in zoom ranges and outputs
    // scaledenominators that cover the whole range from the first to last bit set.
    // This algorithm can produces zoom ranges that may have holes. However,
    // when using the filter-mode="first", more specific zoom filters will always
    // end up before broader ranges. The filter-mode will pick those first before
    // resorting to the zoom range with the hole and stop processing further rules.
    var filter = this.filters.toString();
    if (!(filter in existing)) existing[filter] = tree.Zoom.all;

    var available = tree.Zoom.all, xml = '', zoom, symbolizers;
    var zooms = { available: tree.Zoom.all };
    for (var i = 0; i < this.rules.length && available; i++) {
        zooms.rule = this.rules[i].zoom;
        if (!(existing[filter] & zooms.rule)) continue;

        while (zooms.current = zooms.rule & available) {
            if (symbolizers = this.collectSymbolizers(zooms, i)) {
                if (!(existing[filter] & zooms.current)) continue;
                xml += this.symbolizersToXML(env, symbolizers, existing[filter] & zooms.current);
                existing[filter] &= ~zooms.current;
            }
        }
    }

    return xml;
};

})(require('carto/tree'));
(function(tree) {

//
// A number with a unit
//
tree.Dimension = function Dimension(value, unit, index) {
    this.value = parseFloat(value);
    this.unit = unit || null;
    this.is = 'float';
    this.index = index;
};

tree.Dimension.prototype = {
    eval: function (env) {
        if (this.unit && ['px', '%'].indexOf(this.unit) === -1) {
             env.error({
                message: "Invalid unit: '" + this.unit + "'",
                index: this.index
            });
        }

        return this;
    },
    toColor: function() {
        return new tree.Color([this.value, this.value, this.value]);
    },
    toString: function() {
        return this.value;
    },

    // In an operation between two Dimensions,
    // we default to the first Dimension's unit,
    // so `1px + 2em` will yield `3px`.
    // In the future, we could implement some unit
    // conversions such that `100cm + 10mm` would yield
    // `101cm`.
    operate: function(op, other) {
        return new tree.Dimension(tree.operate(op, this.value, other.value),
                  this.unit || other.unit);
    }
};

})(require('carto/tree'));
(function(tree) {

tree.Directive = function Directive(name, value) {
    this.name = name;
    if (Array.isArray(value)) {
        this.ruleset = new tree.Ruleset([], value);
    } else {
        this.value = value;
    }
};
tree.Directive.prototype = {
    toString: function(ctx, env) {
        if (this.ruleset) {
            this.ruleset.root = true;
            return this.name + ' {\n  ' +
                   this.ruleset.toString(ctx, env).trim().replace(/\n/g, '\n  ') +
                               '\n}\n';
        } else {
            return this.name + ' ' + this.value.toString() + ';\n';
        }
    },
    eval: function(env) {
        env.frames.unshift(this);
        this.ruleset = this.ruleset && this.ruleset.eval(env);
        env.frames.shift();
        return this;
    },
    variable: function(name) { return tree.Ruleset.prototype.variable.call(this.ruleset, name) },
    find: function() { return tree.Ruleset.prototype.find.apply(this.ruleset, arguments) },
    rulesets: function() { return tree.Ruleset.prototype.rulesets.apply(this.ruleset) }
};

})(require('carto/tree'));
(function(tree) {

// An element is an id or class selector
tree.Element = function Element(value) {
    this.value = value.trim();
};

// Determine the 'specificity matrix' of this
// specific selector
tree.Element.prototype.specificity = function() {
    return [
        (this.value[0] == '#') ? 1 : 0, // a
        (this.value[0] == '.') ? 1 : 0  // b
    ];
};

tree.Element.prototype.toString = function() {
    return this.value;
};

// Determine whether this element matches an id or classes.
// An element is a single id or class, or check whether the given
// array of classes contains this, or the id is equal to this.
//
// Takes a plain string for id and plain strings in the array of
// classes.
tree.Element.prototype.matches = function(id, classes) {
    return (classes.indexOf(this.value.replace(/^\./, '')) !== -1) ||
        (this.value.replace(/^#/, '') === id) ||
        (this.value === '*');
};

})(require('carto/tree'));
(function(tree) {

tree.Expression = function Expression(value) { this.value = value };
tree.Expression.prototype = {
    eval: function(env) {
        if (this.value.length > 1) {
            return new tree.Expression(this.value.map(function(e) {
                return e.eval(env);
            }));
        } else {
            return this.value[0].eval(env);
        }
    },
    toString: function(env) {
        return this.value.map(function(e) {
            return e.toString(env);
        }).join(' ');
    }
};

})(require('carto/tree'));
(function(tree) {

tree.Filter = function Filter(key, op, val, index) {
    if (key.is) {
        this.key = key.value;
        this._key = key;
    } else {
        this.key = key;
    }

    this.op = op;

    if (val.is) {
        this.val = val.value;
        this._val = val;
    } else {
        this.val = val;
    }

    if (op !== '=' && op !== '!=') {
        this.val = 1*this.val;
        if (isNaN(this.val)) {
            throw {
                message: 'Cannot use operator "' + op + '" with value ' + val,
                index: index
            };
        }
    }
    this.id = this.key + this.op + this.val;
};


// XML-safe versions of comparators
var opXML = {
    '<': '&lt;',
    '>': '&gt;',
    '=': '=',
    '!=': '!=',
    '<=': '&lt;=',
    '>=': '&gt;='
};

tree.Filter.prototype.toXML = function(env) {
    if (this.val.eval) this._val = this.val.eval(env);
    if (this._key) var key = this._key.toString(this._key.is == 'string');
    if (this._val) var val = this._val.toString(this._val.is == 'string');

    return '[' + (key || this.key) + '] ' + opXML[this.op] + ' ' + (val || this.val);
};

tree.Filter.prototype.toString = function() {
    return '[' + this.id + ']';
};

})(require('carto/tree'));
var tree = require('carto/tree');

tree.Filterset = function Filterset() {};

Object.defineProperty(tree.Filterset.prototype, 'toXML', {
    enumerable: false,
    value: function(env) {
        var filters = [];
        for (var id in this) {
            filters.push('(' + this[id].toXML(env).trim() + ')');
        }

        if (filters.length) {
            return '    <Filter>' + filters.join(' and ') + '</Filter>\n';
        } else {
            return '';
        }
    }
});

Object.defineProperty(tree.Filterset.prototype, 'toString', {
    enumerable: false,
    value: function() {
        var arr = [];
        for (var id in this) arr.push(this[id].id);
        arr.sort();
        return arr.join('\t');
    }
});

// Note: other has to be a tree.Filterset.
Object.defineProperty(tree.Filterset.prototype, 'cloneWith', {
    enumerable: false,
    value: function(other) {
        var additions;
        for (var id in other) {
            var status = this.addable(other[id]);
            if (status === false) {
                return false;
            }
            if (status === true) {
                // Adding the filter will override another value.
                if (!additions) additions = [];
                additions.push(other[id]);
            }
        }

        // Adding the other filters doesn't make this filterset invalid, but it
        // doesn't add anything to it either.
        if (!additions) return null;

        // We can successfully add all filters. Now clone the filterset and add the
        // new rules.
        var clone = new tree.Filterset();

        // We can add the rules that are already present without going through the
        // add function as a Filterset is always in it's simplest canonical form.
        for (var id in this)
            clone[id] = this[id];

        // Only add new filters that actually change the filter.
        while (id = additions.shift())
            clone.add(id);

        return clone;
    }
});

/**
 * Returns true when the new filter can be added, false otherwise.
 */
Object.defineProperty(tree.Filterset.prototype, 'addable', {
    enumerable: false,
    value: function(filter) {
        var key = filter.key, value = filter.val;

        switch (filter.op) {
            case '=':
                if (key + '=' in this) return (this[key + '='].val != value) ? false : null;
                if (key + '!=' + value in this) return false;
                if (key + '>' in this  && this[key + '>'].val >= value) return false;
                if (key + '<' in this  && this[key + '<'].val <= value) return false;
                if (key + '>=' in this && this[key + '>='].val > value) return false;
                if (key + '<=' in this && this[key + '<='].val < value) return false;
                return true;

            case '!=':
                if (key + '=' in this) return (this[key + '='].val == value) ? false : null;
                if (key + '!=' + value in this) return null;
                
                if (key + '>' in this  && this[key + '>'].val >= value) return null;
                if (key + '<' in this  && this[key + '<'].val <= value) return null;
                if (key + '>=' in this && this[key + '>='].val > value) return null;
                if (key + '<=' in this && this[key + '<='].val < value) return null;
                
                return true;

            case '>':
                if (key + '=' in this) return (this[key + '='].val <= value) ? false : null;
                if (key + '<' in this && this[key + '<'].val <= value) return false;
                if (key + '<=' in this && this[key + '<='].val <= value) return false;
                if (key + '>' in this && this[key + '>'].val >= value) return null;
                if (key + '>=' in this && this[key + '>='].val > value) return null;
                return true;

            case '>=':
                if (key + '=' in this) return (this[key + '='].val < value) ? false : null;
                if (key + '<' in this && this[key + '<'].val <= value) return false;
                if (key + '<=' in this && this[key + '<='].val < value) return false;
                if (key + '>' in this && this[key + '>'].val >= value) return null;
                if (key + '>=' in this && this[key + '>='].val >= value) return null;
                return true;

            case '<':
                if (key + '=' in this) return (this[key + '='].val >= value) ? false : null;
                if (key + '>' in this && this[key + '>'].val >= value) return false;
                if (key + '>=' in this && this[key + '>='].val >= value) return false;
                if (key + '<' in this && this[key + '<'].val <= value) return null;
                if (key + '<=' in this && this[key + '<='].val < value) return null;
                return true;

            case '<=':
                if (key + '=' in this) return (this[key + '='].val > value) ? false : null;
                if (key + '>' in this && this[key + '>'].val >= value) return false;
                if (key + '>=' in this && this[key + '>='].val > value) return false;
                if (key + '<' in this && this[key + '<'].val <= value) return null;
                if (key + '<=' in this && this[key + '<='].val <= value) return null;
                return true;
        }
    }
});

/**
 * Only call this function for filters that have been cleared by .addable().
 */
Object.defineProperty(tree.Filterset.prototype, 'add', {
    enumerable: false,
    value: function(filter) {
        var key = filter.key;

        switch (filter.op) {
            case '=':
                for (var id in this)
                    if (this[id].key == key)
                        delete this[id];
                this[key + '='] = filter;
                break;

            case '!=':
                this[key + '!=' + filter.val] = filter;
                break;

            case '>':
                for (var id in this)
                    if (this[id].key == key && this[id].val <= filter.val)
                        delete this[id];
                this[key + '>'] = filter;
                break;

            case '>=':
                for (var id in this)
                    if (this[id].key == key && this[id].val < filter.val)
                        delete this[id];
                if (key + '!=' + filter.val in this) {
                    delete this[key + '!=' + filter.val];
                    filter.op = '>';
                    this[key + '>'] = filter;
                }
                else {
                    this[key + '>='] = filter;
                }
                break;

            case '<':
                for (var id in this)
                    if (this[id].key == key && this[id].val >= filter.val)
                        delete this[id];
                this[key + '<'] = filter;
                break;

            case '<=':
                for (var id in this)
                    if (this[id].key == key && this[id].val > filter.val)
                        delete this[id];
                if (key + '!=' + filter.val in this) {
                    delete this[key + '!=' + filter.val];
                    filter.op = '<';
                    this[key + '<'] = filter;
                }
                else {
                    this[key + '<='] = filter;
                }
                break;
        }
    }
});
(function(tree) {

tree._getFontSet = function(env, fonts) {
    var find_existing = function(fonts) {
        var findFonts = fonts.join('');
        for (var i = 0; i < env.effects.length; i++) {
            if (findFonts == env.effects[0].fonts.join('')) {
                return env.effects[0];
            }
        }
    };

    var existing = false;
    if (existing = find_existing(fonts)) {
        return existing;
    } else {
        var new_fontset = new tree.FontSet(env, fonts);
        env.effects.push(new_fontset);
        return new_fontset;
    }
};

tree.FontSet = function FontSet(env, fonts) {
    this.fonts = fonts;
    this.name = 'fontset-' + env.effects.length;
};

tree.FontSet.prototype.toXML = function(env) {
    return '<FontSet name="'
        + this.name
        + '">\n'
        + this.fonts.map(function(f) {
            return '  <Font face-name="' + f +'"/>';
        }).join('\n')
        + '\n</FontSet>'
};

})(require('carto/tree'));
(function(tree) {
//
// CSS @import node
//
// The general strategy here is that we don't want to wait
// for the parsing to be completed, before we start importing
// the file. That's because in the context of a browser,
// most of the time will be spent waiting for the server to respond.
//
// On creation, we push the import path to our import queue, though
// `import,push`, we also pass it a callback, which it'll call once
// the file has been fetched, and parsed.
//
tree.Import = function Import(path, imports) {
    var that = this;

    this._path = path;

    // The '.mess' extension is optional
    if (path instanceof tree.Quoted) {
        this.path = /\.(le?|c)ss$/.test(path.value) ? path.value : path.value + '.mess';
    } else {
        this.path = path.value.value || path.value;
    }

    this.css = /css$/.test(this.path);

    // Only pre-compile .mess files
    if (! this.css) {
        imports.push(this.path, function(root) {
            if (! root) {
                throw new Error('Error parsing ' + that.path);
            }
            that.root = root;
        });
    }
};

//
// The actual import node doesn't return anything, when converted to CSS.
// The reason is that it's used at the evaluation stage, so that the rules
// it imports can be treated like any other rules.
//
// In `eval`, we make sure all Import nodes get evaluated, recursively, so
// we end up with a flat structure, which can easily be imported in the parent
// ruleset.
//
tree.Import.prototype = {
    toString: function() {
        if (this.css) {
            return '@import ' + this._path.toString() + ';\n';
        } else {
            return '';
        }
    },
    eval: function(env) {
        var ruleset;

        if (this.css) {
            return this;
        } else {
            ruleset = new tree.Ruleset(null, this.root.rules.slice(0));

            for (var i = 0; i < ruleset.rules.length; i++) {
                if (ruleset.rules[i] instanceof tree.Import) {
                    Array.prototype
                         .splice
                         .apply(ruleset.rules,
                                [i, 1].concat(ruleset.rules[i].eval(env)));
                }
            }
            return ruleset.rules;
        }
    }
};

})(require('carto/tree'));
(function (tree) {
tree.Invalid = function Invalid(chunk, index, message) {
    this.chunk = chunk;
    this.index = index;
    this.type = 'syntax';
    this.message = message || "Invalid code: " + this.chunk;
};
})(require('carto/tree'));
(function(tree) {

tree.JavaScript = function JavaScript(string, index) {
    this.expression = string;
    this.index = index;
};
tree.JavaScript.prototype = {
    toString: function() {
        return JSON.stringify(this.evaluated);
    },
    eval: function(env) {
        var result,
            expression = new Function('return (' + this.expression + ')'),
            context = {};

        for (var k in env.frames[0].variables()) {
            context[k.slice(1)] = {
                value: env.frames[0].variables()[k].value,
                toJS: function() {
                    return this.value.eval(env).toString();
                }
            };
        }

        try {
            this.evaluated = expression.call(context);
        } catch (e) {
            throw {
                message: "JavaScript evaluation error: '" + e.name + ': ' + e.message + "'" ,
                index: this.index
            };
        }
        return this;
    }
};

})(require('carto/tree'));

(function(tree) {

tree.Keyword = function Keyword(value) {
    this.value = value;
    var special = {
        'transparent': 'color',
        'true': 'boolean',
        'false': 'boolean'
    };
    this.is = special[value] ? special[value] : 'keyword';
};
tree.Keyword.prototype = {
    eval: function() { return this },
    toString: function() { return this.value }
};

})(require('carto/tree'));
(function(tree) {

tree.Layer = function Layer(obj) {
    this.name = obj.name;
    this.styles = obj.styles;
    this.srs = obj.srs;
    this.datasource = obj.Datasource;
};

tree.Layer.prototype.toXML = function() {
    var dsoptions = [];
    for (var i in this.datasource) {
        dsoptions.push('<Parameter name="' + i + '"><![CDATA[' +
            this.datasource[i] + ']]></Parameter>');
    }
    return '<Layer\n   ' +
        '   name="' + this.name + '"\n' +
        '   srs="' + this.srs + '">\n    ' +
        this.styles.reverse().map(function(s) {
            return '<StyleName>' + s + '</StyleName>';
        }).join('\n    ') +
        '\n    <Datasource>\n       ' +
        dsoptions.join('\n       ') +
        '\n    </Datasource>\n' +
        '  </Layer>\n';
};

})(require('carto/tree'));
(function(tree) {

tree.mixin = {};
tree.mixin.Call = function Call(elements, args, index) {
    this.selector = new tree.Selector(null, null, elements);
    this.arguments = args;
    this.index = index;
};
tree.mixin.Call.prototype = {
    eval: function(env) {
        var mixins, rules = [], match = false;

        for (var i = 0; i < env.frames.length; i++) {
            if ((mixins = env.frames[i].find(this.selector)).length > 0) {
                for (var m = 0; m < mixins.length; m++) {
                    if (mixins[m].match(this.arguments, env)) {
                        try {
                            Array.prototype.push.apply(
                                  rules, mixins[m].eval(env, this.arguments).rules);
                            match = true;
                        } catch (e) {
                            throw { message: e.message, index: e.index, stack: e.stack, call: this.index };
                        }
                    }
                }
                if (match) {
                    return rules;
                } else {
                    throw { message: 'No matching definition was found for `' +
                                      this.selector.toString().trim() + '(' +
                                      this.arguments.map(function(a) {
                                          return a.toString();
                                      }).join(', ') + ')`',
                            index: this.index };
                }
            }
        }
        throw { message: this.selector.toString().trim() + ' is undefined',
                index: this.index };
    }
};

tree.mixin.Definition = function Definition(name, params, rules) {
    this.name = name;
    this.selectors = [new tree.Selector(null, null, [new tree.Element(null, name)])];
    this.params = params;
    this.arity = params.length;
    this.rules = rules;
    this._lookups = {};
    this.required = params.reduce(function(count, p) {
        if (p.name && !p.value) { return count + 1 }
        else { return count }
    }, 0);
    this.parent = tree.Ruleset.prototype;
    this.frames = [];
};
tree.mixin.Definition.prototype = {
    toString: function() { return '' },
    variable: function(name) { return this.parent.variable.call(this, name) },
    variables: function()     { return this.parent.variables.call(this) },
    find: function()     { return this.parent.find.apply(this, arguments) },
    rulesets: function()     { return this.parent.rulesets.apply(this) },

    eval: function(env, args) {
        var frame = new tree.Ruleset(null, []), context;

        for (var i = 0, val; i < this.params.length; i++) {
            if (this.params[i].name) {
                if (val = (args && args[i]) || this.params[i].value) {
                    frame.rules.unshift(new tree.Rule(this.params[i].name, val.eval(env)));
                } else {
                    throw { message: 'wrong number of arguments for ' + this.name +
                            ' (' + args.length + ' for ' + this.arity + ')' };
                }
            }
        }
        return new tree.Ruleset(null, this.rules.slice(0)).eval({
            frames: [this, frame].concat(this.frames, env.frames)
        });
    },
    match: function(args, env) {
        var argsLength = (args && args.length) || 0, len;

        if (argsLength < this.required) { return false }

        len = Math.min(argsLength, this.arity);

        for (var i = 0; i < len; i++) {
            if (!this.params[i].name) {
                if (args[i].eval(env).toString() != this.params[i].value.eval(env).toString()) {
                    return false;
                }
            }
        }
        return true;
    }
};

})(require('carto/tree'));
(function(tree) {


tree.Operation = function Operation(op, operands, index) {
    this.op = op.trim();
    this.operands = operands;
    this.index = index;
};
tree.Operation.prototype.eval = function(env) {
    var a = this.operands[0].eval(env),
        b = this.operands[1].eval(env),
        temp;

    if (a.is === 'undefined' || b.is === 'undefined') {
        return {
            is: 'undefined',
            value: 'undefined'
        };
    }

    if (a instanceof tree.Dimension && b instanceof tree.Color) {
        if (this.op === '*' || this.op === '+') {
            temp = b, b = a, a = temp;
        } else {
            throw {
                name: "OperationError",
                message: "Can't substract or divide a color from a number",
                index: this.index
            };
        }
    }
    return a.operate(this.op, b);
};

tree.operate = function(op, a, b) {
    switch (op) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return a / b;
    }
};

})(require('carto/tree'));
(function(tree) {

tree.Quoted = function Quoted(str, content) {
    this.value = content || '';
    this.quote = str.charAt(0);
    this.is = 'string';
};
tree.Quoted.prototype = {
    toString: function(quotes) {
        return (quotes === true) ? "'" + this.value + "'" : this.value;
    },
    eval: function() {
        return this;
    }
};

})(require('carto/tree'));
(function(tree) {

if (!window) {
    var fs = require('fs');
}

tree.Reference = {
    data: (!window) && JSON.parse(fs.readFileSync(__dirname + '/reference.json'))
};

tree.Reference.required_prop_list_cache = {};

tree.Reference.selectors = tree.Reference.selectors || (function() {
    var list = [];
    for (var i in tree.Reference.data.symbolizers) {
        for (var j in tree.Reference.data.symbolizers[i]) {
            if (tree.Reference.data.symbolizers[i][j].hasOwnProperty('css')) {
                list.push(tree.Reference.data.symbolizers[i][j].css);
            }
        }
    }
    return list;
})();

tree.Reference.validSelector = function(selector) {
    return tree.Reference.selectors.indexOf(selector) !== -1;
};

tree.Reference.selectorName = function(selector) {
    for (var i in tree.Reference.data.symbolizers) {
        for (var j in tree.Reference.data.symbolizers[i]) {
            if (selector == tree.Reference.data.symbolizers[i][j].css) {
                return j;
            }
        }
    }
};

tree.Reference.selector = function(selector) {
    for (var i in tree.Reference.data.symbolizers) {
        for (var j in tree.Reference.data.symbolizers[i]) {
            if (selector == tree.Reference.data.symbolizers[i][j].css) {
                return tree.Reference.data.symbolizers[i][j];
            }
        }
    }
};

tree.Reference.symbolizer = function(selector) {
    for (var i in tree.Reference.data.symbolizers) {
        for (var j in tree.Reference.data.symbolizers[i]) {
            if (selector == tree.Reference.data.symbolizers[i][j].css) {
                return i;
            }
        }
    }
};

tree.Reference.requiredPropertyList = function(symbolizer_name) {
    if (this.required_prop_list_cache[symbolizer_name]) {
        return this.required_prop_list_cache[symbolizer_name];
    }
    var properties = [];
    for (var j in tree.Reference.data.symbolizers[symbolizer_name]) {
        if (tree.Reference.data.symbolizers[symbolizer_name][j].required) {
            properties.push(tree.Reference.data.symbolizers[symbolizer_name][j].css);
        }
    }
    return this.required_prop_list_cache[symbolizer_name] = properties;
};

tree.Reference.requiredProperties = function(symbolizer_name, rules) {
    var req = tree.Reference.requiredPropertyList(symbolizer_name);
    for (i in req) {
        if (!(req[i] in rules)) {
            return 'Property ' + req[i] + ' required for defining '
                + symbolizer_name + ' styles.';
        }
    }
};

/**
 * TODO: finish implementation - this is dead code
 */
tree.Reference._validateValue = {
    'font': function(env, value) {
        if (env.validation_data && env.validation_data.fonts) {
            return env.validation_data.fonts.indexOf(value) != -1;
        } else {
            return true;
        }
    }
};

tree.Reference.isFont = function(selector) {
    return tree.Reference.selector(selector).validate == 'font';
}

tree.Reference.validValue = function(env, selector, value) {
    if (value[0]) {
        return tree.Reference.selector(selector).type == value[0].is;
    } else {
        // TODO: handle in reusable way
        if (value.value[0].is == 'keyword') {
            return tree.Reference
                .selector(selector).type
                .indexOf(value.value[0].value) !== -1;
        } else if (value.value[0].is == 'undefined') {
            // caught earlier in the chain - ignore here so that
            // error is not overridden
            return true;
        } else if (tree.Reference.selector(selector).type == 'numbers') {
            for (i in value.value) {
                if (value.value[i].is !== 'float') {
                    return false;
                }
            }
            return true;
        } else {
            if (tree.Reference.selector(selector).validate) {
                var valid = false;
                for (var i = 0; i < value.value.length; i++) {
                    if (tree.Reference.selector(selector).type == value.value[i].is &&
                        tree.Reference
                            ._validateValue
                                [tree.Reference.selector(selector).validate]
                                (env, value.value[i].value)) {
                        return true;
                    }
                }
                return valid;
            } else {
                return tree.Reference.selector(selector).type == value.value[0].is;
            }
        }
    }
}

})(require('carto/tree'));
(function(tree) {
tree.Rule = function Rule(name, value, index, filename) {
    this.name = name;
    this.value = (value instanceof tree.Value) ?
        value : new tree.Value([value]);
    this.index = index;
    this.symbolizer = tree.Reference.symbolizer(this.name);
    this.filename = filename;
    this.variable = (name.charAt(0) === '@');
};

tree.Rule.prototype.clone = function() {
    var clone = Object.create(tree.Rule.prototype);
    clone.name = this.name
    clone.value = this.value;
    clone.index = this.index;
    clone.symbolizer = this.symbolizer;
    clone.filename = this.filename;
    clone.variable = this.variable;
    return clone;
};

tree.Rule.prototype.updateID = function() {
    return this.id = this.zoom + '#' + this.name;
};

tree.Rule.prototype.toString = function() {
    return '[' + tree.Zoom.toString(this.zoom) + '] ' + this.name + ': ' + this.value;
};

tree.Rule.prototype.toXML = function(env) {
    if (!tree.Reference.validSelector(this.name)) {
        return env.error({
            message: "Unrecognized rule: " + this.name,
            index: this.index,
            type: 'syntax',
            filename: this.filename
        });
    }

    if ((this.value instanceof tree.Value) &&
        !tree.Reference.validValue(env, this.name, this.value)) {
        return env.error({
            message: 'Invalid value for ' +
                this.name +
                ', a valid ' +
                (tree.Reference.selector(this.name).validate ||
                    tree.Reference.selector(this.name).type) +
                ' is expected. ' + this.value + 
                ' was given.',
            index: this.index,
            type: 'syntax',
            filename: this.filename
        });
    }

    if (this.variable) {
        return '';
    } else if (tree.Reference.isFont(this.name) && this.value.value.length > 1) {
        var f = tree._getFontSet(env, this.value.value);
        return 'fontset-name="' + f.name + '"';
    } else {
        return tree.Reference.selectorName(this.name) +
            '="' +
            this.value.toString(env, this.name) +
            '"';
    }
};

/**
 * TODO: Rule eval chain should add fontsets to env.frames
 */
tree.Rule.prototype.eval = function(context) {
    return new tree.Rule(this.name,
        this.value.eval(context),
        this.index,
        this.filename);
};

tree.Shorthand = function Shorthand(a, b) {
    this.a = a;
    this.b = b;
};

tree.Shorthand.prototype = {
    toString: function(env) {
        return this.a.toString(env) + '/' + this.b.toString(env);
    },
    eval: function() { return this }
};

})(require('carto/tree'));
(function(tree) {

tree.Ruleset = function Ruleset(selectors, rules) {
    this.selectors = selectors;
    this.rules = rules;
    // static cache of find() function
    this._lookups = {};
};
tree.Ruleset.prototype = {
    eval: function(env) {
        var ruleset = new tree.Ruleset(this.selectors, this.rules.slice(0));
        ruleset.root = this.root;

        // push the current ruleset to the frames stack
        env.frames.unshift(ruleset);

        // Evaluate imports
        if (ruleset.root) {
            for (var i = 0; i < ruleset.rules.length; i++) {
                if (ruleset.rules[i] instanceof tree.Import) {
                    Array.prototype.splice
                         .apply(ruleset.rules, [i, 1].concat(ruleset.rules[i].eval(env)));
                }
            }
        }

        // Store the frames around mixin definitions,
        // so they can be evaluated like closures when the time comes.
        for (var i = 0; i < ruleset.rules.length; i++) {
            if (ruleset.rules[i] instanceof tree.mixin.Definition) {
                ruleset.rules[i].frames = env.frames.slice(0);
            }
        }

        // Evaluate mixin calls.
        for (var i = 0; i < ruleset.rules.length; i++) {
            if (ruleset.rules[i] instanceof tree.mixin.Call) {
                Array.prototype.splice
                     .apply(ruleset.rules, [i, 1].concat(ruleset.rules[i].eval(env)));
            }
        }

        // Evaluate everything else
        for (var i = 0, rule; i < ruleset.rules.length; i++) {
            rule = ruleset.rules[i];

            if (! (rule instanceof tree.mixin.Definition)) {
                ruleset.rules[i] = rule.eval ? rule.eval(env) : rule;
            }
        }

        // Pop the stack
        env.frames.shift();

        return ruleset;
    },
    match: function(args) {
        return !args || args.length === 0;
    },
    variables: function() {
        if (this._variables) { return this._variables }
        else {
            return this._variables = this.rules.reduce(function(hash, r) {
                if (r instanceof tree.Rule && r.variable === true) {
                    hash[r.name] = r;
                }
                return hash;
            }, {});
        }
    },
    variable: function(name) {
        return this.variables()[name];
    },
    /**
     * Extend this rule by adding rules from another ruleset
     *
     * Currently this is designed to accept less specific
     * rules and add their values only if this ruleset doesn't
     * contain them.
     */

    rulesets: function() {
        if (this._rulesets) { return this._rulesets }
        else {
            return this._rulesets = this.rules.filter(function(r) {
                return (r instanceof tree.Ruleset) || (r instanceof tree.mixin.Definition);
            });
        }
    },
    find: function(selector, self) {
        self = self || this;
        var rules = [], rule, match,
            key = selector.toString();

        if (key in this._lookups) { return this._lookups[key] }

        this.rulesets().forEach(function(rule) {
            if (rule !== self) {
                for (var j = 0; j < rule.selectors.length; j++) {
                    if (match = selector.match(rule.selectors[j])) {
                        if (selector.elements.length > 1) {
                            Array.prototype.push.apply(rules, rule.find(
                                new tree.Selector(null, null, selector.elements.slice(1)), self));
                        } else {
                            rules.push(rule);
                        }
                        break;
                    }
                }
            }
        });
        return this._lookups[key] = rules;
    },
    flatten: function(result, parents, env) {
        var selectors = [];
        if (this.selectors.length == 0) {
            env.frames = env.frames.concat(this.rules);
        }
        for (var i = 0; i < this.selectors.length; i++) {
            var child = this.selectors[i];

            // This is an invalid filterset.
            if (!child.filters) continue;

            if (parents.length) {
                for (var j = 0; j < parents.length; j++) {
                    var parent = parents[j];

                    var mergedFilters = parent.filters.cloneWith(child.filters);
                    if (mergedFilters === null) {
                        // Filters could be added, but they didn't change the
                        // filters. This means that we only have to clone when
                        // the zoom levels or the attachment is different too.
                        if (parent.zoom === parent.zoom & child.zoom &&
                            parent.attachment === child.attachment) {
                            continue;
                        } else {
                            mergedFilters = parent.filters;
                        }
                    } else if (!mergedFilters) {
                        // The merged filters are invalid, that means we don't
                        // have to clone.
                        continue;
                    }

                    var clone = Object.create(tree.Selector.prototype);
                    clone.filters = mergedFilters;
                    clone.zoom = parent.zoom & child.zoom;
                    clone.elements = parent.elements.concat(child.elements);
                    if (parent.attachment && child.attachment) {
                        clone.attachment = parent.attachment + '/' + child.attachment;
                    }
                    else clone.attachment = child.attachment || parent.attachment;
                    clone.conditions = parent.conditions + child.conditions;
                    clone.index = child.index;
                    selectors.push(clone);
                }
            }
            else {
                selectors.push(child);
            }
        }

        var rules = [];
        for (var i = 0; i < this.rules.length; i++) {
            var rule = this.rules[i];

            if (rule instanceof tree.Ruleset) {
                rule.flatten(result, selectors, env);
            } else if (rule instanceof tree.Rule) {
                rules.push(rule);
            } else if (rule instanceof tree.Invalid) {
                env.errors.push(rule);
            }
        }

        var index = rules.length ? rules[0].index : false;
        for (var i = 0; i < selectors.length; i++) {
            // For specificity sort, use the position of the first rule to allow
            // defining attachments that are under current element as a descendant
            // selector.
            if (index !== false) {
                selectors[i].index = index;
            }
            result.push(new tree.Definition(selectors[i], rules.slice()));
        }

        return result;
    }
};
})(require('carto/tree'));
var assert = require('assert');

(function(tree) {

tree.Selector = function Selector(filters, zoom, elements, attachment, conditions, index) {
    this.elements = elements || [];
    this.attachment = attachment;
    this.filters = filters || {};
    this.zoom = typeof zoom !== 'undefined' ? zoom : tree.Zoom.all;
    this.conditions = conditions;
    this.index = index;
};

/**
 * Determine the specificity of this selector
 * based on the specificity of its elements - calling
 * Element.specificity() in order to do so
 *
 * [ID, Class, Filters, Position in document]
 */
tree.Selector.prototype.specificity = function() {
    return this.elements.reduce(function(memo, e) {
        var spec = e.specificity();
        memo[0] += spec[0];
        memo[1] += spec[1];
        return memo;
    }, [0, 0, this.conditions, this.index]);
};

})(require('carto/tree'));
(function(tree) {

tree.Style = function Style(name, attachment, definitions) {
    this.attachment = attachment;
    this.definitions = definitions;
    this.name = name + (attachment !== '__default__' ? '-' + attachment : '');
};

tree.Style.prototype.toXML = function(env) {
    var existing = {};
    var rules = this.definitions.map(function(definition) {
        return definition.toXML(env, existing);
    });

    return '<Style name="' + this.name + '" filter-mode="first">\n' + rules.join('') + '</Style>';
};

})(require('carto/tree'));
(function(tree) {

tree.URL = function URL(val, paths) {
    if (val.data) {
        this.attrs = val;
    } else {
        // Add the base path if the URL is relative and we are in the browser
        if (!/^(?:https?:\/|file:\/)?\//.test(val.value) && paths.length > 0 && typeof(process) === 'undefined') {
            val.value = paths[0] + (val.value.charAt(0) === '/' ? val.value.slice(1) : val.value);
        }
        this.value = val;
        this.paths = paths;
        this.is = 'uri';
    }
};
tree.URL.prototype = {
    toString: function() {
        return this.value.toString();
    },
    eval: function(ctx) {
        if (/^https?:/.test(this.value.toString())) {
            var crypto = require('crypto'),
                path = require('path');
            var uri = this.value.toString();
            var eventual_location = path.join(
                ctx.data_dir,
                crypto.createHash('md5').update(uri).digest('hex') + path.extname(uri));
            ctx.deferred_externals.push(this.value.toString());
            return this.attrs ? this : new tree.URL(eventual_location, this.paths);
        } else {
            return this.attrs ? this : new tree.URL(this.value.eval(ctx), this.paths);
        }
    }
};

})(require('carto/tree'));
(function(tree) {

tree.Value = function Value(value) {
    this.value = value;
    this.is = 'value';
};
tree.Value.prototype = {
    eval: function(env) {
        if (this.value.length === 1) {
            return this.value[0].eval(env);
        } else {
            return new tree.Value(this.value.map(function(v) {
                return v.eval(env);
            }));
        }
    },
    toString: function(env, selector) {
        return this.value.map(function(e) {
            return e.toString(env);
        }).join(', ');
    },
    clone: function() {
        var obj = Object.create(tree.Value.prototype);
        if (Array.isArray(obj)) obj.value = this.value.slice();
        else obj.value = this.value;
        obj.is = this.is;
        return obj;
    }
};

})(require('carto/tree'));
(function(tree) {

tree.Variable = function Variable(name, index, filename) {
    this.name = name;
    this.index = index;
    this.filename = filename;
};
tree.Variable.prototype = {
    eval: function(env) {
        var variable,
            v,
            that = this;
            name = this.name;

        if (this._css) return this._css;

        var thisframe = env.frames.filter(function(f) {
            return f.name == this.name;
        });
        if (thisframe.length) {
            return thisframe[0].value.eval(env);
        } else {
            env.error({
                message: 'variable ' + this.name + ' is undefined',
                index: this.index,
                type: 'runtime',
                filename: this.filename,
            });
            return {
                is: 'undefined',
                value: 'undefined'
            };
        }
    }
};

})(require('carto/tree'));
var tree = require('carto/tree');

// Storage for zoom ranges. Only supports continuous ranges,
// and stores them as bit-sequences so that they can be combined,
// inverted, and compared quickly.
tree.Zoom = function(op, value, index) {
    value = parseInt(value);
    if (value > tree.Zoom.maxZoom || value < 0) {
        throw {
            message: 'Only zoom levels between 0 and '
                + tree.Zoom.maxZoom + ' supported.',
            index: index
        };
    }

    var start = 0, end = Infinity, zoom = 0;
    switch (op) {
        case '=': return 1 << value; break;
        case '>': start = value + 1; break;
        case '>=': start = value; break;
        case '<': end = value - 1; break;
        case '<=': end = value; break;
    }
    for (var i = 0; i <= tree.Zoom.maxZoom; i++) {
        if (i >= start && i <= end) {
            zoom |= (1 << i);
        }
    }
    return zoom;
};

// Covers all zoomlevels from 0 to 22
tree.Zoom.all = 0x7FFFFF;

tree.Zoom.maxZoom = 22;

tree.Zoom.ranges = {
     0: 1000000000,
     1: 500000000,
     2: 200000000,
     3: 100000000,
     4: 50000000,
     5: 25000000,
     6: 12500000,
     7: 6500000,
     8: 3000000,
     9: 1500000,
    10: 750000,
    11: 400000,
    12: 200000,
    13: 100000,
    14: 50000,
    15: 25000,
    16: 12500,
    17: 5000,
    18: 2500,
    19: 1000,
    20: 500,
    21: 250,
    22: 100,
    23: 50
};

// Only works for single range zooms. `[XXX....XXXXX.........]` is invalid.
tree.Zoom.toXML = function(zoom) {
    var conditions = [];
    if (zoom != tree.Zoom.all) {
        var start = null, end = null;
        for (var i = 0; i <= tree.Zoom.maxZoom; i++) {
            if (zoom & (1 << i)) {
                if (start == null) start = i;
                end = i;
            }
        }
        if (start > 0) conditions.push('    <MaxScaleDenominator>'
            + tree.Zoom.ranges[start] + '</MaxScaleDenominator>\n');
        if (end < 22) conditions.push('    <MinScaleDenominator>'
            + tree.Zoom.ranges[end + 1] + '</MinScaleDenominator>\n');
    }
    return conditions;
};


tree.Zoom.toString = function(zoom) {
    var str = '';
    for (var i = 0; i <= tree.Zoom.maxZoom; i++) {
        str += (zoom & (1 << i)) ? 'X' : '.';
    }
    return str;
};

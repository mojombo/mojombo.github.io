/*

 jQuery Watch Plugin

 @author Darcy Clarke
 @version 2.0

 Copyright (c) 2012 Darcy Clarke
 Dual licensed under the MIT and GPL licenses.

 ADDS: 

 - $.watch()

 USES:

 - DOMAttrModified event

 FALLBACKS:

 - propertychange event
 - setTimeout() with delay 

 EXAMPLE:

 $('div').watch('width height', function(){
 console.log(this.style.width, this.style.height);
 });

 $('div').animate({width:'100px',height:'200px'}, 500);

*/
(function(d){"function"===typeof define&&define.amd&&define.amd.jQuery?define(["jquery"],d):d(jQuery)})(function(d){d.extend(d.fn,{watch:function(b,c,a){var f=document.createElement("div"),j=function(a,b){var a="on"+a,c=a in b;c||(b.setAttribute(a,"return;"),c=typeof b[a]=="function");"onpropertychange"==a&&d.browser.msie&&d.browser.version>=9&&(c=!1);return c};typeof c=="function"&&(a=c,c={});typeof a!="function"&&(a=function(){});c=d.extend({},{throttle:10},c);return this.each(function(){var g=
d(this),i=function(){for(var a=g.data(),b=!1,c,f=0;f<a.props.length;f++)if(c=g.css(a.props[f]),a.vals[f]!=c){a.vals[f]=c;b=!0;break}b&&a.cb&&a.cb.call(g,a)},h={props:b.split(","),cb:a,vals:[]};d.each(h.props,function(a){h.vals[a]=g.css(h.props[a])});g.data(h);if(j("DOMAttrModified",f))g.on("DOMAttrModified",a);else if(j("propertychange",f))g.on("propertychange",a);else setInterval(i,c.throttle)})}})});
;(function(){if(!("undefined"==typeof Muse||"undefined"==typeof Muse.assets)){var a=function(a,b){for(var c=0,d=a.length;c<d;c++)if(a[c]==b)return c;return-1}(Muse.assets.required,"jquery.watch.js");if(-1!=a){Muse.assets.required.splice(a,1);for(var a=document.getElementsByTagName("meta"),b=0,c=a.length;b<c;b++){var d=a[b];if("generator"==d.getAttribute("name")){"2018.0.0.379"!=d.getAttribute("content")&&Muse.assets.outOfDate.push("jquery.watch.js");break}}}}})();

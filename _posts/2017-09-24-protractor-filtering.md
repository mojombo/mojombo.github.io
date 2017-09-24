---
layout: post
title: Filtering in Protractor
---

{{ page.title }}
================

<p class="meta">24 Sep 2017</p>

As described in the docs for `filter` it returns an instance of `ElementArrayFinder`. 
When you call a `then` method on instance of `ElementArrayFinder`, it resolves to an array of `ElementFinders`,
so in the callback for `then` you receive a pure JavaScript Array of `ElementFinder`s. 
To iterate it you can use native JavaScrupt `forEach`:

``` javascript
checkbox_list.filter(function(elem, index) {
    // ...
})
.then(function(filteredElements) {
    filteredElements.forEach(function(element, index) {
        // ....
    });
});
```

Otherwise, ElementArrayFinder has it's own method each, you should call it right on the result of filter, 
not inside a callback for then:

``` javascript
checkbox_list.filter(function(elem, index) {
    // ...
})
.each(function(element, index) {
    // ....
});
```

Maybe the source code for ElementArrayFinder could also help.

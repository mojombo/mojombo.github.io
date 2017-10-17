---
layout: post
title: How to write case-insensitive locators
---

{{ page.title }}
================

<p class="meta">17 Oct 2017</p>

There is a way to wrtite case insensitive locators, e.g. if you have two inputs
with same attribute, containing same word in different registers. Here's an example:

``` html
<input name="firstName">
<input name="FirstName">
```

Here is a way of writing single css locator which will work for both of these elements:

``` javascript
$("input[name*='first' i]")
```

All the of the magic is done by `i` identifier. Here is a [doc](https://www.w3.org/TR/selectors4/#attribute-case).
One of the ways you can use this is if you are working on some web crawler or web scraper and you need
to register at a bunch of different resources, where you have very similar form layout, but inputs' labels could
be in different registers.

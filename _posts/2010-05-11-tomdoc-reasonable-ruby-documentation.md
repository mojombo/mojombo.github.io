---
layout: post
title: TomDoc - Reasonable Ruby Documentation
---

{{ page.title }}
================

<p class="meta">11 May 2016 - San Francisco</p>

[RDoc](https://web.archive.org/web/20100515143741/http://rdoc.rubyforge.org:80/) is an abomination. It's ugly to read in plain
text, requires the use of the inane :nodoc: tag to prevent private method
documentation from showing up in final rendering, and does nothing to encourage
complete or unambiguous documentation of classes, methods, or parameters.
[YARD](https://yardoc.org/) is much better but goes too far in the other direction
(and still doesn't look good in plain text). Providing an explicit way to
specify parameters and types is great, but having to remember a bunch of strict
tag names in order to be compliant is not a good way to encourage coders to
write documentation. And again we see a `@private` tag that's necessary to hide
docs from the final render.

Three years ago, after suffering with these existing documentation formats for
far too long, I started using my own documentation format. It looked a bit like
RDoc but had a set of conventions for specifying parameters, return values, and
the expected types. It used plain language and full sentences so that a human
could read and understand it without having to parse machine-oriented tags or
crufty markup. I called this format TomDoc, because if Linus can name stuff
after himself, then why can't I?

After years in the making, TomDoc is finally a well specified documentation
format. You can find the full spec at [http://tomdoc.org](http://tomdoc.org).

But enough talk. Here's a sample of what a TomDoc'd method might look like:

``` ruby
# Public: Duplicate some text an abitrary number of times.
#
# text  - The String to be duplicated.
# count - The Integer number of times to duplicate the text.
#
# Examples
#
#   multiplex('Tom', 4)
#   # => 'TomTomTomTom'
#
# Returns the duplicated String.
def multiplex(text, count)
  text * count
end
```

At first glance you'll notice a few things. First, and most important, is that
the documentation looks nice in plain text. When I'm working on a project, I
need to be able to scan and read method documentation quickly. Littering the
docs with tags and markup (especially HTML markup) is not acceptable. Code
documentation should be optimized for human consumption. Second, all parameters
and return values, and their expected types are specified. Types are generally
denoted by class name. Because Ruby is so flexible, you are not constrained by a
rigid type declaration syntax and are free to explain precisely how the expected
types may vary under different circumstances. Finally, the basic layout is
designed to be easy to remember. Once you commit a few simple conventions to
memory, writing documentation becomes second nature, with all of the tricky
decision making already done for you.

Today's Ruby libraries suffer deeply from haphazard versioning schemes. Even
RubyGems itself does not follow a sane or predictable versioning pattern. This
lack of discipline stems from the absence of well defined Public APIs. TomDoc
attempts to solve this problem by making it simple to define an unambiguous
Public API for your library. Instead of assuming that all classes and methods
are intended for public consumption, TomDoc makes the Public API opt-in. To
denote that something is public, all you have to do is preface the main
description with "Public:". By forcing you to explicitly state that a class or
method is intended for public consumption, a deliberate and thoughtful Public
API is automatically constructed that can inform disciplined version changes
according to the tenets of [Semantic Versioning](https://semver.org/). In
addition, the prominent display of "Public" in a method description ensures that
developers are made aware of the sensitive nature of the method and do not
carelessly change the signature of something in the Public API.

Once a Public API has been established, some very exciting things become
possible. We're currently working on a processing tool that will render TomDoc
into various forms (terminal, HTML, etc). If you run this tool on a library,
you'll get a printout of the Public API documentation. You can publish this
online so that others have easy access to it. When you roll a new version of the
library, you can run the tool again, giving it a prior version as a base, and
have it automatically display only the methods that have changed. This diff will
be extremely useful for users while they upgrade to the new version (or so they
can evaluate whether an upgrade is warranted)!

While I've been using various nascent forms of TomDoc for several years, we're
just now starting to adopt it for everything we do at GitHub. Now that I've
formalized the spec it will be easy for the entire team to write compliant
TomDoc. The goal is to have every class, method, and accessor of every GitHub
library documented. In the future, once we have proper tooling, we'd even like
to create a unit test that will fail if anything is missing documentation.

TomDoc is still a rough specification so I'm initially releasing it as 0.9.0.
Over the coming months I'll make any necessary changes to address user concerns
and release a 1.0.0 version once things have stabilized. If you'd like to
suggest changes, please open an issue on the [TomDoc GitHub
repository](https://github.com/mojombo/tomdoc).

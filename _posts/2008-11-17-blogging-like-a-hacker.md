---
layout: post
title: Blogging Like a Hacker
---

{{ page.title }}
================

<p class="meta">17 Nov 2008 - San Francisco</p>

Back in 2000, when I thought I was going to be a professional writer, I spent
hours a day on LiveJournal doing writing practice with other aspiring poets and
authors. Since then I've blogged at three different domains about web standards,
print design, photography, Flash, illustration, information architecture,
ColdFusion, package management, PHP, CSS, advertising, Ruby, Rails, and Erlang.

I love writing. I get a kick out of sharing my thoughts with others. The act of
transforming ideas into words is an amazingly efficient way to solidify and
refine your thoughts about a given topic. But as much as I enjoy blogging, I
seem to be stuck in a cycle of quitting and starting over. Before starting the
current iteration, I resolved to do some introspection to determine the factors
that were leading to this destructive pattern.

I already knew a lot about what I *didn't* want. I was tired of complicated
blogging engines like WordPress and Mephisto. I wanted to write great posts, not
style a zillion template pages, moderate comments all day long, and constantly
lag behind the latest software release. Something like Posterous looked
attractive, but I wanted to style my blog, and it needed to be hosted at the
domain of my choosing. For the same reason, other hosted sites (wordpress.com,
blogger.com) were disqualified. There are a few people directly using GitHub as
a blog (which is very cool), but that's a bit too much of an impedance mismatch
for my tastes.

On Sunday, October 19th, I sat down in my San Francisco apartment with a glass
of apple cider and a clear mind. After a period of reflection, I had an idea.
While I'm not specifically trained as an author of prose, I *am* trained as an
author of code. What would happen if I approached blogging from a software
development perspective? What would that look like?

First, all my writing would be stored in a Git repository. This would ensure
that I could try out different ideas and explore a variety of posts all from the
comfort of my preferred editor and the command line. I'd be able to publish a
post via a simple deploy script or post-commit hook. Complexity would be kept to
an absolute minimum, so a static site would be preferable to a dynamic site that
required ongoing maintenance. My blog would need to be easily customizable;
coming from a graphic design background means I'll always be tweaking the site's
appearance and layout.

Over the last month I've brought these concepts to fruition and I'm pleased to
announce [Jekyll](http://github.com/mojombo/jekyll). Jekyll is a simple, blog
aware, static site generator. It takes a template directory (representing the
raw form of a website), runs it through Textile and Liquid converters, and spits
out a complete, static website suitable for serving with Apache or your favorite
web server. If you're reading this on the website
(http://tom.preston-werner.com), you're seeing a Jekyll generated blog!

To understand how this all works, open up my [TPW](https://github.com/mojombo/tpw)
repo in a new browser window. I'll be referencing the code there.

Take a look at
[index.html](http://github.com/mojombo/tpw/tree/master/index.html). This file
represents the homepage of the site. At the top of the file is a chunk of YAML
that contains metadata about the file. This data tells Jekyll what layout to
give the file, what the page's title should be, etc. In this case, I specify
that the "default" template should be used. You can find the layout files in the
[_layouts](https://github.com/mojombo/tpw/tree/master/_layouts) directory. If you
open
[default.html](http://github.com/mojombo/tpw/tree/master/_layouts/default.html)
you can see that the homepage is constructed by wrapping index.html with this
layout.

You'll also notice Liquid templating code in these files.
[Liquid](http://www.liquidmarkup.org/) is a simple, extensible templating
language that makes it easy to embed data in your templates. For my homepage I
wanted to have a list of all my blog posts. Jekyll hands me a Hash containing
various data about my site. A reverse chronological list of all my blog posts
can be found in <code>site.posts</code>. Each post, in turn, contains various
fields such as <code>title</code> and <code>date</code>.

Jekyll gets the list of blog posts by parsing the files in the
[_posts](https://github.com/mojombo/tpw/tree/master/_posts) directory. Each post's
filename contains the publishing date and slug (what shows up in the URL) that
the final HTML file should have. Open up the file corresponding to this blog
post:
[2008-11-17-blogging-like-a-hacker.textile](http://github.com/mojombo/tpw/tree/master/_posts/2008-11-17-blogging-like-a-hacker.textile).
GitHub renders textile files by default, so to better understand the file, click
on the
[raw](http://github.com/mojombo/tpw/tree/master/_posts/2008-11-17-blogging-like-a-hacker.textile?raw=true)
view to see the original file. Here I've specified the <code>post</code> layout.
If you look at that file you'll see an example of a nested layout. Layouts can
contain other layouts allowing you a great deal of flexibility in how pages are
assembled. In my case I use a nested layout in order to show related posts for
each blog entry. The YAML also specifies the post's title which is then embedded
in the post's body via Liquid.

Posts are handled in a special way by Jekyll. The date you specify in the
filename is used to construct the URL in the generated site. This post, for
instance, ends up at
<code>http://tom.preston-werner.com/2008/11/17/blogging-like-a-hacker.html</code>.

Files that do not reside in directories prefixed with an underscore are mirrored
into a corresponding directory structure in the generated site. If a file does
not have a YAML preface, it is not run through the Liquid interpreter. Binary
files are copied over unmodified.

In order to convert your raw site into the finished version, you simply run:

<pre class="terminal"><code>$ jekyll /path/to/raw/site
/path/to/place/generated/site</code></pre>

Jekyll is still a very young project. I've only developed the exact
functionality that I've needed. As time goes on I'd like to see the project
mature and support additional features. If you end up using Jekyll for your own
blog, drop me a line and let me know what you'd like to see in future versions.
Better yet, fork the project over at GitHub and hack in the features yourself!

I've been living with Jekyll for just over a month now. I love it. Driving the
development of Jekyll based on the needs of my blog has been very rewarding. I
can edit my posts in TextMate, giving me automatic and competent spell checking.
I have immediate and first class access to the CSS and page templates.
Everything is backed up on GitHub. I feel a lightness now when I'm writing a
post. The system is simple enough that I can keep the entire conversion process
in my head. The distance from my brain to my blog has shrunk, and, in the end, I
think that will make me a better author.

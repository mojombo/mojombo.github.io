---
layout: post
title: Snyk - Automatically Scan and Fix Ruby and Nodejs Vulnerabilities
---

{{ page.title }}
================

<p class="meta">10 Nov 2016 - San Francisco</p>

This is a story about a company called
[Snyk](https://snyk.io/blog/welcome-ruby-users/) (pronounced "sneak"), their
founder Guy Podjarny, my decision to become one of their advisors, and how they
are going to help save you from malevolent agents trying to steal your digital
stuff.

If you're anything like me, you're simultaneously terrified and in awe of the
increasing commonality of large corporate security breaches. Even big names like
Ebay, Home Depot, Anthem, JP Morgan Chase, Target, LinkedIn, Dropbox, and Yahoo
are falling victim to sophisticated attacks. If you spend even a few minutes
looking into it, you'll be shocked at how frequently these breaches are
happening now. The fine folks at Information is Beautiful have an excellent
interactive visualization of the [World's Biggest Data
Breaches](http://www.informationisbeautiful.net/visualizations/worlds-biggest-data-breaches-hacks/)
over the last twelve years, in case you want to read all the gory details and
never get a restful night of sleep ever again:

<a href="http://www.informationisbeautiful.net/visualizations/worlds-biggest-data-breaches-hacks/">
  <img src="/images/posts/2016-11-10/breaches.png">
</a>

I've used a fair number of emotionally charged words above that might be
triggering your FUD detectors right about now. But be advised: it's not paranoia
when they really are out to get you. If recent, extremely high profile (and
subsequently weaponized) breaches like those of the Clinton Campaign and the DNC
aren't enough to make you want to air gap your entire life, then I envy your
steely-eyed mettle and implore you to teach me your meditation techniques.

The fact is, security is hard. And it's getting harder every day. To win, you
have to get it right every single time. To lose (and lose big), you only have to
screw it up once.

During my years at GitHub, I spent a lot of time assembling a dedicated security
team, managing security audits and penetration tests, and working to establish a
culture of security awareness amongst our development team. All of this is
challenging and expensive, especially for a young company. Even worse, it's the
kind of investment that's totally invisible when it's working, making it hard to
sustain until that crucial and terrible moment you end up on the front page of
Hacker News as the latest victim.

A year ago I was contemplating this, especially the difficult proposition of
having developers, furious at work on new features, constantly maintain
awareness of security vulnerabilities they might be inadvertently weaving into
the product. Web application developers are generally not security experts, and
though I would love to live in a world where that wasn't true, it's just not a
realistic expectation. Meanwhile, modern development means an increasing
reliance on 3rd party code. Even a small Rails app will probably have 300 or
more gem dependencies after a few months of development. It's even more in the
nodejs world. This level of modularization and code reuse, driven by the
explosion of high quality open source over the last decade, is amazing and I
absolutely love it, but it comes at a security expense.

Open source projects are not known for their excellent security records.
Vulnerabilities like [Heartbleed](http://heartbleed.com/) and
[Shellshock](https://blog.cloudflare.com/inside-shellshock/) painfully
demonstrate the idea that "given enough eyeballs, all bugs are shallow" is
completely false. In fact, due to a flaw in YAML, Rails had a [pretty extreme
remote code execution
vulnerability](http://blog.codeclimate.com/blog/2013/01/10/rails-remote-code-execution-vulnerability-explained/)
for years. If you were running any version of Rails prior to the fix, you were
vulnerable. This stuff is real, and as responsible developers, we need to be
more proactive about it.

Luckily, at the time I was pondering these matters, I ran into Guy Podjarny. As
a former cofounder of Blaze.io and then CTO of Web Experience at Akamai (which
acquired Blaze.io), Guy intimately understands the impact of security on today's
web developers. He was working on an automated tool to scan and fix security
vulnerabilities in 3rd party dependencies. I was intrigued. They already had a
way to scan nodejs projects and look for known security vulnerabilities in the
dependency tree and automatically upgrade or patch affected libraries. I thought
this was pretty cool, but it was his vision for what automated security tooling
could be that sold me on him and his company. I can't talk much about that
now, but just know that what Snyk is today is just the tip of what will
become an intelligent and proactive bodyguard for your entire codebase.

A few months ago, Snyk released GitHub integration to make it fantastically
simple to hook up your repos to Snyk and, my favorite feature: the ability to
monitor your repo for future vulnerabilities and then **automatically submit a
pull request** with the suggested package upgrade or hotfix patch (nodejs only for
now).

Today, [Snyk announced support for
Ruby](https://snyk.io/blog/welcome-ruby-users/). Take a look at that blog post,
it does an awesome job of explaining how simple it is to set up and what the
generated pull requests look like. It's totally free for open source projects,
and extremely cheap insurance for your important projects.

Make no mistake, 3rd party code is a clear and present danger to your business.
If you don't know if you're vulnerable, then you must assume that you are and
take steps to protect yourself. Snyk makes it easy.

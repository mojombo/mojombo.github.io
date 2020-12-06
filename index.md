---
layout: default
title: Tom Preston-Werner
---

<div id="home">
  <h1>Blog Posts</h1>
  <ul class="posts">
    {% for post in site.posts %}
      <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ post.url }}">{{ post.title }}</a></li>
    {% endfor %}
  </ul>

  <h1>Highlighted Media</h1>
  <ul class="posts">
    <li><span>02 Sep 2013</span> &raquo; <a href="https://www.wired.com/2013/09/github-for-anything/">Article: WIRED - GitHub Is Going Mainstream</a></li>
    <li><span>09 Nov 2011</span> &raquo; <a href="http://vimeo.com/39016099">Video: RubyConf Argentina - Optimizing For Happiness</a></li>
    <li><span>01 Oct 2011</span> &raquo; <a href="http://confreaks.com/videos/712-rubyconf2011-github-flavored-ruby">Video: RubyConf - GitHub Flavored Ruby</a></li>
    <li><span>23 Nov 2010</span> &raquo; <a href="http://vimeo.com/17118008">Video: Erlang Factory - Mastering Git Basics</a></li>
  </ul>

  <h1>Other Interviews, Talks, Etc</h1>
  <ul class="posts">
    <li><span>12 Sep 2013</span> &raquo; <a href="http://www.youtube.com/watch?v=k2vJNNAQZlg">Video: Fox Business News interview</a></li>
    <li><span>02 Sep 2013</span> &raquo; <a href="http://www.wired.com/wiredenterprise/2013/09/github-for-anything/all/">Article: WIRED - GitHub Is Going Mainstream</a></li>
    <li><span>25 Jul 2013</span> &raquo; <a href="http://www.youtube.com/watch?v=7DoB0SCUtOk&list=SP055Epbe6d5aclKNAa8msO1VvDOJ8sYlS&index=23">Video: O'Reilly Media - OSCON 2013 Interview</a></li>
    <li><span>28 Dec 2012</span> &raquo; <a href="http://bits.blogs.nytimes.com/2012/12/28/github-has-big-dreams-for-open-source-software-and-more/">Article: NYTimes - Dreams of ‘Open’ Everything</a></li>
    <li><span>20 Oct 2012</span> &raquo; <a href="http://www.youtube.com/watch?v=P9jjDpWzsUI">Video: Startup School 2012 - People, Product, Philosophy</a></li>
    <li><span>27 Sep 2012</span> &raquo; <a href="http://www.youtube.com/watch?v=Ln-B_fs9QMY&feature=youtu.be">Video (Panel): Orrick - How to Build a Great Startup Culture</a></li>
    <li><span>18 Jun 2012</span> &raquo; <a href="http://gigaom.com/cloud/10-innovators-changing-the-game-for-internet-infrastructure/7/">Article: GigaOm - 10 Innovators Changing the Game for Internet Infrastructure</a></li>
    <li><span>02 Dec 2011</span> &raquo; <a href="http://vimeo.com/35640883">Video: Northern Lights Conference - Leveling Up</a></li>
    <li><span>12 Nov 2011</span> &raquo; <a href="http://speakerdeck.com/u/mojombo/p/github-flavored-ruby">Slides: RubyConf Uruguay - GitHub Flavored Ruby</a></li>
    <li><span>09 Nov 2011</span> &raquo; <a href="http://speakerdeck.com/u/mojombo/p/optimizing-for-happiness">Slides: RubyConf Argentina - Optimizing For Happiness</a></li>
    <li><span>14 Apr 2011</span> &raquo; <a href="http://skillsmatter.com/podcast/agile-testing/optimizing-for-happiness">Video: ACCU Conference - Optimizing For Happiness</a></li>
    <li><span>09 Apr 2011</span> &raquo; <a href="http://blogs.sitepoint.com/podcast-107-social-coding-with-githubs-tom-preston-werner/">SitePoint Podcast: Social Coding with GitHub’s Tom Preston-Werner</a></li>
    <li><span>10 Feb 2011</span> &raquo; <a href="http://sea.ucar.edu/event/unlocking-secrets-git">Video: NCAR SEA: Unlocking the Secrets of Git</a></li>
    <li><span>12 Jan 2011</span> &raquo; <a href="http://www.maestrosdelweb.com/editorial/tom-preston-werner-fundador-de-github/">Maestros del Web: Tom Preston-Werner fundador de GitHub</a></li>
    <li><span>11 Nov 2010</span> &raquo; <a href="http://confreaks.net/videos/432-rubyconf2010-the-road-from-ruby-hacker-to-entrepreneur">Video: RubyConf 2010 - The Road from Ruby Hacker to Entrepreneur</a></li>
    <li><span>16 Oct 2010</span> &raquo; <a href="http://lambdaphant.com/blog/interview-with-tom-preston-werner-from-github">Lambdaphant interview with Tom Preston-Werner</a></li>
    <li><span>16 Oct 2010</span> &raquo; <a href="http://www.justin.tv/c3oorg/b/272031754">Video: Startup School - Optimize for Happiness</a></li>
    <li><span>16 Sep 2010</span> &raquo; <a href="http://www.youtube.com/watch?v=Hi2V1x1AkD8">Video: @mail.ru Office Presentation</a></li>
    <li><span>14 Sep 2010</span> &raquo; <a href="http://video.mail.ru/corp/video/conference2010/12.html">Video: @mail.ru Tech Forum in Moscow</a></li>
    <li><span>11 Sep 2010</span> &raquo; <a href="http://www.flickr.com/photos/seldaek/4986315165/">Photo: FunConf Speech in Ireland</a></li>
    <li><span>07 Sep 2010</span> &raquo; <a href="http://www.mindmeister.com/fr/maps/show_public/60955251?title=tom-preston-schnitzelconf">SchnitzelConf: Virality and Community</a></li>
    <li><span>27 Aug 2010</span> &raquo; <a href="http://confreaks.net/videos/297-lsrc2010-keynote-address">Video: Lone Star Ruby Conf Keynote</a></li>
    <li><span>16 Aug 2010</span> &raquo; <a href="http://www.infoq.com/interviews/erlang-and-github">InfoQ: Erlang Factory Interview - Tom Preston-Werner and Kenneth Lundin</a></li>
    <li><span>03 Aug 2010</span> &raquo; <a href="http://37signals.com/svn/posts/2486-bootstrapped-profitable-proud-github">37signals: Bootstrapped, Profitable, & Proud: GitHub</a></li>
    <li><span>17 Jun 2010</span> &raquo; <a href="http://webpulp.tv/post/708686185/github-tom-preston-werner">WebPulp.tv: Interview with GitHub CTO Tom Preston-Werner</a></li>
    <li><span>27 Apr 2010</span> &raquo; <a href="http://www.youtube.com/watch?v=weF-_dLYrzw">The Next Web 2010: Interview about Gravatar and Online Reputation</a></li>
    <li><span>27 Apr 2010</span> &raquo; <a href="http://ontwik.com/github/tom-werner-co-founder-of-github/">TNW 2010: What I Learned From Bootstrapping a Side Project Into GitHub</a></li>
    <li><span>19 Nov 2009</span> &raquo; <a href="http://rubyconf2009.confreaks.com/19-nov-2009-10-25-bert-and-ernie-scaling-your-ruby-site-with-erlang-tom-preston-werner.html">RubyConf 2009 Talk: BERT and Ernie: Scaling your Ruby site with Erlang</a></li>
    <li><span>21 Aug 2009</span> &raquo; <a href="http://www.linux-mag.com/cache/7486/1.html">Linux Magazine: The GitHub Hall of Fame - Jekyll Review</a></li>
    <li><span>27 Jul 2009</span> &raquo; <a href="http://developer.yahoo.com/yui/theater/video.php?v=prestonwerner-github">Yahoo Developer Talk: Git, GitHub, and Social Coding</a></li>
    <li><span>22 Jul 2009</span> &raquo; <a href="http://www.viddler.com/explore/GreggPollack/videos/25/44">Envy Labs: 5 Days of OSCON Interview</a></li>
    <li><span>30 Apr 2009</span> &raquo; <a href="http://www.erlang-factory.com/conference/SFBayAreaErlangFactory2009/speakers/TomPrestonWerner">Erlang Factory 09: Mixing Erlang and Ruby with Erlectricity</a></li>
    <li><span>23 Apr 2009</span> &raquo; <a href="http://images.businessweek.com/ss/09/04/0421_best_young_entrepreneurs/17.htm">BusinessWeek: Best Young Tech Entrepreneurs of 2009</a></li>
    <li><span>17 Jan 2009</span> &raquo; <a href="http://www.infoq.com/presentations/preston-werner-conceptual-algorithms">RubyFringe 2008: Conceptual Algorithms</a></li>
    <li><span>09 Oct 2008</span> &raquo; <a href="http://www.infoq.com/interviews/preston-werner-powerset-github-ruby">InfoQ: Tom Preston-Werner on Powerset, GitHub, Ruby and Erlang</a></li>
    <li><span>11 Jul 2008</span> &raquo; <a href="http://www.rubyology.com/podcasts/show/67">Rubyology 65: Powerset Stars 2 of 2</a></li>
    <li><span>05 Jul 2008</span> &raquo; <a href="http://www.rubyology.com/podcasts/show/66">Rubyology 65: Powerset Stars 1 of 2</a></li>
    <li><span>13 Jun 2008</span> &raquo; <a href="http://web20show.com/episodes/web20show-ep45-github">Web 2.0 Show: GitHub (Tom Preston-Werner &amp; Chris Wanstrath)</a></li>
    <li><span>02 Jun 2008</span> &raquo; <a href="http://www.vimeo.com/1104583">Gregg Pollack: Dave Fayram and Tom Preston-Werner at RailsConf</a></li>
    <li><span>29 May 2008</span> &raquo; <a href="http://en.oreilly.com/rails2008/public/schedule/speaker/2520">RailsConf 08: Two talks</a></li>
    <li><span>18 Oct 2007</span> &raquo; <a href="http://blog.gravatar.com/2007/10/18/automattic-gravatar/">Gravatar Blog: Automattic Acquires Gravatar</a></li>
    <li><span>16 Aug 2007</span> &raquo; <a href="http://www.blognewcomb.com/blog/2007/08/powerset_interview_with_tom_pr.html">Steve Newcomb Blog: Interview with Tom Preston-Werner</a></li>
    <li><span>26 Dec 2006</span> &raquo; <a href="http://wp-community.org/2006/12/26/episode-15-interviews-with-tom-werner-gravatar-and-jaimie-sirovich-seo-egghead/">WordPress Podcast: Interview with Tom Werner</a></li>
    <li><span>02 Apr 2005</span> &raquo; <a href="https://web.archive.org/web/20061214040137/http://joshuaink2006.johnoxton.co.uk/blog/240/seven-and-a-half-questions-for-tom-werner">JoshuaInk: Seven and a half questions for Tom Werner</a></li>
  </ul>

  <h1>Noteworthy Open Source Projects and Specifications</h1>
  <ul class="posts">
    <li><a href="http://github.com/jekyll/jekyll/">Jekyll:</a> A simple, blog aware, static site generator (used for this site).</li>
    <li><a href="http://semver.org">Semantic Versioning:</a> A meaningful method for incrementing version numbers.</li>
    <li><a href="http://github.com/toml-lang/toml">TOML:</a> Tom's Obvious, Minimal Language.</li>
    <li><a href="http://github.com/mojombo/god/">God:</a> Ruby process monitoring framework with easy extensibility.</li>
    <li><a href="http://github.com/mojombo/chronic/">Chronic:</a> Ruby natural language date/time parser.</li>
    <li><a href="http://tomdoc.org">TomDoc:</a> Code documentation for humans.</li>
    <li><a href="http://github.com/mojombo/proxymachine/">ProxyMachine:</a> Layer 7 routing proxy in Ruby with Event Machine.</li>
    <li><a href="http://github.com/github/gollum/">Gollum:</a> A simple, Git-powered wiki with a sweet API and local frontend.</li>
    <li><a href="http://github.com/mojombo/grit/">Grit:</a> Object oriented Ruby bindings for Git (used by GitHub).</li>
    <li><a href="http://github.com/mojombo/ernie/">Ernie:</a> Ruby/Erlang Hybrid BERT-RPC server.</li>
  </ul>
</div>

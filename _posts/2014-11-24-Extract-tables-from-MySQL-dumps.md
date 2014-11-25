---
layout: post
title: Extract tables from MySQL dumps
---
Started to tinker with old MySQL dumps of [Szindbadek](http://web.archive.org/web/20100814013313/http://szindbadek.hu/), [Mangare](http://web.archive.org/web/20100820094244/http://mangare.newfocus.hu/) and [Newfocus](http://web.archive.org/web/20100406035522/http://newfocus.hu/) -- and found easiest to hack up a [small Python script](https://github.com/soobrosa/python-tools/blob/master/mysql_to_tsv.py) that extract tables from MySQL dumps to TSV.

You can find some example parameters for pulling from [Wordpress](https://wordpress.org/) and [Scuttle](http://sourceforge.net/projects/scuttle/) in the comments.

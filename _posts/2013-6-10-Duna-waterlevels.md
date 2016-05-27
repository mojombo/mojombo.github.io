---
layout: post
title: Duna waterlevels from 2002
category: post
---
I didn't remember flood in June, so checked out the data. Lighter blue is older data.

<script type="text/javascript" src="http://public.tableausoftware.com/javascripts/api/viz_v1.js"></script><div class="tableauPlaceholder" style="width:654px; height:629px;"><noscript><a href="#"><img alt="Dashboard 1 " src="http:&#47;&#47;public.tableausoftware.com&#47;static&#47;images&#47;du&#47;duna_vize&#47;Dashboard1&#47;1_rss.png" style="border: none" /></a></noscript><object class="tableauViz" width="654" height="629" style="display:none;"><param name="host_url" value="http%3A%2F%2Fpublic.tableausoftware.com%2F" /><param name="site_root" value="" /><param name="name" value="duna_vize&#47;Dashboard1" /><param name="tabs" value="no" /><param name="toolbar" value="yes" /><param name="static_image" value="http:&#47;&#47;public.tableausoftware.com&#47;static&#47;images&#47;du&#47;duna_vize&#47;Dashboard1&#47;1.png" /><param name="animate_transition" value="yes" /><param name="display_static_image" value="yes" /><param name="display_spinner" value="yes" /><param name="display_overlay" value="yes" /><param name="display_count" value="yes" /></object></div>

I copied together the tables from [Hydroinfo](http://www.hydroinfo.hu/Html/archivum/archiv_tabla.html) to a text file and added the year before each table. A light ETL to reformat webdata from  to a TSV with date and value columns

{% gist 5747648 %}

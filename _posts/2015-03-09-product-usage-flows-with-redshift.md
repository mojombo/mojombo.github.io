---
layout: post
title: Product Usage Flows with Redshift
category: post
---
Cyclic or acyclic product usage flows stored in Redshift? No probs, visualize them with ease.

A second chapter in abusing Redshift with window functions came suddenly on a Tuesday evening when my dear colleague, [Jenny](https://twitter.com/twojing), prepared to shine light on how our users change products.

First let’s find the ones who had more than one product during their lifetime.

```
with multi_product_users as
(
 select user_id 
 from subscriptions 
 group by 1
 having count(distinct product_id) > 1
),
```

Let’s get the starting date for each product usage — we have a separate master table for production descriptions named **products**. Let’s inject a date smaller than any real date for each user plus a row that will end up at the end of our ordered list.

```
usage as
(
 select p.name, u.user_id, s.started_at
 from products as p, multi_product_users as u, subscriptions as s
 where p.id = s.product_id
 and u.user_id = s.user_id
 union all
 select '', user_id, '1970–01–01' from multi_product_users
 union all
 select '', 999999999999, ''
 order by 2, 3
),
```

Construct these lovely strings of ‘first product [$] second product’ with the window function ‘lag’.

```
concatenated as 
(
 select user_id,
 started_at,
 name || ' [$] ' || lag(name, 1)
 over (order by user_id, started_at) as lag
 from usage
),
```

Count all ‘first product [$] second product’ pairs where neither product name is an empty string — here we end up with edges of a graph weighed.

```
counted as
(
 select lag, count(*)
 from concatenated
 where split_part(lag, ' [$] ', 1) != ''
 and split_part(lag, ' [$] ', 2) != ''
 group by 1
 order by 2 asc
)
```

If we push the weight in between the two product names we end up with a dump that we can transform to a [Sankey Diagram](http://sankeymatic.com/build/) with a copy-paste.

```
select replace(lag, '$', count) as sankey
from counted;
```

The only caveat with the Sankey Diagram is that your product flow must be acyclic.

How to handle cyclic product flows? You can pretty easily end up with a [GDF-format](http://gephi.github.io/users/supported-graph-formats/gdf-format/) graph descriptor that [Gephi](http://gephi.github.io/) can load if you concatenate the two product names with a comma and leave the weigh in the end.

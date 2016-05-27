---
layout: post
title: User Session Flows with Redshift
category: post
---
[Redshift](http://aws.amazon.com/redshift/) is like crack, it’s so superfast you just can’t go back to anything normal. Feels like an MVP where you don’t get all the jingles of a proper PSQL, but it’s blazing fast and you keep smiling and forget about all the bad parts — if you would like to do something more sophisticated, your options are quite limited like Torsten did on [expanding JSON arrays](http://torsten.io/stdout/expanding-json-arrays-to-rows/) or figuring out [how many bytes long are actually unicode strings](https://twitter.com/t0rsten/status/555389464131166209)
?

Dear Santa, how about some [UDF](https://forums.aws.amazon.com/thread.jspa?threadID=119186)s? And if it’s okay with you just talk to the Eastern Bunny she will deliver them. Until then what you can do is actually juggling with [window functions](http://docs.aws.amazon.com/redshift/latest/dg/c_Window_functions.html).

Let’s say we have a table with events and we’re trying to extract user session flows from this source. Also we’re trying to condense this flow to the smallest meaningful representation — possibly a string we can grep and count on.

We will cram an event into a two-digit decimal number — if we want properly unambigous grepping on the ‘string’ we can have a maximum of 5*5 = 25 unique events then each digit can be either in an odd or even position in the number we end up with. (Any 10-digit scheme maxes out at 36 as [Torsten](http://torsten.io/) properly pointed out.)

```
CREATE TEMP TABLE event_dict AS (
 SELECT 10 AS key, ‘Login’ AS value UNION ALL
 SELECT 12 AS key, ‘Signup’ AS value UNION ALL
 SELECT 14 AS key, ‘TaskCreate’ AS value UNION ALL
 SELECT 16 AS key, ‘ListCreate’ AS value UNION ALL
 SELECT 18 AS key, ‘TaskUpdate’ AS value UNION ALL
 SELECT 30 AS key, ‘ListUpdate’ AS value UNION ALL
 SELECT 32 AS key, ‘Sync’ AS value UNION ALL
 …
 SELECT 98 AS key, ‘Logout’ AS value
);
```

Let’s say you keep a segment table with **segment_name** and **user_id** rows and you have [chart.io](http://chart.io/) to filter them on. Let’s grab a random 10k sample.

```
WITH universe AS
(
 SELECT s.user_id
 FROM users u, segments s
 WHERE u.user_id = s.user_id
 AND segment_name = {SEGMENT}
 ORDER BY RANDOM()
 LIMIT 10000
),
events AS
(
 SELECT date, u.user_id, event
 FROM events ew, universe u
 WHERE u.user_id = ew.user_id
 ORDER BY 1
),
```

Let’s number all the events by **user_id** in time, encode the interesting ones with the event dictionary to two digit numbers then shift the two digit codes one by one by two digits and sum the partials. From 98, 12, 16, 18 we get 18161298 so that the event happened first is the last two digit number. A **bigint** let us cram 9 events into one column.

```
numbered AS
(
 SELECT date, user_id, key,
 ROW_NUMBER() OVER 
 (
  PARTITION BY user_id
  ORDER BY user_id, date ASC
 )
 FROM events, event_dict
 WHERE event_dict.value = event
 ORDER BY 2, 1
),
shifted AS
(
 SELECT date, user_id, key, row_number,
 key * power(100, row_number — 1) AS bits
 FROM numbered
 WHERE row_number < 10
),
collapsed AS
(
 SELECT user_id, SUM(bits)::BIGINT
 FROM shifted
 GROUP BY 1
),
```

Finally we can see what are the typical flows.

```
SELECT sum AS onboarding, COUNT(sum),
ROUND(COUNT(sum)::FLOAT / 
  (SELECT count(*) FROM collapsed) *100, 2) AS pcent
FROM collapsed
GROUP BY 1
ORDER BY 3 DESC
LIMIT 20;
```

Big thanks fly out to [Torsten](http://torsten.io/) for encouraging me to delve into the rabbit hole of windows functions.

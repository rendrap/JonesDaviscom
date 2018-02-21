---
layout: default
title: Our Team
---


{% assign attorney = site.data.attorneys | where:"id", include.attorneyid  | first %}
<h2>{{attorney.name}}</h2>

this is the attorney details page for {{attorney.name}}


{% include attorneylist.html %}

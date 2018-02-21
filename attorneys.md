---
layout: default
title: Our Team
detailImage: http://via.placeholder.com/200x200
---

# Attorneys
I feel like there should be content here and not just an image
![Image of hard working attorneys]({{ page.detailImage }})


{% include attorneylist.html %}

{% for attorney in site.attorneys %}

<a href="{{ attorney.url | prepend: site.baseurl }}">{{ attorney.name }}</a>


<h3>{{ attorney.title }}</h3>


<p class="post-excerpt">{{ attorney.description | truncate: 160 }}</p>

{% endfor %}

[Reference Jekyll collections](https://blog.webjeda.com/jekyll-collections/)



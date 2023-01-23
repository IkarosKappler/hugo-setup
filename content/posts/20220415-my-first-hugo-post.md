---
title: "Porting my website to Hugo"
date: 2023-01-23T18:46:13Z
---


Last year, in 2022, I started to use Hugo site builder, a software developed
by Google. It is a simple but powerful templating enginge to create static
web sites.

### Why static websites, you ask?
Many websites are mostly static. This means the contents does not change
a lot. Most CMS generate the HTML output on each site access, inlcuding
database requests.

So why generate the website new each time a user accesses it, if the contents
seldom changes? It's better to generate the whole HTML once and just deliver
static pages the oldschool way.

<!--more-->

This is why I decided to port my page to Hugo (oh yes, and it stopped working
after a major PHP update recently).


I used this tutorial: Setup my custom Hugo theme from scratch:
https://retrolog.io/blog/creating-a-hugo-theme-from-scratch/

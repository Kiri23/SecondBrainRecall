---
title: How to create rich links in your Sphinx documentation | Kevin Burke
tags: Bookmarks Bar, Documentation
createdAt: Sat Mar 29 2025 15:05:40 GMT-0400 (Atlantic Standard Time)
updatedAt: Sat Mar 29 2025 15:05:40 GMT-0400 (Atlantic Standard Time)
---


- To create rich links in [[Sphinx (documentation generator) | Sphinx documentation]], use the full import path of a class or method surrounded by backticks, with declarations like :meth:, :attr:, :class:, or :exc:.
- To link to a specific method or attribute without showing the full path, use a squiggly (~) before the method or attribute name.
- To link to external [[Documentation | documentation]], add 'sphinx.ext.intersphinx' to the extensions list in docs/conf.py and define the intersphinx_mapping with the project's URL.


## Sources
- [website](https://kevin.burke.dev/kevin/sphinx-interlinks/)

# SQL style guide

**[☛ Read the guide](http://www.sqlstyle.guide)**

---

## General

The guide is written in [Markdown][md-lang] and uses [Jekyll][jekyll] via
[GitHub's Pages][gh-pages] facility to render itself upon pushing to the `gh-pages`
branch.

## Sources

The markdown source for the guide can be found in [_includes/sqlstyle.guide.md][md]

## Installing for local development

There is a Gemfile supplied so you just need to follow the
[GitHub Pages documentation][gh-pages-help] to install the dependencies.

To then run it locally `bundle exec jekyll serve`

## Translations of the guide

If you would like to translate the guide then please open a pull request or open an issue
if you need some help getting it setup.

* [Japanese/日本語](http://www.sqlstyle.guide/jp/) by [nkurigit](https://github.com/nkurigit)
* [Simplified Chinese/简体中文](http://www.sqlstyle.guide/zh/) by 
  [wontoncoder](https://github.com/wontoncoder)

## Projects known to be implementing the guide

If your project uses this styleguide and you'd like to be mentioned in this readme then
please open a pull request adding it below in alphabetical order with a URL and short
description.

* [BEdita](https://github.com/bedita/bedita) - a Symfony based PHP CMF
* [SQLQuery.jl](https://github.com/yeesian/SQLQuery.jl) - A Julia lang package for representing sql queries, and converting them to valid SQL statements
* [Stock Talk](https://github.com/nigelgilbert/stock-talk) - a realtime dashboard that displays the stock data of the most Tweeted Nasdaq companies.

## Notable forks of the guide

These are based on, but deviate in some way from sqlstyle.guide.

If you have forked this styleguide and you'd like to be mentioned in this readme then
please open a pull request adding it below in alphabetical order with a URL and short
description of your deviance.

* [Lumos Labs](https://github.com/lumoslabs/sqlstyle.guide) - removed the river, Redshift, etc. [www](http://engineering.lumosity.com/sqlstyle.guide)


[md-lang]: http://daringfireball.net/projects/markdown/
[jekyll]: http://jekyllrb.com/
[gh-pages]: https://pages.github.com/
[md]: https://github.com/treffynnon/sqlstyle.guide/blob/gh-pages/_includes/sqlstyle.guide.md
[gh-pages-help]: https://help.github.com/articles/using-jekyll-with-pages/#installing-jekyll


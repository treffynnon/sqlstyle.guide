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

* [German/Deutsch](http://www.sqlstyle.guide/de/) by [AStasyK](https://github.com/AStasyK)
* [Italian/Italiano](http://www.sqlstyle.guide/it/) by [robertopauletto](https://github.com/robertopauletto)
* [Japanese/日本語](http://www.sqlstyle.guide/ja/) by [nkurigit](https://github.com/nkurigit)
* [Portuguese (Brazil)/Português (BR)](http://www.sqlstyle.guide/pt-br/) by [pmarcus93](https://github.com/pmarcus93)
* [Russian/Русский](http://www.sqlstyle.guide/ru/) by [denpatin](https://github.com/denpatin)
* [Turkish/Türkçe](http://www.sqlstyle.guide/tr/) by [mrfade](https://github.com/mrfade)
* [Simplified Chinese/简体中文](http://www.sqlstyle.guide/zh/) by [wontoncoder](https://github.com/wontoncoder)
* [Traditional Chinese/正體中文](http://www.sqlstyle.guide/zh-tw/) by [Leon0824](https://github.com/Leon0824)

## Projects known to be implementing the guide

If your project uses this styleguide and you'd like to be mentioned in this readme then
please open a pull request adding it below in alphabetical order with a URL and short
description.

You can also add a badge ([![sqlstyle.guide](https://img.shields.io/badge/style-sqlstyle.guide-brightgreen.svg)](https://www.sqlstyle.guide/)) to your projects readme with the following markdown code if you like:

```markdown
[![sqlstyle.guide](https://img.shields.io/badge/style-sqlstyle.guide-brightgreen.svg)](https://www.sqlstyle.guide/)
```

* [BEdita](https://github.com/bedita/bedita) - a Symfony based PHP CMF
* [SQLQuery.jl](https://github.com/yeesian/SQLQuery.jl) - A Julia lang package for representing sql queries, and converting them to valid SQL statements
* [Stock Talk](https://github.com/nigelgilbert/stock-talk) - a realtime dashboard that displays the stock data of the most Tweeted Nasdaq companies.

## Notable forks of the guide

These are based on, but deviate in some way from sqlstyle.guide.

If you have forked this styleguide and you'd like to be mentioned in this readme then
please open a pull request adding it below in alphabetical order with a URL and short
description of your deviance.

* [Lumos Labs](https://github.com/lumoslabs/sqlstyle.guide) - removed the river, Redshift, etc. [www](http://engineering.lumosity.com/sqlstyle.guide)
* [Mozilla](https://github.com/mozilla/firefox-data-docs/blob/master/concepts/sql_style.md) - removed the river, heavily modified [www](https://docs.telemetry.mozilla.org/concepts/sql_style.html)
* [Ricardo.ch](https://ricardo-ch.github.io/sqlstyle.guide/)
* [Scout24](https://github.com/Scout24/sqlstyle.guide)


[md-lang]: http://daringfireball.net/projects/markdown/
[jekyll]: http://jekyllrb.com/
[gh-pages]: https://pages.github.com/
[md]: https://github.com/treffynnon/sqlstyle.guide/blob/gh-pages/_includes/sqlstyle.guide.md
[gh-pages-help]: https://help.github.com/articles/setting-up-your-github-pages-site-locally-with-jekyll/


---
layout: nil
---

{% include highlight.pack.js %}
hljs.initHighlightingOnLoad();

{% include anchor.min.js %}
anchors.add('h2,h3,h4,h5,h6');

/*
 * ScrollTo code
 */
$(document).ready(function(){
    $('a[href^="#"]').on('click',function (e) {
        e.preventDefault();

        var target = this.hash;
        var dest = 0;
        if(target) {
            var $target = $(target);
            dest = $target.offset().top;
        }

        $('html, body').stop().animate({
            'scrollTop': dest
        }, 900, 'swing', function () {
            window.location.hash = target;
        });
    });
});
---
layout: nil
---

{% include static/highlight.pack.js %}
hljs.initHighlightingOnLoad();

{% include static/anchor.min.js %}
anchors.add('h2,h3,h4,h5,h6');

document.addEventListener('DOMContentLoaded', () => {
    /*
     * translation jump menu
     */
    document.getElementById('language-drop').addEventListener('change', e => {
        var selected = e.target.selectedOptions[0].value + '/';
        if (selected === 'en/') selected = '';
        window.location.href = `{{ site.url }}/${selected}`;
    });

    /*
     * ScrollTo code
     */
    document.querySelectorAll('a[href^="#"]')
        .forEach(x => x.addEventListener('click', e => {
            var targetHash = e.target.hash.replace(/:/g,'\\$&'),
                targetDecoded = decodeURI(targetHash),
                targetId = targetDecoded.replace('#', ''),
                target = document.getElementById(targetId || 'translation-bar');
            if (target) {
                e.preventDefault();
                target.scrollIntoView({behavior: 'smooth', block: 'start'});
            }
        }));
});

// http://exisweb.net/link-tracking-universal-analytics
(function trackOutbounds() {
    var hitCallbackHandler = function(url,win) {
        if (win) {
            window.open(url, win);
        } else {
            window.location.href = url;
        }
    };
    
    var addEvent = function(el, eventName, handler) {
    
        if (el.addEventListener) {
            el.addEventListener(eventName, handler);
            } else {
            el.attachEvent('on' + eventName, function(){
                handler.call(el);
            });
        }
    };
    
    if (document.getElementsByTagName) {
        var el = document.getElementsByTagName('a');
        var getDomain = document.domain.split('.').reverse()[1] + '.' + document.domain.split('.').reverse()[0];
        
        // Look thru each a element
        for (var i=0; i < el.length;i++) {
        
            // Extract it's href attribute
            var href = (typeof(el[i].getAttribute('href')) == 'string' ) ? el[i].getAttribute('href') : '';
            
            // Query the href for the top level domain (xxxxx.com)
            var myDomain = href.match(getDomain);
            
            // If link is outbound and is not to this domain    
            if ((href.match(/^(https?:|\/\/)/i)  && !myDomain) || href.match(/^mailto\:/i)) {
            
                // Add an event to click
                addEvent(el[i],'click', function(e) {
                    var url = this.getAttribute('href'), win = (typeof(this.getAttribute('target')) == 'string') ? this.getAttribute('target') : '';
                    // Log even to Analytics, once done, go to the link
                    ga('send', 'event', 'outbound', 'click', url,
                        {'hitCallback': hitCallbackHandler(url,win)},
                        {'nonInteraction': 1}
                    );
                    e.preventDefault();
                });
            }
        }
    }
})();
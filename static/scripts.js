---
layout: nil
---

{% include static/highlight.pack.js %}
hljs.initHighlightingOnLoad();

{% include static/anchor.min.js %}
anchors.add('h2,h3,h4,h5,h6');

function offset(el) {
    var rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}

function scrollTo(to, duration) {
    var start = document.documentElement.scrollTop,
        change = to - start,
        currentTime = 0,
        increment = 20;
        
    var animateScroll = function(){        
        currentTime += increment;
        var val = Math.easeInOutQuad(currentTime, start, change, duration);
        document.documentElement.scrollTop = val;
        if(currentTime < duration) {
            setTimeout(animateScroll, increment);
        }
    };
    animateScroll();
}

//t = current time
//b = start value
//c = change in value
//d = duration
Math.easeInOutQuad = function (t, b, c, d) {
  t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};

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
            e.preventDefault();
            var target = decodeURI(e.target.hash.replace(/:/g,'\\$&'));
            var dest = 0;
            if(target && target.length) {
                dest = offset(document.querySelector(target)).top;
            }

            scrollTo(dest, 900);
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
---
layout: nil
---

{% include static/anchor.min.js %}
anchors.add('h2,h3,h4,h5,h6');

document.addEventListener('DOMContentLoaded', () => {
  /*
   * translation jump menu
   */
  document.getElementById('language-drop').addEventListener('change', e => {
    var selected = e.target.selectedOptions[0].value + '/';
    if (selected === 'en/') selected = '';
    window.location.href = `{{ site.url }}/${selected.toLowerCase()}`;
  });

  /*
   * ScrollTo code
   */
  document.querySelectorAll('a[href^="#"]')
    .forEach(x => x.addEventListener('click', e => {
      var targetHash = e.target.hash.replace(/:/g, '\\$&'),
        targetDecoded = decodeURI(targetHash),
        targetId = targetDecoded.replace('#', ''),
        target = document.getElementById(targetId || 'translation-bar');
      if (target) {
        e.preventDefault();
        history.pushState({}, `${document.title} - ${target.innerText}`, e.target.href);
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }));
});

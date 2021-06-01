import Vue from 'vue';
Vue.directive('tooltip', {
  bind (el, binding) {
    let tip = document.createElement('div');
    function mouseoverHandler () {
      document.body.appendChild(tip);
      let top = el.getBoundingClientRect().top;
      let bodyHeight = document.body.clientHeight;
      let tipHeight = tip.clientHeight;
      tip.style.left = el.getBoundingClientRect().right + 8 + 'px';
      tip.style.top = top + 'px';
      if (bodyHeight - top < tipHeight) {
        let botom = el.getBoundingClientRect().bottom;
        tip.className = tip.className + ' v-tooltip-down';
        tip.style.top = botom - tipHeight + 'px';
      } else {
        tip.className = tip.className + ' v-tooltip-up';
      }
    }
    function mouseoutHandler () {
      document.body.removeChild(tip);
    }
    el.mouseoverFunc = mouseoutHandler;
    el.mouseoutFunc = mouseoutHandler;
    el.addEventListener('mouseover', mouseoverHandler);
    el.addEventListener('mouseout', mouseoutHandler);
    tip.className = 'v-tooltip';
    tip.innerHTML = binding.value.isHtml;
  },
  unbind (el) {
    el.removeEventListener('mouseover', el.mouseoverFunc);
    el.removeEventListener('mouseout', el.mouseoutFunc);
    let tip = document.body.querySelector('.v-tooltip');
    if (tip) {
      document.body.removeChild(tip);
    }
    delete el.mouseoverFunc;
    delete el.mouseoutFunc;
  }
});

import '@/assets/css/reset.scss'
import '@/assets/js/dmAux'
import '@/assets/js/com'

import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

window.vm = new Vue({
  data() {
    const vm = this
    const data = require('@/assets/js/data').default(vm)

    return {
      ...data,
    }
  },
  methods: {
    ...require('@/assets/js/router').default,
    ...require('@/assets/js/methods').default,
  },
  watch: {
    ...require('@/assets/js/watch').default,
  },
  computed: {
    ...require('@/assets/js/computed').default,
  },
  render: h => h(App),
  mounted() {
    const vm = this.$root
    
    vm.initEvents()
  }
}).$mount('#app')


{
  $(`
    <style>
      .list-respond .list-item .inner {background-image: url(./static-codding/img/img-blank.png)}
      ${
        Array(50).fill().map((_, idx) => {
          const size = idx * 260
          let scale = 1 / (idx === 0 ? 1 : idx)
          
          scale = scale === 1 ? .5 : scale

          return `
            @media (min-width: ${size}px) {
              .list-respond > * {width: ${scale * 100}%}
            }
          `
        }).join('')
      }
    </style>
  `).appendTo('body')
}

const removeAd = () => {
  $('body>div').not('#app').remove()
}

$(removeAd)
$(window).on('load', removeAd)


if (!vm.is.local) {
  window._hmt = window._hmt || []
  $('<script src="https://hm.baidu.com/hm.js?e9c579f6c4c5e9613dfcffad76e61297"></script>').appendTo('body')
}
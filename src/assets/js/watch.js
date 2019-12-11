export default {
  'router': {
    deep: true,
    handler(newVal, oldVal) {
      const vm = this.$root

      if (JSON.stringify(newVal) === JSON.stringify(oldVal)) {
        // console.log('路由没有发生变化')
        return
      }

      let hashData = JSON.stringify(newVal)
      ;(!vm.is.local && !localStorage.showRouterRaw) && (hashData = encodeURIComponent(hashData))
      const targetUrl = location.origin + location.pathname + location.search + '#' + hashData
      history[vm.isRouterPush ? 'pushState' : 'replaceState']({}, '', targetUrl)
      delete vm.isRouterPush
    }
  },
  'mapPlayTime': {
    deep: true,
    handler(newVal) {
      localStorage.mapPlayTime = JSON.stringify(newVal)
    }
  },
  'setting': {
    deep: true,
    handler(newVal) {
      localStorage.setting = JSON.stringify(newVal)
    }
  },
  'router.videoInfo.m3u8'(newVal) {
    const vm = this.$root
    if (!newVal) return
    vm.playM3u8(newVal)
  },
  /*'is.loading'(newVal) {
    console.warn(newVal)
  }*/
}
export default {
  initRouter() {
    const vm = this.$root
    let r = {}

    try {
      r = JSON.parse(decodeURIComponent(location.hash.substring(1)))
    } catch (e) {
      console.log('hash parse err')
    }

    r.com = vm.nav.map[r.com] ? r.com : vm.nav.list[0].com

    vm.router = r
  },
  updateRouter(o, isRouterPush) {
    const vm = this.$root

    vm.isRouterPush = isRouterPush

    for (let key in o) {
      vm.$set(vm.router, key, o[key])
    }
    
    setTimeout(_ => vm.isRouterPush = false, 1)
  },
  setRouter(o) {
    const vm = this.$root

    vm.isRouterPush = true
    vm.router = o
    setTimeout(_ => vm.isRouterPush = false, 1)
  }
}
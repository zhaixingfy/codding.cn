export default {
  curNav() {
    const vm = this.$root
    const r = vm.router

    return vm.nav.map[r.com] || {}
  }
}
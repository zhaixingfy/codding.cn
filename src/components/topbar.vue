<template>
  <div id="topbar" class="flex-h">
    <div class="logo">
      <span>田小号🎺 - Official</span>
    </div>
    <div class="auto-flex nav">
      <ul>
        <li
          v-for="(item, idx) in $root.nav.list"
          @click="handleClick(item)"
          :class="{on: item.com === $root.router.com}"
        >
          <a href="javascript:">{{item.name}}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    handleClick(item) {
      switch (item.name) {
        case 'GitHub':
          window.open(item.arg.url)
          break
        default:
          this.$root.setRouter({com: item.com, arg: item.arg})
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#topbar {background: #33373e; color: #c3c6c9; line-height: 40px; padding: 0 5px; white-space: nowrap; overflow: auto;}
#topbar .logo {padding: 0 10px;}
#topbar .nav {overflow: visible;}
#topbar .nav ul {margin-bottom: 0;}
#topbar .nav ul li {display: inline-block; padding: 0 10px;}
#topbar .nav ul li.on {color: #fff;}
</style>
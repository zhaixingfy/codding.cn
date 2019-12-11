<template>
  <div id="app" :class="{ios: $root.is.ios, android: $root.is.android}">
    <div class="flex-v">
      <topbar></topbar>
      <div class="page-wrap-container auto-flex">
        <!-- mode="out-in" -->
        <transition :appear="!$root.is.local"
          v-for="(item, idx) in $root.nav.list"
          v-if="item.com === $root.router.com"
          :key="idx"
          :enter-active-class="$root.animateCss.in.getOne()"
          :leave-active-class="$root.animateCss.out.getOne()"
        >
          <div
            :class="['page-wrap', 'animated']"
            :key="idx"
          >
            <div :is="item.com" :url="($root.router.arg || {}).url"></div>
          </div>
        </transition>
      </div>
      <div class="gray-title footer" v-if="!$root.setting.is.hideFooter">
        <div class="c">
          <span>鲁ICP备13010563号-2</span>
        </div>
      </div>
    </div>

    <transition name="fade">
      <div class="mask setting"
        v-if="$root.setting.isShow"
        @click="$root.setting.isShow = false"
      >
        <div class="inner" @click.stop>
          <div class="gray-title">
            <div class="fr">
              <i class="glyphicon glyphicon-remove" @click="$root.setting.isShow = false"></i>
            </div>
            <div class="c ellipsis">设置</div>
          </div>
          <form class="space" @submit.prevent="$root.setting.isShow = false">
            <table class="table-form">
              <tr>
                <td>隐藏 footer：</td>
                <td>
                  <toggle v-model="$root.setting.is.hideFooter"></toggle>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <input type="submit" value="确定" class="btn btn-success btn-block">
                </td>
              </tr>
            </table>
          </form>
        </div>
      </div>
    </transition>

    <alert></alert>
    <confirm></confirm>
  </div>
</template>

<script>
export default {
  name: 'app',
  components: {
    'topbar': require('@/components/topbar').default,
    'cctv': require('@/components/cctv').default,
    'algo': require('@/components/algo').default,
    'creative': require('@/components/creative').default,
    'x-frame': require('@/components/x-frame').default,
  },
  mounted() {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
#app {height: 100%; background: #000;}
#app > .flex-v {height: 100%;}
#app .page-wrap-container {overflow: hidden;}
#app .page-wrap-container > div {width: 100%; height: 100%; position: absolute; left: 0; top: 0; background: #fff;}
#app .page-wrap-container > div > div {height: 100%; position: relative;}
#app .footer {border-top: 1px solid #ddd; border-bottom: none; overflow: auto; white-space: nowrap; font-size: 12px;}
</style>
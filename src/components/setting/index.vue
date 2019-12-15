<template>
  <transition name="fade">
    <div class="mask setting"
      v-if="$root.setting.isShow"
      @click="$root.setting.isShow = false"
    >
      <form class="inner"
        @click.stop
        @submit.prevent="$root.setting.isShow = false"
      >
        <div class="gray-title">
          <div class="fr">
            <i class="glyphicon glyphicon-remove" @click="$root.setting.isShow = false"></i>
          </div>
          <div class="c ellipsis">设置</div>
        </div>
        <div class="auto-flex">
          <table class="table-form">
            <tr>
              <td>隐藏 footer：</td>
              <td>
                <toggle v-model="$root.setting.is.hideFooter"></toggle>
              </td>
            </tr>
            <tr>
              <td>遥控器模式：</td>
              <td>
                <toggle v-model="$root.setting.is.remoteControl"></toggle>
              </td>
            </tr>
            <tr>
              <td>站内播放：</td>
              <td>
                <toggle v-model="$root.setting.is.playInSite"></toggle>
              </td>
            </tr>
          </table>
        </div>
        <div class="space">
          <input type="submit" value="确定" class="btn btn-success btn-block">
        </div>
      </form>
    </div>
  </transition>
</template>

<script>

</script>

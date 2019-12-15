import Vue from 'vue'

Vue.component('loading-div', {
  template: `
    <div class="loading-div">
      <ul>
        <li
          v-for="n in len"
          :style="{transform: 'rotate(' + (n * (360 / len)) + 'deg) translateY(-14px) scale(.8, 1)', backgroundColor: 'rgba(' + getColorN(n) + ',' + getColorN(n) + ',' + getColorN(n) + ',1)'}"
        ></li>
      </ul>
    </div>
  `,
  data() {
    return {
      len: 12
    }
  },
  methods: {
    getColorN(idx) {
      // return parseInt(idx / this.len * 100 + 100)
      return parseInt(idx / this.len * 255 + 0)
    },
  },
})

Vue.component('loading', {
  template: `
    <transition name="fade">
      <div class="loading"
        v-if="isShow"
      >
        <loading-div></loading-div>
      </div>
    </transition>
  `,
  props: ['isShow'],
})

Vue.component('player', {
  template: `
    <div class="player">
      <video
        src=""
        id="videoPlayer"
        controls="controls"
        webkit-playsinline=""
        playsinline=""
        x5-playsinline=""
        x-webkit-airplay="allow"
        @timeupdate="handleTimeupdate"
        @ended="$emit('ended', $event)"
      ></video>
    </div>
  `,
  methods: {
    playOnCCTV() {
      const me = this
      const vm = me.$root
      const r = vm.router

      vm.confirm('视频无法播放，点击确定进入央视播放', () => {
        location.href = r.videoInfo.site
      })
    },
    handleTimeupdate(e) {
      const vm = this.$root
      const video = e.target
      const videoUrl = this.videoUrl

      if (videoUrl && video.currentTime > 1) {
        vm.$set(vm.mapPlayTime, videoUrl, video.currentTime)
      }
    },
  },
  computed: {
    r() {
      return this.$root.router
    },
    videoUrl() {
      return (this.r.videoInfo || {}).m3u8 || ''
    },
  },
  beforeDestroy() {
    $('#videoPlayer').each((idx, video) => {
      video.pause()
    })
  },
})

Vue.component('alert', {
  template: `
    <transition name="fade">
      <div class="panel-notice" id="panel-alert"
        v-if="$root.dataAlert.isShow"
      >
        <div class="inner">
          <div class="box-msg" v-html="$root.dataAlert.msg"></div>
          <div class="flex-row btn-box">
            <div class="_1 text-info" tabindex="1" @click="$root.dataAlert.isShow = false">确定</div>
          </div>
        </div>
      </div>
    </transition>
  `,
})

Vue.component('confirm', {
  template: `
    <transition name="fade">
      <div class="panel-notice" id="panel-confirm"
        v-if="$root.dataConfirm.isShow"
      >
        <div class="inner">
          <div class="box-msg" v-html="$root.dataConfirm.msg"></div>
          <div class="flex-h btn-box">
            <div class="auto-flex text-info" tabindex="1" @click="handleConfirm">确定</div>
            <div class="auto-flex" tabindex="1" @click="$root.dataConfirm.isShow = false">取消</div>
          </div>
        </div>
      </div>
    </transition>
  `,
  methods: {
    handleConfirm() {
      const vm = this.$root
      vm.dataConfirm.isShow = false
      vm.cbConfirm && vm.cbConfirm()
      delete vm.cbConfirm
    },
  },
})

Vue.component('toggle', {
  template: `
    <div tabindex="1"
      :class="['toggle', {on: value}]"
      @click="$emit('change', !value)"
    ></div>
  `,
  props: ['value'],
  model: {
    prop: 'value',
    event: 'change',
  },
})

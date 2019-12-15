<template>
  <div class="cctv">
    <div class="layout-respond">
      <div class="panel-nav">
        <ul>
          <li tabindex="1"
            v-for="(item, idx) in channel.list"
            :class="{on: idx === r.idxChannel}"
            @click="$root.setRouter({com: r.com, idxChannel: idx, idxAlbum: 0}, 'push')"
          >{{item.name}}</li>
        </ul>
      </div>
      <div class="panel-nav">
        <ul>
          <li tabindex="1"
            v-for="(item, idx) in listAlbum"
            :class="{on: idx === r.idxAlbum}"
            @click="$root.setRouter({com: r.com, idxChannel: r.idxChannel || 0, idxAlbum: idx}, 'push')"
          >{{item.name}}</li>
        </ul>
      </div>
      <div class="auto-flex flex-v cctv-main">
        <div class="gray-title flex-h">
          <div class="auto-flex ellipsis" style="overflow: hidden;">
            <template v-if="videoInfo.m3u8">
              <span class="hidden-xs">正在播放：</span>
              <span>{{videoInfo.title}}</span>
            </template>
            <template v-else-if="searchText">搜索：{{searchText}}</template>
            <template v-else-if="isIndex">最新内容</template>
            <template v-else>{{curAlbum.name}}</template>
          </div>
          <div class="btn-box">
            <template v-if="videoInfo.m3u8">
              <template v-if="!$root.setting.is.remoteControl">
                <span class="btn btn-success btn-xs" @click="playNext(-1)">
                  <i class="glyphicon glyphicon-arrow-left"></i>
                </span>
                <span class="btn btn-success btn-xs" @click="playNext(1)">
                  <i class="glyphicon glyphicon-arrow-right"></i>
                </span>
              </template>
              <a tabindex="1" target="_blank" :href="videoInfo.site || videoInfo.m3u8" class="btn btn-success btn-xs">官方播放</a>
              <span tabindex="1" class="btn btn-warning btn-xs"
                @click="$root.updateRouter({videoInfo: undefined}, 'push')"
              >关闭视频</span>
            </template>
            <span class="btn btn-primary btn-xs" tabindex="1" 
              v-else-if="!isIndex"
              @click="$root.setRouter({com: r.com})"
            >返回首页</span>
          </div>
        </div>
        <div class="space wrap-ctrl" style="z-index: 2;">
          <div class="flex" v-if="$root.setting.is.remoteControl">
            <div class="auto-flex">
              <button class="btn btn-primary btn-lg btn-block"
                @click="playNext(-1)"
              >
                <i class="glyphicon glyphicon-arrow-left"></i>
              </button>
            </div>
            <div class="auto-flex">
              <button class="btn btn-primary btn-lg btn-block"
                @click="playNext(1)"
              >
                <i class="glyphicon glyphicon-arrow-right"></i>
              </button>
            </div>
          </div>
          <div class="flex-h" v-else>
            <form class="auto-flex inner input-group"
              @submit.prevent="handleSubmitAndFetchVideoList"
            >
              <div class="inner auto-flex">
                <input type="text" class="form-control" 
                  placeholder="支持网址搜索..." 
                  @input="fetchSugg($event)"
                  @click.stop="fetchSugg($event, 0)"
                  @keydown="handleKeydown"
                  v-model="sugg.text"
                >
                <div class="panel-sugg" v-if="sugg.list.length > 0">
                  <ul>
                    <li tabindex="1" 
                      :class="['ellipsis', {on: idx === sugg.cur}]"
                      v-for="(item, idx) in sugg.list"
                      @click="sugg.text = item; handleSubmitAndFetchVideoList($event)"
                    >{{item}}</li>
                  </ul>
                </div>
              </div>
              <div class="input-group-btn">
                <button type="submit" class="btn btn-success" tabindex="1">
                  <i class="glyphicon glyphicon-search"></i>
                </button>
              </div>
            </form>
            <div class="box-select">
              <select tabindex="1" :class="{select: !$root.is.ios}"
                :value="$root.setting.playDirection"
                @change="$root.setting.playDirection = $event.target.value"
              >
                <option :value="1">逆序播放</option>
                <option :value="0">顺序播放</option>
              </select>
              <select tabindex="1" class="select"
                v-if="pageNum > 1"
                :value="curPage"
                @change="$root.updateRouter({videoInfo: undefined, page: $event.target.value}, 'push')"
              >
                <option
                  :value="n - 1"
                  v-for="n in pageNum"
                >{{'第' + (n) + '页'}}</option>
              </select>
              </select>
            </div>
          </div>
        </div>

        <div class="tab-index space" v-if="isIndex">
          <div class="btn-group">
            <span tabindex="1" 
              v-for="(item, idx) in tab.list"
              :class="['btn', 'btn-' + (item.name === tabCom ? 'primary' : 'default'), 'btn-sm']"
              @click="handleTabClick(item)"
            >{{item.name}}</span>
          </div>
          <!-- <div class="ib">
            <toggle v-model="toggleVal"></toggle>
            <span>{{toggleVal}}</span>
          </div> -->
        </div>
        <div class="auto-flex">
          <div class="abs space-h flex-v"
            ref="autoScroll"
            @scroll="$root.lazyLoad()"
          >
            <div class="video-group">
              <section v-for="(item, idx) in video.group">
                <div class="group-title">
                  <strong>{{item.title}}</strong>
                </div>
                <ul class="list-respond">
                  <li class="list-item"
                    v-for="(item, idx) in item.list"
                  >
                    <div class="inner" tabindex="1"
                      :style="{background: $root.color.list[idx % $root.color.list.length]}"
                      @click="getM3u8(item)"
                      v-if="isIndex && tabCom === '频道直播'"
                    >
                      <div class="abs-text">
                        <div>{{item.title}}</div>
                      </div>
                    </div>
                    <div class="inner" tabindex="1" v-else
                      :lazy="item.img"
                      @click="getM3u8(item)"
                    >
                      <div class="text-box" v-if="item.title">
                        <div class="title line-2" v-if="item.title" :title="item.title">{{item.title}}</div>
                        <div class="desc line-2" v-if="item.desc" :title="item.desc">{{item.desc}}</div>
                      </div>
                    </div>
                  </li>
                </ul>
              </section>
            </div>
          </div>

          <player v-if="videoInfo.m3u8" @ended="playNext()"></player>
          <loading :is-show="$root.is.loading && !r.videoInfo"></loading>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'cctv',
  data() {
    // console.clear()
    
    return {
      toggleVal: false,
      cache: {},
      tab: {
        list: [
          {name: '频道直播'},
          {name: '官方首页'},
          {name: '专题直播'},
          {name: '4K专区'},
        ],
      },
      channel: {
        list: require('./channel.json'),
      },
      video: {
        group: [],
        info: {
          id: '',
          title: '',
          site: '',
        },
      },
      sugg: {
        cur: -1,
        text: '',
        list: [],
      },
      page: {
        total: 0,
      },
    }
  },
  computed: {
    r() {
      return this.$root.router
    },
    curChannel() {
      return this.channel.list[this.r.idxChannel] || {}
    },
    curAlbum() {
      return (this.curChannel.children || [])[this.r.idxAlbum] || {}
    },
    listAlbum() {
      return (this.channel.list[this.r.idxChannel || 0] || {}).children || []
    },
    curPage() {
      return Number(this.r.page) || 0
    },
    pageNum() {
      return this.isIndex ? 1 : Math.ceil(this.page.total / 100)
    },
    isIndex() {
      const r = this.r
      return !r.idxChannel && !r.idxAlbum && !r.searchText
    },
    searchText() {
      return (this.r.searchText || '').trim()
    },
    videoInfo() {
      return this.r.videoInfo || {}
    },
    tabCom() {
      const list = this.tab.list
      const r = this.r
      return list.some(v => v.name === r.tabCom) ? r.tabCom : list[0].name
    },
  },
  watch: {
    'r.idxChannel'() {
      this.getVideoList()
    },
    'r.idxAlbum'() {
      this.getVideoList()
    },
    'r.tabCom'() {
      this.getVideoList()
    },
    'r.searchText'(newVal) {
      this.getVideoList()
      this.sugg.text = newVal
    },
    'r.page'() {
      this.getVideoList()
    },
  },
  methods: {
    ...require('./getData').default,
    handleSubmitAndFetchVideoList() {
      const me = this
      const sugg = me.sugg
      const searchText = sugg.text.trim()

      delete me.signFetchSugg
      sugg.list = []

      if (!searchText) return

      vm.updateRouter({
        searchText,
        page: undefined,
        videoInfo: undefined,
      }, 'push')
      me.getVideoList()
    },
    handleKeydown(e = {}) {
      const me = this
      const vm = me.$root
      const sugg = me.sugg
      const sKey = vm.keyMap[e.type === 'submit' ? 13 : e.keyCode]

      switch (sKey) {
        case 'up':
        case 'down':
          e.preventDefault()
          const len = sugg.list.length + 1
          sKey === 'up' ? sugg.cur-- : sugg.cur++
          sugg.cur = (sugg.cur % len + len) % len
          sugg.text = sugg.list[sugg.cur] || sugg.oldText
          break
      }
    },
    async fetchSugg(e, delay) {
      const me = this
      const vm = me.$root
      const sugg = me.sugg
      const searchText = sugg.text.trim()
      const signFetchSugg = me.signFetchSugg = Math.random()

      if (!searchText || e.ctrlKey) {
        sugg.list = []
        return
      }

      await sleep(delay === undefined ? 200 : delay)

      if (signFetchSugg !== me.signFetchSugg) {
        console.warn('fetchSugg 防止重复加载')
        return
      }

      sugg.cur = -1
      sugg.oldText = sugg.text
      
      $.getScript('https://search.cctv.com/webtvsuggest.php?q=' + encodeURIComponent(searchText), () => {
        if (signFetchSugg !== me.signFetchSugg) {
          console.warn('fetchSugg 时过境迁')
          return
        }

        sugg.list = (window.suggestJSON || []).map(v => v.name)
      })
    },
    handleTabClick(elItem) {
      const me = this
      const vm = me.$root
      const r = me.r

      vm.setRouter({com: r.com, idxChannel: r.idxChannel, idxAlbum: r.idxAlbum, tabCom: elItem.name})
    },
    playNext(direction) {
      const me = this
      const vm = me.$root
      const r = vm.router
      const videoList = [].concat.apply([], me.video.group.map(v => v.list))
      const targetVideoSite = me.videoInfo.m3u8 || me.videoInfo.site
      let targetIndex = -1
      let elItem

      me.$delete(vm.mapPlayTime, me.videoInfo.m3u8);
      
      for (let i = 0; i < videoList.length; i++) {
        if ((videoList[i].m3u8 || videoList[i].site) === targetVideoSite) {
          targetIndex = i
          break
        }
      }

      targetIndex += (direction === undefined ? (vm.setting.playDirection ? -1 : 1) : direction)
      targetIndex < 0 && (targetIndex = videoList.length - 1)
      targetIndex > videoList.length - 1 && (targetIndex = 0)
      console.log(targetIndex)
      me.getM3u8(videoList[targetIndex])
      // elItem ? me.getM3u8(elItem) : vm.alert('当前页面没有可以播放的视频了')
    },
    async getM3u8(elItem) {
      const me = this
      const vm = me.$root

      if (!vm.setting.is.playInSite) {
        window.open(elItem.site)
        vm.is.loading = false
        return
      }

      vm.is.loading = true

      if (!elItem.m3u8) {
        await new Promise((next) => {
          $.get(vm.apiPrefix + 'get.php', {
            a: 'get',
            url: elItem.site,
          }, (sHtml) => {
            const title = (sHtml.match(/(?:<title>)([^<>]+)(?:<\/title>)/) || [])[1] || ''
            !elItem.title && title && (elItem.title = title)

            let videoId = (sHtml.match(/"videoCenterId","([^"]*)"/m) || sHtml.match(/(?:guid = ")(\w{32})(?:")/) || [])[1] || ''
            videoId = videoId || (sHtml.match(/\w{32}/) || [])[0] || ''
            
            const gotoOfficial = () => {
              vm.is.loading = false
              vm.confirm('找不到视频，点击确定，进入官方播放', () => {
                window.open(elItem.site)
              })
            }

            if (videoId) {
              window.getHtml5VideoData = (data) => {
                window.getHtml5VideoData = null
                data = JSON.parse(data)

                if (data.hls_url) {
                  vm.$set(elItem, 'm3u8', data.hls_url)
                  next()
                } else {
                  gotoOfficial()
                }
              }
              
              $.getScript(
                'http://vdn.apps.cntv.cn/api/getIpadVideoInfo.do?' +
                'pid=' + videoId + '&' +
                'tai=ipad&' +
                'from=html5&' +
                'tsp=1553074558&' +
                'vn=2049&' +
                'vc=8AB31F7208274D1C0FD8874764B5EBE3&' +
                'uid=2C5D032B73247D87E67C414F62BA2E7B&wlan='
              )
            } else {
              const _url = (sHtml.match(/window\.location\.href='([^']+)';/) || [])[1] || ''

              if (_url) {
                elItem.site = _url
                me.getM3u8(elItem)
              } else {
                gotoOfficial()
              }
            }
          })
        })
      }

      const elItem_ = clone(elItem)
      delete elItem_.desc
      delete elItem_.img
      vm.is.loading = false
      vm.updateRouter({
        videoInfo: elItem_
      }, 'push')
    },
  },
  beforeCreate() {
    this.$root.cctv = this
  },
  async mounted() {
    const me = this
    const vm = me.$root

    me.sugg.text = vm.router.searchText || ''
    vm.is.loading = true
    setTimeout(() => {
      $.getJSON('./static-codding/data/channel.json', (data) => {
        me.channel.list = data
        me.getVideoList()
      })
    }, 800)

    // me.loadHuya()
    /*$.getJSON('./static-codding/data/liveChannel.json', (data) => {
      const jsonGroup = {}
      data.forEach((item, idx, arr) => {
        jsonGroup[item.title] = jsonGroup[item.title] || []
        jsonGroup[item.title].push(item.site)
      })
      for (let key in jsonGroup) {
        jsonGroup[key] = Array.from(new Set(jsonGroup[key]))
      }
      console.log(jsonGroup)
      console.log(Object.keys(jsonGroup).length)
      console.log(JSON.stringify(jsonGroup))
    })*/
  },
  beforeDestroy() {

  },
}
</script>

<style lang="scss" scoped>
.cctv {
  font-size: 13px;
  .panel-nav {
    border-left: 1px solid #fff; border-right: 1px solid #ddd; background: #f3f6f9;
    user-select: none;
    ul {
      li {
        padding: 0 15px; line-height: 32px; border-top: 1px solid #fff; border-bottom: 1px solid #ddd; cursor: pointer;
      }
    }
  }
  .tab-index {
    padding-top: 0; overflow: visible; white-space: nowrap;
  }
  .cctv-main {
    .abs {
      background: #fff;
      .video-group {
        padding-bottom: 50px;
        .group-title {margin: 10px 0;}
      }
    }
    .wrap-ctrl {
      form {
        position: relative; z-index: 2;
        .panel-sugg {
          width: 100%; position: absolute; left: 0; top: 100%; background: #fff; box-shadow: 0 0 10px rgba(0,0,0,.2); padding: .5em 0;
          ul {
            margin-bottom: 0;
            li {
              padding: .5em 1em; cursor: pointer;
              &.on, &:hover {background: #f3f6f9;}
            }
          }
        }
      }
      .box-select {
        select {margin-left: 5px;}
      }
      .auto-flex {overflow: visible;}
    }
    .list-respond {
      .abs-text {
        width: 100%; height: 100%; position: absolute; left: 0; top: 0;
        display: flex; align-items: center; justify-content: center;
        color: #fff; font-size: 20px;
      }
    }
  }
}

@media (max-width: 800px) {
  .cctv .panel-sugg {
    min-width: calc(100vw - 24px);
  }
}
</style>
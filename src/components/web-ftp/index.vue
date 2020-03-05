<template>
  <div class="web-ftp" ref="webFtp"
    @dragstart="handleDragStart"
    @dragover="handleDragover"
    @drop="handleDrop"
  >
    <div class="list-dir"
      @mousedown="handleMouseDown"
      @dblclick="deligateDBlClick"
      ref="listDir"
    >
      <section
        v-for="(itemDir, idx) in listDir"
        :class="['dir', {cur: idx === r.dir.curIndex}, 'flex-v']"
        :dir-index="idx"
        :style="itemDir.style"
        :key="itemDir.t"
      >
        <div class="gray-title dir-title flex-h">
          <form class="auto-flex ellipsis">
            <input class="form-control" type="text"
              @keydown.enter.prevent="updatePath($event.target.value, itemDir)"
              ondblclick="this.focus()"
              :value="itemDir.path"
            >
          </form>
          <div class="icon-box">
            <span>{{itemDir.countSelected || 0}} / {{(dir.map[itemDir.path] || []).length || 0}}</span>
            <i class="glyphicon glyphicon-pencil"></i>
            <i class="glyphicon glyphicon-remove" @click="listDir.splice(idx, 1)"></i>
          </div>
        </div>
        <div class="auto-flex dir-body">
          <div class="space" v-if="(dir.map[itemDir.path] || {}).code">
            <div class="alert alert-danger">{{dir.map[itemDir.path].msg}}</div>
          </div>
          <ul v-else>
            <li class="file"
              v-for="(item, idx) in dir.map[itemDir.path]"
              :data-index="idx"
              :is-dir="item.isDir"
            >
              <div draggable="true" class="glyphicon glyphicon-file"></div>
              <div draggable="true" class="name" :title="item.name">{{item.name}}</div>
            </li>
          </ul>
        </div>
        <div class="resize">
          <div class="line">
            <div class="l"></div>
            <div class="t"></div>
            <div class="r"></div>
            <div class="b"></div>
          </div>
          <div class="corner">
            <div class="lt"></div>
            <div class="rt"></div>
            <div class="rb"></div>
            <div class="lb"></div>
          </div>
        </div>
      </section>
    </div>

    <div ref="elSelect" class="el-select"></div>

    <transition name="fade">
      <div class="mask mask-open-dir"
        v-if="dir.open.isShow"
        @click="dir.open.isShow = false"
      >
        <form class="inner" @click.stop
          @submit.prevent="openDir(dir.open.path)"
        >
          <div class="gray-title">
            <div class="fr">
              <i class="glyphicon glyphicon-remove" @click="dir.open.isShow = false"></i>
            </div>
            <div class="c ellipsis">打开文件夹</div>
          </div>
          <div class="auto-flex">
            <table class="table-form">
              <tr>
                <td>
                  <input type="text" class="form-control" placeholder="输入路径" required 
                    v-model="dir.open.path"
                  >
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
  </div>
</template>

<script>
export default {
  name: 'web-ftp',
  data() {
    return {
      dir: {
        map: {},
        open: {
          isShow: false,
          path: '',
        }
      }
    }
  },
  computed: {
    r() {
      return this.$root.router
    },
    rDir() {
      return this.r.dir || {}
    },
    listDir() {
      return this.rDir.list || []
    },
    curDir() {
      return this.listDir[this.rDir.curIndex]
    },
  },
  watch: {
    'r.dir.list'(newVal) {
      const me = this
      newVal.forEach((v) => {
        !me.dir.map[v.path] && me.$set(me.dir.map, v.path, null)
      })
    },
    'dir.open.isShow' (newVal) {
      if (!newVal) return
      this.$nextTick(() => {
        $('.mask-open-dir .form-control:eq(0)').focus()
      })
    },
    async 'dir.map'(newVal) {
      const paths = Object.keys(newVal)

      for (let i = 0; i < paths.length; i++) {
        await this.getFiles(paths[i])
      }
    }
  },
  methods: {
    ...require('./draggable.js').default,
    ...require('./handleMouseDown.js').default,
    deligateDBlClick(e) {
      const me = this
      const vm = me.$root
      const elDir = e.target.closest('.dir')
      const elFile = $(e.target.closest('.file'))
      const dirIndex = $(elDir).attr('dir-index')

      if (elFile.attr('is-dir')) {
        me.updatePath(me.curDir.path + $(elFile).find('.name').html(), me.listDir[dirIndex])
      }
    },
    getFiles(path) {
      const me = this

      if (me.dir.map[path]) {
        return me.dir.map[path]
      }

      vm.$set(me.dir.map, path, [])

      return new Promise((next) => {
        $.getJSON(vm.apiPrefix + 'webFtp.php', {
          a: 'getFiles',
          path,
        }, (data) => {
          if (vm.isArray(data)) {
            const jsonGroup = {
              dir: [],
              img: [],
              other: [],
            }
            data.sort((a, b) => a.name.localeCompare(b.name))
            data.forEach((v, idx, arr) => {
              if (v.isDir) {
                jsonGroup.dir.push(v)
              } else if (/\.(jpg|jpeg|png|gif|ico|webp|bmp|svg)$/.test(v.name.toLowerCase())) {
                jsonGroup.img.push(v)
              } else {
                jsonGroup.other.push(v)
              }
            })
            data = [].concat.apply([], Object.keys(jsonGroup).map(k => jsonGroup[k]))
          }
          vm.$set(me.dir.map, path, data)
          next(data)
        }).catch((e) => {
          vm.$set(me.dir.map, path, {
            code: 1,
            msg: navigator.onLine ? '服务器似乎未启动' : '请保持网络畅通',
          })
        })
      })
    },
    async openDir(path) {
      const me = this
      const vm = me.$root
      const r = vm.router

      path = vm.pathFormat(path)
      r.dir.zIndex++
      me.dir.open.isShow = false
      vm.isRouterPush = true
      vm.router.dir.list.push({
        path,
        t: r.dir.zIndex,
        countSelected: 0,
        style: {
          width: '400px',
          height: '400px',
          left: '30px',
          top: '30px',
          zIndex: r.dir.zIndex,
        }
      })
      !me.dir.map[path] && me.$set(me.dir.map, path, null)
    },
    updatePath(path, dir) {
      const me = this
      const vm = me.$root
      $(':focus').blur()
      vm.isRouterPush = true
      dir.path = vm.pathFormat(path)
      !me.dir.map[dir.path] && me.$set(me.dir.map, dir.path, null)
    },
  },
  beforeCreate() {
    this.$root.webFtp = this
  },
  mounted() {
    const me = this
    const vm = me.$root
    const r = clone(vm.router)
    console.clear()

    r.dir = r.dir || {}
    r.dir.curIndex = r.dir.curIndex || 0
    r.dir.zIndex = r.dir.zIndex || 0
    r.dir.list = r.dir.list || []
    r.dir.zIndex = r.dir.list.length > 0 ? r.dir.list.map(v=>v.style.zIndex).max() : 1
    r.dir.list.forEach((dir) => {
      dir.countSelected = 0
      me.$set(me.dir.map, dir.path, null)
    })
    vm.router = r
    vm.webFtp = me
  },
  beforeDestroy() {
    delete this.$root.webFtp
  },
}
</script>

<style lang="less" scoped>
.web-ftp {
  background: #dadedd;
  .list-dir {
    user-select: none;
    .dir {
      width: 400px; height: 400px; background: #fff; position: absolute; left: 20px; top: 20px;
      box-shadow: 0 0 10px rgba(0,0,0,.2); border-radius: 4px; overflow: hidden; margin-bottom: 50px;
      transition: .3s all;
      .dir-title {
        padding: 0 12px 0 6px; cursor: move;
        form {
          overflow: hidden; overflow: visible; padding-top: 5px;
          .form-control {
            -webkit-appearance: none; transition: .3s all;
            border: 1px solid transparent; background: transparent;
            box-shadow: none; cursor: inherit;
            padding: 0 0 0 6px; height: 22px;
          }
          .form-control:focus {
            border-color: #ddd; background: #fff; cursor: text;
          }
        }
        .icon-box {
          & > * {
            margin-left: 10px; cursor: pointer;
          }
        }
      }
      .dir-body {
        ul {
          font-size: 12px; text-align: center;
          &:after {content: ""; display: block; clear: both;}
          li {
            width: 60px; height: 80px; margin: 4px 0 0 4px;
            position: relative; float: left;
            padding-top: 6px; border: 1px solid transparent;
            &:hover {background: rgb(229,243,255);}
            &:active {background: rgb(216,234,255);}
            &[is-dir="true"] .glyphicon:before {content: "\e117"; color: #fc1;}
            &[draggable="true"] {border-color: #ddd; background: #f3f6f9}
            .glyphicon {font-size: 30px;}
            .name {
              position: absolute; left: 0; top: calc(80px - 34px);
              width: 100%; line-height: 1.4em; padding: 0 2px;
              overflow: hidden; text-overflow: ellipsis; word-break: break-all;
              display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2;
            }
          }
        }
      }
      &.cur {
        .dir-body {
          ul {
            li {
              &[draggable="true"] {border-color: rgb(153,209,255); background: rgb(204,232,255);}
            }
          }
        }
      }
      .resize {position: static;}
      .resize > div > div {width: 6px; height: 6px; position: absolute; left: 0; top: 0; z-index: 2;}
      .resize .line > div {}
      .resize .line .l {height: 100%; cursor: w-resize;}
      .resize .line .t {width: 100%; cursor: n-resize;}
      .resize .line .r {height: 100%; left: auto; right: 0; cursor: e-resize;}
      .resize .line .b {width: 100%; top: auto; bottom: 0; cursor: s-resize;}
      .resize .corner > div {width: 12px; height: 12px;}
      .resize .corner .lt {cursor: nw-resize;}
      .resize .corner .rt {left: auto; right: 0; cursor: ne-resize;}
      .resize .corner .rb {left: auto; right: 0; top: auto; bottom: 0; cursor: se-resize;}
      .resize .corner .lb {top: auto; bottom: 0; cursor: sw-resize;}
    }
  }
  .el-select {
    width: 100px; height: 100px; position: absolute; left: 50px; top: 50px;
    background: rgba(0,170,255,.5); border: 1px solid #09f; display: none;
    pointer-events: none;
  }
}
</style>
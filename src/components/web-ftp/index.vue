<template>
  <div class="web-ftp" ref="webFtp">
    <div class="list-dir" @mousedown="handleMouseDown" ref="listDir">
      <section class="dir cur flex-v"
        v-for="(itemDir, idx) in listDir"
        :key="itemDir.style.zIndex"
        :data-index="idx"
        :style="itemDir.style"
      >
        <div class="gray-title dir-title flex-h">
          <form class="auto-flex ellipsis">
            <input class="form-control" type="text"
              @keydown.enter.prevent="updatePath($event, itemDir)"
              ondblclick="this.focus()"
              :value="itemDir.path"
            >
          </form>
          <div class="icon-box">
            <span>{{itemDir.countSelected || 0}} / {{(dir.map[itemDir.path] || []).length}}</span>
            <i class="glyphicon glyphicon-pencil"></i>
            <i class="glyphicon glyphicon-remove" @click="listDir.splice(idx, 1)"></i>
          </div>
        </div>
        <div class="auto-flex dir-body">
          <ul>
            <li class="file"
              v-for="(item, idx) in dir.map[itemDir.path]"
              :is-dir="item.isDir"
            >
              <div draggable="true" class="glyphicon glyphicon-file"></div>
              <div draggable="true" class="name">{{item.name}} Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repudiandae natus sequi officia accusantium ab tempore, aliquid quo, totam aut doloremque assumenda voluptate, quia consectetur necessitatibus et labore nihil? Ut, repellat.</div>
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
    listDir() {
      return (this.r.dir || {}).list || []
    },
    curDir() {
      return this.dir.list[this.r.dir.curIndex]
    },
  },
  watch: {
    'dir.open.isShow' (newVal) {
      if (!newVal) return
      this.$nextTick(() => {
        $('.mask-open-dir .form-control:eq(0)').focus()
      })
    },
    async 'dir.map'(newVal) {
      console.log('dir.map changed')
      const paths = Object.keys(newVal)

      for (let i = 0; i < paths.length; i++) {
        await this.getFiles(paths[i])
      }

      console.log('加载完毕')
    }
  },
  methods: {
    getFiles(path) {
      const me = this

      if (me.dir.map[path]) {
        return me.dir.map[path]
      }

      return new Promise((next) => {
        $.getJSON(vm.apiPrefix + 'webFtp.php', {
          a: 'getFiles',
          path,
        }, (data) => {
          data.sort((a, b) => a.name.localeCompare(b.name)).sort((a, b) => b.isDir - a.isDir)
          vm.$set(me.dir.map, path, data)
          next(data)
        })
      })
    },
    async openDir(path) {
      const me = this
      const vm = me.$root
      const r = vm.router

      me.dir.open.isShow = false
      vm.isRouterPush = true
      vm.router.dir.list.push({
        path,
        countSelected: 0,
        style: {
          width: '400px',
          height: '400px',
          left: '30px',
          top: '30px',
          zIndex: ++r.dir.zIndex
        }
      })
      !me.dir.map[path] && me.$set(me.dir.map, path, null)
    },
    updatePath(e, dir) {
      dir.path = e.target.value
    },
    handleMouseDown(e) {
      const me = this
      const vm = me.$root
      const r = vm.router
      const target = e.target
      let elDir = target.closest('.dir')
      let dirIndex = Number(elDir.getAttribute('data-index'))
      let dir = me.listDir[dirIndex]
      const scrollEl = target.closest('.web-ftp')
      const dirTitle = target.closest('.dir-title')
      const dirBody = target.closest('.dir-body')
      const elResize = target.closest('.resize')
      const elSelect = $(me.$refs.elSelect).appendTo(dirBody)[0]

      const x1 = e.clientX + scrollEl.scrollLeft
      const y1 = e.clientY + scrollEl.scrollTop
      const originX = elDir.offsetLeft
      const originY = elDir.offsetTop
      const originW = elDir.offsetWidth
      const originH = elDir.offsetHeight

      if (r.dir.curIndex !== dirIndex) {
        vm.isRouterPush = true
        dir.style.zIndex = ++r.dir.zIndex
        r.dir.curIndex = dirIndex
        me.$nextTick(() => {
          elDir = me.$refs.listDir.children[dirIndex]
          elDir.style.transition = 'none'
        })
      }

      elDir.style.transition = 'none'

      if (dirTitle) {
        if ($(target).is(':focus')) return

        e.preventDefault()

        if (e.altKey) {
          dir = clone(dir)
          vm.isRouterPush = true
          r.dir.curIndex = ++dirIndex
          dir.style.zIndex = ++r.dir.zIndex
          me.listDir.splice(dirIndex, 0, dir)
          me.$nextTick(() => {
            elDir = me.$refs.listDir.children[dirIndex]
            elDir.style.transition = 'none'
          })
        }

        document.onmousemove = (e) => {
          const x2 = e.clientX + scrollEl.scrollLeft
          const y2 = e.clientY + scrollEl.scrollTop

          let x = x2 - x1 + originX
          let y = y2 - y1 + originY

          x < 0 && (x = 0)
          y < 0 && (y = 0)

          elDir.style.left = x + 'px'
          elDir.style.top = y + 'px'
        }
        document.onmouseup = (e) => {
          document.onmousemove = document.onmouseup = null
          vm.isRouterPush = true
          dir.style.left = elDir.style.left
          dir.style.top = elDir.style.top
          $(me.$refs.listDir.children).css({transition: ''})
        }
      } else if (dirBody) {
        const pos = dirBody.getBoundingClientRect()
        const x1 = e.clientX - pos.left + dirBody.scrollLeft
        const y1 = e.clientY - pos.top + dirBody.scrollTop
        const lis = Array.from(dirBody.getElementsByTagName('li')).map((li) => {
          return {
            li,
            l: li.offsetLeft,
            t: li.offsetTop,
            r: li.offsetLeft + li.offsetWidth,
            b: li.offsetTop + li.offsetHeight,
            signCtrl: e.ctrlKey && li.draggable,
            signShift: e.shiftKey && li.draggable,
          }
        })
        let timerScroll

        if (target.closest('[draggable=true]')) {
          if (!target.closest('.file').draggable) {
            lis.forEach((v) => {
              v.li.draggable = false
            })
            target.closest('.file').draggable = true
          }
        }

        document.activeElement.blur()

        $(elSelect).css({
          width: '0px',
          height: '0px',
          display: 'block'
        })

        const fnMove = (e) => {
          const x2 = e.clientX - pos.left + dirBody.scrollLeft
          const y2 = e.clientY - pos.top + dirBody.scrollTop
          
          let l = Math.min(x1, x2)
          let t = Math.min(y1, y2)
          let w = Math.abs(x2 - x1)
          let h = Math.abs(y2 - y1)

          if (l < 0) {
            w += l
            l = 0
          }

          if (t < 0) {
            h += t
            t = 0
          }

          if (l + w > dirBody.scrollWidth) {
            w = dirBody.scrollWidth - l
          }

          if (t + h > dirBody.scrollHeight) {
            h = dirBody.scrollHeight - t
          }

          elSelect.style.left = l + 'px'
          elSelect.style.top = t + 'px'
          elSelect.style.width = w + 'px'
          elSelect.style.height = h + 'px'

          const r = l + w
          const b = t + h

          lis.forEach((v) => {
            const isColl = !(
              l > v.r ||
              t > v.b ||
              r < v.l ||
              b < v.t
            )

            if (e.ctrlKey) {
              v.li.draggable = isColl ? !v.signCtrl : v.signCtrl
            } else if (e.shiftKey) {
              v.li.draggable = isColl || v.signShift
              isColl && v.signShift && (delete v.signShift)
            } else {
              v.li.draggable = isColl
            }
          })

          clearTimeout(timerScroll)

          if (e.clientY < pos.top || e.clientY > pos.bottom) {
            dirBody.scrollTop += (e.clientY - (e.clientY < pos.top ? pos.top : pos.bottom)) / 3
            timerScroll = setTimeout(() => {
              fnMove(e)
            }, 1000 / 60)
          }
        }

        if (!target.closest('[draggable=true]')) {
          e.preventDefault()
          document.onmousemove = fnMove
        }
        document.onmouseup = (e) => {
          const x2 = e.clientX - pos.left + dirBody.scrollLeft
          const y2 = e.clientY - pos.top + dirBody.scrollTop
          
          document.onmousemove = document.onmouseup = null
          elSelect.style.display = 'none'
          clearTimeout(timerScroll)

          if (x1 === x2 && y1 === y2) {
            // 点击
            lis.forEach((v, idx, arr) => {
              v.li.draggable = false
            })
            $(target).closest('.file').each((idx, li) => {
              li.draggable = true
            })
          } else {
            // 选择
            console.log('选择')
          }

          dir.countSelected = lis.reduce((total, v) => {
            return total += (v.li.draggable ? 1 : 0)
          }, 0)
        }
      } else if (elResize) {
        document.onmousemove = (e) => {
          const sClass = target.className
          const x2 = e.clientX + scrollEl.scrollLeft
          const y2 = e.clientY + scrollEl.scrollTop
          const isL = sClass.indexOf('l') > -1
          const isT = sClass.indexOf('t') > -1
          const minSize = 300

          let w = (isL ? x1 - x2 : x2 - x1) + originW
          let h = (isT ? y1 - y2 : y2 - y1) + originH
          let l = x2 - x1 + originX
          let t = y2 - y1 + originY

          if (l < 0) {
            w += l
            l = 0
          }

          if (t < 0) {
            h += t
            t = 0
          }

          if (w < minSize) {
            if (isL) l -= minSize - w
            w = minSize
          }

          if (h < minSize) {
            if (isT) t -= minSize - h
            h = minSize
          }

          switch (sClass) {
            case 'l':
              elDir.style.width = w + 'px'
              elDir.style.left = l + 'px'
              break
            case 't':
              elDir.style.height = h + 'px'
              elDir.style.top = t + 'px'
              break
            case 'r':
              elDir.style.width = w + 'px'
              break
            case 'b':
              elDir.style.height = h + 'px'
              break
            case 'lt':
              elDir.style.width = w + 'px'
              elDir.style.left = l + 'px'
              elDir.style.height = h + 'px'
              elDir.style.top = t + 'px'
              break
            case 'rt':
              elDir.style.width = w + 'px'
              elDir.style.height = h + 'px'
              elDir.style.top = t + 'px'
              break
            case 'rb':
              elDir.style.width = w + 'px'
              elDir.style.height = h + 'px'
              break
            case 'lb':
              elDir.style.width = w + 'px'
              elDir.style.left = l + 'px'
              elDir.style.height = h + 'px'
              break
          }
        }
        document.onmouseup = (e) => {
          document.onmousemove = document.onmouseup = null
          vm.isRouterPush = true
          elDir.style.transition = ''
          dir.style.left = elDir.style.left
          dir.style.top = elDir.style.top
          dir.style.width = elDir.style.width
          dir.style.height = elDir.style.height
          dir.style.zIndex = elDir.style.zIndex
        }
      }
    }
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

<style lang="scss" scoped>
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
              overflow: hidden; text-overflow: ellipsis;
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
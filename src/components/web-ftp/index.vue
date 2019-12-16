<template>
  <div class="web-ftp">
    <div class="list-dir" @mousedown="handleMousedown">
      <section class="dir cur flex-v"
        v-for="(item, idx) in listDir"
        :style="item.style"
      >
        <div class="gray-title dir-title flex-h">
          <div class="auto-flex ellipsis">{{item.path}}</div>
          <div class="icon-box">
            <span>99</span>
            <i class="glyphicon glyphicon-pencil"></i>
            <i class="glyphicon glyphicon-remove"></i>
          </div>
        </div>
        <div class="auto-flex dir-body">
          <ul>
            <li class="file"
              v-for="(item, idx) in 200"
              :draggable="idx < 10"
              :is-dir="idx < 5 || idx > 45"
            >
              <div draggable="true" class="glyphicon glyphicon-file"></div>
              <div draggable="true" class="name">file - {{idx}}</div>
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
  </div>
</template>

<script>
export default {
  name: 'web-ftp',
  data() {
    return {

    }
  },
  computed: {
    r() {
      return this.$root.router
    },
    listDir() {
      return this.r.listDir || [{
        path: 'c:/www/',
        style: {
          width: '400px',
          height: '400px',
          left: '20%',
          top: '30px'
        }
      }]
    },
  },
  methods: {
    handleMousedown(e) {
      const me = this
      const vm = me.$root
      const r = vm.router
      const target = e.target
      const scrollEl = target.closest('.web-ftp')
      const dir = target.closest('.dir')
      const dirTitle = target.closest('.dir-title')
      const dirBody = target.closest('.dir-body')
      const elResize = target.closest('.resize')
      const elSelect = $(me.$refs.elSelect).appendTo(dirBody)[0]

      const x1 = e.clientX + scrollEl.scrollLeft
      const y1 = e.clientY + scrollEl.scrollTop
      const originX = dir.offsetLeft
      const originY = dir.offsetTop
      const originW = dir.offsetWidth
      const originH = dir.offsetHeight

      if (dirTitle) {
        document.onmousemove = (e) => {
          const x2 = e.clientX + scrollEl.scrollLeft
          const y2 = e.clientY + scrollEl.scrollTop

          let x = x2 - x1 + originX
          let y = y2 - y1 + originY

          x < 0 && (x = 0)
          y < 0 && (y = 0)

          dir.style.left = x + 'px'
          dir.style.top = y + 'px'
        }
        document.onmouseup = (e) => {
          document.onmousemove = document.onmouseup = null
        }
      } else if (dirBody) {
        if (target.closest('[draggable=true]')) {
          if (target.draggable && !target.closest('li').draggable) {
            Array.from(dirBody.getElementsByTagName('li')).forEach((li) => {
              li.draggable = false
            })
            target.closest('.file').draggable = true
          }
          return
        }

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

        e.preventDefault()
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

          if (!(e.clientY < pos.top || e.clientY > pos.bottom)) {
            return
          }

          const vy = e.clientY - (e.clientY < pos.top ? pos.top : pos.bottom)
          dirBody.scrollTop += vy / 3
          timerScroll = setTimeout(() => {
            fnMove(e)
          }, 1000 / 60)
        }

        const fnUp = (e) => {
          const x2 = e.clientX - pos.left + dirBody.scrollLeft
          const y2 = e.clientY - pos.top + dirBody.scrollTop
          
          document.onmousemove = document.onmouseup = null
          elSelect.style.display = 'none'
          clearTimeout(timerScroll)
          console.log('fnUp')

          if (x1 === x2 && y1 === y2) {
            // 点击
            lis.forEach((v, idx, arr) => {
              v.li.draggable = false
            })
            $(target).closest('li').each((idx, li) => {
              li.draggable = true
            })
          } else {
            // 选择
            console.log('选择')
          }
        }

        document.onmousemove = fnMove
        document.onmouseup = fnUp
      } else if (elResize) {
        document.onmousemove = (e) => {
          const sClass = target.className
          const x2 = e.clientX + scrollEl.scrollLeft
          const y2 = e.clientY + scrollEl.scrollTop
          const isL = sClass.indexOf('l') > -1
          const isT = sClass.indexOf('t') > -1

          let w = (isL ? x1 - x2 : x2 - x1) + originW
          let h = (isT ? y1 - y2 : y2 - y1) + originH
          let l = x2 - x1 + originX
          let t = y2 - y1 + originY

          if (w < 200) {
            if (isL) {
              l -= 200 - w
            }
            w = 200
          }

          if (h < 200) {
            if (isT) {
              t -= 200 - h
            }
            h = 200
          }

          switch (sClass) {
            case 'l':
              dir.style.width = w + 'px'
              dir.style.left = l + 'px'
              break
            case 't':
              dir.style.height = h + 'px'
              dir.style.top = t + 'px'
              break
            case 'r':
              dir.style.width = w + 'px'
              break
            case 'b':
              dir.style.height = h + 'px'
              break
            case 'lt':
              dir.style.width = w + 'px'
              dir.style.left = l + 'px'
              dir.style.height = h + 'px'
              dir.style.top = t + 'px'
              break
            case 'rt':
              dir.style.width = w + 'px'
              dir.style.height = h + 'px'
              dir.style.top = t + 'px'
              break
            case 'rb':
              dir.style.width = w + 'px'
              dir.style.height = h + 'px'
              break
            case 'lb':
              dir.style.width = w + 'px'
              dir.style.left = l + 'px'
              dir.style.height = h + 'px'
              break
          }
        }
        document.onmouseup = (e) => {
          document.onmousemove = document.onmouseup = null
        }
      }
    }
  },
  beforeCreate() {
    this.$root.webFtp = this
  },
  mounted() {
    console.clear()
  },
  beforeDestroy() {
    console.log('beforeDestroy')
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
      .dir-title {
        padding: 0 12px; cursor: move;
        .auto-flex {overflow: hidden;}
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
            position: relative;
            float: left;
            padding-top: 8px; border: 1px solid transparent;
            &[is-dir="true"] .glyphicon:before {content: "\e117"; color: #fc1;}
            &[draggable="true"] {border-color: #ddd; background: #f3f6f9}
            .glyphicon {font-size: 30px;}
            .name {
              position: absolute; left: 0; top: calc(80px - 34px);
              width: 100%; line-height: 1.4em; padding: 0 5px;
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
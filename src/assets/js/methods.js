export default {
  initEvents() {
    const vm = this.$root

    $(window)
    .on('popstate', vm.initRouter.bind(vm)).trigger('popstate')
    .on('resize', vm.lazyLoad.bind(vm))

    $(document).on('keydown', (e) => {
      const r = vm.router
      const sKey = vm.keyMap[e.keyCode]

      if (sKey === 'esc') {
        document.activeElement.blur()
        delete vm.cbConfirm

        vm.setting.isShow = false
        vm.dataAlert.isShow = false
        vm.dataConfirm.isShow = false

        if (vm.cctv) {
          vm.cctv.sugg.list = []
        }

        if (vm.webFtp) {
          vm.webFtp.dir.open.isShow = false
        }
      }

      if (e.target.closest('form')) return

      if (e.shiftKey && e.ctrlKey && e.altKey) {
        switch (sKey) {

        }
      } else if (e.shiftKey && e.ctrlKey) {
        switch (sKey) {

        }
      } else if (e.ctrlKey && e.altKey) {
        switch (sKey) {
          case 'f':
            if (vm.webFtp) {
              const w = vm.webFtp.$refs.webFtp.clientWidth - 10
              const row = Math.ceil(w / 500)
              const listDir = vm.webFtp.listDir
              const size = Math.floor(w / row)
              let col = -1

              vm.isRouterPush = true

              for (let i = 0; i < listDir.length; i++) {
                const dir = listDir[i]
                const idxL = i % row
                idxL === 0 && col++
                dir.style.left = (idxL * size + 10) + 'px'
                dir.style.top = (col * size + 10) + 'px'
                dir.style.width = (size - 10) + 'px'
                dir.style.height = (size - 10) + 'px'
              }
            }
            break
        }
      } else if (e.shiftKey && e.altKey) {
        switch (sKey) {
          
        }
      } else if (e.ctrlKey) {
        switch (sKey) {
          case 'a':
            if (vm.webFtp) {
              vm.webFtp.curDir.countSelected = $('.web-ftp .dir.cur .file').each((idx, li) => {
                li.draggable = true
              }).length
              vm.webFtp.startIndex = 0
            }
            break
          case 'y':
            history.forward()
            break
          case 'z':
            history.back()
            break
        }
      } else if (e.shiftKey) {
        switch (sKey) {

        }
      } else if (e.altKey) {
        switch (sKey) {
          case 'l':
            if (vm.webFtp) {
              $('.web-ftp .dir.cur .dir-title .form-control').each((idx, node) => {
                node.focus()
                node.select()
              })
            }
            break
          case 'o':
            if (vm.webFtp) {
              vm.webFtp.dir.open.isShow = true
              vm.webFtp.dir.open.path = ''
            }
            break
          case 'w':
            if (vm.webFtp) {
              vm.isRouterPush = true
              r.dir.list.splice(r.dir.curIndex, 1)
              if (r.dir.curIndex >= r.dir.list.length) {
                r.dir.curIndex--
              }
            }
            break
        }
      } else {
        switch (sKey) {
          case 'enter':
            if (vm.webFtp) {
              const dir = vm.webFtp.listDir[r.dir.curIndex]
              const elDir = vm.webFtp.$refs.listDir.children[r.dir.curIndex]
              const elFiles = Array.from(document.querySelectorAll('.web-ftp .dir.cur .file[draggable=true][is-dir=true]'))
              let l = elDir.offsetLeft
              let t = elDir.offsetTop

              vm.isRouterPush = true
              vm.webFtp.listDir.splice(r.dir.curIndex, 1, ...elFiles.map((elFile, idx) => {
                const path = vm.pathFormat(dir.path + $(elFile).find('.name').html())
                r.dir.zIndex++
                return {
                  path,
                  t: r.dir.zIndex,
                  countSelected: 0,
                  style: {
                    width: elDir.style.width,
                    height: elDir.style.height,
                    left: elDir.offsetLeft + idx * 20 + 'px',
                    top: elDir.offsetTop + idx * 20 + 'px',
                    zIndex: r.dir.zIndex,
                  }
                }
              }))
              r.dir.curIndex += elFiles.length - 1
            }
            break
        }
      }

    }).on('click', (e) => {
      vm.cctv && (vm.cctv.sugg.list = [])
    })
  },
  lazyLoad(delay) {
    const vm = this.$root

    clearTimeout(vm.timerLazyLoad)
    vm.timerLazyLoad = setTimeout(() => {
      Array.from(document.querySelectorAll('[lazy]')).forEach((node) => {
        const pos = node.getBoundingClientRect()

        if (pos.top > window.innerHeight || pos.bottom < 0) return

        const src = node.getAttribute('lazy')
        const img = new Image()
        img.src = src
        node.removeAttribute('lazy')
        img.onload = () => {
          node.style.backgroundImage = 'url(' + src + ')'
        }
      })
    }, delay === undefined ? 200 : delay)
  },
  async playM3u8(videoUrl) {
    const vm = this.$root
    const r = vm.router
    let video

    await new Promise((next) => {
      vm.$nextTick(() => {
        video = $('#videoPlayer')[0]
        video && next()
      })
    })

    video.oncanplay = () => {
      video.currentTime = vm.mapPlayTime[r.videoInfo.m3u8] || 0
      video.oncanplay = null
    }

    if (vm.is.supportM3u8) {
      video.src = videoUrl
      /*!vm.is.local && */video.play()
    } else if(vm.is.supportHls) {
      const hls = new Hls()
      hls.loadSource(videoUrl)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        /*!vm.is.local && */video.play()
      })
    } else {
      vm.alert('当前设备不能播放m3u8，推荐使用最新浏览器播放')
    }
  },
  alert(msg) {
    const vm = this.$root

    vm.dataAlert.msg = msg
    vm.dataAlert.isShow = true
  },
  confirm(msg, cb) {
    const vm = this.$root

    vm.dataConfirm.msg = msg
    vm.dataConfirm.isShow = true
    vm.cbConfirm = cb
  },
  getImgOnCanvas(text, w, h, bgColor) {
    const vm = this.$root
    const canvas = vm.canvas
    const gd = vm.gd

    canvas.width = w
    canvas.height = h

    gd.beginPath()
    gd.fillStyle = '#09f'
    gd.fillStyle = bgColor || randColor(.75)
    gd.fillRect(0, 0, w, h)

    gd.beginPath()
    gd.font = '30px Arial'
    gd.textAlign = 'center'
    gd.textBaseline = 'middle'
    gd.fillStyle = '#fff'
    gd.fillText(text, w / 2, h / 2)

    return canvas.toDataURL()
    /*const base64String = canvas.toDataURL().replace(/^[^,]+,/, '')
    var bytes = atob(base64String)
    var bytesCode = new ArrayBuffer(bytes.length)
    var byteArray = new Uint8Array(bytesCode)

    for (var i = 0; i < bytes.length; i++) {
      byteArray[i] = bytes.charCodeAt(i);
    }
    return URL.createObjectURL(new Blob([bytesCode], {type : 'image/png'}))*/
  },
  pathFormat(path) {
    return (path + '/').replace(/。/g, '.').replace(/、/g, '/').replace(/(\/|\\)+/g, '/')
  },
  getUid() {
    return parseInt(Math.random().toString().replace('0.', '')).toString(32)
  },
  isArray(o) {
    return o instanceof Array
  },
  isColl(elA, elB) {
    if (elA === elB) return false

    const l = elA.offsetLeft
    const t = elA.offsetTop
    const r = l + elA.offsetWidth
    const b = t + elA.offsetHeight

    const _l = elB.offsetLeft
    const _t = elB.offsetTop
    const _r = _l + elB.offsetWidth
    const _b = _t + elB.offsetHeight

    return !(
      l > _r ||
      t > _b ||
      r < _l ||
      b < _t
    )
  },
}
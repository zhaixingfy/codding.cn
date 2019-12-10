export default {
  initEvents() {
    const vm = this.$root

    $(window)
    .on('popstate', vm.initRouter.bind(vm)).trigger('popstate')
    .on('resize', vm.lazyLoad.bind(vm))

    $(document).on('keydown', (e) => {
      const sKey = vm.keyMap[e.keyCode]

      if ($(document.activeElement).closest('form')[0]) {
        // console.log('not body')
        return
      }

      if (e.ctrlKey && e.altKey) {
        
      } else if (e.ctrlKey) {
        switch (sKey) {
          case 'y':
            history.forward()
            break
          case 'z':
            history.back()
            break
        }
      } else {
        switch (sKey) {
          case 'esc':
            vm.dataAlert.isShow = false
            vm.dataConfirm.isShow = false
            delete vm.cbConfirm
            vm.cctv && (vm.cctv.sugg.list = [])
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
        node.removeAttribute('src')
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
}
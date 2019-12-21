export default {
  handleMouseDown(e) {
    const me = this
    const vm = me.$root
    const r = vm.router
    const target = e.target
    let elDir = target.closest('.dir')
    let dirIndex = Number(elDir.getAttribute('dir-index'))
    let dir = me.listDir[dirIndex]
    const webFtp = target.closest('.web-ftp')
    const dirTitle = target.closest('.dir-title')
    const dirBody = target.closest('.dir-body')
    const elResize = target.closest('.resize')
    const elSelect = $(me.$refs.elSelect).appendTo(dirBody)[0]

    const x1 = e.clientX + webFtp.scrollLeft
    const y1 = e.clientY + webFtp.scrollTop
    const originX = elDir.offsetLeft
    const originY = elDir.offsetTop
    const originW = elDir.offsetWidth
    const originH = elDir.offsetHeight

    if (r.dir.curIndex !== dirIndex) {
      /*vm.isRouterPush = Array.from(me.$refs.listDir.children).some((_elDir) => {
        return vm.isColl(_elDir, elDir)
      })*/
      dir.style.zIndex = ++r.dir.zIndex
      r.dir.curIndex = dirIndex
    }

    if (dirTitle) {
      if ($(target).is(':focus')) return

      $(':focus').blur()
      e.preventDefault()

      if (e.altKey) {
        vm.isRouterPush = true
        dir = clone(dir)
        r.dir.curIndex = ++dirIndex
        dir.style.zIndex = ++r.dir.zIndex
        dir.t = r.dir.zIndex
        me.listDir.splice(dirIndex, 0, dir)
        me.$nextTick(() => {
          elDir = me.$refs.listDir.children[dirIndex]
          elDir.style.transition = 'none'
        })
      }
      elDir.style.transition = 'none'

      document.onmousemove = (e) => {
        const x2 = e.clientX + webFtp.scrollLeft
        const y2 = e.clientY + webFtp.scrollTop

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
      const elFile = e.target.closest('.file')
      let timerScroll

      document.activeElement.blur()

      $(elSelect).css({
        left: x1 + 'px',
        top: y1 + 'px',
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

      const fnUp = (e) => {
        let elFile = e.target.closest('.file')
        const x2 = e.clientX - pos.left + dirBody.scrollLeft
        const y2 = e.clientY - pos.top + dirBody.scrollTop
        const isMouseClick = x1 === x2 && y1 === y2
        
        document.onmousemove = document.onmouseup = null
        elSelect.style.display = 'none'
        clearTimeout(timerScroll)

        if (isMouseClick) {
          // 鼠标点击
          if (elFile) {
            // 点击在元素上
            if (e.ctrlKey) {
              if (e.type === 'mouseup') {
                elFile.draggable = !elFile.draggable
                me.startIndex = elFile.dataset.index
              }
            } else if (e.shiftKey) {
              const _startIndex = me.startIndex || 0
              const _endIndex = elFile.dataset.index
              const startIndex = Math.min(_startIndex, _endIndex)
              const endIndex = Math.max(_startIndex, _endIndex)

              lis.forEach((v, idx) => {
                v.li.draggable = idx >= startIndex && idx <= endIndex
              })
            } else {
              if (e.type !== 'mouseup' && elFile.draggable) {

              } else {
                lis.forEach((v, idx, arr) => {
                  v.li.draggable = false
                })
                elFile.draggable = true
                me.startIndex = elFile.dataset.index
              }
            }
          } else {
            // 点在空白区域
            lis.forEach((v) => {
              v.li.draggable = false
            })
          }
        } else {
          // 鼠标框选
          $(document.querySelector('.web-ftp .dir.cur .file[draggable=true]')).each((idx, li) => {
            me.startIndex = li.dataset.index
          })
        }

        dir.countSelected = $('.web-ftp .dir.cur .file[draggable=true]').length
        dir.countSelected === 0 && (me.startIndex = 0)
      }

      if (target.closest('[draggable=true]')) {
        fnUp(e)
      } else {
        e.preventDefault()
        document.onmousemove = fnMove
      }
      document.onmouseup = fnUp
    } else if (elResize) {
      elDir.style.transition = 'none'

      document.onmousemove = (e) => {
        const sClass = target.className
        const x2 = e.clientX + webFtp.scrollLeft
        const y2 = e.clientY + webFtp.scrollTop
        const isL = sClass.indexOf('l') > -1
        const isT = sClass.indexOf('t') > -1
        const minSize = 260

        let w = (isL ? x1 - x2 : x2 - x1) + originW
        let h = (isT ? y1 - y2 : y2 - y1) + originH
        let l = x2 - x1 + originX
        let t = y2 - y1 + originY

        if (l < 0 && isL) {
          w += l
          l = 0
        }

        if (t < 0 && isT) {
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
}
class EquityMap {
  constructor(d = {}) {
    d.conf = {
      space: 25,
      sizeRect: 16,
      duration: 400,
      scale: 1,
      rect: {
        size: {
          width: 120,
          height: 60,
        },
      },
      spaceBetween: 10,
      lineHeight: 100,
    }

    d.gd = d.canvas.getContext('2d')
    d.mapId = {}
    d.mapPid = {}
    d.translate = {x: 0, y: 0}
    d.data.forEach((item, idx, arr) => {
      d.mapId[item.id] = item
      d.mapPid[item.id] = d.mapPid[item.id] || []
      d.mapPid[item.pid] = d.mapPid[item.pid] || []
      d.mapPid[item.pid].push(item)
    })
    d.rootNode = d.mapPid[0][0]

    d.group = {
      prev: d.mapPid[d.rootNode.id].filter(v => v.isPrev),
      next: d.mapPid[d.rootNode.id].filter(v => !v.isPrev),
    }

    this.d = d
    this.setDepth()
    this.imgPreset()
    this.initEvents()
  }
  tween(t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
    return c / 2 * ((t -= 2) * t * t + 2) + b;
  }
  animate() {
    const me = this
    const d = me.d

    d.data.forEach((node, idx, arr) => {
      node.from.x = node.x = node.x || d.cx
      node.from.y = node.y = node.y || d.cy
    })

    const loopRender = () => {
      d.timerAni = requestAnimationFrame(() => {
        const isEnd = Date.now() - d.timeStart > d.conf.duration
        const scale = me.tween(Date.now() - d.timeStart, 0, 1, d.conf.duration)

        d.data.forEach((node) => {
          node.x = node.from.x + (node.to.x - node.from.x) * scale
          node.y = node.from.y + (node.to.y - node.from.y) * scale
        })
        me.render()
        !isEnd && loopRender()
      })
    }

    d.timeStart = Date.now()
    cancelAnimationFrame(d.timerAni)
    loopRender()
  }
  setDepth() {
    const me = this
    const d = me.d

    const setDepth = (node, depth) => {
      node.depth = depth
      node.isOpen = depth < 1
      node.x = 0
      node.y = 0
      node.from = {x: 0, y: 0}
      node.to = {x: 0, y: 0}
      d.mapPid[node.id].forEach((item) => {
        setDepth(item, depth + 1)
      })
    }
    setDepth(d.rootNode, 0)
  }
  imgPreset() {
    const me = this
    const d = me.d
    const {canvas, gd} = d
    const size = 20

    canvas.width = canvas.height = size

    gd.clearRect(0, 0, canvas.width, canvas.height)
    gd.beginPath()
    gd.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI)
    gd.fillStyle = 'rgba(156, 208, 255, 1)'
    gd.fill()

    gd.beginPath()
    gd.rect(4, size / 2 - 1, size - 8, 2)
    gd.fillStyle = '#fff'
    gd.fill()

    d.imgMinus = new Image()
    d.imgMinus.src = canvas.toDataURL()
    /*d.imgMinus.style.cssText = 'position: absolute; left: 10px; top: 10px;'
    document.body.appendChild(d.imgMinus)*/

    gd.beginPath()
    gd.rect(size / 2 - 1, 4, 2, size - 8)
    gd.fillStyle = '#fff'
    gd.fill()

    d.imgPlus = new Image()
    d.imgPlus.src = canvas.toDataURL()
    /*d.imgPlus.style.cssText = 'position: absolute; left: 36px; top: 10px;'
    document.body.appendChild(d.imgPlus)*/
  }
  initEvents() {
    const me = this
    const d = me.d

    d.canvas.onmousemove = d.canvas.onmouseup = d.canvas.onclick = me.render.bind(me)

    d.canvas.onmousedown = d.canvas.ontouchstart = (e) => {
      // e.preventDefault()
      const x1 = e.clientX || e.touches[0].clientX
      const y1 = e.clientY || e.touches[0].clientY
      const originX = d.translate.x
      const originY = d.translate.y

      d.isMouseDown = true
      me.render(e)

      d.canvas.onmousemove = d.canvas.ontouchmove = (e) => {
        const x2 = e.clientX || e.touches[0].clientX
        const y2 = e.clientY || e.touches[0].clientY

        d.translate.x = x2 - x1 + originX
        d.translate.y = y2 - y1 + originY

        me.render(e)
      }

      d.canvas.onmouseup = (e) => {
        d.isMouseDown = false
        d.canvas.onmousemove = d.canvas.onmouseup = me.render.bind(me)
        me.render(e)
      }
    }

    // const handleMouseWheel = (e) => {
    //   const isDown = e.detail > 0 || e.wheelDelta < 0
    //   isDown ? (d.conf.scale *= 1.1) : (d.conf.scale /= 1.1) 
    //   me.render()
    // }
    // d.canvas.addEventListener('onmousewheel' in d.canvas ? 'mousewheel' : 'DOMMouseScroll', handleMouseWheel, false)

    me.handleWindowResize = () => {
      d.canvas.width = d.canvas.offsetWidth
      d.canvas.height = d.canvas.offsetHeight
      d.cx = d.canvas.width / 2
      d.cy = d.canvas.height / 2
      me.setLayout()
      // me.render()
      me.animate()
    }
    window.addEventListener('resize', me.handleWindowResize, false)
    me.handleWindowResize()
    d.data.forEach((node) => {
      node.from.x = d.cx
      node.from.y = d.cy
    })
  }
  setLayout() {
    const me = this
    const d = me.d
    const rootNode = d.mapPid[0][0]
    let translate = {x: 0, y: 0}

    d.leafNodes = []
    d.iHeight = 0

    const setLayout = (node, direction) => {
      const children = node === d.rootNode ? d.group[direction] : d.mapPid[node.id]

      node.isOpen && children.forEach((item) => {
        setLayout(item, direction)
      })

      if (children.length === 0 || !node.isOpen) {
        // 叶子节点 || 未打开的节点
        node.to.x = d.iLeft
        d.iLeft += d.conf.spaceBetween + d.conf.rect.size.width
      } else {
        node.to.x = (children[0].to.x + children[children.length - 1].to.x) / 2
      }

      node.to.y = (direction === 'prev' ? -node.depth : node.depth) * d.conf.lineHeight
    }

    const updatePos = (node, direction) => {
      const children = node === d.rootNode ? d.group[direction] : d.mapPid[node.id]
      children.forEach((item) => {
        updatePos(item, direction)
      })
      node.to.x += translate.x
      node.to.y += translate.y
    }

    ;['prev', 'next'].forEach((direction) => {
      d.iLeft = 0
      setLayout(rootNode, direction)

      translate = {
        x: d.canvas.width / 2 - rootNode.to.x - d.conf.space,
        y: d.canvas.height / 2 - rootNode.to.y - d.conf.space,
      }
      updatePos(rootNode, direction)
    })
  }
  render(e) {
    const me = this
    const d = me.d
    const {canvas, gd} = d
    const size = d.conf.rect.size
    const rootNode = d.mapPid[0][0]
    let _isPointInPath

    const renderLine = (node) => {
      node.isOpen && d.mapPid[node.id].forEach((item, idx, arr) => {
        renderLine(item)

        const isDown = item.y > d.rootNode.y

        const x0 = node.x
        const y0 = node.y

        const x1 = node.x
        const y1 = node.y

        const x3 = item.x
        const y3 = node.y

        const x4 = item.x
        const y4 = item.y + (isDown ? -40 : 40)

        const x5 = item.x
        const y5 = item.y

        gd.beginPath()
        gd.lineTo(x0, y0)
        gd.lineTo(x1, y1)
        gd.quadraticCurveTo(
          x3, y3,
          x4, y4,
        )
        gd.lineTo(x5, y5)
        gd.strokeStyle = 'rgba(128,128,128,1)'
        gd.stroke()

        {
          const x = x4
          const y = y4 + 5

          gd.beginPath()
          gd.lineTo(x, y)
          gd.lineTo(x - 5, y - 10)
          gd.lineTo(x + 5, y - 10)
          gd.closePath()
          gd.fillStyle = '#09f'
          gd.fill()

          if (item.isControl) {
            gd.fillText('控股', x - 31, y - 2)
          }

          if (item.precent) {
            gd.fillText(item.precent * 100 + '%', x + 10, y - 2)
          }
        }
      })
    }

    const renderNode = (node) => {
      const isDown = node.y > d.rootNode.y
      gd.textAlign = 'center'
      gd.textBaseline = 'middle'
      gd.fillStyle = '#fff'

      if (node === d.rootNode) {
        gd.font = '16px Arial'
        const w = gd.measureText(node.name).width + 30
        const h = 36
        gd.rect(node.x - w / 2, node.y - h / 2, w, h)
      } else {
        gd.beginPath()
        gd.rect(node.x - size.width / 2, node.y - size.height / 2, size.width, size.height)
      }

      const isPointInPath = e && gd.isPointInPath(e.offsetX, e.offsetY)
      _isPointInPath = _isPointInPath || isPointInPath
      isPointInPath && me.d[e.type] && me.d[e.type](node)
      
      if (node === d.rootNode) {
        gd.fillStyle = '#09f'
        gd.fill()
        gd.strokeStyle = '#09a'
        gd.stroke()

        gd.fillStyle = '#fff'
        gd.fillText(node.name, node.x, node.y)
      } else {
        gd.fillStyle = 'rgba(255,255,255,1)'
        gd.fill()
        gd.strokeStyle = isPointInPath ? '#09f' : 'rgba(128, 128, 128, 1)'
        gd.stroke()

        gd.fillStyle = 'rgba(128, 128, 128, 1)'
        gd.font = '12px Arial'
        let strWidth = gd.measureText(node.name).width
        let strArr = []

        if (strWidth > d.conf.rect.size.width - 10) {
          const half = Math.ceil(node.name.length / 2)
          strArr = [node.name.slice(0, half), node.name.slice(half)]
        } else {
          strArr = [node.name]
        }
        node.payCash && strArr.push('认缴金额：' + node.payCash)

        gd.textBaseline = 'top'
        strArr.forEach((str, idx, arr) => {
          gd.fillStyle = idx === arr.length - 1 ? '#999' : '#333'
          gd.fillText(str, node.x, (idx - arr.length / 2) * 16 + node.y)
        })
      }

      if (d.mapPid[node.id].length > 0 && node !== d.rootNode) {
        const img = d[node.isOpen ? 'imgMinus' : 'imgPlus']
        const x = node.x - img.width / 2
        const y = node.y - img.height / 2 + (isDown ? 1 : -1) * (d.conf.rect.size.height / 2 + img.width / 2)

        gd.drawImage(
          img,
          x, y, img.width, img.height
        )

        gd.beginPath()
        gd.rect(x, y, img.width, img.height)

        const isPointInPath = e && gd.isPointInPath(e.offsetX, e.offsetY)
        _isPointInPath = _isPointInPath || isPointInPath

        if (isPointInPath && e.type === 'click') {
          setTimeout(() => {
            node.isOpen = !node.isOpen
            d.mapPid[node.id].forEach((item, idx, arr) => {
              item.x = item.from.x = node.x
              item.y = item.from.y = node.y
            })
            const loopSetPos = (_node) => {
              d.mapPid[_node.id].forEach((item) => {
                item.x = item.from.x = node.x
                item.y = item.from.y = node.y
                loopSetPos(item)
              })
            }
            loopSetPos(node)
            me.handleWindowResize()
          }, 0)
        }
      }

      node.isOpen && d.mapPid[node.id].forEach((item, idx, arr) => {
        renderNode(item)
      })
    }

    gd.beginPath()
    gd.fillStyle = '#fff'
    gd.fillRect(0, 0, d.canvas.width, d.canvas.height)

    gd.save()
    gd.translate(d.conf.space + d.translate.x, d.conf.space + d.translate.y)
    // gd.scale(d.conf.scale, d.conf.scale)
    renderLine(rootNode)
    renderNode(rootNode)
    gd.restore()
    d.canvas.style.cursor = _isPointInPath ? 'pointer' : 'default'
  }
  destroy() {
    const me = this
    const d = me.d
    window.removeEventListener('resize', me.handleWindowResize, false)
    d.canvas.onmousedown = null
    for (let key in d) delete d[key]
    for (let key in me) delete me[key]
  }
}
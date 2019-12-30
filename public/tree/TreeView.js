const rand = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

Array.prototype.first = function() {
  return this[0]
}

Array.prototype.last = function() {
  return this[this.length - 1]
}

Array.prototype.swap = function(a, b) {
  const t = this[a]
  this[a] = this[b]
  this[b] = t
}

Array.prototype.shuffle = function() {
  for (let i = this.length - 1; i > 0; i--) {
    this.swap(i, Math.floor(Math.random() * (i + 1)))
  }
  return this
}

class TreeView {
  constructor(d) {
    const me = this
    const idRepeat = {}

    me.d = d
    d.count = 0
    d.gd = d.canvas.getContext('2d')

    // 数据安全监测
    d.data = d.data || []
    d.direction = (d.direction || '').toLowerCase().trim()
    d.mode = (d.mode || '').toLowerCase().trim()
    d.data.forEach((item) => {
      idRepeat[item.id] = idRepeat[item.id] || 0
      idRepeat[item.id]++
      if (idRepeat[item.id] > 1) throw new Error('id重复，重复的id是 ' + item.id)
      if (item.id === item.pid) throw new Error('数据错误 id === pid 错误的id是 ' + item.id)
    })

    try {
      d.translate = JSON.parse(localStorage.translate)
    } catch (e) {
      d.translate = {}
    }
    d.translate = d.translate || {}
    d.translate.x = d.translate.x || 0
    d.translate.y = d.translate.y || 0

    d.conf = d.conf || {}
    d.conf.rect = d.conf.rect || {}
    d.conf.rect.size = d.conf.rect.size || {}
    d.conf.rect.size.width = d.conf.rect.size.width || 26
    d.conf.rect.size.height = d.conf.rect.size.height || 20
    d.conf.itemLinkBgColor = d.conf.itemLinkBgColor || 'rgba(128,128,128,1)'
    d.conf.itemHoverBgColor = d.conf.itemHoverBgColor || '#FF9800'
    d.conf.itemActiveBgColor = d.conf.itemActiveBgColor || '#FF5722'
    d.conf.scale = d.conf.scale || 1
    d.conf.lineHeight = d.conf.lineHeight || 50
    d.conf.spaceBetween = d.conf.spaceBetween || 2
    d.conf.itemWidth = d.conf.rect.size.width + d.conf.spaceBetween

    d.scrollBar = d.scrollBar || {}
    d.scrollBar.size = 15

    d.mapId = {}
    d.mapPid = {}
    d.data.forEach((item) => {
      d.mapId[item.id] = item
      d.mapPid[item.pid] = d.mapPid[item.pid] || []
      d.mapPid[item.pid].push(item)
    })
    d.head = d.mapId[d.headId]

    {
      const headNodes = []

      d.data.forEach((node) => {
        while (node && !node.visited) {
          node.visited = true
          const _node = d.mapId[node.pid]
          if (!_node && !headNodes.includes(node)) {
            headNodes.push(node)
            break
          }
          node = _node
        }
      })
      d.data.forEach((v) => delete v.visited)
      d.root = headNodes.shift()

      if (headNodes.length > 0) {
        console.warn('数据存在' + (headNodes.length + 1) + '棵树，只绘制根节点为 ' + d.root.id + ' 的树，根节点为 ' + headNodes.map(v => v.id).join(',') + ' 的树不做绘制')
      }
    }

    me.setPath()
    me.setDepth()
    me.initEvents()
  }
  setPath() {
    const me = this
    const d = me.d
    let node = d.mapId[d.headId]

    d.path = []

    while (node) {
      d.path.push(node)
      node.isMain = true
      node = d.mapId[node.pid]
    }
  }
  setDepth() {
    const me = this
    const d = me.d

    const setDepth = (node, depth = 0) => {
      if (!node) return
      node.depth = depth
      d.maxDepth = Math.max(d.maxDepth, depth + 1)
      d.stair[depth] = d.stair[depth] || []
      node.hIndex = d.stair[depth].length
      d.stair[depth].push(node)
      me.getChildren(node).forEach((item) => {
        setDepth(item, depth + 1)
      })
    }

    d.maxDepth = 0
    d.stair = []
    setDepth(d.root)
  }
  getPrev(node) {
    if (!node) return
    return this.d.stair[node.depth][node.hIndex - 1]
  }
  getNext(node) {
    if (!node) return
    return this.d.stair[node.depth][node.hIndex + 1]
  }
  getChildren(node) {
    return this.d.mapPid[(node || {}).id] || []
  }
  initEvents() {
    const me = this
    const d = me.d
    const {canvas} = d
    const size = d.conf.rect.size
    let x1 = 0
    let y1 = 0
    let vx = 0
    let vy = 0
    let oldX = 0
    let oldY = 0
    let originX = 0
    let originY = 0

    d.isMouseDown = false

    document.onmousedown = canvas.ontouchstart = (e) => {
      cancelAnimationFrame(d.timerAni)
      x1 = (e.touches ? e.touches[0] : e).clientX
      y1 = (e.touches ? e.touches[0] : e).clientY
      vx = 0
      vy = 0
      oldX = x1
      oldY = y1
      originX = d.translate.x
      originY = d.translate.y
      d.isMouseDown = true
      me.render(e)
    }

    d.fnMove = (e) => {
      const x2 = (e.touches ? e.touches[0] : e).clientX
      const y2 = (e.touches ? e.touches[0] : e).clientY

      let x = x2 - x1 + originX
      let y = y2 - y1 + originY

      if (d.onEl === d.scrollBar) {
        // 拖拽滚动条
        const scale = d.w / d.scrollWidth
        let x = (x1 - x2) / scale + originX
        let y = (y1 - y2) / scale + originY

        x > 0 && (x = 0)
        x < (d.w - d.scrollWidth) && (x = d.w - d.scrollWidth)

        y > 0 && (y = 0)
        y < (d.h - d.scrollHeight) && (y = d.h - d.scrollHeight)

        d.translate.x = x
      } else if (d.isMouseDown) {
        x > 0 && (x = 0)
        x < (d.w - d.scrollWidth) && (x = d.w - d.scrollWidth)

        y > 0 && (y = 0)
        y < (d.h - d.scrollHeight) && (y = d.h - d.scrollHeight)

        d.translate.x = x
        // d.translate.y = y

        vx = x2 - oldX
        vy = y2 - oldY
        oldX = x2
        oldY = y2
      } else {
        
      }
      me.render(e)
    }

    d.fnUp = (e) => {
      const x3 = (e.touches ? e.touches[0] : e).clientX
      const y3 = (e.touches ? e.touches[0] : e).clientY

      d.isMouseDown = false
      localStorage.translate = JSON.stringify(d.translate)

      if (!d.onEl && Math.abs(vx) > 4) {
        const loopRender = () => {
          d.timerAni = requestAnimationFrame(() => {
            let x, isStop

            vx *= .98
            x = d.translate.x + vx

            x > 0 && (x = 0)
            x < (d.w - d.scrollWidth) && (x = d.w - d.scrollWidth)

            isStop = Math.abs(vx) < 1 || x === 0 || x === d.w - d.scrollWidth
            d.translate.x = x

            me.render()
            
            if (isStop) {
              console.log('stop animate')
              localStorage.translate = JSON.stringify(d.translate)
            } else {
              loopRender()
            }
          })
        }
        cancelAnimationFrame(d.timerAni)
        loopRender()
      }

      delete d.onEl
      me.render(e)
    }

    document.addEventListener('mousemove', d.fnMove, false)
    document.addEventListener('touchmove', d.fnMove, false)
    document.addEventListener('mouseup', d.fnUp, false)
    document.addEventListener('touchend', d.fnUp, false)

    me.handleWindowResize = () => {
      const w = canvas.parentNode.offsetWidth
      const h = canvas.parentNode.offsetHeight

      d.w = w
      d.h = h
      d.cx = w / 2
      d.cy = h / 2

      // canvas.style.width = w + 'px'
      // canvas.style.height = h + 'px'

      canvas.width = w * d.conf.scale
      canvas.height = h * d.conf.scale

      me.setLayout()
      me.render()
    }
    me.handleWindowResize()
    window.addEventListener('resize', me.handleWindowResize, false)
  }
  setPos(x, y) {

  }
  setPosWithAnimation(x, y) {

  }
  translate(node, x = 0, y = 0) {
    const translate = (item) => {
      item.x += x
      item.y += y
      this.getChildren(item).forEach(translate)
    }
    translate(node)
  }
  setLayout() {
    const me = this
    const d = me.d
    const {canvas} = d

    switch (d.mode) {
      case 'mini':
        d.stair.forEach((siblings, depth, arr) => {
          siblings.forEach((item) => {
            item.x = (item.hIndex - siblings.length / 2) * d.conf.itemWidth
            item.y = item.depth * d.conf.lineHeight
          })
        })
        break
      case 'straight-mini':
        d.stair.forEach((siblings, depth, arr) => {
          const mainNode = d.path[arr.length - 1 - depth - (d.maxDepth - d.path.length)]
          const index = mainNode ? mainNode.hIndex : siblings.length / 2

          mainNode && (mainNode.x = 0)

          siblings.forEach((item) => {
            item.x = (item.hIndex - index) * d.conf.itemWidth
            item.y = item.depth * d.conf.lineHeight
          })
        })
        break
      case 'straight':
      default:
        for (let depth = d.stair.length - 1; depth > -1; depth--) {
          d.stair[depth].forEach((node, idx = 0) => {
            const children = me.getChildren(node)

            node.y = node.depth * d.conf.lineHeight

            if (children.length > 0) {
              node.x = (children[0].x + children[children.length - 1].x) / 2
            } else if (idx === 0 && depth < d.maxDepth - 1) {
              node.x = d.stair[depth + 1].last().x
            } else {
              const nodeL = me.getPrev(node)
              node.x = nodeL ? nodeL.x + d.conf.itemWidth : 0
            }

            const arr = []
            let _node = node

            while (_node) {
              const nodeL = me.getPrev(_node)

              if (nodeL && _node.x - nodeL.x < d.conf.itemWidth) {
                arr.push(nodeL.x - _node.x + d.conf.itemWidth)
              }

              _node = me.getChildren(_node)[0]
            }

            arr.length > 0 && me.translate(node, Math.max(...arr))

            if (children.length > 0) {
              let nodeL = me.getPrev(node)

              while (nodeL && nodeL.pid === node.pid) {
                if (d.mapPid[nodeL.id]) {
                  const siblings = d.stair[node.depth]
                  const dis = node.x - nodeL.x
                  const len = node.hIndex - nodeL.hIndex
                  const per = dis / len

                  for (let i = 1; i < len; i++) {
                    siblings[nodeL.hIndex + i].x = nodeL.x + i * per
                  }
                  break
                }
                nodeL = me.getPrev(nodeL)
              }
            }
          })
        }

        if (d.mode === 'straight' && d.path.length > 0) {
          d.path.forEach((node, idx) => {
            const siblings = d.stair[node.depth]
            const translateX = d.head.x - node.x

            siblings.forEach((item) => {
              item.x = (item.hIndex - node.hIndex) * d.conf.itemWidth + d.head.x
            })
          })
        }
        break
    }

    d.data.forEach((item) => {
      let t

      if (d.usingFlip) item.x *= -1

      switch (d.direction) {
        case 'bt':
          item.y *= -1
          item.x *= -1
          break
        case 'lr':
          t = item.x
          item.x = item.y
          item.y = -t
          break
        case 'rl':
          t = item.x
          item.x = -item.y
          item.y = t
          break
        default:
          // 默认
          break
      }
    })

    d.root && me.translate(d.root, d.cx - d.root.x, d.cy - d.root.y)

    if (d.direction.indexOf('l') > -1) {
      d.scrollWidth = (d.maxDepth - 1) * d.conf.lineHeight + d.w
      d.scrollHeight = Math.max(...d.stair.map(arr => Math.abs(arr[0].y - arr.last().y))) + d.h
    } else {
      d.scrollHeight = (d.maxDepth - 1) * d.conf.lineHeight + d.w
      d.scrollWidth = Math.max(...d.stair.map(arr => Math.abs(arr[0].x - arr.last().x))) + d.h
    }
  }
  render(e) {
    const me = this
    const d = me.d
    const {canvas, gd} = d
    const size = d.conf.rect.size
    const pos = canvas.getBoundingClientRect()
    const offsetX = (e ? (e.touches ? e.touches[0] : e).clientX - pos.left : 0) * d.conf.scale
    const offsetY = (e ? (e.touches ? e.touches[0] : e).clientY - pos.top : 0) * d.conf.scale
    let _isPointInPath = false

    const renderLine = (node) => {
      me.getChildren(node).forEach((item) => {
        renderLine(item)

        const isMain = node.isMain && item.isMain
        const x1 = node.x
        const y1 = node.y

        const x4 = item.x
        const y4 = item.y

        let x2, x3, y2, y3

        if (d.direction.indexOf('l') > -1) {
          x2 = (x1 + x4) / 2
          x3 = (x1 + x4) / 2

          y2 = y1
          y3 = y4
        } else {
          x2 = x1
          x3 = x4

          y2 = (y1 + y4) / 2
          y3 = (y1 + y4) / 2
        }

        gd.beginPath()
        gd.lineTo(x1, y1)
        gd.bezierCurveTo(
          x2, y2,
          x3, y3,
          x4, y4,
        )

        gd.strokeStyle = isMain ? '#09f' : 'rgba(128,128,128,1)'
        gd.lineWidth = isMain ? 2 : 1
        gd.stroke()
      })
    }

    const renderNode = (node) => {
      if (!node) return

      const children = me.getChildren(node)

      children.forEach(renderNode)

      gd.beginPath()
      gd.rect(node.x - size.width / 2, node.y - size.height / 2, size.width, size.height)
      const isPointInPath = e && gd.isPointInPath(offsetX, offsetY)
      if (isPointInPath) {
        if (e.type === 'mouseup') {
          d.click && d.click(e, node)
        }
      }
      _isPointInPath = _isPointInPath || isPointInPath
      gd.fillStyle = isPointInPath ? d.conf[d.isMouseDown ? 'itemActiveBgColor' : 'itemHoverBgColor'] : d.conf.itemLinkBgColor
      gd.fill()

      if (0) {
        gd.beginPath()
        gd.fillStyle = '#fff'
        gd.font = '14px Arial'
        gd.textAlign = 'center'
        gd.textBaseline = 'middle'
        gd.fillText(node.id, node.x, node.y)
      }
    }

    gd.fillStyle = '#000'
    gd.fillRect(0, 0, canvas.width, canvas.height)

    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    gd.translate(d.translate.x, d.translate.y)
    renderLine(d.root)
    renderNode(d.root)
    gd.restore()

    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)

    if (d.w < d.scrollWidth) {
      // 绘制横向滚动条
      const barW = d.w / d.scrollWidth * d.w
      const x = d.translate.x / d.scrollWidth * d.w
      const y = d.h - d.scrollBar.size

      gd.beginPath()
      gd.rect(0, y, d.w, d.scrollBar.size)
      gd.fillStyle = 'rgba(128,128,128,.3)'
      gd.fill()

      gd.beginPath()
      gd.rect(-x, y, barW, d.scrollBar.size)
      const isPointInPath = e && gd.isPointInPath(offsetX, offsetY)
      if (isPointInPath) {
        if (e.type === 'mousedown') d.onEl = d.scrollBar
      }
      _isPointInPath = _isPointInPath || isPointInPath
      gd.fillStyle = isPointInPath ? 'rgba(128,128,128,.7)' : 'rgba(128,128,128,.5)'
      gd.fill()
    }

    gd.restore()

    canvas.style.cursor = _isPointInPath ? 'pointer' : 'default'
  }
  destroy() {
    const me = this
    const d = me.d

    window.removeEventListener('resize', me.handleWindowResize, false)

    d.canvas.onmousedown = 
    d.canvas.onmousemove = null

    document.removeEventListener('mousemove', d.fnMove, false)
    document.removeEventListener('touchmove', d.fnMove, false)
    document.removeEventListener('mouseup', d.fnUp, false)
    document.removeEventListener('touchend', d.fnUp, false)

    for (let key in me) delete me[key]
    for (let key in d) delete d[key]
  }
}
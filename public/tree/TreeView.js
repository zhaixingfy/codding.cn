class TreeView {
  constructor(d) {
    const me = this

    me.d = d

    {
      if (!d.data || d.data.length === 0) {
        console.warn('TreeView Warning data 是空的，不绘图')
        return
      }

      let idRepeat = {}

      d.data.forEach((node) => {
        if (node.id === node.pid) {
          throw new Error('TreeView Error 数据异常 node.id === node.pid，错误的id是：' + node.id)
        }

        idRepeat[node.id] = idRepeat[node.id] || 0
        idRepeat[node.id]++
        node.x = 0
        node.y = 0
        node.from = {
          x: 0,
          y: 0,
        }
        node.to = {
          x: 0,
          y: 0,
        }

        if (idRepeat[node.id] > 1) {
          throw new Error('TreeView Error 数据异常 id 重复，重复id是：' + node.id)
        }
      })
    }

    d.gd = d.canvas.getContext('2d')
    d.direction = (d.direction || '').toLowerCase()
    d.scroll = {
      width: 0,
      height: 0,
      left: 0,
      top: 0,
    }
    d.conf = {
      scale: 2,
      lineHeight: 50,
      spaceBetween: 30,
      rect: {
        size: {
          width: 28,
          height: 20,
        }
      }
    }
    d.mapId = {}
    d.mapPid = {}
    d.data.forEach((node) => {
      d.mapId[node.id] = node
      d.mapPid[node.pid] = d.mapPid[node.pid] || []
      d.mapPid[node.pid].push(node)
    })
    d.root = d.data[0]

    {
      let uniHead = []

      const loopUni = (node) => {
        node.visited = true
        me.getChildren(node).forEach(loopUni)
      }

      d.data.forEach((node) => {
        if (node.visited) return
        uniHead.push(node)
        loopUni(node)
      })

      const renderHead = uniHead.shift()

      if (uniHead.length > 0) {
        console.warn('TreeView Warning 数据存在'+ (uniHead.length + 1) +'棵树。 只绘制根节点为 ' + renderHead.id + ' 的树,  根节点为 ' + uniHead.map(v=>v.id).join(', ') + ' 的树不做绘制')
      }
    }

    me.setDepth()
    me.initEvents()
    me.setLayout()
    me.setPos(d.cx, d.cy)
  }
  getChildren(node) {
    return this.d.mapPid[(node || {}).id] || []
  }
  setDepth() {
    const me = this
    const d = me.d

    const setDepth = (node, depth = 0, idx = 0) => {
      node.depth = depth
      node.index = idx
      d.stair[depth] = d.stair[depth] || []
      node.hIndex = d.stair[depth].length
      d.stair[depth].push(node)
      d.maxDepth = Math.max(d.maxDepth, depth)

      me.getChildren(node).forEach((item, idx) => {
        setDepth(item, depth + 1, idx)
      })
    }

    d.stair = []
    d.maxDepth = 0
    setDepth(d.root)
  }
  translate(node, x = 0, y = 0) {
    const me = this
    const d = me.d

    const translate = (node) => {
      me.getChildren(node).forEach(translate)
      node.x += x
      node.y += y
    }

    translate(node)
  }
  prev(node) {
    return (this.d.stair[node.depth] || {})[node.hIndex - 1]
  }
  next(node = {}) {
    return (this.d.stair[node.depth] || {})[node.hIndex + 1]
  }
  setLayout() {
    const me = this
    const d = me.d
    const {canvas} = d

    for (let depth = d.stair.length - 1; depth > -1; depth--) {
      const arr = d.stair[depth]

      arr.forEach((node, idx, arr) => {
        const children = me.getChildren(node)
        let nodeL = arr[idx - 1]

        node.y = depth * d.conf.lineHeight

        if (idx === 0 && depth < d.maxDepth) {
          const tmp = d.stair[node.depth + 1]
          const drNode = tmp[tmp.length - 1]
          node.x = drNode.x
        } else {
          node.x = idx * d.conf.spaceBetween
        }

        if (children.length > 0) {
          node.x = (children[0].x + children[children.length - 1].x) / 2
        }

        if (nodeL && node.x - nodeL.x < d.conf.spaceBetween) {
          me.translate(node, nodeL.x - node.x + d.conf.spaceBetween)
        }

        if (children.length === 0) return

        const child = children[children.length - 1]
        const childR = me.next(child)

        if (childR && childR.x - child.x < d.conf.spaceBetween) {
          me.translate(d.mapId[childR.pid], child.x - childR.x + d.conf.spaceBetween)
        }

        let _node = node

        while (nodeL && nodeL.pid === _node.pid) {
          if (me.getChildren(nodeL).length > 0) {
            const siblings = d.stair[node.depth]
            const dis = node.x - nodeL.x
            const len = node.hIndex - nodeL.hIndex
            const per = dis / len
            
            for (let i = 1; i < len; i++) {
              siblings[nodeL.hIndex + i].x = i * per + nodeL.x
            }
            break
          }
          _node = nodeL
          nodeL = me.prev(nodeL)
        }
      })
    }

    d.data.forEach((item) => {
      let t

      if (d.usingFlip) item.x *= -1

      switch (d.direction) {
        case 'bt':
          item.y *= -1
          break
        case 'lr':
        case 'rl':
          t = item.x
          item.x = d.direction === 'lr' ? item.y : -item.y
          item.y = t
          break
        default:
          // 默认
          break
      }
    })
    // me.translate(d.root, d.cx - d.root.x, d.cy - d.root.y)
  }
  initEvents() {
    const me = this
    const d = me.d

    let isMouseDown = false
    let x1 = 0
    let y1 = 0
    let originX = 0
    let originY = 0
    let vx = 0
    let vy = 0
    let oldX = 0
    let oldY = 0

    d.canvas.onmousedown = (e) => {
      x1 = e.offsetX
      y1 = e.offsetY
      originX = d.scroll.left
      originY = d.scroll.top
      isMouseDown = true
    }

    d.canvas.onmousemove = (e) => {
      const x2 = e.offsetX
      const y2 = e.offsetY

      if (isMouseDown) {
        d.scroll.left = x2 - x1 + originX
        d.scroll.top = y2 - y1 + originY
      } else {

      }

      me.render(e)
    }

    d.canvas.onmouseup = (e) => {
      isMouseDown = false
      me.render(e)
    }

    me.handleWindowResize = (e) => {
      const w = canvas.parentNode.offsetWidth
      const h = canvas.parentNode.offsetHeight

      canvas.width = w * d.conf.scale
      canvas.height = h * d.conf.scale

      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'

      d.w = w
      d.h = h
      d.cx = w / 2
      d.cy = h / 2

      e && me.render()
    }

    me.handleWindowResize()
    window.addEventListener('resize', me.handleWindowResize, false)
  }
  render() {
    const me = this
    const d = me.d
    const {canvas, gd} = d
    const size = d.conf.rect.size

    const renderLine = (node) => {
      me.getChildren(node).forEach((item) => {
        renderLine(item)

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
        gd.strokeStyle = 'rgba(128,128,128,1)'
        gd.stroke()
      })
    }

    const renderNode = (node) => {
      me.getChildren(node).forEach(renderNode)
      gd.beginPath()
      gd.rect(node.x - size.width / 2, node.y - size.height / 2, size.width, size.height)
      gd.fillStyle = 'rgba(128,128,128,.75)'
      gd.fill()

      if (1) {
        gd.save()
        gd.translate(node.x, node.y)
        gd.font = '12px Arial'
        gd.textAlign = 'center'
        gd.textBaseline = 'middle'
        gd.fillStyle = '#fff'
        gd.fillText(node.id, 0, 0)
        gd.restore()
      }
    }

    // gd.clearRect(0, 0, canvas.width, canvas.height)
    gd.beginPath()
    gd.fillStyle = '#000'
    gd.fillRect(0, 0, canvas.width, canvas.height)

    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    gd.translate(d.scroll.left, d.scroll.top)
    renderLine(d.root)
    renderNode(d.root)
    gd.restore()
  }
  setXY(node, x = 0, y = 0) {
    const setXY = (node) => {
      node.x = node.from.x = x
      node.y = node.from.y = y
      me.getChildren(node).forEach(setXY)
    }
    setXY(node)
  }
  setPos(x = 0, y = 0) {
    const me = this
    const d = me.d

    me.translate(d.root, x - d.root.x, y - d.root.y)
    me.render()
  }
  toggleFlip() {
    const me = this
    const d = me.d
    const {x, y} = d.root

    d.usingFlip = !d.usingFlip
    me.setLayout()
    me.setPos(x, y)
    me.render()
  }
  setDirection(direction) {
    const me = this
    const d = me.d
    const {x, y} = d.root

    d.direction = direction
    me.setLayout()
    me.setPos(x, y)
    me.render()
  }
  destroy() {
    const me = this
    const d = me.d
    const {canvas} = d

    window.removeEventListener('resize', me.handleWindowResize, false)
    d.canvas.onmousedown = d.canvas.onmousemove = d.canvas.onmouseup = null

    for (let key in d) delete d[key]
    for (let key in this) delete this[key]
  }
}

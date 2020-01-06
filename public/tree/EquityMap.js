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

class EquityMap {
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
      item.from = {x: 0, y: 0}
      item.to = {x: 0, y: 0}
      item.x = 0
      item.y = 0
      idRepeat[item.id] = idRepeat[item.id] || 0
      idRepeat[item.id]++
      if (idRepeat[item.id] > 1) throw new Error('id重复，重复的id是 ' + item.id)
      if (item.id === item.pid) throw new Error('数据错误 id === pid 错误的id是 ' + item.id)
    })

    /*try {
      d.translate = JSON.parse(localStorage.translate)
    } catch (e) {
      d.translate = {}
    }*/
    d.translate = d.translate || {}
    d.translate.x = d.translate.x || 0
    d.translate.y = d.translate.y || 0

    d.conf = d.conf || {}
    d.conf.duration = d.conf.duration || 300
    d.conf.rect = d.conf.rect || {}
    d.conf.rect.size = d.conf.rect.size || {}
    d.conf.rect.size.width = d.conf.rect.size.width || 26
    d.conf.rect.size.height = d.conf.rect.size.height || 20
    d.conf.itemLinkBgColor = d.conf.itemLinkBgColor || 'rgba(128,128,128,1)'
    d.conf.itemHoverBgColor = d.conf.itemHoverBgColor || '#FF9800'
    d.conf.itemActiveBgColor = d.conf.itemActiveBgColor || '#FF5722'
    d.conf.scale = d.conf.scale || 2
    d.conf.lineHeight = d.conf.lineHeight || 50
    d.conf.spaceBetween = d.conf.spaceBetween || 2
    d.conf.itemWidth = d.conf.rect.size.width + d.conf.spaceBetween

    d.scrollBar = d.scrollBar || {}
    d.scrollBar.size = 15

    d.mapId = {}
    d.mapPid = {}
    d.gd.font = '13px Arial'
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
        console.warn('数据存在' + (headNodes.length + 1) + '棵树，只绘制根节点为 ' + d.root.id + ' 的树，根节点为 ' + headNodes.map(v => v.id).join(',') + ' 的树和根节点不连通，不做绘制')
      }
    }

    me.imgPreset(() => {
      me.initEvents()
      this.cbReady && this.cbReady()
      delete this.cbReady
    })
  }
  ready(cb) {
    this.cbReady = cb
  }
  async imgPreset(cb) {
    const me = this
    const d = me.d
    const {canvas, gd} = d
    const imgSize = 16
    const r = imgSize / 2
    const size = d.conf.rect.size
    const w = size.width - 10
    const h = size.height
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')

    svg.setAttribute('width', w)
    svg.setAttribute('height', h)

    for (let i = 0; i < d.data.length; i++) {
      const node = d.data[i]

      svg.innerHTML = `
        <foreignObject x="0" y="0" width="${w}" height="${h}">
          <div xmlns="http://www.w3.org/1999/xhtml"
            style="width: 100%; height: 100%; text-align: center; font-size: 12px; display: flex; align-items: center; justify-content: center;"
          >
            <div class="inner">
              <div style="width: ${w}px; line-height: 1.5em; max-height: 3em; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2;">${(node.name)}</div>
              <div style="width: ${w}px; text-align: center; color: #666; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${node.cash}</div>
            </div>
          </div>
        </foreignObject>
      `

      let xml = new XMLSerializer().serializeToString(svg)
      xml = encodeURIComponent(xml)
      xml = unescape(xml)
      xml = btoa(xml)
      node.svgImg = new Image()
      node.svgImg.src = 'data:image/svg+xml;base64,' + xml

      await new Promise((next) => {
        node.svgImg.onload = (e) => {
          next()
        }
      })
    }

    canvas.style.display = 'none'
    canvas.width = imgSize * d.conf.scale
    canvas.height = imgSize * d.conf.scale

    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    {
      gd.beginPath()
      gd.arc(r, r, r - 1, 0, 2 * Math.PI)
      gd.fillStyle = '#fff'
      gd.fill()
      gd.strokeStyle = '#09f'
      gd.stroke()

      gd.beginPath()
      gd.rect(1, r - .5, imgSize - 2, 1)
      gd.fillStyle = '#09f'
      gd.fill()

      d.imgMinus = new Image()
      d.imgMinus.src = canvas.toDataURL()

      gd.beginPath()
      gd.rect(r - .5, 1, 1, imgSize - 2)
      gd.fillStyle = '#09f'
      gd.fill()

      d.imgPlus = new Image()
      d.imgPlus.src = canvas.toDataURL()
    }
    gd.restore()

    let count = 0
    d.imgMinus.onload = d.imgPlus.onload = (e) => {
      if (++count >= 2) {
        cb()
      }
    }

    // document.getElementById('img-box').appendChild(d.imgMinus)
    // document.getElementById('img-box').appendChild(d.imgPlus)
  }
  setGroupDepth() {
    const me = this
    const d = me.d

    const setPrev = (node) => {
      node.isPrev_ = true
      me.getChildren(node).forEach(setPrev)
    }

    const setGroupDepth = (node, depth = 0) => {
      const direction = node.isPrev_ ? 'prev' : 'next'
      const stair = d.groupStair[direction][depth] = d.groupStair[direction][depth] || []
      node.hIndex = stair.length
      stair.push(node)
      node.depth = depth
      node.isOpen = node.isOpen || depth < 1
      node.isOpen && me.getChildren(node).forEach((item) => {
        setGroupDepth(item, depth + 1)
      })
    }

    delete d.root.isPrev_
    d.groupStair = {
      prev: [],
      next: [],
    }
    d.groupStair[d.root.isPrev_ ? 'next' : 'prev'].push([d.root])
    ;(d.mapPid[d.root.id] || []).filter(v => v.isPrev).forEach(setPrev)
    setGroupDepth(d.root)
  }
  getPrev(node) {
    if (!node) return
    return this.d.groupStair[node.isPrev_ ? 'prev' : 'next'][node.depth][node.hIndex - 1]
  }
  getChildren(node) {
    if (!node || !node.isOpen) return []
    return this.d.mapPid[node.id] || []
  }
  initEvents() {
    const me = this
    const d = me.d
    const {canvas} = d
    const size = d.conf.rect.size
    let x1 = 0
    let y1 = 0
    let originX = 0
    let originY = 0

    d.isMouseDown = false

    d.fnDown = (e) => {
      x1 = (e.touches ? e.touches[0] : e).clientX
      y1 = (e.touches ? e.touches[0] : e).clientY
      originX = d.translate.x
      originY = d.translate.y
      d.isMouseDown = true
      me.render(e)

      if (!e.touches) {
        document.onmousemove = d.fnMove
        document.onmouseup = d.fnUp
      }
    }

    d.fnMove = (e) => {
      const x2 = (e.touches ? e.touches[0] : e).clientX
      const y2 = (e.touches ? e.touches[0] : e).clientY

      let x = x2 - x1 + originX
      let y = y2 - y1 + originY

      if (d.isMouseDown) {
        d.translate.x = x
        d.translate.y = y
      } else {
        
      }
      me.render(e)
    }

    d.fnUp = (e) => {
      const x3 = (e.touches ? e.touches[0] : e).clientX
      const y3 = (e.touches ? e.touches[0] : e).clientY

      d.isMouseDown = false
      localStorage.translate = JSON.stringify(d.translate)

      me.render(e)
    }

    canvas.onmousedown = d.fnDown
    canvas.ontouchstart = d.fnDown
    canvas.ontouchmove = d.fnMove
    canvas.ontouchend = d.fnUp

    me.handleWindowResize = (e) => {
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

      canvas.style.display = ''
      me.setAnimate()
    }
    me.handleWindowResize()
    window.addEventListener('resize', me.handleWindowResize, false)
  }
  translate(node, x = 0, y = 0, direction) {
    const me = this
    const d = me.d
    const translate = (item) => {
      item.x += x
      item.y += y
      const children = item === d.root ? (d.groupStair[direction][1] || []) : me.getChildren(item)
      children.forEach(translate)
    }
    translate(node)
  }
  tween(t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
    return c / 2 * ((t -= 2) * t * t + 2) + b;
  }
  setAnimate(node) {
    const me = this
    const d = me.d
    const pos = d.data.map((v) => {
      return {
        x: v.x,
        y: v.y,
      }
    })

    me.setGroupDepth()
    me.setLayout()

    d.data.forEach((item, idx) => {
      item.to.x = item.x
      item.to.y = item.y
      item.x = pos[idx].x
      item.y = pos[idx].y
    })

    const setPos = (item) => {
      if (!item) return
      item.isOpen && me.getChildren(item).forEach(setPos)
      item.x = item.from.x = node.x
      item.y = item.from.y = node.y
    }

    setPos(node)
    this.animate()
  }
  animate() {
    const me = this
    const d = me.d

    const loopRender = () => {
      d.timerAni = requestAnimationFrame(() => {
        const timeDis = Date.now() - d.timeStartAni
        const isStop = timeDis > d.conf.duration
        const scale = timeDis / d.conf.duration

        d.data.forEach((node) => {
          node.x = node.from.x + (node.to.x - node.from.x) * scale
          node.y = node.from.y + (node.to.y - node.from.y) * scale
        })

        if (isStop) {
          console.log('stop animate')
          d.data.forEach((item) => {
            item.x = item.from.x = item.to.x
            item.y = item.from.y = item.to.y
          })
          me.render()
        } else {
          me.render()
          loopRender()
        }
      })
    }

    d.timeStartAni = Date.now()
    cancelAnimationFrame(d.timerAni)
    loopRender()
  }
  setLayout() {
    const me = this
    const d = me.d
    const {canvas} = d

    const setLayout = (direction) => {
      const stair = d.groupStair[direction]

      for (let depth = stair.length - 1; depth > -1; depth--) {
        stair[depth].forEach((node, idx = 0) => {
          const children = node === d.root ? ((d.groupStair[direction])[1] || []) : me.getChildren(node)

          node.y = (direction === 'prev' ? -1 : 1) * node.depth * d.conf.lineHeight

          if (children.length > 0) {
            node.x = (children[0].x + children.last().x) / 2
          } else if (idx === 0 && depth < stair.length - 1) {
            node.x = stair[depth + 1].last().x
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
 
          arr.length > 0 && me.translate(node, Math.max(...arr), 0, direction)

          if (children.length > 0) {
            let nodeL = me.getPrev(node)

            while (nodeL && nodeL.pid === node.pid) {
              if (me.getChildren(nodeL.id).length > 0) {
                const siblings = stair[node.depth]
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

      d.root && me.translate(d.root, - d.root.x, - d.root.y, direction)
    }

    ;['prev', 'next'].forEach((direction) => {
      setLayout(direction)
    })
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
      if (!node || !node.isOpen) return

      me.getChildren(node).forEach((item) => {
        renderLine(item)

        const isMain = node.isMain && item.isMain
        const x1 = node.x
        const y1 = node.y

        const x4 = item.x
        const y4 = item.y - (size.height / 2 + 10) * (item.isPrev_ ? -1 : 1)

        const x5 = item.x
        const y5 = item.y

        const x3 = x4
        const y3 = y1 + (size.height / 2) * (item.isPrev_ ? - 1 : 1)

        // 绘制曲线
        gd.beginPath()
        gd.lineTo(x1, y1)
        gd.quadraticCurveTo(
          x3, y3,
          x4, y4,
        )
        gd.lineTo(x5, y5)
        gd.strokeStyle = isMain ? '#09f' : 'rgba(128,128,128,1)'
        gd.lineWidth = isMain ? 2 : 1
        gd.stroke()

        // 画三角
        {
          const x = node.x
          const y = node.y - size.height / 2 - 15

          gd.beginPath()
          gd.lineTo(x4 - 5, y4 - 4)
          gd.lineTo(x4 + 5, y4 - 4)
          gd.lineTo(x4, y4 + 4)
          gd.fillStyle = 'rgba(128,128,128,1)'
          gd.fill()
        }
      })
    }

    const renderNode = (node) => {
      if (!node) return

      const children = me.getChildren(node)

      node.isOpen && children.forEach(renderNode)

      gd.beginPath()
      gd.rect(node.x - size.width / 2, node.y - size.height / 2, size.width, size.height)
      const isPointInPath = e && gd.isPointInPath(offsetX, offsetY)
      if (isPointInPath && e.type === 'mouseup') {
        d.click && d.click(e, node)
      }
      _isPointInPath = _isPointInPath || isPointInPath
      gd.lineWidth = 2
      gd.strokeStyle = isPointInPath ? '#09f' : 'rgba(128,128,128,.5)'
      gd.stroke()
      gd.fillStyle = 'rgba(255,255,255,1)'
      gd.fill()

      if (1) {
        const w = node.svgImg.width
        const h = node.svgImg.height

        gd.beginPath()
        gd.drawImage(
          node.svgImg,
          node.x - w / 2, node.y - h / 2, w, h
        )
      }

      if (node !== d.root) {
        if (d.mapPid[node.id]) {
          const x4 = node.x
          const y4 = node.y + (size.height / 2 + 10) * (node.isPrev_ ? -1 : 1)
          const imgSize = d.imgMinus.width / d.conf.scale

          gd.beginPath()
          gd.drawImage(
            d[node.isOpen ? 'imgMinus' : 'imgPlus'],
            x4 - imgSize / 2, y4 - imgSize / 2, imgSize, imgSize
          )
          gd.rect(x4 - imgSize / 2, y4 - imgSize / 2, imgSize, imgSize)
          const isPointInPath = e && gd.isPointInPath(offsetX, offsetY)
          _isPointInPath = _isPointInPath || isPointInPath

          if (isPointInPath && e.type === 'mouseup') {
            setTimeout(() => {
              node.isOpen = !node.isOpen
              me.setAnimate(node)
            }, 1)
          }
        }

        if (node.isControl) {
          const x5 = node.x - 12
          const y5 = node.y - (size.height / 2 + 10) * (node.isPrev_ ? -1 : 1)

          gd.beginPath()
          gd.font = '12px Arial'
          gd.textAlign = 'right'
          gd.textBaseline = 'middle'
          gd.fillStyle = '#09f'
          gd.fillText('控股', x5, y5)
        }

        if (node.percent) {
          const x5 = node.x + 12
          const y5 = node.y - (size.height / 2 + 10) * (node.isPrev_ ? -1 : 1)

          gd.beginPath()
          gd.font = '12px Arial'
          gd.textAlign = 'left'
          gd.textBaseline = 'middle'
          gd.fillStyle = '#09f'
          gd.fillText(node.percent, x5, y5)
        }
      }
    }

    gd.clearRect(0, 0, canvas.width, canvas.height)

    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    gd.translate(d.translate.x, d.translate.y)
    renderLine(d.root)
    renderNode(d.root)
    gd.restore()

    canvas.style.cursor = _isPointInPath ? 'pointer' : 'default'
  }
  destroy() {
    const me = this
    const d = me.d

    window.removeEventListener('resize', me.handleWindowResize, false)

    d.canvas.onmousedown =
    d.canvas.ontouchstart =
    d.canvas.ontouchmove =
    d.canvas.ontouchend = null

    for (let key in me) delete me[key]
    for (let key in d) delete d[key]
  }
}
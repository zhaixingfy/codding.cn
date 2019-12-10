class BrainMap extends Common {
  constructor() {
    super(...arguments)

    const d = this.d

    d.btn.onclick = (e) => {
      if (e) {
        d.usingAni = true
        this.create()
      }
    }
  }
  async create() {
    const d = this.d

    d.mapTree = {}
    d.mapNode = {}
    d.itemHeight = 22
    d.levelHeight = 60
    d.contentWidth = 600
    d.contentHeight = 420
    this.setSize('noSpace')

    d.dataList = [
      {id: 1, pid: 0, name: 'aaa'},
      {id: 2, pid: 1, name: 'bbb'},
      {id: 3, pid: 1, name: 'ccc'},
      {id: 4, pid: 2, name: 'ddd'},
      {id: 5, pid: 2, name: 'eee'},
      {id: 6, pid: 2, name: 'fff'},
      {id: 7, pid: 3, name: 'ggg'},
      {id: 8, pid: 3, name: 'hhh'},
      {id: 9, pid: 3, name: 'iii'},
      {id: 10, pid: 5, name: 'iii'},
      {id: 11, pid: 5, name: 'jjj'},
      {id: 12, pid: 5, name: 'kkk'},
      {id: 13, pid: 5, name: 'lll'},
      {id: 14, pid: 9, name: 'mmm'},
      {id: 15, pid: 9, name: 'nnn'},
      {id: 16, pid: 12, name: 'ooo'},
    ]

    d.gd.font = d.conf.font
    d.dataList.forEach((item, idx) => {
      item.width = Math.ceil(d.gd.measureText(item.name).width) + 16
      item.x = 0
      item.y = 0
      item.from = {x: d.contentWidth / 2 - item.width / 2, y: 30}
      item.to = {x: 0, y: 0}
      d.mapTree[item.pid] = d.mapTree[item.pid] || []
      d.mapTree[item.pid].push(item)
      d.mapNode[item.id] = item
    })

    d.root = d.mapTree[0][0]

    this.initEvents()
    await this.animate()
    setTimeout(() => {
      d.usingAni = true
    }, 20)
  }
  initEvents() {
    const d = this.d

    d.isMousedown = false

    d.canvas.onkeydown = async (e) => {
      if (e.ctrlKey && e.altKey && e.keyCode === 70) {
        await this.animate()
      }
    }

    d.canvas.onmousedown = d.canvas.onmouseup = (e) => {
      d.isMousedown = e.type === 'mousedown'

      if (d.isMousedown) {
        if (d.elOn) {
          d.x1 = e.clientX
          d.y1 = e.clientY
          const setOrigin = (node) => {
            node.origin = {
              x: node.x,
              y: node.y,
            }
            ;(d.mapTree[node.id] || []).forEach((item, idx) => {
              setOrigin(d.mapNode[item.id])
            })
          }
          setOrigin(d.elOn)
        }
      }
    }

    d.canvas.onmousemove = (e) => {
      if (d.isMousedown && d.elOn) {
        d.x2 = e.clientX
        d.y2 = e.clientY

        const dixX = d.x2 - d.x1
        const dixY = d.y2 - d.y1

        const updateCoord = (node) => {
          if (!node) return

          node.x = node.from.x = node.to.x = dixX + node.origin.x
          node.y = node.from.y = node.to.y = dixY + node.origin.y

          ;(d.mapTree[node.id] || []).forEach((item, idx) => {
            updateCoord(item)
          })
        }
        updateCoord(d.elOn)
      } else {
        delete d.elOn
      }
      this.render(e)
    }
  }
  nextFrame(isStop) {
    const d = this.d

    d.dataList.forEach((item, idx) => {
      this.updatePos(item, isStop)
    })
  }
  getSibling(node) {
    const d = this.d
    return d.mapTree[(d.mapNode[node.pid] || {}).id] || []
  }
  setPos() {
    const d = this.d

    d.iLeft = 0

    d.dataList.forEach((item, idx) => {
      delete item.visited
    })

    const setPos = (list, depth = 0) => {
      list && list.forEach((node, idx) => {
        const children = d.mapTree[node.id] || []
        const sibling = this.getSibling(node)
        let w = sibling.reduce((total, item) => {
          return total += item.width + 20
        }, 0) - 20
        setPos(children, depth + 1)

        node.to.y = depth * d.levelHeight + 60

        if (node === sibling.first()) {
          let nodeP = node
          let _w = w

          while (nodeP && !nodeP.visited) {
            nodeP.visited = true
            _w = Math.max(_w, nodeP.width)
            nodeP = d.mapNode[nodeP.pid]
          }

          d.iLeft += (_w - w) / 2
        }

        if (children.length > 0) {
          // 非叶子节点
          const first = children.first()
          const last = children.last()
          node.to.x = parseInt((first.to.x + last.to.x + last.width) / 2 - node.width / 2)
          d.iLeft = Math.max(node.width + node.to.x, last.width + last.to.x) + 20
        } else {
          // 叶子节点
          node.to.x = d.iLeft
          d.iLeft += node.width + 20
        }
      })
    }

    const updateCoord = (list) => {
      list && list.forEach((item, idx) => {
        updateCoord(d.mapTree[item.id])
        item.to.x += d.translateX
      })
    }

    setPos(d.mapTree[0])
    d.translateX = (d.contentWidth / 2 - d.mapTree[0][0].to.x - d.root.width / 2)
    updateCoord(d.mapTree[0])

    if (!d.usingAni) {
      d.dataList.forEach((node, idx) => {
        node.x = node.from.x = node.to.x
        node.y = node.from.y = node.to.y
      })
    }
  }
  render(e) {
    const d = this.d
    const {gd} = d

    d.canvas.style.cursor = ''

    const renderLine = () => {
      Object.keys(d.mapTree).forEach((key, idx) => {
        if (d.mapTree[key] === d.mapTree[0]) return

        const list = d.mapTree[key]
        const nodeP = d.mapNode[list[0].pid]
        const x1 = nodeP.x + nodeP.width / 2
        const y1 = nodeP.y + d.itemHeight / 2

        list.forEach((node, idx) => {
          const x2 = x1
          const y2 = y1 + d.levelHeight / 2 + d.itemHeight / 2

          const x3 = node.x + node.width / 2
          const y3 = node.y - d.levelHeight / 2

          const x4 = node.x + node.width / 2
          const y4 = node.y + d.itemHeight / 2

          gd.beginPath()
          gd.moveTo(x1, y1)
          gd.bezierCurveTo(
            x2, y2,
            x3, y3,
            x4, y4,
          )
          gd.strokeStyle = '#000'
          gd.stroke()
        })
      })
    }

    const renderNode = () => {
      d.dataList.forEach((node, idx) => {
        gd.beginPath()
        gd.rect(node.x + .5, node.y + .5, node.width, d.itemHeight)
        gd.fillStyle = node.fillStyle || 'rgba(255, 255, 255, .9)'
        gd.fill()
        gd.strokeStyle = '#000'
        gd.stroke()

        if (e && gd.isPointInPath(e.offsetX * d.conf.scale, e.offsetY * d.conf.scale)) {
          d.canvas.style.cursor = 'move'
          if (!d.isMousedown) {
            d.elOn = node
          }
        }

        gd.fillStyle = '#000'
        gd.font = d.conf.font
        gd.textAlign = 'center'
        gd.textBaseline = 'middle'
        gd.fillText(node.name, node.x + node.width / 2, node.y + d.itemHeight / 2 + 1)
      })
    }

    gd.fillStyle = '#fff'
    gd.fillRect(0, 0, d.canvas.width, d.canvas.height)
    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    renderLine()
    renderNode()
    gd.restore()
  }
}
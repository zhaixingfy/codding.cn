# codding.cn

<a href="http://codding.cn" target="_blank">**我的世界 | By 田小号**</a>

<img src="http://codding.cn/readme/index-1.jpg">

<img src="http://codding.cn/readme/index-2.jpg">

<img src="http://codding.cn/readme/index-3.jpg">

<img src="http://codding.cn/readme/index-4.jpg">

<img src="http://codding.cn/readme/index-5.jpg">

<img src="http://codding.cn/readme/index-6.jpg">

<img src="http://codding.cn/readme/index-7.jpg">

<!-- 
-node_modules/*,-dist/*,-oxdproxy.js,-*.md,-.min.js,-video/*
 -->

 ```js
 return this.r.listDir || [{
   path: 'c:/',
   style: {
     width: '600px',
     height: '400px',
     left: '10%',
     top: '30px'
   }
 }]
 ```
 
 ```js
 class TreeView {
  constructor(d = {}) {
    const me = this
    me.d = d

    d.gd = d.canvas.getContext('2d')
    d.conf = {
      spaceBetween: 2,
      lineHeight: 40,
      itemWidth: 30,
      itemHeight: 20,
    }
    d.mapId = {}
    d.mapPid = {}

    me.init()
  }
  init() {
    const me = this
    const d = me.d

    d.gd.font = '14px Arial'
    d.data.forEach((v) => {
      v.width = Math.ceil(d.gd.measureText(v.id).width) + 20
      d.mapId[v.id] = v
      d.mapPid[v.pid] = d.mapPid[v.pid] || []
      d.mapPid[v.pid].push(v)
    })

    d.root = d.data[0]

    for (let i = 0, len = d.data.length; i < len; i++) {
      const node = d.data[i]
      if (node.id == node.pid)
        throw new Error('node.id == node.pid', node.id, node.pid)
    }

    me.setDepth()
    me.setLayout()
    {
      const space = 40
      const l = Math.min(...d.data.map(v => v.x))
      const r = Math.max(...d.data.map(v => v.x + v.width))

      d.canvas.width = r - l + space
      d.canvas.height = Math.max(...d.data.map(v => v.y + d.conf.itemHeight)) + space
      me.translate(d.root, -l + space / 2, space / 2)
    }
    me.render()
  }
  setDepth() {
    const me = this
    const d = me.d

    d.stair = []

    const setDepth = (node, depth = 0) => {
      !d.stair[depth] && (d.stair[depth] = [])
      node.hIdx = d.stair[depth].length
      node.depth = depth
      d.stair[depth].push(node)

      ;(d.mapPid[node.id] || []).forEach((v) => {
        setDepth(v, depth + 1)
      })
    }

    setDepth(d.root)
  }
  translate(node, x, y) {
    const me = this
    const d = me.d

    const translate = (node) => {
      node.x += x
      node.y += y
      ;(d.mapPid[node.id] || []).forEach(translate)
    }
    translate(node)
  }
  setLayout() {
    const me = this
    const d = me.d

    for (let depth = d.stair.length - 1; depth > -1; depth--) {
      const row = d.stair[depth]
      row.forEach((v, idx, arr) => {
        const nodePrev = arr[idx - 1]
        const children = d.mapPid[v.id] || []

        if (children.length > 0) {
          const head = children.first()
          const tail = children.last()
          v.x = (head.x + tail.x + tail.width) / 2 - v.width / 2
        } else {
          v.x = nodePrev ? nodePrev.x + nodePrev.width : 0
        }

        if (nodePrev && nodePrev.hIdx === 0 && !d.mapPid[nodePrev.id] && v.x > nodePrev.x + v.width) {
          me.translate(nodePrev, v.x - nodePrev.width, 0)
        }

        {
          let nodeL = nodePrev
          let nodeR = v

          while (nodeL && nodeR) {
            if (nodeL.x + nodeL.width > nodeR.x) {
              me.translate(v, nodeL.x + nodeL.width - nodeR.x, 0)
            }
            nodeR = (d.mapPid[nodeR.id] || []).first()
            nodeR && (nodeL = d.stair[nodeR.depth][nodeR.hIdx - 1])
          }
        }

        v.y = depth * d.conf.lineHeight
      })
    }
  }
  render() {
    const me = this
    const d = me.d
    const {canvas, gd} = d

    const renderLine = () => {
      gd.beginPath()

      d.data.forEach((v) => {
        const nodeP = d.mapId[v.pid]
        if (!nodeP) return
        const x1 = v.x + v.width / 2
        const y1 = v.y + d.conf.itemHeight / 2

        const x4 = nodeP.x + nodeP.width / 2
        const y4 = nodeP.y + d.conf.itemHeight / 2

        const x2 = x1
        const y2 = (y1 + y4) / 2

        const x3 = x4
        const y3 = (y1 + y4) / 2

        gd.moveTo(x1, y1)
        gd.bezierCurveTo(
          x2, y2,
          x3, y3,
          x4, y4,
        )
      })

      gd.strokeStyle = '#000'
      gd.stroke()
    }

    const renderNode = () => {
      gd.beginPath()
      d.data.forEach((v) => {
        gd.rect(v.x + 1, v.y, v.width - 2, d.conf.itemHeight)
      })
      gd.fillStyle = 'rgba(0,170,255,.75)'
      gd.fill()

      gd.font = '14px Arial'
      gd.textAlign = 'center'
      gd.textBaseline = 'middle'
      gd.fillStyle = '#fff'
      d.data.forEach((v) => {
        gd.fillText(v.id, v.x + v.width / 2, v.y + d.conf.itemHeight / 2)
      })
    }

    gd.fillStyle = '#fff'
    gd.fillRect(0, 0, d.canvas.width, d.canvas.height)

    gd.save()
    renderLine()
    renderNode()
    gd.restore()
  }
}
 ```

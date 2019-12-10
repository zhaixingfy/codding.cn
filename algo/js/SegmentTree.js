class SegmentTree extends Common {
  constructor() {
    super(...arguments)

    const d = this.d

    // d.usingAni = true
    d.delay = 1

    d.n = 10
    d.level = Math.ceil(Math.log(d.n + 1) / Math.log(2)) + 1
    d.len = Math.pow(2, d.level) - 1
    d.branchIndex = parseInt((d.len - 2) / 2)

    d.contentWidth = Math.pow(2, d.level - 1) * d.conf.itemWidth
    d.contentHeight = (d.level - 1) * d.conf.levelHeight + d.conf.itemHeight
    this.setSize()

    d.btn.onclick = (e) => {
      d.signAni = Math.random()
      d.usingAni = d.usingAni || !!e
      d.gd.font = d.conf.font
      d.arr = new Array(d.len).fill().map(() => {
        return new Node(null, {
          x: d.contentWidth / 2 - d.conf.itemWidth / 2,
          y: 0,
          from: {
            x: d.contentWidth / 2 - d.conf.itemWidth / 2,
            y: 0,
          },
        })
      })

      d.duration = 500

      if (e) {
        this[d.typeItem.startFn](d.typeItem.arg)
      }
    }

    d.btn.onclick()
  }
  async create(arg) {
    const d = this.d

    await this.animate()

    d.usingAni && (d.duration = 150)

    const create = async (treeIndex, l, r) => {
      if (l >= r) {
        d.arr[treeIndex].fillStyle = d.color.blue
        d.arr[treeIndex].n = '[' + l + ']'
        await this.animate()
        return
      }

      d.arr[treeIndex].fillStyle = d.color.blue
      d.arr[treeIndex].n = '[' + l + '..' + r + ']'
      d.arr[treeIndex].width = Math.max(d.conf.itemWidth, d.gd.measureText(d.arr[treeIndex].n).width + 10)
      await this.animate()


      if (arg.isL) {
        const mid = l + Math.floor((r - l) / 2)
        await create(treeIndex * 2 + 1, l, mid)
        await create(treeIndex * 2 + 2, mid + 1, r)
      } else {
        const mid = l + Math.ceil((r - l) / 2)
        await create(treeIndex * 2 + 1, l, mid - 1)
        await create(treeIndex * 2 + 2, mid, r)
      }
    }

    await create(0, 0, d.n)
  }
  nextFrame(isStop) {
    const d = this.d

    d.arr.forEach((node, idx) => {
      this.updatePos(node, isStop)
    })
  }
  setPos() {
    const d = this.d
    let count = 0

    for (let i = 0; i < d.level; i++) {
      const n = Math.pow(2, i)
      const perW = d.contentWidth / n

      for (let j = 0; j < n && count + j < d.arr.length; j++) {
        const index = count + j
        const node = d.arr[index]

        if (d.usingAni) {
          node.to.x = perW * j + perW / 2 - d.conf.itemWidth / 2
          node.to.y = i * d.conf.levelHeight
        } else {
          node.x = perW * j + perW / 2 - d.conf.itemWidth / 2
          node.y = i * d.conf.levelHeight
        }
      }

      count += n
    }
  }
  render() {
    const d = this.d
    const {gd} = d

    const renderLine = () => {
      for (let i = d.branchIndex; i > -1; i--) {
        const node = d.arr[i]
        const nodeL = d.arr[i * 2 + 1]
        const nodeR = d.arr[i * 2 + 2]

        gd.beginPath()
        nodeL && gd.lineTo(nodeL.x + d.conf.itemWidth / 2, nodeL.y + d.conf.itemHeight / 2)
        gd.lineTo(node.x + d.conf.itemWidth / 2, node.y + d.conf.itemHeight / 2)
        nodeR && gd.lineTo(nodeR.x + d.conf.itemWidth / 2, nodeR.y + d.conf.itemHeight / 2)
        gd.strokeStyle = d.color.black
        gd.stroke()
      }
    }

    const renderNode = () => {
      d.arr.forEach((node, idx) => {
        this.renderNode(node)
      })
    }

    gd.fillStyle = d.color.white
    gd.fillRect(0, 0, d.canvas.width, d.canvas.height)

    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    gd.translate(d.conf.paddingH, d.conf.paddingV)
    renderLine()
    renderNode()
    gd.restore()
  }
}
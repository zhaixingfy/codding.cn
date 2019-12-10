class Tree extends Common {
  constructor() {
    super(...arguments)

    const d = this.d

    d.delay = 200
    d.paddingTop = 60
    d.contentWidth = d.arr.length * d.conf.itemWidth
    this.setSize()

    d.btn.onclick = async (e) => {
      d.signAni = Math.random()
      d.usingAni = d.usingAni || !!e
      d.arr = d.raw.clone()
      d.root = d.root2 = null

      if (e) {
        d.duration = 500
        await this.animate()
        d.duration = 300
        this[d.typeItem.startFn](d.typeItem.arg)
      }
    }
  }
  updateCoord(translateX) {
    const d = this.d
    const updateCoord = (node) => {
      if (!node) return

      updateCoord(node.l)
      updateCoord(node.r)

      if (d.usingAni) {
        node.to.x += translateX
      } else {
        node.x += translateX
      }
    }

    ;[d.root, d.root2].forEach((rootNode, idx) => {
      updateCoord(rootNode)
    })
  }
  nextFrame(isStop) {
    const d = this.d

    d.arr.forEach((node, idx) => {
      this.updatePos(node, isStop)
    })

    const loopUpdatePos = (node) => {
      if (!node) return

      loopUpdatePos(node.l)
      loopUpdatePos(node.r)

      this.updatePos(node, isStop)
    }

    ;[d.root, d.root2].forEach((rootNode, idx) => {
      loopUpdatePos(rootNode)
    })
  }
  setPos() {
    const d = this.d
    const itemWidth = d.itemWidth || d.conf.itemWidth
    const itemHeight = d.itemHeight || d.conf.itemHeight
    const levelHeight = d.levelHeight || d.conf.levelHeight

    d.iLeft = 0
    d.contentHeight = 0

    d.arr.forEach((node, idx) => {
      if (d.usingAni) {
        node.to.x = idx * d.conf.itemWidth
      } else {
        node.x = idx * d.conf.itemWidth
      }
    })

    const setPos = (node, depth) => {
      if (!node) return

      setPos(node.l, depth + 1)
      if (d.usingAni) {
        node.to.x = d.iLeft
        d.iLeft += itemWidth / 2
        node.to.y = depth * levelHeight + d.paddingTop
      } else {
        node.x = d.iLeft
        d.iLeft += itemWidth / 2
        node.y = depth * levelHeight + d.paddingTop
      }
      setPos(node.r, depth + 1)

      d.contentHeight = Math.max(d.contentHeight, d.usingAni ? node.to.y : node.y)

      if (node.l && node.r) {
        if (d.usingAni) {
          node.to.x = (node.l.to.x + node.r.to.x) / 2
        } else {
          node.x = (node.l.x + node.r.x) / 2
        }
      }
    }

    ;[d.root, d.root2].forEach((rootNode, idx) => {
      if (!rootNode) return
      setPos(rootNode, 0)
      d.iLeft += itemWidth / 2
    })

    this.updateCoord((d.contentWidth - d.iLeft) / 2)

    d.canvas.height = (d.contentHeight + d.conf.paddingV * 3 + d.conf.itemHeight) * d.conf.scale
  }
  render() {
    const d = this.d
    const {gd} = d
    const itemWidth = d.itemWidth || d.conf.itemWidth
    const itemHeight = d.itemHeight || d.conf.itemHeight

    const renderArr = () => {
      d.arr.forEach((node, idx) => {
        this.renderNode(node, {itemWidth: d.conf.itemWidth})
      })
    }

    const renderLIne = (node) => {
      if (!node) return

      renderLIne(node.l)
      renderLIne(node.r)

      gd.beginPath()
      node.l && gd.lineTo(node.l.x + itemWidth / 2, node.l.y + itemHeight / 2)
      gd.lineTo(node.x + itemWidth / 2, node.y + itemHeight / 2)
      node.r && gd.lineTo(node.r.x + itemWidth / 2, node.r.y + itemHeight / 2)
      gd.strokeStyle = d.color.black
      gd.stroke()
    }

    const renderNode = (node) => {
      if (!node) return

      renderNode(node.l)
      renderNode(node.r)

      this.renderNode(node)
    }

    gd.fillStyle = d.color.white
    gd.fillRect(0, 0, d.canvas.width, d.canvas.height)

    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    gd.translate(d.conf.paddingH, d.conf.paddingV)
    renderArr()
    ;[d.root, d.root2].forEach((rootNode, idx) => {
      renderLIne(rootNode)
      renderNode(rootNode)
    })
    gd.restore()
  }
}

class BinarySearch extends Tree {
  async create() {
    const d = this.d

    await d.arr.clone().forEachSync(async (node, idx) => {
      node.fillStyle = d.color.blue
      d.root = this.add(d.root, node)
      await this.animate()
    })
  }
  async flip() {
    const d = this.d

    const flip = (node) => {
      if (!node) return

      flip(node.l)
      flip(node.r)

      const t = node.l
      node.l = node.r
      node.r = t

      return node
    }

    await this.create()
    d.root2 = flip(clone(d.root))

    d.duration = 1500
    await this.animate()
  }
  add(node, item) {
    if (!node) return item

    if (item.n > node.n) {
      node.r = this.add(node.r, item)
    } else if (item.n < node.n) {
      node.l = this.add(node.l, item)
    } else {
      // ===
    }

    return node
  }
}

class AVLTree extends Tree {
  constructor() {
    super(...arguments)

    const d = this.d

    d.paddingTop = 100
    d.itemWidth = 50
    d.levelHeight = 64
  }
  async create() {
    const d = this.d

    await d.arr.clone().forEachSync(async (node, idx) => {
      node.h = 1
      node.balanceFactor = 0
      node.fillStyle = d.color.blue
      d.root = await this.add(d.root, node)
      await this.animate()
    })
  }
  async add(node, item) {
    if (!node) return item

    if (item.n > node.n) {
      node.r = await this.add(node.r, item)
    } else if (item.n < node.n) {
      node.l = await this.add(node.l, item)
    } else {
      // ===
    }

    const balanceFactor = this.getBalanceFactor(node)

    if (Math.abs(balanceFactor) > 1) {
      await this.animate()

      if (balanceFactor > 0) {
        if (this.getBalanceFactor(node.l) < 0)
          node.l = this.leftRotate(node.l)
        node = this.rightRotate(node)
      } else {
        if (this.getBalanceFactor(node.r) > 0)
          node.r = this.rightRotate(node.r)
        node = this.leftRotate(node)
      }
    }

    node.h = Math.max(this.getHeight(node.l), this.getHeight(node.r)) + 1
    node.balanceFactor = this.getBalanceFactor(node)

    return node
  }
  getHeight(node) {
    return node ? node.h : 0
  }
  getBalanceFactor(node) {
    return node ? this.getHeight(node.l) - this.getHeight(node.r) : 0
  }
  leftRotate(x) {
    const d = this.d
    const y = x.r

    x.r = y.l
    y.l = x

    x.h = Math.max(this.getHeight(x.l), this.getHeight(x.r)) + 1
    y.h = Math.max(this.getHeight(y.l), this.getHeight(y.r)) + 1

    x.balanceFactor = this.getBalanceFactor(x)
    y.balanceFactor = this.getBalanceFactor(y)

    return y
  }
  rightRotate(x) {
    const d = this.d
    const y = x.l

    x.l = y.r
    y.r = x

    x.h = Math.max(this.getHeight(x.l), this.getHeight(x.r)) + 1
    y.h = Math.max(this.getHeight(y.l), this.getHeight(y.r)) + 1

    x.balanceFactor = this.getBalanceFactor(x)
    y.balanceFactor = this.getBalanceFactor(y)

    return y
  }
}

class RBTree extends Tree {
  constructor() {
    super(...arguments)
  }
  async create() {
    const d = this.d

    // d.usingAni = true

    await d.arr.clone().forEachSync(async (node, idx) => {
      node.fillStyle = d.color.red
      d.root = await this.add(d.root, node)
      d.root.fillStyle = d.color.black
      await this.animate()
    })
    await d.arr.clone().forEachSync(async (node, idx) => {
      node.fillStyle = d.color.red
      d.root2 = await this.add(d.root2, node, 'addR')
      d.root2.fillStyle = d.color.black
      await this.animate()
    })
  }
  async add(node, item, isR) {
    if (!node) return item

    if (item.n > node.n) {
      node.r = await this.add(node.r, item, isR)
    } else if (item.n < node.n) {
      node.l = await this.add(node.l, item, isR)
    } else {
      // ===
    }

    this.isRed(node) && (isR ? this.isRed(node.l) : this.isRed(node.l)) && await this.animate()

    if (isR) {
      if (this.isRed(node.l) && !this.isRed(node.r)) node = this.rightRotate(node)
      if (this.isRed(node.r) && this.isRed(node.r.r)) node = this.leftRotate(node)
    } else {
      if (!this.isRed(node.l) && this.isRed(node.r)) node = this.leftRotate(node)
      if (this.isRed(node.l) && this.isRed(node.l.l)) node = this.rightRotate(node)
    }

    if (this.isRed(node.l) && this.isRed(node.r)) this.flipColors(node)

    return node
  }
  isRed(node) {
    const d = this.d
    return node ? node.fillStyle === d.color.red : false
  }
  flipColors(node) {
    const d = this.d
    node.l.fillStyle = node.r.fillStyle = d.color.black
    node.fillStyle = d.color.red
  }
  leftRotate(x) {
    const d = this.d
    const y = x.r

    x.r = y.l
    y.l = x

    y.fillStyle = x.fillStyle
    x.fillStyle = d.color.red

    return y
  }
  rightRotate(x) {
    const d = this.d
    const y = x.l

    x.l = y.r
    y.r = x

    y.fillStyle = x.fillStyle
    x.fillStyle = d.color.red

    return y
  }
}

class Tree23 extends RBTree {
  constructor() {
    super(...arguments)
  }
  async create() {
    const d = this.d

    await d.arr.clone().forEachSync(async (node, idx) => {
      node.fillStyle = d.color.red
      d.root = await this.add(d.root, node)
      d.root.fillStyle = d.color.black
      await this.animate()
    })
  }
  setPos() {
    const d = this.d
    const itemWidth = d.itemWidth || d.conf.itemWidth
    const itemHeight = d.itemHeight || d.conf.itemHeight
    const levelHeight = d.levelHeight || d.conf.levelHeight

    d.iLeft = 0
    d.contentHeight = 0

    d.arr.forEach((node, idx) => {
      if (d.usingAni) {
        node.to.x = idx * d.conf.itemWidth
      } else {
        node.x = idx * d.conf.itemWidth
      }
    })

    const setPos = (node, depth) => {
      if (!node) return

      setPos(node.l, depth + (this.isRed(node.l) ? 0 : 1))
    
      if (d.usingAni) {
        node.to.x = d.iLeft
        d.iLeft += itemWidth / 2
        node.to.y = depth * levelHeight + d.paddingTop
      } else {
        node.x = d.iLeft
        d.iLeft += itemWidth / 2
        node.y = depth * levelHeight + d.paddingTop
      }

      if (this.isRed(node)) {
        if (!node.l && !node.r) d.iLeft += itemWidth / 2
        if (this.isRed(node.l) || this.isRed(node.r)) d.iLeft += itemWidth / 2
      }

      setPos(node.r, depth + (this.isRed(node.r) ? 0 : 1))
      d.contentHeight = Math.max(d.contentHeight, d.usingAni ? node.to.y : node.y)
    }

    ;[d.root, d.root2].forEach((rootNode, idx) => {
      if (!rootNode) return
      setPos(rootNode, 0)
      d.iLeft += itemWidth / 2
    })

    this.updateCoord((d.contentWidth - d.iLeft) / 2)
    d.canvas.height = (d.contentHeight + d.conf.paddingV * 3 + d.conf.itemHeight) * d.conf.scale
  }
}
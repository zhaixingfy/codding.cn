class Heap extends Common {
  constructor() {
    super(...arguments)

    const d = this.d

    d.delay = 200
    d.level = Math.ceil(Math.log(d.arr.length + 1) / Math.log(2))
    d.branchIndex = parseInt((d.arr.length - 2) / 2)
    d.paddingTop = 70

    d.contentWidth = d.arr.length * d.conf.itemWidth
    d._contentWidth = Math.pow(2, d.level - 1) * d.conf.itemWidth
    d.contentHeight = (d.level - 1) * d.conf.levelHeight + d.conf.itemHeight + d.paddingTop
    d.translateX = (d.contentWidth - d._contentWidth) / 2
    this.setSize()

    d.btn.onclick = (e) => {
      d.signAni = Math.random()
      d.arr = d.raw.clone()
      d._arr = d.arr.clone()
      d._arr_ = d.arr.clone()
      d.usingAni = d.usingAni || !!e
      d.duration = 500

      if (e) {
        this[d.typeItem.startFn](d.typeItem.arg)
      }
    }

    d.btn.onclick()
  }
  async heapify() {
    const d = this.d
    const signAni = d.signAni

    await this.animate()

    d.usingAni && (d.duration = 100)

    for (let i = d.arr.length - 1; i > d.branchIndex; i--) {
      if (signAni !== d.signAni) return

      d.arr[i].fillStyle = d.color.blue
      d._arr_[i].fillStyle = d.color.blue

      if (d.usingAni) {
        this.render()
        await sleep(100)
      }
    }

    d.usingAni && (d.duration = 200)
    await this.animate()

    for (let i = d.branchIndex; i > -1; i--) {
      await this.shiftDown(i)
    }
  }
  async shiftDown(k) {
    const d = this.d

    while (k * 2 + 1 < d.arr.length) {
      let j = k * 2 + 1

      d.arr[k].fillStyle = d.color.green
      d._arr_[k].fillStyle = d.arr[k].fillStyle
      await this.animate()

      d.arr[j].fillStyle = d.color.orange
      d._arr_[j].fillStyle = d.arr[j].fillStyle
      await this.animate()

      if (j + 1 < d.arr.length && d.arr[j + 1].n > d.arr[j].n) {
        d.arr[j].fillStyle = d.color.blue
        d._arr_[j].fillStyle = d.arr[j].fillStyle
        d.arr[j + 1].fillStyle = d.color.orange
        d._arr_[j + 1].fillStyle = d.arr[j + 1].fillStyle
        j++
        await this.animate()
      }

      if (d.arr[k].n >= d.arr[j].n) {
        d.arr[k].fillStyle = d.color.blue
        d._arr_[k].fillStyle = d.arr[k].fillStyle
        d.arr[j].fillStyle = d.color.blue
        d._arr_[j].fillStyle = d.arr[j].fillStyle
        await this.animate()
        break
      }

      d.arr.swap(k, j)
      d._arr_.swap(k, j)
      await this.animate()

      d.arr[k].fillStyle = d.color.blue
      d._arr_[k].fillStyle = d.arr[k].fillStyle

      if (!(j * 2 + 1 < d.arr.length)) {
        d.arr[j].fillStyle = d.color.blue
        d._arr_[j].fillStyle = d.arr[j].fillStyle
        await this.animate()
      }

      k = j
    }
  }
  async shiftUp(k) {
    const d = this.d

    while (k > 0) {
      let j = parseInt((k - 1) / 2)

      d.arr[k].fillStyle = d.color.green
      d._arr_[k].fillStyle = d.color.green
      await this.animate()

      d.arr[j].fillStyle = d.color.orange
      d._arr_[j].fillStyle = d.color.orange
      await this.animate()

      if (d.arr[j].n > d.arr[k].n) {
        d.arr[k].fillStyle = d.color.blue
        d._arr_[k].fillStyle = d.color.blue
        d.arr[j].fillStyle = d.color.blue
        d._arr_[j].fillStyle = d.color.blue
        await this.animate()
        break
      }

      d.arr.swap(k, j)
      d._arr_.swap(k, j)
      await this.animate()

      d.arr[k].fillStyle = d.color.blue
      d._arr_[k].fillStyle = d.color.blue

      if (parseInt((k - 1) / 2) === 0) {
        d.arr[j].fillStyle = d.color.blue
        d._arr_[j].fillStyle = d.color.blue
        await this.animate()
      }

      k = j
    }
  }
  async createByShiftUp() {
    const d = this.d
    const signAni = d.signAni

    await this.animate()

    d.usingAni && (d.duration = 200)

    for (let i = 1; i < d.arr.length; i++) {
      if (signAni !== d.signAni) return
      await this.shiftUp(i)
    }
  }
  nextFrame(isStop) {
    const d = this.d

    ;[
      d._arr,
      d._arr_,
      d.arr,
    ].forEach((arr, idx) => {
      arr.forEach((node, idx) => {
        this.updatePos(node, isStop)
      })
    })
  }
  setPos() {
    const d = this.d
    let count = 0

    ;[d._arr, d._arr_].forEach((arr, stair) => {
      arr.forEach((node, idx) => {
        if (d.usingAni) {
          node.to.x = idx * d.conf.itemWidth
          node.to.y = stair * (d.conf.itemHeight + 2)
        } else {
          node.x = idx * d.conf.itemWidth
          node.y = stair * (d.conf.itemHeight + 2)
        }
      })
    })

    for (let i = 0; i < d.level; i++) {
      const n = Math.pow(2, i)
      const perW = d._contentWidth / n

      for (let j = 0; j < n && count + j < d.arr.length; j++) {
        const index = count + j
        const node = d.arr[index]

        if (d.usingAni) {
          node.to.x = perW * j + perW / 2 - d.conf.itemWidth / 2 + d.translateX
          node.to.y = i * d.conf.levelHeight + d.paddingTop
        } else {
          node.x = perW * j + perW / 2 - d.conf.itemWidth / 2 + d.translateX
          node.y = i * d.conf.levelHeight + d.paddingTop
        }
      }

      count += n
    }
  }
  render() {
    const d = this.d
    const {gd} = d
    const itemWidth = d.itemWidth || d.conf.itemWidth
    const itemHeight = d.itemHeight || d.conf.itemHeight

    const renderArr = () => {
      ;[d._arr, d._arr_].forEach((arr, idx) => {
        arr.forEach((node, idx) => {
          this.renderNode(node)
        })
      })
    }

    const renderLine = () => {
      const isPreReady = d.duration === 500

      for (let i = d.branchIndex; i > -1; i--) {
        const node = d.arr[i]
        const nodeL = d.arr[i * 2 + 1]
        const nodeR = d.arr[i * 2 + 2]

        gd.beginPath()
        if (isPreReady) {
          nodeL && gd.lineTo(nodeL.x + itemWidth / 2, nodeL.y + itemHeight / 2)
          gd.lineTo(node.x + itemWidth / 2, node.y + itemHeight / 2)
          nodeR && gd.lineTo(nodeR.x + itemWidth / 2, nodeR.y + itemHeight / 2)
        } else {
          nodeL && gd.lineTo(nodeL.to.x + itemWidth / 2, nodeL.to.y + itemHeight / 2)
          gd.lineTo(node.to.x + itemWidth / 2, node.to.y + itemHeight / 2)
          nodeR && gd.lineTo(nodeR.to.x + itemWidth / 2, nodeR.to.y + itemHeight / 2)
        }
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
    renderArr()
    renderLine()
    renderNode()
    gd.restore()
  }
}
class Node {
  constructor(n, o) {
    o = {
      n,
      x: 0,
      y: 0,
      from: {
        x: 0,
        y: 0,
      },
      to: {
        x: 0,
        y: 0,
      },
      fillStyle: Algo.color.black,
      strokeStyle: Algo.color.black,
      ...o,
    }

    for (let key in o) {
      this[key] = o[key]
    }
  }
}

class Common {
  constructor(d = {}) {
    this.d = d
    d.gd.font = d.conf.font
  }
  updatePos(node, isStop) {
    if (!node) return

    const d = this.d
    const duration = Date.now() - d.timeStart
    const _duration = d.duration || d.conf.duration
    const fn = Tween['Quad']['easeInOut']

    if (isStop) {
      node.x = node.from.x = node.to.x
      node.y = node.from.y = node.to.y
    } else {
      node.x = node.from.x + fn(duration, 0, 1, _duration) * (node.to.x - node.from.x)
      node.y = node.from.y + fn(duration, 0, 1, _duration) * (node.to.y - node.from.y)
    }
  }
  animate() {
    const d = this.d
    const signAni = d.signAni
    const _duration = d.duration || d.conf.duration

    if (!d.usingAni) return

    return new Promise((next) => {
      const renderLoop = () => {
        if (signAni !== d.signAni) return

        const isStop = d.isStop || (Date.now() - d.timeStart >= _duration) || (signAni !== d.signAni)

        this.nextFrame(isStop)
        this.render()

        if (isStop) {
          console.log('stop')
          d.timerAni = 0
          d.delay ? setTimeout(_ => signAni === d.signAni && next(), d.delay) : next()
        } else {
          d.timerAni = requestAnimationFrame(renderLoop)
        }
      }

      d.timeStart = Date.now()
      this.setPos()
      cancelAnimationFrame(d.timerAni)
      renderLoop()
    })
  }
  renderNode(node, o = {}) {
    if (!node) return

    const d = this.d
    const {gd} = d
    const itemWidth = node.width || o.itemWidth || d.itemWidth || d.conf.itemWidth
    const itemHeight = node.height || o.itemHeight || d.itemHeight || d.conf.itemHeight
    const x = node.width ? node.x - (node.width - (d.itemWidth || d.conf.itemWidth)) / 2 : node.x

    gd.save()
    gd.globalAlpha = .8
    gd.beginPath()
    gd.rect(x + 1, node.y, itemWidth - 2, itemHeight)
    gd.fillStyle = node.fillStyle
    gd.fill()
    gd.restore()

    gd.textAlign = 'center'
    gd.textBaseline = 'middle'
    gd.font = d.conf.font
    gd.fillStyle = d.color.white
    gd.fillText(node.n, x + itemWidth / 2, node.y + itemHeight / 2)
    // gd.fillText(node.n + '-' + node.fromIndex , x + itemWidth / 2, node.y + itemHeight / 2)

    if ('balanceFactor' in node) {
      gd.textAlign = 'center'
      gd.textBaseline = 'bottom'
      gd.fillStyle = d.color.black

      ;['高度:' + node.h, '平衡:' + node.balanceFactor].forEach((str, idx, arr) => {
        gd.fillText(str, node.x + itemWidth / 2, (idx - 1) * 18 + node.y - 4)
      })
    }
  }
  setSize(noSpace) {
    const d = this.d

    d.canvas.width = (d.contentWidth + (noSpace ? 0 : d.conf.paddingH * 2)) * d.conf.scale
    d.canvas.style.width = d.canvas.width / d.conf.scale + 'px'
    d.canvas.height = (d.contentHeight + (noSpace ? 0 : d.conf.paddingV * 2)) * d.conf.scale
  }
}
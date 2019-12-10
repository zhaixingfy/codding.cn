class Fractal extends Common {
  constructor() {
    super(...arguments)

    const d = this.d
    
    d.depth = 5
    d.contentWidth = 600
    d.contentHeight = 600
    this.setSize('noSpace')
  }
  NearOne() {
    const d = this.d
    const {gd} = d

    d.depth = 12

    const fillStyle = {
      r: 0,
      g: 170,
      b: 255,
      a: 1,
    }

    fillStyle.toString = function() {
      return 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + this.a + ')'
    }

    const render = (x, y, side, depth) => {
      ++depth
      if (depth > d.depth) return

      const odd = depth % 2 === 1
      const w = odd ? side / 2 : side

      fillStyle.a = (d.depth - depth + 1) / d.depth

      gd.beginPath()
      gd.rect(x, y, w, side)
      gd.fillStyle = fillStyle.toString()
      gd.fill()
      gd.lineWidth = 1
      gd.strokeStyle = d.color.black
      gd.stroke()

      gd.textAlign = 'center'
      gd.textBaseline = 'middle'
      gd.font = (w / 5) + 'px Arial'
      gd.fillStyle = d.color.black
      gd.fillText('1/' + Math.pow(2, depth), x + w / 2, y + side / 2)

      odd && (side /= 2)
      render(x + (odd ? side : 0), odd ? side : 0, side, depth)
    }

    gd.rect(0, 0, d.canvas.width, d.canvas.height)
    gd.strokeStyle = d.color.black
    gd.stroke()

    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    render(0, 0, d.contentWidth, 0)
    gd.restore()
  }
  Fib(arg = {}) {
    const d = this.d
    const {gd} = d
    const getFibList = (end) => {
      const result = []
      let a = 1
      let b = 1

      for (let i = 0; i < end; i++) {
        result.push(a)

        const t = b
        b += a
        a = t
      }

      return result
    }

    d.fib = getFibList(15)
    d.contentWidth = d.fib[d.fib.length - 1]
    d.contentHeight = d.fib[d.fib.length - 2]
    this.setSize()

    let cx = d.fib[d.fib.length - 2]
    let cy = d.fib[d.fib.length - 2]

    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    gd.translate(d.conf.paddingH, d.conf.paddingV)

    for (let len = d.fib.length, i = len - 1; i > 2; i--) {
      const _i = (len - i + 1) % 4
      const deg = _i * 90
      const r = d.fib[i - 1]
      gd.beginPath()
      if (arg.renderAux) {
        gd.lineTo(cx, cy)
        gd.arc(cx, cy, r, d2a(deg), d2a(deg + 90))
        gd.lineTo(cx, cy)
      } else {
        gd.arc(cx, cy, r, d2a(deg), d2a(deg + 90))
      }
      gd.strokeStyle = d.color.black
      gd.stroke()

      switch (_i) {
        case 0:
          cy += d.fib[i - 3]
          break
        case 1:
          cx -= d.fib[i - 3]
          break
        case 2:
          cy -= d.fib[i - 3]
          break
        case 3:
          cx += d.fib[i - 3]
          break
      }
    }
    
    gd.restore()
  }
  Vicsek() {
    const d = this.d
    const {gd} = d
    const dir = [
      [0, 0],
      [0, 2],
      [1, 1],
      [2, 0],
      [2, 2],
    ]

    d.depth = 5

    const render = (x, y, side, depth) => {
      if (depth >= d.depth) {
        gd.beginPath()
        gd.rect(x, y, side, side)
        gd.fillStyle = d.color.blue
        gd.fill()
        return
      }

      side /= 3

      for (let i = 0; i < dir.length; i++) {
        const _x = x + side * dir[i][1]
        const _y = y + side * dir[i][0]
        render(_x, _y, side, depth + 1)
      }
    }

    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    render(0, 0, d.contentWidth, 0)
    gd.restore()
  }
  Sierpinski() {
    const d = this.d
    const {gd} = d

    const render = (x, y, side, depth) => {
      if (depth >= d.depth) return

      ++depth
      side /= 3

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (i === 1 && j === 1) {
            gd.beginPath()
            gd.rect(x + side, y + side, side, side)
            gd.fillStyle = d.color.purple
            gd.fill()
          } else {
            render(x + j * side, y + i * side, side, depth)
          }
        }
      }
    }

    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    render(0, 0, d.contentWidth, 0)
    gd.restore()
  }
  SierpinskiTriangle() {
    const d = this.d
    const {gd} = d

    const render = (x1, y1, side, depth) => {
      const x2 = x1 + side
      const y2 = y1

      const x3 = x1 + side / 2
      const y3 = y1 + side * Math.sin(d2a(-60))

      if (depth > d.depth) {
        gd.beginPath()
        gd.lineTo(x1, y1)
        gd.lineTo(x2, y2)
        gd.lineTo(x3, y3)
        gd.closePath()
        gd.fillStyle = d.color.cyan
        gd.fill()
        return
      }

      depth++
      side /= 2

      render(x1, y1, side, depth)
      render(x1 + side, y1, side, depth)
      render(x1 + side / 2, (y1 + y3) / 2, side, depth)
    }

    const space = (d.contentHeight + d.contentHeight * Math.sin(d2a(-60))) / 2

    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    render(0, d.contentHeight - space, d.contentWidth, 0)
    gd.restore()
  }
  KoachSnowflake() {
    const d = this.d
    const {gd} = d
    const _canvas = d.canvas.cloneNode()
    const _gd = _canvas.getContext('2d')

    d.depth = 4

    const render = (x1, y1, side, deg, depth) => {
      depth++
      side /= 3

      const x2 = x1 + side * Math.cos(d2a(deg))
      const y2 = y1 + side * Math.sin(d2a(deg))

      const x3 = x2 + side * Math.cos(d2a(deg - 60))
      const y3 = y2 + side * Math.sin(d2a(deg - 60))

      const x4 = x3 + side * Math.cos(d2a(deg + 60))
      const y4 = y3 + side * Math.sin(d2a(deg + 60))

      const x5 = x4 + side * Math.cos(d2a(deg))
      const y5 = y4 + side * Math.sin(d2a(deg))

      if (depth > d.depth) {
        _gd.beginPath()
        _gd.lineTo(x1, y1)
        _gd.lineTo(x2, y2)
        _gd.lineTo(x3, y3)
        _gd.lineTo(x4, y4)
        _gd.lineTo(x5, y5)
        _gd.strokeStyle = d.color.blue
        _gd.stroke()
      } else {
        render(x1, y1, side, deg, depth)
        render(x2, y2, side, deg - 60, depth)
        render(x3, y3, side, deg + 60, depth)
        render(x4, y4, side, deg, depth)
      }
    }

    const side = _canvas.width

    _gd.save()
    _gd.scale(d.conf.scale, d.conf.scale)
    render(d.contentWidth * .1, d.contentHeight / 3.72, d.contentWidth * .8, 0, 0)
    _gd.restore()

    gd.drawImage(
      _canvas,
      0, 0, _canvas.width, _canvas.height
    )
    Array(3).fill().map((_, idx, arr) => {
      const deg = 360 / arr.length * idx
      gd.save()
      gd.translate(side / 2, side / 2)
      gd.rotate(d2a(deg))
      gd.drawImage(
        _canvas,
        -side / 2, -side / 2, side, side
      )
      gd.restore()
    })
  }
  FractalTree(arg) {
    const d = this.d
    const {gd} = d

    d.depth = 12

    const render = (x1, y1, side, deg, depth) => {
      depth++

      if (depth > d.depth) return

      const x2 = x1 + side * Math.cos(d2a(deg))
      const y2 = y1 + side * Math.sin(d2a(deg))

      gd.beginPath()
      gd.lineTo(x1, y1)
      gd.lineTo(x2, y2)
      gd.strokeStyle = d.color.black
      gd.stroke()

      render(x2, y2, side * .8, deg + (arg.degL || -15), depth)
      render(x2, y2, side * .8, deg + (arg.degR || 15), depth)
    }

    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    render(
      d.contentWidth / 2 + (arg.translateX || 0),
      d.contentHeight + (arg.translateY || -40),
      arg.side || 110,
      -90,
      0
    )
    gd.restore()
  }
  setPos() {}
  render() {}
}
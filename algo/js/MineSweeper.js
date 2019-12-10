class MineSweeper extends Common {
  constructor() {
    super(...arguments)

    const d = this.d

    d.colors = Array(8).fill().map((_, idx, arr) => {
      const h = (idx / arr.length) * 360
      return 'hsla(' + h + ', 60%, 30%, 1)'
    })
    d.usingAni = true
    d.side = 34
    d.row = 20
    d.col = 20
    d.total = d.row * d.col
    d.dir = [
      [-1, 0],
      [0, 1],
      [1, 0],
      [0, -1],
    ]
    d._canvas = d.canvas.cloneNode()
    d._gd = d._canvas.getContext('2d')

    d.contentWidth = d.col * d.side
    d.contentHeight = d.row * d.side
    d.canvas.style.border = 'none'
    this.setSize()
    this.initEvents()

    // d.alertInfo = document.createElement('div')
    // d.alertInfo.innerHTML = `<div class="ib alert alert-info ib">abc</div>`
    // d.canvas.parentNode.appendChild(d.alertInfo)

    d.btn.onclick = async (e) => {
      if (e) {
        await this[d.typeItem.startFn](d.typeItem.arg)
        this.render()
      }
    }

    d.btn.onclick()
  }
  async create() {
    const d = this.d

    delete d.isWin
    await this.preset()
    
    d.arr = Array(d.row).fill().map((_, y) => {
      return Array(d.col).fill().map((_, x) => {
        return new Node(0, {isMine: y * d.col + x < d.total * .15})
      })
    })

    for (let i = d.total - 1; i > -1; i--) {
      const x1 = i % d.col
      const y1 = parseInt(i / d.col)

      const n = parseInt(Math.random() * (i + 1))
      const x2 = n % d.col
      const y2 = parseInt(n / d.col)

      const t = d.arr[y1][x1]
      d.arr[y1][x1] = d.arr[y2][x2]
      d.arr[y2][x2] = t
    }

    d.arr.forEach((row, y) => {
      row.forEach((node, x) => {
        if (node.isMine) return

        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            const newY = y + i
            const newX = x + j

            if (this.inArea(newY, newX)) {
              node.n += d.arr[newY][newX].isMine ? 1 : 0
            }
          }
        }
      })
    })
  }
  initEvents() {
    const d = this.d
    const canvas = d.canvas

    canvas.onclick = canvas.ondblclick = canvas.oncontextmenu = async (e) => {
      e.preventDefault()

      if (d.opening || d.isWin !== undefined) return
      d.opening = true

      const scale = canvas.offsetWidth / canvas.width * d.conf.scale
      const x = parseInt(e.offsetX / scale / d.side)
      const y = parseInt(e.offsetY / scale / d.side)
      const node = d.arr[y][x]

      switch (e.type) {
        case 'click':
          if (node.isOpen || node.isFlag) break
          await this.open(y, x)

          let isStop = true

          d.arr.forEach((row, idx) => {
            row.forEach((node, idx) => {
              if (!node.isMine && !node.isOpen) {
                isStop = false
              }
            })
          })

          if (isStop && d.isWin === undefined) {
            d.isWin = true
            !d.hideNotice && setTimeout(_ => alert('你赢了'), 10)
          }
          break
        case 'contextmenu':
          if (node.isOpen) break
          node.isFlag = !node.isFlag
          this.render()
          break
        case 'dblclick':
          this.paiLei(y, x)
          break
      }

      d.opening = false
    }
  }
  async preset() {
    const d = this.d
    const canvas = d._canvas
    const gd = d._gd

    canvas.width = canvas.height = d.side

    // 绘制背景
    gd.beginPath()
    gd.rect(0, 0, 100, 100)
    gd.fillStyle = '#ddd'
    gd.fill()

    gd.beginPath()
    gd.rect(0, 0, d.side, 2)
    gd.fillStyle = 'rgba(255,255,255,.7)'
    gd.fill()

    gd.beginPath()
    gd.rect(0, 0, 2, d.side)
    gd.fillStyle = 'rgba(255,255,255,.7)'
    gd.fill()

    gd.beginPath()
    gd.rect(d.side - 2, 0, 2, d.side)
    gd.fillStyle = 'rgba(0,0,0,.2)'
    gd.fill()

    gd.beginPath()
    gd.rect(0, d.side - 2, d.side, 2)
    gd.fillStyle = 'rgba(0,0,0,.2)'
    gd.fill()

    d.imgBg = await this.exportImg()

    // 绘制旗帜
    {
      const x = d.side / 2 + 4
      const y = d.side / 2 - 12

      gd.beginPath()
      gd.rect(x, y, 2, 24)
      gd.fillStyle = '#456'
      gd.fill()

      gd.beginPath()
      gd.lineTo(x, y)
      gd.lineTo(x - 14, y + 6)
      gd.lineTo(x, y + 12)
      gd.closePath()
      gd.fillStyle = '#c00'
      gd.fill()
    }

    d.imgFlag = await this.exportImg()

    // 绘制炸弹
    {
      gd.drawImage(
        d.imgBg,
        0, 0, d.side, d.side
      )

      const cx = d.side / 2
      const cy = d.side / 2

      gd.beginPath()
      gd.arc(cx, cy, 8, 0, 2 * Math.PI)
      gd.fillStyle = '#c00'
      gd.fill()
    }

    d.imgMine = await this.exportImg()

    // document.body.insertBefore(canvas, document.body.children[0])
    // document.body.insertBefore(d.imgBg, document.body.children[0])
    // document.body.insertBefore(d.imgFlag, document.body.children[0])
    // document.body.insertBefore(d.imgMine, document.body.children[0])
  }
  async paiLei(y, x) {
    
  }
  async open(y, x) {
    const d = this.d
    const node = d.arr[y][x]
    const queue = [{y, x}]

    if (node.isMine) {
      d.arr.forEach((row, idx) => {
        row.forEach((node, idx) => {
          node.isOpen = true
        })
      })

      this.render()
      d.isWin = false
      // console.log('def')
      // d.alertInfo.style.display = 'block'
      // d.alertInfo.children[0].innerHTML = '你输了'
      !d.hideNotice && setTimeout(_ => alert('你输了'), 10)
      return
    }

    node.isOpen = true

    if (node.n > 0) {
      this.render()
      return
    }

    while (queue.length > 0) {
      const {y, x} = queue.shift()
      const node = d.arr[y][x]

      // this.render()
      // await sleep(10)

      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const newX = x + j
          const newY = y + i

          if (!this.inArea(newY, newX)) continue
          
          const node = d.arr[newY][newX]

          if (!node.isOpen) {
            node.n === 0 && (queue.push({x: newX, y: newY}))
            node.isOpen = true
          }
        }
      }
    }
    
    this.render()
  }
  inArea(y, x) {
    const d = this.d

    return (
      y >= 0 && y < d.arr.length &&
      x >= 0 && x < d.arr[0].length
    )
  }
  async exportImg(canvas) {
    const d = this.d
    const img = new Image()

    canvas = canvas || d._canvas

    await new Promise((next) => {
      canvas.toBlob((blob) => {
        img.onload = next
        img.src = URL.createObjectURL(blob)
      })
    })

    return img
  }
  setSize() {
    const d = this.d

    d.canvas.width = d.contentWidth * d.conf.scale
    d.canvas.style.width = d.canvas.width / d.conf.scale + 'px'
    d.canvas.height = d.contentHeight * d.conf.scale
  }
  setPos() {}
  render() {
    const d = this.d
    const {gd} = d

    gd.fillStyle = '#b3b6b9'
    gd.fillRect(0, 0, d.canvas.width, d.canvas.height)

    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    d.arr.forEach((row, idxRow) => {
      row.forEach((node, idxCol) => {
        const x = d.side * idxCol
        const y = d.side * idxRow

        if (node.isOpen) {
          if (node.isMine) {
            gd.drawImage(
              d.imgMine,
              x, y, d.side, d.side
            )
          } else {
            gd.beginPath()
            gd.rect(x, y, d.side, d.side)
            gd.strokeStyle = 'rgba(0,0,0,.2)'
            gd.stroke()

            if (node.n > 0) {
              gd.font = d.conf.font
              gd.textAlign = 'center'
              gd.textBaseline = 'middle'
              gd.fillStyle = d.colors[node.n]
              gd.font = '16px Arial'
              gd.fillText(node.n, x + d.side / 2, y + d.side / 2)
            }
          }
        } else {
          let img

          if (node.isFlag) {
            img = d.imgFlag
          } else {
            img = d.imgBg
          }

          gd.drawImage(
            img,
            x, y, d.side, d.side
          )
        }
      })
    })
    gd.restore()
  }
}
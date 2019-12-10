class Trie extends Common {
  constructor() {
    super(...arguments)

    const d = this.d

    d.str = `SwiftUI provides views, controls, and layout structures for declaring your app's user interface. The framework, gestures cat dog deer pan panda new news`
    d.arr = d.str.toLowerCase().match(/\w+/g)
    d.root = new Node('root', {map: {}, isWord: false})
    d.root.width = 40
    d.strArr = d.str.split(/\s+/g)
    d.steps = []
    d.row = 3
    d.lenStep = Math.ceil(d.strArr.length / d.row)
    d.gd.font = d.conf.font
    d.paddingTop = d.row * 18 + 10

    for (let i = 0; i < d.strArr.length; i += d.lenStep) {
      d.steps.push(d.strArr.slice(i, i + d.lenStep).join(' '))
    }

  }
  create() {
    const d = this.d

    d.arr.forEach((word, idx) => {
      let node = d.root

      for (let i = 0; i < word.length; i++) {
        const c = word[i]
        node = node.map[c] = node.map[c] || new Node(c, {map: {}, isWord: i === word.length - 1})
        node.fillStyle = d.color[node.isWord ? 'blue' : 'black']
      }
    })
  }
  setPos() {
    const d = this.d
    const itemWidth = d.itemWidth || d.conf.itemWidth
    d.iLeft = 0
    d.contentHeight = 0

    const setPos = (node, depth) => {
      const keys = Object.keys(node.map)

      keys.forEach((k, idx) => {
        setPos(node.map[k], depth + 1)
      })

      node.x = d.iLeft
      node.y = depth * d.conf.levelHeight + d.paddingTop
      d.contentHeight = Math.max(d.contentHeight, node.y)

      if (keys.length === 0) {
        d.iLeft += itemWidth
      } else {
        node.x = (node.map[keys.first()].x + node.map[keys.last()].x) / 2
      }
    }

    setPos(d.root, 0)

    d.contentWidth = d.iLeft
    d.contentHeight += d.conf.itemHeight
    d.canvas.height = (d.contentHeight + d.conf.paddingV * 2) * d.conf.scale
    this.setSize()
  }
  render() {
    const d = this.d
    const {gd} = d
    const itemWidth = d.itemWidth || d.conf.itemWidth
    const itemHeight = d.itemHeight || d.conf.itemHeight

    const renderText = () => {
      gd.font = d.conf.font
      gd.textAlign = 'center'
      gd.textBaseline = 'top'
      gd.fillStyle = d.color.black

      d.steps.forEach((str, idx) => {
        gd.fillText(str, d.contentWidth / 2, idx * 18)
      })
    }

    const renderLine = (node) => {
      const keys = Object.keys(node.map)

      keys.forEach((k, idx) => {
        const _node = node.map[k]

        gd.beginPath()
        gd.lineTo(node.x + itemWidth / 2, node.y + itemHeight / 2)
        gd.lineTo(_node.x + itemWidth / 2, _node.y + itemHeight / 2)
        gd.strokeStyle = d.color.black
        gd.stroke()

        renderLine(_node)
      })
    }

    const renderNode = (node) => {
      const keys = Object.keys(node.map)

      keys.forEach((k, idx) => {
        renderNode(node.map[k])
      })

      this.renderNode(node)
    }

    gd.fillStyle = d.color.white
    gd.fillRect(0, 0, d.canvas.width, d.canvas.height)

    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    gd.translate(d.conf.paddingH, d.conf.paddingV)
    renderText(d.root)
    renderLine(d.root)
    renderNode(d.root)
    gd.restore()
  }
}
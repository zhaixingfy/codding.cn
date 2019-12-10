class Flow extends Common {
  constructor() {
    super(...arguments)

    const d = this.d

    d.contentWidth = 600
    d.contentHeight = 750
    d.side = 10
    d.dir = [
      [-1, 0],
      [0, 1],
      [1, 0],
      [0, -1],
    ]
    d.row = d.contentHeight / d.side
    d.col = d.contentWidth / d.side
    d.arr = Array(d.row).fill().map((_, idxRow) => {
      return Array(d.col).fill().map((_, idxCol) => {
        return new Node(idxRow + '-' + idxCol, {
          coordX: idxCol,
          coordY: idxRow,
          countPath: 0,
        })
      })
    })
    this.setSize('noSpace')

    d.data = {
      "class": "go.GraphLinksModel",
      "linkFromPortIdProperty": "fromPort",
      "linkToPortIdProperty": "toPort",
      "nodes": [
        // {"category":"Comment", "x": 360, "y": -10, "text":"Kookie Brittle", "key":-13},
        // {"key":-1, "category":"Start", "x": 230, "y": 40, "text":"Start"},
        // {"key":0, "x": -5, "y": 100, "text":"Preheat oven to 375 F"},
        {"key":1, "x": 175, "y": 100, "text":"In a bowl, blend: 1 cup margarine, 1.5 teaspoon vanilla, 1 teaspoon salt"},
        // {"key":5, "x": 355, "y": 100, "text":"Finely chop 1/2 cup of your choice of nuts"},
        {"key":2, "x": 175, "y": 200, "text":"Gradually beat in 1 cup sugar and 2 cups sifted flour"},
        // {"key":3, "x": 175, "y": 290, "text":"Mix in 6 oz (1 cup) Nestle's Semi-Sweet Chocolate Morsels"},
        // {"key":4, "x": 175, "y": 380, "text":"Press evenly into ungreased 15x10x1 pan"},
        // {"key":6, "x": 175, "y": 450, "text":"Sprinkle nuts on top"},
        // {"key":7, "x": 175, "y": 515, "text":"Bake for 25 minutes and let cool"},
        // {"key":8, "x": 175, "y": 585, "text":"Cut into rectangular grid"},
        // {"key":-2, "category":"End", "x": 210, "y": 660, "text":"Enjoy!"}
      ],
      "sides": [
        {"from":1, "to":2, "fromPort":"B", "toPort":"T"},
        // {"from":2, "to":3, "fromPort":"B", "toPort":"T"},
        // {"from":3, "to":4, "fromPort":"B", "toPort":"T"},
        // {"from":4, "to":6, "fromPort":"B", "toPort":"T"},
        // {"from":6, "to":7, "fromPort":"B", "toPort":"T"},
        // {"from":7, "to":8, "fromPort":"B", "toPort":"T"},
        // {"from":8, "to":-2, "fromPort":"B", "toPort":"T"},
        // {"from":-1, "to":0, "fromPort":"B", "toPort":"T"},
        // {"from":-1, "to":1, "fromPort":"B", "toPort":"T"},
        // {"from":-1, "to":5, "fromPort":"B", "toPort":"T"},
        // {"from":5, "to":4, "fromPort":"B", "toPort":"T"},
        // {"from":0, "to":4, "fromPort":"B", "toPort":"T"}
      ]
    }

    d.mapPS = {}
    d.mapNode = {}
    d.gd.font = d.conf.font
    d.data.nodes.forEach((node, idx) => {
      d.mapNode[node.key] = node
      // node.width = Math.ceil(d.gd.measureText(node.text).width)
      node.width = 0
      node.strArr = node.text.trim().split(/\s+/g)
      node.steps = []

      let arr = []

      node.strArr.forEach((item, idx) => {
        arr.push(item)
        if (d.gd.measureText(arr.join(' ')).width > 120) {
          node.steps.push(arr.join(' '))
          arr = []
        }
      })

      arr.length > 0 && node.steps.push(arr.join(' '))
      node.height = node.steps.length * 16 + 10
      node.steps.forEach((str, idx) => {
        node.width = Math.max(node.width, d.gd.measureText(str).width + 10)
      })
    })

    this.setPS()
  }
  create() {
    console.log('create')
  }
  setPS() {
    const d = this.d

    d.data.nodes.forEach((node, idx) => {
      node.ps = [
        {dir: 'T', x: node.x + node.width / 2, y: node.y},
        {dir: 'R', x: node.x + node.width, y: node.y + node.height / 2},
        {dir: 'B', x: node.x + node.width / 2, y: node.y + node.height},
        {dir: 'L', x: node.x, y: node.y + node.height / 2},
      ]

      node.ps.forEach((p, idx) => {
        p.coordX = parseInt(p.x / d.side)
        p.coordY = parseInt(p.y / d.side)
        d.mapPS[node.key + '-' + p.dir] = p
      })
    })
  }
  setPos() {

  }
  inArea(y, x) {
    const d = this.d

    return (
      y >= 0 && y < d.row &&
      x >= 0 && x < d.col
    )
  }
  findPath(p) {
    const d = this.d

    while (p) {
      p = p.from
    }
  }
  bfs(pFrom, pTo, nodeFrom, nodeTo) {
    const d = this.d
    const queue = [pFrom]
    let p

    d.arr.forEach((row, idx) => {
      row.forEach((node, idx) => {
        node.visited = false
      })
    })
  }
  render(e) {
    const d = this.d
    const {gd} = d

    d.canvas.style.cursor = ''

    const renderLine = () => {
      d.data.sides.forEach((item, idx) => {
        const nodeFrom = d.mapNode[item.from]
        const nodeTo = d.mapNode[item.to]
        const pFrom = d.mapPS[item.from + '-' + item.fromPort]
        const pTo = d.mapPS[item.to + '-' + item.toPort]

        pFrom.fillStyle = d.color.red
        pTo.fillStyle = d.color.red

        this.bfs(pFrom, pTo, nodeFrom, nodeTo)
      })
    }
    
    const renderNode = () => {
      d.data.nodes.forEach((node, idx) => {
        gd.beginPath()
        gd.rect(node.x, node.y, node.width, node.height)
        gd.fillStyle = d.color.blue
        gd.fill()

        node.ps.forEach((p, idx) => {
          gd.beginPath()
          gd.arc(p.x, p.y, 5, 0, 2 * Math.PI)
          gd.fillStyle = p.fillStyle || d.color.purple
          gd.fill()
        })

        gd.fillStyle = d.color.white
        gd.textAlign = 'left'
        gd.textBaseline = 'top'
        node.steps.forEach((str, idx) => {
          gd.fillText(str, node.x + 5, node.y + idx * 16 + 5)
        })
      })
    }
    
    gd.font = d.conf.font
    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    gd.translate(50, 0)
    renderLine()
    renderNode()
    gd.restore()
  }
}
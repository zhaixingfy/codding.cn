class Maze extends Common {
  constructor() {
    super(...arguments)

    const d = this.d

    d.isRenderVisited = true
    d.itemWidth = 6
    d.duration = 1
    d.delay = 1
    d.road = ' '
    d.wall = '#'

    d.btn.onclick = (e) => {
      d.signAni = Math.random()
      d.usingAni = d.usingAni || !!e
      d.mazeData = mazeData.split('\n').map(row => row.split('').map(c => new Node(c)))
      d.enter = {
        x: 0,
        y: 1,
      }

      if (e) {
        this[d.typeItem.startFn](d.typeItem.arg)
      }
    }

    d.btn.onclick()

    d.exit = {
      x: d.mazeData[0].length - 1,
      y: d.mazeData.length - 2,
    }
    d.dir = [
      [-1, 0],
      [0, 1],
      [1, 0],
      [0, -1],
    ]

    d.mazeData[d.enter.y][d.enter.x].isPath = true
    d.mazeData[d.exit.y][d.exit.x].isPath = true
    this.setSize()
  }
  setSize() {
    const d = this.d

    d.canvas.width = d.mazeData[0].length * d.itemWidth
    d.canvas.height = d.mazeData.length * d.itemWidth
  }
  inArea(y, x) {
    const d = this.d

    return (
      y >= 0 && y < d.mazeData.length &&
      x >= 0 && x < d.mazeData[0].length
    )
  }
  async dfs1() {
    const d = this.d

    const dfs = async (p) => {
      const node = d.mazeData[p.y][p.x]

      node.isPath = true
      node.visited = true

      if (d.usingAni) {
        await this.animate()
      }

      if (p.x === d.exit.x && p.y === d.exit.y) {
        d.usingAni && console.log('找到了出路', d.exit)
        return true
      }

      for (let i = 0; i < 4; i++) {
        const newX = p.x + d.dir[i][1]
        const newY = p.y + d.dir[i][0]

        if (
          this.inArea(newY, newX) &&
          !d.mazeData[newY][newX].visited &&
          d.mazeData[newY][newX].n === d.road
        ) {
          if (await dfs({
            x: newX,
            y: newY,
          })) {
            return true
          }
        }
      }

      node.isPath = false
      return false
    }

    await dfs(d.enter)
  }
  findPath(p) {
    const d = this.d

    d.mazeData.forEach((row, idx) => {
      row.forEach((node, idx) => {
        node.isPath = false
      })
    })

    while (p) {
      d.mazeData[p.y][p.x].isPath = true
      p = p.from
    }
  }
  async dfs2() {
    const d = this.d
    const stack = [d.enter]
    let p

    while (stack.length > 0) {
      p = stack.pop()
      d.mazeData[p.y][p.x].visited = true

      if (d.usingAni) {
        this.findPath(p)
        await this.animate()
      }

      if (p.x === d.exit.x && p.y === d.exit.y) break

      for (let i = 0; i < 4; i++) {
        const newX = p.x + d.dir[i][1]
        const newY = p.y + d.dir[i][0]

        if (
          this.inArea(newY, newX) &&
          !d.mazeData[newY][newX].visited &&
          d.mazeData[newY][newX].n === d.road
        ) {
          stack.push({
            x: newX,
            y: newY,
            from: p,
          })
        }
      }
    }

    this.findPath(p)
  }
  async bfs() {
    const d = this.d
    const queue = [d.enter]
    let p

    while (queue.length > 0) {
      p = queue.shift()
      d.mazeData[p.y][p.x].visited = true

      if (d.usingAni) {
        this.findPath(p)
        await this.animate()
      }

      if (p.x === d.exit.x && p.y === d.exit.y) break

      for (let i = 0; i < 4; i++) {
        const newX = p.x + d.dir[i][1]
        const newY = p.y + d.dir[i][0]

        if (
          this.inArea(newY, newX) &&
          !d.mazeData[newY][newX].visited &&
          d.mazeData[newY][newX].n === d.road
        ) {
          queue.push({
            x: newX,
            y: newY,
            from: p,
          })
        }
      }
    }

    this.findPath(p)
  }
  generate() {
    const d = this.d

    d.row = 71
    d.col = 71
    d.mazeData = Array(d.row).fill().map((_, idxRow) => {
      return Array(d.col).fill().map((_, idxCol) => {
        return new Node(idxCol % 2 === 1 && idxRow % 2 === 1 ? d.road : d.wall)
      })
    })
    d.enter = {
      x: 0,
      y: 1,
    }
    d.exit = {
      x: d.mazeData[0].length - 1,
      y: d.mazeData.length - 2,
    }
    d.mazeData[d.enter.y][d.enter.x].n = d.road
    d.mazeData[d.exit.y][d.exit.x].n = d.road
    this.setSize()
  }
  async generateDfs1() {
    const d = this.d

    this.generate()
    d.isRenderVisited = false

    const dfs = async (p) => {
      d.mazeData[p.y][p.x].visited = true

      if (d.usingAni) await this.animate()

      for (let i = 0; i < 4; i++) {
        const newX = p.x + d.dir[i][1] * 2
        const newY = p.y + d.dir[i][0] * 2

        if (
          this.inArea(newY, newX) && 
          !d.mazeData[newY][newX].visited
        ) {
          d.mazeData[p.y + d.dir[i][0]][p.x + d.dir[i][1]].n = d.road
          await dfs({
            x: newX,
            y: newY,
          })
        }
      }
    }

    await dfs({x: 1, y: 1})
  }
  async generateDfs2() {
    const d = this.d
    const stack = [{x: 1, y: 1}]

    this.generate()
    d.isRenderVisited = false

    while (stack.length > 0) {
      const p = stack.pop()

      if (d.usingAni) await this.animate()

      for (let i = 0; i < 4; i++) {
        const newX = p.x + d.dir[i][1] * 2
        const newY = p.y + d.dir[i][0] * 2

        if (
          this.inArea(newY, newX) && 
          !d.mazeData[newY][newX].visited
        ) {
          d.mazeData[newY][newX].visited = true
          d.mazeData[p.y + d.dir[i][0]][p.x + d.dir[i][1]].n = d.road
          stack.push({
            x: newX,
            y: newY,
          })
        }
      }
    }
  }
  async generateBfs() {
    const d = this.d
    const queue = [{x: 1, y: 1}]

    this.generate()
    d.isRenderVisited = false

    while (queue.length > 0) {
      const p = queue.shift()

      if (d.usingAni) await this.animate()

      for (let i = 0; i < 4; i++) {
        const newX = p.x + d.dir[i][1] * 2
        const newY = p.y + d.dir[i][0] * 2

        if (
          this.inArea(newY, newX) && 
          !d.mazeData[newY][newX].visited
        ) {
          d.mazeData[newY][newX].visited = true
          d.mazeData[p.y + d.dir[i][0]][p.x + d.dir[i][1]].n = d.road
          queue.push({
            x: newX,
            y: newY,
          })
        }
      }
    }
  }
  async generateRand() {
    const d = this.d
    const queue = [{x: 1, y: 1}]

    this.generate()
    d.isRenderVisited = false

    while (queue.length > 0) {
      const p = queue[Math.random() < .5 ? 'pop' : 'shift']()

      if (d.usingAni) await this.animate()

      for (let i = 0; i < 4; i++) {
        const newX = p.x + d.dir[i][1] * 2
        const newY = p.y + d.dir[i][0] * 2

        if (
          this.inArea(newY, newX) && 
          !d.mazeData[newY][newX].visited
        ) {
          d.mazeData[newY][newX].visited = true
          d.mazeData[p.y + d.dir[i][0]][p.x + d.dir[i][1]].n = d.road
          queue[Math.random() < .5 ? 'push' : 'unshift']({
            x: newX,
            y: newY,
          })
        }
      }
    }

    d.mazeData.forEach((row, idx) => {
      row.forEach((node, idx) => {
        node.visited = false
      })
    })
    await this.dfs1()
  }
  async generateRand2() {
    const d = this.d
    const queue = [{x: 1, y: 1}]

    this.generate()
    d.isRenderVisited = false
    d.mazeData.forEach((row, idx) => {
      row.forEach((node, idx) => {
        node.inMist = true
      })
    })

    while (queue.length > 0) {
      const p = queue[Math.random() < .5 ? 'pop' : 'shift']()

      if (d.usingAni) await this.animate()

      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const _x = p.x + j
          const _y = p.y + i
          if (this.inArea(_y, _x)) {
            d.mazeData[_y][_x].inMist = false
          }
        }
      }

      for (let i = 0; i < 4; i++) {
        const newX = p.x + d.dir[i][1] * 2
        const newY = p.y + d.dir[i][0] * 2

        if (
          this.inArea(newY, newX) && 
          !d.mazeData[newY][newX].visited
        ) {
          d.mazeData[newY][newX].visited = true
          d.mazeData[p.y + d.dir[i][0]][p.x + d.dir[i][1]].n = d.road
          queue[Math.random() < .5 ? 'push' : 'unshift']({
            x: newX,
            y: newY,
          })
        }
      }
    }

    d.mazeData.forEach((row, idx) => {
      row.forEach((node, idx) => {
        node.visited = false
      })
    })
    await this.dfs1()
  }
  nextFrame() {}
  setPos() {}
  render() {
    const d = this.d
    const {gd} = d
    const itemWidth = d.itemWidth

    gd.fillStyle = d.color.blue
    gd.fillRect(0, 0, d.canvas.width, d.canvas.height)

    d.mazeData.forEach((row, idxRow) => {
      row.forEach((node, idxCol) => {
        if (!node.inMist && node.n === d.wall) return
        gd.beginPath()
        gd.rect(idxCol * itemWidth, idxRow * d.itemWidth, itemWidth, itemWidth)
        gd.fillStyle = d.color[node.inMist ? 'white' : (node.n === d.wall ? 'blue' : (node.isPath ? 'red' : (node.visited && d.isRenderVisited ? 'yellow' : 'white')))]
        gd.fill()
      })
    })
  }
}
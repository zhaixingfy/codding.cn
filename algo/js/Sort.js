class Sort extends Common {
  constructor() {
    super(...arguments)

    const d = this.d

    d.btn.onclick = async (e) => {
      d.signAni = Math.random()
      d.usingAni = d.usingAni || !!e
      d.arr = d.raw.clone()
      d.steps = [d.arr.clone()]

      if (e) {
        this[d.typeItem.startFn](d.typeItem.arg)
      }
    }

    d.delay = 200
    d.btn.onclick()
  }
  async SelectionSort() {
    const d = this.d

    await this.animate()

    for (let i = 0; i < d.arr.length; i++) {
      let minIndex = i

      for (let j = i + 1; j < d.arr.length; j++) {
        d.arr[j].fromIndex = j
        d.arr[j].fillStyle = d.color.green

        if (d.arr[j].n < d.arr[minIndex].n) {
          minIndex = j
        }
      }

      d.arr[i].fromIndex = i
      d.arr[i].fillStyle = d.color.orange
      d.arr[minIndex].fromIndex = minIndex
      d.arr[minIndex].fillStyle = d.color.blue
      d.arr.swap(minIndex, i)

      await this.pushStep(
        Array(i).fill().concat(
          d.arr.slice(i, d.arr.length).clone()
        )
      )
    }

    await this.pushStep(
      d.arr.clone().map((node, idx) => {
        node.fromIndex = idx
        node.fillStyle = d.color.blue
        return node
      })
    )
  }
  async InsertionSort() {
    const d = this.d

    await this.animate()

    for (let i = 1; i < d.arr.length; i++) {
      let j = i

      d.arr[i].fromIndex = i
      d.arr[i].fillStyle = d.color.blue

      for (; j > 0; j--) {
        d.arr[j - 1].fromIndex = j - 1
        d.arr[j - 1].fillStyle = d.color.green

        if (d.arr[j].n < d.arr[j - 1].n) {
          d.arr.swap(j, j - 1)
        } else {
          break
        }
      }

      await this.pushStep(
        Array(j).fill().concat(
          d.arr.slice(j, i + 1).clone()
        )
      )
    }

    await this.pushStep(
      d.arr.clone().map((node, idx) => {
        node.fromIndex = idx
        node.fillStyle = d.color.blue
        return node
      })
    )
  }
  async BubbleSort() {
    const d = this.d

    await this.animate()

    let swapped = false
    let n = d.arr.length - 1

    do {
      swapped = false

      for (let i = 0; i <= n; i++) {
        d.arr[i].fromIndex = i
      }

      for (let i = 1; i <= n; i++) {
        d.arr[i - 1].fillStyle = d.color.green

        if (d.arr[i].n < d.arr[i - 1].n) {
          d.arr[i].fillStyle = d.color.orange
          d.arr.swap(i, i - 1)
          swapped = true
        }
      }

      d.arr[n].fillStyle = d.color.blue

      await this.pushStep(
        d.arr.slice(0, n + 1).clone()
      )

      n--
    } while (swapped)

    await this.pushStep(
      d.arr.clone().map((node, idx) => {
        node.fromIndex = idx
        node.fillStyle = d.color.blue
        return node
      })
    )
  }
  async BubbleSort2() {
    const d = this.d

    await this.animate()

    let n = d.arr.length
    let newN = 0

    do {
      newN = 0

      for (let i = 0; i < n; i++) {
        d.arr[i].fromIndex = i
      }

      for (let i = 1; i < n; i++) {
        d.arr[i - 1].fillStyle = d.color.green

        if (d.arr[i].n < d.arr[i - 1].n) {
          d.arr[i].fillStyle = d.color.orange
          d.arr.swap(i, i - 1)
          newN = i
        }
      }

      d.arr[n - 1].fillStyle = d.color.blue

      await this.pushStep(
        d.arr.slice(0, n).clone()
      )

      n = newN
    } while (newN > 0)

    await this.pushStep(
      d.arr.clone().map((node, idx) => {
        node.fromIndex = idx
        node.fillStyle = d.color.blue
        return node
      })
    )
  }
  async MergeSort() {
    const d = this.d

    await this.animate()

    const mergeSort = async (l, r) => {
      if (l >= r) return

      const mid = l + parseInt((r - l) / 2)
      await mergeSort(l, mid)
      await mergeSort(mid + 1, r)

      let aux = Array(r - l + 1).fill()

      for (let i = l; i <= r; i++) {
        aux[i - l] = d.arr[i]
        aux[i - l].fromIndex = i
      }

      let i = l
      let j = mid + 1

      for (let k = l; k <= r; k++) {
        if (i > mid) {
          d.arr[k] = aux[j++ - l]
        } else if (j > r) {
          d.arr[k] = aux[i++ - l]
        } else if (aux[i - l].n <= aux[j - l].n) {
          d.arr[k] = aux[i++ - l]
        } else {
          d.arr[k] = aux[j++ - l]
        }
      }

      const fillStyle = d.color[l === 0 && r === d.arr.length - 1 ? 'blue' : 'green']

      await this.pushStep(
        Array(l).fill().concat(
          d.arr.slice(l, r + 1).clone().map((node) => {
            node.fillStyle = fillStyle
            return node
          })
        )
      )
    }

    await mergeSort(0, d.arr.length - 1)
  }
  async QuickSort1() {
    const d = this.d

    await this.animate()

    const quickSort = async (l, r) => {
      if (l >= r) return

      for (let i = l; i <= r; i++) {
        d.arr[i].fromIndex = i
      }

      d.arr.swap(l, rand(l + 1, r))

      const v = d.arr[l].n
      let j = l

      for (let i = l; i <= r; i++) {
        if (d.arr[i].n < v) {
          d.arr[i].fillStyle = d.color.green
          d.arr.swap(i, j + 1)
          j++
        } else {
          d.arr[i].fillStyle = d.color.orange
        }
      }

      d.arr[l].fillStyle = d.color.blue
      d.arr.swap(l, j)
      await this.pushStep(
        Array(l).fill().concat(
          d.arr.slice(l, r + 1).clone()
        )
      )
      await quickSort(l, j - 1)
      await quickSort(j + 1, r)
    }

    await quickSort(0, d.arr.length - 1)

    await this.pushStep(
      d.arr.clone().map((node, idx) => {
        node.fromIndex = idx
        node.fillStyle = d.color.blue
        return node
      })
    )
  }
  async QuickSort2() {
    const d = this.d

    await this.animate()

    const quickSort = async (l, r) => {
      if (l >= r) return

      for (let i = l; i <= r; i++) {
        d.arr[i].fromIndex = i
      }

      d.arr.swap(l, rand(l + 1, r))

      const v = d.arr[l].n
      let i = l + 1
      let j = r

      while (true) {
        while (i <= r && d.arr[i].n < v) {
          d.arr[i].fillStyle = d.color.green
          i++
        }
        while (j > l && d.arr[j].n > v) {
          d.arr[j].fillStyle = d.color.orange
          j--
        }
        if (i > j) break
        d.arr.swap(i, j)
        d.arr[i].fillStyle = d.color.green
        d.arr[j].fillStyle = d.color.orange
        i++
        j--
      }

      d.arr[l].fillStyle = d.color.blue
      d.arr.swap(l, j)
      await this.pushStep(
        Array(l).fill().concat(
          d.arr.slice(l, r + 1).clone()
        )
      )
      await quickSort(l, j - 1)
      await quickSort(j + 1, r)
    }

    await quickSort(0, d.arr.length - 1)

    await this.pushStep(
      d.arr.clone().map((node, idx) => {
        node.fromIndex = idx
        node.fillStyle = d.color.blue
        return node
      })
    )
  }
  async QuickSort3() {
    const d = this.d

    await this.animate()

    const quickSort = async (l, r) => {
      if (l >= r) return

      for (let i = l; i <= r; i++) {
        d.arr[i].fromIndex = i
      }

      d.arr.swap(l, rand(l + 1, r))

      const v = d.arr[l].n
      let lt = l
      let gt = r + 1
      let i = l + 1

      while (i < gt) {
        if (d.arr[i].n < v) {
          d.arr[i].fillStyle = d.color.green
          d.arr.swap(i, lt + 1)
          lt++
          i++
        } else if (d.arr[i].n > v) {
          d.arr[i].fillStyle = d.color.orange
          d.arr.swap(i, gt - 1)
          gt--
        } else {
          d.arr[i].fillStyle = d.color.purple
          i++
        }
      }

      d.arr[l].fillStyle = d.color.blue
      d.arr.swap(l, lt)
      await this.pushStep(
        Array(l).fill().concat(
          d.arr.slice(l, r + 1).clone()
        )
      )
      await quickSort(l, lt - 1)
      await quickSort(gt, r)
    }

    await quickSort(0, d.arr.length - 1)

    await this.pushStep(
      d.arr.clone().map((node, idx) => {
        node.fromIndex = idx
        node.fillStyle = d.color.blue
        return node
      })
    )
  }
  async pushStep(arr) {
    const d = this.d

    d.steps.push(arr)
    await this.animate()
  }
  nextFrame(isStop) {
    const d = this.d

    d.steps.forEach((row, idx) => {
      row.forEach((node, idx) => {
        this.updatePos(node, isStop)
      })
    })
  }
  setPos() {
    const d = this.d
    const stair = d.steps.length - 1

    d.contentWidth = d.arr.length * d.conf.itemWidth
    d.contentHeight = (d.steps.length - 1) * d.conf.levelHeight + d.conf.itemHeight
    this.setSize()

    if (d.usingAni) {
      d.steps.last().forEach((node, idx) => {
        if (!node) return

        let nodeFrom
        let _stair = stair

        while (!nodeFrom && --_stair > -1) {
          nodeFrom = d.steps[_stair][node.fromIndex]
        }

        stair === 0 && (nodeFrom = nodeFrom || node)

        node.x = node.from.x = nodeFrom.to.x
        node.y = node.from.y = nodeFrom.to.y

        node.to.x = idx * d.conf.itemWidth
        node.to.y = stair * d.conf.levelHeight
      })
    } else {
      d.steps.forEach((row, stair) => {
        row.forEach((node, idx) => {
          if (!node) return
          node.x = idx * d.conf.itemWidth
          node.y = stair * d.conf.levelHeight
        })
      })
    }
  }
  render() {
    const d = this.d
    const {gd} = d

    const renderLine = () => {
      // return
      d.steps.forEach((row, stair) => {
        stair > 0 && row.forEach((nodeFrom, idx) => {
          if (!nodeFrom) return

          let nodeTo
          let _stair = stair

          while (!nodeTo && --_stair > -1) {
            nodeTo = d.steps[_stair][nodeFrom.fromIndex]
          }

          gd.beginPath()
          gd.lineTo(nodeFrom.x + d.conf.itemWidth / 2 + .5, nodeFrom.y + d.conf.itemHeight / 2)
          gd.lineTo(nodeTo.x + d.conf.itemWidth / 2 + .5, nodeTo.y + d.conf.itemHeight / 2)
          gd.strokeStyle = nodeFrom.strokeStyle
          gd.stroke()
        })
      })
    }

    const renderNode = () => {
      d.steps.forEach((row, idx) => {
        row.forEach((ndoe, idx) => {
          this.renderNode(ndoe)
        })
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
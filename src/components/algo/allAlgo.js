/*
 * Tween.js
 * t: current time（当前时间）；
 * b: beginning value（初始值）；
 * c: change in value（变化量）；
 * d: duration（持续时间）。
 * you can visit 'http://easings.net/zh-cn' to get effect
*/
var Tween = {
    Linear: function(t, b, c, d) { 
        return c * t / d + b; 
    },
    Quad: {
        easeIn: function(t, b, c, d) {
            return c * (t /= d) * t + b;
        },
        easeOut: function(t, b, c, d) {
            return -c *(t /= d)*(t-2) + b;
        },
        easeInOut: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t + b;
            return -c / 2 * ((--t) * (t-2) - 1) + b;
        }
    },
    Cubic: {
        easeIn: function(t, b, c, d) {
            return c * (t /= d) * t * t + b;
        },
        easeOut: function(t, b, c, d) {
            return c * ((t = t/d - 1) * t * t + 1) + b;
        },
        easeInOut: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t*t + b;
            return c / 2*((t -= 2) * t * t + 2) + b;
        }
    },
    Quart: {
        easeIn: function(t, b, c, d) {
            return c * (t /= d) * t * t*t + b;
        },
        easeOut: function(t, b, c, d) {
            return -c * ((t = t/d - 1) * t * t*t - 1) + b;
        },
        easeInOut: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
            return -c / 2 * ((t -= 2) * t * t*t - 2) + b;
        }
    },
    Quint: {
        easeIn: function(t, b, c, d) {
            return c * (t /= d) * t * t * t * t + b;
        },
        easeOut: function(t, b, c, d) {
            return c * ((t = t/d - 1) * t * t * t * t + 1) + b;
        },
        easeInOut: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
            return c / 2*((t -= 2) * t * t * t * t + 2) + b;
        }
    },
    Sine: {
        easeIn: function(t, b, c, d) {
            return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
        },
        easeOut: function(t, b, c, d) {
            return c * Math.sin(t/d * (Math.PI/2)) + b;
        },
        easeInOut: function(t, b, c, d) {
            return -c / 2 * (Math.cos(Math.PI * t/d) - 1) + b;
        }
    },
    Expo: {
        easeIn: function(t, b, c, d) {
            return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
        },
        easeOut: function(t, b, c, d) {
            return (t==d) ? b + c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
        },
        easeInOut: function(t, b, c, d) {
            if (t==0) return b;
            if (t==d) return b+c;
            if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
            return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
        }
    },
    Circ: {
        easeIn: function(t, b, c, d) {
            return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
        },
        easeOut: function(t, b, c, d) {
            return c * Math.sqrt(1 - (t = t/d - 1) * t) + b;
        },
        easeInOut: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
        }
    },
    Elastic: {
        easeIn: function(t, b, c, d, a, p) {
            var s;
            if (t==0) return b;
            if ((t /= d) == 1) return b + c;
            if (typeof p == "undefined") p = d * .3;
            if (!a || a < Math.abs(c)) {
                s = p / 4;
                a = c;
            } else {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        },
        easeOut: function(t, b, c, d, a, p) {
            var s;
            if (t==0) return b;
            if ((t /= d) == 1) return b + c;
            if (typeof p == "undefined") p = d * .3;
            if (!a || a < Math.abs(c)) {
                a = c; 
                s = p / 4;
            } else {
                s = p/(2*Math.PI) * Math.asin(c/a);
            }
            return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
        },
        easeInOut: function(t, b, c, d, a, p) {
            var s;
            if (t==0) return b;
            if ((t /= d / 2) == 2) return b+c;
            if (typeof p == "undefined") p = d * (.3 * 1.5);
            if (!a || a < Math.abs(c)) {
                a = c; 
                s = p / 4;
            } else {
                s = p / (2  *Math.PI) * Math.asin(c / a);
            }
            if (t < 1) return -.5 * (a * Math.pow(2, 10* (t -=1 )) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p ) * .5 + c + b;
        }
    },
    Back: {
        easeIn: function(t, b, c, d, s) {
            if (typeof s == "undefined") s = 1.70158;
            return c * (t /= d) * t * ((s + 1) * t - s) + b;
        },
        easeOut: function(t, b, c, d, s) {
            if (typeof s == "undefined") s = 1.70158;
            return c * ((t = t/d - 1) * t * ((s + 1) * t + s) + 1) + b;
        },
        easeInOut: function(t, b, c, d, s) {
            if (typeof s == "undefined") s = 1.70158; 
            if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
            return c / 2*((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
        }
    },
    Bounce: {
        easeIn: function(t, b, c, d) {
            return c - Tween.Bounce.easeOut(d-t, 0, c, d) + b;
        },
        easeOut: function(t, b, c, d) {
            if ((t /= d) < (1 / 2.75)) {
                return c * (7.5625 * t * t) + b;
            } else if (t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
            } else if (t < (2.5 / 2.75)) {
                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
            } else {
                return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
            }
        },
        easeInOut: function(t, b, c, d) {
            if (t < d / 2) {
                return Tween.Bounce.easeIn(t * 2, 0, c, d) * .5 + b;
            } else {
                return Tween.Bounce.easeOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
            }
        }
    }
}

Math.tween = Tween;

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

const mazeData =  `#######################################################################
        #     # #   # #     # # # # #           # # # # # # # # # # # #
# ### ####### # # ### ### ### # # # # ### # ##### # # # # # # # # # # #
#   #   # # # # #     # # #       #     # #                 # # # #   #
# ### ### # # # # ##### # # ### ### ####### # ### ####### ### # # # ###
# #             #     #   #   #       #   # #   #     # #     # # #   #
##### ##### # ### ####### # ##### ##### ##### # ### ### ### ### # # ###
#       # # #       #   #       #         # # # # #       #           #
### # ### ### # ##### ### ####### ### ##### ##### ### ##### ### #######
#   #       # #         # #     #   #   # #     #   #   #     #       #
##### ######### ### # ### # ##### ### ### # ##### ######### ### #######
# #         #     # #         # #   # #       # # #   # #     #       #
# ### # ####### # ### # # ##### ####### ### ### # # ### ### ### # # ###
#     #       # #   # # #   #     # # #   # #       #   # #   # # #   #
# # # # # ############### ### ##### # # ####### ### ### # ######### ###
# # # # #     # # #   #     #     #         # # #   # #     # # #     #
# # # ### ##### # ### ### ### ##### ######### ##### # # ##### # ### # #
# # # #     # #     # #               #     # # # # #           # # # #
# # ### # ### # ##### ### # ####### ### ##### # # # # ####### ### ### #
# #   # #         #     # #       #         # #         #   #       # #
### ### # # ### ##### ##### ####### # ####### ##### ##### ##### ##### #
#     # # #   # # # # #           # #     #     # # # # #   # # #   # #
# # ####### ##### # # ### # # ####### # ##### ### # # # # ### ### #####
# # #           #   # #   # #     # # # #   #         #   # #   #   # #
### ### ### # ##### # ### # # # ### ####### # ##### ##### # # ### ### #
#     # #   #     #     # # # #   #   # # #       #   #     # #     # #
# # ####### # # ##### ### ##### ### ### # # ####### ####### # # ##### #
# # #       # #     #   # # # #   # # #           #     #   #     #   #
# ####### # # # # ### ##### # ##### # # ####### ### ####### # ##### ###
# #       # # # #               #       # #   #   #   # # #   # #     #
# ##### # ##### # # # # ##### ### ### ### # ####### ### # # ### # #####
# # #   # #     # # # #     # #     #         # #             # #   # #
### ##### # # # ############### ##### # # ##### ### ##### # ### # ### #
#   #     # # #     # # # #         # # #         #     # #         # #
### ### # # # # # ### # # ### ########### # ### ### ####### ### # ### #
#       # # # # #           #   # #     # #   # #   # # #     # #     #
### # # ### # # # # ##### ### ### ### ##### ######### # ### ##### # # #
#   # # # # # # # #   # # # # # # #   # #         #     # #     # # # #
# # # ### ##### ### ### ### # # # ### # ### ### ####### # ########### #
# # # #         #         #         #         #   # # #   # #   # #   #
### ##### # # ##### ### ### ### # ### # # # ####### # ### # # ### ### #
#   #     # # #       #   #   # #   # # # #   # # # #   # #     #   # #
####### # ### ### # ### ### ##### # ####### ### # # # ### # ##### #####
# # # # #   # #   # #           # #     #                     #     # #
# # # ### ########### # # ########### ##### ##### # ############# ### #
#             # # # # # #       # # # #         # #     # # # # # # # #
# # # # # ##### # # ### # # ##### # ####### # ##### ##### # # # # # # #
# # # # # # #         # # #     #       #   # # #       # # # # # # # #
# # ### ### ### ### ### ### ####### ########### ### ##### # # # # # # #
# # #     # # # # # # # #       #   # # #                             #
####### ### # # # ### ### # # ##### # # ##### # # # ### ### ##### ### #
#                 #     # # #   #     # # #   # # #   #   #     #   # #
### ### ### # ##### ##### ########### # # ### ##### # # # # # ### #####
#   #     # #   # #   # # # # # #               # # # # # # #   #     #
### ### ##### ### # ### ### # # ##### # # # # ### ##### # # # ### #####
#     # #                 #       #   # # # #         # # # # #       #
### ### ### # # # ##### ### ### ##### # ##### ######### ##### ### # # #
#     # #   # # #     #       #     # # #           #       # #   # # #
# # ##### ### ### # # # # ##### ##### # # # # ######### # ########### #
# # # #   #     # # # # #     #     # # # # #     # # # #   # # # # # #
# ### ### ### # # ######### ############# # # # ### # ### ### # # # ###
#   #       # # #   # # # #     #   # #   # # #   #     #           # #
# # # # # ####### ### # # ### ### ### ### # ### ### ##### ####### ### #
# # # # #       #           #           # # #         #     # # #     #
# ### # # # # ### # ### ##### # ####### ####### ### ##### ### # #######
# #   # # # #   # #   #     # #   #   # # #       #     #       # # # #
### # ####### ##### ### ####### ### ##### ### # ### ##### ### ### # # #
#   #   #         # # # # #           #       # #     #     #         #
# # # ##### # # ##### ### ### # # # ##### # # ##### ##### # # # ##### #
# # # #     # #             # # # #   #   # #     #     # # # #     #  
#######################################################################`

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

class BrainMap extends Common {
  constructor() {
    super(...arguments)

    const d = this.d

    d.btn.onclick = (e) => {
      if (e) {
        d.usingAni = true
        this.create()
      }
    }
  }
  async create() {
    const d = this.d

    d.mapTree = {}
    d.mapNode = {}
    d.itemHeight = 22
    d.levelHeight = 60
    d.contentWidth = 600
    d.contentHeight = 420
    this.setSize('noSpace')

    d.dataList = [
      {id: 1, pid: 0, name: 'aaa'},
      {id: 2, pid: 1, name: 'bbb'},
      {id: 3, pid: 1, name: 'ccc'},
      {id: 4, pid: 2, name: 'ddd'},
      {id: 5, pid: 2, name: 'eee'},
      {id: 6, pid: 2, name: 'fff'},
      {id: 7, pid: 3, name: 'ggg'},
      {id: 8, pid: 3, name: 'hhh'},
      {id: 9, pid: 3, name: 'iii'},
      {id: 10, pid: 5, name: 'iii'},
      {id: 11, pid: 5, name: 'jjj'},
      {id: 12, pid: 5, name: 'kkk'},
      {id: 13, pid: 5, name: 'lll'},
      {id: 14, pid: 9, name: 'mmm'},
      {id: 15, pid: 9, name: 'nnn'},
      {id: 16, pid: 12, name: 'ooo'},
    ]

    d.gd.font = d.conf.font
    d.dataList.forEach((item, idx) => {
      item.width = Math.ceil(d.gd.measureText(item.name).width) + 16
      item.x = 0
      item.y = 0
      item.from = {x: d.contentWidth / 2 - item.width / 2, y: 30}
      item.to = {x: 0, y: 0}
      d.mapTree[item.pid] = d.mapTree[item.pid] || []
      d.mapTree[item.pid].push(item)
      d.mapNode[item.id] = item
    })

    d.root = d.mapTree[0][0]

    this.initEvents()
    await this.animate()
    setTimeout(() => {
      d.usingAni = true
    }, 20)
  }
  initEvents() {
    const d = this.d

    d.isMousedown = false

    d.canvas.onkeydown = async (e) => {
      if (e.ctrlKey && e.altKey && e.keyCode === 70) {
        await this.animate()
      }
    }

    d.canvas.onmousedown = d.canvas.onmouseup = (e) => {
      d.isMousedown = e.type === 'mousedown'

      if (d.isMousedown) {
        if (d.elOn) {
          d.x1 = e.clientX
          d.y1 = e.clientY
          const setOrigin = (node) => {
            node.origin = {
              x: node.x,
              y: node.y,
            }
            ;(d.mapTree[node.id] || []).forEach((item, idx) => {
              setOrigin(d.mapNode[item.id])
            })
          }
          setOrigin(d.elOn)
        }
      }
    }

    d.canvas.onmousemove = (e) => {
      if (d.isMousedown && d.elOn) {
        d.x2 = e.clientX
        d.y2 = e.clientY

        const dixX = d.x2 - d.x1
        const dixY = d.y2 - d.y1

        const updateCoord = (node) => {
          if (!node) return

          node.x = node.from.x = node.to.x = dixX + node.origin.x
          node.y = node.from.y = node.to.y = dixY + node.origin.y

          ;(d.mapTree[node.id] || []).forEach((item, idx) => {
            updateCoord(item)
          })
        }
        updateCoord(d.elOn)
      } else {
        delete d.elOn
      }
      this.render(e)
    }
  }
  nextFrame(isStop) {
    const d = this.d

    d.dataList.forEach((item, idx) => {
      this.updatePos(item, isStop)
    })
  }
  getSibling(node) {
    const d = this.d
    return d.mapTree[(d.mapNode[node.pid] || {}).id] || []
  }
  setPos() {
    const d = this.d

    d.iLeft = 0

    d.dataList.forEach((item, idx) => {
      delete item.visited
    })

    const setPos = (list, depth = 0) => {
      list && list.forEach((node, idx) => {
        const children = d.mapTree[node.id] || []
        const sibling = this.getSibling(node)
        let w = sibling.reduce((total, item) => {
          return total += item.width + 20
        }, 0) - 20
        setPos(children, depth + 1)

        node.to.y = depth * d.levelHeight + 60

        if (node === sibling.first()) {
          let nodeP = node
          let _w = w

          while (nodeP && !nodeP.visited) {
            nodeP.visited = true
            _w = Math.max(_w, nodeP.width)
            nodeP = d.mapNode[nodeP.pid]
          }

          d.iLeft += (_w - w) / 2
        }

        if (children.length > 0) {
          // 非叶子节点
          const first = children.first()
          const last = children.last()
          node.to.x = parseInt((first.to.x + last.to.x + last.width) / 2 - node.width / 2)
          d.iLeft = Math.max(node.width + node.to.x, last.width + last.to.x) + 20
        } else {
          // 叶子节点
          node.to.x = d.iLeft
          d.iLeft += node.width + 20
        }
      })
    }

    const updateCoord = (list) => {
      list && list.forEach((item, idx) => {
        updateCoord(d.mapTree[item.id])
        item.to.x += d.translateX
      })
    }

    setPos(d.mapTree[0])
    d.translateX = (d.contentWidth / 2 - d.mapTree[0][0].to.x - d.root.width / 2)
    updateCoord(d.mapTree[0])

    if (!d.usingAni) {
      d.dataList.forEach((node, idx) => {
        node.x = node.from.x = node.to.x
        node.y = node.from.y = node.to.y
      })
    }
  }
  render(e) {
    const d = this.d
    const {gd} = d

    d.canvas.style.cursor = ''

    const renderLine = () => {
      Object.keys(d.mapTree).forEach((key, idx) => {
        if (d.mapTree[key] === d.mapTree[0]) return

        const list = d.mapTree[key]
        const nodeP = d.mapNode[list[0].pid]
        const x1 = nodeP.x + nodeP.width / 2
        const y1 = nodeP.y + d.itemHeight / 2

        list.forEach((node, idx) => {
          const x2 = x1
          const y2 = y1 + d.levelHeight / 2 + d.itemHeight / 2

          const x3 = node.x + node.width / 2
          const y3 = node.y - d.levelHeight / 2

          const x4 = node.x + node.width / 2
          const y4 = node.y + d.itemHeight / 2

          gd.beginPath()
          gd.moveTo(x1, y1)
          gd.bezierCurveTo(
            x2, y2,
            x3, y3,
            x4, y4,
          )
          gd.strokeStyle = '#000'
          gd.stroke()
        })
      })
    }

    const renderNode = () => {
      d.dataList.forEach((node, idx) => {
        gd.beginPath()
        gd.rect(node.x + .5, node.y + .5, node.width, d.itemHeight)
        gd.fillStyle = node.fillStyle || 'rgba(255, 255, 255, .9)'
        gd.fill()
        gd.strokeStyle = '#000'
        gd.stroke()

        if (e && gd.isPointInPath(e.offsetX * d.conf.scale, e.offsetY * d.conf.scale)) {
          d.canvas.style.cursor = 'move'
          if (!d.isMousedown) {
            d.elOn = node
          }
        }

        gd.fillStyle = '#000'
        gd.font = d.conf.font
        gd.textAlign = 'center'
        gd.textBaseline = 'middle'
        gd.fillText(node.name, node.x + node.width / 2, node.y + d.itemHeight / 2 + 1)
      })
    }

    gd.fillStyle = '#fff'
    gd.fillRect(0, 0, d.canvas.width, d.canvas.height)
    gd.save()
    gd.scale(d.conf.scale, d.conf.scale)
    renderLine()
    renderNode()
    gd.restore()
  }
}

class Algo {
  constructor(d = {}) {
    this.d = d

    const allAlgo = {
      MineSweeper,
      Maze,
      Fractal,
      Trie,
      Tree23,
      RBTree,
      AVLTree,
      BinarySearch,
      SegmentTree,
      Heap,
      Sort,
      BrainMap,
      Flow,
    }

    d.type = {
      list: [
        {name: '流程图', cons: 'Flow', startFn: 'create', arg: {}},
        // {name: '脑图排版 - (ctrl+alt+f 排版)', cons: 'BrainMap', startFn: 'create', arg: {}},
        // {name: '扫雷', cons: 'MineSweeper', startFn: 'create', arg: {}},
        // {name: '迷宫创建 - 随机队列2', cons: 'Maze', startFn: 'generateRand2', arg: {}},
        // {name: '迷宫创建 - 随机队列', cons: 'Maze', startFn: 'generateRand', arg: {}},
        // {name: '迷宫创建 - 广度优先 - 非递归', cons: 'Maze', startFn: 'generateBfs', arg: {}},
        // {name: '迷宫创建 - 深度优先 - 非递归', cons: 'Maze', startFn: 'generateDfs2', arg: {}},
        // // {name: '迷宫创建 - 深度优先 - 递归', cons: 'Maze', startFn: 'generateDfs1', arg: {}},
        // {name: '迷宫寻路 - 广度优先 - 非递归', cons: 'Maze', startFn: 'bfs', arg: {}},
        // {name: '迷宫寻路 - 深度优先 - 非递归', cons: 'Maze', startFn: 'dfs2', arg: {}},
        // {name: '迷宫寻路 - 深度优先 - 递归', cons: 'Maze', startFn: 'dfs1', arg: {}},
        // {name: '分形图 - FractalTree', cons: 'Fractal', startFn: 'FractalTree', arg: {}},
        // {name: '分形图 - KoachSnowflake', cons: 'Fractal', startFn: 'KoachSnowflake', arg: {}},
        // {name: '分形图 - SierpinskiTriangle', cons: 'Fractal', startFn: 'SierpinskiTriangle', arg: {}},
        // {name: '分形图 - Sierpinski', cons: 'Fractal', startFn: 'Sierpinski', arg: {}},
        // {name: '分形图 - Vicsek', cons: 'Fractal', startFn: 'Vicsek', arg: {}},
        // {name: '分形图 - 斐波那契数列', cons: 'Fractal', startFn: 'Fib', arg: {}},
        // {name: '分形图 - 1/2 + 1/4 ... 1/n ≈ 1', cons: 'Fractal', startFn: 'NearOne', arg: {}},
        // {name: 'Trie', cons: 'Trie', startFn: 'create', arg: {}},
        // {name: '2-3 树', cons: 'Tree23', startFn: 'create', arg: {}},
        // {name: '红黑树 - (左倾&右倾)', cons: 'RBTree', startFn: 'create', arg: {}},
        // {name: 'AVL树', cons: 'AVLTree', startFn: 'create', arg: {}},
        // {name: '二分搜索树 - 镜像反转', cons: 'BinarySearch', startFn: 'flip', arg: {}},
        // {name: '二分搜索树', cons: 'BinarySearch', startFn: 'create', arg: {}},
        // {name: '线段树 - R', cons: 'SegmentTree', startFn: 'create', arg: {isL: false}},
        // {name: '线段树 - L', cons: 'SegmentTree', startFn: 'create', arg: {isL: true}},
        // {name: '最大堆 - shiftUp', cons: 'Heap', startFn: 'createByShiftUp', arg: {}},
        // {name: '最大堆 - heapify', cons: 'Heap', startFn: 'heapify', arg: {}},
        // {name: '三路快排', cons: 'Sort', startFn: 'QuickSort3', arg: {}},
        // {name: '双路快排', cons: 'Sort', startFn: 'QuickSort2', arg: {}},
        // {name: '单路快排', cons: 'Sort', startFn: 'QuickSort1', arg: {}},
        // {name: '归并排序', cons: 'Sort', startFn: 'MergeSort', arg: {}},
        // {name: '冒泡排序-优化', cons: 'Sort', startFn: 'BubbleSort2', arg: {}},
        // {name: '冒泡排序', cons: 'Sort', startFn: 'BubbleSort', arg: {}},
        // {name: '插入排序', cons: 'Sort', startFn: 'InsertionSort', arg: {}},
        // {name: '选择排序', cons: 'Sort', startFn: 'SelectionSort', arg: {}},
      ]
    }

    d.cons = {
      map: {}
    }

    const nodeList = document.querySelector('#box-algo > .list')

    nodeList.innerHTML = d.type.list.map((v) => {
      return `
        <section>
          <div class="box-btn">
            <button class="btn btn-primary">${v.name}</button>
          </div>
          <div class="box-canvas">
            <canvas tabindex="1" data-title="${v.name}"></canvas>
          </div>
        </section>
      `
    }).join('')

    const canvasList = nodeList.getElementsByTagName('canvas')
    const btnList = nodeList.getElementsByTagName('button')
    const len = 20
    let randArr = [].rnd(len, 1, len * 5)

    // randArr = Array(len).fill().map((_, idx) => idx)
    // randArr = Array(len).fill().map((_, idx) => len - idx)
    // console.log(randArr)
    randArr = randArr.map(n => new Node(n, {strokeStyle: randColor().toString()}))

    d.type.list.forEach(async (typeItem, idx) => {
      // console.time(typeItem.name)
      const canvas = canvasList[idx]
      const btn = btnList[idx]
      const o = new allAlgo[typeItem.cons]({
        btn,
        canvas,
        gd: canvas.getContext('2d'),
        arr: randArr.clone(),
        raw: randArr.clone(),
        contentWidth: 0,
        contentHeight: 0,
        typeItem,
        conf: Algo.conf,
        color: Algo.color,
      })

      d.cons.map[typeItem.startFn] = o
      await o[typeItem.startFn](typeItem.arg)
      o.setPos()
      o.render()

      // console.timeEnd(typeItem.name)
    })
  }
}

Algo.conf = {
  itemWidth: 30,
  itemHeight: 18,
  levelHeight: 36,
  paddingH: 15,
  paddingV: 15,
  paddingTop: 0,
  duration: 500,
  scale: devicePixelRatio,
  scale: 2,
  font: '14px Arial',
  fontSm: '12px Arial',
  fontLg: '16px Arial',
}

Algo.color = {
  red: '#F44336',
  pink: '#E91E63',
  purple: '#9C27B0',
  deepPurple: '#673AB7',
  indigo: '#3F51B5',
  blue: '#2196F3',
  lightBlue: '#03A9F4',
  cyan: '#00BCD4',
  teal: '#009688',
  green: '#4CAF50',
  lightGreen: '#8BC34A',
  lime: '#CDDC39',
  yellow: '#FFEB3B',
  amber: '#FFC107',
  orange: '#FF9800',
  deepOrange: '#FF5722',
  brown: '#795548',
  blueGrey: '#607D8B',
  grey: '#9E9E9E',
  black: '#000000',
  white: '#FFFFFF',
}

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

export default {
  Node,
  Common,
  Sort,
  Heap,
  SegmentTree,
  Tree,
  BinarySearch,
  AVLTree,
  RBTree,
  Tree23,
  Trie,
  Fractal,
  Maze,
  MineSweeper,
  BrainMap,
  Algo,
  Flow
}
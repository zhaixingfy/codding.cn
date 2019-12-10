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
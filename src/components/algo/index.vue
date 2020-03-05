<template>
  <div class="wrap-algo panel-stack">
    <div class="back">
      <div class="list-respond">
        <section class="list-item" 
          v-for="(item, idx) in type.list"
          :style="{opacity: item.visible ? 1 : 0}"
        >
          <div class="inner">
            <div class="img-box" ref="imgBox"
              @click="showAlgo(item)"
            ></div>
            <div class="text-box ellipsis">{{item.name}}</div>
          </div>
        </section>
      </div>
    </div>
    <transition name="fade">
      <div class="forward" v-if="r.algo">
        <div id="box-algo">
          <div class="list">
            <section v-for="(item, idx) in rAlgoList">
              <div class="box-btn">
                <button ref="btnList" class="btn btn-primary">{{item.name}}</button>
              </div>
              <div class="box-canvas">
                <canvas tabindex="1" 
                  ref="canvasList"
                  :data-title="item.name"
                ></canvas>
              </div>
            </section>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import allAlgo from './allAlgo'

export default {
  name: 'algo',
  data() {
    return {
      type: {
        list: [
          {name: '脑图排版 - (ctrl+alt+f 排版)', cons: 'BrainMap', startFn: 'create', arg: {}},
          {name: '扫雷', cons: 'MineSweeper', startFn: 'create', arg: {}},
          {name: '迷宫创建 - 随机队列2', cons: 'Maze', startFn: 'generateRand2', arg: {}},
          {name: '迷宫创建 - 随机队列', cons: 'Maze', startFn: 'generateRand', arg: {}},
          {name: '迷宫创建 - 广度优先 - 非递归', cons: 'Maze', startFn: 'generateBfs', arg: {}},
          {name: '迷宫创建 - 深度优先 - 非递归', cons: 'Maze', startFn: 'generateDfs2', arg: {}},
          // {name: '迷宫创建 - 深度优先 - 递归', cons: 'Maze', startFn: 'generateDfs1', arg: {}},
          {name: '迷宫寻路 - 广度优先 - 非递归', cons: 'Maze', startFn: 'bfs', arg: {}},
          {name: '迷宫寻路 - 深度优先 - 非递归', cons: 'Maze', startFn: 'dfs2', arg: {}},
          {name: '迷宫寻路 - 深度优先 - 递归', cons: 'Maze', startFn: 'dfs1', arg: {}},
          {name: '分形图 - FractalTree', cons: 'Fractal', startFn: 'FractalTree', arg: {}},
          {name: '分形图 - KoachSnowflake', cons: 'Fractal', startFn: 'KoachSnowflake', arg: {}},
          {name: '分形图 - SierpinskiTriangle', cons: 'Fractal', startFn: 'SierpinskiTriangle', arg: {}},
          {name: '分形图 - Sierpinski', cons: 'Fractal', startFn: 'Sierpinski', arg: {}},
          {name: '分形图 - Vicsek', cons: 'Fractal', startFn: 'Vicsek', arg: {}},
          {name: '分形图 - 斐波那契数列', cons: 'Fractal', startFn: 'Fib', arg: {renderAux: 0}},
          {name: '分形图 - 1/2 + 1/4 ... 1/n ≈ 1', cons: 'Fractal', startFn: 'NearOne', arg: {}},
          {name: 'Trie', cons: 'Trie', startFn: 'create', arg: {}},
          {name: '2-3 树', cons: 'Tree23', startFn: 'create', arg: {}},
          {name: '红黑树 - (左倾&右倾)', cons: 'RBTree', startFn: 'create', arg: {}},
          {name: 'AVL树', cons: 'AVLTree', startFn: 'create', arg: {}},
          {name: '二分搜索树 - 镜像反转', cons: 'BinarySearch', startFn: 'flip', arg: {}},
          {name: '二分搜索树', cons: 'BinarySearch', startFn: 'create', arg: {}},
          // {name: '线段树 - R', cons: 'SegmentTree', startFn: 'create', arg: {isL: false}},
          {name: '线段树', cons: 'SegmentTree', startFn: 'create', arg: {isL: true}},
          {name: '最大堆 - shiftUp', cons: 'Heap', startFn: 'createByShiftUp', arg: {}},
          {name: '最大堆 - heapify', cons: 'Heap', startFn: 'heapify', arg: {}},
          {name: '三路快排', cons: 'Sort', startFn: 'QuickSort3', arg: {}},
          {name: '双路快排', cons: 'Sort', startFn: 'QuickSort2', arg: {}},
          {name: '单路快排', cons: 'Sort', startFn: 'QuickSort1', arg: {}},
          {name: '归并排序', cons: 'Sort', startFn: 'MergeSort', arg: {}},
          {name: '冒泡排序-优化', cons: 'Sort', startFn: 'BubbleSort2', arg: {}},
          {name: '冒泡排序', cons: 'Sort', startFn: 'BubbleSort', arg: {}},
          {name: '插入排序', cons: 'Sort', startFn: 'InsertionSort', arg: {}},
          {name: '选择排序', cons: 'Sort', startFn: 'SelectionSort', arg: {}},
        ]
      }
    }
  },
  computed: {
    r() {
      return this.$root.router
    },
    rAlgoList() {
      const vm = this.$root
      const r = vm.router
      const len = 20
      const arr1 = Array(len).fill().map((_, idx) => new allAlgo.Node(idx, {strokeStyle: randColor().toString()})).shuffle()
      const arr2 = Array(len).fill().map((_, idx) => new allAlgo.Node(idx, {strokeStyle: randColor().toString()}))
      const arr3 = Array(len).fill().map((_, idx) => new allAlgo.Node(len - idx, {strokeStyle: randColor().toString()}))
      const arr4 = Array(len).fill().map((_, idx) => new allAlgo.Node(rand(0, 4), {strokeStyle: randColor().toString()}))
      let list = []

      if (!r.algo) return

      switch (r.algo.cons) {
        case 'Heap':
        case 'Sort':
          list = [
            {...clone(r.algo), name: r.algo.name + ' - 完全随机', arr: arr1},
            {...clone(r.algo), name: r.algo.name + ' - 完全正序', arr: arr2},
            {...clone(r.algo), name: r.algo.name + ' - 完全逆序', arr: arr3},
            {...clone(r.algo), name: r.algo.name + ' - 大量重复', arr: arr4},
          ]
          break
        case 'Tree23':
        case 'RBTree':
        case 'AVLTree':
        case 'BinarySearch':
          list = [
            {...clone(r.algo), name: r.algo.name + ' - 完全随机', arr: arr1},
            {...clone(r.algo), name: r.algo.name + ' - 完全正序', arr: arr2},
            {...clone(r.algo), name: r.algo.name + ' - 完全逆序', arr: arr3},
          ]
          break
        case 'SegmentTree':
          list = [
            {...clone(r.algo), name: '线段树 - R', arg: {isL: false}},
            {...clone(r.algo), name: '线段树 - L', arg: {isL: true}},
          ]
          break
        case 'Fractal':
          switch (r.algo.startFn) {
            case 'Fib':
              list = [
                {...clone(r.algo), arg: {renderAux: false}},
                {...clone(r.algo), arg: {renderAux: true}},
              ]
              break
            case 'FractalTree':
              list = [
                {...clone(r.algo)},
                {...clone(r.algo), arg: {side: 100, degL: -5, degR: 20, translateX: -60}},
                {...clone(r.algo), arg: {side: 100, degL: -30, degR: 10, translateX: 50}},
                {...clone(r.algo), arg: {side: 90, degL: -45, degR: 45, translateY: -120}},
              ]
              break
            default:
              list = [{...clone(r.algo)}]
              break
          }
          break
        default:
          list = [{...clone(r.algo)}]
          break
      }

      return list
    },
  },
  methods: {
    showAlgo(elItem) {
      const vm = this.$root

      vm.updateRouter({
        algo: elItem
      }, 'push')
    },
    async renderAlgo() {
      const vm = this.$root
      const r = vm.router
      const sign = vm.sign = Math.random()

      if (r.algo) {
        const btnList = this.$refs.btnList
        const canvasList = this.$refs.canvasList

        await this.rAlgoList.forEachSync(async (typeItem, idx) => {
          const canvas = canvasList[idx]
          const o = new allAlgo[typeItem.cons]({
            btn: btnList[idx],
            canvas,
            gd: canvas.getContext('2d'),
            arr: (typeItem.arr || []).clone(),
            raw: (typeItem.arr || []).clone(),
            contentWidth: 0,
            contentHeight: 0,
            typeItem,
            conf: allAlgo.Algo.conf,
            color: allAlgo.Algo.color,
          })

          await o[typeItem.startFn](typeItem.arg)
          o.setPos()
          o.render()
        })

        return
      }

      if (this.algoRendered) {
        console.log('this.algoRendered true')
        return
      }
      this.algoRendered = true

      const len = 20
      const randArr = [].rnd(len, 1, len * 5).map(n => new allAlgo.Node(n, {strokeStyle: randColor().toString()}))

      await this.type.list.forEachSync(async (typeItem, idx) => {
        await new Promise(async (next) => {
          let _randArr = randArr

          if (['AVLTree', 'RBTree', 'Tree23'].indexOf(typeItem.cons) > -1) {
            _randArr = randArr.clone().map((v, idx) => {
              v.n = len - idx
              return v
            })
          }

          const canvas = document.createElement('canvas')
          const o = new allAlgo[typeItem.cons]({
            btn: canvas,
            canvas,
            gd: canvas.getContext('2d'),
            arr: _randArr.clone(),
            raw: _randArr.clone(),
            contentWidth: 0,
            contentHeight: 0,
            typeItem,
            conf: allAlgo.Algo.conf,
            color: allAlgo.Algo.color,
          })

          await o[typeItem.startFn](typeItem.arg)
          if (typeItem.name === '扫雷') {
            o.d.hideNotice = true
            o.d.arr[0][0].isMine = true
            o.open(0, 0)
          }
          o.setPos()
          o.render()

          canvas.toBlob((blob) => {
            const img = new Image()
            img.onload = () => {
              if (!this.$refs.imgBox[idx]) {
                console.log('algo mounted 时过境迁')
                return
              }
              this.$set(typeItem, 'visible', true)
              this.$refs.imgBox[idx].style.backgroundImage = 'url(' + img.src + ')'
              next()
            }
            img.src = URL.createObjectURL(blob)
          })
        })
      })
    },
  },
  watch: {
    'r.algo'() {
      this.$nextTick(() => {
        this.renderAlgo()
      })
    },
  },
  async mounted() {
    const vm = this

    await sleep(800)
    await this.renderAlgo()
  }
}
</script>

<style lang="less" scoped>
#box-algo {}
#box-algo > .list {text-align: center; padding: 15px;}
#box-algo > .list section {margin: 20px 0;}
#box-algo > .list section .box-btn {margin-bottom: 15px;}
#box-algo > .list section .box-btn .btn {padding: .5em 1em; cursor: pointer;}
#box-algo > .list section .box-canvas {}
#box-algo > .list section .box-canvas canvas {border: 1px solid #ccc; max-width: 100%; box-sizing: content-box; user-select: none;}

.wrap-algo {
  .back {
    .list-respond {
      padding: 6px; margin: 0;
      section {
        padding: 6px; transition: .3s opacity;
        .inner {
          padding-top: 0; background: #eee;
          background: #eee; border-radius: 4px; overflow: hidden; border: 1px solid #ccc;
          .img-box {
            padding-top: 100%; background: #fff no-repeat center / contain; cursor: pointer;
          }
          .text-box {
            line-height: 3em; padding: 0 1em; border-top: 1px solid #ccc;
            position: static; background: transparent; color: inherit;
          }
        }
      }
    }
  }
}

.panel-stack {
  & > .back {
    background: #f3f6f9;
  }
}

@media (max-width: 500px) {
  .panel-stack {
    .list-respond {
      section {
        width: 100%;
      }
    }
  }
}
</style>
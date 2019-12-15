<template>
  <div class="web-ftp">
    <div class="list-dir">
      <section class="dir flex-v"
        v-for="(item, idx) in listDir"
      >
        <div class="gray-title dir-title flex-h">
          <div class="auto-flex ellipsis">{{item.path}}</div>
          <div class="icon-box">
            <i class="glyphicon glyphicon-remove"></i>
          </div>
        </div>
        <div class="auto-flex dir-body">
          <ul>
            <li v-for="(item, idx) in 1">{{item}}</li>
          </ul>
        </div>
        <div class="resize">
          <div class="line">
            <div class="l"></div>
            <div class="t"></div>
            <div class="r"></div>
            <div class="b"></div>
          </div>
          <div class="corner">
            <div class="lt"></div>
            <div class="rt"></div>
            <div class="rb"></div>
            <div class="lb"></div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'web-ftp',
  data() {
    return {

    }
  },
  computed: {
    r() {
      return this.$root.router
    },
    listDir() {
      return this.r.listDir || [{
        path: 'c:/www/',
        style: {
          width: '400px',
          height: '400px',
          left: '30px',
          top: '30px'
        }
      }]
    },
  },
  methods: {

  },
  mounted() {

  },
}
</script>

<style lang="scss" scoped>
.web-ftp {
  background: #dadedd;
  .list-dir {
    user-select: none;
    .dir {
      width: 400px; height: 400px; background: #fff; position: absolute; left: 20px; top: 20px;
      box-shadow: 0 0 10px rgba(0,0,0,.2); border-radius: 4px; overflow: hidden;
      .dir-title {
        padding: 0 12px; cursor: move;
        .auto-flex {overflow: hidden;}
        .icon-box {
          margin-left: 10px;
        }
      }
      .dir-body {
        
      }
      .resize {position: static;}
      .resize > div > div {width: 6px; height: 6px; position: absolute; left: 0; top: 0; z-index: 2;}
      .resize .line > div {}
      .resize .line .l {height: 100%; cursor: w-resize;}
      .resize .line .t {width: 100%; cursor: n-resize;}
      .resize .line .r {height: 100%; left: auto; right: 0; cursor: e-resize;}
      .resize .line .b {width: 100%; top: auto; bottom: 0; cursor: s-resize;}
      .resize .corner > div {width: 12px; height: 12px;}
      .resize .corner .lt {cursor: nw-resize;}
      .resize .corner .rt {left: auto; right: 0; cursor: ne-resize;}
      .resize .corner .rb {left: auto; right: 0; top: auto; bottom: 0; cursor: se-resize;}
      .resize .corner .lb {top: auto; bottom: 0; cursor: sw-resize;}
    }
  }
}
</style>
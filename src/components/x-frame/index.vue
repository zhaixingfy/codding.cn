<template>
  <div class="x-frame">
    <iframe :src="url"></iframe>
  </div>
</template>

<script>
export default {
  name: 'x-frame',
  props: ['url'],
}
</script>

<style lang="less" scoped>
.x-frame {
  iframe {width: 100%; height: 100%; position: absolute; left: 0; top: 0;}
}
</style>
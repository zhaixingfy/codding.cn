export default {
  handleDragStart(e) {
    const me = this
    const vm = me.$root
    const webFtp = me.$refs.webFtp
    const elFile = e.target.closest('.file')
    
    $(me.$refs.webFtp).find('.el-select').hide()
    .end().find('.dir').css({transition: ''})

    if (!elFile) return
  },
  handleDragover(e) {

  },
  handleDrop(e) {

  },
}
const fs = require('fs')

{
  const str = fs.readFileSync('./TreeView.js', 'utf-8')
  const startIndex = str.indexOf('class TreeView')
  const _str = str.substr(startIndex) + 'export default TreeView'
  fs.writeFileSync('C:/phpStudy/PHPTutorial/WWW/oxd_webui/fullnode_ui/src/components/page-browse/TreeView.js', _str)
}
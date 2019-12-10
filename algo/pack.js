Array.prototype.remove = function(el) {
  el = new Set(el instanceof Array ? el : [el])

  for (let i = 0; i < this.length; i++) {
    if (el.has(this[i])) {
      this.splice(i, 1)
      i--
    }
  }
  
  return this
}

const fs = require('fs')
const pathArr = fs.readFileSync('./index.html', 'utf-8').match(/\.\/js\/\w+\.js/g) || []

pathArr.remove([
  './js/algoAux.js'
])

let sJs = pathArr.map((path) => fs.readFileSync(path, 'utf-8')).join('\n\n')
let classList = sJs.match(/class \w+/g).map(str => '  ' + str.slice(str.indexOf(' ') + 1))

sJs += `

export default {
${classList.join(',\n')}
}`

fs.writeFileSync('../src/components/algo/allAlgo.js', sJs)
console.log('succ')
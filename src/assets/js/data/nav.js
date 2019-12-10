const list = [
  {name: 'CCTV', com: 'cctv', arg: {}},
  {name: 'Algorithm', com: 'algo', arg: {}},
  {name: 'GitHub', com: 'x-frame', arg: {url: 'https://github.com/tianxiaohao1/codding.cn'}},
]
const map = {}

list.forEach((item,) => {
  map[item.com] = item
})

export default {
  list, map
}
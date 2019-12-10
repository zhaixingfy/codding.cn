let keyMap = {}

for (let i = 32; i < 128; i++) {
  keyMap[i] = String.fromCharCode(i).toLowerCase()
}

keyMap = Object.assign(keyMap, {
  '13': 'enter',
  '27': 'esc',
  '37': 'keft',
  '38': 'up',
  '39': 'right',
  '40': 'down',
})

export default keyMap
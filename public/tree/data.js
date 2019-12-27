Array.prototype.swap = function(a, b) {
  const t = this[a]
  this[a] = this[b]
  this[b] = t
}

Array.prototype.shuffle = function() {
  for (let i = this.length - 1; i > 0; i--) {
    this.swap(i, Math.floor(Math.random() * (i + 1)))
  }
  return this
}

const rand = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

var data = []

if (1) {
  data = [{id: 1, pid: 0},{id: 91, pid: 41},{id: 59, pid: 38},{id: 39, pid: 9},{id: 62, pid: 44},{id: 83, pid: 20},{id: 32, pid: 8},{id: 99, pid: 42},{id: 87, pid: 12},{id: 42, pid: 2},{id: 20, pid: 6},{id: 9, pid: 8},{id: 65, pid: 32},{id: 40, pid: 6},{id: 72, pid: 20},{id: 4, pid: 3},{id: 55, pid: 16},{id: 25, pid: 5},{id: 100, pid: 14},{id: 2, pid: 1},{id: 8, pid: 7},{id: 86, pid: 36},{id: 74, pid: 46},{id: 78, pid: 34},{id: 17, pid: 6},{id: 57, pid: 35},{id: 58, pid: 40},{id: 67, pid: 38},{id: 64, pid: 40},{id: 21, pid: 10},{id: 84, pid: 49},{id: 5, pid: 4},{id: 41, pid: 4},{id: 52, pid: 44},{id: 43, pid: 2},{id: 33, pid: 7},{id: 36, pid: 7},{id: 35, pid: 7},{id: 71, pid: 12},{id: 27, pid: 2},{id: 27.1, pid: 2},{id: 27.2, pid: 2},{id: 70, pid: 50},{id: 26, pid: 10},{id: 88, pid: 44},{id: 80, pid: 14},{id: 22, pid: 9},{id: 31, pid: 3},{id: 66, pid: 13},{id: 24, pid: 10},{id: 49, pid: 6},{id: 97, pid: 31},{id: 96, pid: 27},{id: 34, pid: 9},{id: 6, pid: 5},{id: 11, pid: 10},{id: 12, pid: 4},{id: 51, pid: 7},{id: 19, pid: 3},{id: 29, pid: 3},{id: 28, pid: 3},{id: 15, pid: 6},{id: 47, pid: 4},{id: 53, pid: 45},{id: 75, pid: 24},{id: 56, pid: 35},{id: 68, pid: 26},{id: 76, pid: 24},{id: 3, pid: 2},{id: 30, pid: 2},{id: 73, pid: 26},{id: 14, pid: 9},{id: 48, pid: 8},{id: 38, pid: 6},{id: 94, pid: 31},{id: 7, pid: 6},{id: 61, pid: 19},{id: 13, pid: 4},{id: 23, pid: 1},{id: 90, pid: 11},{id: 89, pid: 18},{id: 81, pid: 17},{id: 60, pid: 13},{id: 95, pid: 38},{id: 82, pid: 50},{id: 54, pid: 50},{id: 37, pid: 5},{id: 98, pid: 11},{id: 46, pid: 3},{id: 10, pid: 9},{id: 16, pid: 6},{id: 44, pid: 6},{id: 50, pid: 7},{id: 93, pid: 22},{id: 79, pid: 42},{id: 63, pid: 30},{id: 92, pid: 20},{id: 18, pid: 10},{id: 85, pid: 42},{id: 77, pid: 12},{id: 45, pid: 6},]
} else {
  data = Array(100).fill().map((_, idx) => {
    let pid

    if (idx <= 15) {
      pid = idx
    } else if (idx > 15 && idx <= 50) {
      pid = rand(1, 15)
    } else {
      pid = rand(15, 50)
    }

    return {
      id: idx + 1,
      pid,
    }
  })

  const head = data.shift()
  data.shuffle().unshift(head)
  console.log(JSON.stringify(data))
}

function sleep(time) {
  return new Promise(next => time ? setTimeout(next, time) : next())
}

function clone(o) {
  return JSON.parse(JSON.stringify(o))
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function randColor(a) {
  const o = {
    r: rand(0, 255),
    g: rand(0, 255),
    b: rand(0, 255),
    a: a === undefined ? 1 : a,
  }

  o.toString = () => {
    return 'rgba(' + o.r + ',' + o.g + ',' + o.b + ',' + o.a + ')'
  }

  return o
}

function d2a(deg) {
  return deg / 180 * Math.PI
}

function a2d(angle) {
  return angle / Math.PI * 180
}

Array.prototype.first = function() {
  return this[0]
}

Array.prototype.last = function() {
  return this[this.length - 1]
}

Array.prototype.swap = function(a, b) {
  const t = this[a]

  this[a] = this[b]
  this[b] = t

  return this
}

Array.prototype.min = function() {
  return Math.min.apply(null, this)
}

Array.prototype.max = function() {
  return Math.max.apply(null, this)
}

Array.prototype.rnd = function(len, min, max) {
  min = min === undefined ? 0 : min
  max = max === undefined ? len : max
  
  return Array(len).fill().map(_ => rand(min, max))
}

Array.prototype.shuffle = function() {
  for (let i = this.length - 1; i > 0; i--) {
    this.swap(i, parseInt(Math.random() * (i + 1)))
  }
}

Array.prototype.clone = function() {
  return clone(this)
}

Array.prototype.forEachSync = async function (fn) {
  for (let i = 0, len = this.length; i < len; i++) {
    await fn(this[i], i, this)
  }
}
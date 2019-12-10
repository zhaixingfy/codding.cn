window.sleep = async function(time) {
  if (!time) return

  await new Promise((next) => {
    setTimeout(next, time)
  })
}

window.clone = (o) => {
  return JSON.parse(JSON.stringify(o))
}

window.rand = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

window.randColor = (a) => {
  const o = {
    r: rand(0, 255),
    g: rand(0, 255),
    b: rand(0, 255),
    a: a === undefined ? 1 : a
  }

  o.toString = () => {
    return 'rgba(' + o.r + ',' + o.g + ',' + o.b + ',' + o.a + ')'
  }

  return o
}

window.d2a = (deg) => {
  return deg / 180 * Math.PI
}

window.a2d = (angle) => {
  return angle / Math.PI * 180
}

Date.prototype.format = function(format) {
  const o = {
    y: this.getFullYear(),
    m: this.getMonth() + 1,
    d: this.getDate(),
    h: this.getHours(),
    i: this.getMinutes(),
    s: this.getSeconds(),
  }

  return (format || 'y-m-d h:i:s').replace(/y|m|d|h|i|s/g, (s) => {
    const t = o[s]
    return t < 10 ? '0' + t : t
  })
}

String.prototype.match_ = function(re) {
  return this.match(re) || []
}

String.prototype.first = Array.prototype.first = function() {
  return this[0]
}

String.prototype.last = Array.prototype.last = function() {
  return this[this.length - 1]
}

String.prototype.getOne = Array.prototype.getOne = function() {
  return this[rand(0, this.length - 1)]
}

Array.prototype.swap = function(a, b) {
  const t = this[a]
  this[a] = this[b]
  this[b] = t
}

Array.prototype.min = function() {
  return Math.min.apply(null, this)
}

Array.prototype.max = function() {
  return Math.max.apply(null, this)
}

Array.prototype.shuffle = function() {
  for (let i = this.length - 1; i > 0; i--) {
    this.swap(i, Math.floor(Math.random() * (i + 1)))
  }
  return this
}

Array.prototype.forEachSync = async function(fn) {
  for (let i = 0; i < this.length; i++) {
    await fn(this[i], i, this)
  }
}

Array.prototype.mapSync = async function(fn) {
  for (let i = 0; i < this.length; i++) {
    this[i] = await fn(this[i], i, this)
  }
}

Array.prototype.rnd = function(len, min, max) {
  min = min === undefined ? 0 : min
  max = max === undefined ? len : max
  return Array(len).fill().map(_ => rand(min, max))
}

Array.prototype.clone = function() {
  return clone(this)
}

$.fetch = (url, data, success) => {
  let method = 'GET'

  if (typeof data === 'function') {
    success = data
    data = {}
  }

  if (typeof url === 'object') {
    const opt = url
    url = opt.url
    method = (opt.method || 'GET').toUpperCase()
    data = opt.data
    success = opt.success
  }

  return new Promise((next) => {
    data = data || {}
    success = success || next

    const xhr = new XMLHttpRequest()
    const dataRequest = (typeof data === 'object')? 
      Object.keys(data).map((k) => k + '=' + data[k]).join('&'):
      data;

    switch (method) {
      case 'GET':
        url = url.indexOf('?') > -1 ? 
          (url[url.length - 1] === '?' ? url + dataRequest : url + '&' + dataRequest) : 
          (url + '?' + dataRequest)
        xhr.open('GET', url, true)
        xhr.send()
        break
      case 'POST':
        xhr.open('POST', url, true)
        xhr.send(dataRequest)
        break
      default:
        console.warn('未处理的method', method)
        return
    }

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        success(xhr.status >= 200 && xhr.status < 300 ? xhr.responseText : 'false')
      }
    }
  })
}

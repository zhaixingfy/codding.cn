export default function() {
  const isLocal = location.origin.indexOf('540') > -1
  const canvas = $('<canvas></canvas>')[0]
  const gd = canvas.getContext('2d')
  const ua = navigator.userAgent

  return {
    apiPrefix: (isLocal ? 'http://192.168.1.100/codding' : '.') + '/api/',
    router: {},
    canvas, gd,
    is: {
      loading: false,
      local: isLocal,
      supportM3u8: !!document.createElement('video').canPlayType('application/vnd.apple.mpegurl'),
      supportHls: Hls.isSupported(),
      ios: ua.indexOf('iPhone OS') > -1 || ua.indexOf('iPad; CPU OS') > -1 || ua.indexOf('Macintosh;') > -1,
      android: ua.indexOf('Android') > -1,
    },
    dataAlert: {
      isShow: false,
      msg: '',
    },
    dataConfirm: {
      isShow: false,
      msg: '',
    },
    nav: require('./nav').default,
    color: require('./color').default,
    keyMap: require('./keyMap').default,
    animateCss: require('./animateCss').default,
    mapPlayTime: require('./mapPlayTime').default,
    setting: require('./setting').default,
  }
}
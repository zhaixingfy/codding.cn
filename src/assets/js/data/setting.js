let setting = {}

try {
  setting = JSON.parse(localStorage.setting)
} catch  (e) {
  
}

setting.isShow = setting.isShow || false
setting.is = setting.is || {}
setting.is.hideFooter = setting.is.hideFooter || false

export default setting
let setting = {}

try {
  setting = JSON.parse(localStorage.setting)
} catch  (e) {
  
}

setting.isShow = setting.isShow || false
setting.is = setting.is || {}
setting.is.hideFooter = setting.is.hideFooter || false
setting.is.remoteControl = setting.is.remoteControl || false
setting.is.playInSite = setting.is.playInSite || false
setting.playDirection = setting.playDirection || 0

export default setting
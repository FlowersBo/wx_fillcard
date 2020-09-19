//app.js
App({
  data: {
    // siteroot: 'http://123.56.157.206:9000/api',
    // siteroot: 'http://39.96.84.9:9000/api',
    siteroot: 'https://mp.bnzbj.com/api',
    citySel: null,
    userinfo: null,
    userInput: null,
    userLat: null,
    userLng: null,
    userMoblie: null,
    token: '',
    isAuthor: false,
    screenWidth: 375
  },
  onShow: function(options) {
    console.log("app-onShow");
    let that = this;
    wx.getSystemInfo({
      success: res => {
        console.log(res);
        that.data.screenWidth = res.screenWidth;
        that.data.screenHeight = res.screenHeight;
        that.data.windowWidth = res.windowWidth;
        that.data.windowHeight = res.windowHeight;
      }
    })
  },
  onLaunch: function() {
    this.autoUpdate();
  },
  autoUpdate: function() {
    var self = this;
    // 获取小程序更新机制兼容
    if (wx.canIUse('getUpdateManager')) {
      console.log(new Date())
      const updateManager = wx.getUpdateManager()
      //1. 检查小程序是否有新版本发布
      updateManager.onCheckForUpdate(function(res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          console.log("请求完新版本信息的回调", new Date())
          //2. 小程序有新版本，则静默下载新版本，做好更新准备
          updateManager.onUpdateReady(function() {
            console.log("有新版本", new Date())
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function(res) {
                if (res.confirm) {
                  //3. 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                } else if (res.cancel) {
                  //如果需要强制更新，则给出二次弹窗，如果不需要，则这里的代码都可以删掉了
                  wx.showModal({
                    title: '温馨提示~',
                    content: '本次版本更新涉及到新的功能添加，旧版本无法正常访问的哦~',
                    success: function(res) {
                      self.autoUpdate()
                      return;
                      //第二次提示后，强制更新                      
                      if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        updateManager.applyUpdate()
                      } else if (res.cancel) {
                        //重新回到版本更新提示
                        self.autoUpdate()
                      }
                    }
                  })
                }
              }
            })
          })
          updateManager.onUpdateFailed(function() {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
            })
          })
        }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  }
})
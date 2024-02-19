// pages/wxlogin/index.js
var that;
var app = getApp();
var wxRequest = require('../../utils/requestUrl.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let pages = getCurrentPages();
    var currPage = pages[pages.length - 2];
    console.log("上级页面", currPage)
    var route = currPage.route;
    console.log("上级页面路由", route);
    that.setData({
      route: route
    });
  },
  // 授权
  getPhoneNumber: function (e) {
    console.log(e.detail);
    console.log(e);
    var iv = e.detail.iv;
    var encryptedData = e.detail.encryptedData;
    wx.getSetting({
      success(res) {
        console.log("是否授权", res);
        // if (res.authSetting['scope.userInfo']) {
        // 已经授权，可以直接调用
        if (e.detail.encryptedData) {
          // wx.getUserInfo({
          //   success: function (res) {
          //     var userInfo = res.userInfo
          //     console.log('用户信息',userInfo)
          //   }
          // })
          try {
            wx.login({
              success: function (res) {
                wx.showLoading({
                  title: '登录中',
                  mask: true
                })
                console.log(res);
                if (res.code) {
                  var code = res.code;
                  console.log("iv", iv, '\n', "encryptedData", encryptedData, '\n', "code", code)
                  // 获取登录用户信息
                  var dataUrl = '/auth/login';
                  var loginType = "3";
                  var param = {
                    loginType: loginType,
                    code: code,
                    encryptedData: encryptedData,
                    iv: iv
                  }
                  wxRequest(dataUrl, param).then(res => {
                    console.log("授权返回参数", res);
                    if (res.code == "0000") {
                      var authToken = res.authToken;
                      // var token = app.data.token;
                      // token = refreshToken;
                      // app.data.token = refreshToken;
                      wx.setStorageSync('token', authToken);
                      //用户已点击;授权
                      if (authToken) {
                        setTimeout(function () {
                          wx.hideLoading();
                          wx.navigateBack({
                            delta: 1
                          })
                        }, 800)
                      }
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                      wx.navigateBack({
                        delta: 1
                      })
                    }
                  })
                } else {
                  console.log('获取用户登录态失败！' + res.errMsg);
                }
              }
            });
          } catch (e) {
            console.log(e);
          }
        } else {
          console.log("用户按了取消按钮");
          var route = that.data.route;
          // 根据路由选择取消返回跳转页面
          if (route == "pages/cardParticulars/index") {
            wx.navigateBack({
              delta: 1
            })
          } else if (route == "pages/shopCardList/shopCardDetails/index") {
            wx.navigateBack({
              delta: 1
            })
          } else if (route == "pages/share/index") {
            wx.navigateBack({
              delta: 1
            })
          } else if (route == "pages/bargainShare/index") {
            wx.navigateBack({
              delta: 1
            })
          } else if (route == "pages/bargainirg/index") {
            wx.navigateBack({
              delta: 1
            })
          } else {
            // wx.switchTab({
            //   url: '/pages/index/index'
            // })
            wx.navigateBack({
              delta: 1
            })
          }
        }
        // }
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    setTimeout(function () {
      wx.stopPullDownRefresh()
    }, 500)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  //授权
  // onGotUserInfo: function (e) {
  //   var that = this;
  //   console.log(e)
  //   var result = e.detail.userInfo;
  //   var encryptedData = e.detail.encryptedData;
  //   var iv = e.detail.iv;
  //   console.log("result", result);
  //   if (e.detail.userInfo) {
  //     try {
  //       wx.login({
  //         success: function (res) {
  //           console.log(res);
  //           if (res.code) {
  //             var code = res.code;
  //             // 获取登录用户信息
  //             var dataUrl = '/auth/login';
  //             var param = {
  //               code: code,
  //               encryptedData: encryptedData
  //             }
  //             // wxRequest(dataUrl, param).then(res => {
  //                 console.log("登录返回参数", res);
  //                 if (code) {
  //                   // var userInfo = res.data;
  //                   // console.log("userInfo", userInfo);
  //                   // app.data.userinfo = userInfo;
  //                   // wx.setStorageSync('userInfo', userInfo);
  //                   // that.setData({ userInfo: userInfo});
  //                   //用户已经授权过
  //                   wx.navigateBack({
  //                     delta: 1
  //                   })
  //                 } else {
  //                   wx.switchTab({
  //                     url: '/index/index'
  //                   })
  //                 }
  //             // })
  //           } else {
  //             console.log('获取用户登录态失败！' + res.errMsg);
  //           }
  //         }
  //       });
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   } else {
  //     //用户按了取消按钮
  //     wx.showModal({
  //       title: '提示',
  //       content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入',
  //       showCancel: false,
  //       confirmText: '返回授权',
  //       success: function (res) {
  //         if (res.confirm) {
  //           console.log('用户点击了“返回授权”');
  //         }
  //       }
  //     })
  //   }
  // },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
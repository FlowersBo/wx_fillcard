// pages/respirator/payment/index.js
var wxRequest = require('../../../utils/requestUrl.js');
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sNum: 1, // input默认是1
    money: 188,
    minusStatus: 'disabled', // 使用data数据对象设置样式名
    disabledBtn: false, //提交是否禁用
    names: '',
    mobile: '',
    region: '',
    address: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  //收货地址
  address: function() {
    wx.navigateTo({
      url: 'address/index',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  /* 点击减号 */
  bindMinus: function() {
    var sNum = this.data.sNum;
    // 如果大于1时，才可以减  
    if (sNum > 1) {
      sNum--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = sNum <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    var money = sNum * 188
    this.setData({
      sNum: sNum,
      minusStatus: minusStatus,
      money: money
    });
  },
  /* 点击加号 */
  bindPlus: function() {
    var sNum = this.data.sNum;
    // 不作过多考虑自增1  
    sNum++;
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = sNum < 1 ? 'disabled' : 'normal';
    // 将数值与状态写回 
    var money = sNum * 188
    this.setData({
      sNum: sNum,
      minusStatus: minusStatus,
      money: money
    });
  },
  /* 输入框事件 */
  bindManual: function(e) {
    let sNum = e.detail.value;
    if (sNum.length == 1) {
      sNum = sNum.replace(/[^1-9]/g, '1')
    } else {
      sNum = sNum.replace(/\D/g, '1')
    }
    if (sNum == '') {
      sNum = 1
    }
    console.log("输入的数量", sNum);
    var money = sNum * 188
    that.setData({
      sNum: sNum,
      money: money
    });
  },
  //textarea输入
  inputs: function(e) {
    var cursor = e.detail.cursor;
    var cursorValue = e.detail.value;
    that.setData({
      cursorValue: cursorValue,
      cursor: cursor
    })
  },
  //付款
  paymentFun: function() {
    var sNum = that.data.sNum;
    var money = that.data.money;
    var cursorValue = that.data.cursorValue;
    var names = that.data.names;
    var mobile = that.data.mobile;
    var region = that.data.region;
    var address = that.data.address;
    var mobile_reg = /^1[3|4|5|6|7|8|9]\d{9}$/;
    // money = 0.01;
    console.log(sNum, money, cursorValue);
    if (sNum == '') {
      wx.showToast({
        title: '请选择数量',
        icon: 'none',
        duration: 2000
      })
      return false;
    } else if (money == '') {
      wx.showToast({
        title: '金额错误',
        icon: 'none',
        duration: 2000
      })
      return false;
    } else if (names == '') {
      wx.showToast({
        title: '请填写收货人',
        icon: 'none',
        duration: 2000
      })
      return false;
    } else if (mobile == '' || (!mobile_reg.test(mobile))) {
      wx.showToast({
        title: '手机号有误',
        icon: 'none',
        duration: 2000
      })
      return false;
    } else if (region == '') {
      wx.showToast({
        title: '请填写地区信息',
        icon: 'none',
        duration: 2000
      })
      return false;
    } else if (address == '') {
      wx.showToast({
        title: '请填写详细地址',
        icon: 'none',
        duration: 2000
      })
      return false;
    } else {
      wx.showModal({
        title: '提示',
        content: '确认付款吗？',
        success(res) {
          if (res.confirm) {
            wx.login({
              success: function(res) {
                console.log(res)
                if (res.code) {
                  var dataUrl = "/auth/getOpenId";
                  var param = {
                    code: res.code
                  };
                  wxRequest(dataUrl, param)
                    .then(res => {
                      console.log('code返回', res)
                      if (res.code == "0000") {
                        var openid = res.openid;
                        var dataUrl = "/sale/createOrder";
                        var param = {
                          openid: openid,
                          productCount: sNum,
                          linkAddress: region + address,
                          linkTelephone: mobile,
                          linkUserName: names,
                          amount: money,
                          remark: cursorValue
                        };
                        wxRequest(dataUrl, param).then(res => {
                          console.log('支付返回', res);
                          if (res.code == "0000") {
                            wx.showLoading({
                              title: '支付中...',
                            })
                            wx.requestPayment({
                              timeStamp: res.timeStamp,
                              nonceStr: res.nonceStr,
                              package: res.package_,
                              signType: res.signType,
                              paySign: res.paySign,
                              success: function(res) {
                                console.log("支付成功", res);
                                wx.showLoading({
                                  title: '支付成功',
                                })
                                setTimeout(function() {
                                  wx.hideLoading();
                                  wx.reLaunch({
                                    url: '/pages/respirator/index'
                                  })
                                }, 400);
                              },
                              fail: function(res) {
                                console.log("支付失败", res);
                                wx.showLoading({
                                  title: '取消支付',
                                })
                                wx.hideLoading();
                              },
                              complete: function(res) {
                                console.log(res);
                                setTimeout(function() {
                                  wx.hideLoading({
                                    title: res.msg,
                                  })
                                }, 500);
                              }
                            });
                          }
                        });
                      }
                    });
                }
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  //支付
  // paymentFun(orderId) {
  //   console.log("支付")
  //   var salePrice = that.data.salePrice;
  //   console.log("支付orderId", orderId)
  //   // salePrice = 0.01;
  //   var dataUrl = "/trade/pay/createPayOrder";
  //   var param = {
  //     module: 0,
  //     dataId: orderId,
  //     amount: salePrice
  //   }
  //   wxRequest(dataUrl, param)
  //     .then(function(res) {
  //       console.log('充值所需参数', salePrice);
  //       console.log("支付返回", res);
  //       if (res.code == "0000") {
  //         wx.showLoading({
  //           title: '支付中...',
  //         })
  //         that.setData({
  //           disabled: false
  //         });
  //         var result = res;
  //         wx.requestPayment({
  //           timeStamp: result.timeStamp,
  //           nonceStr: result.nonceStr,
  //           package: result.package_,
  //           signType: result.signType,
  //           paySign: result.paySign,
  //           success: function(res) {
  //             console.log("支付成功", res);
  //             wx.showLoading({
  //               title: '支付成功',
  //             })
  //             setTimeout(function() {
  //               wx.reLaunch({
  //                 url: '/pages/user/meVipcard/index'
  //               })
  //             }, 300);
  //             wx.setStorageSync('orderId', '')
  //           },
  //           fail: function(res) {
  //             console.log("支付失败", res);
  //             wx.showLoading({
  //               title: '取消支付',
  //             })
  //           },
  //           complete: function(res) {
  //             console.log(res);
  //             setTimeout(function() {
  //               wx.hideLoading({
  //                 title: res.msg,
  //               })
  //             }, 500);
  //           }
  //         });
  //       } else {
  //         that.setData({
  //           disabled: false
  //         });
  //         wx.showToast({
  //           title: res.msg,
  //           icon: 'none',
  //           duration: 1000
  //         })
  //       }
  //     })
  //     .catch(res => {
  //       console.log("支付错误原因", res);
  //       wx.hideLoading();
  //     })
  // },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    setTimeout(function () {
      wx.stopPullDownRefresh()
    }, 500)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
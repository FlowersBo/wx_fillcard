// pages/user/index.js
var that;
var app = getApp();
var wxRequest = require('../../utils/requestUrl.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    amount: '', //余额
    // isShow: "showNone",
    // isNo1: "container",
    iconImg: [{
        "index": "0",
        "img": "/resource/img/userImg/detail.png",
        "name": "消费明细"
      },
      {
        "index": "1",
        "img": "/resource/img/userImg/meCard.png",
        "name": "我的会员卡"
      },
      {
        "index": "2",
        "img": "/resource/img/userImg/saleCard.png",
        "name": "在售会员卡"
      },
    ],
    iconStyle: [{
        "index": "0",
        "img": "/resource/img/userImg/backCrad.png",
        "name": "绑定银行卡"
      },
      {
        "index": "1",
        "img": "/resource/img/userImg/phone.png",
        "name": "绑定手机号"
      },
      {
        "index": "2",
        "img": "/resource/img/userImg/withdraw.png",
        "name": "提现"
      },
      {
        "index": "3",
        "img": "/resource/img/userImg/withdrawOrder.png",
        "name": "提现记录"
      },
      {
        "index": "4",
        "img": "/resource/img/userImg/service.png",
        "name": "联系客服"
      },
      // {
      //   "index": "5",
      //   "img": "/resource/img/userImg/generalize.png",
      //   "name": "推广赚钱"
      // }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    var query = wx.createSelectorQuery();
    query.select('.grid-item-container').boundingClientRect(function (rect) {
      console.log(rect.width)
      that.setData({
        clientWidth: rect.width / 3
      })
    }).exec();

    // wx.getSystemInfo({
    //   success: function(res) {
    //     // console.log(res.windowWidth)
    //     // var clientWidth = res.windowWidth,
    //     var clientWidth = 750 / 3;
    //     console.log(clientWidth)
    //     that.setData({
    //       clientWidth: clientWidth,
    //     });
    //   }
    // })
  },


  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var token = wx.getStorageSync('token');
    var userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      var nickName = userInfo.nickName;
      var avatarUrl = userInfo.avatarUrl;
      that.setData({
        nickName: nickName,
        avatarUrl: avatarUrl
      })
    }
    console.log("是否有token", token);
    if (token) {
      var dataUrl = '/account/myInfo';
      var param = {};
      wxRequest(dataUrl, param).then(res => {
        console.log("用户信息", res);
        if (res.code == "0000") {
          var amount = res.amount;
          var telephone = res.telephone;
          var spreadStatus = res.spreadStatus;
          var accountId = res.accountId;
          var bindCardStatus = res.bindCardStatus;
          wx.setStorage({
            key: "accountId",
            data: accountId
          })
          that.setData({
            amount: amount,
            telephone: telephone,
            spreadStatus: spreadStatus,
            bindCardStatus: bindCardStatus
          });
        }
      })
    }
    // else {
    //   wx.navigateTo({
    //     url: '/pages/wxlogin/index',
    //   })
    // }
  },

  //九宫格跳转页面
  gotoPach(e) {
    if (!this.data.telephone) {
      wx.navigateTo({
        url: '/pages/wxlogin/index',
      })
    }
    console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;
    if (index == 0) {
      wx.navigateTo({
        url: "meWallet/index",
      })
    } else if (index == 1) {
      wx.navigateTo({
        url: "meVipcard/index",
      })
    } else if (index == 2) {
      wx.navigateTo({
        url: "sellVipcard/index",
      })
    }
  },

  bindorder(e){
    if (!this.data.telephone) {
      wx.navigateTo({
        url: '/pages/wxlogin/index',
      })
    }
    let writeOffStatus = '';
    if(e.currentTarget.dataset.id==1){
      writeOffStatus = 0
    }else{
      writeOffStatus = ''
    }
    wx.navigateTo({
      url: 'orderForm/index?writeOffStatus=' + writeOffStatus,
    })
  },

  gotoPage(e) {
    if (!this.data.telephone) {
      wx.navigateTo({
        url: '/pages/wxlogin/index',
      })
    }
    console.log(e.currentTarget.dataset.id);
    var index = e.currentTarget.dataset.id;
    if (index == 0) {
      var telephone = that.data.telephone;
      var bindCardStatus = that.data.bindCardStatus;
      if (bindCardStatus == '0') {
        wx.navigateTo({
          url: 'bankCard/index?telephone=' + telephone,
        })
      } else {
        wx.navigateTo({
          url: 'bankCard/addBankCard/index?telephone=' + telephone,
        })
      }
    } else if (index == 1) {
      wx.navigateTo({
        url: 'bindMobile/index',
      })
    } else if (index == 2) {
      var amount = that.data.amount;
      if (amount >= 1) {
        var dataUrl = '/trade/withdraw/withdrawFee';
        var param = {
          accountType: 0,
          amount: amount
        };
        wxRequest(dataUrl, param).then(res => {
            console.log("提现信息返回", res);
            var feeDesc = res.feeDesc;
            if (res.code == "0000") {
              wx.showModal({
                title: '提示',
                content: feeDesc,
                success(res) {
                  if (res.confirm) {
                    console.log('用户点击确定');
                    var dataUrl = '/trade/withdraw/withdraw';
                    var param = {
                      accountType: 0,
                      amount: amount
                    };
                    wxRequest(dataUrl, param).then(res => {
                        console.log("提现返回", res);
                        if (res.code == "0000") {
                          wx.showToast({
                            title: '提现金额将在1-2个工作日到您的银行账户',
                            icon: 'none',
                            duration: 3000
                          })
                          that.onShow();
                        } else {
                          wx.showToast({
                            title: res.msg,
                            icon: 'none',
                            duration: 2000
                          })
                        }
                      })
                      .catch(function (res) {
                        wx.showToast({
                          title: res.error,
                          icon: 'none',
                          duration: 1000
                        })
                      })

                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            } else {
              wx.showToast({
                title: res.msg,
                icon: 'none',
                duration: 2000
              })
            }
          })
          .catch(function (res) {
            wx.showToast({
              title: res.error,
              icon: 'none',
              duration: 1000
            })
          })

      } else {
        wx.showToast({
          title: '金额小于1元无法提现',
          icon: 'none',
          duration: 1000
        })
      }
    } else if (index == 3) {
      wx.navigateTo({
        url: 'withdrawRecord/index',
      })
    } else if (index == 4) {
      wx.makePhoneCall({
        phoneNumber: '010-80251942',
        success: function () {
          console.log("拨打电话成功！")
        },
        fail: function () {
          console.log("拨打电话失败！")
        }
      })
    } else if (index == 5) {
      var spreadStatus = that.data.spreadStatus;
      if (spreadStatus == '0') {
        wx.navigateTo({
          url: '/pages/generalize/index',
        })
      } else {
        wx.showToast({
          title: '很抱歉,您还没有授权开通',
          icon: 'none',
          duration: 2000
        })
      }
    }
  },

  //图片点击事件
  imgYu: function (event) {
    var src = event.currentTarget.dataset.src;
    var imgList = [];
    imgList.push(src);
    console.log(src, imgList)
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("下拉刷新")
    // 显示顶部刷新图标  
    wx.showNavigationBarLoading();
    that.onShow();
    // 停止下拉动作  
    wx.stopPullDownRefresh();
    console.log("刷新", that.data.amount);
    if (that.data.amount >= 0) {
      // 隐藏导航栏加载框  
      wx.hideNavigationBarLoading();
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
})
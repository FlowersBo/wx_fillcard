// pages/payment/index.js
var that;
var wxRequest = require('../../utils/requestUrl.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked: true,
    isShow: true,
    disabled: false,
    // orderId:'',  //订单号
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    console.log(options);
    var salePrice = options.salePrice;
    var memberCardId = options.memberCardId;
    var merchantName = options.merchantName;
    var memberCardName = options.memberCardName;
    var merchantId = options.merchantId;
    var orderType = options.orderType;
    var productList = options.productList;
    var accountId = options.accountId; //用户ID
    var cardTypeId = options.cardTypeId; //是否为二手卡
    var writeOffStatus = options.writeOffStatus; //爆款跳转待使用
    var consumeAmount = options.consumeAmount; //多倍卡输入实际金额
    var cutPriceId = options.cutPriceId; //砍单单号
    productList = JSON.parse(productList);
    console.log('金额', salePrice)
    that.setData({
      salePrice: salePrice,
      memberCardId: memberCardId,
      merchantName: merchantName,
      memberCardName: memberCardName,
      merchantId: merchantId,
      orderType: orderType,
      productList: productList,
      accountId: accountId,
      cardTypeId: cardTypeId,
      writeOffStatus: writeOffStatus,
      consumeAmount: consumeAmount,
      cutPriceId: cutPriceId
    });
    wx.hideShareMenu();
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
    that.setData({
      orderId: ''
    });
  },
  //checkboxChange
  checkboxChange(e) {
    var choice = e.detail.value;
    var isShow = '';
    if (choice.length > 0) {
      isShow = true;
      that.setData({
        isShow: isShow
      });
    } else {
      isShow = false;
      that.setData({
        isShow: isShow
      });
    }
  },
  //免责协议
  liabilityFun() {
    wx.navigateTo({
      url: 'disclaimer/index',
    })
  },
  //创建订单
  saveFormId: function () {
    var isShow = that.data.isShow;
    if (isShow) {
      var token = wx.getStorageSync('token');
      var salePrice = that.data.salePrice;
      var memberCardId = that.data.memberCardId;
      var merchantId = that.data.merchantId;
      var orderType = that.data.orderType;
      var productList = that.data.productList;
      var accountId = that.data.accountId;
      var cardTypeId = that.data.cardTypeId; //是否为二手卡
      var consumeAmount = that.data.consumeAmount;
      var cutPriceId = that.data.cutPriceId; //砍单单号
      console.log('砍单单号',cutPriceId);
      // salePrice = 0.01;
      if (token && salePrice) {
        that.setData({
          disabled: true
        });
        // 5.21 判断当前卡交易失败再次交易
        var orderId = wx.getStorageSync('orderId');
        var oldMemberCardId = wx.getStorageSync('oldMemberCardId');
        console.log('当前memberCardId', memberCardId, "老的oldMemberCardId", oldMemberCardId);
        console.log(memberCardId == oldMemberCardId);
        console.log("有无orderId", orderId);
        if (orderId && memberCardId == oldMemberCardId) {
          that.paymentFun(orderId);
        } else {
          console.log("创建订单")
          var dataUrl = '/trade/order/createOrder';
          var param = {
            orderType: orderType,
            memberCardId: memberCardId,
            amount: salePrice,
            merchantId: merchantId,
            productList: productList,
            fromAccountId: accountId, //推广id
            consumeAmount: consumeAmount,
            cutPriceId: cutPriceId
          }
          wxRequest(dataUrl, param)
            .then(function (res) {
              //业务逻辑
              console.log("创建订单返回", res);
              //调用下一个请求
              if (res.code == "0000") {
                var orderId = res.orderId;
                // that.setData({ orderId: orderId });
                if (memberCardId && cardTypeId == '0') {
                  wx.setStorageSync('orderId', orderId);
                  wx.setStorageSync('oldMemberCardId', memberCardId);
                } else {
                  wx.setStorageSync('orderId', '');
                }
                that.paymentFun(orderId);
              } else {
                that.setData({
                  disabled: false
                });
                wx.showToast({
                  title: res.msg,
                  icon: 'none',
                  duration: 1000
                })
              }
            })
            .catch(function (res) {
              console.log(res);
              that.setData({
                disabled: false
              });
              wx.showToast({
                title: res.error,
                icon: 'none',
                duration: 1000
              })
              return false
            })
        }
      } else {
        that.setData({
          disabled: false
        });
        wx.showToast({
          title: '服务器忙，请稍后重试',
          icon: 'none',
          duration: 1000
        })
      }
    } else {
      wx.showToast({
        title: '请先同意勾选服务协议',
        icon: 'none',
        duration: 2000
      })
    }
  },

  //支付
  paymentFun(orderId) {
    console.log("支付")
    var salePrice = that.data.salePrice;
    var orderType = that.data.orderType;
    console.log("是否有orderId", orderId)
    // salePrice = 0.01;
    var dataUrl = "/trade/pay/createPayOrder";
    var param = {
      module: 0,
      dataId: orderId,
      amount: salePrice
    }
    wxRequest(dataUrl, param)
      .then(function (res) {
        console.log('充值所需参数', salePrice);
        console.log("支付返回", res);
        if (res.code == "0000") {
          wx.showLoading({
            title: '支付中...',
          })
          that.setData({
            disabled: false
          });
          var result = res;
          wx.requestPayment({
            timeStamp: result.timeStamp,
            nonceStr: result.nonceStr,
            package: result.package_,
            signType: result.signType,
            paySign: result.paySign,
            success: function (res) {
              console.log("支付成功", res);
              wx.showLoading({
                title: '支付成功',
              })
              var writeOffStatus = that.data.writeOffStatus;
              setTimeout(function () {
                if (writeOffStatus == '') {
                  wx.reLaunch({
                    url: '/pages/user/orderForm/index?writeOffStatus=' + writeOffStatus
                  })
                } else if (orderType === '3') {
                  // 判断是否为砍单
                  wx.reLaunch({
                    url: '/pages/user/bargainIndent/index?currentTab=' + 1
                  })
                } else {
                  wx.reLaunch({
                    url: '/pages/user/meVipcard/index'
                  })
                }
              }, 300);
              wx.setStorageSync('orderId', '');
              wx.setStorageSync('oldMemberCardId', '');
            },
            fail: function (res) {
              console.log("支付失败", res);
              wx.showLoading({
                title: '取消支付',
              })
            },
            complete: function (res) {
              console.log(res);
              setTimeout(function () {
                wx.hideLoading({
                  title: res.msg,
                })
              }, 500);
            }
          });
        } else {
          that.setData({
            disabled: false
          });
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 1000
          })
        }
      })
      .catch(res => {
        console.log("支付错误原因", res);
        wx.hideLoading();
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
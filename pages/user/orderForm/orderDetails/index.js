// pages/user/orderForm/orderDetails/index.js
var that;
const app = getApp();
var wxRequest = require('../../../../utils/requestUrl.js');
var WxParse = require('../../../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: false,
    vertical: false,
    circular: true,
    interval: 2000,
    autoplay: true,
    duration: 500,
    rotateIndex: 0,
    screenWidth: app.data.screenWidth, //屏幕宽度
    screenHeight: app.data.screenHeight,
    windowWidth: app.data.windowWidth,
    isBtn: "forbidBtn", //btn显示效果
    cancelCode: '已使用',
    forbid: 1, //禁止跳转
    faddishDetail: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    console.log(options);
    var orderId = options.orderId;
    // orderId = 1002851;
    that.setData({
      orderId: orderId
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    that.productDetail();
  },

  //详情
  productDetail() {
    var orderId = that.data.orderId;
    var dataUrl = '/trade/order/detail';
    var param = {
      orderId: orderId
    };
    wxRequest(dataUrl, param)
      .then(res => {
        console.log("爆款详情", res);
        if (res.code == "0000") {
          var faddishDetail = res.data;
          var merchantInfo = faddishDetail.merchantInfo;
          var proList = faddishDetail.proList[0];
          var merchantName = merchantInfo.merchantName;
          var usageRule = proList.usageRule;
          var productName = proList.productName;
          var latitude = merchantInfo.latitude;
          var longitude = merchantInfo.longitude;
          var qrCode = faddishDetail.qrCode;
          var writeOffStatus = faddishDetail.writeOffStatus;
          if (writeOffStatus == 0) {
            that.setData({
              forbid: 0,
              isBtn: '',
              cancelCode: '核销码'
            });
          } else if (writeOffStatus == 3){
            that.setData({
              cancelCode: '已过期'
            });
          }
          if (usageRule) {
            WxParse.wxParse('usageRule', 'html', usageRule, that, 5);
          }
          wx.setNavigationBarTitle({
            title: productName
          })
          that.setData({
            merchantInfo: merchantInfo,
            proList: proList,
            qrCode: qrCode,
            latitude: latitude,
            longitude: longitude
          });
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000
          })
        }
      })
      .catch(function(res) {
        console.log("错误", res);
      })
  },

  //跳转地图
  gotuMap: function() {
    var latitude = that.data.latitude;
    var longitude = that.data.longitude;
    if (latitude) {
      wx.navigateTo({
        url: '/pages/map/index?latitude=' + latitude + '&longitude=' + longitude,
      })
    }
  },

  // 拨打电话
  calling: function(e) {
    console.log(e);
    var mobile = e.currentTarget.dataset.mobile;
    wx.makePhoneCall({
      phoneNumber: mobile,
      success: function() {
        console.log("拨打电话成功！")
      },
      fail: function() {
        console.log("拨打电话失败！")
      }
    })
  },
  // 跳转二维码
  cancelAfterVerification: function(e) {
    var qrCode = that.data.qrCode;
    var forbId = e.currentTarget.dataset.forbid;
    if (forbId == 0) {
      if (qrCode) {
        wx.navigateTo({
          url: 'qrCode/index?qrCode=' + qrCode,
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    clearInterval(that.data.timer);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    console.log("下拉刷新")
    // 显示顶部刷新图标  
    wx.showNavigationBarLoading();
    that.productDetail();
    // 停止下拉动作  
    if (that.data.faddishDetail) {
      // 隐藏导航栏加载框  
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }
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
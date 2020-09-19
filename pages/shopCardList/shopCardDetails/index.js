// pages/shopCardList/shopCardDetails/index.js
var that;
var wxRequest = require('../../../utils/requestUrl.js');
var WxParse = require('../../../wxParse/wxParse.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    vertical: false,
    circular: true,
    interval: 3000,
    autoplay: true,
    duration: 500,
    details: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    var productId = options.productId;
    if (productId) {
      that.setData({
        productId: productId
      });
    }
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
    var productId = that.data.productId;
    var dataUrl = '/product/productDetail?productId=' + productId;
    var param = {};
    wxRequest(dataUrl, param)
      .then(res => {
        console.log("用户扫码商品展示", res);
        if (res.code == "0000") {
          var merchantName = res.merchantName;
          var article = res.usageRule;
          var latitude = res.latitude;
          var longitude = res.longitude;
          WxParse.wxParse('article', 'html', article, that, 5);
          wx.setNavigationBarTitle({
            title: merchantName
          })
          that.setData({
            details: res,
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
  gotuMap: function () {
    var latitude = that.data.latitude;
    var longitude = that.data.longitude;
    if (latitude) {
      wx.navigateTo({
        url: '/pages/map/index?latitude=' + latitude + '&longitude=' + longitude,
      })
    }
  },

  // 拨打电话
  calling: function (e) {
    console.log(e);
    var mobile = e.currentTarget.dataset.mobile;
    wx.makePhoneCall({
      phoneNumber: mobile,
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },

  //跳转支付
  gotoPayment() {
    var token = wx.getStorageSync('token');
    console.log("是否有token", token);
    var salePrice = that.data.details.price;
    var memberCardName = that.data.details.productName;
    var merchantName = that.data.details.merchantName;
    var merchantId = that.data.details.merchantId;
    var memberCardId = '';
    var productList = [];
    var orderType = 0;
    var accountId = '';
    let obj = {};
    obj.amountUnit = that.data.details.price;
    obj.count = 1;
    obj.productId = that.data.details.productId;
    productList.push(obj);
    productList = JSON.stringify(productList);
    console.log(productList);
    if (token) {
      wx.navigateTo({
        url: '/pages/payment/index?salePrice=' + salePrice + '&memberCardId=' + memberCardId + '&memberCardName=' + memberCardName + '&merchantName=' + merchantName + '&merchantId=' + merchantId + '&productList=' + productList + '&orderType=' + orderType + '&accountId=' + accountId,
      })
    } else {
      wx.navigateTo({
        url: '/pages/wxlogin/index',
      })
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
    wx.stopPullDownRefresh();
    if (that.data.details) {
      // 隐藏导航栏加载框  
      wx.hideNavigationBarLoading();
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
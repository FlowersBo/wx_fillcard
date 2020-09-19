// pages/shopCardList/index.js
var that;
var wxRequest = require('../../utils/requestUrl.js');
var wxLogin = require('../../utils/wxLogin.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shonDetails: '',
    productList:[], //卡列表
    bannerList:[], //轮播图列表
    indicatorDots: true,
    vertical: false,
    circular: true,
    interval: 2000,
    autoplay: true,
    duration: 500,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    var merchantId = options.merchantId;
    // merchantId=482;
    console.log("merchantId", merchantId);
    if (merchantId) {
      that.setData({ merchantId: merchantId });
    }
    //二次登录
    wxLogin().then(res => {
      console.log('二次确认登录', res)
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
    console.log('电话',mobile);
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    that.shonDetailsFun();
  },
  //商家详情
  shonDetailsFun() {
    var merchantId = that.data.merchantId;
    var dataUrl = '/merchant/merchantIndex?merchantId=' + merchantId;
    var param = {};
    wxRequest(dataUrl, param)
      .then(res => {
        console.log("用户扫码商品展示", res);
        if (res.code == "0000") {
          var shonDetails = res;
          var productList = res.productList;
          var bannerList = res.bannerList;
          var latitude = res.latitude;
          var longitude = res.longitude;
          console.log(latitude, longitude)
          that.setData({
            shonDetails: shonDetails,
            productList: productList,
            bannerList: bannerList,
            latitude: latitude,
            longitude: longitude
          });
        }else{
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 1000
          })
        }
      })
      .catch(function(res) {
        console.log("错误", res);
      })
  },

  //跳转商铺详情
  shonCardDetails(e) {
    console.log(e)
    var productId = e.target.dataset.productid;
    wx.navigateTo({
      url: 'shopCardDetails/index?productId=' + productId,
    })
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
    that.shonDetailsFun();
    // 停止下拉动作  
    wx.stopPullDownRefresh();
    if (that.data.shonDetails) {
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
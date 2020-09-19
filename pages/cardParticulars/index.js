// pages/index/cardParticulars/index.js
var that;
var wxRequest = require('../../utils/requestUrl.js');
var WxParse = require('../../wxParse/wxParse.js');
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
    recommendList: [], //推荐列表
    shopCardsDetails: '', //详情
    salePrice: '', //支付金额
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    console.log("商店卡", options);
    var memberCardId = options.memberCardId;
    that.setData({
      memberCardId: memberCardId
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
//跳转地图
  gotuMap:function(){
    var latitude = that.data.latitude;
    var longitude = that.data.longitude;
    if (latitude){
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
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    that.cardDetails();
  },
  //商家卡详情
  cardDetails:function(){
    var memberCardId = that.data.memberCardId;
    console.log(memberCardId);
    var dataUrl = "/card/resellDetail?memberCardId=" + memberCardId;
    var param = {
    };
    wxRequest(dataUrl, param)
      .then(function (res) {
        //业务逻辑
        console.log("店铺的卡详情", res);
        if(res.code=='0000'){
          var recommendList = res.recommendList;
          var shopCardsDetails = res;
          var salePrice = res.salePrice;
          var merchantName = res.merchantName;
          var memberCardName = res.memberCardName;
          var merchantId = res.merchantId;
          var usageRule = res.usageRule;
          var detailDesc = res.detailDesc;
          var latitude = res.latitude;
          var longitude = res.longitude;
          if (usageRule){
            WxParse.wxParse('usageRule', 'html', usageRule, that, 5);
          }
          if (detailDesc) {
            WxParse.wxParse('detailDesc', 'html', detailDesc, that, 5);
          }
          wx.setNavigationBarTitle({
            title: res.merchantName
          })
          that.setData({
            shopCardsDetails: shopCardsDetails,
            recommendList: recommendList,
            salePrice: salePrice,
            merchantName: merchantName,
            memberCardName: memberCardName,
            merchantId: merchantId,
            latitude: latitude,
            longitude: longitude
          });
        }
      })
  },

  //支付跳转
  payment: function (e) {
    var token = wx.getStorageSync('token');
    console.log("是否有token", token);
    var salePrice = that.data.salePrice;
    var memberCardId = that.data.memberCardId;
    var merchantName = that.data.merchantName;
    var memberCardName = that.data.memberCardName;
    var merchantId = that.data.merchantId;
    var orderType = 1;
    var cardTypeId = '0';  //判断二手卡
    var accountId = '';
    var productList = [];
    productList = JSON.stringify(productList);
    console.log(productList);
    if (token){
      wx.navigateTo({
        url: '/pages/payment/index?salePrice=' + salePrice + '&memberCardId=' + memberCardId + '&memberCardName=' + memberCardName + '&merchantName=' + merchantName + '&merchantId=' + merchantId + '&productList=' + productList + '&orderType=' + orderType + '&accountId=' + accountId + '&cardTypeId=' + cardTypeId,
      })
    } else {
      wx.navigateTo({
        url: '/pages/wxlogin/index',
      })
    }
  },


  //跳转卡详情
  cardParticulars(e){
    console.log(e);
    var memberCardId = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/cardParticulars/index?memberCardId=' + memberCardId
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
    console.log("下拉刷新")
    // 显示顶部刷新图标  
    wx.showNavigationBarLoading();
    that.cardDetails();
    // 停止下拉动作  
    wx.stopPullDownRefresh();
    if (that.data.recommendList) {
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

  }
})
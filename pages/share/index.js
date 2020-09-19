// pages/share/index.js
var that;
var wxRequest = require('../../utils/requestUrl.js');
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    generalize: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    var productId = options.productId;
    var accountId = options.accountId;
    that.setData({ productId: productId, accountId});
    wx.hideShareMenu();
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
    that.shareFun();
  },
  //详情
  shareFun() {
    var productId = that.data.productId;
    console.log('当前productId', productId);
    var dataUrl = "/product/productDetail?productId=" + productId;
    var param = {};
    wxRequest(dataUrl, param).then(res => {
      console.log("分享详情", res);
      if (res.code == "0000") {
        var generalize = res;
        var article = res.usageRule;
        var merchantName = generalize.merchantName;
        WxParse.wxParse('article', 'html', article, that, 5);
        wx.setNavigationBarTitle({
          title: merchantName
        })
        that.setData({
          generalize: generalize
        });
      }
    });
  },
  gotoPayment() {
    var token = wx.getStorageSync('token');
    console.log("是否有token", token);
    var accountId = that.data.accountId;
    console.log('推广accountId', accountId); 
    var salePrice = that.data.generalize.spreadPrice;
    console.log('售价', salePrice);
    var merchantId = that.data.generalize.merchantId;
    console.log('商家ID', merchantId);
    var memberCardName = that.data.generalize.productName;
    console.log('卡名', memberCardName);
    var merchantName = that.data.generalize.merchantName;
    console.log('商家', merchantName);
    var memberCardId = '';
    var productList = [];
    var orderType = 0;
    let obj = {};
    obj.amountUnit = that.data.generalize.spreadPrice;
    obj.count = 1;
    obj.productId = that.data.generalize.productId;
    productList.push(obj);
    productList = JSON.stringify(productList);
    console.log(productList);
    if (token && salePrice) {
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
    // 停止下拉动作  
    if (that.data.generalize) {
      that.shareFun();
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
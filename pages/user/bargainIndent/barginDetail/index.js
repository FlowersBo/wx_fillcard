// pages/index/index.js
var that;
var wxRequest = require('../../../../utils/requestUrl.js');
var WxParse = require('../../../../wxParse/wxParse.js');
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    wx.hideShareMenu();
    var cutPriceId = options.cutPriceId;
    var currentTab = options.currentTab;
    // currentTab = '0';
    // cutPriceId = 3;
    that.setData({
      cutPriceId: cutPriceId,
      currentTab: currentTab
    })
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
    that.merchantDetail();
  },
  merchantDetail: function () {
    var cutPriceId = that.data.cutPriceId;
    var currentTab = that.data.currentTab;
    console.log("订单ID", cutPriceId);
    var dataUrl = "/trade/cutPrice/detail";
    var param = {
      cutPriceId: cutPriceId
    };
    wxRequest(dataUrl, param)
      .then(function (res) {
        //业务逻辑
        console.log('订单信息', res);
        if (res.code == '0000') {
          var merchant = res.data;
          var merchantInfo = merchant.merchantInfo;
          var latitude = merchantInfo.latitude;
          var longitude = merchantInfo.longitude;
          var article = merchant.cutPriceDesc;
          var price = merchant.surplusAmount;
          var productName = merchant.productName;
          var merchantName = merchantInfo.merchantName;
          var merchantId = merchantInfo.merchantId;
          var productId = merchant.productId;
          var spreadTitle = merchant.productName;
          if(currentTab==='1'||currentTab==='2'){
            that.relativesFun();
          }
          WxParse.wxParse('article', 'html', article, that, 5);
          wx.setNavigationBarTitle({
            title: productName
          })
          that.setData({
            merchant: merchant,
            latitude: latitude,
            longitude: longitude,
            merchantInfo: merchantInfo,
            price: price,
            productName: productName,
            merchantName: merchantName,
            merchantId: merchantId,
            productId: productId,
            spreadTitle: spreadTitle
          });
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000
          })
        }
      })
      .catch(function (res) {
        console.log('请求失败', res);
      })
  },
  // 砍价团
  relativesFun: function () {
    var cutPriceId = that.data.cutPriceId;
    var dataUrl = "/trade/cutPrice/cutRecordList";
    var param = {
      cutPriceId: cutPriceId
    };
    wxRequest(dataUrl, param)
      .then(function (res) {
        //业务逻辑
        console.log('砍价团', res);
        if (res.code == '0000') {
          var relatives = res.data;
          that.setData({
            relatives: relatives,
          });
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000
          })
        }
      })
      .catch(function (res) {
        console.log('请求失败', res);
      })
  },
  //跳转相册
  // gotophotoAlbum: function () {
  //   var merchantId = that.data.merchantId;
  //   wx.navigateTo({
  //     url: '/pages/photoAlbum/index?merchantId=' + merchantId,
  //   })
  // },

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
    var salePrice = that.data.price;
    var memberCardName = that.data.productName;
    var merchantName = that.data.merchantName;
    var merchantId = that.data.merchantId;
    var cutPriceId = that.data.cutPriceId;
    var memberCardId = '';
    var productList = [];
    var orderType = 3;
    var accountId = '';
    let obj = {};
    obj.amountUnit = that.data.price;
    obj.count = 1;
    obj.productId = that.data.productId;
    productList.push(obj);
    productList = JSON.stringify(productList);
    console.log(productList);
    if (token) {
      wx.navigateTo({
        url: '/pages/payment/index?salePrice=' + salePrice + '&memberCardId=' + memberCardId + '&memberCardName=' + memberCardName + '&merchantName=' + merchantName + '&merchantId=' + merchantId + '&productList=' + productList + '&orderType=' + orderType + '&accountId=' + accountId + '&cutPriceId=' + cutPriceId,
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
    that.merchantDetail();
    // 停止下拉动作  
    if (that.data.merchant) {
      // 隐藏导航栏加载框  
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
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
  onShareAppMessage: function (options) {
    var spreadTitle = that.data.spreadTitle;
    var cutPriceId = that.data.cutPriceId;
    var productId = that.data.productId;
    console.log(options);
    console.log(cutPriceId);
    // 来自页面内的按钮的转发
    if (options.from == 'button') { // 此处可以修改 shareObj 中的内容
      console.log('来自页面内的按钮的转发')
      var shareObj = {
        title: spreadTitle,
        path: '/pages/bargainShare/index?cutPriceId=' + cutPriceId + '&productId=' + productId,
        imageUrl: '',
        success: function (res) {
          console.log(res + '成功');
          if (res.errMsg == 'shareAppMessage:ok') {
            console.info(res + '成功');
          }
        },
        fail: function () {
          if (res.errMsg == 'shareAppMessage:fail cancel') { // 用户取消转发
          } else if (res.errMsg == 'shareAppMessage:fail') {}
        },
        complete: function () {}
      };
      console.log('分享详情', shareObj);
    }
    return shareObj;
  }
})
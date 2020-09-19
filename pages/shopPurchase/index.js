// pages/index/index.js
var that;
var wxRequest = require('../../utils/requestUrl.js');
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
    shopCards: [],
    firstCard: [],
    isFang: false,
    current: 1 //页数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    console.log("商店", options);
    var merchantId = options.merchantId;
    var merchantName = options.merchantName;
    wx.setNavigationBarTitle({
      title: merchantName
    })
    that.setData({
      merchantId: merchantId
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
    that.firstCardFun();
    that.merchantDetail();
  },
  merchantDetail: function () {
    var merchantId = that.data.merchantId;
    console.log('店铺ID', merchantId)
    var dataUrl = "/merchant/detail?merchantId=" + merchantId;
    var param = {};
    wxRequest(dataUrl, param)
      .then(function (res) {
        //业务逻辑
        console.log('商家信息', res);
        if (res.code == '0000') {
          var merchant = res;
          var latitude = res.latitude;
          var longitude = res.longitude;
          that.setData({
            merchant: merchant,
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
      .catch(function (res) {
        console.log('请求失败', res);
      })
  },

  //跳转相册
  gotophotoAlbum:function(){
    var merchantId = that.data.merchantId;
    wx.navigateTo({
      url: '/pages/photoAlbum/index?merchantId='+ merchantId,
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

  //商家一手卡
  firstCardFun: function () {
    var merchantId = that.data.merchantId;
    console.log('店铺ID', merchantId)
    var dataUrl = "/product/productList";
    var param = {
      page: {
        size: 10,
        current: 1
      },
      merchantId: merchantId,
      status: 0
    };
    wxRequest(dataUrl, param)
      .then(function (res) {
        //业务逻辑
        console.log(res);
        if (res.code == '0000') {
          console.log("店铺的一手卡", res.records);
          var firstCard = res.records;
          that.setData({
            firstCard: firstCard,
          });
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000
          })
        }
        that.shopPurchase();
      })
      .catch(function (res) {
        console.log(res)
        if (res.code == '500') {
          that.setData({
            firstCard: []
          })
          that.shopPurchase();
        }
      })
  },

  //商家二手卡
  shopPurchase: function () {
    var merchantId = that.data.merchantId;
    console.log('店铺ID', merchantId)
    var dataUrl = "/card/resellList";
    var param = {
      page: {
        size: 10,
        current: 1
      },
      merchantId: merchantId
    };
    wxRequest(dataUrl, param)
      .then(function (res) {
        //业务逻辑
        console.log(res);
        if (res.code == '0000') {
          // console.log("店铺的一手卡", firstCard);
          console.log("店铺的二手卡", res.records);
          var shopCards = res.records;
          // console.log("合并", firstCard.concat(shopCard));
          // var shopCards = firstCard.concat(shopCard);
          that.setData({
            shopCards: shopCards,
            current: 1,
          });
          var firstCard = that.data.firstCard;
          if (shopCards.length > 0 || firstCard.length > 0) {
            that.setData({
              isFang: true
            });
          } else if (shopCards.length <= 0 && firstCard.length <= 0) {
            that.setData({
              isFang: false
            });
          }
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
        if (res.code == '500') {
          if (that.data.firstCard.length >= 1) {
            that.setData({
              shopCards: [],
              isFang: true
            })
          }
        }
      })
  },
  //一手卡跳转商铺详情
  shonCardDetails(e) {
    console.log(e)
    var productId = e.currentTarget.dataset.productid;
    console.log('一手卡ID', productId);
    wx.navigateTo({
      url: '/pages/shopCardList/shopCardDetails/index?productId=' + productId,
    })
  },

  //二手卡详情跳转
  cardParticulars: function (e) {
    console.log(e);
    var memberCardId = e.currentTarget.dataset.id;
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
    that.firstCardFun();
    // 停止下拉动作  
    if (that.data.shopCards || that.data.firstCard) {
      // 隐藏导航栏加载框  
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
      that.data.current = 1;
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 页数+1  
    let current = that.data.current;
    console
    current = current + 1;
    console.log("页数", current);
    var merchantId = that.data.merchantId;
    console.log(merchantId);
    var dataUrl = "/card/resellList";
    var param = {
      page: {
        size: 10,
        current: current
      },
      merchantId: merchantId
    };
    wxRequest(dataUrl, param).then(res => {
      var pages = res.pages;
      console.log("服务器总页数", pages)
      console.log("pus卡列表", res.records);
      if (pages < current) {
        console.log("暂时没有更多了")
        wx.showLoading({
          title: '暂时没有更多了',
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 500)
      } else {
        console.log("玩命加载中")
        wx.showLoading({
          title: '玩命加载中',
        })
        if (res.code == "0000") {
          var moment_list = that.data.shopCards;
          for (var i = 0; i < res.records.length; i++) {
            moment_list.push(res.records[i]);
          }
          console.log("push列表", moment_list)
          // 设置数据  
          that.setData({
            shopCards: moment_list,
            current: current
          })
          // 隐藏加载框  
          setTimeout(function () {
            wx.hideLoading()
          }, 500)
        }
      }
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
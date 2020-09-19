// pages/index/index.js
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
    validityStatus: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    wx.hideShareMenu();
    var cutPriceId = options.cutPriceId;
    var productId = options.productId;
    // productId=2213;
    // cutPriceId=26;
    that.setData({
      cutPriceId: cutPriceId,
      productId: productId
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
    var dataUrl = "/trade/cutPrice/detail";
    var param = {
      cutPriceId: cutPriceId
    };
    wxRequest(dataUrl, param)
      .then(function (res) {
        //业务逻辑
        console.log('商家信息', res);
        if (res.code == '0000') {
          var merchant = res.data;
          var productName = merchant.productName;
          var merchantInfo = merchant.merchantInfo;
          var validityStatus = merchant.validityStatus;
          if (validityStatus === '1') {
            console.log('该活动已过期');
            setTimeout(function () {
              wx.showToast({
                title: '该活动已过期',
                icon: 'none',
                duration: 2500
              })
            }, 1200)
          };
          // var article = '<h1>这是个啥</h1>';
          // WxParse.wxParse('article', 'html', article, that, 5);
          // var merchantName= res.merchantName;
          // wx.setNavigationBarTitle({
          //   title: merchantName
          // })
          that.relativesFun();
          that.setData({
            merchant: merchant,
            productName: productName,
            merchantInfo: merchantInfo,
            validityStatus: validityStatus
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

  //砍价
  bargainFun: function (e) {
    var token = wx.getStorageSync('token');
    console.log("是否有token", token);
    var cutPriceId = that.data.cutPriceId;
    let currentStatu = e.currentTarget.dataset.statu;
    if (token) {
      var dataUrl = '/trade/cutPrice/helpCutPrice';
      var param = {
        cutPriceId: cutPriceId
      };
      wxRequest(dataUrl, param).then(res => {
        console.log("帮砍信息", res);
        if (res.code == "0000") {
          that.util(currentStatu);

        } else {
          var bargainTtxt = res.msg;
          that.setData({
            bargainTtxt: bargainTtxt
          })
          that.util(currentStatu);
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/wxlogin/index',
      })
    }
  },

  //取消
  bargainCloseFun: function (e) {
    let currentStatu = e.currentTarget.dataset.statu;
    that.util(currentStatu);
  },
  // 模态动画
  util: function (currentStatu) {
    console.log('模态动画');
    /* 动画部分 */
    // 第1步：创建动画实例
    var animation = wx.createAnimation({
      duration: 300, //动画时长
      timingFunction: "linear", //线性
      delay: 0 //0则不延迟
    });
    // 第2步：这个动画实例赋给当前的动画实例
    this.animation = animation;
    // 第3步：执行第一组动画
    animation.opacity(0).step();
    // 第4步：导出动画对象赋给数据对象储存
    this.setData({
      animationData: animation.export()
    })
    // 第5步：设置定时器到指定时候后，执行第二组动画
    setTimeout(function () {
      // 执行第二组动画
      animation.opacity(1).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
      this.setData({
        animationData: animation
      })
      //关闭
      if (currentStatu == "close") {
        this.setData({
          showModalStatus: false
        });
      }
    }.bind(this), 300)
    // 显示
    if (currentStatu == "open") {
      that.setData({
        showModalStatus: true
      });
    }
  },

  //参与
  gotobargainDetailFun: function () {
    var productId = that.data.productId;
    wx.redirectTo({
      url: '/pages/bargainirg/index?productId=' + productId,
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
    that.merchantDetail();
    // 停止下拉动作  
    if (that.data.merchant) {
      // 隐藏导航栏加载框  
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }
  },


  // //跳转相册
  // gotophotoAlbum: function () {
  //   var merchantId = that.data.merchantId;
  //   wx.navigateTo({
  //     url: '/pages/photoAlbum/index?merchantId=' + merchantId,
  //   })
  // },

  // //跳转地图
  // gotuMap: function () {
  //   var latitude = that.data.latitude;
  //   var longitude = that.data.longitude;
  //   if (latitude) {
  //     wx.navigateTo({
  //       url: '/pages/map/index?latitude=' + latitude + '&longitude=' + longitude,
  //     })
  //   }
  // },

  // // 拨打电话
  // calling: function (e) {
  //   console.log(e);
  //   var mobile = e.currentTarget.dataset.mobile;
  //   wx.makePhoneCall({
  //     phoneNumber: mobile,
  //     success: function () {
  //       console.log("拨打电话成功！")
  //     },
  //     fail: function () {
  //       console.log("拨打电话失败！")
  //     }
  //   })
  // },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {

  }
})
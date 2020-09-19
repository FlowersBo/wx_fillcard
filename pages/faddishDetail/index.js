// pages/faddishDetail/index.js
var that;
const app = getApp();
var wxRequest = require('../../utils/requestUrl.js');
var WxParse = require('../../wxParse/wxParse.js');
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
    rotateIndex: 0,
    animationData: {},
    screenWidth: app.data.screenWidth, //屏幕宽度
    screenHeight: app.data.screenHeight,
    windowWidth: app.data.windowWidth,
    faddish: '', //爆款列表
    current: 1,   //爆款页数
    isBtn: "forbidBtn", //btn显示效果
    forbid: 1, //禁止跳转
    isShow: false, //显示进度条
    btnName: '已售停', //按钮文字
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    console.log(options);
    var productId = options.productId;
    // productId = 2149;
    that.setData({
      productId: productId
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // 创建动画
    var animation = wx.createAnimation({
      duration: 3000,
      timingFunction: "linear"
    })
    this.animation = animation
    // that.refreshList();
  },
  refreshList: function() {
    //连续动画定时器,所传参数每次+1
    // var circleCount = 0;
    // // 心跳的外框动画  
    // this.animationMiddleHeaderItem = wx.createAnimation({
    //   duration: 2000, // 以毫秒为单位  
    //   timingFunction: 'linear',
    //   delay: 100,
    //   transformOrigin: '50% 50%',
    //   success: function(res) {}
    // });
    // var timer = setInterval(function() {
    //   if (circleCount % 2 == 0) {
    //     this.animationMiddleHeaderItem.scale(1.2).rotate(-25).step();
    //   } else {
    //     this.animationMiddleHeaderItem.scale(0.8).rotate(25).step();
    //   }
    //   this.setData({
    //     animationMiddleHeaderItem: this.animationMiddleHeaderItem.export(), //输出动画
    //     timer: timer
    //   });
    //   circleCount++;
    //   if (circleCount == 100) {
    //     circleCount = 0;
    //     // console.log('清除定时器', circleCount)
    //     clearInterval(that.data.timer);
    //   }
    // }.bind(this), 2000);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    that.productDetail();
    that.faddishFun();

    // that.setData({ avatar:avatar,min: min, max: max, percent: percent, avatarUrl: avatarUrl});
  },

  //详情
  productDetail() {
    var productId = that.data.productId;
    var dataUrl = '/product/productDetail?productId=' + productId;
    var param = {};
    wxRequest(dataUrl, param)
      .then(res => {
        console.log("爆款详情", res);
        if (res.code == "0000") {
          var faddishDetail = res;
          // var merchantName = res.merchantName;
          var productName = res.productName;
          var usageRule = res.usageRule;
          var detailDesc = res.detailDesc;
          var latitude = res.latitude;
          var longitude = res.longitude;
          var buyerList = res.buyerList;
          var price = res.price;
          if (buyerList.length > 0) {
            buyerList = buyerList.slice(0, 11);
            // var omit = { avatarUrl: '/resource/img/sl.jpg'}
            // buyerList.push(omit);
            console.log('头像', buyerList)
            that.setData({
              buyerList: buyerList
            });
          }
          var storeStatus = res.storeStatus;
          if (storeStatus == '1') {
            that.setData({
              isShow: false,
              isBtn: "",
              forbid: 0,
              btnName: '立即抢购',
            });
          } else if (storeStatus == '0') {
            var countSaleShow = res.countSaleShow; //已抢购
            var store = res.store; //剩余的
            // store = 2;
            var countSaleSum = parseInt(countSaleShow + store);
            console.log('求和', countSaleSum);
            if (countSaleShow <= 0 || countSaleShow == '' || store <= 0 || store == '') {
              that.setData({
                isShow: false,
                btnName: '已售停',
              });
            } else {
              var percent = ((countSaleShow / countSaleSum).toFixed(2) * 100).toFixed(2);
              console.log('计算进度条百分比',percent);
              that.setData({
                isShow: true,
                percent: percent,
                isBtn: "",
                forbid: 0,
                btnName: '立即抢购',
              });
            }
          }
          if (usageRule) {
            WxParse.wxParse('usageRule', 'html', usageRule, that, 5);
          }
          if (detailDesc) {
            WxParse.wxParse('detailDesc', 'html', detailDesc, that, 5);
          }
          wx.setNavigationBarTitle({
            title: productName
          })
          that.setData({
            faddishDetail: res,
            price: price,
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

  //爆款列表
  faddishFun: function() {
    var dataUrl = "/product/productList";
    var param = {
      page: {
        size: 10,
        current: 1
      },
      productType: '1'
    };
    wxRequest(dataUrl, param).then(res => {
      console.log("爆款卡列表", res);
      if (res.code == "0000") {
        var faddish = res.records;
        that.setData({
          faddish: faddish,
          current: 1
        });
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }
    });
  },

  //爆款详情跳转
  faddishDetailFun: function(e) {
    console.log(e);
    var productId = e.currentTarget.dataset.productid;
    wx.navigateTo({
      url: '/pages/faddishDetail/index?productId=' + productId
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

  //跳转支付
  gotoPayment(e) {
    var forbid = e.currentTarget.dataset.forbid;
    var token = wx.getStorageSync('token');
    console.log("是否有token", token);
    var writeOffStatus = ''; //判断爆款支付完成跳转地址
    var salePrice = that.data.price;
    var memberCardName = that.data.faddishDetail.productName;
    var merchantName = that.data.faddishDetail.merchantName;
    var merchantId = that.data.faddishDetail.merchantId;
    var memberCardId = '';
    var productList = [];
    var orderType = 2;
    var accountId = '';
    let obj = {};
    obj.amountUnit = that.data.price;
    obj.count = 1;
    obj.productId = that.data.faddishDetail.productId;
    productList.push(obj);
    productList = JSON.stringify(productList);
    console.log(productList);
    if (token) {
      if (forbid == 1) {
        return false;
      }
      if (salePrice) {
        wx.navigateTo({
          url: '/pages/payment/index?salePrice=' + salePrice + '&memberCardId=' + memberCardId + '&memberCardName=' + memberCardName + '&merchantName=' + merchantName + '&merchantId=' + merchantId + '&productList=' + productList + '&orderType=' + orderType + '&accountId=' + accountId + '&writeOffStatus=' + writeOffStatus,
        })
      } else {
        wx.showToast({
          title: '网络错误，请稍后重试',
          icon: 'none',
          duration: 2000
        })
      }
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
    that.faddishFun();
    // 停止下拉动作  
    if (that.data.faddish || that.data.faddishDetail) {
      // 隐藏导航栏加载框  
      that.data.current = 1;
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    // 页数+1  
    let current = that.data.current;
    current = current + 1;
    var dataUrl = "/product/productList";
    var param = {
      page: {
        size: 10,
        current: current
      },
      productType: '1'
    };
    wxRequest(dataUrl, param).then(res => {
      var pages = res.pages; //服务器总页数
      console.log("爆款列表", res.records);
      if (pages < current) {
        console.log("暂时没有更多了")
        wx.showLoading({
          title: '暂时没有更多了',
        })
        setTimeout(function() {
          wx.hideLoading()
        }, 500)
      } else {
        console.log("玩命加载中")
        wx.showLoading({
          title: '玩命加载中',
        })
        if (res.code == "0000") {
          var moment_list = that.data.faddish;
          for (var i = 0; i < res.records.length; i++) {
            moment_list.push(res.records[i]);
          }
          console.log("push列表", moment_list)
          // 设置数据  
          that.setData({
            faddish: moment_list,
            current: current
          })
          // 隐藏加载框  
          setTimeout(function() {
            wx.hideLoading()
          }, 500)
        }
      }
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
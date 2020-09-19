// pages/multipleStordeCard/index.js
var wxRequest = require('../../utils/requestUrl.js');
var WxParse = require('../../wxParse/wxParse.js');
var that;
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    that = this;
    var productId = options.productId;
    // productId = 2451;
    console.log("productId", productId);
    if (productId) {
      that.setData({
        productId: productId
      });
      that.stordeCard();
    }
  },

  countInp: function (e) {
    let num = e.detail.value;
    var str = num;
    var len1 = str.substr(0, 1);
    var len2 = str.substr(1, 1);
    //如果第一位是0，第二位不是点，就用数字把点替换掉
    if (str.length > 1 && len1 == 0 && len2 != ".") {
      str = str.substr(1, 1);
    }
    //第一位不能是.
    if (len1 == ".") {
      str = "";
    }
    //限制只能输入一个小数点
    if (str.indexOf(".") != -1) {
      var str_ = str.substr(str.indexOf(".") + 1);
      if (str_.indexOf(".") != -1) {
        str = str.substr(0, str.indexOf(".") + str_.indexOf(".") + 1);
      }
    }
    //正则替换，保留数字和小数点
    str = (str.match(/^\d*(\.?\d{0,2})/g)[0]) || null
    // return str;
    console.log("输入金额", str);
    if(str>100000){
      str = ''
    }
    that.setData({
      num: str
    });
  },




  powerDrawer: function (e) {
    var multiple = that.data.multiple;
    var currentStatu = e.currentTarget.dataset.statu;
    var num = that.data.num;
    if (num) {
      var countNum = (num * multiple).toFixed(2);
      console.log('计算', countNum);
      that.util(currentStatu);
      that.setData({
        countNum: countNum,
      })
    } else {
      wx.showToast({
        title: '请输入消费金额',
        icon: 'none',
        duration: 2000
      })
    }
  },
  // 模态动画
  util: function (currentStatu) {
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
    animation.opacity(0).rotateX(-100).step();
    // 第4步：导出动画对象赋给数据对象储存
    this.setData({
      animationData: animation.export()
    })
    // 第5步：设置定时器到指定时候后，执行第二组动画
    setTimeout(function () {
      // 执行第二组动画
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
      this.setData({
        animationData: animation
      })
      //关闭
      if (currentStatu == "close") {
        that.setData({
          showModalStatus: false
        })
      }
    }.bind(this), 300)
    // 显示
    if (currentStatu == "open") {
      that.setData({
        showModalStatus: true
      })
    }
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

  },
  // 获取多倍卡信息
  stordeCard: function () {
    var productId = that.data.productId;
    var dataUrl = '/product/productDetail?productId=' + productId;
    var param = {};
    wxRequest(dataUrl, param)
      .then(res => {
        console.log("用户扫码商品展示", res);
        if (res.code == "0000") {
          var shonDetails = res;
          var bannerList = res.bannerList;
          var latitude = res.latitude;
          var longitude = res.longitude;
          var usageRule = res.usageRule;
          var multiple = res.multiple;
          wx.setNavigationBarTitle({
            title: res.merchantName
          })
          console.log(latitude, longitude)
          if (usageRule) {
            WxParse.wxParse('usageRule', 'html', usageRule, that, 5);
          }
          that.setData({
            shonDetails: shonDetails,
            bannerList: bannerList,
            latitude: latitude,
            longitude: longitude,
            multiple: multiple
          });
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 1000
          })
        }
      })
      .catch(function (res) {
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
    console.log('电话', mobile);
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
    var salePrice = that.data.countNum;
    var consumeAmount = that.data.num;
    var memberCardName = that.data.shonDetails.productName;
    var merchantName = that.data.shonDetails.merchantName;
    var merchantId = that.data.shonDetails.merchantId;
    var memberCardId = '';
    var productList = [];
    var orderType = 0;
    var accountId = '';
    let obj = {};
    obj.amountUnit = that.data.countNum;
    obj.count = 1;
    obj.productId = that.data.shonDetails.productId;
    productList.push(obj);
    productList = JSON.stringify(productList);
    console.log(productList);
    if (token) {
      if (salePrice) {
        wx.navigateTo({
          url: '/pages/payment/index?salePrice=' + salePrice + '&memberCardId=' + memberCardId + '&memberCardName=' + memberCardName + '&merchantName=' + merchantName + '&merchantId=' + merchantId + '&productList=' + productList + '&orderType=' + orderType + '&accountId=' + accountId + '&consumeAmount=' + consumeAmount
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
    that.stordeCard();
    // 停止下拉动作  
    if (that.data.shonDetails) {
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
  onShareAppMessage: function () {

  }
})
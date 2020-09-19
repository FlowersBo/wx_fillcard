// pages/user/bindMobile/newMobile/index.js
var app = getApp();
var wxRequest = require('../../../../utils/requestUrl.js');
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iscode: null, //用于存放验证码接口里获取到的code
    codename: '获取验证码',
    disabled: false,
    disabled1: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
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

  },
  bindMobile(e) {
    var mobile = e.detail.value;
    that.setData({
      mobile: mobile
    });
  },
  //获取验证码
  getVerificationCode() {
    var mobile = that.data.mobile;
    if (mobile == "") {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (!(/^1[3456789]\d{9}$/.test(mobile))) {
      wx.showToast({
        title: '手机号有误',
        icon: 'none',
        duration: 1000
      })
    } else {
      that.getCode();
      that.setData({
        disabled: true
      })
    }
  },
  getCode: function() {
    var telephone = that.data.mobile;
    if (telephone) {
      var dataUrl = '/communal/sms/validateSms';
      var param = {
        telephone: telephone
      };
      wxRequest(dataUrl, param).then(res => {
        console.log("验证码返回", res)
        if (res.code == "0000") {
          var num = 61;
          var timer = setInterval(function() {
            num--;
            if (num <= 0) {
              clearInterval(timer);
              that.setData({
                codename: '重新发送',
                disabled: false
              })
            } else {
              that.setData({
                codename: num + "s",
                timer: timer,
                disabled: true
              })
            }
          }, 1000)
        } else {
          wx.showToast({
            title: '网络错误',
            icon: 'none',
            duration: 1000
          })
        }
      })
    } else {
      wx.showToast({
        title: '请稍后重试',
        icon: 'none',
        duration: 1000
      })
    }
  },
  //验证码
  bindCode(e){
    console.log(e);
    if (e.detail.value.length>=4){
      that.setData({ disabled1: false });
    }else{
      that.setData({ disabled1: true });
    }
  },
  formSubmit(e) {
    console.log(e);
    var mobileCode = e.detail.value.mobileCode;
    var mobile = e.detail.value.mobile;
    if (mobile == "") {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (!(/^1[3456789]\d{9}$/.test(mobile))) {
      wx.showToast({
        title: '手机号有误',
        icon: 'none',
        duration: 1000
      })
    }else if (mobileCode == '') {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else {
      var dataUrl = '/account/bindTelephone';
      var param = {
        telephone: mobile,
        smsCode: mobileCode
      };
      wxRequest(dataUrl, param).then(res => {
        console.log("绑定返回信息", res);
        if (res.code == "0000") {
          wx.showToast({
            title: '绑定成功',
            icon: 'success',
            duration: 800
          })
          setTimeout(function () {
            clearInterval(that.data.timer);
            that.setData({
              codename: '获取验证码',
              disabled: false
            })
            wx.navigateBack({
              delta: 1
            })
          }, 900)
        } else {
          var msg = res.msg;
          wx.showToast({
            title: msg,
            icon: 'none',
            duration: 1000
          })
        }
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
    setTimeout(function () {
      wx.stopPullDownRefresh()
    }, 500)
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
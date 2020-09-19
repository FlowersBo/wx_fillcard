// pages/respirator/payments/address/index.js
var that;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: ['省', '市', '区'],
    regions: ''
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
  //省市区
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    var regions = e.detail.value[0] + e.detail.value[1] + e.detail.value[2];
    console.log(regions)
    this.setData({
      region: e.detail.value,
      regions: regions
    })
  },
  //提交
  formSubmit: function(e) {
    console.log(e);
    var regions = that.data.regions;
    var names = e.detail.value.names;
    var mobile = e.detail.value.mobile;
    var address = e.detail.value.address;
    var pages = getCurrentPages();
    // var currPage = pages[pages.length - 1]; //当前页面
    var prevPage = pages[pages.length - 2]; //上一级页面
    var mobile_reg = /^1[3|4|5|6|7|8|9]\d{9}$/;
    if (names == '') {
      wx.showToast({
        title: '请填写收货人',
        icon: 'none',
        duration: 2000
      })
      return false;
    } else if (mobile == '' || (!mobile_reg.test(mobile))) {
      wx.showToast({
        title: '手机号有误',
        icon: 'none',
        duration: 2000
      })
      return false;
    } else if (regions == '') {
      wx.showToast({
        title: '请填写地区信息',
        icon: 'none',
        duration: 2000
      })
      return false;
    } else if (address == '') {
      wx.showToast({
        title: '请填写详细地址',
        icon: 'none',
        duration: 2000
      })
      return false;
    } else {
      prevPage.setData({
        names: names,
        mobile: mobile,
        region: regions,
        address: address,
      })
      wx.navigateBack({
        delta: 1,
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
    // return {
    //   title: '首页',
    //   path: 'pages/index/index'
    // }
  }
})
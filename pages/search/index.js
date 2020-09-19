// pages/search/index.js
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {

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
  // 点击搜索
  bindconfirm: function(e) {
    console.log(e)
    var keyword = e.detail.value['search - input'] ? e.detail.value['search - input'] : e.detail.value
    console.log('e.detail.value', keyword);
    if (!keyword) {
      wx.showToast({
        title: '请输入关键字查找',
        icon: 'none',
        duration: 2000
      })
      return false;
    } else {
      console.log(keyword);
      wx.redirectTo({
        url: '/pages/faddishCardList/index?keyword=' + keyword
      })
    }
  },
  
  //商家查找
  findMerchantFun: function(e) {
    var keyword = e;
    console.log(keyword)
    that.setData({
      keyword: e.detail.value
    });
  },
  findFun: function () {
    var keyword = that.data.keyword;
    if (!keyword) {
      wx.showToast({
        title: '请输入关键字查找',
        icon: 'none',
        duration: 2000
      })
      return false;
    } else {
      console.log(keyword);
      wx.redirectTo({
        url: '/pages/faddishCardList/index?keyword=' + keyword
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

  }
})
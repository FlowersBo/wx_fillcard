// pages/respirator/orderform/index.js
var wxRequest = require('../../../utils/requestUrl.js');
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderformList:''
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
    wx.login({
      success: function(res) {
        console.log(res)
        if (res.code) {
          var dataUrl = "/auth/getOpenId";
          var param = { code:res.code};
          wxRequest(dataUrl, param)
          .then(res => {
            console.log('code返回',res)
            if (res.code == "0000") {
              var openid = res.openid;
              var dataUrl = "/sale/orderList";
              var param = { openid: openid};
              wxRequest(dataUrl, param)
                .then(res => {
                  console.log('订单列表',res)
                  if (res.code == "0000"){
                    var orderformList = res.data;
                    for (var i = 0; i < orderformList.length; i++){
                      if (orderformList[i].status=='1'){
                        orderformList[i].status ="已支付"
                      } else if (orderformList[i].status == '2'){
                        orderformList[i].status = "交易完成"
                      }
                    }
                    that.setData({ orderformList: orderformList})
                    console.log(that.data.orderformList)
                  }
                })
                .catch(res=>{
                  console.log('错误', res)
                })
            }
          });
        }
      }
    })
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
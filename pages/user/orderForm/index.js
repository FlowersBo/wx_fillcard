// pages/user/orderForm/index.js
var that;
var app = getApp();
var wxRequest = require('../../../utils/requestUrl.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isFang: false,
    orderList: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    console.log(options.writeOffStatus);
    var writeOffStatus = options.writeOffStatus;
    if (writeOffStatus !=''){
      wx.setNavigationBarTitle({
        title: '待使用'
      })
    }
    that.setData({
      writeOffStatus: writeOffStatus
    });
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
    that.orderFun();
  },
  //订单列表
  orderFun: function() {
    var writeOffStatus = that.data.writeOffStatus;
    var dataUrl = "/trade/order/orderList";
    var param = {
      page: {
        size: 10,
        current: 1
      },
      orderType: 2,
      writeOffStatus: writeOffStatus
    };
    wxRequest(dataUrl, param).then(res => {
      console.log("订单列表", res);
      if (res.code == "0000") {
        var orderList = res.records;
        that.writeOffStatusFun(orderList);
        that.setData({
          orderList: orderList,
          current: 1
        });
        if (res.records.length > 0) {
          that.setData({
            isFang: true
          });
        } else {
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
    });
  },
  writeOffStatusFun: function (orderList) {
    for (var i = 0; i < orderList.length; i++) {
      if (orderList[i].writeOffStatus == 0) {
        orderList[i].writeOffStatus = '未核销'
      } else if (orderList[i].writeOffStatus == 1) {
        orderList[i].writeOffStatus = '已核销'
      } else if (orderList[i].writeOffStatus == 2) {
        orderList[i].writeOffStatus = '已核销'
      } else if (orderList[i].writeOffStatus == 3) {
        orderList[i].writeOffStatus = '已过期'
      }
    }
  },

  // 跳转订单详情
  gotoOrderDetails:function(e){
    var orderId = e.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: 'orderDetails/index?orderId=' + orderId,
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
    console.log("下拉刷新")
    // 显示顶部刷新图标  
    wx.showNavigationBarLoading();
    that.orderFun();
    // 停止下拉动作  
    if (that.data.orderList) {
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
    var writeOffStatus = that.data.writeOffStatus;
    current = current + 1;
    var dataUrl = "/trade/order/orderList";
    var param = {
      page: {
        size: 10,
        current: current
      },
      writeOffStatus: writeOffStatus,
      orderType: 2,
    };
    wxRequest(dataUrl, param).then(res => {
      var pages = res.pages; //服务器总页数
      console.log("订单列表", res.records);
      if (pages < current) {
        wx.showLoading({
          title: '暂时没有更多了',
        })
        setTimeout(function() {
          wx.hideLoading()
        }, 500)
      } else {
        wx.showLoading({
          title: '玩命加载中',
        })
        if (res.code == "0000") {
          var moment_list = that.data.orderList;
          that.writeOffStatusFun(res.records);
          for (var i = 0; i < res.records.length; i++) {
            moment_list.push(res.records[i]);
          }
          console.log("push列表", moment_list)
          // 设置数据  
          that.setData({
            orderList: moment_list,
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
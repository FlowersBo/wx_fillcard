// pages/user/meVipcard/gotoUseRecord/index.js
var that;
var app = getApp();
var wxRequest = require('../../../../../utils/requestUrl.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    verificationList: [],
    current: 1,
    isFang: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    var memberCardId = options.membercardId;
    var cardType = options.cardType;
    that.setData({
      memberCardId: memberCardId,
      cardType: cardType
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
    that.verification();
  },
  //核销列表
  verification() {
    var memberCardId = that.data.memberCardId;
    console.log(memberCardId);
    var dataUrl = "/card/writeOffRecordList";
    var param = {
      page: {
        size: 20,
        current: 1
      },
      memberCardId: memberCardId
    };
    wxRequest(dataUrl, param).then(res => {
      console.log("核销列表", res.records);
      if (res.code=="0000") {
        var verificationList = res.records;
        that.setData({
          verificationList: verificationList,
          current: 1
        });
        if (verificationList.length > 0) {
          that.setData({
            isFang: true
          });
        } else {
          that.setData({
            isFang: false
          });
        }
      }
    });
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
    that.verification();
    // 停止下拉动作  
    wx.stopPullDownRefresh();
    if (that.data.verificationList) {
      // 隐藏导航栏加载框  
      that.data.current = 1;
      wx.hideNavigationBarLoading();
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let current = that.data.current;
    current = current + 1;
    var dataUrl = "/card/writeOffRecordList";
    var param = {
      page: {
        size: 10,
        current: current
      },
    };
    console.log("页数", param)
    wxRequest(dataUrl, param).then(res => {
      var pages = res.pages; //服务器总页数
      console.log("核销列表", res.records);
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
          var moment_list = that.data.verificationList;
          for (var i = 0; i < res.records.length; i++) {
            moment_list.push(res.records[i]);
          }
          console.log("push列表", moment_list)
          // 设置数据  
          that.setData({
            verificationList: moment_list,
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
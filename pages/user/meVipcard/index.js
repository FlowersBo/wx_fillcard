// pages/user/meVipcard/index.js
var that;
var app = getApp();
var wxRequest = require('../../../utils/requestUrl.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardList: [],
    isFang: false,
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
    that.myCardList();
  },
  //我的会员卡列表
  myCardList() {
    var dataUrl = "/card/memberCardList";
    var statusIn = '0,6';
    var param = {
      page: {
        size: 10,
        current: 1
      },
      statusIn: statusIn,
      source: 0
    };
    wxRequest(dataUrl, param).then(res => {
      console.log("卡列表", res);
      if(res.code=="0000"){
        var cardList = res.records;
        that.setData({
          cardList: cardList,
          current: 1
        });
        if (cardList.length > 0) {
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
  //跳转卡详情
  gotocardConsume: function(e) {
    console.log(e);
    var memberCardId = e.currentTarget.dataset.membercardid;
    wx.navigateTo({
      url: 'cardConsume/index?memberCardId=' + memberCardId,
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
    that.myCardList();
    // 停止下拉动作  
    wx.stopPullDownRefresh();
    if (that.data.cardList) {
      // 隐藏导航栏加载框  
      that.data.current = 1;
      wx.hideNavigationBarLoading();
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    // 页数+1  
    let current = that.data.current;
    current = current + 1;
    var dataUrl = "/card/memberCardList";
    var statusIn = '0,6';
    var param = {
      page: {
        size: 10,
        current: current
      },
      statusIn: statusIn,
      source: 0
    };
    console.log("页数", param)
    wxRequest(dataUrl, param).then(res => {
      console.log("转卡列表", res.records);
      if (res.records == false) {
        console.log("暂时没有更多了")
        wx.showLoading({
          title: '暂时没有更多了',
        })
      } else {
        console.log("玩命加载中")
        wx.showLoading({
          title: '玩命加载中',
        })
      }
      if (res.code == "0000" && res.records != []) {
        var moment_list = that.data.cardList;
        for (var i = 0; i < res.records.length; i++) {
          moment_list.push(res.records[i]);
        }
        console.log("push列表", moment_list)
        // 设置数据  
        that.setData({
          cardList: moment_list,
          current: current
        })
        // 隐藏加载框  
        setTimeout(function() {
          wx.hideLoading()
        }, 500)
      }
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
// pages/generalize/index.js
var wxRequest = require('../../utils/requestUrl.js');
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 1, //页数
    records: '',
    isFang: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
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
    that.cardList();
  },
  //卡列表
  cardList: function () {
    var dataUrl = "/product/productList";
    var param = {
      spreadStatus:'0',
      page: {
        size: 10,
        current: 1
      },
    };
    wxRequest(dataUrl, param).then(res => {
      console.log("返回卡列表", res);
      console.log("卡列表", res.records);
      if (res.code == "0000") {
        var records = res.records;
        if (records.length > 0) {
          that.setData({
            isFang: true
          });
        } else {
          that.setData({
            isFang: false
          });
        }
        that.setData({
          records: records,
          current: 1
        });
      }
    });
  },

  //点击跳转卡详情
  generalizeDetails:function(e){
    var productId = e.currentTarget.dataset.productid;
    console.log('当前跳转productId',productId)
    wx.navigateTo({
      url: 'generalizeDetails/index?productId=' + productId,
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
    // 停止下拉动作  
    that.cardList();
    if (that.data.records) {
      // 隐藏导航栏加载框  
      that.data.current = 1;
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 页数+1  
    let current = that.data.current;
    current = current + 1;
    var dataUrl = "/product/productList";
    var param = {
      spreadStatus: '0',
      page: {
        size: 10,
        current: current
      },
    };
    console.log("页数", param)
    wxRequest(dataUrl, param).then(res => {
      var pages = res.pages; //服务器总页数
      console.log("卡列表", res.records);
      if (pages < current) {
        console.log("暂时没有更多了")
        wx.showLoading({
          title: '暂时没有更多了',
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 500)
      } else {
        console.log("玩命加载中")
        wx.showLoading({
          title: '玩命加载中',
        })
        if (res.code == "0000") {
          var moment_list = that.data.records;
          for (var i = 0; i < res.records.length; i++) {
            moment_list.push(res.records[i]);
          }
          console.log("push列表", moment_list)
          // 设置数据  
          that.setData({
            records: moment_list,
            current: current
          })
          // 隐藏加载框  
          setTimeout(function () {
            wx.hideLoading()
          }, 500)
        }
      }
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
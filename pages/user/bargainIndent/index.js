var app = getApp();
var that;
var wxRequest = require('../../../utils/requestUrl.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    current: 1 ,
    isFang: true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    var currentTab = options.currentTab;
    if (currentTab) {
      that.setData({
        currentTab: currentTab
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
    var currentTab = that.data.currentTab;
    that.barginIndent(currentTab);
  },
  //点击切换
  clickTab: function (e) {
    var currentTab = e.target.dataset.current;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.barginIndent(currentTab);
      that.setData({
        currentTab: e.target.dataset.current,
      })
    }
  },

  barginIndent: function (currentTab) {
    console.log('当前tab', currentTab);
    var status = currentTab;
    var dataUrl = "/trade/cutPrice/cutOrderList";
    var param = {
      page: {
        size: 10,
        current: 1
      },
      status: status
    };
    wxRequest(dataUrl, param)
      .then(function (res) {
        //业务逻辑
        console.log('砍单', res);
        if (res.code == '0000') {
          var bargin = res.records;
          if (res.records.length > 0) {
            that.setData({
              isFang: true
            });
          } else {
            that.setData({
              isFang: false
            });
          }
          that.setData({
            bargin: bargin,
          });
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000
          })
        }
      })
      .catch(function (res) {
        console.log('请求失败', res);
      })
  },



  // 跳转订单详情
  gotobarginDetail: function (e) {
    console.log(e);
    var cutPriceId = e.currentTarget.dataset.cutpriceid;
    var currentTab = that.data.currentTab;
    console.log(cutPriceId, currentTab);
    wx.navigateTo({
      url: 'barginDetail/index?cutPriceId=' + cutPriceId + '&currentTab=' + currentTab,
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
    var currentTab = that.data.currentTab;
    console.log("下拉刷新")
    // 显示顶部刷新图标  
    wx.showNavigationBarLoading();
    that.barginIndent(currentTab);
    // 停止下拉动作  
    if (that.data.bargin) {
      // 隐藏导航栏加载框  
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
      that.data.current = 1;
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 页数+1  
    var currentTab = that.data.currentTab;
    let current = that.data.current;
    console
    current = current + 1;
    console.log("页数", current);
    console.log('当前tab', currentTab);
    var status = currentTab;
    var dataUrl = "/trade/cutPrice/cutOrderList";
    var param = {
      page: {
        size: 10,
        current: current
      },
      status: status
    };
    wxRequest(dataUrl, param).then(res => {
      var pages = res.pages;
      console.log("服务器总页数", pages)
      console.log("pus卡列表", res.records);
      if (pages < current) {
        console.log("暂时没有更多了")
        wx.showLoading({
          title: '暂时没有更多了',
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 500)
      } else {
        wx.showLoading({
          title: '玩命加载中',
        })
        if (res.code == "0000") {
          var moment_list = that.data.bargin;
          for (var i = 0; i < res.records.length; i++) {
            moment_list.push(res.records[i]);
          }
          console.log("push列表", moment_list)
          // 设置数据  
          that.setData({
            bargin: moment_list,
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

  },
})
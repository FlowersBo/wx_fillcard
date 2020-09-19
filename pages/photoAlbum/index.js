// pages/photoAlbum/index.js
const app = getApp();
let that;
var wxRequest = require('../../utils/requestUrl.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    screenWidth: app.data.screenWidth, //屏幕宽度
    current: 1,
    isFang: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    var merchantId = options.merchantId;
    that.setData({
      merchantId: merchantId
    })
    that.photoAlbumFn();
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
  photoAlbumFn: function () {
    var merchantId = that.data.merchantId;
    console.log('店铺ID', merchantId);
    var dataUrl = "/merchant/photoList";
    var param = {
      merchantId: merchantId,
      page: {
        size: 21,
        current: 1
      },
    };
    wxRequest(dataUrl, param)
      .then(function (res) {
        //业务逻辑
        console.log('商家相册', res);
        if (res.code == '0000') {
          var uploadPics = res.records;
          that.setData({
            uploadPics: uploadPics,
          });
          if (uploadPics.length > 0) {
            that.setData({
              isFang: true
            });
          }else{
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
      })
      .catch(function (res) {
        console.log('请求失败', res);
      })
  },
  // 图片预览
  previewImage: function (e) {
    console.log(e)
    var uploadPics = that.data.uploadPics;
    var images =[];
    for(var i=0;i<uploadPics.length;i++){
      images.push(uploadPics[i].photoUrl);
    }
    var current = e.currentTarget.dataset.src
    wx.previewImage({
      current: current,
      urls: images
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
    that.photoAlbumFn();
    // 停止下拉动作  
    wx.stopPullDownRefresh();
    if (that.data.uploadPics) {
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
    var merchantId = that.data.merchantId;
    var dataUrl = "/merchant/photoList";
    var param = {
      page: {
        size: 21,
        current: current
      },
      merchantId: merchantId,
    };
    wxRequest(dataUrl, param).then(res => {
      var pages = res.pages;
      console.log("服务器总页数", pages);
      console.log("卡列表", res.records);
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
          var moment_list = that.data.uploadPics;
          for (var i = 0; i < res.records.length; i++) {
            moment_list.push(res.records[i]);
          }
          console.log("push列表", moment_list)
          // 设置数据  
          that.setData({
            uploadPics: moment_list,
            current: current
          })
          // 隐藏加载框  
          setTimeout(function() {
            wx.hideLoading()
          }, 500)
        } else {
          wx.showToast({
            title: '加载失败',
            icon: 'none',
            duration: 2000
          })
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
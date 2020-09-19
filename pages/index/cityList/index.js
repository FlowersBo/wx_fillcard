// pages/index/cityList/index.js
var wxRequest = require('../../../utils/requestUrl.js');
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
    that.cityFun();
  },
  cityFun: function() {
    var dataUrl = '/communal/config/openCityList';
    var param = {};
    wxRequest(dataUrl, param)
      .then(function(res) {
        //业务逻辑
        console.log("城市返回", res);
        //调用下一个请求
        if (res.code == "0000") {
          that.setData({
            cityList: res.data
          })
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 1000
          })
        }
      })
      .catch(function(res) {
        console.log(res);
        wx.showToast({
          title: res.error,
          icon: 'none',
          duration: 1000
        })
        return false
      })
  },
  //城市选择
  selectCity: function(e) {
    console.log(e)
    var city = e.currentTarget.dataset.citycode;
    var cityName = e.currentTarget.dataset.cityname;
    var locationCity = wx.getStorageSync('locationCity');
    console.log('定位城市', locationCity)
    if (locationCity) {
      if (locationCity != cityName) {
        wx.showModal({
          title: '提示',
          content: '您选择的城市与当前您所在的城市不一致，是否选择城市' + cityName,
          success(res) {
            if (res.confirm) {
              console.log(city);
              wx.setStorageSync('city', city);
              wx.setStorageSync('cityName', cityName);
              wx.navigateBack({
                delta: 1
              })

            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }else{
        wx.showModal({
          title: '提示',
          content: '是否选择城市' + cityName,
          success(res) {
            if (res.confirm) {
              console.log(city);
              wx.setStorageSync('city', city);
              wx.setStorageSync('cityName', cityName);
              wx.navigateBack({
                delta: 1
              })

            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '是否选择城市' + cityName,
        success(res) {
          if (res.confirm) {
            console.log(city);
            wx.setStorageSync('city', city);
            wx.setStorageSync('cityName', cityName);
            wx.navigateBack({
              delta: 1
            })

          } else if (res.cancel) {
            console.log('用户点击取消')
          }
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
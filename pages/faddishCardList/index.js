// pages/faddishCardList/index.js
var that;
const app = getApp();
var wxRequest = require('../../utils/requestUrl.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    screenWidth: app.data.screenWidth, //屏幕宽度
    screenHeight: app.data.screenHeight,
    windowWidth: app.data.windowWidth,
    faddish: '', //爆款
    categoryId: '',
    isFang: true,
    current: 1,
    vipCurrent: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    var categoryId = options.categoryId;
    var keyword = options.keyword;
    var navName = options.navName;
    console.log('分类id', categoryId, keyword);
    that.setData({
      categoryId: categoryId,
      keyword: keyword
    });
    if (navName) {
      wx.setNavigationBarTitle({
        title: navName
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
    that.faddishFun();
  },
  //爆款列表
  faddishFun: function () {
    that.firstCardFun();
    var dataUrl = "/product/productList";
    var categoryId = that.data.categoryId;
    var keyword = that.data.keyword;
    var param = {
      page: {
        size: 10,
        current: 1
      },
      productType: '1',
      categoryId: categoryId,
      keyword: keyword
    };
    wxRequest(dataUrl, param).then(res => {
      console.log("爆款卡列表", res);
      if (res.code == "0000") {
        var faddish = res.records;
        that.setData({
          faddish: faddish,
          current: 1
        });
        that.cardList();
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }
    });
  },

  //会员卡列表 
  firstCardFun: function () {
    var categoryId = that.data.categoryId;
    var keyword = that.data.keyword;
    console.log('分类ID', categoryId)
    var dataUrl = "/product/productListMerOne";
    var param = {
      page: {
        size: 10,
        current: 1
      },
      categoryId: categoryId,
      keyword: keyword
      // status: 0
    };
    wxRequest(dataUrl, param)
      .then(function (res) {
        //业务逻辑
        console.log(res);
        if (res.code == '0000') {
          console.log("商家的一手卡", res);
          var firstCard = res.records;
          that.setData({
            firstCard: firstCard,
            vipCurrent: 1
          });
          that.cardList();
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000
          })
        }
      })
      .catch(function (res) {
        console.log(res)
      })
  },

  // card列表
  cardList:function(){
    if (that.data.faddish.length > 0 || that.data.firstCard.length > 0) {
      that.setData({
        isFang: true
      });
    } else {
      that.setData({
        isFang: false
      });
    }
  },

  //一手卡跳转商铺详情
  shonCardDetails(e) {
    var merchantId = e.currentTarget.dataset.merchantid;
    var merchantName = e.currentTarget.dataset.merchantname;
    console.log("跳转Id", merchantId);
    wx.navigateTo({
      url: '/pages/shopPurchase/index?merchantId=' + merchantId + '&merchantName=' + merchantName,
    })
  },

  //爆款详情跳转
  faddishDetailFun: function (e) {
    console.log(e);
    var productId = e.currentTarget.dataset.productid;
    wx.navigateTo({
      url: '/pages/faddishDetail/index?productId=' + productId
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
    that.faddishFun();
    that.firstCardFun();
    // 停止下拉动作  
    if (that.data.faddish || that.data.firstCard) {
      // 隐藏导航栏加载框  
      that.data.current = 1;
      that.data.vipCurrent = 1;
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  // "onReachBottomDistance":800
  onReachBottom: function () {
    // 页数+1  
    // 不满一页自动加载下一页
    // var screenHeight = that.data.screenHeight;
    // wx.createSelectorQuery().select('.cards').boundingClientRect(res => {
    //   console.log(res)
    //   console.log(wx.getSystemInfoSync().windowHeight)
    //   if (res.height < wx.getSystemInfoSync().windowHeight) {

    //   }
    // }).exec()
    let current = that.data.current;
    var categoryId = that.data.categoryId;
    var keyword = that.data.keyword;
    current = current + 1;
    var dataUrl = "/product/productList";
    var param = {
      page: {
        size: 10,
        current: current
      },
      productType: '1',
      categoryId: categoryId,
      keyword: keyword
    };
    wxRequest(dataUrl, param).then(res => {
      var pages = res.pages; //服务器总页数
      console.log("爆款列表", res.records);
      if (pages < current) {
        let vipCurrent = that.data.vipCurrent;
        var categoryId = that.data.categoryId;
        var keyword = that.data.keyword;
        vipCurrent = vipCurrent + 1;
        var dataUrl = "/product/productListMerOne";
        var param = {
          page: {
            size: 10,
            current: vipCurrent
          },
          productType: '1',
          categoryId: categoryId,
          keyword: keyword
        };
        wxRequest(dataUrl, param).then(res => {
          var pages = res.pages; //服务器总页数
          console.log("商家一手卡", res.records);
          if (pages < vipCurrent) {
            wx.showLoading({
              title: '暂时没有更多了',
            })
            setTimeout(function () {
              wx.hideLoading()
            }, 500)
          } else {
            console.log("玩命加载中")
            // wx.showLoading({
            //   title: '玩命加载中',
            // })
            if (res.code == "0000") {
              var firstCard_list = that.data.firstCard;
              for (var i = 0; i < res.records.length; i++) {
                firstCard_list = firstCard_list.concat(res.records[i]);
              }
              console.log("push一手卡列表", firstCard_list)
              // 设置数据  
              that.setData({
                firstCard: firstCard_list,
                vipCurrent: vipCurrent
              })
              // 隐藏加载框  
              setTimeout(function () {
                wx.hideLoading()
              }, 500)
            }
          }
        });




      } else {
        // wx.showLoading({
        //   title: '玩命加载中',
        // })
        if (res.code == "0000") {
          var moment_list = that.data.faddish;
          for (var i = 0; i < res.records.length; i++) {
            moment_list = moment_list.concat(res.records[i]);
          }
          console.log("push列表", moment_list)
          // 设置数据  
          that.setData({
            faddish: moment_list,
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
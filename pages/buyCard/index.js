var that;
var wxRequest = require('../../utils/requestUrl.js');
const app = getApp();
Page({
  data: {
    loading: true,
    hideCategory: true,
    hideGoods: true,
    hideFooter: true,
    hideBanner: true,


    recommendStatus: 0, //预设当前项的值
    recordsList: [],
    winHeight: "", //窗口高度
    scrollLeft: 0, //tab标题的滚动条位置
    currentNumber: 1, //页数
    loadingData: false, //数据是否正在加载中，避免用户瞬间多次下滑到底部，发生多次数据加载
  },


  onLoad: function () {
    that = this;
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR;
        // console.log(rpxR) //固定比例
        // console.log(clientHeight) //
        console.log(calc) //等比例高
        that.setData({
          winHeight: calc
        });
      }
    });
    that.categoryFun();
    var cityCode = wx.getStorageSync('city');
    that.setData({
      cityCode: cityCode
    });
  },
  //展示
  categoryFun: function () {
    var dataUrl = "/merchant/categoryList";
    var param = {};
    wxRequest(dataUrl, param)
      .then(function (res) {
        //业务逻辑
        console.log("淘卡分类", res.data);
        var classifyList = res.data;
        that.setData({
          classifyList: classifyList,
          categoryId: 0
        });
        //调用下一个请求
        var recommendStatus = that.data.recommendStatus;
        var dataUrl = "/merchant/merchantList";
        var param = {
          page: {
            size: 10,
            current: 1
          },
          recommendStatus: recommendStatus
        }
        return wxRequest(dataUrl, param);
      })
      .then(function (res) {
        //业务逻辑
        console.log(res)
        console.log("分类列表", res.records);
        var recordsList = res.records;
        if (res.code == "0000") {
          for (var i = 0; i < recordsList.length; i++) {
            recordsList[i].star = parseInt(recordsList[i].star)
            // console.log(recordsList[i].star)
          }
          that.setData({
            recordsList: recordsList,
            currentNumber: 1,
            loading: false
          })
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000
          })
        }
      })
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
    var cityCode1 = wx.getStorageSync('city');
    var cityCode = that.data.cityCode;
    console.log(cityCode1, cityCode)
    if (cityCode != cityCode1) {
      that.setData({
        cityCode: cityCode1
      });
      that.categoryFun();
    }
  },
  findMerchantFun: function (e) {
    that.setData({
      merchant: e.detail.value
    });
  },
  //商家查找
  findFun: function () {
    var merchant = that.data.merchant;
    // if (!merchant) {
    //   wx.showToast({
    //     title: '请输入商家名称',
    //     icon: 'none',
    //     duration: 2000
    //   })
    //   return false;
    // } else {
    console.log(merchant);
    var dataUrl = "/merchant/merchantList";
    var categoryId = that.data.categoryId //当前tab项
    console.log("当前tab", categoryId);
    var recommendStatus = '';
    if (categoryId == '0') {
      recommendStatus = 0;
    }
    var param = {
      page: {
        size: 10,
        current: 1
      },
      keyword: merchant,
      categoryId: categoryId,
      recommendStatus: recommendStatus
    };
    wxRequest(dataUrl, param)
      .then(function (res) {
        //业务逻辑
        console.log(res)
        console.log("查找返回", res);
        if (res.code == "0000") {
          var recordsList = res.records;
          for (var i = 0; i < recordsList.length; i++) {
            recordsList[i].star = parseInt(recordsList[i].star)
            console.log(recordsList[i].star)
          }
          that.setData({
            recordsList: recordsList,
            currentNumber: 1, //重置页数
            categoryId: categoryId //当前tab项
          })
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000
          })
        }
      })
    // }
  },
  // 划动切换标签样式
  // switchTab: function (e) {
  //   console.log(e.detail)
  //   //e.detail.current现在是在哪一个选项卡里面 
  //   this.checkCor();
  // },


  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    var classifyList = that.data.classifyList;
    console.log(classifyList)
    console.log(e)
    var categoryId = e.target.dataset.current;
    console.log("当前tab项", categoryId);
    var dataUrl = "/merchant/merchantList";
    if (categoryId != 0) {
      for (var i = 0; i < classifyList.length; i++) {
        if (classifyList[i].categoryId == categoryId) {
          classifyList[i].active = 'active';
          classifyList[i].activeText = 'activeText';
          that.setData({
            classifyList: classifyList,
            loadingData: false, //重置加载中
            currentNumber: 1, //重置页数
            categoryId: categoryId //当前tab项
          })
        } else {
          classifyList[i].active = '';
          classifyList[i].activeText = '';
          that.setData({
            classifyList: classifyList,
            loadingData: false,
            currentNumber: 1,
            categoryId: categoryId //当前tab项
          })
        }
      }
      // if (that.data.recommendStatus == categoryId) {
      //   return false;
      // } else {
      //   that.setData({
      //     categoryId: categoryId
      //   })
      // }
      var param = {
        page: {
          size: 10,
          current: 1
        },
        categoryId: categoryId
      }
      wxRequest(dataUrl, param)
        .then(function (res) {
          //业务逻辑
          console.log(res);
          console.log("不是推荐分类列表", res.records);
          var recordsList = res.records;
          for (var i = 0; i < recordsList.length; i++) {
            recordsList[i].star = parseInt(recordsList[i].star)
            console.log(recordsList[i].star)
          }
          that.setData({
            recordsList: recordsList
          })
        })
    } else {
      for (var i = 0; i < classifyList.length; i++) {
        classifyList[i].active = '';
        classifyList[i].activeText = '';
        that.setData({
          classifyList: classifyList,
          loadingData: false, //重置加载中
          currentNumber: 1, //重置页数
          categoryId: categoryId //当前tab项
        })
      }
      var param = {
        page: {
          size: 10,
          current: 1
        },
        recommendStatus: 0,
      }
      wxRequest(dataUrl, param)
        .then(function (res) {
          //业务逻辑
          var recordsList = res.records;
          for (var i = 0; i < recordsList.length; i++) {
            recordsList[i].star = parseInt(recordsList[i].star)
            console.log(recordsList[i].star)
          }
          console.log("推荐分类列表", recordsList)
          that.setData({
            recordsList: recordsList,
            categoryId: categoryId //当前tab项
          })
        })
    }
  },

  // stopTouchMove() {
  //   return false
  // },

  //判断当前滚动超过一屏时，设置tab标题滚动条。
  // checkCor: function() {
  //   if (that.data.recommendStatus > 3) {
  //     that.setData({
  //       scrollLeft: 350
  //     })
  //   } else {
  //     that.setData({
  //       scrollLeft: 0
  //     })
  //   }
  // },
  //上拉加载
  loadData: function (tail, callback) {
    // 页数+1  
    var categoryId = that.data.categoryId;
    let current = that.data.currentNumber;
    console.log("当前页数", current);
    current = current + 1;
    var dataUrl = "/merchant/merchantList";
    if (categoryId == 0) {
      var param = {
        page: {
          size: 10,
          current: current
        },
        recommendStatus: 0,
      };
    } else {
      var param = {
        page: {
          size: 10,
          current: current
        },
        categoryId: categoryId
      };
    }
    wxRequest(dataUrl, param).then(res => {
      console.log("店铺列表", res.records);
      console.log("返回页数", res.pages);
      console.log(res)
      var requestCurrent = res.pages;
      if (requestCurrent < current) {
        wx.showLoading({
          title: '暂时没有更多了',
        })
        // 隐藏加载框  
        setTimeout(function () {
          wx.hideLoading()
        }, 500)
      } else {
        wx.showLoading({
          title: '玩命加载中',
        })
        if (res.code == "0000") {
          var moment_list = that.data.recordsList;
          for (var i = 0; i < res.records.length; i++) {
            res.records[i].star = parseInt(res.records[i].star)
            moment_list.push(res.records[i]);
          }

          console.log("push列表", moment_list)
          // 设置数据  
          that.setData({
            recordsList: moment_list,
            currentNumber: current,
            loadingData: false
          })
          // 隐藏加载框  
          setTimeout(function () {
            wx.hideLoading()
          }, 500)
        }
      }
    });
  },
  /**   * 上滑加载更多   */
  scrollToLower: function (e) {
    console.info('scrollToLower', e);
    var loadingData = that.data.loadingData;
    if (loadingData) {
      console.log("loadingData出去")
      return;
    }
    that.setData({
      loadingData: true
    });
    wx.showLoading({
      title: '数据加载中...',
    });
    that.loadData(true);
    // wx.hideLoading();
    console.info('上拉数据加载完成.');
  },

  //下拉刷新
  scrollToUpper: function (e) {

  },
  //跳转页面
  shopPurchase(e) {
    //数据的获取、获取点击
    var merchantId = e.currentTarget.dataset.merchantid;
    var merchantName = e.currentTarget.dataset.merchantname;
    console.log("跳转Id", merchantId);
    wx.navigateTo({
      url: '/pages/shopPurchase/index?merchantId=' + merchantId + '&merchantName=' + merchantName,
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
    var categoryId = that.data.categoryId //当前tab项
    console.log("当前tab", categoryId)
    var dataUrl = "/merchant/categoryList";
    var param = {};
    wx.stopPullDownRefresh();
    wxRequest(dataUrl, param)
      .then(function (res) {
        //业务逻辑
        console.log("淘卡分类", res);
        if (res.code == '0000') {
          var classifyList = res.data;
          for (var i = 0; i < classifyList.length; i++) {
            if (classifyList[i].categoryId == categoryId) {
              classifyList[i].active = 'active';
              classifyList[i].activeText = 'activeText';
              that.setData({
                classifyList: classifyList,
                loadingData: false, //重置加载中
              })
            } else {
              classifyList[i].active = '';
              classifyList[i].activeText = '';
              that.setData({
                classifyList: classifyList,
                loadingData: false,
              })
            }
          }
          var recommendStatus = '';
          if (categoryId == '0') {
            recommendStatus = 0;
          }
          //调用下一个请求
          var dataUrl = "/merchant/merchantList"
          var param = {
            page: {
              size: 10,
              current: 1
            },
            categoryId: categoryId,
            recommendStatus: recommendStatus
          }
          return wxRequest(dataUrl, param)
        }
      })
      .then(function (res) {
        console.log("刷新后的列表", res)
        // 停止下拉动作  
        if (res.code == '0000') {
          //业务逻辑
          var recordsList = res.records;
          for (var i = 0; i < recordsList.length; i++) {
            recordsList[i].star = parseInt(recordsList[i].star)
            console.log(recordsList[i].star)
          }
          that.setData({
            recordsList: recordsList,
            loadingData: false, //重置加载中
            currentNumber: 1, //重置页数
            categoryId: categoryId //当前tab项
          })
          // 隐藏导航栏加载框  
          wx.hideNavigationBarLoading();
        }
      })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
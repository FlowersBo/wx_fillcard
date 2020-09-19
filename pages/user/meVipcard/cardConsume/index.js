// pages/user/meVipcard/cardConsume/index.js
var that;
var app = getApp();
var WxParse = require('../../../../wxParse/wxParse.js');
var wxRequest = require('../../../../utils/requestUrl.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardDetails: '',
    showModalStatus: false,
    refundText: "退卡"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    var memberCardId = options.memberCardId;
    console.log(memberCardId);
    that.setData({
      memberCardId: memberCardId
    });
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
    that.sellCardDetails();
  },

  //会员卡详请
  sellCardDetails(e) {
    var memberCardId = that.data.memberCardId;
    var dataUrl = "/card/memberCardDetail?memberCardId=" + memberCardId;
    var param = {

    };
    wxRequest(dataUrl, param).then(res => {
      console.log("会员卡详情", res);
      if (res.code == "0000") {
        var cardDetails = res;
        var isRefund = res.isRefund;
        var cardType = res.cardType;
        var usageRule = res.usageRule;
        var status = res.status;
        if (usageRule) {
          WxParse.wxParse('usageRule', 'html', usageRule, that, 5);
        }
        if (status === '6') {
          that.setData({
            refundText: "取消退卡"
          })
        } else if (isRefund === '0' && status === '0') {
          that.setData({
            refundText: "退卡"
          })
        }
        that.setData({
          cardDetails: cardDetails,
          cardType: cardType,
          isRefund: isRefund,
          status: status
        });
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }
    });
  },

  //跳转使用详情
  gotoUseRecord: function (e) {
    console.log(e);
    var membercardId = e.currentTarget.dataset.membercardid;
    var cardType = that.data.cardType;
    wx.navigateTo({
      url: 'useRecord/index?membercardId=' + membercardId + '&cardType=' + cardType,
    })
  },

  //退卡/取消退卡
  refundClick: function (e) {
    let currentStatu = e.currentTarget.dataset.statu;
    let status = e.currentTarget.dataset.status;
    var isRefund = that.data.isRefund;
    console.log(isRefund, status);
    console.log(isRefund === '0', status === '0');
    if (isRefund === '0' && status === '0') {
      that.util(currentStatu);
    } else if (status === '6') {
      wx.showModal({
        title: '取消退卡',
        content: '确认取消退卡吗？',
        success(res) {
          if (res.confirm) {
            var memberCardId = that.data.memberCardId;
            var dataUrl = "/card/refundCancel";
            var param = {
              memberCardId: memberCardId
            };
            wxRequest(dataUrl, param).then(res => {
              console.log("取消退卡", res);
              if (res.code == "0000") {
                wx.showToast({
                  title: '取消退卡成功',
                  icon: 'success',
                  duration: 2000,
                  mask: true
                })
                setTimeout(function(){
                  that.sellCardDetails();
                },2000)
              } else {
                wx.showToast({
                  title: res.msg,
                  icon: 'none',
                  duration: 2000
                })
              }
            });
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      wx.showToast({
        title: '此卡已过期或退卡金额不足1元，无法退卡',
        icon: 'none',
        duration: 2000
      })
    }
  },
  // 确认退卡
  submitFun: function (e) {
    var refundAmount = that.data.refundAmount;
    if (refundAmount === 0) {
      that.setData({
        showModalStatus: false
      })
      wx.showToast({
        title: '此卡已过期或退卡金额不足1元，无法退卡',
        icon: 'none',
        duration: 2000
      });
      return false;
    } else {
      var memberCardId = that.data.memberCardId;
      var dataUrl = "/card/refundApply";
      var param = {
        memberCardId: memberCardId
      };
      wxRequest(dataUrl, param).then(res => {
        console.log("确认退卡", res);
        if (res.code == "0000") {
          that.setData({
            showModalStatus: false
          })
          var applyDesc = res.data.applyDesc;
          wx.showToast({
            title: applyDesc,
            icon: 'none',
            duration: 2000
          })
          that.sellCardDetails();
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000
          })
        }
      });
    }
  },

  // 取消按钮
  cancelClick: function (e) {
    let currentStatu = e.currentTarget.dataset.statu;
    if (currentStatu == "close") {
      this.setData({
        showModalStatus: false
      });
    }
  },
  // 模态动画
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例
    var animation = wx.createAnimation({
      duration: 400, //动画时长
      timingFunction: "linear", //线性
      delay: 0 //0则不延迟
    });
    // 第2步：这个动画实例赋给当前的动画实例
    this.animation = animation;
    // 第3步：执行第一组动画
    animation.opacity(0).step();
    // 第4步：导出动画对象赋给数据对象储存
    this.setData({
      animationData: animation.export()
    })
    // 第5步：设置定时器到指定时候后，执行第二组动画
    setTimeout(function () {
      // 执行第二组动画
      animation.opacity(1).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
      this.setData({
        animationData: animation
      })
      //关闭
      if (currentStatu == "close") {
        this.setData({
          showModalStatus: false
        });
      }
    }.bind(this), 400)
    // 显示
    if (currentStatu == "open") {
      var memberCardId = that.data.memberCardId;
      var dataUrl = "/card/refundCheck";
      var param = {
        memberCardId: memberCardId
      };
      wxRequest(dataUrl, param).then(res => {
        console.log("退卡验证", res);
        if (res.code == "0000") {
          var refundDesc = res.data.refundDesc;
          var refundAmount = res.data.refundAmount;
          that.setData({
            showModalStatus: true,
            refundDesc: refundDesc,
            refundAmount: refundAmount
          });
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000
          })
        }
      });
    }
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
    that.sellCardDetails();
    // 停止下拉动作  
    wx.stopPullDownRefresh();
    if (that.data.cardDetails) {
      // 隐藏导航栏加载框  
      wx.hideNavigationBarLoading();
    }
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
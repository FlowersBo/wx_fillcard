// pages/sellCard/cardDetails/index.js
var that;
var wxRequest = require('../../utils/requestUrl.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardDetails: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    var memberCardId = options.memberCardId;
    console.log(memberCardId)
    that.setData({
      memberCardId: memberCardId
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
    that.sellCardDetails();
  },

  //转卡详请
  sellCardDetails(e) {
    var memberCardId = that.data.memberCardId;
    var dataUrl = "/card/memberCardDetail?memberCardId=" + memberCardId;
    var param = {

    };
    wxRequest(dataUrl, param).then(res => {
      console.log("转卡详情", res);
      var cardDetails = res;
      that.setData({
        cardDetails: cardDetails
      });
    });
  },

  //输入金额
  commissionValue(event) {
    var commission_value = event.detail.value;
    var reg = /^(\.*)(\d+)(\.?)(\d{0,2}).*$/g;
    if (reg.test(commission_value)) { //正则匹配通过，提取有效文本
      commission_value = commission_value.replace(reg, '$2$3$4');
      const reg1 = /0*([1-9]\d*|0\.\d+)/;
      commission_value = commission_value.replace(reg1, '$1');
    } else { //正则匹配不通过，直接清空
      commission_value = '';
    }
    that.setData({
      commission_value: commission_value
    })
    console.log(commission_value)
    return commission_value;
  },


  //确认转卡
  submitFun(e) {
    var memberCardId = that.data.memberCardId;
    var salePrice = that.data.commission_value;
    if (salePrice >= 1) {
      let currentStatu = e.currentTarget.dataset.statu;
      that.util(currentStatu);
      var dataUrl = "/card/resell";
      var param = {
        memberCardId: memberCardId,
        salePrice: salePrice
      };
      wxRequest(dataUrl, param).then(res => {
        console.log("转卖结果", res);
        if (res.code == "0000") {
          wx.showToast({
            title: '转卖成功',
            icon: 'success',
            duration: 1000
          })
          setTimeout(function() {
            wx.redirectTo({
              url: '/pages/user/sellVipcard/index'
            })
          }, 1100)
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 1000
          })
        }
      });
    } else {
      wx.showToast({
        title: '金额不能小于一元',
        icon: 'none',
        duration: 1000
      })
    }
  },


  //模态框
  powerDrawer: function(e) {
    var salePrice = that.data.commission_value;
    //去除小数点
    if (salePrice) {
      console.log('去除小数点')
      var y = String(salePrice).indexOf(".") + 1;
      console.log('获取小数点的位置', y);
      var count = String(salePrice).length - y;
      console.log('获取小数点后的个数', count);
      if (y > 0) {
        console.log("这个数字是小数，有" + count + "位小数");
        if (count == 0) {
          const reg2 = /(?:\.0*|(\.\d+?)0+)$/;
          salePrice = salePrice.replace(reg2, '$1');
          that.setData({
            commission_value: salePrice
          });
        }
      }
    }
    console.log(e)
    let currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu);
  },

  // 模态动画
  util: function(currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例
    var animation = wx.createAnimation({
      duration: 300, //动画时长
      timingFunction: "linear", //线性
      delay: 0 //0则不延迟
    });
    // 第2步：这个动画实例赋给当前的动画实例
    this.animation = animation;
    // 第3步：执行第一组动画
    animation.opacity(0).rotateX(-100).step();
    // 第4步：导出动画对象赋给数据对象储存
    this.setData({
      animationData: animation.export()
    })
    // 第5步：设置定时器到指定时候后，执行第二组动画
    setTimeout(function() {
      // 执行第二组动画
      animation.opacity(1).rotateX(0).step();
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
    }.bind(this), 300)
    // 显示
    if (currentStatu == "open") {
      var memberCardId = that.data.memberCardId;
      var salePrice = that.data.commission_value;
      if (salePrice >= 1) {
        var dataUrl = "/card/resellCommission?memberCardId=" + memberCardId;
        var param = {
          salePrice: salePrice
        };
        wxRequest(dataUrl, param).then(res => {
          console.log("获取百分比", res);
          if (res.code == "0000") {
            var salePrice = res;
            that.setData({
              cardSaleFeePlatform: res.cardSaleFeePlatform,
              showModalStatus: true
            });
          } else {
            wx.showToast({
              title: res.msg,
              icon: 'none',
              duration: 1000
            })
          }
        });
      } else {
        wx.showToast({
          title: '金额不能小于一元',
          icon: 'none',
          duration: 1000
        })
      }
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
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
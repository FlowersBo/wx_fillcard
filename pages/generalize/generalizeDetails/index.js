// pages/generalize/generalizeDetails/index.js
var that;
var wxRequest = require('../../../utils/requestUrl.js');
var clipImage = require('../../../utils/clipImage.js');
var WxParse = require('../../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    generalize: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    var productId = options.productId;
    that.setData({
      productId: productId
    });
    wx.hideShareMenu();
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
    that.generalizeFun();
  },

  //推广详情
  generalizeFun: function() {
    var productId = that.data.productId;
    console.log('当前productId', productId);
    var dataUrl = "/product/productDetail?productId=" + productId;
    var param = {};
    wxRequest(dataUrl, param).then(res => {
      console.log("推广详情", res);
      if (res.code == "0000") {
        var generalize = res;
        var spreadPic = res.spreadPic;
        var spreadTitle = res.spreadTitle;
        var merchantName = res.merchantName;
        that.imgFun(spreadPic);
        var article = res.usageRule;
        WxParse.wxParse('article', 'html', article, that, 5);
        wx.setNavigationBarTitle({
          title: merchantName
        })
        that.setData({
          generalize: generalize,
          spreadTitle: spreadTitle
        });
      }
    });
  },

  //图片等比例缩放
  // imageLoad: function(e) {
  //   var query = wx.createSelectorQuery();
  //   //选择id
  //   var that = this;
  //   query.select('.imgWrap').boundingClientRect(function (rect) {
  //     console.log(rect.width)
  //   }).exec();

  //   console.log('缩放图', e);
  //   let width = e.detail.width,
  //     height = e.detail.height,
  //     ratio = width / height;
  //   let viewWidth = 360*2,
  //     viewHeight = viewWidth/ratio;
  //     console.log('宽高',viewWidth,viewHeight);
  //     that.setData({
  //       viewWidth: viewWidth,
  //       viewHeight: viewHeight
  //     })
  // },

  //剪裁图片
  imgFun: function(pic) {
    //缩放图片
    // wx.getImageInfo({
    //   src: pic,
    //   success: function(res) {
    //     var ctx = wx.createCanvasContext('photo_canvas');
    //     var ratio = 2;
    //     var canvasWidth = res.width
    //     var canvasHeight = res.height;
    //     // 保证宽高均在200以内
    //     while (canvasWidth > 200 || canvasHeight > 200) {
    //       //比例取整
    //       canvasWidth = Math.trunc(res.width / ratio)
    //       canvasHeight = Math.trunc(res.height / ratio)
    //       ratio++;
    //     }
    //     that.setData({
    //       canvasWidth: canvasWidth,
    //       canvasHeight: canvasHeight
    //     }) //设置canvas尺寸
    //     ctx.drawImage(pic, 0, 0, canvasWidth, canvasHeight)
    //     ctx.draw()
    //     //下载canvas图片
    //     setTimeout(function() {
    //       wx.canvasToTempFilePath({
    //         canvasId: 'photo_canvas',
    //         success: function(res) {
    //           console.log('缩放图',res.tempFilePath);
    //           that.setData({
    //             pic: res.tempFilePath
    //           })
    //         },
    //         fail: function(error) {
    //           console.log(error)
    //         }
    //       })
    //     }, 100)
    //   },
    //   fail: function(error) {
    //     console.log(error)
    //   }
    // })

    //剪裁图片
    wx.getImageInfo({
      src: pic, // 网络图片路径 
      success: (res) => {
        console.log('图片信息', res)
        // 裁剪图片
        clipImage(res.path, res.width, res.height, (img) => {
          console.log('裁剪图片',img); // img为最终裁剪后生成的图片路径,为转发封面图
          that.setData({
            pic: img
          })
        });
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
    // 停止下拉动作  
    if (that.data.generalize) {
      that.generalizeFun();
      // 隐藏导航栏加载框  
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
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
  onShareAppMessage: function(options) {　
    console.log(options)　
    var pic = that.data.pic;
    var productId = that.data.productId;
    let accountId = wx.getStorageSync('accountId');
    console.log('推广员', accountId);
    console.log('分享图片', pic)
    var spreadTitle = that.data.spreadTitle;
    var shareObj = {　　　　
      title: spreadTitle,
      path: '/pages/share/index?productId=' + productId + '&accountId=' + accountId,
      imageUrl: pic,
      　　　success: function(res) {　　　
        console.log(res + '成功');
        if (res.errMsg == 'shareAppMessage:ok') {　　
          console.info(res + '成功');
        }　　　　
      },
      　　　　fail: function() {　　　　　　
        if (res.errMsg == 'shareAppMessage:fail cancel') { // 用户取消转发
          　　　　　　} else if (res.errMsg == 'shareAppMessage:fail') {}
      },
      　　　　complete: function() {}　　
    };　　
    console.log(shareObj)
    // 来自页面内的按钮的转发
    if (options.from == 'button') { // 此处可以修改 shareObj 中的内容
      console.log('来自页面内的按钮的转发')
    }
    return shareObj;
    console.log('分享详情', shareObj);
  }
})
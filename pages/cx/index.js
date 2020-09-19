	// pages/editor.js
	Page({
	  /**
	   * 
	   * 页面的初始数据
	   */
	  data: {
	    isShow: false,
	    placeholder: '请输入',
	    param: {
	      content: '',
	    },
	    richContent: "",
	    richJobRemark: ""
	  },
	
	  /**
	   * 生命周期函数--监听页面加载
	   */
	  onLoad: function (options) {
	
	  },
	
	  //富文本
	  // 富文本相关的函数
	  onEditorReady1() { //1
	    const that = this
	    this.createSelectorQuery().select('#editor1').context(function (res) {
	      console.log(res)
	      that.editorCtx1 = res.context
	      if (that.data.richContent == "" || that.data.richContent == null) {
	      } else {
	        that.editorCtx1.setContents({ html: that.data.richContent }) // 注意：插入的是对象
	      }
	    }).exec()
	  },
	  //富文本失焦的事件
	  blur1(e) { //1
	    let html = e.detail.html
	    let delta = e.detail.delta
	    console.log(html)
	    console.log(delta)
	    this.data.param.content = html
	    this.setData({
	      param: this.data.param
	    })
	    this.editorCtx1.blur()
	  },
	  //样式设置的部分
	  format1(e) { //1
	    console.log(e)
	    let { name, value } = e.target.dataset
	    if (!name) return
	    // console.log('format', name, value)
	    console.log(this)
	    this.editorCtx1.format(name, value)
	
	  },
	  //富文本编辑器状态改变
	  onStatusChange1(e) { //1
	    console.log(this.editorCtx1)
	    const formats = e.detail
	    this.setData({ formats })
	  },
	  //插入图片 （需要自己配置url以及上传参数）
	  insertImage1() { //1
	    const that = this
	    // let user_token = global.state.token;
	    wx.chooseImage({
	      count: 1,
	      success: function (res) {
	        wx.uploadFile({
	          url: 'url',
	          filePath: res.tempFilePaths[0],
	          name: 'file',
	          header: {
	            "token": user_token
	          },
	          success: function (res) {
	            console.log(res)
	            if (res.statusCode == 200) {
	              let data = JSON.parse(res.data);
	              let img = data.result.attachmentUrl;
	              that.editorCtx1.insertImage({
	                src: img,
	                data: {
	                  id: 'abcd',
	                  role: 'god'
	                },
	                // width: '100%',
	                success: function () {
	                  console.log('insert image success')
	                }
	              })
	            }
	          }
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

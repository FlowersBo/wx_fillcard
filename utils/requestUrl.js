const app = getApp();
const siteRoots = app.data.siteroot;
const wxRequest = (url, data) => {
  wx.showLoading({
    mask: true,
    title: '加载中...',
  })
  let token = wx.getStorageSync('token');
  let cityCode = wx.getStorageSync('city');
  let longitude = wx.getStorageSync('longitude');
  let latitude = wx.getStorageSync('latitude');
  console.log('经纬度', longitude, latitude)
  if (longitude){
    data.longitude = longitude;
    data.latitude = latitude;
  }
  console.log('城市', cityCode)
  data.cityCode = cityCode;
  let version = '1.0';
  data.version = version;
  console.log("请求参数", data)
  console.log("请求里的token", token);
  return new Promise(function (resolve, reject) {
    wx.request({
      url: siteRoots+url,
      method: 'POST',
      data: data,
      header: {
        'content-type': 'application/json', // 默认值
        'authToken': token,
      },
      success: function (res) {
        // console.log('请求数据',res);
        wx.hideLoading();
        console.log('请求数据地址',url);
        if (res.statusCode != 200) {
          reject({ error: '服务器忙，请稍后重试', code: 500 });
          return;
        }
        resolve(res.data);
      },
      fail: function (res) {
        // fail调用接口失败
        reject({ error: '网络错误', code: 0 });
      },
      complete: function (res) {
        // complete
      }
    })
  })
}

module.exports = wxRequest
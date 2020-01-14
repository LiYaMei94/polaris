import API from "../common/API.js"
const util = require("../utils/util.js")
import request from "../common/HttpService.js"

var uploadFile = function(options) {
  //dir 上传的文件目录   filepath 需要上传的文件目录  注：如不需要截图，直接上传不需要提供
  const {
    dir = "",
      filepath,
      success,
      fail
  } = options

  // 请求用到的参数
  var Bucket = 'polaris-1257165361';
  var Region = 'ap-guangzhou';
  var prefix = 'https://' + Bucket + '.cos.' + Region + '.myqcloud.com/';

  // 计算签名
  var getAuthorization = function(options, callback) {
    request({
      url: API.auth, // 服务端签名，参考 server 目录下的两个签名例子
      data: {
        method: options.method,
        pathname: options.pathname,
      },
      start(){},
      success: function(result) {
        callback(result);
      }
    })
  };

  // 上传文件
  var uploadFile = function(filePath) {
    var Key = filePath.substr(filePath.lastIndexOf('/') + 1); // 这里指定上传的文件名
    getAuthorization({
      method: 'POST',
      pathname: '/'
    }, function(AuthData) {
      var requestTask = wx.uploadFile({
        url: prefix,
        name: 'file',
        filePath: filePath,
        formData: {
          'key': dir + '/' + Key,
          'success_action_status': 200,
          'Signature': AuthData.Authorization,
          'x-cos-security-token': AuthData.XCosSecurityToken,
          'Content-Type': '',
        },
        success: function(res) {
          var Location = prefix + dir + '/' + Key;
          if (res.statusCode === 200) {
            res.data = Location
            // console.log(res)
            if (util.isFunction(success)) {
              success(res)
            }
          } else {
            if (util.isFunction(fail)) {
              fail(res)
            }
          }
        },
        fail: function(res) {
          if (util.isFunction(fail)) {
            fail(res)
          }
        }
      });
      requestTask.onProgressUpdate(function(res) {
        // console.log('正在进度:', res);
      });
    });
  };

  if (filepath == undefined) {
    // 选择文件
    wx.chooseImage({
      count: 3, // 默认9
      sizeType: ['original'], // 可以指定是原图还是压缩图，这里默认用原图
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        uploadFile(res.tempFilePaths[0]);
      }
    })
  } else {
    uploadFile(filepath)
  }
};

module.exports = uploadFile;
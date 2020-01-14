// pages/mine-personal-info/personal_info.js
const app = getApp();
const util = require("../../utils/util.js")
var upload = require('../../common/cos-upload');
import request from "../../common/HttpService.js"
import API from "../../common/API.js"
const SensitiveWords = require('../../utils/SensitiveWords.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    showNicknameDialog: false,
    showSexDialog: false,
    showSignatureDialog: false,
    currentDate: util.getBirthData().selectValue,
    sigTemp: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      userInfo: util.copy(app.globalData.userInfo),
      sigTemp: app.globalData.userInfo.signature.length
    })
  },
  // 选择头像
  choosePortrait() {
    const me = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      success: function(res) {
        const tempFilePaths = res.tempFilePaths
        const tempFiles = res.tempFiles
        console.log(tempFilePaths)
        // me.data.userInfo.avatar = tempFilePaths[0];
        wx.navigateTo({
          url: '../mine_pic_crop/mine_pic_crop?path=' + tempFilePaths[0],
        })
      },
    })
  },
  // 显示/关闭昵称弹框
  showNicknameDialog(e) {
    let op = "close";
    if (util.type(e) === 'string') {
      op = e;
    } else {
      op = e.currentTarget.dataset.statu;
    }

    this.setData({
      showNicknameDialog: op === "open"
    })
  },
  // 昵称确认
  confirmNickname(e) {
    const {
      nickname
    } = e.detail.value
    console.log(nickname)
    if (nickname !== "") {
      util.sensitiveWordsFun(nickname).then(result => {
        if (result) {
          util.showFail("您输入的内容有敏感词，请重新输入")
        } else {
          this.data.userInfo.nickname = nickname
          this.setData({
            userInfo: this.data.userInfo
          })
          this.showNicknameDialog("close")
        }
      })
    }
  },
  // 显示/关闭性别弹窗
  showSexDialog(e) {
    let op = "close";
    if (util.type(e) === 'string') {
      op = e;
    } else {
      op = e.currentTarget.dataset.statu;
    }

    this.setData({
      showSexDialog: op === "open"
    })
  },
  // 选择性别
  selectSex(e) {
    const sex = e.currentTarget.dataset.statu
    this.data.userInfo.gender = sex
    this.setData({
      userInfo: this.data.userInfo
    })
    this.showSexDialog("close")
  },
  // 点击地址的取消/确认
  clickAddressDialog(e) {
    console.log(e)
    this.data.userInfo.address = e.detail.value;
    this.setData({
      userInfo: this.data.userInfo
    })
  },
  // 点击出生日期弹窗
  clickBirthDialog(e) {
    console.log(e)
    this.data.userInfo.birth = e.detail.value;
    this.setData({
      userInfo: this.data.userInfo
    })
  },
  // 显示个性签名弹窗
  showSignatureDialog(e) {
    console.log(e)
    let op = "close";
    if (util.type(e) === 'string') {
      op = e;
    } else {
      op = e.currentTarget.dataset.statu;
    }

    this.setData({
      showSignatureDialog: op === "open"
    })
  },
  //点击确认签名
  confirmSignature(e) {
    const {
      signature
    } = e.detail.value
    // console.log(signature)
    if (signature !== "") {
      util.sensitiveWordsFun(signature).then(result => {
        if (result) {
          util.showFail("您输入的内容有敏感词，请重新输入")
        } else {
          this.data.userInfo.signature = signature
          this.setData({
            userInfo: this.data.userInfo
          })
          this.showSignatureDialog("close")
        }
      })
    }
  },
  // 签名输入监听
  signatureInputListener(e) {
    // console.log(e)
    const {
      value,
      cursor
    } = e.detail;
    this.setData({
      sigTemp: value.length
    })
  },
  // 点灰色背景，关闭所有类型Dialog
  closeDialog() {
    this.setData({
      showNicknameDialog: false,
      showBirthDialog: false,
      showSexDialog: false,
      showSignatureDialog: false,
      showAddressDialog: false,
    })
  },
  // 点击确认
  confirm: util.throttle(function(e) {
    const me = this;
    //如果头像修改  需要先上传
    if (me.data.userInfo.avatar !== app.globalData.userInfo.avatar) {
      //图片上传
      upload({
        dir: "avatar",
        filepath: me.data.userInfo.avatar,
        success(res) {
          me.data.userInfo.avatar = res.data
          me.requestComplete()
        },
        fail(res) {
          util.showFail(JSON.stringify(res))
        }
      })
    } else {
      me.requestComplete()
    }
  }),
  // 请求完成信息
  requestComplete() {
    const me = this;
    request({
      url: API.completeInfo,
      data: {
        avatar: me.data.userInfo.avatar,
        name: me.data.userInfo.nickname,
        gender: me.data.userInfo.gender,
        birth: me.data.userInfo.birth,
        sign: me.data.userInfo.signature,
        address: me.data.userInfo.address
      },
      start() {
        util.showBusy("上传中..")
      },
      success(res) {
        app.login({
          success() {
            const pages = getCurrentPages();
            pages[pages.length - 2].setData({
              userInfo: app.globalData.userInfo
            })
            pages[pages.length - 3].setData({
              userInfo: app.globalData.userInfo
            })

            wx.navigateBack({

            })
          }
        });
      }
    })
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
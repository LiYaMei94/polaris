// pages/mine/mine.js
const app = getApp();
import request from "../../common/HttpService.js"
import API from "../../common/API.js"
const util = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    polarisItemInfo: [],
    dialog_classify_data: {
      show: false,
      index: 0
    },
    showOp: false, //是否显示操作,
    currentOpItem: {}, //当前弹窗的操作的
    page: 1,
    loadComplete: true,
    count: 0, //总条数
    showToTop: false, //显示置顶
    nameMaxWidth: 0, //昵称显示的最大宽度
    sexHeight: 0, //性别高度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      userInfo: app.globalData.userInfo
    })
    // 消息列表
    if (this.data.userInfo !== null) {
      this.refreshFirst()
    }
    if (app.globalData.userInfo !== null) {
      app.refreshMine()
    }
  },
  //首次请求数据
  refreshFirst() {
    this.setData({
      polarisItemInfo: [],
      showOp: false,
      page: 1,
      loadComplete: false,
      count: 0
    })
    this.requestData()
  },
  //请求列表数据
  requestData() {
    let me = this
    request({
      url: API.userNews,
      data: {
        uid: me.data.userInfo.openid,
        page: me.data.page,
        orderby: me.data.dialog_classify_data.index + 1
      },
      start() {
        if (me.data.page === 1) {
          util.showBusy("玩命加载中..")
        }
      },
      success(res) {
        if (me.data.page === 1) {
          me.data.polarisItemInfo = res.data
        } else {
          me.data.polarisItemInfo = me.data.polarisItemInfo.concat(res.data)
        }

        if (res.data.length < 10) {
          me.data.loadComplete = true
          me.setData({
            loadComplete: me.data.loadComplete
          })
        } else {
          me.data.page++
        }

        me.setData({
          polarisItemInfo: me.data.polarisItemInfo,
          page: me.data.page,
          count: res.count,
        })
      },
      complete() {
        wx.stopPullDownRefresh()
      }
    })
  },
  // 登录授权后
  login() {
    let me = this
    app.login({
      success: function(e) {
        console.log(e)
        me.onShow();
        if (e.info_st == 0) {
          wx.navigateTo({
            url: '../complete_personal_info/complete_personal_info',
          })
        }
        me.refreshFirst()
      },
      fail: function() {
        console.log("失败")
      }
    })
  },
  // 打开或关闭分类弹窗
  open_classify(e) {
    if (this.data.polarisItemInfo.length === 0) {
      return;
    }
    // console.log(e)
    let op = false;
    if (e.type === "tap") {
      //点击
      op = e.currentTarget.dataset.content;
    } else {

    }
    this.data.dialog_classify_data.show = op;
    this.setData({
      dialog_classify_data: this.data.dialog_classify_data
    })
  },
  // 点击分类
  click_classify(e) {
    // console.log(e)
    const index = e.currentTarget.dataset.content;
    if (this.data.dialog_classify_data !== index) {
      this.data.dialog_classify_data.index = index;
      this.data.dialog_classify_data.show = false;
      this.setData({
        dialog_classify_data: this.data.dialog_classify_data
      })

      this.refreshFirst()
    }
  },
  // 打开或关闭操作窗
  openOp(e) {
    console.log(e)
    const data = e.detail.open;
    let item = this.data.currentOpItem;
    if (data) {
      item = e.detail.item;
    }

    this.setData({
      showOp: data,
      currentOpItem: item !== undefined ? item : {}
    })
  },
  //功能未开放
  // toastClose() {
  //   util.showFail("此功能暂未开放，敬请期待..")
  // },
  //滑动监听
  onPageScroll: function(e) {
    const {
      scrollTop
    } = e
    this.setData({
      showToTop: scrollTop > 1000
    })
  },
  //置顶
  toTop() {
    wx.pageScrollTo({
      scrollTop: 0,
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
    this.setData({
      userInfo: app.globalData.userInfo
    })

    let total = 0;
    let sex = 0;
    let vip = 0;

    util.get_wxml(`.info_name`, (rects) => {
      // console.log(rects)
      if (rects.length !== 0) {
        total = rects[0].width
      }
      util.get_wxml(`.sex`, (rects) => {
        // console.log(rects)
        if (rects.length !== 0) {
          sex = rects[0].width / 26 * 40
        }
        util.get_wxml(`.vip`, (rects) => {
          if (rects.length !== 0) {
            vip = rects[0].width / 86 * 101
          }
          this.setData({
            nameMaxWidth: total - sex - vip
          })
        });
      });
    });

    util.get_wxml(`.name`, (rects) => {
      if (rects.length !== 0) {
        this.setData({
          sexHeight: rects[0].height
        })
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
    if (this.data.userInfo !== null) {
      this.refreshFirst()
      app.refreshMine()
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let me = this
    if (!me.data.loadComplete) {
      me.requestData()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
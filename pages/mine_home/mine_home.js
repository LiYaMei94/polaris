// pages/mine_home/mine_home.js
const app = getApp();
import request from "../../common/HttpService.js"
import API from "../../common/API.js"
const util = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    polarisItemInfo: [],
    userInfo: {},
    levels: ["https://polaris-1257165361.cos.ap-guangzhou.myqcloud.com/static/images/mine%5Clevel_1.png", "https://polaris-1257165361.cos.ap-guangzhou.myqcloud.com/static/images/mine%5Clevel_2.png", "https://polaris-1257165361.cos.ap-guangzhou.myqcloud.com/static/images/mine%5Clevel_3.png"],
    current_level: "https://polaris-1257165361.cos.ap-guangzhou.myqcloud.com/static/images/mine%5Clevel_1.png",
    dialog_classify_data: {
      show: false,
      index: 0
    },
    showOp: false, //是否显示操作,
    currentOpItem: {}, //当前弹窗的操作的,
    showSignDialog: false, //签到日历是否显示
    signCalendar: null, //签到日历数据
    page: 1,
    loadComplete: true,
    uid: "", //uid,
    count: 0, //总条数
    isMyself: false, //是否已登录，是本人
    whose: "我", //谁的积分
    isSign: false, //是否签到
    showToTop: false, //显示置顶
    nameMaxWidth: 0, //昵称显示的最大宽度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.data.current_level = (() => {
    //   if (userInfo.credit < 500) {
    //     return levels[0];
    //   } else if (userInfo.credit < 1000) {
    //     return levels[1];
    //   } else {
    //     return levels[2];
    //   }
    // })();
    if (app.globalData.userInfo !== null && app.globalData.userInfo.is_sign != undefined) {
      this.setData({
        isSign: app.globalData.userInfo.is_sign===1
      })
    }else{
      this.setData({
        isSign: true
      })
    }

    this.data.uid = options.uid
    this.data.isMyself = app.globalData.userInfo !== null && options.uid === app.globalData.userInfo.openid
    if (this.data.isMyself) {
      this.setData({
        userInfo: app.globalData.userInfo,
        uid: this.data.uid,
        isMyself: this.data.isMyself
        // current_level:this.data.current_level
      });
    } else {
      //未登录  或者不是本人
      this.setData({
        userInfo: null,
        uid: this.data.uid,
        isMyself: this.data.isMyself
        // current_level:this.data.current_level
      });

      this.requestInfo();
    }

    this.refreshFirst();
  },
  //首次数据加载
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
        uid: me.data.uid,
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
          count: res.count
        })
      },
      complete() {
        wx.stopPullDownRefresh()
      }
    })
  },
  //不是本人的时候 请求个人信息
  requestInfo() {
    let me = this
    request({
      url: API.info,
      data: {
        uid: me.data.uid,
      },
      start() {

      },
      success(res) {
        me.setData({
          userInfo: res,
          whose: res.gender === 1 ? "他" : "她"
        })
      }
    })
  },
  //举报评论
  reportComment(e) {
    let me = this
    if (this.data.isMyself) {
      return;
    }
    util.showModel("提示", "确认举报该用户么？恶意举报将有严重惩罚哦~", (res) => {
      if (res.confirm) {
        request({
          url: API.report,
          data: {
            type: 2,
            id: me.data.userInfo.openid
          },
          start() {},
          success(res) {
            util.showSuccess("举报成功")
          }
        })
      }
    }, true)
  },
  // 页面跳转
  navigate(e) {
    // console.log(e)
    const target = e.currentTarget.dataset.url;
    switch (target) {
      case "home":
        if (!this.data.userInfo.signIN) {
          wx.switchTab({
            url: '../' + target + "/" + target,
          })
        }
        break
      case "calendar":
        //需要弹出签到日历
        this.showSignDialog(true)
        break
      case "edit":
        //编辑
        if (this.data.isMyself) {
          wx.navigateTo({
            url: '../' + target + "/" + target,
          })
        }
        break
      case "mine_vip_rule":
        //积分  vip 及规则
        let type = e.currentTarget.dataset.type
        wx.navigateTo({
          url: '../' + target + "/" + target + "?type=" + type,
        })
        break
      default:
        wx.navigateTo({
          url: '../' + target + "/" + target,
        })
    }
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
  // 是否展示签到日历
  showSignDialog(e) {
    // console.log(e)
    if (!this.data.isMyself) {
      return;
    }
    let show = false;
    if (e.type === undefined) {
      show = e;
    } else {
      show = e.currentTarget.dataset.content;
    }
    if (this.data.signCalendar === null && show) {
      this.requestCalendar()
    } else {
      this.setData({
        showSignDialog: show
      })
    }
  },
  //请求日历
  requestCalendar() {
    let me = this
    request({
      url: API.calendar,
      success(res) {
        me.setData({
          signCalendar: res
        })
        me.showSignDialog(true)
      }
    })
  },
  //点击日历单个
  tabCalendarItem(e) {
    // console.log(e)
    let me = this
    let item = e.currentTarget.dataset.content;
    if (((item.number < me.data.signCalendar.today && item.isCurrentMonth === 0) || item.isCurrentMonth === -1) && !item.isSign) {
      util.showModel("提示", "确定补签" + me.data.signCalendar.month + "月" + item.number + "号？", (res) => {
        if (res.confirm) {
          request({
            url: API.check_in,
            data: {
              date: item.date
            },
            success(res) {
              util.showFail("补签成功 " + res.reward + "积分")
              setTimeout(() => {
                app.refreshMine();
                me.setData({
                  signCalendar: null
                })
              }, 1500)
            }
          })
        }
      }, true)

    }
  },
  // 打开或关闭操作窗
  openOp(e) {
    // console.log(e)
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
  //预览头像
  previewAvatar(e) {
    // console.log(e)
    let me = this
    util.previewImage([me.data.userInfo.avatar])
  },
  //吐司展示不全的
  toast(e) {
    console.log(e)
    const str = e.currentTarget.dataset.content;
    util.showFail(str)
  },
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
    let me = this
    let total = 0;
    let image = 0;
    util.get_wxml(`.r_name_block`, (rects) => {
      // console.log(rects)
      if (rects.length !== 0) {
        total = rects[0].width
      }
      util.get_wxml(`.sex`, (rects) => {
        // console.log(rects)
        if (rects.length !== 0) {
          image = me.data.isMyself ? rects[0].width / 26 * 116 : rects[0].width / 26 * 36
        }
        this.setData({
          nameMaxWidth: total - image
        })
      });
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
    if (this.data.isMyself) {
      const pages = getCurrentPages();
      for(let i in pages){
        if (pages[i].route ==="pages/mine/mine"){
          pages[i].setData({
            dialog_classify_data: this.data.dialog_classify_data,
            page: this.data.page,
            loadComplete: this.data.loadComplete,
            count: this.data.count,
            polarisItemInfo: this.data.polarisItemInfo
          })
        }
      }
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.refreshFirst()
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
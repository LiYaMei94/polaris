
const util = require("../../../utils/util.js")
import API from "../../../common/API.js"
import request from "../../../common/HttpService.js"
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    polarisItem: {
      type: Object, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: {} // 属性初始值（可选），如果未指定则会根据类型选择一个
      //操作状态  //第1位：屏蔽帖子  1已屏蔽
      //2：屏蔽用户  1已屏蔽
      //3：收藏  1已收藏
      //4:删除  1已通过审核发布，可删除
      //5:举报  1可举报--明星帖子不可举报？或许
    },
    reviewDialogShow: {
      type: Boolean,
      value: false
    },
    navigateUrlNull: {
      type: Boolean,
      value: false
    },
    //页面来源
    source: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    videoImgWidth: 0,
    videoImgHeight: 0,
    showVideoDialog: false, //是否弹窗播放
    tvphide: false,
    vid: 'b0136et5ztz',
    
  },
  pageLifetimes: {
    hide() {
      this.setData({
        showVideoDialog: false
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    navigateto_userHome() {
      if (this.data.polarisItem.nf === 0) {
        wx.navigateTo({
          url: '../polarisIntroduction/polarisIntroduction',
        })
      } else {
        if (this.data.source === "mine_home") {
          return;
        }
        wx.navigateTo({
          url: '../mine_home/mine_home?uid=' + this.data.polarisItem.uid,
        })
      }
    },
    //显示关闭视频
    showVideoDialog(e) {
      // console.log(e)
      let type = false;
      if (e.type === "tap" || e.type === "touchstart") {
        type = e.currentTarget.dataset.content;
      } else {
        type = e;
      }
      this.setData({
        showVideoDialog: type
      })
    },
    // 视频图片加载
    videoimgload(e) {
      // console.log(e)
      this.setData({
        videoImgWidth: e.detail.width * 350 / e.detail.height,
        videoImgHeight: e.detail.height * 350 / e.detail.height
      })
    },
    // 点赞事件
    likeClick(e) {
      var newid = e.currentTarget.dataset.newid;
      var that = this;
      var good_st = e.currentTarget.dataset.good_st;
      // if (type)
      console.log(e)
      request({
        url: API.addNewsDood,
        data: {
          "id": newid,
          "type": good_st
        },
        start: function() {},
        success: function(res) {
          that.likeLocalChange()
        },
        fail(res){
          console.log(res)
          if (res.code === -40007){
            //状态不匹配
            that.likeLocalChange()
          }else{
            util.showFail(JSON.stringify(res))
          }
        }
      })
    },
    //点赞本地更新
    likeLocalChange(){
      let that =this;
      var polarisItem = that.data.polarisItem;
      if (polarisItem.good_st == 0) {
        polarisItem.good = polarisItem.good + 1;
        polarisItem.good_st = 1
      } else {
        polarisItem.good = polarisItem.good - 1;
        polarisItem.good_st = 0
      }
      // that.setData({
      //   polarisItem: polarisItem
      // })

      const pages = getCurrentPages()
      for (let i in pages) {
        if (pages[i].route === "pages/" + that.data.source + "/" + that.data.source) {
          that.updatelist(pages[i], polarisItem)
          break
        }
      }
    },
    // 更新列表
    updatelist(page, polarisItem) {
      var polarisItemInfo = page.data.polarisItemInfo;
      console.log(polarisItem)
      if (this.data.source === "fanscircle") {
        for (let i in polarisItemInfo[0]) {
          if (polarisItemInfo[0][i].id == polarisItem.id) {
            polarisItemInfo[0][i] = polarisItem
            break
          }
          if (i === polarisItemInfo[0].length-1){
            for (let i in polarisItemInfo[1]) {
              if (polarisItemInfo[1][i].id == polarisItem.id) {
                polarisItemInfo[1][i] = polarisItem
                break
              }
            }
          }
        }
      } else {
        for (let i in polarisItemInfo) {
          if (polarisItemInfo[i].id == polarisItem.id) {
            polarisItemInfo[i] = polarisItem
            break
          }
        }
      }
      page.setData({
        polarisItemInfo: polarisItemInfo
      })
    },
    //预览图片
    showPreviewImage(e){
      console.log(e)
      let index = e.currentTarget.dataset.index;
      util.previewImage(this.data.polarisItem.image,index)
    },
    openOp(e) {
      const data = e.currentTarget.dataset.content;
      const item = e.currentTarget.dataset.polarisitem;
      if (app.globalData.userInfo != null) {
        this.$emit("openOp", {
          open: data,
          item: item
        })
      } else {
        util.showModel("提示", "用户未登录，请登录后操作", function(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../mine/mine',
            })
          }
        })
      }
    },
    $emit() {
      this.triggerEvent.apply(this, arguments);
    },
  },
})
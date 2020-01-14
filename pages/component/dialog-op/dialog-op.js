// pages/component/dialog-op/dialog-op.js
const app = getApp()
const util = require("../../../utils/util.js")
import API from "../../../common/API.js"
import request from "../../../common/HttpService.js"

Component({
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    polarisItem: {
      type: Object,
      value: {}
    },
    //页面来源
    source: String

  },

  /**
   * 组件的初始数据
   */
  data: {
    showDeleteAlert: false, //是否显示删除框
    status: [0, 0, 0, 1, 1]
    //第0位：屏蔽帖子  1已屏蔽 2不可操作
    //1：屏蔽用户  1已屏蔽 2不可操作
    //2：收藏  1已收藏
    //3:删除  1已通过审核发布，可删除
    //4:举报  1可举报--明星帖子不可举报？或许 2不可操作
  },
  lifetimes: {
    attached() {
      let status = this.data.status
      switch (this.data.source) {
        case "home":
          status[0] = 2;
          status[2] = this.data.polarisItem.favorite
          status[1] = 2;
          status[4] = 2;
          break
        case "fanscircle":
          status[0] = this.data.polarisItem.uid === app.globalData.userInfo.openid ? 2 : 0;
          status[2] = this.data.polarisItem.favorite
          status[1] = this.data.polarisItem.uid === app.globalData.userInfo.openid ? 2 : 0;
          status[4] = this.data.polarisItem.uid === app.globalData.userInfo.openid ? 2 : 1;
          break
        case "mine":
          status[0] = 2;
          status[2] = this.data.polarisItem.favorite
          status[1] = 2;
          status[4] = 2;
          break
        case "mine_home":
          status[0] = this.data.polarisItem.uid === app.globalData.userInfo.openid || this.data.polarisItem.nf === 0 ? 2 : 0;
          status[2] = this.data.polarisItem.favorite
          status[1] = this.data.polarisItem.uid === app.globalData.userInfo.openid || this.data.polarisItem.nf === 0 ? 2 : 0;
          status[4] = this.data.polarisItem.uid === app.globalData.userInfo.openid || this.data.polarisItem.nf === 0 ? 2 : 1;
          break
        case "mine_collect":
          status[0] = this.data.polarisItem.uid === app.globalData.userInfo.openid || this.data.polarisItem.nf === 0 ? 2 : 0;
          status[2] = 1
          status[1] = this.data.polarisItem.uid === app.globalData.userInfo.openid || this.data.polarisItem.nf === 0 ? 2 : 0;
          status[4] = this.data.polarisItem.uid === app.globalData.userInfo.openid || this.data.polarisItem.nf === 0 ? 2 : 1;
          break
        case "contentDetial":
          status[0] = this.data.polarisItem.uid === app.globalData.userInfo.openid || this.data.polarisItem.nf === 0 ? 2 : 0;
          status[2] = this.data.polarisItem.favorite
          status[1] = this.data.polarisItem.uid === app.globalData.userInfo.openid || this.data.polarisItem.nf === 0 ? 2 : 0;
          status[4] = this.data.polarisItem.uid === app.globalData.userInfo.openid || this.data.polarisItem.nf === 0 ? 2 : 1;
          break
      }
      //

      status[3] = this.data.polarisItem.uid === app.globalData.userInfo.openid ? 1 : 0
      this.setData({
        status: status
      })
    }
  },
  pageLifetimes: {
    hide() {
      let me = this
      let pages = getCurrentPages();
      for (let i in pages) {
        if (pages[i].route === "pages/" + me.data.source + "/" + me.data.source) {
          pages[i].setData({
            showOp: false
          })
        }
      }
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickOp(e) {
      console.log(e)
      const me = this
      switch (e.currentTarget.dataset.content) {
        case "0":
          //屏蔽帖子
          break
        case "1":
          //取消屏蔽帖子
          break
        case "2":
          //屏蔽用户
          break
        case "3":
          //取消屏蔽用户
          break
        case "4":
          //收藏
          request({
            url: API.addFavoriteNews,
            data: {
              newsid: me.data.polarisItem.id
            },
            start() {
              me.addFavoriteNews
            },
            success(res) {
              me.addFavoriteNews();
            },
            fail(res) {
              if (res.code === -10009) {
                me.addFavoriteNews();
              } else {
                util.showFail(JSON.stringify(res))
              }
            }
          })
          break
        case "5":
          //取消收藏
          request({
            url: API.delFavoriteNews,
            data: {
              newsid: me.data.polarisItem.id
            },
            start() {

            },
            success(res) {
              me.delFavoriteNews();
            },
            fail(res) {
              if (res.code === -10008) {
                me.delFavoriteNews();
              } else {
                util.showFail(JSON.stringify(res))
              }
            }
          })
          break
        case "6":
          //删除
          this.setData({
            showDeleteAlert: true
          })
          return //不执行关闭弹窗
        case "7":
          //举报
          util.showModel("提示", "确认举报该动态么？恶意举报将有严重惩罚哦~", (res) => {
            if (res.confirm) {
              request({
                url: API.report,
                data: {
                  type: 1,
                  id: me.data.polarisItem.id
                },
                start() {},
                success(res) {
                  util.showSuccess("举报成功")
                }
              })
            }
          }, true)
          break
      }
      this.$emit("openOp", {
        open: false
      })
    },
    // 收藏本地更新
    addFavoriteNews() {
      let me = this
      util.showSuccess("收藏成功")
      me.data.polarisItem.favorite = 1;
      me.setData({
        polarisItem: me.data.polarisItem
      })

      const pages = getCurrentPages()
      for (let i in pages) {
        if (pages[i].route === "pages/" + me.data.source + "/" + me.data.source) {
          me.updatelist(pages[i], me.data.polarisItem, false)
          break
        }
      }
    },
    // 取消收藏本地更新
    delFavoriteNews() {
      let me = this
      util.showSuccess("取消收藏")
      me.data.polarisItem.favorite = 0;
      me.setData({
        polarisItem: me.data.polarisItem
      })

      const pages = getCurrentPages()
      for (let i in pages) {
        if (pages[i].route === "pages/" + me.data.source + "/" + me.data.source) {
          if (me.data.source === "contentDetial") {
            me.updatelist(pages[i - 1], me.data.polarisItem, true)
          } else if (me.data.source === "mine_collect") {
            me.updatelist(pages[i], me.data.polarisItem, true)
          } else {
            me.updatelist(pages[i], me.data.polarisItem, false)
          }
          break
        }
      }
    },
    // 当点击删除弹窗
    onClickDeleteOp(e) {
      console.log(e)
      let me = this
      const type = e.currentTarget.dataset.type;
      if (type) {
        request({
          url: API.delNews,
          data: {
            newsid: this.data.polarisItem.id
          },
          success(res) {
            const pages = getCurrentPages()
            for (let i in pages) {
              if (pages[i].route === "pages/" + me.data.source + "/" + me.data.source) {
                me.updatelist(pages[i], me.data.polarisItem, true)
                break
              }
            }
          }
        })
      }
      this.$emit("openOp", {
        open: false
      })
    },
    // 更新列表
    updatelist(page, polarisItem, isDelete) {
      // console.log(polarisItem)
      let pageName = page.route.slice(page.route.lastIndexOf("/") + 1)
      if (pageName === "fanscircle") {
        var polarisItemInfo = page.data.polarisItemInfo;
        for (let i in polarisItemInfo[0]) {
          if (polarisItemInfo[0][i].id == polarisItem.id) {
            if (isDelete) {
              polarisItemInfo[0].splice(i, 1)
            } else {
              polarisItemInfo[0][i] = polarisItem
            }
            break
          }
          if (i === polarisItemInfo[0].length - 1) {
            for (let i in polarisItemInfo[1]) {
              if (polarisItemInfo[1][i].id == polarisItem.id) {
                if (isDelete) {
                  polarisItemInfo[1].splice(i, 1)
                } else {
                  polarisItemInfo[1][i] = polarisItem
                }
                break
              }
            }
          }
        }
        page.setData({
          polarisItemInfo: polarisItemInfo
        })
      } else if (pageName === "contentDetial") {
        if (isDelete) {
          const pages = getCurrentPages()
          this.updatelist(pages[pages.length - 2], polarisItem, true)
          wx.navigateBack({

          })
        } else {
          page.setData({
            newsDetailInfo: polarisItem
          })
          const pages = getCurrentPages()
          this.updatelist(pages[pages.length - 2], polarisItem, false)
        }
        return;
      } else {
        var polarisItemInfo = page.data.polarisItemInfo;
        for (let i in polarisItemInfo) {
          if (polarisItemInfo[i].id == polarisItem.id) {
            if (isDelete) {
              polarisItemInfo.splice(i, 1)
            } else {
              polarisItemInfo[i] = polarisItem
            }
            break
          }
        }
        page.setData({
          polarisItemInfo: polarisItemInfo
        })
      }

    },
    openOp(e) {
      // console.log(e)
      if (e.type === "tap") {
        this.$emit("openOp", {
          open: false
        })
      } else {
        this.$emit("openOp", {
          open: false
        })
      }
    },
    $emit() {
      this.triggerEvent.apply(this, arguments);
    },
  },
})
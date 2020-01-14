const util = require("../../utils/util.js")
import API from "../../common/API.js"
import request from "../../common/HttpService.js"
var upload = require('../../common/cos-upload');
const app = getApp();
var totalComment = []; //评论总的
var uploadImgArr = [];
var showUploadImgArr = [];
// import regeneratorRuntime from '../../utils/wxPromise.min.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentCount: 0,
    page: 1,
    contetnIndex: 0,
    newsDetailInfo: {},
    pageStatus: 'detail', //详情页组件不显示底部评论等操作,
    reviewArr: [],
    focus: true, //键盘弹出
    reviewDialogShow: false, //默认不显示评论弹窗
    newId: 1, //消息id
    showOp: false, //是否显示操作,
    currentOpItem: {}, //当前弹窗的操作的
    uploadImgArr: [],
    showUploadImgArr: [],
    commentImgWidth: Math.floor((app.globalData.systemInfo.screenWidth - 40) / 3),
    moreComment: false,
    showDeleteDialog: false,//展示删除
    dialogBtnActive:1,
    deleteID:0,//要删除的评论id
    commentDialogContent: '评论删除后无法恢复\n确定删除么？',
    CommentTextLength:0,//评论内容长度
    commentClickCan: true,//评论按钮是否可以点击
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.newId) {
      this.setData({
        newId: options.newId
      })
    }
    // 获取详情
    this.getNewsDetail();
    // 获取评论列表
    this.getCommentInfo(this.data.page, false);
  },
  refreshFirst() {
    // 获取详情
    this.getNewsDetail();
  },
  // 详情
  getNewsDetail() {
    var that = this;
    request({
      url: API.newsInfo,
      data: {
        "id": that.data.newId
      },
      success: function(res) {
        that.setData({
          newsDetailInfo: res
        })
      }
    })
  },
  // 评论列表
  getCommentInfo(page, nullCommentToast) {
    var that = this;
    request({
      url: API.newsComment,
      data: {
        "id": that.data.newId,
        "page": page
      },
      start() {},
      success: function(res) {
        // console.log(res)
        if (res.data.length == 0) {
          if (nullCommentToast) {
            wx.showToast({
              title: '暂无更多',
              icon: 'none',
              duration: 800
            })
          }
          totalComment = that.data.reviewArr
        } else {
          totalComment = that.data.reviewArr.concat(res.data)
        }
        that.setData({
          reviewArr: totalComment,
          commentCount: res.count
        })
      }
    })
  },
  // 评论列表加载更多
  loadMore(e) {
    var that = this;
    util.showBusy("玩命加载中")
    that.setData({
      page: that.data.page + 1
    })
    // 获取评论列表
    that.getCommentInfo(that.data.page, true);
  },

  // 点击评论
  goReview(e) {
    this.setData({
      reviewDialogShow: true,
      commentClickCan:true,
      uploadImgArr: []
    })
  },
  // 关闭评论
  hiddenReviewDialog(e) {
    this.setData({
      reviewDialogShow: false,
      uploadImgArr: [],
      showUploadImgArr:[],
      commentText:'',
      commentClickCan:true
    })
    uploadImgArr=[];
    showUploadImgArr=[];

  },
  // 获取评论内容
  getCommentText(e) {
    this.setData({
      commentText: e.detail.value,
      CommentTextLength: e.detail.value.length
    })
  },
  // 评论图片
  uploadCommentImg(e) {
    var tempFilePath;
    var that = this;
    if (uploadImgArr.length > 2) {
      wx.showToast({
        title: '最多上传三张图片',
        icon: 'none',
        duration: 700
      })
    } else {
      wx.chooseImage({
        count: 3,
        sizeType: ['original', 'compressed'],
        success: function(res) {
          // console.log(res)
          // tempFilePath = res.tempFilePaths;
          res.tempFiles.forEach(function(img,i){
            // console.log(img.size)
            if (res.tempFiles[i].size <= 5 * 1024 * 1024){
              showUploadImgArr.push(res.tempFilePaths[i])
            }else{
              wx.showToast({
                title: '只能上传5M以内的图片',
                icon:'none',
                duration:800,
              })
            }
            that.setData({
              showUploadImgArr: showUploadImgArr
            })
            // console.log(that.data.showUploadImgArr)
          })
        },
      })
    }
  },
  // 上传图片
  uploadImg(arr, dir) {
    var that = this;
    console.log(arr)
    let promiseList = arr.map((item) => {
      return new Promise((resolve, reject) => {
        upload({
          dir: dir,
          filepath: item,
          success(res) {
            resolve(res)
          },
          fail(res) {
            reject(res)
          }
        })
      });
    });
    // 使用Primise.all来执行promiseList
    const result = Promise.all(promiseList).then((res) => {
      console.log(res)
      res.forEach(function(img, i) {
        uploadImgArr.push(img.data)
      })
      that.setData({
        uploadImgArr: uploadImgArr
      })
      
      request({
        url: API.addNewsComment,
        data: {
          "id": that.data.newId,
          "comment": that.data.commentText,
          "img": that.data.uploadImgArr
        },
        start(){},
        success: function(res) {
          // console.log(res)
          that.setData({
            reviewDialogShow: false,
            commentText: "",
            uploadImgArr: [],
            showUploadImgArr:[],
          })
          uploadImgArr=[],
          showUploadImgArr=[]
          // 获取评论列表
          that.setData({
            reviewArr: [],
            page: 1
          })
          that.getCommentInfo(that.data.page);
        }
      })

    }).catch((error) => {
      console.log(error);
    });
  },
  // 删除评论图片
  deleteImg(e) {
    var imgindex = e.currentTarget.dataset.imgindex;

    showUploadImgArr.splice(imgindex, 1)
    this.setData({
      showUploadImgArr: showUploadImgArr
    })
  },
  // 发表评论
  publishClick: util.throttle(function (e)  {
    var that = this;
    // 我想要上传图片和敏感词过滤执行完，在执行下面的添加评论
    if (that.data.commentClickCan){
      util.showBusy("发表中..")
      // 添加评论
      if (that.data.commentText) {
        that.setData({
          commentClickCan: false
        })
        if (that.data.uploadImgArr.length < 4) {
          // console.log(that.data.uploadImgArr)
          // 敏感词过滤
          util.sensitiveWordsFun(that.data.commentText).then(res => {
            if (res) {
              util.showFail("您输入的内容有敏感词，请重新输入")
            } else {
              // 上传图片
              that.uploadImg(that.data.showUploadImgArr, 'commentImg');
              // console.log("上传结束")
            }
          })
        } else {
          wx.showToast({
            title: '只能上传3张，您已选择' + that.data.uploadImgArr.length + '张,删除试试吧!',
            icon: 'none',
            duration: 800
          })
        }
      } else {
        wx.showToast({
          title: '请输入评论内容',
          icon: 'none',
          duration: 700
        })
      }
    }else{

    }
    

  }),
  // 给评论点赞
  commentLikeClick(e) {
    var cid = e.currentTarget.dataset.cid;
    var that = this;
    var reviewArr = that.data.reviewArr;
    request({
      url: API.addCommentGood,
      data: {
        "cid": cid,
        "newsid": that.data.newId
      },
      start() {},
      success: function(res) {
        // console.log(res)
        reviewArr.forEach(function(review, i) {
          if (review.id == cid) {
            if (review.good_st == 0) {
              review.good_st = 1;
              review.good++;
            } else {
              review.good_st = 0
              review.good--;
            }
          }
        })
        that.setData({
          reviewArr: reviewArr
        })
      }
    })
  },
  // 消息点赞
  newsLikeClick(e) {
    var that = this;
    request({
      url: API.addNewsDood,
      data: {
        "id": that.data.newId,
        "type": that.data.newsDetailInfo.good_st
      },
      start: function() {},
      success: function(res) {
        // 获取详情
        that.getNewsDetail();
      }
    })
  },
  //评论长按
  commentLongTouch(e){
    if(app.globalData.userInfo!==null){
      let item = e.currentTarget.dataset.content
      if (app.globalData.userInfo.openid === item.uid){
        // 记得这要改为app.globalData.userInfo.vip>4
        if (app.globalData.userInfo.vip==1) {
          //可以删除  
          this.setData({
            showDeleteDialog: true,
            commentDelete: true,
            deleteID: item.id
          })
        } else {
          wx.showToast({
            title: 'vip等级达到4才可以删除评论哦！',
            icon: 'none',
            duration: 800
          })
        }
      }else{
        this.reportComment(e)
      }
    }
  },
  //举报
  reportComment(e) {
    const id = e.currentTarget.dataset.content.id
    util.showModel("提示", "确认举报该评论么？恶意举报将有严重惩罚哦~", (res) => {
      if (res.confirm) {
        request({
          url: API.report,
          data: {
            type: 3,
            id: id
          },
          start() {},
          success(res) {
            util.showSuccess("举报成功")
          }
        })
      }
    }, true)
  },
  //点击删除
  onClickDeleteOp(e){
    // console.log(e)
    let type = e.currentTarget.dataset.type;
    var that=this;
    if (type) {
      //!-------------进行删除操作
      request({
        url: API.delComment,
        data: {
          "c_id": that.data.deleteID
        },
        success: function(res) {
          // console.log(res)
          that.data.reviewArr.forEach(function(comment,i){
            if (that.data.deleteID == comment.id){
              that.data.reviewArr.splice(i,1)
              that.data.commentCount--;
            }
          })
          that.setData({
            reviewArr: that.data.reviewArr,
            commentCount: that.data.commentCount
          })
          wx.showToast({
            title: '删除成功',
            icon:'none',
            duration:800
          })
        },
      })
    }
    that.setData({
      showDeleteDialog: false,
      commentDelete: false,
    }) 
  },
  // 打开或关闭操作窗
  openOp(e) {
    // console.log(e)
    let data;
    if (e.type === "tap") {
      data = e.currentTarget.dataset.content
    } else {
      data = e.detail.open;
    }
    let item = this.data.currentOpItem;
    if (data) {
      item = e.detail.item;
    }
    this.setData({
      showOp: data,
      currentOpItem: item !== undefined ? item : {}
    })
  },
  //预览图片
  showPreviewImage(e) {
    console.log(e)
    let index = e.currentTarget.dataset.index;
    let images = e.currentTarget.dataset.images
    util.previewImage(images, index)
  },
  // 评论图片加载
  commentImgLoad(e){
    // console.log(e)
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
    const pages = getCurrentPages();
    let page = pages[pages.length - 2];
    let pageName = page.route.slice(page.route.lastIndexOf("/") + 1)
    let polarisItem = this.data.newsDetailInfo
    polarisItem.comment = this.data.commentCount
    if (pageName === "fanscircle") {
      var polarisItemInfo = page.data.polarisItemInfo;
      for (let i in polarisItemInfo[0]) {
        if (polarisItemInfo[0][i].id == polarisItem.id) {
          polarisItemInfo[0][i] = polarisItem
          break
        }
        if (i === polarisItemInfo[0].length - 1) {
          for (let i in polarisItemInfo[1]) {
            if (polarisItemInfo[1][i].id == polarisItem.id) {
              polarisItemInfo[1][i] = polarisItem
              break
            }
          }
        }
      }
      page.setData({
        polarisItemInfo: polarisItemInfo
      })
    } else {
      var polarisItemInfo = page.data.polarisItemInfo;
      for (let i in polarisItemInfo) {
        if (polarisItemInfo[i].id == polarisItem.id) {
          polarisItemInfo[i] = polarisItem
          break
        }
      }
      page.setData({
        polarisItemInfo: polarisItemInfo
      })
    }
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
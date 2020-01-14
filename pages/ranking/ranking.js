const util = require("../../utils/util.js")
import API from "../../common/API.js"
import request from "../../common/HttpService.js"
const app = getApp();
var monthTotalArr = [];
var TotalArr = [];
var swiperHeights = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topThreeInfo:[],//前三名总榜
    topThreeMonthInfo: [],//前三名月榜
    rankingList:[],//
    monthR:'',
    monthCL: '',
    totalR:'',
    totaCL: '',
    screenWidth: app.globalData.systemInfo.screenWidth,
    monthtop:true,//切换月榜和总榜
    topThreeItemWidth: parseInt(app.globalData.systemInfo.screenWidth/3),
    topThreeItemPaddingLeft: app.globalData.systemInfo.screenWidth - parseInt(app.globalData.systemInfo.screenWidth / 3)*3,
    swiperCurrentIndex:0,
    page:1,
    swiperHeights: [], //swiper每列的高度,
    swiperNullHeight: app.globalData.systemInfo.screenHeight-450,
    myTotalRank:0,
    myMonthRank:0,
    myRank:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 总榜和月榜的数据
    this.getCreditMonthRank(this.data.page)//, this.data.monthR, this.data.monthCL
    this.getCreditRank(this.data.page)//, this.data.totalR, this.data.totaCL
  },
  getCreditMonthRank(page, r, cl) {
    var that = this;
    var rankingList = that.data.rankingList;
    var topThreeMonthInfo=[];
    var otherlist=[];
    // 月榜
    request({
      url: API.creditMonthRank,
      data: {
        "page": page,
        // "r": "",
        // "cl": ""
      },
      start() { },
      success: function (res) {
        console.log(res)
        if (res.list.data.length != 0) {
          // 找出前三名
          if (that.data.page == 1) {
            res.list.data.forEach(function (list, i) {
              if (i < 3) {
                if (i == 0) {
                  res.list.data[i].bgwidth = 210
                  res.list.data[i].bgheight = 260
                  res.list.data[i].imgwidth = 200
                  res.list.data[i].imgheight = 250
                } else {
                  res.list.data[i].bgwidth = 180
                  res.list.data[i].bgheight = 230
                  res.list.data[i].imgwidth = 170
                  res.list.data[i].imgheight = 220
                }
                topThreeMonthInfo.push(res.list.data[i]);
                that.setData({
                  topThreeMonthInfo: topThreeMonthInfo
                })
                wx.setStorage({
                  key: 'topThreeMonthInfo',
                  data: topThreeMonthInfo,
                })
              }else{
                otherlist.push(res.list.data[i])
              }
            })
          }
          monthTotalArr = monthTotalArr.concat(otherlist)
          rankingList[0] = monthTotalArr;
        } else {
          wx.showToast({
            title: '暂无更多数据',
            icon: 'none',
            duration: 700
          })
          monthTotalArr = monthTotalArr
          rankingList[0] = monthTotalArr;
        }
        swiperHeights[0] = monthTotalArr.length * 150
        that.setData({
          rankingList: rankingList,
          swiperHeights: swiperHeights,
          // monthR: res.list.r,
          // monthCL: res.list.cl,
          myMonthRank: res.rank,
          myRank:res.rank
        })
        // console.log(that.data.swiperHeights)
      },
      complete() {
        wx.stopPullDownRefresh()
      }
    })
  },
  getCreditRank(page,r,cl){
    var that = this;
    var rankingList = that.data.rankingList;
    var topThreeInfo=[];
    var otherlist = [];
    // 总榜
    request({
      url: API.creditRank,
      data: {
        "page":page,
        // "r":r,
        // "cl":cl
      },
      success: function (res) {
        if (res.list.data.length!=0){
          // 找出前三名
          if(that.data.page==1){
            res.list.data.forEach(function (list, i) {
              if (i < 3) {
                if (i == 0) {
                  res.list.data[i].bgwidth = 210
                  res.list.data[i].bgheight = 260
                  res.list.data[i].imgwidth = 200
                  res.list.data[i].imgheight = 250
                } else {
                  res.list.data[i].bgwidth = 180
                  res.list.data[i].bgheight = 230
                  res.list.data[i].imgwidth = 170
                  res.list.data[i].imgheight = 220
                }
                topThreeInfo.push(res.list.data[i]);
                that.setData({
                  topThreeInfo: topThreeInfo
                })
                wx.setStorage({
                  key: 'topThreeInfo',
                  data: topThreeInfo,
                })
              } else {
                otherlist.push(res.list.data[i])
              }
            })
          }
          TotalArr = TotalArr.concat(otherlist);
          rankingList[1]=TotalArr;
        }else{
          wx.showToast({
            title: '暂无更多数据',
            icon:'none',
            duration:700
          })
          wx.getStorage({
            key: 'topThreeInfo',
            success: function (res) {
              topThreeInfo = res.data;
              that.setData({
                topThreeInfo:topThreeInfo
              })
            },
          })
          TotalArr = TotalArr
          rankingList[1] = TotalArr;
        }
        swiperHeights[1]=TotalArr.length * 150
        that.setData({
          rankingList: rankingList,
          swiperHeights: swiperHeights,
          // totalR: res.list.r,
          // totaCL: res.list.cl,
          myTotalRank:res.rank
        })
        // console.log(that.data.swiperHeights)
      },
      complete(){
        wx.stopPullDownRefresh()
      }
    })
    
  },
  // 选择排行榜
  selectTopList(e){
    var topType = e.currentTarget.dataset.toptype;
    console.log(topType)
    if (topType=='月榜'){
      this.setData({
        monthtop:true,
        swiperCurrentIndex:0,
        page:1,
        myRank: this.data.myMonthRank
      })
    }else{
      this.setData({
        monthtop: false,
        swiperCurrentIndex:1,
        page: 1,
        myRank: this.data.myTotalRank
      })
    }
  },
  // 轮播图index值
  swiperIndex(e){
    // console.log(e.detail.current)
    var swiperCurrentIndex = e.detail.current;
    if (swiperCurrentIndex==1){
      this.setData({
        monthtop: false,
        swiperCurrentIndex: swiperCurrentIndex
      })
    }else{
      this.setData({
        monthtop: true,
        swiperCurrentIndex: swiperCurrentIndex
      })
    }
  },
  // 触摸昵称显示全
  showTotal(e){
    var content = e.currentTarget.dataset.content;
    // console.log(e)
    wx.showToast({
      title: content,
      icon:'none',
      duration:800
    })
  },
  // 去個人主頁
  goPerson(e){
    var uid = e.currentTarget.dataset.uid;
    wx.navigateTo({
      url: '../mine_home/mine_home?uid=' + uid,
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
    monthTotalArr = [];
    TotalArr = []
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 总榜和月榜的数据
    this.getCreditMonthRank(this.data.page)//, this.data.monthR, this.data.monthCL
    this.getCreditRank(this.data.page)//, this.data.totalR, this.data.totaCL
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that=this;
    that.setData({
      page: that.data.page + 1
    })
    if (that.data.monthtop && monthTotalArr.length!=0){
      util.showBusy("玩命加载中")
      this.getCreditMonthRank(this.data.page)//, this.data.monthR, this.data.monthCL
    } else if (!that.data.monthtop && TotalArr.length != 0){
      util.showBusy("玩命加载中")
      this.getCreditRank(this.data.page)//, this.data.totalR, this.data.totaCL
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
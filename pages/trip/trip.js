// pages/trip/trip.js
const app=getApp();
const util = require("../../utils/util.js")
import API from "../../common/API.js"
import request from "../../common/HttpService.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperInfo: app.globalData.swiperInfo,
    current_scroll: 'tab1',
    tabArr:[],
    tabIndex:0,//tab当前值
    currentSwiper:0,//swiper当前
    swiperHeights: [], //swiper每列的高度,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getScheduleList()
  },
  // 行程时间列表
  getScheduleList(){
    var that=this;
    var dateObj={};
    var tabArr=[];
    var swiperHeights=[]
    request({
      url: API.scheduleList,
      start() { },
      success: function (res) {
        // console.log(res)
        res.date.forEach(function(date,i){
          var dateObj = {};
          dateObj.key = 'tab' + (i + 1) * 1;
          dateObj.tripDate = date;
          dateObj.tripInfo = [];
          swiperHeights.push(0)
          if(date == res.month){
            // 107是tab-content-item的高，60是margin和padding的和
            dateObj.tripInfo= res.schedule
            swiperHeights[i] = dateObj.tripInfo.length *(107+60);
            that.setData({
              tabIndex:i,
              currentSwiper:i,
              swiperHeights: swiperHeights
            })
          }
          tabArr.push(dateObj)
        })
        that.setData({
          tabArr: tabArr
        })
        // console.log(that.data.tabArr)
      }
    })
  },
  // 根据日期查询
  getTripList(month){
    var that = this;
    var tabArr = that.data.tabArr;
    var swiperHeights = that.data.swiperHeights;
    // console.log(month)
    request({
      url: API.scheduleMonth,
      data:{
        month: month
      },
      start() { },
      success: function (res) {
        // console.log(res)
        if(res.length!=0){
          res.forEach(function (date, i) {
            tabArr.forEach(function (tab, j) {
              if (month == tab.tripDate) {
                tabArr[j].tripInfo = res;
                // 107是tab-content-item的高，60是margin和padding的和
                swiperHeights[j] = tab.tripInfo.length * (107 + 60);
              }
            })
          })
          that.setData({
            tabArr: tabArr,
            swiperHeights: swiperHeights
          })
        }
        // console.log(that.data.tabArr)
      }
    })
  },
  // 切换月份
  tabChange(e) {
    // console.log(e)
    var tripDate = e.currentTarget.dataset.month;
    var tabIndex = e.currentTarget.dataset.tabindex;
    this.getTripList(tripDate)
    if (tabIndex!= this.data.currentSwiper) {
      this.getTripList(tripDate)
      this.setData({
        tabIndex: tabIndex,
        currentSwiper: tabIndex
      });
    }
  },  
  // 切换轮播图
  onSlideChangeEnd(e){
    // console.log(e)
    var that = this;
    var tabArr = that.data.tabArr;
    
    if (e.detail.current!= that.data.currentSwiper){
      that.getTripList(tabArr[e.detail.current].tripDate)
      that.setData({
        currentSwiper: e.detail.current,
        tabIndex: e.detail.current
      })
    }
    
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let me = this;
    let swiperHeights = []
    // util.get_wxml(`.tab-content-item`, (rects) => {
    //   for (let i = 0; i < rects.length; i++) {
    //     swiperHeights.push(rects[i].height)
    //   }
    //   me.setData({
    //     swiperHeights: swiperHeights
    //   })
    //   console.log(this.data.swiperHeights)
    //   // 就是循环相加每个列表的高度，然后赋值给swiper_height,便可以求出当前tab栏的高度，赋值给swiper 便可以swiper高度自适应
    // })
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
    console.log(1)
    this.getScheduleList()
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
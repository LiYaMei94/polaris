const app = getApp();
const util = require("../../utils/util.js");
import API from "../../common/API.js"
import request from "../../common/HttpService.js"
const blank_space_reg = /\s+/g;//去除空白正则
const phoneReg = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/;//手机号正则
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address_detail:{
      id:'',
      name: '',
      phone: '',
      province: '',
      city: '',
      region: '',
      detail: '',
      regionInfo:'',
      regionArr:[]
    },
    id:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id){
      //编辑
      this.setData({
        id: options.id
      })
      this.get_address_detail(this.data.id)
    }
  },
  // 获取地址详情、
  get_address_detail(){
    const that=this;
    request({
      url: API.addressInfo,
      data:{
        id: that.data.id
      },
      start() {
        util.showBusy("加载中...")
      },
      success(res){
        // console.log(res)
        res.regionInfo = res.province + ' ' + res.city + ' '+ res.region
        res.regionArr = [res.province,res.city,res.region]
        that.setData({
          address_detail:res
        })
      }
    })
  },
  // 姓名
  consignee_name(e){
    const value = e.detail.value.replace(blank_space_reg,'');
    this.data.address_detail.name=value;
    this.setData({
      address_detail: this.data.address_detail
    })
  },
   // 手机号
  telephone(e){
    const value = e.detail.value;
    let phone = value.replace(blank_space_reg, '');
    this.data.address_detail.phone = phone;
    this.setData({
      address_detail: this.data.address_detail
    })
  },
 
  // 地区
  clickAddressDialog(e){
    // console.log(e.detail.value)
    const value = e.detail.value;
    let address_detail = this.data.address_detail;
    address_detail.province = value[0];
    address_detail.city = value[1];
    address_detail.region = value[2];
    address_detail.regionInfo = value[0] + ' ' + value[1] + ' ' + value[2];
   address_detail.regionArr = [value[0],value[1],value[2]]
    this.setData({
      address_detail: address_detail
    })
  },
  // 地址
  address_detail(e){
    const value = e.detail.value.replace(blank_space_reg, '');
    this.data.address_detail.detail = value;
    this.setData({
      address_detail: this.data.address_detail
    })
  },
  // 保存地址
  saveAddress(e){
    const that=this;
    let address_detail = that.data.address_detail;
    if (address_detail.name!=''){
      if (address_detail.phone!=''){
        if (phoneReg.test(address_detail.phone)) {
          if (address_detail.province!=''){
            if (address_detail.detail!=''){
              request({
                url: API.addressEdit,
                data: address_detail,
                start() {
                  util.showBusy("保存中...")
                },
                success(res){
                  // console.log(res)
                  let pages=getCurrentPages();
                  if (res) {
                    address_detail.detail = address_detail.province + address_detail.city + address_detail.region + address_detail.detail;
                    wx.setStorageSync('default_address', address_detail)
                    pages.forEach(function (page, i) {
                      if (page.route == "pages/mall_address_list/mall_address_list") {
                        pages[i].getAddress()
                      }
                    })
                    util.showFail("保存成功")
                    wx.navigateBack()
                  }
                },
              })
            }else{
              util.showFail("请输入详细地址",800)
            }
          }else{
            util.showFail("请选择地区", 800)
          }
        } else {
          util.showFail("手机号码格式不正确", 800)
        }
      }else{
        util.showFail("请输入手机号码", 800)
      }
    }else{
      util.showFail("请输入收件人", 800)
    }
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

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

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
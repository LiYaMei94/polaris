const app = getApp();
const util = require("../../../utils/util.js");
import API from "../../../common/API.js"
import request from "../../../common/HttpService.js"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    address:{
      type:Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    radioChange(e) {
      console.log(e)
      const value=e.detail.value;
      const address = this.data.address;
      address.forEach(function(list,i){
        if (list.id == value){
          wx.setStorageSync('default_address', address[i])
        }
      })
    },
    deleteAddress(e){
      const that = this;
      const id = e.currentTarget.dataset.id;
      console.log(id)
      let pages = getCurrentPages();
      request({
        url: API.addressDel,
        data: {
          id: id
        },
        start() {
          util.showBusy("删除中..")
        },
        success(res) {
          console.log(res)
          if(res){
            util.showFail("删除成功")
            pages.forEach(function (page, i) {
              if (page.route == "pages/mall_address_list/mall_address_list") {
                pages[i].getAddress()
              }
            })
          }
        }
      })
      // this.triggerEvent('countChange', changeInfo)
    }
  }
})

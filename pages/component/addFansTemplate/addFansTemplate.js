// pages/component/addFansTemplate/addFansTemplate.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    addFansShow: {
      type: Boolean,
      value: false
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  onLoad(){
    console.log(this.data.addFansShow)
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 关闭加入粉丝群弹窗
    closeAddFans() {
      this.setData({
        addFansShow: false
      })
    },
    // 复制群信息
    copyMasterInfo(e) {
      var that = this;
      wx.setClipboardData({
        data: e.currentTarget.dataset.mastername,
        success(res) {
          
        },
        complete(res) {
          wx.showToast({
            title: '复制成功',
            icon: 'none',
            duration: 800
          })
          setTimeout(function () {
            that.setData({
              addFansShow: false
            })
          }, 800)
        }
        
      })
    },
  }
})

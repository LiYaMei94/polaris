const windowWidth = wx.getSystemInfoSync().windowHeight;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    is_exchange:{
      type:Boolean,
      value:false
    },
    productDetail:{
      type:Object,
      value:{}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    windowWidth: windowWidth
  },
  /**
   * 组件的方法列表
   */
  methods: {
    hidden_exchange(e) {
      // console.log(e)
      const type = e.currentTarget.dataset.type;
      const value={};
      value.status = false;
      value.type = type
      this.triggerEvent('hiddendialog', value)
    },
  }
})

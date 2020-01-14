// pages/component/count-wrap/count-wrap.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    count:{
      type:Number,
      value:1
    },
    is_minu_disable:{
      type:Boolean,
      value:false
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
    countMinus(e){
      let count = this.data.count;
      let is_minu_disable = this.data.is_minu_disable;
      let changeInfo={};
      if (this.data.count>2){
        // 可以减少
        count = count-1;
        is_minu_disable=true
      }else{
        is_minu_disable=false
        count=1;
      }
      changeInfo = { count: count, is_minu_disable: is_minu_disable}
      this.triggerEvent('countChange', changeInfo)
    },
    countAdd(e){
      let count = this.data.count;
      let changeInfo = {};
      count++;
      changeInfo = { count: count, is_minu_disable: true }
      this.triggerEvent('countChange', changeInfo)
    }
  }
})

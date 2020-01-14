// pages/component/order-record-item/order-record-item.js
const _windowWidth = wx.getSystemInfoSync().windowWidth // (px)
Component({
  options: {
    multipleSlots: true,//允许多个slot
  },
  /**
   * 组件的属性列表
   */
  properties: {
    //		几个操作按钮
    btnCount: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    btnWidth: 0,
    startX: 0,
    txtStyle: ''
  },

  /**
   * 组件的方法列表
   */
  ready() {
    this.updateRight()
  },
  methods: {
    updateRight() {
      // 获取右侧滑动显示区域的宽度
      const that = this
      const query = wx.createSelectorQuery().in(this)
      query.select('.right').boundingClientRect(function (res) {
        that.setData({
          btnWidth: res.width / 2,    //每个按钮的宽，单位px
        })
      }).exec()
    },
    onTouchStart(e) {
      //			console.log(e)
      if (e.touches.length == 1) {
        this.setData({
          //设置触摸起始点水平方向位置
          startX: e.touches[0].clientX
        });
      }
    },
    onTouchMove(e) {
      //			console.log(e)
      if (e.touches.length == 1) {
        //手指移动时水平方向位置
        let moveX = e.touches[0].clientX;
        //手指起始点位置与移动期间的差值
        let disX = this.data.startX - moveX;
        let btnWidth = this.data.btnWidth;
        let txtStyle = ''
        if (disX == 0 || disX < 0) {
          //右滑
          txtStyle = '0px'
        } else if (disX > 0) {
          //左滑
          txtStyle = 'margin-left:' + -disX + "px"
        }
        if (disX >= btnWidth * 2) {
          //滑动距离不能超出
          txtStyle = 'margin-left:' + -btnWidth * 2 + 'px'
        }
        this.setData({
          txtStyle: txtStyle
        })
      }
    },
    onTouchEnd(e) {
      //			console.log(e);
      if (e.touches.length == 1) {
        //手指移动时水平方向位置
        let moveX = e.touches[0].clientX;
        //手指起始点位置与移动期间的差值
        let disX = this.data.startX - moveX;
        let btnWidth = this.data.btnWidth;
        //如果距离小于删除按钮的1/2，不显示删除按钮
        let txtStyle = disX > btnWidth / 2 ? "margin-left:-" + btnWidth + "px" : "margin-left:0px";
        this.setData({
          txtStyle: txtStyle
        })
      }
    },
  }
})

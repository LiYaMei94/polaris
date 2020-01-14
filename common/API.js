const API = new function() {
  const baseUrl = "http://172.16.255.34:9110/polestar"
  // const baseUrl = "https://www.llczc.com/polestar"
  return {
    base: `${baseUrl}`,
    //鉴权
    auth: `${baseUrl}/signature`,
    //登录
    login: `${baseUrl}/login`,
    //完善资料
    completeInfo: `${baseUrl}/information`,
    // 官方消息列表
    officialNews: `${baseUrl}/get-official-news`,
    // 粉丝墙列表
    personalNews: `${baseUrl}/get-personal-news`,
    //我的发布列表
    userNews: `${baseUrl}/get-user-news`,
    // 投稿
    submitNews: `${baseUrl}/submit-news`,
    // banner
    banner: `${baseUrl}/get-banner`,
    // 消息详情
    newsInfo: `${baseUrl}/get-news-info`,
    // 消息评论列表
    newsComment: `${baseUrl}/get-news-comment`,
    // 发表评论
    addNewsComment: `${baseUrl}/add-news-comment`,
    // 评论点赞
    addCommentGood: `${baseUrl}/add-comment-good`,
    // 评论删除
    delComment: `${baseUrl}/del-comment`,
    // 消息点赞
    addNewsDood: `${baseUrl}/add-news-good`,
    //活动详情
    getActivity: `${baseUrl}/get-activity`,
    //应援任务列表
    taskList: `${baseUrl}/task-list`,
    //应援任务列表详情
    taskInfo: `${baseUrl}/task-info`,
    //我的
    mine: `${baseUrl}/mine`,
    //应援签到
    finishTask: `${baseUrl}/finish-task`,
    //应援上传
    uploadAudit: `${baseUrl}/upload-audit`,
    //积分总排行
    creditRank: `${baseUrl}/credit-rank`,
    //积分月排行
    creditMonthRank: `${baseUrl}/credit-month-rank`,
    //行程列表
    scheduleList: `${baseUrl}/get-schedule-list`,
    //行程月份列表
    scheduleMonth: `${baseUrl}/get-schedule-month`,
    //行程详情
    scheduleInfo: `${baseUrl}/get-schedule-info`,
    // 收藏列表
    getFavoriteNews: `${baseUrl}/get-favorite-news`,
    //添加收藏
    addFavoriteNews: `${baseUrl}/add-favorite-news`,
    //取消收藏
    delFavoriteNews: `${baseUrl}/del-favorite-news`,
    //签到日历
    calendar: `${baseUrl}/calendar`,
    //获取个人主页的
    info: `${baseUrl}/info`,
    //删除发布的动态
    delNews: `${baseUrl}/del-news`,
    //我的活动（消息）
    message:`${baseUrl}/message`,
    //举报
    report: `${baseUrl}/report`,
    //补签
    check_in: `${baseUrl}/check-in`,
    //webView
    webView: `${baseUrl}/wap/introductionPolaris.html`,
    // 商品列表
    goodsList: `${baseUrl}/goods-list`,
    // 商品详情
    goodsInfo: `${baseUrl}/goods-info`,
    // 地址列表
    addressList: `${baseUrl}/address-list`,
    // 地址详情
    addressInfo: `${baseUrl}/address-info`,
    // 新增编辑地址
    addressEdit:`${baseUrl}/address-edit`,
    // 删除地址
    addressDel:`${baseUrl}/address-del`,
    // 购买商品
    order: `${baseUrl}/order`,
    // 订单列表
    orderList: `${baseUrl}/order-list`,
    // 删除订单
    delOrder:`${baseUrl}/del-order`,
  }
}

export default API
export const HEADER = {
  'Content-Type': 'application/json'
  // 'Content-Type': 'application/x-www-form-urlencoded'
}
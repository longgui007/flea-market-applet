const app = getApp()
const api = require("../../api/api")
const cache = require("../../cache/cache")
const MAX_COMMODITY_LIMIT_SIZE = 10
let res = {}
let params = {}
let uid = 0
let cid = -1
let start = 0
let categories = [{
  name: "全部",
  cid: -1
}]
let currCategory = ""

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLoginPopup: false,
    pageIndex: 0,
    searchInput:"",
    universityName: "",
    commodityList: [],
    categoryName: [],
    start: 0,
    isLoading: false,
    hasMore: true,
    TabCur: 0,
    scrollLeft:0,
    cardCur: 0,
    swiperList: [{
      id: 0,
      url: 'https://636c-cloud1-2g294lom8a1e168d-1307914651.tcb.qcloud.la/swiper/tip1.png?sign=9db3cdf1a49e9fcd92b27ebb679990e6&t=1649766805'
    }, {
      id: 1,
      url: 'https://636c-cloud1-2g294lom8a1e168d-1307914651.tcb.qcloud.la/swiper/tip2.png?sign=27708a71a23cc08e65f063f39049cb3b&t=1649767828',
    }, {
      id: 2,
      url: 'https://gd3.alicdn.com/imgextra/i2/2207437126126/O1CN01o5wx8f1v7l0JFWB3R_!!2207437126126.jpg'
    }, {
      id: 3,
      url: 'https://g-search3.alicdn.com/img/bao/uploaded/i4/i2/2017427819/O1CN01iXdRTh27d9WPpEZp9_!!0-item_pic.jpg_580x580Q90.jpg_.webp'
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {

    wx.showLoading({
      title: '加载中',
    })

    // 获取我的信息和学院信息
    const registered = app.globalData.registered
    let myInfoAndMyUniversityInfo = {}
    if(registered){
      res = await cache.getMyInfoAndMyUniversityInfo()
      myInfoAndMyUniversityInfo = res.data
    }else{
      myInfoAndMyUniversityInfo = {
        "uid": parseInt(options.uid),
        "universityInfo": {
          "name": "注册后可选择相应学院"
        }
      }
    }
    
    uid = myInfoAndMyUniversityInfo.uid
    cid = -1
    
    // 获取分类信息
    categories = [{
      name: "全部",
      cid: -1
    }]
    res = await cache.getCommodityCategory()
    if(res.errno == -1){
      console.log("获取商品分类信息失败！")
      return
    }
    const commodityCategory = res.data
    // 渲染分类tab
    for(let i = 0;i < commodityCategory.length;i++){
      categories.push({
        name:commodityCategory[i].name,
        cid: commodityCategory[i].cid
      })
    }

    // 获取商品列表
    start = 0
    params = {
      uid,
      cid,
      keyword: "",
      start: start,
      count: MAX_COMMODITY_LIMIT_SIZE,
      is_mine: false
    }
    res = await cache.getCommodityListByUidAndCid(params)
    if(res.errno == -1){
      console.log("获取商品列表失败！")
      return
    }
    let commodityList = res.data
    start = commodityList.length

    let categoryInfo = categories.map(function(item){
      return {
        "name": item.name
      }
    })
    for(let i = 0;i < categoryInfo.length;i++){
      switch(categoryInfo[i].name) {
        case "全部":
           categoryInfo[i]["icon"] = "shopfill"
           categoryInfo[i]["color"] = "orange"
           break
        case "服饰":
           categoryInfo[i]["icon"] = "clothesfill"
           categoryInfo[i]["color"] = "red"
           break
        case "数码":
          categoryInfo[i]["icon"] = "mobilefill"
          categoryInfo[i]["color"] = "blue"
          break
        case "洗护/家居":
          categoryInfo[i]["icon"] = "homefill"
          categoryInfo[i]["color"] = "green"
          break
        case "书籍/学习":
          categoryInfo[i]["icon"] = "writefill"
          categoryInfo[i]["color"] = "yellow"
          break
        case "食品":
          categoryInfo[i]["icon"] = "deliver_fill"
          categoryInfo[i]["color"] = "green"
          break
        case "体育/出行":
          categoryInfo[i]["icon"] = "peoplefill"
          categoryInfo[i]["color"] = "purple"
          break
        case "虚拟产品":
          categoryInfo[i]["icon"] = "discoverfill"
          categoryInfo[i]["color"] = "black"
          break
   } 
    }

    currCategory = categoryInfo[0].name
    this.setData({
      commodityList,
      categoryInfo,
      currCategory,
      universityName: myInfoAndMyUniversityInfo.universityInfo.name
    })    
    wx.hideLoading()
  },

  async onShow(){
    
    wx.showLoading({
      title: '加载中',
    })

    // 获取我的信息和学院信息
    const registered = app.globalData.registered
    let myInfoAndMyUniversityInfo = {}
    if(registered){
      res = await cache.getMyInfoAndMyUniversityInfo()
      myInfoAndMyUniversityInfo = res.data
    }else{
      myInfoAndMyUniversityInfo = {
        "uid": parseInt(options.uid),
        "universityInfo": {
          "name": "注册后可选择对应学院"
        }
      }
    }
    
    uid = myInfoAndMyUniversityInfo.uid
    cid = -1
    
    // 获取分类信息
    categories = [{
      name: "全部",
      cid: -1
    }]
    res = await cache.getCommodityCategory()
    if(res.errno == -1){
      console.log("获取商品分类信息失败！")
      return
    }
    const commodityCategory = res.data
    // 渲染分类tab
    for(let i = 0;i < commodityCategory.length;i++){
      categories.push({
        name:commodityCategory[i].name,
        cid: commodityCategory[i].cid
      })
    }

    // 获取商品列表
    start = 0
    params = {
      uid,
      cid,
      keyword: "",
      start: start,
      count: MAX_COMMODITY_LIMIT_SIZE,
      is_mine: false
    }
    res = await cache.getCommodityListByUidAndCid(params)
    if(res.errno == -1){
      console.log("获取商品列表失败！")
      return
    }
    let commodityList = res.data
    start = commodityList.length

    let categoryInfo = categories.map(function(item){
      return {
        "name": item.name
      }
    })
    for(let i = 0;i < categoryInfo.length;i++){
      switch(categoryInfo[i].name) {
        case "全部":
           categoryInfo[i]["icon"] = "shopfill"
           categoryInfo[i]["color"] = "orange"
           break
        case "服饰":
           categoryInfo[i]["icon"] = "clothesfill"
           categoryInfo[i]["color"] = "red"
           break
        case "数码":
          categoryInfo[i]["icon"] = "mobilefill"
          categoryInfo[i]["color"] = "blue"
          break
        case "洗护/家居":
          categoryInfo[i]["icon"] = "homefill"
          categoryInfo[i]["color"] = "green"
          break
        case "书籍/学习":
          categoryInfo[i]["icon"] = "writefill"
          categoryInfo[i]["color"] = "yellow"
          break
        case "食品":
          categoryInfo[i]["icon"] = "deliver_fill"
          categoryInfo[i]["color"] = "green"
          break
        case "体育/出行":
          categoryInfo[i]["icon"] = "peoplefill"
          categoryInfo[i]["color"] = "purple"
          break
        case "虚拟产品":
          categoryInfo[i]["icon"] = "discoverfill"
          categoryInfo[i]["color"] = "black"
          break
   } 
    }

    currCategory = categoryInfo[0].name
    this.setData({
      commodityList,
      categoryInfo,
      currCategory,
      universityName: myInfoAndMyUniversityInfo.universityInfo.name
    })    
    wx.hideLoading()
  },

  // 表单
  onSearchInput(event){
    this.setData({
      searchInput: event.detail.value
    })
  },

  // 搜索
  async onSearchCommodity(event){
    const keyword = event.detail.value.replace(/\s*/g,'')
    wx.navigateTo({
      url: `../commodity_search/commodity_search?keyword=${keyword}`,
    })
  },

  // 标签页，切换分类
  async tabSelect(e) {
    wx.showLoading({
      title: '加载中',
    })
    const idx = e.currentTarget.dataset.id
    currCategory = this.data.categoryInfo[idx].name,
    this.setData({
      // TabCur: e.currentTarget.dataset.id,
      // scrollLeft: (e.currentTarget.dataset.id-1)*60,
      commodityList: [],
      currCategory,
    })
    cid = categories[idx].cid
    start = 0

    // 获取商品列表
    params = {
      uid,
      cid,
      keyword: "",
      start: start,
      count: MAX_COMMODITY_LIMIT_SIZE,
      is_mine: false
    }
    res = await cache.getCommodityListByUidAndCid(params)
    if(res.errno == -1){
      console.log("获取商品列表失败！")
      return
    }
    const commodityList = res.data
    start = commodityList.length
    this.setData({
      commodityList,
      hasMore: true,
      isLoading: false
    })    
    wx.hideLoading()
  },

  // 轮播图相关 cardSwiper
  // cardSwiper(e) {
  //   this.setData({
  //     cardCur: e.detail.current
  //   })
  // },

  // 刷新商品列表
  async onPullDownRefresh() {

    wx.showLoading({
      title: '加载中',
    })

    params = {
      uid,
      cid,
      keyword: "",
      start: 0,
      count: MAX_COMMODITY_LIMIT_SIZE,
      is_mine: false
    }
    res = await api.getCommodityListByUidAndCid(params)
    if(res.errno == -1){
      console.log("刷新商品列表失败！")
      return
    }
    const commodityList = res.data
    start = commodityList.length

    params = {
      cid,
      commodityList
    }
    res = await cache.setCommodityListByCid(params)
    if(res.errno == -1){
      console.log("新数据写入缓存失败")
      return
    }
    this.setData({
      commodityList,
      hasMore: true,
      isLoading: false
    })  
    wx.hideLoading()
  },

  // 到底加载更多数据
  async onReachBottom() {

    if(!this.data.hasMore){
      return
    }
    this.setData({
      isLoading: true
    })

    params = {
      uid,
      cid,
      keyword: "",
      start: start,
      count: MAX_COMMODITY_LIMIT_SIZE,
      is_mine: false
    }
    res = await api.getCommodityListByUidAndCid(params)
    if(res.errno == -1){
      console.log("加载更多商品列表失败！")
      return
    }
    const moreCommodityList = res.data
    if(moreCommodityList.length == 0){
      console.log("没有更多数据了！")
      this.setData({
        isLoading:false,
        hasMore: false
      })
      return
    }
    start += moreCommodityList.length
    const newCommodityList = this.data.commodityList.concat(moreCommodityList)
    params = {
      cid,
      commodityList: newCommodityList
    }
    res = await cache.setCommodityListByCid(params)
    if(res.errno == -1){
      console.log("新数据写入缓存失败")
      return
    }
    this.setData({
      commodityList: newCommodityList
    })  

  },


  async onEnterCommodityDetail(event){
    const id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: `../commodity_detail/commodity_detail?id=${id}&enteredFrom=1`,
    })
  },


  //底部Tab相关
  async onCommodityReleaseTab(){
    const registered = app.globalData.registered
    if(registered){
      wx.navigateTo({
        url: '../commodity_release/commodity_release',
      })
    }else{
      this.setData({
        showLoginPopup: true
      })
    }
    
  },

  async onHomeTab(){
    wx.redirectTo({
      url: '../home/home',
    })
  },

  onShowLoginPopup(){
    const registered = app.globalData.registered
    if(!registered){
      this.setData({
        showLoginPopup: true
      })
    }
  },

  onCancelLoginPopup(){
    this.setData({
      showLoginPopup: false
    })
  },

    // 用户注册
    async onAuth(event){
      const userInfo = event.detail.userInfo
      console.log(userInfo)
      wx.setStorageSync('userInfo', userInfo)
      this.setData({
        showLoginPopup: false
      })
      wx.redirectTo({
        url: '../index_register/index_register',
      })
      
    },

})
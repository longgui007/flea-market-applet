// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "cloud1-2g294lom8a1e168d"
})

const TcbRouter = require('tcb-router')

const db = cloud.database()

const userCollection = db.collection('user')
const commodityCollection = db.collection('commodity')
const transactionCollection = db.collection('transaction')


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const app = new TcbRouter({
    event
  })

  // 获取此用户信息和大学信息
  app.router('getMyInfoAndMyUniversityInfo', async (ctx, next) => {
    try{
      ctx.body = await userCollection.aggregate()
      .match({
        openid: wxContext.OPENID,
        is_deleted: false
      })
      .project({
        create_time: false,
        update_time: false,
        is_deleted: false
      })
      .lookup({
        from: 'university',
        localField: 'uid',
        foreignField: 'uid',
        as: 'universityInfo'
      })
      .end()
      ctx.body.errno = 0
    }catch(e){
      ctx.body = {
        errno: -1,
      }
    }
  })

  // 获取用户信息
  app.router('getUserInfoFromDbByUserId', async (ctx, next) => {
    const {userId} = event.params
    try{
      ctx.body = await userCollection.where({
        openid: userId,
        is_deleted: false
      })
      .field({
        _id: true,
        contact_info_qq: true,
        contact_info_wx: true,
      })
      .get()
      ctx.body.errno = 0
    }catch(e){
      ctx.body = {
        errno: -1
      }
    }
   
  })

  // 添加自己的信息
  app.router('setMyInfo', async (ctx, next) => {
    try{

      res = await cloud.openapi.security.msgSecCheck({
        content: JSON.stringify(event.params)
      })


      ctx.body = await userCollection.add({
        data: {
          ...event.params,
          openid: wxContext.OPENID,
          student_auth: true,
          total_transaction: 0,
          total_release: 0,
          create_time: db.serverDate(),
          update_time: db.serverDate(),
          is_deleted: false
        }
      })
      ctx.body.errno = 0
    }catch(e){
      ctx.body = {
        errno: -1
      }
      if (e.errCode.toString() === '87014'){
        ctx.body = {
          errno: 87014
        }
     }
    }
    
  })

  // 更新自己的信息，如果变更大学则检查是否仍有未删除的商品/进行中的交易
  app.router('updateMyInfo', async (ctx, next) => {
    try{

      // 检查是否仍有未删除的商品/进行中的交易
      let new_uid = event.params.uid
      let userInfo = await userCollection.where({
        openid: wxContext.OPENID,
        is_deleted: false
      })
      .get()
      if(new_uid != userInfo.data[0].uid){
        let countResult = await commodityCollection.where({
          user_id: wxContext.OPENID,
          is_deleted: false
        }).count()
        commodityCount = countResult.total
        countResult = await transactionCollection.where({
          buyer_id: wxContext.OPENID,
          status: 0,
          is_deleted: false
        }).count()
        transactionCount = countResult.total
        countResult = await transactionCollection.where({
          seller_id: wxContext.OPENID,
          status: 0,
          is_deleted: false
        }).count()
        transactionCount += countResult.total
        if(commodityCount+transactionCount>0){
          ctx.body = {
            errno: -2,
          }
          return
        }
      }


    
      res = await cloud.openapi.security.msgSecCheck({
        content: JSON.stringify(event.params)
      })
      ctx.body = await userCollection.where({
        openid: wxContext.OPENID
      }).update({
        data: {
          ...event.params,
          update_time: db.serverDate()
        }
      })
      ctx.body.errno = 0
    }catch(e){
      ctx.body = {
        errno: -1,
      }
      if (e.errCode.toString() === '87014'){
        ctx.body = {
          errno: 87014
        }
     }
    }
    
    
  })


  // 学生身份验证, 空方法，默认返回true
  // TODO: 完善学生身份验证
  // app.router('studentIdAuth', async (ctx, next) => {
  //   ctx.body = await userCollection.where({
  //     openid: wxContext.OPENID,
  //     is_deleted: false
  //   }).get().then((res) => {
  //     return true
  //   })
  // })

  return app.serve()
}

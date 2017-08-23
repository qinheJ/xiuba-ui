/**
 * Created by ycb on 2017/7/20.
 */

/**
 * 注意：（请使用JS严格模式语法）
 */
'use strict';

const express = require('express');
const config = require('./config');
const logConfig = require('./logConfig');
const request = require('request-promise');
const querystring = require('querystring');
const captchapng = require('captchapng');
const redisClient = require("./redisServer");
const sts = require('./aliServer');

const router = express.Router();
const baseUrl = config.baseUrl;

/**
 * 订阅redis服务消息
 */
redisClient.on('ready', function (res) {
  logConfig.logger.info('redis start：redis is ready');

  //开始订阅redis消息
  redisClient.psubscribe('__keyevent@15__:expired');

  logConfig.logger.info('redis psubscribe end');

  // 监听当接收到redis订阅消息调用对应服务
  redisClient.on("pmessage", function (pattern, channel, expiredKey) {
    //此处处理当session过期时的逻辑

  });
});

redisClient.on('error', function (res) {
  logConfig.logger.info('redis start：redis is error');
});

/**
 * 获取阿里云临时token
 * @param Action
 * @param RoleArn
 * @param RoleSessionName
 */
router.get('/api/ali-token.json', (req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-METHOD', 'GET');
  res.setHeader("Content-Type", "application/json");
  sts.assumeRole({
    Action: 'AssumeRole',
    RoleArn: 'acs:ram::1787158783531067:role/aliyunosstokengeneratorrole',
    //设置Token的附加Policy，可以在获取Token时，通过额外设置一个Policy进一步减小Token的权限；
    //Policy: '{"Version":"1","Statement":[{"Effect":"Allow", "Action":"*", "Resource":"*"}]}',
    //设置Token有效期，可选参数，默认3600秒；
    //DurationSeconds: 3600,
    RoleSessionName: 'RoleSessionName'
  }, function (err, parsedBody) {
    if (err) {
      logConfig.logger.error(req.originalUrl + ':' + err);
    }
    if (parsedBody) {
      res.send(parsedBody.Credentials);
    }
    res.end();
  });
});

/**
 * 首页导航
 */
router.post('/api/task/item/catalog/main.json', (req, res, next) => {
  let options = {
    method: 'GET',
    uri: baseUrl + '/task/item/catalog/main',
    json: true,
  };
  request(options)
    .then(function (parsedBody) {
      res.send(parsedBody);
      res.end();
    })
    .catch(function (err) {
      logConfig.logger.error(req.originalUrl + ':' + err);
      res.json({status: false, msg: "服务器错误"});
      res.end();
    });
});

/**
 * 首页试用任务展示
 */
router.post('/api/task/index/newest.json', (req, res, next) => {
  let options = {
    method: 'GET',
    uri: baseUrl + '/task/index/newest',
    json: true,
  };
  request(options)
    .then(function (parsedBody) {
      res.send(parsedBody);
      res.end();
    })
    .catch(function (err) {
      logConfig.logger.error(req.originalUrl + ':' + err);
      res.json({status: false, msg: "服务器错误"});
      res.end();
    });
});

/**
 * 分类页面请求
 * @param id  大类id
 */
router.post('/api/task/get/item/catalog/parent.json', (req, res, next) => {
  let options =
    {
      method: 'GET',
      uri: baseUrl + '/task/item/catalog/parent/' + req.body.id,
      json: true,
    };
  request(options)
    .then(function (parsedBody) {
      res.send(parsedBody);
      res.end();
    })
    .catch(function (err) {
      logConfig.logger.error(req.originalUrl + ':' + err);
      res.json({status: false, msg: "服务器错误"});
      res.end();
    });
});

/**
 * 分类页面小类内容
 * @param id  大类id
 */
router.post('/api/task/item/catalog/child.json', (req, res, next) => {
  let options =
    {
      method: 'GET',
      uri: baseUrl + '/task/item/catalog/' + req.body.cate + '/child',
      json: true,
    };
  request(options)
    .then(function (parsedBody) {
      res.send(parsedBody);
      res.end();
    })
    .catch(function (err) {
      logConfig.logger.error(req.originalUrl + ':' + err);
      res.json({status: false, msg: "服务器错误"});
      res.end();
    });
});

/**
 * 分类页面任务详情请求
 *@param pageIndex: 第几页，
 *@param pageSize: 一页几个，
 *@param taskName: 搜索关键词，
 *@param taskTypes: 搜索关键词，
 *@param itemCatalogs: 分类，
 */
router.post('/api/search/task/s.json', (req, res, next) => {
  let options =
    {
      method: 'POST',
      uri: baseUrl + '/search/task/s',
      json: true,
      formData: {
        pageIndex: req.body.pageIndex,
        pageSize: req.body.pageSize,
        taskName: req.body.taskName,
        taskTypes: req.body.taskTypes,
        itemCatalogs: req.body.itemCatalogs,
        sortField: req.body.sortField,
        sortOrder: req.body.sortOrder
      },
    };
  request(options)
    .then(function (parsedBody) {
      res.send(parsedBody);
      res.end();
    })
    .catch(function (err) {
      logConfig.logger.error(req.originalUrl + ':' + err);
      res.json({status: false, msg: "服务器错误"});
      res.end();
    });
});

/**
 * 详情页请求
 * @param taskId 商品ID
 */
router.post('/api/task/get.json', (req, res, next) => {
  let options =
    {
      method: 'GET',
      uri: baseUrl + '/task/get/' + req.body.taskId,
      json: true,
    };
  request(options)
    .then(function (parsedBody) {
      res.send(parsedBody);
      res.end();
    })
    .catch(function (err) {
      logConfig.logger.error(req.originalUrl + ':' + err);
      res.json({status: false, msg: "服务器错误"});
      res.end();
    });
});

/**
 * 获取用户交易列表
 * @param pageable
 * @param userId
 * @param createTimeStart
 * @param createTimeEnd
 * @param accountChangeType
 * @param taskSerial
 */
router.post('/api/get-trad-list.json', function (req, res, next) {
  let options = {
    method: 'POST',
    uri: baseUrl + '/user/account/get-trad-list',
    formData: {
      userId: req.session.userData.id,
      createTimeStart: req.body.createTimeStart,
      createTimeEnd: req.body.createTimeEnd,
      accountChangeType: req.body.accountChangeType,
      reversePicUrl: req.body.reversePicUrl,
      taskSerial: req.body.taskSerial
    },
    json: true,
  };
  request(options).then(function (parsedBody) {
    res.send(parsedBody);
    res.end();
  }).catch(function (err) {
    logConfig.logger.error(req.originalUrl + ':' + err);
    res.json({status: false, msg: "服务器错误"});
    res.end();
  });
});

/**
 * 获取用户、账户、旺旺账号
 * @param userId
 */
router.post('/api/get-user-account.json', function (req, res, next) {
  let options = {
    method: 'POST',
    uri: baseUrl + '/user/account/get-user-account',
    formData: {
      userId: req.session.userData.id,
    },
    json: true,
  };
  request(options).then(function (parsedBody) {
    res.send(parsedBody);
    res.end();
  }).catch(function (err) {
    logConfig.logger.error(req.originalUrl + ':' + err);
    res.json({status: false, msg: "服务器错误"});
    res.end();
  });
});

/**
 * 通过上一次的密码修改支付密码
 * @param userId
 * @param oldPwd
 * @param newPwd
 * @param repwd
 */
router.post('/api/find-pwd-by-origin.json', function (req, res, next) {
  let options = {
    method: 'POST',
    uri: baseUrl + '/user/account/reset-pwd-by-originPwd',
    formData: {
      userId: req.session.userData.id,
      oldPwd: req.body.oldPwd,
      newPwd: req.body.newPwd,
      repwd: req.body.repwd
    },
    json: true,
  };
  request(options).then(function (parsedBody) {
    res.send(parsedBody);
    res.end();
  }).catch(function (err) {
    logConfig.logger.error(req.originalUrl + ':' + err);
    res.json({status: false, msg: "服务器错误"});
    res.end();
  });
});

/**
 * 实名认证提交认证
 * @param realname 姓名
 * @param idcard  身份证号
 * @param picUrl  身份证正面
 * @param reversePicUrl 身份证反面
 */
router.post('/api/user/identity/saveidentity.json', function (req, res, next) {
  let options = {
    method: 'POST',
    uri: baseUrl + '/user/identity/saveidentity',
    formData: {
      phone: req.session.userData.phone,
      userId: req.session.userData.id,
      realname: req.body.realname,
      idcard: req.body.idcard,
      picUrl: req.body.picUrl,
      reversePicUrl: req.body.reversePicUrl
    },
    json: true,
  };
  request(options).then(function (parsedBody) {
    res.send(parsedBody);
    res.end();
  }).catch(function (err) {
    logConfig.logger.error(req.originalUrl + ':' + err);
    res.json({status: false, msg: "服务器错误"});
    res.end();
  });
});

/**
 * 实名认证初始化
 * @param realName 姓名
 * @param success   成功状态
 * @param processing  审核中
 */
router.post('/api/identity-index.json', function (req, res, next) {
  let options = {
    method: 'POST',
    uri: baseUrl + '/user/identity/index',
    formData: {
      userId: req.session.userData.id
    }
  };
  request(options).then(function (parsedBody) {
    res.send(parsedBody);
    res.end();
  }).catch(function (err) {
    logConfig.logger.error(req.originalUrl + ':' + err);
    res.json({status: false, msg: "服务器错误"});
    res.end();
  });
});


/**
 * 获取商品类型
 * @param phone
 * @param smsCode
 */
router.post("/api/item-catalog.json", function (req, res, next) {
  let options = {
    method: 'GET',
    uri: baseUrl + '/task/item/catalog/all',
    json: true
  };
  request(options)
    .then(function (parsedBody) {
      res.send(parsedBody);
      res.end();
    }).catch(function (err) {
    logConfig.logger.error(req.originalUrl + ':' + err);
    res.json({status: false, msg: "服务器错误"});
    res.end();
  })
});

/**
 * 绑定旺旺号
 * @param userId
 * @param alitm_account
 * @param picUrl
 */
router.post('/api/alitm-bunding.json', function (req, res, next) {
  let options = {
    method: 'POST',
    uri: baseUrl + '/user/alitm/alitm-bunding',
    formData: {
      userId: req.session.userData.id,
      alitmAccount: req.body.alitmAccount,
      picUrl: req.body.picUrl
    },
    json: true
  };
  request(options).then(function (parsedBody) {
    res.send(parsedBody);
    res.end();
  }).catch(function (err) {
    logConfig.logger.error(req.originalUrl + ':' + err);
    res.json({status: false, msg: "服务器错误"});
    res.end();
  });
});

/**
 * 获取旺旺信息列表
 * @param userId
 */
router.post('/api/get-alitm-info-list.json', function (req, res, next) {
  let options = {
    method: 'POST',
    uri: baseUrl + '/user/alitm/get-alitm-info-list',
    formData: {
      userId: req.session.userData.id,
    }
  };
  request(options).then(function (parsedBody) {
    res.send(parsedBody);
    res.end();
  }).catch(function (err) {
    logConfig.logger.error(req.originalUrl + ':' + err);
    res.json({status: false, msg: "服务器错误"});
    res.end();
  });
});

/**
 * 解绑旺旺号
 * @param userId
 */
router.post('/api/alitm-unBunding.json', function (req, res, next) {
  let options = {
    method: 'POST',
    uri: baseUrl + '/user/alitm/alitm-unBunding',
    formData: {
      id: req.body.id,
    }
  };
  request(options).then(function (parsedBody) {
    res.send(parsedBody);
    res.end();
  }).catch(function (err) {
    logConfig.logger.error(req.originalUrl + ':' + err);
    res.json({status: false, msg: "服务器错误"});
    res.end();
  });
});

/**
 * 修改旺旺号
 * @param userId
 */
router.post('/api/alitm/resubmit.json', function (req, res, next) {
  let options = {
    method: 'POST',
    uri: baseUrl + '/user/alitm/resubmit',
    formData: {
      id: req.body.id,
      alitmAccount: req.body.alitmAccount,
      picUrl: req.body.picUrl
    }
  };
  request(options).then(function (parsedBody) {
    res.send(parsedBody);
    res.end();
  }).catch(function (err) {
    logConfig.logger.error(req.originalUrl + ':' + err);
    res.json({status: false, msg: "服务器错误"});
    res.end();
  });
});

/**
 * 用户任务发布
 * @param taskType
 * @param taskDaysDuration
 * @param onlyShowForQualification
 * @param refuseOldShowker
 * @param taskName
 * @param itemType
 * @param taskMainImage
 * @param itemUrl
 * @param storeName
 * @param taskCount
 * @param itemPrice
 * @param pinkage
 * @param itemDescription
 * @param userId
 * @param paymentMethod
 * @param taskDetail
 */
router.post("/api/task-create.json", function (req, res, next) {
  let options = {
    method: 'POST',
    uri: baseUrl + '/task/save',
    formData: {
      userId: req.session.userData.id,
      taskType: req.body.taskType,
      taskDaysDuration: req.body.taskDaysDuration,
      onlyShowForQualification: req.body.onlyShowForQualification,
      refuseOldShowker: req.body.refuseOldShowker,
      taskName: req.body.taskName,
      "itemCatalog.id": req.body.itemType,
      taskMainImage: req.body.taskMainImage,
      itemUrl: req.body.itemUrl,
      storeName: req.body.storeName,
      taskCount: req.body.taskCount,
      itemPrice: req.body.itemPrice * 100,
      pinkage: req.body.pinkage,
      itemDescription: req.body.itemDescription,
      paymentMethod: req.body.paymentMethod,
      taskDetail: req.body.taskDetail,
      id: req.body.id
    },
    json: true,
  };
  request(options)
    .then(function (parsedBody) {
      res.send(parsedBody);
      res.end();
    })
    .catch(function (err) {
      logConfig.logger.error(req.originalUrl + ':' + err);
      res.json({status: false, msg: "服务器错误"});
      res.end();
    });
});

/**
 * 用户试用活动管理
 * @param userId
 * @param pageIndex
 * @param pageSize
 * @param taskStatusList
 * @param settlementStatusList
 */
router.post('/api/task-list.json', function (req, res, next) {
  let options = {
    method: 'GET',
    uri: baseUrl + '/task/list/' + req.session.userData.id + '/' + req.body.pageIndex,
    qs: {
      pageSize: req.body.pageSize,
      taskStatusListString: req.body.taskStatusList,
      settlementStatusListString: req.body.settlementStatusList
    },
    json: true
  };
  request(options)
    .then(function (parsedBody) {
      res.send(parsedBody);
      res.end();
    })
    .catch(function (err) {
      logConfig.logger.error(req.originalUrl + ':' + err);
      res.json({status: false, msg: "服务器错误"});
      res.end();
    });
});

/**
 * 用户任务删除
 * @param userId
 * @param taskId
 */
router.post('/api/delete-task.json', function (req, res, next) {
  let options = {
    method: 'GET',
    uri: baseUrl + '/task/delete/' + req.session.userData.id + '/' + req.body.taskId,
    json: true
  };
  request(options)
    .then(function (parsedBody) {
      res.send(parsedBody);
      res.end();
    })
    .catch(function (err) {
      logConfig.logger.error(req.originalUrl + ':' + err);
      res.json({status: false, msg: "服务器错误"});
      res.end();
    });
});

/**
 * 用户任务读取
 * @param userId
 * @param taskId
 */
router.post('/api/get-task.json', function (req, res, next) {
  let options = {
    method: 'GET',
    uri: baseUrl + '/task/get/' + req.session.userData.id + '/' + req.body.taskId,
    json: true
  };
  request(options)
    .then(function (parsedBody) {
      res.send(parsedBody);
      res.end();
    })
    .catch(function (err) {
      logConfig.logger.error(req.originalUrl + ':' + err);
      res.json({status: false, msg: "服务器错误"});
      res.end();
    });
});

/**
 * 根据任务id和状态获取任务申请列表
 * @param taskId
 * @param status
 */
router.post('/api/get-task-apply-list.json', function (req, res, next) {
  let options = {
    method: 'POST',
    uri: baseUrl + '/task/seller/applyList',
    formData: {
      taskId: req.body.taskId,
      status: req.body.status,
      pageIndex: req.body.pageIndex,
      selectStatus: req.body.selectStatus,
      searchValue: req.body.searchValue,
      orderNum: req.body.orderNum,
      endReasonList: req.body.endReasonList,
      auditStatusList: req.body.auditStatusList,
    },
    json: true
  };
  request(options)
    .then(function (parsedBody) {
      res.send(parsedBody);
      res.end();
    })
    .catch(function (err) {
      logConfig.logger.error(req.originalUrl + ':' + err);
      res.json({status: false, msg: "服务器错误"});
      res.end();
    });
});

/**
 *商家审核秀客是否通过
 * @param id
 * @param status
 */
router.post('/api/set-task-showker-audit.json', function (req, res, next) {
  let options = {
    method: 'POST',
    uri: baseUrl + '/task/seller/showkeAudit',
    formData: {
      id: req.body.id,
      status: req.body.status,
    },
    json: true
  };
  request(options)
    .then(function (parsedBody) {
      res.send(parsedBody);
      res.end();
    })
    .catch(function (err) {
      logConfig.logger.error(req.originalUrl + ':' + err);
      res.json({status: false, msg: "服务器错误"});
      res.end();
    });
});

/**
 * 商家审核秀订单号
 * @param id
 * @param status
 */
router.post('/api/order-number-audit.json', function (req, res, next) {
  let options = {
    method: 'POST',
    uri: baseUrl + '/task/seller/orderNumAudit',
    formData: {
      id: req.body.id,
      status: req.body.status,
    },
    json: true
  };
  request(options)
    .then(function (parsedBody) {
      res.send(parsedBody);
      res.end();
    })
    .catch(function (err) {
      logConfig.logger.error(req.originalUrl + ':' + err);
      res.json({status: false, msg: "服务器错误"});
      res.end();
    });
});

/**
 * 商家获取秀客订单详情
 * @param id
 * @param status
 */
router.post('/api/order-number-info.json', function (req, res, next) {
  let options = {
    method: 'POST',
    uri: baseUrl + '/task/seller/orderInfo',
    formData: {
      id: req.body.id,
    },
    json: true
  };
  request(options)
    .then(function (parsedBody) {
      res.send(parsedBody);
      res.end();
    })
    .catch(function (err) {
      logConfig.logger.error(req.originalUrl + ':' + err);
      res.json({status: false, msg: "服务器错误"});
      res.end();
    });
});

/**
 * 商家对任务补充保证金
 * @param uid
 * @param platform
 * @param payPwd
 * @param showkerTaskId
 */
router.post('/api/deposit-supplement.json', function (req, res, next) {
  let options = {
    method: 'POST',
    uri: baseUrl + '/user/account/deposit_supplement',
    formData: {
      uid: req.session.userData.id,
      platform: "pc",
      payPwd:req.body.payPassword,
      showkerTaskId:req.body.taskId
    },
    json: true
  };
  request(options)
    .then(function (parsedBody) {
      res.send(parsedBody);
      res.end();
    })
    .catch(function (err) {
      logConfig.logger.error(req.originalUrl + ':' + err);
      res.json({status: false, msg: "服务器错误"});
      res.end();
    });
});

/**
 * 商家查看试用报告详情
 *  @param id
 */
router.post('/api/task-report-info.json', function (req, res, next) {
  let options = {
    method: 'POST',
    uri: baseUrl + '/task/seller/reportInfo',
    formData: {
      id: req.body.id,
    },
    json: true
  };
  request(options)
    .then(function (parsedBody) {
      res.send(parsedBody);
      res.end();
    })
    .catch(function (err) {
      logConfig.logger.error(req.originalUrl + ':' + err);
      res.json({status: false, msg: "服务器错误"});
      res.end();
    });
});

/**
 * 商家审核试用报告
 * @param id
 * @param status
 * @param msg
 */
router.post('/api/task-report-audit.json', function (req, res, next) {
  let options = {
    method: 'POST',
    uri: baseUrl + '/task/seller/reportAudit',
    formData: {
      id: req.body.id,
      status:req.body.status,
      msg:req.body.msg
    },
    json: true
  };
  request(options)
    .then(function (parsedBody) {
      res.send(parsedBody);
      res.end();
    })
    .catch(function (err) {
      logConfig.logger.error(req.originalUrl + ':' + err);
      res.json({status: false, msg: "服务器错误"});
      res.end();
    });
});

/**
 * 秀客申请列表
 * 待审核和未通过的
 * @param showkerId
 */
router.post('/api/showker-apply-list.json', function (req, res, next) {
  let options = {
    method: 'GET',
    uri: baseUrl + '/task/showker/list/apply/' + req.session.userData.id + '/' + req.body.pageIndex,
    qs: {
      selectStatus: req.body.selectStatus,
      searchValue: req.body.searchValue,
      status: req.body.status,
      pageSize: req.body.pageSize
    },
    json: true
  };
  request(options)
    .then(function (parsedBody) {
      res.send(parsedBody);
      res.end();
    })
    .catch(function (err) {
      logConfig.logger.error(req.originalUrl + ':' + err);
      res.json({status: false, msg: "服务器错误"});
      res.end();
    });
});

/**
 * 秀客申请列表
 * 审核通过的
 * @param showkerId
 */
router.post('/api/showker-success-list.json', function (req, res, next) {
  let options = {
    method: 'GET',
    uri: baseUrl + '/task/showker/list/success/' + req.session.userData.id + '/' + req.body.pageIndex,
    qs: {
      selectStatus: req.body.selectStatus,
      searchValue: req.body.searchValue,
      pageSize: req.body.pageSize,
      auditTimeStart: req.body.auditTimeStart,
      auditTimeEnd: req.body.auditTimeEnd
    },
    json: true
  };
  request(options)
    .then(function (parsedBody) {
      res.send(parsedBody);
      res.end();
    })
    .catch(function (err) {
      logConfig.logger.error(req.originalUrl + ':' + err);
      res.json({status: false, msg: "服务器错误"});
      res.end();
    });
});

/**
 * 秀客的试用报告
 * @param showkerId
 * @param pageIndex
 * @param pageSize
 * @param orderBy
 * @param sort
 * @return
 */
router.post('/api/task/showker/showkerTrialReports.json', function (req, res, next) {
  let options = {
    method: 'POST',
    uri: baseUrl + '/task/showker/showkerTrialReports',
    formData: {
      showkerId: req.body.showkerId,
      pageIndex:req.body.pageIndex,
      pageSize:req.body.pageSize,
    },
    json: true
  };
  request(options)
    .then(function (parsedBody) {
      res.send(parsedBody);
      res.end();
    })
    .catch(function (err) {
      logConfig.logger.error(req.originalUrl + ':' + err);
      res.json({status: false, msg: "服务器错误"});
      res.end();
    });
});
/**
 * 获取用户、账户、旺旺账号
 * @param userId
 * @return
 * @throws Exception
 */
router.post('/api/user/account/get-user-account.json', function (req, res, next) {
  let options = {
    method: 'POST',
    uri: baseUrl + '/user/account/get-user-account',
    formData: {
      userId: req.session.userData.id,
    },
    json: true
  };
  request(options)
    .then(function (parsedBody) {
      res.send(parsedBody);
      res.end();
    })
    .catch(function (err) {
      logConfig.logger.error(req.originalUrl + ':' + err);
      res.json({status: false, msg: "服务器错误"});
      res.end();
    });
});
/**
 * 秀客终止试用
 * @param id
 * @param status
 */
router.post('/api/showker-end-trial.json', function (req, res, next) {
  let options = {
    method: 'POST',
    uri: baseUrl + '/task/showker/endTrial',
    formData: {
      id: req.body.id,
      status: req.body.status
    },
    json: true
  };
  request(options)
    .then(function (parsedBody) {
      res.send(parsedBody);
      res.end();
    })
    .catch(function (err) {
      logConfig.logger.error(req.originalUrl + ':' + err);
      res.json({status: false, msg: "服务器错误"});
      res.end();
    });
});

/**
 * 秀客删除未审核通过的记录
 * @param showkerId
 * @param id
 */
router.post('/api/showker-apply-delete.json', function (req, res, next) {
  let options = {
    method: 'POST',
    uri: baseUrl + '/task/showker/applyDelete',
    formData: {
      showkerId: req.body.showkerId,
      id: req.body.id
    },
    json: true
  };
  request(options)
    .then(function (parsedBody) {
      res.send(parsedBody);
      res.end();
    })
    .catch(function (err) {
      logConfig.logger.error(req.originalUrl + ':' + err);
      res.json({status: false, msg: "服务器错误"});
      res.end();
    });
});

/**
 * 秀客去下单
 * @param id
 */
router.post('/api/showker-to-process-order.json', function (req, res, next) {
  let options = {
    method: 'POST',
    uri: baseUrl + '/task/showker/toProcessOrder',
    formData: {
      id: req.body.id
    },
    json: true
  };
  request(options)
    .then(function (parsedBody) {
      res.send(parsedBody);
      res.end();
    })
    .catch(function (err) {
      logConfig.logger.error(req.originalUrl + ':' + err);
      res.json({status: false, msg: "服务器错误"});
      res.end();
    });
});

/**
 * 秀客保存或者修改订单号
 * @param orderNum
 * @param id
 * @param actualPayMoney
 */
router.post('/api/showker-save-or-update-order.json', function (req, res, next) {
  let options = {
    method: 'POST',
    uri: baseUrl + '/task/showker/saveOrUpdateOrder',
    formData: {
      id: req.body.id
    },
    json: true
  };
  request(options)
    .then(function (parsedBody) {
      res.send(parsedBody);
      res.end();
    })
    .catch(function (err) {
      logConfig.logger.error(req.originalUrl + ':' + err);
      res.json({status: false, msg: "服务器错误"});
      res.end();
    });
});

/**
 * 秀客保存或者修改试用报告
 * @param id
 * @param trialReportText
 * @param trialReportImages
 */
router.post('/api/showker-save-or-update-report.json', function (req, res, next) {
  let options = {
    method: 'POST',
    uri: baseUrl + '/task/showker/saveOrUpdateReport',
    formData: {
      id: req.body.id,
      trialReportText: req.body.trialReportText,
      trialReportImages: req.body.trialReportImages
    },
    json: true
  };
  request(options)
    .then(function (parsedBody) {
      res.send(parsedBody);
      res.end();
    })
    .catch(function (err) {
      logConfig.logger.error(req.originalUrl + ':' + err);
      res.json({status: false, msg: "服务器错误"});
      res.end();
    });
});

module.exports = router;

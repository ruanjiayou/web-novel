const Mock = require('mockjs');

module.exports = {
  'post /v1/user/code': async function createCode() {
    const data = req.body;
    data.id = Mock.Random.integer();
    data.uid = 1;
    return {
      code: 0,
      data
    };
  },
  'delete /v1/user/code/[0-9a-zA-Z]+': async function destroyCode() {
    return {
      code: 0,
      message: ''
    };
  },
  'put /v1/user/code/[0-9a-zA-Z]+': async function updateCode() {
    const data = req.body;
    return {
      code: 0,
      data
    };
  },
  'get /v1/user/codes': async function getCodes() {
    return Mock.mock({
      code: 0,
      'data|200': [{
        'id|+1': 1,
        uid: 1,
        name: '@cname',
        account: '@email',
        mark: '@cparagraph',
        deletedAt: '@date',
      }]
    });
  },
  'get /v1/user/code/:cid([0-9a-zA-Z]+)/versions': async function getCodeVersions() {
    const cid = req.params.cid;
    return Mock.mock({
      code: 0,
      'data|2': [{
        'id|+1': 1,
        cid: cid,
        password: '@word'
      }]
    });
  },
  'post /v1/user/code/[0-9a-zA-Z]+/version': async function createCodeVersion() {
    return Mock.mock({
      code: 0,
      data: {
        id: 1,
        cid: 1,
        password: '@word'
      }
    });
  }
};
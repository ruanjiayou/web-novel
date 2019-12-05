const Mock = require('mockjs')

module.exports = {
  'get /v1/user/self': async function getInfo() {
    return Mock.mock({
      code: 0,
      'data': {
        name: '@cname',
        id: '@id',
        avatar: '@url',
      }
    })
  }
}
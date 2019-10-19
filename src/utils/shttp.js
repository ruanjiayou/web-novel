import axios from 'axios'
import globalStore from '../global-state'
import Config from '../config'
import services from '../services'

const shttp = axios.create({
  baseURL: '',
  withCredentials: false,
  timeout: 5000
})

shttp.interceptors.request.use(
  config => {
    if (Config.isDebug && Config.console) {
      console.log(`${config.method} ${config.url}`)
    }
    config.headers['Authorization'] = globalStore.app.accessToken
    // config.params = { token: globalStore.app.accessToken }
    return config
  },
  error => {
    if (Config.isDebug && Config.console) {
      console.log(error, 'request error')
    }
    return Promise.resolve(error)
  }
)

shttp.interceptors.response.use(
  response => {
    if (Config.isDebug && Config.console) {
      console.log(response.status, response.data)
    }
    const res = response.data
    // 干点什么
    if (res.code !== 0) {
      if (res.code === 10110 && response.config.url !== response.config.baseURL + '/v1/auth/user/refresh') {
        globalStore.app.setAccessToken('')
        return new Promise(async (resolve) => {
          const result = await services.refresh({ authorization: globalStore.app.refreshToken })
          if (result.data) {
            globalStore.app.setAccessToken(result.data.token)
            globalStore.app.setAccessToken(result.data.refresh_token)
            response.config.headers['Authorization'] = result.data.token
            response.config.try = true
            const newResult = await shttp(response.config)
            resolve(newResult)
          } else {
            resolve({})
          }
        })
      } else {
        // Modal.alert('请求失败', res.message);
      }

    }
    return res
  },
  error => {
    if (Config.isDebug && Config.console) {
      console.log(error, 'response error')
    }
    const data = error.response.data
    if (data.code === 101020) {
      globalStore.app.setAccessToken('')
    }
    return Promise.resolve(error)
  }
)

export default shttp
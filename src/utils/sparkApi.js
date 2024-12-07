import CryptoJS from 'crypto-js'

export default class SparkApi {
  constructor(appid, apiKey, apiSecret) {
    this.appid = appid
    this.apiKey = apiKey
    this.apiSecret = apiSecret
    this.url = "wss://spark-api.xf-yun.com/v1.1/chat"
  }

  // 生成鉴权url
  getAuthUrl() {
    const host = "spark-api.xf-yun.com/v1.1/chat"
    const date = new Date().toUTCString()
    const signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v1.1/chat HTTP/1.1`
    const signatureSha = CryptoJS.HmacSHA256(signatureOrigin, this.apiSecret)
    const signature = CryptoJS.enc.Base64.stringify(signatureSha)
    const authorizationOrigin = `api_key="${this.apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`
    const authorization = btoa(authorizationOrigin)
    return `${this.url}?authorization=${authorization}&date=${date}&host=${host}`
  }

  // 创建WebSocket连接
  createConnection(onMessage, onError, onClose) {
    const url = this.getAuthUrl()
    const ws = new WebSocket(url)

    ws.onmessage = (event) => {
      let data = JSON.parse(event.data)
      onMessage && onMessage(data)
    }

    ws.onerror = (error) => {
      onError && onError(error)
    }

    ws.onclose = () => {
      onClose && onClose()
    }

    return ws
  }

  // 发送消息
  sendMessage(ws, messages) {
    if (ws.readyState !== WebSocket.OPEN) {
      return false
    }

    const params = {
      header: {
        app_id: this.appid,
        uid: "12345"
      },
      parameter: {
        chat: {
          domain: "general",
          temperature: 0.5,
          max_tokens: 2048
        }
      },
      payload: {
        message: {
          text: [{
            role: "user",
            content: messages
          }]
        }
      }
    }

    ws.send(JSON.stringify(params))
    return true
  }
}

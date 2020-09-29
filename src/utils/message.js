import Vue from 'vue'
import Events from './events'
import JR from '@etk/jsonrpc'
import { instance as store } from '@/store'

const jr = new JR()

class Message {
  constructor (options = {}) {
    const defaults = {
      origin: window.location.protocol + '//' + window.location.host
    }

    console.log({ store })

    this.options = Object.assign({}, defaults, options)
  }

  register () {
    window.addEventListener('message', this._handleMessage.bind(this), false)
  }

  unregister () {
    window.removeEventListener('message', this._handleMessage.bind(this), false)
  }

  _handleMessage (event) {
    try {
      const message = jr.parse(event.data)
      console.log('message::handle', message)

      if (message instanceof JR.Response) return

      if (message instanceof JR.Notification || message instanceof JR.Request) {
        const method = message.getMethod()
        let params = message.getParams()

        params = {
          event: 'message:' + method,
          data: params
        }
        if (message instanceof JR.Request) {
          params.sendError = (msg) => this.sendError(message.getId(), msg)
          params.sendResponse = (msg) => this.sendResponse(message.getId(), msg)
        }
        Events.$emit('message:' + method, params)
      } else {
        throw new Error('Invalid message received')
      }
    } catch (error) {
      if (['webpackWarnings', 'webpackClose', 'webpackInvalid', 'webpackOk'].includes(event.data.type) ||
        event.data.vueDetected || ['patterns', 'js'].includes(event.data.id) ||
        ['vue-devtools-backend', 'vue-devtools-proxy'].includes(event.data.source) ||
        (Array.isArray(event.data) && event.data.includes('webpackHotUpdate')) ||
        event.data === '') {
      } else {
        console.error('editor::message::handle - INVALID REQUEST', { event, error })
      }
    }
  }

  _handleResponse () {

  }

  sendResponse (id, result) {
    const response = jr.Response({ id, result })
    this.send(response)
  }

  sendError (id, error) {
    const response = jr.Response({ id, error })
    this.send(response)
  }

  sendNotification (method, params = {}) {
    const message = jr.Notification({ method, params })
    this.send(message)
  }

  sendRequest (method, params, callback) {
    const message = jr.Request({ method, params, callback })
    this.send(message)
  }

  send (message) {
    let frame = store.getters.appElement

    console.log({ store, frame })

    if (!frame) {
      console.warn('Frame window not found or not set! Message was not sent.')
      return
    }

    if (frame instanceof HTMLIFrameElement) {
      frame = frame.contentWindow
    }

    if (message) {
      console.log('message::send', message)
      frame.postMessage(message.toString(), this.options.origin)
    }
  }
}

const message = new Message()
message.register()

Vue.prototype.$message = message

export default message

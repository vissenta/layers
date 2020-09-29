import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export let instance = null

export default async (app) => {
  let store = () => import('@/store/' + app + '.js')

  store = (await store()).default

  const storeInstance = new Vuex.Store({
    state: {
      appElement: null
    },
    getters: {
      appElement: state => state.appElement
    },
    mutations: {
      setAppElement: (state, payload) => (state.appElement = payload)
    },

    modules: { [app]: store }
  })

  instance = storeInstance

  return storeInstance
}

/* workbench store */

const state = {
  dataTransfer: {}
}

const getters = {
  dataTransfer: state => state.dataTransfer
}

const mutations = {
  setDataTransfer: (state, payload) => {
    console.log('set dataTransfer', payload)
    state.dataTransfer = payload
  }
}

export default {
  state,
  getters,
  mutations
}

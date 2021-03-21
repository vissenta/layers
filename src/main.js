import Vue from 'vue'
import App from './App.vue'
import router from './router'
import makeStore from './store'

Vue.config.productionTip = false

;(async () => {
  let { search } = window.location

  let isWorkbench = false
  if (search.length > 0) {
    /* eslint-disable-next-line */
    search = search.replace('?', '').split('&').reduce((a, c) => (c = c.split('='), a[c[0]] = c[1], a), {})
    isWorkbench = Object.keys(search).includes('workbench')
  }

  const appName = isWorkbench ? 'workbench' : 'builder'

  if (!isWorkbench) {
    const VueTailwind = await import('vue-tailwind')
    const VueTailwindSettings = await import('./settings')
    Vue.use(VueTailwind, VueTailwindSettings)
  }

  console.log('run app ' + appName)

  const store = await makeStore(appName)

  import('@/utils/message') /* eslint-disable-line no-unused-expressions */

  console.log(Vue)
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
})()

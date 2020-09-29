<template>
  <div id="app">
    <component v-if="application" :is="application" />
    <template v-else>
      LOADING
    </template>
  </div>
</template>

<script>
export default {
  name: 'MainFrame',

  components: {
    builder: () => import('@/components/Builder'),
    workbench: () => import('@/components/Workbench')
  },

  data () {
    return {
      application: null
    }
  },

  mounted () {
    const { query } = this.$route

    if (Object.keys(query).includes('workbench')) {
      this.application = 'workbench'
    } else {
      this.application = 'builder'
    }
  }
}
</script>

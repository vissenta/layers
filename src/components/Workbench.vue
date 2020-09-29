<template>
  <div>
    <template v-for="component in page">
      <component :is="component.component" :key="component.id" v-bind="component" />
    </template>
    <br v-for="i in 100" :key="i">
  </div>
</template>

<script>
import { components } from '@/components/shared/elements'

const uikitUrl = 'https://cdn.jsdelivr.net/npm/uikit@3.5.7/dist/'

const uikitUrls = [
  { tag: 'script', attr: 'src', value: `${uikitUrl}js/uikit.min.js` },
  { tag: 'script', attr: 'src', value: `${uikitUrl}js/uikit-icons.min.js` },
  { tag: 'link', attr: 'href', value: `${uikitUrl}css/uikit.min.css`, additionalAttrs: { rel: 'stylesheet' } }
]
uikitUrls.forEach(({
  tag,
  attr,
  value,
  additionalAttrs
}) => {
  const uikitStyles = document.createElement(tag)
  uikitStyles[attr] = value
  if (additionalAttrs) {
    Object.assign(uikitStyles, additionalAttrs)
  }
  document.head.appendChild(uikitStyles)
})

export default {
  name: 'WorkerFrame',
  components: { ...components },

  data () {
    return {
      page: [
        {
          id: 'asdas',
          component: 'Section',
          children: [{
            id: 'container',
            component: 'Container',
            size: 'large',
            children: [{
              id: 'grid',
              component: 'Grid',
              cells: [
                {
                  id: 'asdasd',
                  width: '33.33%',
                  children: [{
                    id: 'h1el',
                    component: 'Heading',
                    size: 'small',
                    tag: 'h1',
                    text: 'Heading test 1'
                  }, {
                    id: 'h1el2',
                    component: 'Heading',
                    size: 'small',
                    tag: 'h1',
                    text: 'Heading test 2'
                  }, {
                    id: 'h1el3',
                    component: 'Heading',
                    size: 'small',
                    tag: 'h1',
                    text: 'Heading test 3'
                  }]
                },
                {
                  id: 'asdsada',
                  width: '33.33%'
                }
              ]
            }]
          }]
        }
      ]
    }
  },

  created () {
    this.$events.$on('message:dataTransfer', ({ data }) => this.$store.commit('setDataTransfer', data))
  },

  beforeDestroy () {
    this.$events.$off('message:dataTransfer')
  }

}
</script>

<style lang="scss">
  @import '@/assets/workbench';
</style>

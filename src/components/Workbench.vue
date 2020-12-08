<template>
  <div @mouseover="handleMouseOver" @mouseleave="handleMouseLeave">
    <workbench-element v-for="component in page" v-bind="component" :key="component.id" />
    <!--component :is="component.component" :key="component.id" v-bind="component" /-->
    {{ page }}
    <br v-for="i in 100" :key="i">
  </div>
</template>

<script>
import _debounce from 'lodash.debounce'
import _findPathDeep from 'deepdash-es/findPathDeep'
import _get from 'lodash.get'
import { nanoid } from 'nanoid'
import { components } from '@/components/shared/elements'
import WorkbenchElement from '@/components/workbench/Element'
import { removeGhost } from '@/utils/ghost'
import { dataTransfer } from '@/store/workbench'

console.log({ dataTransfer })

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
  components: { ...components, WorkbenchElement },

  data () {
    return {
      currentTarget: null,
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

  computed: {
    dataTransfer: () => dataTransfer.data
  },

  watch: {
    dataTransfer (value) {
      if (Object.keys(value).length > 0) {
        this.currentTarget = null
        this.handleTargetChange()
      } else {
        removeGhost()
      }
    }
  },

  created () {
    this.$events.$on('message:dataTransfer', ({ data }) => (dataTransfer.data = data))

    this.$events.$on('insert', this.handleInsert)
    this.$events.$on('move', this.handleMove)
  },

  beforeDestroy () {
    this.$events.$off('message:dataTransfer')

    this.$events.$off('insert', this.handleInsert)
    this.$events.$off('move', this.handleMove)
  },

  methods: {
    handleMouseOver: _debounce(function (event) {
      if (Object.keys(this.dataTransfer).length > 0) return

      const element = event.target.classList.contains('layers-item') ? event.target : event.target.closest('.layers-item')
      this.currentTarget = element || null

      this.handleTargetChange()
    }, 35),
    handleMouseLeave (event) {
      this.currentTarget = null
      this.handleTargetChange()
    },

    handleTargetChange () {
      const previousTarget = document.querySelector('.layers-item.layers-item--hover')
      const { currentTarget } = this

      if (previousTarget && (previousTarget !== currentTarget)) {
        previousTarget.classList.remove('layers-item--hover')
      }

      currentTarget && currentTarget.classList.add('layers-item--hover')
    },

    handleInsert ({ data, target, onTop }) {
      console.log('insert', { data, target, onTop })

      const foundPath = _findPathDeep(this.page, (val, key, parentVal, ctx) => {
        console.log({ val, key, parentVal, ctx })
        if (key === 'id' && val === target) {
          return true
        }
        return false
      })
      const normalizedPath = foundPath.replace(/\.id$/, '').replace(/\[[0-9]{1,3}\]$/, '')
      console.log({ foundPath, normalizedPath })
      const childrens = _get(this.page, normalizedPath)

      const elementIndex = childrens.findIndex(children => children.id === target)
      const isLast = childrens.length === elementIndex + 1

      const componentData = Object.entries(data.schema).reduce((acc, curr) => {
        acc[curr[0]] = curr[1].default
        return acc
      }, {})

      componentData.id = nanoid(5)
      componentData.component = data.name

      if (onTop && elementIndex === 0) {
        childrens.unshift(componentData)
      } else if (!onTop && isLast) {
        childrens.push(componentData)
      } else {
        const startIndex = !onTop ? (elementIndex + 1) : elementIndex
        childrens.splice(startIndex, 0, componentData)
      }

      this.$set(this.page, normalizedPath, childrens)
    },

    handleMove ({ id, target, onTop }) {
      console.log('move', { id, target, onTop })
    }
  }

}
</script>

<style lang="scss">
  @import '@/assets/workbench';
</style>

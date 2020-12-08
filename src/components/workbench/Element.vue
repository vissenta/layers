<template>
  <component :is="component" v-bind="{ id, component, children, ...additionalProps }">
    <template v-slot="component">
      <workbench-element v-bind="extract(component)" :key="component.id" />
    </template>
  </component>
</template>

<script>
import { components } from '@/components/shared/elements'

export default {
  name: 'WorkbenchElement',
  components: {
    ...components,
    WorkbenchElement: () => import('@/components/workbench/Element')
  },
  props: {
    id: {
      type: String,
      required: true
    },
    component: {
      type: String,
      required: true
    },
    children: {
      type: Array,
      default: () => ([])
    },
    additionalProps: {
      type: Object,
      default: () => ({})
    }
  },

  methods: {
    extract ({ id, component, children, ...rest }) {
      const data = { id, component }
      if (children) Object.assign(data, { children })
      if (rest) Object.assign(data, { additionalProps: rest })
      return data
    }
  }
}
</script>

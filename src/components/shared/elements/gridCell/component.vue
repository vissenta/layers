<template>
  <drop @drop="handleDrop" ref="dropElement" class="uk-grid-cell layers-drop-area"
    @dragover="handleDragOver" @dragleave="handleDragLeave" @dragenter="handleDragEnter">
    <template v-if="children.length">
      <drag @dragstart="handleDragStart" @drag="handleDrag" @dragend="handleDragEnd"
        :ref="`item${index}`" :data-transfer="{ component, list: children }" :id="component.id"
        tag="div" class="layers-drag-element" :data-index="index" v-for="(component, index) in children" :key="component.id" >
        <component :is="component.component" v-bind="component" class="layers-element" />
      </drag>
    </template>
    <div v-else class="layers-column--empty">
      <div class="layers-drag-element layers-drag-element--empty">
        +
      </div>
    </div>
  </drop>
</template>

<script>
import ElementMixin from '@/mixins/Element'

export default {
  name: 'ElementGridCell',
  mixins: [ElementMixin],
  components: {
    Drag: () => import('@/components/shared/Drag'),
    Drop: () => import('@/components/shared/Drop')
  },
  props: {
    width: {
      type: String
    },
    children: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      standalone: false,
      notAllowed: ['Section']
    }
  },

  methods: {
    handleDrag (e) {

    },
    handleDragEnd (e) {
      console.log('workbench::dragEnd', { e })
    }
  }
}
</script>

<template>
  <workbench-item class="uk-container" :class="[sizeClass]" type="container">
      <drop class="layers-drop-area root" @drop="handleDrop" ref="dropElement" @dragleave="handleDragLeave"
        @dragover="handleDragOver" @dragenter="handleDragEnter">
        <div class="layers-drag-element" v-for="(component, index) in children" :key="component.id" :ref="`item${index}`">
          <component :is="component.component" v-bind="component" />
        </div>
      </drop>
  </workbench-item>
</template>

<script>
import ElementMixin from '@/mixins/Element'

const availableSize = ['xsmall', 'small', 'large', 'xlarge', 'expand']

export default {
  name: 'ElementContainer',
  mixins: [ElementMixin],
  components: { Drop: () => import('@/components/shared/Drop') },
  props: {
    children: {
      type: Array
    },
    size: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      notAllowed: ['Section']
    }
  },
  computed: {
    sizeClass () {
      return !availableSize.includes(this.size) ? '' : 'uk-container-' + this.size
    }
  }
}
</script>

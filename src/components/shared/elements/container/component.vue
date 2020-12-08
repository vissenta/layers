<template>
  <div class="uk-container" :class="[sizeClass]">
    <slot v-for="component in children" v-bind="component" name="default" />
  </div>
  <!--workbench-item-- class="uk-container" :class="[sizeClass]" type="container" :component="component">
      <drop class="layers-drop-area root" @drop="handleDrop" ref="dropElement" @dragleave="handleDragLeave"
        @dragover="handleDragOver" @dragenter="handleDragEnter">
        <div class="layers-drag-element" v-for="(component, index) in children" :key="component.id" :ref="`item${index}`">
          <slot name="default" v-bind="component" />
        </div>
      </drop>
  </!--workbench-item-->
</template>

<script>
import ElementMixin from '@/mixins/Element'

const availableSize = ['xsmall', 'small', 'large', 'xlarge', 'expand']

export default {
  name: 'ElementContainer',
  mixins: [ElementMixin],
  // components: { Drop: () => import('@/components/shared/Drop') },
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

<template>
  <component
      :is="tag"
      draggable="true"
      @dragstart="handleDragStart"
      @drag="handleDragging"
      @dragend="handleDragEnd"
    >
      <slot />
    </component>
</template>
<script>
export default {
  name: 'Drag',
  props: {
    dataTransfer: {
      type: Object,
      default: () => {}
    },
    tag: {
      type: String,
      default: 'div'
    },
    dropEffect: {
      type: String,
      default: 'copy'
    }
  },
  methods: {
    handleDragging (event) {
      this.$emit('drag', event)
    },
    handleDragStart (event) {
      event.dataTransfer.dropEffect = this.dropEffect
      event.dataTransfer.setData('text/plain', JSON.stringify(this.dataTransfer))
      event.dataTransfer.setDragImage(event.target, 0, 0)
      this.$emit('dragstart', { dataTransfer: this.dataTransfer, event })
    },
    handleDragEnd (event) {
      this.$emit('dragend', event)
    }
  }
}
</script>

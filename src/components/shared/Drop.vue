<template>
    <component :is="tag"
        @dragenter.prevent="handleDragEnter"
        @dragleave.prevent="handleDragLeave"

        @drop.prevent="handleDrop"
        @dragover.prevent="handleDragOver"

        ref="drag-element"
    >
        <slot />
    </component>
</template>
<script>
const parseJSON = (jsonString) => {
  try {
    var o = JSON.parse(jsonString)
    if (o && typeof o === 'object') {
      return o
    }
  } catch (e) {}

  return undefined
}
export default {
  name: 'Drop',
  props: {
    tag: {
      type: String,
      default: 'div'
    }
  },
  methods: {
    handleDrop (event) {
      event.stopPropagation()
      var dataTransfer = parseJSON(event.dataTransfer.getData('text/plain'))
      this.$emit('drop', {
        dataTransfer,
        event
      })
      this.$refs['drag-element'].classList.remove('is-over')
    },
    handleDragEnter (event) {
      event.stopPropagation()
      this.$emit('dragenter', event)
      this.$refs['drag-element'].classList.add('is-over')
    },
    handleDragOver (event) {
      this.$emit('dragover', event)
      this.$refs['drag-element'].classList.add('is-over')
    },
    handleDragLeave (event) {
      event.stopPropagation()
      this.$emit('dragleave', event)
      this.$refs['drag-element'].classList.remove('is-over')
    }
  }
}
</script>

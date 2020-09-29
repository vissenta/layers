<template>
  <component :is="tag" class="layers-item">
    <div class="layers-item-toolbox">

    </div>
    <slot />
  </component>
</template>

<script>

const validTypes = ['section', 'container', 'item']

export default {
  name: 'WorkbenchItem',

  props: {
    tag: {
      type: String,
      default: 'div'
    },
    type: {
      type: String,
      validator: value => validTypes.includes(value),
      default: 'item'
    }
  }
}
</script>

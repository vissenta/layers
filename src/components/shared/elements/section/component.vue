<template>
  <section class="uk-section">
    <slot v-for="component in children" v-bind="component" name="default" />
  </section>
</template>

<script>
import ElementMixin from '@/mixins/Element'

export default {
  name: 'ElementSection',
  mixins: [ElementMixin],
  props: {
    children: {
      type: Array
    }
  }
}
</script>

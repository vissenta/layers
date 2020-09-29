<template>
  <section class="uk-section">
    <template v-for="component in children">
      <component :is="component.component" :key="component.id" v-bind="component" />
    </template>
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

<template>
  <div class="uk-grid" :class="`uk-child-width-1-${cells.length}`">
    <template v-for="cell in cells">
      <grid-cell :key="cell.id" v-bind="cell" />
    </template>
  </div>
</template>

<script>
import ElementMixin from '@/mixins/Element'

export default {
  name: 'ElementGrid',
  mixins: [ElementMixin],
  props: {
    cells: {
      type: Array
    }
  }
}
</script>

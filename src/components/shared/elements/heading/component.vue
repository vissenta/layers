<template>
  <component :is="tag" :class="[sizeClass]">
    <a :href="url" v-if="url.length > 0">{{ text }}</a>
    <template v-else>{{ text }}</template>
  </component>
</template>

<script>
import ElementMixin from '@/mixins/Element'

const availableSize = ['small', 'medium', 'large', 'xlarge', '2xlarge']

export default {
  name: 'ElementHeading',
  mixins: [ElementMixin],
  props: {
    tag: {
      type: String,
      default: 'h2'
    },
    text: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'small'
    }
  },

  computed: {
    sizeClass () {
      return 'uk-heading-' + (!availableSize.includes(this.size) ? 'small' : this.size)
    }
  }
}
</script>

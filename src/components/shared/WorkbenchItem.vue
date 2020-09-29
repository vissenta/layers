<script>
const validTypes = ['section', 'container', 'item']

export default {
  name: 'WorkbenchItem',
  functional: true,
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
  },
  render (h, { data, props, scopedSlots }) {
    const toolbox = h('div', {
      staticClass: 'layers-item-toolbox'
    })

    const staticClass = ['layers-item', 'layers-item--' + props.type]
    if (data.staticClass) {
      staticClass.push(...data.staticClass.split(' '))
    }

    return h(props.tag, {
      staticClass: staticClass.join(' '),
      class: data.class
    }, [toolbox, scopedSlots.default()])
  }
}
</script>

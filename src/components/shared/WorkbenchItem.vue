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
    },
    component: {
      type: String,
      required: true
    }
  },
  render (h, { data, props, scopedSlots, parent }) {
    const toolbox = h('div', {
      staticClass: 'layers-item-toolbox'
    })

    const staticClass = ['layers-item', 'layers-item--' + props.type]
    if (data.staticClass) {
      staticClass.push(...data.staticClass.split(' '))
    }

    const name = h('div', {
      staticClass: 'layers-item-name'
    }, [props.component])

    return h(props.tag, {
      staticClass: staticClass.join(' '),
      class: data.class
    }, [scopedSlots.default(), toolbox, name])
  }
}
</script>

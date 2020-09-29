<script>
export default {
  name: 'Icon',
  functional: true,
  props: {
    color: {
      type: String,
      default: 'currentColor'
    },
    path: {
      type: String,
      required: true
    },
    iconStyle: {
      type: Object,
      default: () => ({})
    },
    size: {
      type: [String, Number],
      default: null
    }
  },

  render (h, { data, props }) {
    const pathStyle = {}

    const { color, path, size, iconStyle: svgStyle } = props

    if (size !== null) {
      svgStyle.width = typeof size === 'string'
        ? size
        : `${size * 1.5}rem`
      svgStyle.height = svgStyle.width
    }

    if (color !== null) {
      pathStyle.fill = color
    }

    const pathElement = h('path', {
      style: pathStyle,
      attrs: {
        d: path
      }
    })

    const staticClass = data.staticClass || null

    return h('svg', {
      style: svgStyle,
      staticClass,
      attrs: {
        viewBox: '0 0 24 24'
      }
    }, [pathElement])
  }
}
</script>

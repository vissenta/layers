import { mapGetters } from 'vuex'
import { components } from '@/components/shared/elements'

const getDimensionsData = (event) => {
  let element = event.target

  if (element.nodeType === 3) {
    element = element.parentNode
  }
  // console.log({ event, element })

  if (!element.classList.contains('layers-drag-element')) {
    element = element.closest('.layers-drag-element')
  }

  if (!element) {
    console.warn('Detected an invalid Layers DOM hierarchy.')
    return
  }

  const {
    offsetTop,
    clientHeight
  } = element
  const {
    clientY
  } = event
  const {
    pageYOffset
  } = window

  const elementTop = offsetTop - pageYOffset
  const onTop = (clientY - elementTop) < (clientHeight / 2)

  return {
    element,
    onTop
  }
}
export default {
  components: {
    ...components,
    WorkbenchItem: () => import('@/components/shared/WorkbenchItem')
  },
  props: {
    id: {
      type: String
    },
    component: {
      type: String
    }
  },

  data () {
    return {
      standalone: true,
      notAllowed: [],

      _isInserting: false,

      ghost: null,
      lastOnTop: null,
      current: null
    }
  },

  computed: mapGetters(['dataTransfer']),

  methods: {
    handleDragStart ({ dataTransfer }) {
      this.$events.$emit('message:dataTransfer', { data: dataTransfer })
    },
    handleDragEnter (event) {
      if (event.target.nodeType === 3) return

      console.log('workbench::dragEnter', { event })

      if (this.dataTransfer.component?.id && (event.target.id === this.dataTransfer.component.id)) {
        return
      }

      const { onTop, element } = getDimensionsData(event)

      this.insertGhost(element, onTop)
      this.lastOnTop = onTop
    },
    handleDragLeave (event) {
      console.log('workbench::dragLeave', { event })

      let removeGhost = true
      let related = event.relatedTarget
      if (related && related.nodeType === 3) {
        related = related.parentNode
      }
      if ((related && related.closest('.layers-drop-area')) === this.$refs.dropElement.$el) {
        removeGhost = false
      }
      if (removeGhost) {
        this.removeGhost()
      }
    },
    handleDragOver (event) {
      event.stopPropagation()

      const dataTransfer = this.dataTransfer

      const { target } = event
      if (dataTransfer.component?.id && (target.id === dataTransfer.component.id)) {
        const { component: { id }, list } = dataTransfer
        const index = list.findIndex(item => item.id === id)

        if (list.length === 1) {
          return this.removeGhost()
        }

        let ref
        let onTop
        if (index === 0) {
          ref = list[1]
          onTop = true
        } else if (index === list.length - 1) {
          ref = list[list.length - 2]
          onTop = false
        } else {
          const data = getDimensionsData(event)

          if (data.onTop) {
            ref = list[index - 1]
          } else {
            ref = list[index + 1]
          }
          console.log({ ref })
          onTop = !data.onTop
        }

        ref = document.getElementById(ref.id)

        return this.insertGhost(ref, onTop)
      }

      const { onTop, element } = getDimensionsData(event)

      this.insertGhost(element, onTop)
      this.lastOnTop = onTop
    },
    handleDrop ({ dataTransfer, event }) {
      console.log('workbench::drop', { dataTransfer, event })

      this.removeGhost()
    },

    insertGhost (ref, onTop = true) {
      if (this._isInserting) return
      let el = this.ghost
      this._isInserting = true

      const tag = this.$options._componentTag

      if (!el) {
        el = document.createElement('div')
        el.className = 'layers-ghost'
        el.dataset.tag = tag

        const svgEl = document.createElement('div')
        svgEl.className = 'layers-ghost-icon'
        svgEl.insertAdjacentHTML('afterbegin', `<svg style="width:24px;height:24px" viewBox="0 0 24 24">
        <path fill="currentColor" d="M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z" />
    </svg>`)

        el.appendChild(svgEl)

        document.body.appendChild(el)
      }

      const position = {
        position: 'fixed',
        top: (ref.offsetTop - window.pageYOffset) + 'px',
        left: ref.offsetLeft + 'px',
        width: ref.clientWidth + 'px',
        height: ref.clientHeight + 'px'
      }

      Object.assign(el.style, position)

      el.classList.remove('layers-ghost--to-top', 'layers-ghost--to-bottom')
      el.classList.add(`layers-ghost--to-${onTop ? 'top' : 'bottom'}`)

      if (!this.ghost) {
        console.log('insert ghost')
        this.ghost = el
      }
      this._isInserting = false
    },

    removeGhost () {
      if (this.ghost !== null) {
        console.log('remove ghost')
        this.ghost.remove()
        this.ghost = null
      }
    }
  }
}

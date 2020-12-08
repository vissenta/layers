import { components } from '@/components/shared/elements'
import { insertGhost, removeGhost, getDimensionsData } from '@/utils/ghost'
import { dataTransfer } from '@/store/workbench'

console.log({ dataTransfer })

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
      current: null
    }
  },

  computed: {
    dataTransfer: () => dataTransfer.data
  },

  methods: {
    handleDragStart ({ dataTransfer }) {
      this.$events.$emit('message:dataTransfer', { data: dataTransfer })
    },
    handleDragEnter (event) {
      event.stopPropagation()
      if (event.target.nodeType === 3) return

      if (!event.target.id || (this.dataTransfer.component?.id && (event.target.id === this.dataTransfer.component.id))) {
        return
      }

      const { onTop, element } = getDimensionsData(event)

      insertGhost(element, onTop)
    },
    handleDragLeave (event) {
      const { target } = event
      if (target.nodeType === 3) return

      let remove = true
      // let related = (event.relatedTarget || event.toElement)
      // if (related && related.nodeType === 3) {
      //   related = related.parentNode
      // }
      // if ((related && related.closest('.layers-drop-area')) === this.$refs.dropElement.$el) {
      //   remove = false
      // }

      console.log({ target, drop: target.closest('.layers-drop-area'), dropRef: this.$refs.dropElement.$el })

      if (target.closest('.layers-drop-area') === this.$refs.dropElement.$el) {
        remove = false
      }

      if (remove) {
        removeGhost()
      }
    },
    handleDragOver (event) {
      event.stopPropagation()

      const dataTransfer = this.dataTransfer

      let { target } = event

      if (!target.classList.contains('layers-drag-element')) {
        target = target.closest('.layers-drag-element')
      }

      if (!target) {
        return
      }

      if (dataTransfer.component?.id && (target.id === dataTransfer.component.id)) {
        const { component: { id }, list } = dataTransfer
        const index = list.findIndex(item => item.id === id)

        if (list.length === 1) {
          return removeGhost()
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
          onTop = !data.onTop
        }

        ref = document.getElementById(ref.id)

        return insertGhost(ref, onTop)
      }

      const a = getDimensionsData(event)
      let { onTop, element } = a

      if (target.classList.contains('layers-drag-element--empty')) {
        onTop = undefined
      }

      insertGhost(element, onTop)
    },
    handleDrop ({ dataTransfer, event }) {
      const { onTop, element } = getDimensionsData(event)
      console.log('workbench::drop', { dataTransfer, event, onTop, id: element.id })

      if (dataTransfer?.data?.component?.id) {
        this.$events.$emit('move', { id: dataTransfer.data.component.id, onTop, target: element.id })
      } else {
        this.$events.$emit('insert', { data: dataTransfer, onTop, target: element.id })
      }

      removeGhost()
      this.$events.$emit('message:dataTransfer', { data: {} })
    },
    handleDragEnd () {
      removeGhost()
      this.$events.$emit('message:dataTransfer', { data: {} })
    }
  }
}

import { dataTransfer } from '@/store/workbench'

let _isInserting = false
export let ghost = null

export function insertGhost (ref, onTop) {
  if (_isInserting) return
  let el = ghost
  _isInserting = true

  const empty = typeof onTop === 'undefined'

  // const tag = this.$options._componentTag

  let helpText = 'Insert'
  if (dataTransfer?.data?.component?.id) {
    helpText = 'Move'
  }

  if (!el) {
    el = document.createElement('div')
    el.className = 'layers-ghost'
    // el.dataset.tag = tag

    const svgEl = document.createElement('div')
    svgEl.className = 'layers-ghost-icon'
    svgEl.insertAdjacentHTML('afterbegin', `<svg style="width:24px;height:24px" viewBox="0 0 24 24">
        <path fill="currentColor" d="M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z" />
    </svg>`)

    const emptyText = document.createElement('span')
    emptyText.className = 'layers-ghost-text'
    emptyText.textContent = helpText + ' here'

    el.appendChild(svgEl)
    el.appendChild(emptyText)

    document.body.appendChild(el)
  }
  el.dataset.text = helpText

  if (empty) {
    el.classList.add('layers-ghost--empty')
  } else {
    el.classList.remove('layers-ghost--empty')
  }

  const refRect = ref.getBoundingClientRect()

  const position = {
    position: 'fixed',
    top: (refRect.top - window.pageYOffset) + 'px',
    left: (refRect.left - window.pageXOffset) + 'px',
    width: ref.clientWidth + 'px',
    height: ref.clientHeight + 'px'
  }

  Object.assign(el.style, position)

  el.classList.remove('layers-ghost--to-top', 'layers-ghost--to-bottom')
  if (!empty) {
    el.classList.add(`layers-ghost--to-${onTop ? 'top' : 'bottom'}`)
  }

  if (!ghost) {
    console.log('insert ghost')
    ghost = el
  }
  _isInserting = false
}

export function removeGhost () {
  if (ghost !== null) {
    console.log('remove ghost')
    ghost.remove()
    ghost = null
  }
}

export function getDimensionsData (event) {
  let element = event.target

  if (element.nodeType === 3) { // Text Node
    element = element.parentNode
  }

  if (!element.classList.contains('layers-drag-element')) {
    element = element.closest('.layers-drag-element')
  }

  if (!element) {
    console.warn('Detected an invalid Layers DOM hierarchy.')
    return
  }

  const rect = element.getBoundingClientRect()

  const {
    top,
    height
  } = rect
  const {
    clientY
  } = event
  const {
    pageYOffset
  } = window

  const elementTop = top - pageYOffset
  const onTop = (clientY - elementTop) < (height / 2)

  return {
    element,
    onTop
  }
}

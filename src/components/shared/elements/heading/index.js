import { mdiFormatTextVariant } from '@mdi/js'

export default {
  name: 'Heading',
  standalone: true,
  group: 'basic',
  icon: mdiFormatTextVariant,
  schema: {
    tag: {
      type: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5'],
      default: 'h1'
    },
    text: {
      type: 'text',
      default: 'Brand new heading'
    },
    url: {
      type: 'text',
      default: ''
    },
    size: {
      type: 'select',
      options: ['small', 'medium', 'large', 'xlarge', '2xlarge'],
      default: 'small'
    }
  },
  component: () => import('./component')
}

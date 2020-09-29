import { mdiFormatTextVariant } from '@mdi/js'

export default {
  name: 'Heading',
  standalone: true,
  group: 'basic',
  icon: mdiFormatTextVariant,
  schema: {

  },
  component: () => import('./component')
}

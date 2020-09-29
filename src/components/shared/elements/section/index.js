import { mdiCheckboxBlankOutline } from '@mdi/js'

export default {
  name: 'Section',
  standalone: true,
  group: 'basic',
  icon: mdiCheckboxBlankOutline,
  schema: {

  },
  component: () => import('./component')
}

import { mdiCheckboxBlankOutline } from '@mdi/js'

export default {
  name: 'Container',
  standalone: true,
  group: 'basic',
  icon: mdiCheckboxBlankOutline,
  schema: {

  },
  component: () => import('./component')
}

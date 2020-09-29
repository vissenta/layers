import { mdiViewGridOutline } from '@mdi/js'

export default {
  name: 'Grid',
  standalone: true,
  group: 'basic',
  icon: mdiViewGridOutline,
  schema: {

  },
  component: () => import('./component')
}

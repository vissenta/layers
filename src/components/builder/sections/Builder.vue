<template>
  <div class="pt-2">
    <p class="px-6 text-2xl">Builder</p>

    <div v-if="!isLoading" class="mt-4 px-6">
      <div v-for="(group, groupKey) in groups" :key="groupKey">
        <span class="block text-sm uppercase mb-2 font-medium text-gray-700">{{ groupKey }}</span>
        <ul class="grid grid-cols-2 gap-2 pb-2">
          <drag v-for="element in group" :key="element.name.toLowerCase()" :data-transfer="element" @dragstart="handleDragStart"
            class="bg-white flex flex-col h-24 justify-center items-center hover:shadow-md cursor-move hover:text-indigo-400">
            <icon :path="element.icon" v-if="element.icon" :size="2" />
            <span class="text-sm mt-1">{{ element.name }}</span>
          </drag>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Elements from '@/components/shared/elements'

const groups = Object.values(Elements).filter(element => element.standalone).reduce((acc, element) => {
  if (!acc[element.group]) acc[element.group] = []
  delete element.component
  acc[element.group].push(element)
  return acc
}, {})

export default {
  name: 'SidebarSectionBuilder',
  components: {
    Drag: () => import('@/components/shared/Drag'),
    Icon: () => import('@/components/shared/Icon')
  },
  data () {
    return {
      isLoading: true,
      groups: {}
    }
  },

  created () {
    console.log('created')
  },

  mounted () {
    console.log('mounted')
    this.groups = Object.freeze(groups)
  },

  watch: {
    groups (value) {
      console.log('watch groups')
      if (Object.keys(value).length) {
        this.isLoading = false
      }
    }
  },

  methods: {
    handleDragStart ({ dataTransfer }) {
      console.log('dragStart', { dataTransfer })
      this.$message.sendNotification('dataTransfer', dataTransfer)
    }
  }
}
</script>

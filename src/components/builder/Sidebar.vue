<template>
  <div class="h-screen">
    <div class="text-center py-4 text-xl font-medium bg-gray-300">
      Layers
    </div>
    <div class="h-12 px-6 flex items-center">
      <transition name="fade">
        <a href="javascript:;" v-if="previousSection.length > 0" @click="handleBackSection" class="flex items-center">
          <icon :path="arrowIconPath" :size="0.75" class="mr-2" /> {{ previousSection[previousSection.length -1][0] || '' }}
        </a>
      </transition>
    </div>
    <div class="relative overflow-x-hidden flex flex-no-wrap">
      <transition :name="'slide-' + switchDirection">
        <component :is="activeSection" ref="section" v-bind="sectionProps" class="w-full flex-shrink-0"
          @go-to-previous-section="handleBackSection" @go-to-section="handleSwitchSection" />
      </transition>
    </div>
  </div>
</template>

<script>
import { mdiArrowLeft } from '@mdi/js'

export default {
  name: 'Sidebar',

  components: {
    Home: () => import('@/components/builder/sections/Home'),
    Builder: () => import('@/components/builder/sections/Builder'),
    Page: () => import('@/components/builder/sections/Page'),
    Icon: () => import('@/components/shared/Icon')
  },

  data () {
    return {
      activeSection: 'Home',
      previousSection: [],
      switchDirection: '',
      sectionProps: {},

      arrowIconPath: mdiArrowLeft
    }
  },

  methods: {
    handleBackSection () {
      this.switchDirection = 'right'
      const previousSection = this.previousSection.pop()
      this.activeSection = previousSection[0]
      this.sectionProps = previousSection[1]
    },
    handleSwitchSection (section, props = {}) {
      this.switchDirection = 'left'
      this.sectionProps = props
      this.previousSection.push([this.activeSection, props])
      this.activeSection = section
    }
  }
}
</script>

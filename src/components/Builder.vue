<template>
  <div class="flex h-screen">
    <div class="w-84 bg-gray-200 overflow-y-hidden">
      <sidebar />
    </div>
    <div class="shadow-xl flex-grow">
      <iframe src="http://localhost:8080/?workbench" frameborder="0" class="w-full h-full" ref="workbench" />
    </div>
  </div>
</template>

<script>
import Sidebar from '@/components/builder/Sidebar'
export default {
  name: 'BuilderFrame',
  components: { Sidebar },

  mounted () {
    this.$store.commit('setAppElement', this.$refs.workbench)
  }
}
</script>

<style>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  .fade-enter-active, .fade-leave-active {
    transition: opacity .3s ease-in-out;
  }
  .fade-enter, .fade-leave-to {
      opacity: 0;
  }

  .slide-right-enter-active, .slide-right-leave-active,
  .slide-left-enter-active, .slide-left-leave-active {
      transition: transform .3s ease-in-out;
  }
  .slide-right-enter-active {
      transform: translateX(-200%);
  }
  .slide-right-leave-active {
      transform: translateX(0);
  }
  .slide-left-enter-to, .slide-left-leave-to, .slide-right-enter-to {
      transform: translateX(-100%);
  }
  .slide-right-leave-to {
      transform: translateX(100%);
  }
</style>

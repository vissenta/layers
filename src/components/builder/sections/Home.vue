<template>
  <ul class="block text-center uppercase">
    <li class="main-menu__item" v-for="item in items" :key="item.key">
      <a href="javascript:;" class="block py-3 text-gray-700 hover:bg-gray-300 transition-colors duration-200" @click="$emit('go-to-section', item.key)">
        {{ item.text }}
      </a>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'SidebarSectionHome',

  data () {
    return {
      items: [
        { key: 'page', text: 'Page' },
        { key: 'builder', text: 'Builder' },
        { key: 'test1', text: 'test' },
        { key: 'test2', text: 'test' },
        { key: 'test3', text: 'test' }
      ]
    }
  }
}
</script>

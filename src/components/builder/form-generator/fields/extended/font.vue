<template>
  <b-form-group :label="field.label" label-cols="4">

    <div class="fg-font__select" v-click-outside="closeSelect">
      <div class="fg-font__selected" @click="pickerOpen = !pickerOpen" :class="{ 'fg-font__selected--open': pickerOpen }">
        {{ internalValue }}
      </div>
      <div class="fg-font__options" ref="options" :class="{ 'fg-font__options--open': pickerOpen }">
        <div v-for="font in internalFonts" ref="option" @click="handleChange(font.family)" :key="font.family"
          class="fg-font__option" :data-family="font.family" :style="'font-family: \'' + font.family + '\''" :class="{ 'fg-font__option--selected': font.family === internalValue }">
          {{ font.family }}
        </div>
      </div>
    </div>
  </b-form-group>
</template>

<script>
import VClickOutside from 'v-click-outside/src/index'

export default {
  name: 'FGFont',
  directives: {
    ClickOutside: VClickOutside.directive
  },
  props: {
    field: {
      type: Object,
      required: true
    },
    value: {
      type: [String, Object],
      required: true
    },
    currentLanguage: {
      type: String,
      required: true
    }
  },

  beforeCreate () {
    this.$store.dispatch('FETCH_FONTS')
  },
  mounted () {
    this.intersectionObserver = new IntersectionObserver(this.observeOptions, {
      root: this.$refs.options,
      rootMargin: '100px',
      threshold: 1
    })

    this.$refs.option.forEach(el => this.intersectionObserver.observe(el))
  },
  beforeUpdate () {
    this.$refs.option.forEach(el => this.intersectionObserver.unobserve(el))
  },
  updated () {
    this.$refs.option.forEach(el => this.intersectionObserver.observe(el))
  },
  beforeDestroy () {
    this.intersectionObserver.disconnect()
    this.intersectionObserver = null
  },
  data () {
    return {
      pickerOpen: false,
      internalSearch: '',
      intersectionObserver: null,
      internalValue: this.value
    }
  },
  computed: {
    internalFonts () {
      return this.fonts.filter(font => font.family.includes(this.internalSearch))
    },
    fonts () {
      return this.$store.getters.fonts
    }
  },
  watch: {
    value (value) {
      this.internalValue = value
    }
  },
  methods: {
    observeOptions (entries) {
      for (const entry of entries) {
        if (entry.intersectionRatio === 1) {
          this.loadFont(entry.target.dataset.family)
          this.intersectionObserver.unobserve(entry.target)
        }
      }
    },
    isLoadedFont (family) {
      return document.getElementById('font-' + family)
    },
    loadFont (family) {
      const familyLowerCase = family.replace(/ /g, '-').toLowerCase()
      if (this.isLoadedFont(familyLowerCase)) return

      var apiUrl = []
      apiUrl.push('https://fonts.googleapis.com/css?family=')
      apiUrl.push(family.replace(/ /g, '+'))
      apiUrl.push('&subset=latin-ext')

      const style = document.createElement('link')
      Object.assign(style, {
        id: 'font-' + familyLowerCase,
        rel: 'stylesheet',
        type: 'text/css',
        href: apiUrl.join('')
      })
      document.head.appendChild(style)
    },
    closeSelect () {
      this.pickerOpen = false
    },
    handleChange (value, lang = null) {
      if (lang) {
        this.internalValue[lang] = value
      } else {
        this.internalValue = value
      }
      this.pickerOpen = false
      this.$emit('change', this.internalValue)
    }
  }
}
</script>

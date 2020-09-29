<template>
  <b-form-group :label="field.label" label-cols="10">
    <div class="fg-color__colors" v-click-outside="hidePicker">
      <b-link @click="pickerOpen = !pickerOpen">
        <div class="fg-color__color" :style="{ backgroundColor: internalValue }" />
      </b-link>
      <div v-if="pickerOpen" class="fg-color__picker">
        <color-picker :value="internalValue" @input="handleChange($event.hex)" :disable-alpha="true" />
      </div>
    </div>
  </b-form-group>
</template>

<script>
import { Chrome } from 'vue-color'
import vClickOutside from 'v-click-outside/src/index'

export default {
  name: 'FGColor',
  components: { ColorPicker: Chrome },
  directives: {
    clickOutside: vClickOutside.directive
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
  data () {
    return {
      pickerOpen: false,
      internalValue: this.value
    }
  },
  watch: {
    value (value) {
      this.internalValue = value
    }
  },
  methods: {
    hidePicker () {
      this.pickerOpen = false
    },
    handleChange (value, lang = null) {
      if (lang) {
        this.internalValue[lang] = value
      } else {
        this.internalValue = value
      }
      this.$emit('change', this.internalValue)
    }
  }
}
</script>

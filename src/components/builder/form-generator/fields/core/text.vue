<template>
  <b-form-group :label="typeof field.showTitle === 'undefined' || (field.showTitle && field.showTitle === true) ? field.label : ''">
    <template v-if="field.translatable">
      <b-input-group v-for="lang in Object.keys(internalValue)" :key="lang" v-show="lang === currentLanguage">
        <b-form-textarea :value="internalValue[lang]" @change="handleChange($event, lang)" no-resize rows="4" />
        <b-input-group-text slot="append">
          <img :src="'/panel/templates/images/flags/' + lang + '.gif'" :alt="lang" />
        </b-input-group-text>
      </b-input-group>
    </template>
    <b-form-textarea v-else :value="internalValue" @change="handleChange" no-resize rows="4" />
  </b-form-group>
</template>

<script>
export default {
  name: 'FGText',

  props: {
    field: {
      type: Object,
      required: true
    },
    value: {
      type: [String, Number, Object],
      required: true
    },
    currentLanguage: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      internalValue: this.value
    }
  },
  watch: {
    value (value) {
      this.internalValue = value
    }
  },
  methods: {
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

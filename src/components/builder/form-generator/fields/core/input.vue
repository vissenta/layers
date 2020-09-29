<template>
  <b-form-group :label="typeof field.showTitle === 'undefined' || (field.showTitle && field.showTitle === true) ? field.label : ''">
    <template #description v-if="field.description && field.description.trim() !== ''">
      <span v-html="field.description" />
    </template>
    <template v-if="field.translatable">
      <b-input-group v-for="lang in Object.keys(internalValue)" :key="lang" v-show="lang === currentLanguage">
        <b-form-input :type="field.inputType || 'text'"
          :value="internalValue[lang]" @change="handleChange($event, lang)" />
        <b-input-group-text slot="append">
          <img :src="'/panel/templates/images/flags/' + lang + '.gif'" :alt="lang" />
        </b-input-group-text>
      </b-input-group>
    </template>
    <b-form-input v-else :type="field.inputType || 'text'" :value="internalValue" @change="handleChange" />
  </b-form-group>
</template>

<script>
export default {
  name: 'FGInput',

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

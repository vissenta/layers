<template>
  <b-form-group :label="internalField.showTitle ? internalField.label : ''">
    <template v-if="internalField.translatable">
      <b-input-group v-for="lang in Object.keys(internalValue)" :key="lang" v-show="lang === currentLanguage">
        <input-number v-bind="internalField.options" :value="internalValue[lang]"
          @onInputNumberChange="handleChange($event, lang)" />
        <b-input-group-text slot="append">
          <img :src="'/panel/templates/images/flags/' + lang + '.gif'" :alt="lang" />
        </b-input-group-text>
      </b-input-group>
    </template>
    <input-number v-else v-bind="internalField.options" :value="internalValue" @onInputNumberChange="handleChange($event)"
      inputclass="form-control" />
  </b-form-group>
</template>

<script>
import _cloneDeep from 'lodash.clonedeep'
import InputNumber from 'vue-input-number'

export default {
  name: 'FGInputNumber',
  components: { InputNumber },
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
      internalField: {},
      internalValue: this.value
    }
  },
  created () {
    const defaults = {
      min: 0,
      max: 999999,
      step: 1,
      integer: true,
      maxlength: 6
    }

    const field = _cloneDeep(this.field)
    field.options = Object.assign({}, defaults, field.options || {})

    this.internalField = field
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

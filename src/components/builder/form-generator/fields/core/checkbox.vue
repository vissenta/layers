<template>
  <b-form-group :label="field.label">
    <template v-if="field.translatable">
      <b-row v-for="lang in Object.keys(internalValue)" :key="lang" v-show="lang === currentLanguage" class="align-items-center">
        <b-col cols="auto" class="pr-0">
          <b-form-checkbox :switch="field.inputType === 'switch'" size="lg"
            :checked="internalValue[lang]" @change="handleChange($event, lang)" />
        </b-col>
        <b-col>
          <img :src="'/panel/templates/images/flags/' + lang + '.gif'" :alt="lang" />
        </b-col>
      </b-row>
    </template>
    <b-form-checkbox v-else :switch="field.inputType === 'switch'" size="lg" :checked="internalValue" @change="handleChange">
      {{ field.description }}
    </b-form-checkbox>
  </b-form-group>
</template>

<script>
export default {
  name: 'FGCheckbox',

  props: {
    field: {
      type: Object,
      required: true
    },
    value: {
      type: [Number, String, Boolean, Object],
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
      let externalValue = this.internalValue
      if (this.field.integer) {
        if (lang) {
          externalValue = Object.fromEntries(Object.entries(this.internalValue).map(([key, value]) => {
            return [key, value === true ? '1' : '0']
          }))
        } else {
          externalValue = this.internalValue === true ? '1' : '0'
        }
      }
      this.$emit('change', externalValue)
    }
  }
}
</script>

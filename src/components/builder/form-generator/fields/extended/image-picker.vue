<template>
  <b-form-group :label="field.label">
    <template #description v-if="field.description && field.description.trim() !== ''">
      <span v-html="field.description" />
    </template>

    <div class="fg-image-picker__placeholder" v-if="internalValue === ''" @click="mediaManagerOpen = true">
      <i class="mdi mdi-image fg-image-picker__placeholder-icon" />
      <span class="fg-image-picker__placeholder-text">Kliknij, aby wybrać zdjęcie.</span>
    </div>
    <div v-else class="fg-image-picker__image-container">
      <img class="fg-image-picker__image" :src="imageUrl" alt="" />

      <b-button class="fg-image-picker__image-remove" variant="danger" @click="handleChange('')">
        Usuń obrazek
      </b-button>
    </div>

    <media-manager-modal v-model="mediaManagerOpen" @selected="handleChange" fileType="image" :type="field.imageType || 'custom_content'" />
  </b-form-group>
</template>

<script>
import MediaManagerModal from '@/components/media-manager/modal'

export default {
  name: 'FGImagePicker',
  components: { MediaManagerModal },

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
      mediaManagerOpen: false,
      internalValue: this.value
    }
  },

  watch: {
    value (value) {
      this.internalValue = value
    }
  },

  computed: {
    imageUrl () {
      return 'https://static1.redcart.pl/templates/images/thumb/' + window.RC_DATA.shop_id + '/600/600/pl/0/templates/images/' + this.field.imageType + '/' + window.RC_DATA.shop_id + '/' + this.internalValue
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

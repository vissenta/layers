<template>
  <b-form-group :label="field.label">
    <div class="fg-image-preview">
      <img v-if="imageSrc !== ''" :src="imageUrl" alt="">

      <input type="file" v-if="imageSrc === ''" @change="handleChange">
      <span v-if="error !== ''"></span>
    </div>
  </b-form-group>
</template>

<script>
export default {
  name: 'FGImageFile',
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

  created () {
    if (this.value !== '') {
      this.imageSrc = this.value
      this.uploaded = true
    }
  },
  data () {
    return {
      error: '',
      maxFileSize: 5, // in MB
      imageSrc: '',
      uploaded: false
    }
  },
  computed: {
    imageType () {
      return this.field.imageType || 'custom_content'
    },
    imageUrl () {
      /* eslint-disable-next-line no-undef */
      return 'https://static1.redcart.pl/templates/images/thumb/' + RC_DATA.shop_id + '/600/600/pl/0/templates/images/' + this.imageType + '/' + RC_DATA.shop_id + '/' + this.imageSrc
    }
  },
  methods: {
    async handleChange (e) {
      const file = Array.from(e.target.files).map(file => {
        file.sizeKb = Math.round((file.size / 1024) * 100) / 100
        file.sizeMb = Math.round((file.sizeKb / 1024) * 100) / 100
        return file
      })[0]

      if (file.sizeMb > this.maxFileSize) {
        this.error = 'Maksymalny rozmiar pliku to ' + this.maxFileSize + ' MB'
        return
      }
      this.error = ''

      // const reader = new FileReader()

      // reader.addEventListener('loadend', () => (this.imageSrc = reader.result))
      // reader.readAsDataURL(file)

      const imageData = {
        name: file.name,
        file,
        type: this.field.imageType,
        lang: 'pl'
      }

      console.log(file, imageData)

      try {
        const result = await this.$store.dispatch('UPLOAD_IMAGE', imageData)
        console.log(result)
        this.imageSrc = result.filename
        this.uploaded = true

        this.$emit('change', result.filename)
      } catch (error) {
        console.error({ status: 'UPLOAD_IMAGE_ERROR', error })
      }
    }
  }
}
</script>

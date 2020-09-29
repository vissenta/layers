<template>
  <div class="field-product-picker">
    <b-row class="mb-2" align-v="center">
      <b-col>
        <strong>Wybrane produkty</strong>
      </b-col>
      <b-col cols="auto">
        <b-button @click="pickerOpen = true" size="sm" variant="primary">Dodaj produkty</b-button>
      </b-col>
    </b-row>
    <b-table-lite outlined striped v-if="internalValue.length > 0" small :fields="internalFields" :items="internalItems">
      <template #cell(order)="{ index }">
        <b-link v-if="index > 0" size="sm" @click="moveProduct('up', index)">
          <i class="mdi mdi-chevron-up"></i>
        </b-link>
        <b-link v-if="index < internalValue.length - 1" size="sm" @click="moveProduct('down', index)">
          <i class="mdi mdi-chevron-down"></i>
        </b-link>
      </template>
      <template #cell(actions)="{ item }">
        <b-link class="text-danger" @click="removeProduct(item.products_id)">
          <i class="mdi mdi-close"></i>
        </b-link>
      </template>
    </b-table-lite>
    <div v-else>
      Nie wybrano żadnych produktów.
    </div>
    <ProductPicker :open="pickerOpen" @close="pickerOpen = false" :selected="internalValue" @change="handleChange" />
  </div>
</template>

<script>
import ProductPicker from '@/components/product-picker'

export default {
  name: 'FGProductPicker',
  components: { ProductPicker },
  props: {
    field: {
      type: Object,
      required: true
    },
    value: {
      type: [Array, Object],
      required: true
    },
    currentLanguage: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      internalValue: this.value,
      internalItems: [],
      internalFields: [
        { key: 'products_name', label: 'Nazwa produktu' },
        { key: 'order', label: 'Kolejność' },
        { key: 'actions', label: 'Usuń', class: 'text-center' }
      ],
      pickerOpen: false
    }
  },
  watch: {
    value (value) {
      this.internalValue = value
    },
    internalValue: {
      immediate: true,
      deep: true,
      handler (value) {
        this.getProducts()
      }
    }
  },
  methods: {
    handleChange (value, lang = null) {
      console.log('editor::productPicker::handleChange', value)

      value = value.map(v => parseInt(v)).filter(v => !(lang ? this.internalValue[lang] : this.internalValue).includes(v))

      console.log(value)

      if (lang) {
        this.internalValue[lang] = this.internalValue[lang].concat(value)
      } else {
        this.internalValue = this.internalValue.concat(value)
      }
      this.$emit('change', this.internalValue)
    },

    async getProducts () {
      if (this.internalValue.length === 0) return
      const options = {
        skip_categories: true,
        skip_producers: true,
        skip_deliverers: true,
        currentPage: 1,
        perPage: this.internalValue.length,
        filter: {
          product_ids: this.internalValue,
          'p.products_id1': '',
          'p.products_id2': '',
          'p.products_name': '',
          'p.products_price1': '',
          'p.products_price2': '',
          'p.quantity1': '',
          'p.quantity2': '',
          'p.products_model': '',
          products_status: 'all',
          categories_id: '',
          prices: 'brutto',
          producer_id: '',
          deliver_id: ''
        }
      }

      const { products } = await this.$store.dispatch('FETCH_PRODUCTS', options)

      const productsMap = products.reduce((acc, product, idx) => {
        acc[parseInt(product.products_id)] = idx
        return acc
      }, {})

      this.internalItems = this.internalValue.map(id => products[productsMap[id]])
    },

    moveProduct (direction, idx) {
      const newIdx = direction === 'up' ? idx - 1 : idx + 1
      this.internalValue.splice(newIdx, 0, this.internalValue.splice(idx, 1)[0])
    },

    removeProduct (id) {
      const idx = this.internalValue.indexOf(parseInt(id))
      if (idx !== -1) {
        this.internalValue.splice(idx, 1)
      }
    }
  }
}
</script>

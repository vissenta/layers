<template>
  <component :is="collapsible ? 'div' : 'b-list-group'" v-bind="!collapsible ? { flush: true } : {}">
    <component :is="collapsible ? 'div' : 'b-list-group-item'" class="px-0 text-right">
      <b-button @click="addItem">Add item</b-button>
    </component>
    <div class="fg-collection__items" :class="{ 'fg-collection__items--collapsible': collapsible }"
      v-sortable:internalModel="{ animation: 200, methodName: 'handleInternalModelSort', handle: '.fg-collection__item-drag-handler' }">
      <div v-for="(model, modelIdx) in internalModel" :key="model.id" class="fg-collection__item">
        <div v-if="collapsible" class="fg-collection__header d-flex" v-b-toggle="'collection-item-' + model.id">
          <span class="fg-collection__item-drag-handler mr-3">
            <i class="mdi mdi-arrow-all"></i>
          </span>
          <span>Slide #{{ modelIdx }}</span>

          <b-link @click.stop="removeItem(modelIdx)" class="text-danger ml-auto" size="sm">
            <i class="mdi mdi-close"></i>
          </b-link>
        </div>
        <component :is="collapsible ? 'b-collapse' : 'template'" v-bind="{ 'accordion': 'collection' }" :id="'collection-item-' + model.id"
          :class="{ 'fg-collection__body': collapsible }">
          <div class="fg-collection__item-drag-handler" v-if="sortable && !collapsible">drag</div>
          <template v-for="(f, fIdx) in fields">
            <div :key="fIdx" class="form-generator__item" :class="{ ['fg-' + f.type]: true, 'form-generator__item--small': f.small }">
              <component v-if="f.show || typeof f.show === 'undefined'" :is="'f-g-' + f.type" :field="f" :currentLanguage="currentLanguage"
                :value="internalModel[modelIdx][f.model]" @change="handleChange($event, modelIdx, f)" />
            </div>
          </template>
        </component>
      </div>
    </div>
    <component :is="collapsible ? 'div' : 'b-list-group-item'" v-if="internalModel.length > 0" class="px-0 text-right">
      <b-button @click="addItem">Add item</b-button>
    </component>
  </component>
</template>

<script>
import nanoid from 'nanoid'
import _cloneDeep from 'lodash/cloneDeep'

import SortableDirective from '@/directives/sortable'

import FGInput from '../core/input'
import FGSelect from '../core/select'
import FGCheckbox from '../core/checkbox'
import FGImageFile from '../core/image-file'

// Extended Inputs
import FGImagePicker from './image-picker'
import FGProductPicker from './product-picker'

export default {
  name: 'FGCollection',
  components: {
    FGInput, FGSelect, FGCheckbox, FGImageFile, FGImagePicker, FGProductPicker
  },
  directives: { SortableDirective },
  props: {
    field: {
      type: Object,
      required: true
    },
    value: {
      type: Array,
      required: true
    },
    currentLanguage: {
      type: String,
      required: true
    }
  },
  created () {
    this.modelSchema = _cloneDeep(Object.values(this.field.collection.model)[0])
    this.fields = _cloneDeep(this.field.collection.fields.map(field => {
      field.model = field.model.replace(this.field.id + '.', '')
      return field
    }))
  },
  mounted () {
    this.sortable = typeof this.field.sortable === 'undefined' || (this.field.sortable && this.field.sortable === true)
    this.collapsible = typeof this.field.collapsible !== 'undefined' && this.field.collapsible === true
  },
  data () {
    return {
      sortable: true,
      collapsible: false,
      fields: [],
      internalSchema: {},
      internalModel: [],
      modelSchema: {}
    }
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler (value) {
        this.internalModel = _cloneDeep(value)
      }
    }
  },
  methods: {
    addItem () {
      this.internalModel.push(_cloneDeep(Object.assign({}, this.modelSchema, { id: nanoid(5) })))
      this.$emit('change', this.internalModel)
    },
    removeItem (idx) {
      this.internalModel.splice(idx, 1)
      this.$emit('change', this.internalModel)
    },
    handleChange (value, idx, field) {
      this.internalModel[idx][field.model] = value
      this.$emit('change', this.internalModel)
    },

    handleInternalModelSort (arr, newIdx, oldIdx) {
      if (newIdx === oldIdx) return
      this.internalModel = arr

      this.$emit('change', this.internalModel)
    }
  }
}
</script>

import get from '@/utils'
import set from 'lodash.set'
import cloneDeep from 'lodash.clonedeep'
import transform from 'lodash.transform'
import isEqual from 'lodash.isequal'
import isObject from 'lodash.isobject'
import eq from 'lodash.eq'
import gt from 'lodash.gt'
import gte from 'lodash.gte'
import lt from 'lodash.lt'
import lte from 'lodash.lte'

// Core Inputs
import FGInput from './fields/core/input'
import FGInputNumber from './fields/core/input-number'
import FGSelect from './fields/core/select'
import FGCheckbox from './fields/core/checkbox'
import FGText from './fields/core/text'

// Extended Inputs
import FGCollection from './fields/extended/collection'
import FGColor from './fields/extended/color'
import FGFont from './fields/extended/font'
import FGImagePicker from './fields/extended/image-picker'
import FGProductPicker from './fields/extended/product-picker'

/**
 * Condition operators:
 *
 * eq - equals
 * ne - not queals
 * lt - less than
 * gt - greater than
 * lte - less or equal
 * gte - greater or equal
 */

function _difference (object, base) {
  function changes (object, base) {
    return transform(object, (result, value, key) => {
      if (!isEqual(value, base[key])) {
        result[key] = (isObject(value) && isObject(base[key])) ? changes(value, base[key]) : value
      }
    })
  }
  return changes(object, base)
}

export default {
  name: 'form-generator',
  components: {
    FGInput, FGInputNumber, FGSelect, FGCheckbox, FGText, FGCollection, FGColor, FGFont, FGImagePicker, FGProductPicker
  },
  props: {
    schema: {
      type: Object,
      required: true
    },
    value: {
      type: Object,
      required: true
    },
    languages: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      conditions: {},
      model: {},
      oldModel: {},
      currentLanguage: 'pl',
      showLanguagePicker: true,
      showTabs: true,
      internalSchema: {}
    }
  },
  created () {
    this.prepareSchema()
  },
  mounted () {
    this.updateModel()
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler (value) {
        this.model = value
      }
    },
    model: {
      deep: true,
      handler (value) {
        const changed = _difference(value, this.oldModel)
        this.updateSchema(changed)
        this.updateModel()
        this.$emit('input', value)
      }
    }
  },
  methods: {
    updateModel () {
      this.oldModel = cloneDeep(this.model)
    },
    prepareSchema () {
      const schema = cloneDeep(this.schema)
      let hasTranslatableFields = false

      const conditions = {}
      schema.groups.forEach((group, groupIdx) => {
        group.fields && group.fields.forEach((field, fieldIdx) => {
          let show = true
          if (field.translatable && field.translatable === true) hasTranslatableFields = true

          if (field.conditions && Array.isArray(field.conditions)) {
            field.conditions.forEach(condition => {
              if (typeof conditions[group.id + '.' + condition.field] === 'undefined') {
                conditions[group.id + '.' + condition.field] = []
              }
              const idx = conditions[group.id + '.' + condition.field].findIndex(econdition => {
                return condition.value === econdition.value && condition.operator === econdition.operator
              })
              if (idx === -1) {
                conditions[group.id + '.' + condition.field].push({
                  value: condition.value,
                  operator: condition.operator,
                  fields: [group.id + '.' + field.id]
                })
              } else {
                conditions[group.id + '.' + condition.field][idx].fields.push(group.id + '.' + field.id)
              }

              const conditionValue = get(this.model, group.id + '.' + condition.field)
              show = this.checkCondtion(condition.value, condition.operator, conditionValue)
            })
          }
          set(schema.groups, '[' + groupIdx + '].fields[' + fieldIdx + '].show', show)
        })
      })

      this.showTabs = schema.groups.length > 1
      this.showLanguagePicker = hasTranslatableFields
      this.conditions = conditions
      this.internalSchema = schema
    },
    updateSchema (change) {
      const changes = Object.entries(change).reduce((acc, [group, changed]) => {
        Object.entries(changed).forEach(([field, value]) => (acc[group + '.' + field] = value))
        return acc
      }, {})

      const changedFields = Object.entries(changes)
      changedFields.forEach(([field, fieldVal]) => {
        if (Object.keys(this.conditions).includes(field)) {
          const fields = this.conditions[field].reduce((acc, { value, operator, fields }) => {
            fields.forEach(cField => {
              acc[cField] = { value, operator, otherValue: fieldVal }
            })
            return acc
          }, {})

          Object.entries(fields).forEach(([field, { value, operator, otherValue }]) => {
            const [groupId, fieldName] = field.split('.')
            const groupIdx = this.internalSchema.groups.findIndex(group => group.id === groupId)
            const fieldIdx = this.internalSchema.groups[groupIdx].fields.findIndex(field => field.id === fieldName)
            set(this.internalSchema.groups, '[' + groupIdx + '].fields[' + fieldIdx + '].show', this.checkCondtion(value, operator, otherValue))
          })
        }
      })
    },
    checkCondtion (value, operator, otherValue) {
      let passed = false
      switch (operator) {
        case 'eq':
          passed = eq(value, otherValue)
          break
        case 'ne':
          passed = !eq(value, otherValue)
          break
        case 'lt':
          passed = lt(otherValue, value)
          break
        case 'lte':
          passed = lte(otherValue, value)
          break
        case 'gt':
          passed = gt(otherValue, value)
          break
        case 'gte':
          passed = gte(otherValue, value)
          break
      }

      return passed
    },
    getValue (field) {
      const fieldModel = this.getModel(field)
      const fieldValue = get(this.model, fieldModel)
      return typeof fieldValue !== 'undefined' ? fieldValue : ''
    },
    handleChange (value, field) {
      const fieldModel = this.getModel(field)
      set(this.model, fieldModel, value)
    },

    getModel (field) {
      let fieldModel = field.model
      if (field.translatable) {
        fieldModel = Object.values(field.model)[0].split('.')
        fieldModel.pop()
      }
      return fieldModel
    }
  }
}

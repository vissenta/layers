<template>
  <div class="form-generator">
    <b-tabs content-class="py-4" :nav-class="{ 'form-generator__tabs': true, 'd-none': !showTabs && !showLanguagePicker}">
      <b-tab v-for="(group, index) in internalSchema.groups" :key="index" :title="group.legend">
        <div class="form-generator__items">
          <template v-for="(field, fieldIdx) in group.fields">
            <div :key="fieldIdx" class="form-generator__item" :class="{ ['fg-' + field.type]: true, 'form-generator__item--small': field.small }">
              <component v-if="field.show" :is="'f-g-' + field.type" :field="field" :currentLanguage="currentLanguage"
                :value="getValue(field)" @change="handleChange($event, field)" />
            </div>
          </template>
        </div>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script src="./script" />

/**
 * Global Event Bus to send and receive events across whole application
 */
import Vue from 'vue'

const Events = new Vue()

Vue.prototype.$events = Events

export default Events

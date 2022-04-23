import Vue from 'vue'
import App from './App'
import noMore from './components/no_more.vue'
import loadingMore from './components/bottom_loading.vue'
import goodList from './index/components/good_list.vue'
import noData from './components/no_data.vue'
import checkBox from './components/check_box.vue'
import globe from 'globe'
import { store } from './stroe'
// #ifdef H5
import jweixin from 'jweixin-module'
// #endif
import serverImg from './components/server_img.vue'

Vue.config.productionTip = false

Vue.component('noMore', noMore)
Vue.component('goodList', goodList)
Vue.component('noData', noData)
Vue.component('checkBox', checkBox)
Vue.component('serverImg', serverImg)
Vue.component('loadingMore', loadingMore)
Vue.use(globe)
Vue.prototype.$store = store
// #ifdef H5
window.$wx = jweixin
// #endif
App.mpType = 'app'

const app = new Vue({
    ...store,
    ...App
})
app.$mount()

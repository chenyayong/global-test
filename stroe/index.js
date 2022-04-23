import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        address_id: '',
        displaceDistance: 1 * 60 * 1000,
        displaceStatus: 0,
        user: {}
    },
    getters: {
        get_address(state) {
            return state.address_id
        },
        get_user(state) {
            return state.user
        }
    },
    mutations: {
        set_address(state, val) {
            state.address_id = val
        },
        set_user(state, val) {
            state.user = val
        },
        set_displaceStatus(state, val) {
            state.displaceStatus = val
        }
    },
    actions: {
        set_address({
            commit
        }, val) {
            commit('set_address', val)
        },
        set_user({
            commit
        }, val) {
            commit('set_user', val)
        },
        setDisplaceStatus({
            commit
        }) {
            Vue.prototype.$http('get|api/User/index').then((res) => {
                // console.log('setDisplaceStatus', res)
                if (res.status === 1) {
                    const value = res.result.isChange || 0
                    commit('set_displaceStatus', value)
                }
            })
        }
    }
})

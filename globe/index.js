export default {
    install(Vue) {
        // const serve = 'https://new3.sanxininfo.cn';
        const serve = 'https://test.global3plus.com'
        // const serve = 'https://app.global3plus.com'
        // const serve='http://new3.futrtch.com';
        // 正式 http://new3.futrtch.com
        // 测试 http://new3.sanxininfo.cn
        // Vue.prototype.$app='wx1f3e51f665a140fd'
        Vue.prototype.$serve = serve
        Vue.prototype.$image = serve
        // const showLogin = false;
        Vue.prototype.$save = function(key, data) {
            uni.setStorage({
                key,
                data
            })
        }
        Vue.prototype.$get = function(key) {
            return uni.getStorageSync(key)
        }
        Vue.prototype.$http = function(_url, data = {}) {
            // #ifdef H5
            uni.showLoading({
                title: '正在加载中'
            })
            // #endif
            let [method, url] = _url.split('|')
            method = method.toUpperCase()
            let header = {
                // #ifndef H5
                Cookie: uni.getStorageSync('PHPSESSID') ? 'PHPSESSID=' + uni.getStorageSync('PHPSESSID') : ''
                // #endif
                // Accept: "application/json",
                // 'Content-Type': "application/json"
            }
            return new Promise((resolve, reject) => {
                uni.request({
                    url: `${this.$serve}/${url}`,
                    // url: `/${url}`,
                    method,
                    dataType: 'json',
                    timeout: 8000,
                    responseType: 'text',
                    header,
                    data,
                    success: (res) => {
                        uni.hideLoading()
                        // if (res.data.status === -1) {
                        //   this.$toastApp(res.data.msg)
                        // }
                        // console.log('request', url, res)
                        if (res.data.status === 1) {
                            resolve(res.data)
                            uni.hideLoading()
                        } else {
                            if (res.data.status === -100) {
                                uni.hideLoading()
                                // console.log(uni.getStorageSync("PHPSESSID"));
                                // console.log(res.data);
                                // 解决app多次提示登录弹窗问题
                                // #ifdef APP-PLUS
                                // console.log(uni.getStorageSync("showLogin"));
                                if (uni.getStorageSync('showLogin')) return
                                uni.setStorageSync('showLogin', true)
                                // #endif
                                this.$login()
                                return
                                // 未登录
                            }
                            if (res.data.status === -103) {
                                uni.hideLoading()
                                this.$login()
                                // 没授权
                                return
                            }
                            if (res.data.status === -77) {
                                uni.hideLoading()
                                this.$toastApp(res.data.msg)
                                setTimeout(() => {
                                    uni.redirectTo({
                                        url: '/shop_card/my_order/my_order?type=WAITSEND'
                                    })
                                }, 500)
                                return
                            }
                            if (res.data.status === -3) {
                                this.$toastApp(res.data.msg)
                                uni.hideLoading()
                                return
                            }
                            // if (res.data.status == -1) {
                            //   this.$toastApp(res.data.msg)
                            //   uni.hideLoading();
                            //   return
                            // }
                            // -100未登录
                            reject(res.data)
                        }
                    },
                    fail: (err) => {
                        uni.hideLoading()
                        reject(err)
                    },
                    complete: (suc) => {
                        // console.log(suc);
                        // #ifdef H5
                        if (uni.getStorageSync('level') === 1 || uni.getStorageSync('level') === '') {
                            // this.$get_appId(['hideAllNonBaseMenuItem'],()=>{
                            //     $wx.hideAllNonBaseMenuItem()
                            // })
                        }
                        // #endif
                        if (suc.data.result === -1) {
                            this.$toastApp(suc.data.msg)
                            setTimeout(() => {
                                uni.navigateBack()
                            }, 1000)
                        }
                    }
                })
            })
        }
        Vue.prototype.$alert = function(title, icon) {
            uni.showToast({
                icon,
                title
            })
        }
        Vue.prototype.noScroll = function() {
            // #ifdef H5
            document.body.style.overflowY = 'hidden'
            // #endif
        }
        Vue.prototype.remScroll = function() {
            // #ifdef H5
            document.body.style.overflowY = 'auto'
            // #endif
        }
        Vue.prototype.$init = function(callback, code) {
            let data = {}
            if (code) {
                data = {
                    code: code
                }
            }
            return this.$http('get|api/MobileBase/gzhdoLogin', data)
                .then((res) => {
                    callback(res)
                })
                .catch((err) => {
                    if (err.status === -101) {
                        // 绑定手机
                        this.show_bind = true
                        // console.log("绑定手机号");
                    }
                    if (err.status === -102) {
                        // console.log("失败");
                        // 授权失败
                    }
                })
        }
        Vue.prototype.$get_appId = async function(jsApiList, callbakc, bool = false, askUrl = window.location.href) {
            await this.$http('post|api/MobileBase/ajaxGetWxConfig', {
                askUrl: encodeURIComponent(askUrl)
            }).then(async(res) => {
                await $wx.config({
                    debug: bool, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: res.result.appId, // 必填，公众号的唯一标识
                    timestamp: res.result.timestamp, // 必填，生成签名的时间戳
                    nonceStr: res.result.nonceStr, // 必填，生成签名的随机串
                    signature: res.result.signature, // 必填，签名
                    jsApiList: jsApiList
                })
                $wx.ready(() => {
                    // 需在用户可能点击分享按钮前就先调用
                    callbakc()
                })
            })
        }
        Vue.prototype.$login = function() {
            // #ifdef H5
            uni.showLoading({
                title: '正在跳转登录'
            })
            setTimeout(() => {
                let url = encodeURIComponent(window.location.origin + '/h5')
                let appid = 'wx6c9f225863d2dae2' // 生产环境
                // let appid = 'wxf922ca54b1cabef3' // 测试环境
                let ur = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${url}&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1#wechat_redirect`
                window.location.href = ur
                uni.hideLoading()
            }, 1000)
            // #endif
            // #ifdef APP-PLUS
            // console.log("重新登陆");
            uni.showModal({
                title: '提示',
                content: '您还未登录',
                confirmText: '去登录',
                confirmColor: '#4E6EF3',
                success: function(res) {
                    if (res.confirm) {
                        uni.setStorageSync('showLogin', false)
                        uni.navigateTo({
                            url: '/pages/login'
                        })
                    } else if (res.cancel) {
                        uni.setStorageSync('showLogin', false)
                        // console.log("用户点击取消");
                        // uni.navigateBack()
                    }
                }
            })
            // #endif
        }
        // #ifdef H5
        window.$check_mobel = function(mobel) {
            return /^\d{6,}$/.test(mobel)
        }
        // #endif
        // #ifndef H5
        Vue.prototype.$check_mobel = function(mobel) {
            return /^\d{6,}$/.test(mobel)
        }
        // #endif
        Vue.prototype.$copy = function(val) {
            // #ifdef H5
            let textarea = document.createElement('textarea')
            textarea.value = val
            textarea.style.position = 'fixed'
            textarea.style.zIndex = '-999'
            textarea.style.top = 0
            document.body.appendChild(textarea)
            textarea.select()
            document.execCommand('copy')
            this.$toastApp('复制成功')
            document.body.removeChild(textarea)
            // #endif
            // #ifndef H5
            uni.setClipboardData({
                data: val,
                success() {
                    // this.$toastApp('复制成功');
                }
            })
            // #endif
        }
        Vue.prototype.$uploadFile = function(file) {
            return new Promise((resolve, reject) => {
                // let size = file.tempFiles[0].size / 1024 / 1024;
                // let fileUrl = "";
                uni.uploadFile({
                    url: this.$serve + '/api/Api/add_identification',
                    filePath: file.tempFilePaths[0],
                    name: 'identification',
                    success: (res) => {
                        let dataRes = JSON.parse(res.data)
                        if (dataRes.status === 1) {
                            resolve(dataRes)
                        } else {
                            reject(dataRes.msg)
                        }
                    },
                    fail: () => {
                        // eslint-disable-next-line
                        reject('上传失败请重试')
                    }
                })
                // }
            })
        }
        Vue.prototype.$uploadCom = function(file) {
            return new Promise((resolve, reject) => {
                // let size = file.tempFiles[0].size / 1024 / 1024;
                // let fileUrl = "";
                uni.uploadFile({
                    url: this.$serve + '/api/Api/add_company_certificate',
                    filePath: file.tempFilePaths[0],
                    name: 'company',
                    success: (res) => {
                        let dataRes = JSON.parse(res.data)
                        if (dataRes.status === 1) {
                            resolve(dataRes)
                        } else {
                            reject(dataRes.msg)
                        }
                    },
                    fail: () => {
                        // eslint-disable-next-line
                        reject('上传失败请重试')
                    }
                })
                // }
            })
        }
        Vue.prototype.$uploadHeader = function(file) {
            return new Promise((resolve, reject) => {
                uni.uploadFile({
                    url: this.$serve + '/api/Api/head_pic',
                    filePath: file,
                    name: 'head_pic',
                    success: (res) => {
                        let dataRes = JSON.parse(res.data)
                        if (dataRes.status === 1) {
                            resolve(dataRes)
                        } else {
                            reject(dataRes.msg)
                        }
                    },
                    fail: () => {
                        // eslint-disable-next-line
                        reject('上传失败请重试')
                    }
                })
                // }
            })
        }
        Vue.prototype.$toast = function(msg, ok, mask, fail) {
            uni.showToast({
                title: msg,
                icon: 'none',
                mask: mask || false,
                duration: 1500,
                position: 'bottom',
                success: ok,
                fail: fail
            })
        }
        Vue.prototype.$toastApp = function(msg) {
            // #ifdef APP-PLUS
            plus.nativeUI.toast(msg)
            // #endif
            // #ifndef APP-PLUS
            this.$toast(msg)
            // #endif
        }
        Vue.prototype.$phoneFilter = function(phone, start = 3, length = 4) {
            // eslint-disable-next-line
            var reg = eval(`/(\\d{${+start--}})\\d{${length}}(\\d{${length}})/`)
            // console.log(reg)
            // console.log(phone.replace(reg, "$1****$2"))
            return phone.replace(reg, '$1****$2')
        }
    }
}

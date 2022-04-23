<template>
    <view>
        <view class="header-input">
            <view class="header-input-input" @tap="to_search">
                <image src="/static/input_search.png" mode="" />
                <view class="font-26">搜索商品名称</view>
            </view>
            <!-- <view class="language-box">
                <view class="language-item">
                    <view class="checks" @tap=";(showCountry = !showCountry), (showLanguage = false)">
                        <image style="border-radius: 50%;" :src="`/static/${checkCountry.icon}.jfif`"></image>
                        <text>{{ checkCountry.name }}</text>
                        <image src="/static/filter.png"></image>
                    </view>
                    <view class="check-box" style="width: 140rpx;" v-show="showCountry">
                        <view class="check-item" v-for="(item, index) in countryList" :key="index" @tap="checkC(item)">
                            <image :src="`/static/${item.icon}.jfif`"></image>
                            <text>{{ item.name }}</text>
                        </view>
                    </view>
                </view>
                <view class="language-item">
                    <view class="checks" @tap=";(showLanguage = !showLanguage), (showCountry = false)">
                        <image src="/static/lan.png"></image>
                        <text>中文</text>
                        <image src="/static/filter.png"></image>
                    </view>
                    <view class="check-box" v-show="showLanguage"><view class="check-item" @tap=";(showLanguage = false), $toast('暂未开放')">En</view></view>
                </view>
            </view> -->
        </view>
        <swiper
            class="swiper"
            :indicator-dots="true"
            :autoplay="true"
            indicator-color="rgba(255,255,255,0.3)"
            indicator-active-color="rgb(255,255,255)"
            :interval="5000"
            :duration="1000"
        >
            <swiper-item v-for="(item, index) in swiper" :key="index" @tap="to_page(item)"><image :src="item.ad_code" mode="" /></swiper-item>
        </swiper>
        <view class="option">
            <view v-for="(item, index) in option" :key="index" @tap="to_page(item)">
                <image :src="item.ad_code" mode="" />
                <view class="font-26">{{ item.ad_name }}</view>
            </view>
        </view>
        <!-- #ifndef H5 -->
        <view class="placard" @tap="to_placard">
            <!-- #ifdef APP-PLUS -->
            <image src="/static/placard.png" class="placard-image" mode="" />
            <!-- #endif -->
            <!-- #ifdef H5 -->
            <image src="/static/h5_placard.png" class="placard-image" mode="" />
            <!-- #endif -->
            <view class="sloid"></view>
            <view class="content font-26">
                <view :style="{ transform: `translateY(-${news_index * 34}rpx)` }">
                    <view v-for="(item, index) in news" :key="index" class="ellipsis">{{ item.title }}</view>
                </view>
            </view>
            <image src="/static/more.png" class="more" mode="" />
        </view>
        <!-- #endif -->
        <view class="area" v-if="adv.length">
            <view class="left"><image v-if="adv[0]" :src="adv[0].ad_code" @tap="to_page(adv[0])"></image></view>
            <view class="right">
                <image v-if="adv[1]" :src="adv[1].ad_code" @tap="to_page(adv[1])"></image>
                <image v-if="adv[2]" :src="adv[2].ad_code" @tap="to_page(adv[2])"></image>
            </view>
        </view>
        <view class="shadow" v-if="scroll_good.length > 0"></view>
        <view class="rush-to-buy" @tap="to_rush_page" v-if="scroll_good.length > 0">
            <view>
                <image src="/static/time.png" mode="" />
                <view class="title font-32 bold inline">限时抢购</view>
            </view>
            <view>
                <view class="bold font-28">{{ start_session }}点场</view>
                <view class="time-item font-22">
                    <view class="time">{{ time.hour }}</view>
                    <view class="maohao font-28">:</view>
                    <view class="time">{{ time.min }}</view>
                    <view class="maohao font-28">:</view>
                    <view class="time">{{ time.sec }}</view>
                </view>
            </view>
        </view>
        <view class="scroll" scroll-x="true">
            <view class="good-box">
                <view v-for="(item, index) in scroll_good" :key="index" class="good-item" @tap="to_good_detail(item)">
                    <image :src="item.original_img" mode="" />
                    <view class="price font-34 bold">
                        <view class="inline">￥{{ item.price }}</view>
                        <view class="old-price font-24 inline">￥{{ item.shop_price }}</view>
                    </view>
                    <view class="xiangou font-24">限购{{ item.buy_limit }}件</view>
                </view>
            </view>
        </view>
        <view class="shadow" v-if="team_list.length > 0"></view>
        <view class="together" v-if="team_list.length > 0" @tap="to_team_list">
            <image src="/static/together.png" mode="" />
            <view class="bold">拼团购</view>
        </view>
        <view class="scroll" scroll-x="true">
            <view class="good-box">
                <view v-for="(item, index) in team_list" :key="index" class="good-item" @tap="to_good_detail(item)">
                    <image :src="item.original_img" mode="" />
                    <view class="price font-34 bold">
                        <view class="inline">￥{{ item.price }}</view>
                        <view class="old-price font-24 inline">￥{{ item.goods_price }}</view>
                    </view>
                    <view class="xiangou font-24">已团{{ item.virtual_num }}单</view>
                </view>
            </view>
        </view>
        <view class="shadow"></view>
        <view class="together">
            <image src="/static/hot.png" mode="" />
            <view class="bold">热卖推荐</view>
        </view>
        <good-list v-model="list"></good-list>
        <view v-if="!have" class="no-more">我是有底线的</view>
        <is-sign v-model="sign" @close="close_sign"></is-sign>
        <bind-account v-model="show_bind" :set_mobel="set_mobel"></bind-account>
        <!-- #ifdef H5 -->
        <view class="new-bg" v-if="newDialog && switchs.h5_download_switch == 1" @touchmove.stop.prevent @tap="newDialog = false">
            <view>
                <view class="h5-poster">
                    <view class="box"><image :src="$image + switchs.h5_download"></image></view>
                </view>
                <!-- <image class="close-dialog" src="/static/close_dialog.png" @tap="newDialog = false"></image> -->
            </view>
        </view>
        <!-- #endif -->
        <!-- #ifdef APP-PLUS -->
        <!-- <view class="new-bg" v-if="newDialog && switchs.coupon_switch == 1" @touchmove.stop.prevent>
            <view>
                <view class="new-dialog">
                    <view class="box">
                        <view class="h1-tlt">APP专享优惠券</view>
                        <view class="h2-tlt">先领券再购物·优惠享不停</view>
                        <image src="/static/new_dialog.png" mode=""></image>
                        <view class="btn" @tap="goCoupon">去领取</view>
                    </view>
                </view>
                <image class="close-dialog" src="/static/close_dialog.png" @tap="newDialog = false"></image>
            </view>
        </view> -->
        <!-- #endif -->
        <!-- <view class="new-bg" @touchmove.stop.prevent>
            <view class="h5-poster">
                <image src="/static/coupon.png" mode=""></image>
                <view class="h5-save">长按保存到相册</view>
                <image class="close-dialog" src="/static/close_dialog.png" @tap="newDialog = false"></image>
            </view>
        </view> -->
        <!-- #ifdef APP-PLUS -->
        <view class="new-bg" v-if="newDialog && switchs.download_switch == 1" @touchmove.stop.prevent @tap="newDialog = false">
            <view>
                <view class="h5-poster">
                    <view class="box"><image :src="$image + switchs.download"></image></view>
                </view>
                <!-- <image class="close-dialog" src="/static/close_dialog.png" @tap="newDialog = false"></image> -->
            </view>
        </view>
        <!-- #endif -->

        <!-- #ifdef APP-PLUS -->
        <uni-popup ref="popup" :mask-click="false">
            <view class="popup">
                <view class="popup-title">5G手机套餐的置换方案</view>
                <view class="popup-body">
                    <view>{{ displaceStatusTips }}</view>
                    <radio-group class="popup-list" @change="displaceChange">
                        <label class="popup-label" v-for="(item, index) in displaceData" :key="index">
                            <view><radio name="change_type" :checked="index === displaceCurrent" :value="item.value" /></view>
                            <view style="margin: 0 10rpx;">{{ item.value }}:</view>
                            <view class="tips-area">
                                <view class="tips-area-item" v-for="(e, i) in item.tips" :key="i">{{ e }}</view>
                            </view>
                        </label>
                    </radio-group>
                </view>
                <!-- <view class="popup-warning">注意：¥16800的会员需要交回一台旧的global3手机</view> -->
                <view class="popup-foot">
                    <uni-tag text="确定" @click="displaceConfirm" type="primary" style="width: 180rpx;font-size: 28rpx;text-align: center;padding: 20rpx;" />
                    <uni-tag text="下次再说" @click="displaceClose" style="width: 180rpx;font-size: 28rpx;text-align: center;padding: 20rpx;" />
                </view>
            </view>
        </uni-popup>
        <!-- #endif -->
    </view>
</template>

<script>
import isSign from 'index/components/sign.vue'
import bindAccount from 'index/components/bind_account.vue'
// import showImg from 'components/show_img.vue'
var _this
export default {
    data() {
        return {
            displaceCurrent: 0,
            displacePlan$16800: [
                {
                    value: '1',
                    tips: ['a.置换2个(99份)¥10000祝播客套餐优惠', 'b.额外线下支付¥3200', 'c.原有共创值保留不变', '(有效期至2022年5月15日)']
                },
                {
                    value: '2',
                    tips: ['a.配送额外股票1000股', 'b.配送2个¥10000祝播客套餐的收益权36个月', 'c.原有股票和共创值保留不变']
                },
                {
                    value: '3',
                    tips: ['a.配送额外股票1000股', 'b.配送一台平板电脑和1个¥10000祝播客套餐的收益权36个月', 'c.原有股票和共创值保留不变']
                },
                {
                    value: '4',
                    tips: ['a.5G手机置换成2台新视界平板电脑', 'b.原有股票和共创值保留不变']
                },
                {
                    value: '5',
                    tips: ['a.等待5G立体拍摄手机']
                }
            ],
            displacePlan$18800: [
                {
                    value: '1',
                    tips: ['a.置换2个(99份)¥10000祝播客套餐优惠', 'b.额外线下支付¥1200', 'c.原有共创值保留不变', '(有效期至2022年5月15日)']
                },
                {
                    value: '2',
                    tips: ['a.配送额外股票1000股', 'b.配送2个¥10000祝播客套餐的收益权36个月', 'c.原有股票和共创值保留不变']
                },
                {
                    value: '3',
                    tips: ['a.配送额外股票1000股', 'b.配送一台平板电脑和1个¥10000祝播客套餐的收益权36个月', 'c.原有股票和共创值保留不变']
                },
                {
                    value: '4',
                    tips: ['a.5G手机置换成2台新视界平板电脑', 'b.原有股票和共创值保留不变']
                },
                {
                    value: '5',
                    tips: ['a.等待5G立体拍摄手机']
                }
            ],
            displacePlan$188000: [
                {
                    value: '1',
                    tips: ['a.置换2个(99份)¥100000祝播客套餐优惠', 'b.额外线下支付¥12000', 'c.原有共创值保留不变', '(有效期至2022年5月15日)']
                },
                {
                    value: '2',
                    tips: ['a.配送额外股票10000股', 'b.配送2个¥100000祝播客套餐的收益权96个', 'c.原有股票和共创值保留不变']
                },
                {
                    value: '3',
                    tips: ['a.等待5G立体拍摄手机']
                }
            ],
            showLanguage: false,
            showCountry: false,
            checkCountry: {
                icon: 'china',
                name: '中国'
            },
            countryList: [
                {
                    icon: 'china',
                    name: '中国'
                },
                {
                    icon: 'hk',
                    name: '香港'
                },
                {
                    icon: 'am',
                    name: '澳门'
                },
                {
                    icon: 'canada',
                    name: '加拿大'
                },
                {
                    icon: 'mg',
                    name: '美国'
                },
                {
                    icon: 'tw',
                    name: '台湾'
                },
                {
                    icon: 'mlxy',
                    name: '马来西亚'
                },
                {
                    icon: 'xjp',
                    name: '新加坡'
                },
                {
                    icon: 'rb',
                    name: '日本'
                },
                {
                    icon: 'yn',
                    name: '越南'
                }
            ],
            option: [
                // {
                //     image: '/static/option_1.png',
                //     title: '升级分销商',
                //     url: '/index/bonus/bonus'
                // },
                // {
                //     image: '/static/option_2.png',
                //     title: '领券中心',
                //     url: '/index/coupon/coupon'
                // },
                // {
                //     image: '/static/option_3.png',
                //     title: '邀请好友',
                //     url: '/index/invite/invite'
                // },
                // {
                //    image: '/static/option_4.png',
                //    title: '签到',
                //    do: () => {
                //         this.sign = true
                //     }
                // }
            ],
            newDialog: true,
            scroll_good: [],
            list: [],
            page: 1,
            swiper: [],
            adv: [
                {
                    ad_code: ''
                },
                {
                    ad_code: ''
                },
                {
                    ad_code: ''
                }
            ],
            end_time: 0,
            have: true,
            sign: false,
            start_session: '',
            time: {
                hour: '00',
                min: '00',
                sec: '00'
            },
            timer: null,
            timer_2: null,
            news: [],
            news_index: 0,
            show_bind: false,
            team_list: [],
            set_mobel: false,
            scroll_time: null,
            show_scroll: true,
            updateInfo: {},
            switchs: ''
        }
    },
    async onLoad() {
        _this = this
        // #ifdef APP-PLUS
        this.init()
        this.hot_good(1, true)
        // #endif
        // #ifdef H5
        let href = window.location.href
        let query = href.substring(href.indexOf('?') + 1)
        let vars = query.split('&')
        let obj = {}
        for (var i = 0; i < vars.length; i++) {
            let pair = vars[i].split('=')
            obj[pair[0]] = pair[1]
        }
        // console.log(obj, 'obj')
        if (obj.code) {
            this.$init(res => {
                // 绑定加登录
                // console.log(res, 'initres')
                uni.setStorageSync('setinvite', res ? res.result.userInfo.encipher : '')
                // console.log(res)
                this.$http('get|api/User/checkUserinfo').then(res => {
                    this.$nextTick(() => {
                        this.show_bind = true
                        this.set_mobel = true
                    })
                })
            }, obj.code)
            // console.log('youcode')
        } else {
            this.$http('get|api/MobileBase/checkLogin')
                .then(res => {
                    // 没登陆
                })
                .catch(e => {
                    this.$http('get|api/User/checkUserinfo').then(res => {
                        this.$nextTick(() => {
                            this.show_bind = true
                            this.set_mobel = true
                        })
                    })
                })
        }
        // console.log('meicode')

        if (obj.invite) {
            uni.setStorageSync('invite', obj.invite)
        }
        // #endif
    },
    onShow() {
        // #ifdef APP-PLUS
        // 判断是否置换
        const expire = this.displaceExpire()
        if (expire) {
            this.$store.dispatch('setDisplaceStatus')
            // this.$store.commit('set_displaceStatus', 1)
        }

        this.updateApp()
        // #endif
        // #ifdef H5
        let url = window.location.origin + '/h5'
        url = url.split('#')[0]
        let invite = uni.getStorageSync('setinvite')
        let level = uni.getStorageSync('level')
        // console.log(invite, 'invite')
        if (/\?/.test(url)) {
            url = url.split('?')[0]
            url += `?invite=${invite || ''}&ste=1`
        } else {
            url += `?invite=${invite || ''}&ste=1`
        }
        this.$get_appId(['showMenuItems', 'updateAppMessageShareData', 'hideAllNonBaseMenuItem', 'updateTimelineShareData'], _ => {
            $wx.hideAllNonBaseMenuItem()
            $wx.showMenuItems({
                menuList: ['menuItem:share:appMessage', 'menuItem:share:timeline']
            })
            if (invite && level >= 2) {
                this.$http('get|api/Index/share_detail').then(res => {
                    $wx.updateAppMessageShareData({
                        title: res.result.title, // 分享标题
                        desc: res.result.desc, // 分享描述
                        link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                        imgUrl: this.$image + res.result.logo, // 分享图标
                        success: res => {
                            // console.log('设置成功')
                        }
                    })
                    $wx.updateTimelineShareData({
                        title: res.result.title, // 分享标题
                        link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                        imgUrl: this.$image + res.result.logo, // 分享图标
                        success: res => {
                            // console.log('设置成功')
                            // 设置成功
                        }
                    })
                })
            } else {
                $wx.hideAllNonBaseMenuItem()
            }
        })
        this.init()
        this.hot_good(1, true)
        // #endif
    },
    onHide() {
        // #ifdef H5
        $wx.hideAllNonBaseMenuItem()
        // #endif
    },
    methods: {
        displaceChange(evt) {
            for (let i = 0; i < this.displaceData.length; i++) {
                if (this.displaceData[i].value === evt.detail.value) {
                    this.displaceCurrent = i
                    break
                }
            }
        },
        displaceClose() {
            this.$store.commit('set_displaceStatus', 0)
        },
        displaceConfirm(value) {
            // console.log('this.displaceData[this.displaceCurrent]', this.displaceData[this.displaceCurrent].value)
            this.$http('get|api/user/changeGoods', {
                change_type: this.displaceData[this.displaceCurrent].value,
                is_change: this.displaceStatus
            })
                .then(res => {
                    // console.log('置换成功', res)
                    if (res.status === 1) {
                        uni.showToast({
                            title: res.msg || '置换成功',
                            icon: 'none'
                        })
                        this.$store.commit('set_displaceStatus', 0)
                    } else {
                        uni.showToast({
                            title: res.msg || '置换失败',
                            icon: 'none'
                        })
                    }
                })
                .catch(res => {
                    // console.log('置换失败', res)
                    uni.showToast({
                        title: res.msg || '置换失败',
                        icon: 'none'
                    })
                })
        },
        displaceExpire() {
            const expire = parseInt(uni.getStorageSync('displaceExpire'))
            const distance = this.$store.state.displaceDistance
            const timestamp = Date.now()
            // console.log(timestamp, expire, timestamp - expire, distance)
            let result = false
            if (!expire) {
                result = true
            } else if (timestamp - expire >= distance) {
                result = true
            }
            return result
        },
        checkC(item) {
            this.checkCountry = item
            this.showCountry = false
        },
        goCoupon() {
            uni.navigateTo({
                url: '/index/coupon/coupon'
            })
        },
        updateApp() {
            plus.runtime.getProperty(plus.runtime.appid, function(wgtinfo) {
                // console.log('plus.runtime', wgtinfo)
            })
            this.$http('get|api/Index/app_version').then(res => {
                if (res.status === 1) {
                    // console.log('app_version', res)
                    this.updateInfo = res.result.version
                    // console.log('this.updateInfo', res.result, this.updateInfo)
                    plus.runtime.getProperty(plus.runtime.appid, function(wgtinfo) {
                        // 获取当前app版本
                        _this.version = wgtinfo.version
                        // 判断手机类型
                        // console.log(
                        //     `app当前版本号:${_this.version}`,
                        //     `热更新版本号: ${res.result.version.app_version}--${res.result.version.ios_version}`,
                        //     uni.getSystemInfoSync().platform
                        // )
                        switch (uni.getSystemInfoSync().platform) {
                            case 'android':
                                if (_this.isUpdate(_this.version, res.result.version.app_version)) {
                                    _this.serverVersion = res.result.version.app_version
                                    _this.clientType = 'android'
                                    _this.showUpdate(res.result.version.app_log)
                                } else {
                                    // console.log('最新');
                                }
                                break
                            case 'ios':
                                if (_this.isUpdate(_this.version, res.result.version.ios_version)) {
                                    _this.serverVersion = res.result.version.ios_version
                                    _this.clientType = 'ios'
                                    _this.showUpdate(res.result.version.app_log)
                                } else {
                                    // console.log('最新')
                                }
                                break
                        }
                    })
                }
            })
        },
        isUpdate(curVersion, serVersion) {
            // 判断是否需要更新
            let [serArray, curArray] = [serVersion.split('.'), curVersion.split('.')]
            // console.log('isUpdate', curVersion, serVersion)
            if (parseInt(serArray[0]) > parseInt(curArray[0])) {
                return true
            } else if (parseInt(serArray[1]) > parseInt(curArray[1])) {
                return true
            } else if (parseInt(serArray[1]) >= parseInt(curArray[1]) && parseInt(serArray[2]) > parseInt(curArray[2])) {
                return true
            } else {
                return false
            }
        },
        showUpdate(appLog) {
            // console.log('showUpdate', appLog)
            uni.showModal({
                title: '系统升级',
                content: appLog,
                showCancel: false,
                success: res => {
                    if (res.confirm) {
                        let version = this.version.split('.')
                        let updateVersion = this.serverVersion.split('.')
                        // 大更新
                        // console.log('version updateVersion', version, updateVersion)
                        if (
                            parseInt(updateVersion[0]) > parseInt(version[0]) ||
                            (parseInt(updateVersion[0]) >= parseInt(version[0]) && parseInt(updateVersion[1]) > parseInt(version[1]))
                        ) {
                            // console.log('_this.updateInfo.android_url', _this.updateInfo.android_url)
                            if (this.clientType === 'android') {
                                // plus.runtime.openURL('https://app.global3plus.com/Mobile/User/download.html')
                                plus.runtime.openURL(_this.updateInfo.android_url)
                            } else {
                                // console.log(_this.updateInfo.ios_url)
                                plus.runtime.openURL(_this.updateInfo.ios_url)
                            }
                        } else if (parseInt(updateVersion[2]) > parseInt(version[2])) {
                            // 小更新
                            // 热更新
                            this.downApp(this.$image + this.updateInfo.hot_update, 'thermalRenewal')
                        }
                    }
                }
            })
        },
        downApp(url, updateType) {
            // console.log(url)
            let waiting = plus.nativeUI.showWaiting('下载中...')
            // 创建下载任务
            let dtask = plus.downloader.createDownload(
                url,
                {
                    filename: '_doc/update/' // 文件下载保存路径
                },
                function(d, status) {
                    // console.log(status)
                    if (status === 200) {
                        waiting.setTitle('安装中...')
                        // 下载成功-自动安装
                        plus.runtime.install(
                            d.filename,
                            {},
                            function() {
                                plus.nativeUI.closeWaiting()
                                plus.nativeUI.alert('更新完成！', function() {
                                    uni.showTabBar()
                                    // 清除所有下载的包
                                    // plus.downloader.clear(-1);
                                    // 重启app
                                    if (updateType === 'thermalRenewal') {
                                        plus.runtime.restart()
                                    }
                                })
                            },
                            function(e) {
                                plus.nativeUI.closeWaiting()
                                plus.nativeUI.alert('安装失败[' + e.code + ']：' + e.message)
                            }
                        )
                    } else {
                        // 下载失败
                        plus.nativeUI.alert('下载失败！')
                        setTimeout(() => {
                            plus.nativeUI.closeWaiting()
                        }, 1000)
                        if (updateType === 'bigUpdate') {
                            plus.runtime.openURL(url) // 打开网页手动下载
                        }
                    }
                }
            )
            dtask.start()
        },
        init() {
            this.$http('get|api/Index/index').then(res => {
                // uni.setNavigationBarTitle({
                //     title: res.result.title
                // })

                this.switchs = res.result.switch
                // console.log('this.switchs', this.switchs)
                this.option = res.result.cat_list.map(row => {
                    row.ad_code = this.$image + row.ad_code
                    return row
                })
                this.swiper = res.result.banner.map(row => {
                    row.ad_code = this.$image + row.ad_code
                    return row
                })
                this.adv = [
                    ...res.result.adv.map(row => {
                        row.ad_code = this.$image + row.ad_code
                        return row
                    }),
                    ...res.result.adv1.map(row => {
                        row.ad_code = this.$image + row.ad_code
                        return row
                    })
                ]
                this.scroll_good = res.result.flash_sale_list.map(row => {
                    row.original_img = this.$image + row.original_img
                    return row
                })
                this.start_session = res.result.start_session
                this.news = [...res.result.news]
                this.team_list = res.result.team_list.map(row => {
                    row.original_img = this.$image + row.original_img
                    return row
                })
                this.end_time = new Date(res.result.end_time * 1000) - new Date().getTime() // 倒计时
                clearTimeout(this.timer)
                clearTimeout(this.timer_2)
                this.setTime()
                this.setNew()
                // setInterval(() => {
                //     if (this.news_index == this.news.length - 1) {
                //         this.news_index = 0
                //     } else {
                //         this.news_index++
                //     }
                // }, 3000)
                // uni.setStorageSync('PHPSESSID', res.result.session_id)
                // #ifndef H5
                uni.setStorageSync('PHPSESSID', res.result.session_id)
                // #endif
            })
        },
        async hot_good(p = 1, bool, isRefresh) {
            await this.$http('get|api/Index/favourite', {
                p
            }).then(res => {
                if (bool) {
                    this.list = []
                }
                if (res.result.favourite_goods.length === 0) {
                    this.have = false
                } else {
                    this.have = true
                    this.list = [...this.list, ...res.result.favourite_goods]
                }
                if (isRefresh) {
                    uni.showToast({
                        title: '刷新成功',
                        icon: 'none'
                    })
                    uni.stopPullDownRefresh()
                }
            })
        },
        more() {
            this.hot_good((this.page += 1))
        },
        setNew() {
            this.timer_2 = setInterval(() => {
                if (this.news_index === this.news.length - 1) {
                    this.news_index = 0
                } else {
                    this.news_index++
                }
            }, 3000)
        },
        setTime() {
            this.timer = setTimeout(() => {
                if (this.end_time <= 0) {
                    clearTimeout(this.timer)
                } else {
                    this.end_time -= 1000
                    this.setTime()
                }
            }, 1000)
        },
        to_rush_page() {
            uni.navigateTo({
                url: '/index/rush_page/rush_page'
            })
        },
        to_good_page() {
            uni.navigateTo({
                url: '/index/good_page/good_page'
            })
        },
        to_search() {
            uni.navigateTo({
                url: '/index/search/search'
            })
        },
        to_placard() {
            uni.navigateTo({
                url: '/index/placard/placard'
            })
        },
        to_good_detail(item) {
            uni.navigateTo({
                url: `/index/good_detail/good_detail?id=${item.goods_id}&item_id=${item.item_id}`
            })
        },
        to_team_list() {
            uni.navigateTo({
                url: '/index/team_list/team_list'
            })
        },
        to_page(item) {
            // 1：商品；2：分类；3：web链接；4：升级分销商；5：领券中心；6：邀请好友；7：签到
            switch (item.media_type) {
                case 1:
                    uni.navigateTo({
                        url: `/index/good_detail/good_detail?id=${item.ad_link}`
                    })
                    break
                case 2:
                    uni.navigateTo({
                        url: `/index/good_page/good_page?cat_id=${item.ad_link}`
                    })
                    break
                case 3:
                    window.open(item.ad_link)
                    break
                case 4:
                    this.$http('get|api/Goods/is_upgrades_list').then(res => {
                        uni.navigateTo({
                            url: `/index/good_detail/good_detail?id=${res.result.goods_id}`
                        })
                    })
                    break
                case 5:
                    uni.navigateTo({
                        url: '/index/coupon/coupon'
                    })
                    break
                case 6:
                    uni.navigateTo({
                        url: '/index/invite/invite'
                    })
                    break
                case 7: {
                    let str = ''
                    let data = new Date()
                    str = `${data.getFullYear()}-${data.getMonth() + 1}-${data.getDate()}`
                    this.$http('post|api/User/sign', {
                        str
                    })
                        .then(res => {
                            this.sign = true
                        })
                        .catch(e => [this.$toastApp(e.msg)])
                    break
                }
            }
        },
        close_sign() {
            this.sign = false
        },
        scroll() {
            this.show_scroll = false
            clearTimeout(this.scroll_time)
            this.scroll_time = setTimeout(() => {
                this.show_scroll = true
            }, 2000)
        }
    },
    // async onReachBottom() {
    //     if (this.have) {
    //         await this.hot_good((this.page += 1), false)
    //     }
    // },
    watch: {
        end_time(val) {
            let _time = val
            if (_time > 0) {
                var hour = Math.floor((_time % (3600 * 1e3 * 24)) / (1e3 * 60 * 60)) // 相差小时
                var min = Math.floor((_time % (3600 * 1e3)) / (1000 * 60)) // 相差分钟
                var sec = Math.floor(((_time % (3600 * 1e3)) % (1000 * 60)) / 1000)
                if (hour < 10) {
                    hour = '0' + hour
                }
                if (min < 10) {
                    min = '0' + min
                }
                if (sec < 10) {
                    sec = '0' + sec
                }
                this.time = {
                    hour,
                    min,
                    sec
                }
            } else {
                this.time = {
                    hour: '00',
                    min: '00',
                    sec: '00'
                }
            }
        },
        displaceStatus(val) {
            if (val !== 0) {
                this.$refs.popup.open()
            } else {
                uni.setStorageSync('displaceExpire', Date.now())
                this.displaceCurrent = 0
                this.$refs.popup.close()
            }
        }
    },
    computed: {
        get_user_info() {
            return this.$store.getters.get_user
        },
        displaceStatus() {
            return this.$store.state.displaceStatus
        },
        displaceData() {
            // displacePlan$16800
            const displaceArray = [undefined, '$16800', '$18800', '$188000']
            const value = displaceArray[this.displaceStatus]
            let data = []
            if (value) {
                data = this[`displacePlan${value}`]
            }
            return data
        },
        displaceStatusTips() {
            const tipsValues = [undefined, '$16800', '$18800', '$188000']
            const tips = `5G手机套餐的置换方案（${tipsValues[this.displaceStatus]}）以下任选一项`
            return tips
        }
    },
    components: {
        isSign,
        bindAccount
        // showImg
    },
    onPullDownRefresh() {
        this.init()
        this.page = 1
        this.hot_good(1, true, true)
    },
    onReachBottom() {
        uni.showLoading({
            title: '加载中...'
        })
        this.hot_good((this.page += 1))
    }
}
</script>

<style lang="scss">
.popup {
    background-color: #ffffff;
    font-size: 28rpx;
    padding: 30rpx;
    width: 85%;
    border-radius: 8rpx;
    margin: auto;
    display: block;
    color: #666;
    .popup-title {
        font-size: 32rpx;
        text-align: center;
        color: #000;
        // padding-bottom: 40rpx;
        margin-bottom: 20rpx;
    }
    .popup-list {
        padding: 20rpx 0;
    }
    .popup-label {
        display: flex;
        margin-bottom: 30rpx;
    }
    .tips-area {
        margin-left: 10rpx;
        .tips-area-item {
            margin-bottom: 6rpx;
            white-space: pre-line;
        }
    }
    .popup-warning {
        color: #f73131;
        margin-bottom: 40rpx;
    }
    .popup-foot {
        display: flex;
        justify-content: space-around;
    }
}
.swiper {
    height: 320rpx;
    width: 710rpx;
    margin: 0 auto;
    margin-top: -245rpx;
    border-radius: 10rpx;
    overflow: hidden;

    image {
        height: 100%;
        width: 100%;
    }
}

.option {
    display: flex;
    justify-content: space-between;
    padding: 0 30rpx;
    box-sizing: border-box;
    width: 100%;
    margin-top: 36rpx;

    image {
        height: 116rpx;
        width: 116rpx;
    }

    .font-26 {
        width: 100%;
        text-align: center;
        color: #343434;
    }
}

.placard {
    margin: 0 auto;
    margin-top: 36rpx;
    width: 690rpx;
    height: 64rpx;
    background: rgba(247, 247, 247, 1);
    border-radius: 10rpx;
    padding: 0 20rpx;
    box-sizing: border-box;
    display: flex;
    align-items: center;

    .placard-image {
        height: 28rpx;
        width: 60rpx;
    }

    .sloid {
        height: 24rpx;
        width: 2rpx;
        transform: translateY(0.5);
        background-color: #e7e7e7;
        margin: 0 30rpx;
    }

    .content {
        flex: 1;
        color: #737787;
        overflow: hidden;
        height: 34rpx;

        > view {
            transition: all 0.5s;
        }
    }

    .more {
        height: 32rpx;
        width: 32rpx;
    }
}

.area {
    display: flex;
    width: 690rpx;
    margin: 0 auto;
    margin-top: 40rpx;
    // height: 318rpx;

    .left {
        height: 318rpx;
        width: 340rpx;

        image {
            height: 100%;
            width: 100%;
        }
    }

    .right {
        flex: 1;
        padding-left: 10rpx;
        box-sizing: border-box;

        image {
            height: 154rpx;
            width: 340rpx;
        }
    }
}

.shadow {
    width: 100%;
    height: 20rpx;
    background: rgba(247, 247, 247, 1);
    margin-top: 40rpx;
}

.rush-to-buy {
    padding: 0 30rpx;
    box-sizing: border-box;
    height: 90rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;

    > view {
        display: flex;
        align-items: center;
    }

    image {
        height: 36rpx;
        width: 36rpx;
    }

    .title {
        margin-left: 16rpx;
    }

    .time-item {
        display: flex;
        align-items: center;
        margin-left: 20rpx;

        > .time {
            width: 32rpx;
            text-align: center;
            height: 32rpx;
            background-color: #666666;
            border-radius: 4rpx;
            color: #ffffff;
        }

        .maohao {
            margin: 0 6rpx;
        }
    }
}

.scroll {
    width: 100%;
    overflow: hidden;
    overflow-x: scroll;
    margin-top: 20rpx;

    .good-box {
        white-space: nowrap;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: flex-start;
        align-items: flex-start;
    }

    .good-item {
        width: 200rpx;
        float: left;
        margin-left: 24rpx;

        image {
            height: 200rpx;
            width: 200rpx;
        }

        .price {
            color: #f41613;
            text-align: center;
            line-height: 48rpx;

            > view {
                float: left;
            }
        }

        .price::after {
            content: '';
            display: block;
            clear: both;
        }

        .old-price {
            color: #b3b3b3;
            position: relative;
            margin-left: 6rpx;
            font-weight: 400;
        }

        .old-price::after {
            content: '';
            position: absolute;
            height: 2rpx;
            width: 100%;
            background-color: #b3b3b3;
            top: 50%;
            left: 0;
        }

        .xiangou {
            text-align: center;
            color: #b3b3b3;
            line-height: 40rpx;
        }
    }
}

.scroll::-webkit-scrollbar {
    display: none;
}

.together {
    padding: 0 30rpx;
    box-sizing: border-box;
    height: 90rpx;
    display: flex;
    align-items: center;

    image {
        height: 36rpx;
        width: 36rpx;
        margin-right: 16rpx;
    }
}

.no-more {
    color: #999999;
    height: 80rpx;
    text-align: center;
    line-height: 80rpx;
    font-size: 26rpx;
    background-color: #f7f7f7;
}

.new-bg {
    position: fixed;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    text-align: center;
    display: flex;
    flex-flow: column;
    justify-content: center;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    .new-dialog {
        box-sizing: border-box;
        width: 650rpx;
        height: 700rpx;
        z-index: 999;
        padding: 60rpx 0;
        border-radius: 20rpx;
        background-color: #ffffff;
        text-align: center;
        margin: auto;

        .h1-tlt {
            font-size: 64rpx;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: var(--theme);
            line-height: 90rpx;
        }

        .h1-tlt-h5 {
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: var(--theme);
            line-height: 90rpx;
            font-size: 56rpx;
        }

        .h2-tlt {
            margin-top: 20rpx;
            font-size: 42rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: var(--theme);
            line-height: 29rpx;
        }

        image {
            margin-top: 30rpx;
            width: 240rpx;
            height: 240rpx;
        }

        .btn {
            width: 330rpx;
            height: 90rpx;
            background: var(--theme);
            box-shadow: 0px 4rpx 14rpx 0px rgba(0, 186, 249, 0.3);
            border-radius: 46rpx;
            color: #ffffff;
            font-size: 32rpx;
            line-height: 90rpx;
            margin: auto;
            margin-top: 60rpx;
        }
    }

    .close-dialog {
        width: 64rpx;
        height: 64rpx;
        margin: auto;
        margin-top: 40rpx;
    }
}

.h5-poster {
    image {
        width: calc(90vw);
        height: calc(90vh);
        /* #ifdef H5 */
        height: calc(85vh);
        margin-top: -8vh;
        /* #endif */
        border-radius: 10rpx;
    }

    // .h5-save {
    //     width: 630rpx;
    //     height: 90rpx;
    //     margin: auto;
    //     margin-top: 26rpx;
    //     background-color: #f5a623;
    //     color: #ffffff;
    //     text-align: center;
    //     line-height: 90rpx;
    //     border-radius: 10rpx;
    //     position: relative;
    // }
}

.header-input {
    position: relative;
}

.header-input-input {
    margin-left: 30rpx;
    width: 400rpx;
}

.language-box {
    position: absolute;
    top: 24rpx;
    right: 20rpx;
    display: flex;
    align-items: center;

    .language-item {
        margin-left: 20rpx;
    }

    .checks {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24rpx;
        color: #ffffff;

        image {
            width: 32rpx;
            height: 32rpx;
        }

        text {
            margin-left: 10rpx;
        }
    }

    .check-box {
        position: absolute;
        z-index: 9999;
        width: 120rpx;
        margin-top: 6rpx;
        background-color: #ffffff;
        border: 2rpx solid #cccccc;

        .check-item {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 60rpx;
            color: #333333;
            font-size: 24rpx;

            image {
                width: 24rpx;
                height: 24rpx;
                border-radius: 50%;
                margin-right: 4rpx;
            }
        }
    }
}
</style>

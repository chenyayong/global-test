<template>
    <view class="page">
        <view class="plan">
            <swiper class="swiper" :indicator-dots="true" :autoplay="true" :interval="5000" :duration="1000">
                <swiper-item v-for="(item, index) in goods_images_list" :key="index"><image :src="$image + item.image_url" /></swiper-item>
            </swiper>
            <!-- <image :src="$image+goods.original_img" mode="" /> -->
            <view class="home" @tap="to_home"></view>
            <view class="shop-card" @tap="to_shop_card"></view>
        </view>
        <view v-if="is_snap" class="snap">
            <view class="font-28">
                ￥
                <view class="inline font-56">{{ tream_price }}</view>
            </view>
            <view class="price-right">
                <view class="right-top font-20">已有{{ virtual_num }}人购买</view>
                <view class="is-old-price font-20">￥{{ goods.market_price }}</view>
            </view>
            <view class="snap-right">
                <view class="font-26 bold">距结束仅剩</view>
                <view class="flex">
                    <view class="time-color"><view class="value font-22">00</view></view>
                    <view class="font-28">:</view>
                    <view class="time-color">
                        <view class="value font-22">{{ time_value.hour }}</view>
                    </view>
                    <view class="font-28">:</view>
                    <view class="time-color">
                        <view class="value font-22">{{ time_value.min }}</view>
                    </view>
                    <view class="font-28">:</view>
                    <view class="time-color">
                        <view class="value font-22">{{ time_value.sec }}</view>
                    </view>
                </view>
            </view>
        </view>
        <view class="group-buy" v-if="group_buy">
            <view class="group-buy-left">
                <view class="font-28">
                    ￥
                    <view class="inline font-56">{{ tream_price }}</view>
                </view>
                <view class="price-right">
                    <view class="right-top font-20">团购优惠价</view>
                    <view class="is-old-price font-20">￥{{ goods.market_price }}</view>
                </view>
            </view>
            <view class="grop-buy-right">
                <view class="font-32 inline">
                    <view class="inline font-20 tuan">已团</view>
                    {{ virtual_num }}
                    <view class="inline font-20 dan">单</view>
                </view>
            </view>
        </view>
        <view class="good-title">
            <view class="title ellipsis-two font-30">{{ goods.goods_name }}</view>

            <!-- <view class="share" @tap="to_share"></view> -->
        </view>
        <view class="vice-title font-26 ellipsis">{{ goods.goods_remark }}</view>
        <view class="price font-44 bold" v-if="!is_snap && !group_buy">￥{{ item_price }}</view>
        <view class="other font-24" v-if="!is_snap">
            <view>
                <view class="is-old-price inline">原价: {{ goods.market_price }}元</view>
            </view>
            <view>{{ goods.is_free_shipping === 1 ? '快递包邮' : '不包邮' }}</view>
            <view>已售{{ goods.sales_sum }}件</view>
        </view>
        <view class="solid"></view>
        <!-- <view class="have-more" @tap="service = true">
            <view class="font-28 label">服务</view>
            <view class="font-28 more">极速发货·正品保证</view>
        </view> -->
        <view class="solid" style="margin:0"></view>
        <view class="have-more" @tap="specification = true">
            <view class="font-28 label">规格</view>
            <view class="font-28 more">请选择规格与数量</view>
        </view>

        <view class="solid" style="margin:0"></view>
        <view class="flex">
            <view class="font-28 label">供货商</view>
            <view class="font-28" style="margin-left: 30rpx;">本产品由 新视界集团 提供</view>
        </view>

        <view class="solid" style="margin:0"></view>
        <view class="evaluation" @tap="to_user_detail">
            <view class="font-30">用户评价（{{ commentStatistics.comment_count }}）</view>
        </view>
        <evaluation v-if="commentStatistics.comment[0]" :item="commentStatistics.comment[0]"></evaluation>
        <view class="solid" style="margin:0"></view>
        <view class="option">
            <view :class="[option[0].active ? 'active' : '']" @tap="option_tap(0)">商品介绍</view>
            <!-- <view :class="[option[1].active?'active':'']" @tap="option_tap(1)">商品参数</view> -->
        </view>
        <!-- #ifndef APP-PLUS -->
        <view class="fixed-buttom" v-if="!specification">
            <!-- #ifndef H5 -->
            <view class="message font-24" @tap="server_img = true">
                <image src="/static/message.png" mode="" />
                聊天
            </view>
            <!-- #endif -->
            <view class="collect font-24" @tap="to_collect">
                <!-- #ifdef APP-PLUS -->
                <image src="/static/collect_active.png" v-if="collect" mode="" />
                <!-- #endif -->
                <!-- #ifdef H5 -->
                <image src="/static/h5_collect_active.png" v-if="collect" mode="" />
                <!-- #endif -->
                <image src="/static/collect.png" v-else mode="" />
                收藏
            </view>
            <view class="add_card font-30" @tap="specification = true" v-if="goods.is_upgrade !== 1">加入购物车</view>
            <view class="to_buy font-30" @tap="specification = true">立即购买</view>
        </view>
        <!-- #endif -->

        <!-- 服务 -->
        <view class="service" v-if="service">
            <view class="service-content">
                <image src="/static/close.png" mode="" @tap="service = false" />
                <view class="title font-32">· 基础服务 ·</view>
                <view class="text"><rich-text :nodes="node"></rich-text></view>
                <view class="service-buttom font-30" @tap="service = false">知道了</view>
            </view>
        </view>
        <!-- 规格 -->
        <specification
            :type="type"
            :num="num"
            :src="$image + goods.original_img"
            :spec_goods_price="spec_goods_price"
            :price="item_price"
            :open="goods.is_upgrade !== 1"
            v-model="specification"
            @to_active="item_active"
            @add="add_num"
            @add_card="add_card"
            @to_pay="to_pay"
        ></specification>
        <good-content v-if="option_index === 0" :node="goods.goods_content"></good-content>
        <attr v-if="option_index === 1" :list="goods_attr_list"></attr>
        <share-img :id="id" v-model="share_dialog" :name="goods.goods_remark"></share-img>
        <bind-account v-model="show_bind" :set_mobel="set_mobel"></bind-account>
        <server-img v-model="server_img"></server-img>
    </view>
</template>

<script>
import evaluation from '../components/evaluation_item.vue'
import specification from '../components/specification.vue'
import shareImg from '../components/share_img'
import goodContent from './good_content.vue'
import attr from './goods_attr_list.vue'
import bindAccount from 'index/components/bind_account.vue'
export default {
    data() {
        return {
            server_img: false,
            id: '',
            option: [
                {
                    active: true
                },
                {
                    active: false
                }
            ],
            option_index: 0,
            service: false, // 服务dialog
            node: '123', // 服务content
            specification: false, // 规格dialog
            type: [
                // {
                //     item_name: '颜色分类',
                //     item_value: [
                //         {
                //             item: '高清',
                //             active: false,
                //             item_id: ''
                //         }
                //     ]
                // }
            ],
            num: 1, // 选择得数量
            goods: {},
            goods_attr_list: [],
            goods_images_list: [],
            spec_goods_price: [],
            item_price: '',
            item_id: '',
            commentStatistics: {
                comment_count: 0,
                comment: []
            },
            collect: false,
            is_snap: false,
            snap_price: '',
            end_time: 0,
            time_value: {
                hour: '00',
                min: '00',
                sec: '00'
            },
            timer: null, // 秒杀
            group_buy: false, // 团购
            tream_price: 0,
            virtual_num: 0,
            share_dialog: false,
            set_mobel: false,
            show_bind: false
        }
    },
    async onLoad({ id, item_id, invite }) {
        await this.$http('get|api/MobileBase/checkLogin')
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
        if (invite) {
            uni.setStorageSync('invite', invite)
        }
        this.id = +id
        this.$http('get|api/Goods/goodsInfo', {
            id
        }).then(async res => {
            console.log('goodsInfo', res)
            this.goods = res.result.goods
            res.result.filter_spec.forEach(el => {
                el.item_value.forEach(row => {
                    this.$set(row, 'active', false)
                })
                el.item_value[0].active = true
            })
            this.type = res.result.filter_spec
            this.goods_attr_list = res.result.goods_attr_list
            this.goods_images_list = res.result.goods_images_list
            this.spec_goods_price = res.result.spec_goods_price
            this.commentStatistics = res.result.commentStatistics
            await this.good_active()
            if (item_id !== undefined && item_id !== 0 && item_id !== 'null') {
                item_id = +item_id
                let find = this.spec_goods_price.find(row => row.item_id === item_id)
                this.item_price = find.price
                this.snap_price = find.price
                // this.goods.shop_price=find.price;
                this.item_id = item_id
                let key = find.key.split('_')
                let arr = []
                this.type.forEach(el => {
                    arr.push(...el.item_value)
                })
                arr.forEach(el => {
                    el.active = false
                })
                key.forEach(el => {
                    let fin = arr.find(row => row.item_id === el)
                    fin.active = true
                })
                // console.log(arr)
            } else {
                if (this.spec_goods_price.length > 0) {
                    this.item_price = this.spec_goods_price[0].price
                    this.item_id = this.spec_goods_price[0].item_id
                } else {
                    this.item_price = this.goods.shop_price
                    this.item_id = 0
                }
            }
            this.collect = res.result.collect === 1
            let invite = uni.getStorageSync('setinvite')
            let level = uni.getStorageSync('level')
            // #ifdef H5
            // let url = window.location.href.split('#')[1]
            let origin = window.location.origin + '/h5/#' + `/index/good_detail/good_detail?id=${this.id}` + `&invite=${invite || ''}`
            this.$get_appId(['showMenuItems', 'updateAppMessageShareData', 'hideAllNonBaseMenuItem', 'updateTimelineShareData'], _ => {
                $wx.showMenuItems({
                    menuList: ['menuItem:share:appMessage', 'menuItem:share:timeline']
                })
                if (invite && level >= 2) {
                    this.$http('get|api/Index/share_detail').then(res => {
                        $wx.updateAppMessageShareData({
                            title: this.goods.goods_name, // 分享标题
                            desc: this.goods.goods_remark, // 分享描述
                            link: origin, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                            imgUrl: this.$image + res.result.logo, // 分享图标
                            success: res => {
                                // console.log('设置成功')
                            }
                        })
                        $wx.updateTimelineShareData({
                            title: this.goods.goods_name, // 分享标题
                            link: origin, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
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
            // #endif
        })
        this.$http('post|api/Article/regulation', {
            id: 2
        }).then(res => {
            this.node = res.result.topic_content
        })
    },
    onShow() {
        // #ifdef H5
        $wx.showMenuItems({
            menuList: ['menuItem:share:appMessage']
        })
        // #endif
    },
    onHide() {
        // #ifdef H5
        $wx.hideAllNonBaseMenuItem()
        // #endif
    },
    onUnload() {
        // #ifdef H5
        $wx.hideAllNonBaseMenuItem()
        // #endif
    },
    methods: {
        good_active() {
            this.$http('post|api/Goods/activity', {
                goods_id: this.id,
                item_id: this.item_id,
                goods_num: this.num
            }).then(res => {
                // console.log(res);
                clearTimeout(this.timer)
                if (res.result.goods.activity_is_on === 1) {
                    if (res.result.goods.prom_type === 1) {
                        this.is_snap = true
                        this.end_time = new Date(res.result.goods.end_time * 1000) - new Date().getTime()
                        this.tream_price = res.result.goods.shop_price
                        this.item_price = res.result.goods.shop_price
                        this.setTime()
                    }
                    if (res.result.goods.prom_type === 2) {
                        this.group_buy = true
                        this.tream_price = res.result.goods.shop_price
                        this.item_price = res.result.goods.shop_price
                        // 团购
                    }
                    this.virtual_num = res.result.goods.virtual_num
                } else {
                    this.is_snap = false
                    this.group_buy = false
                }
                // prom_type 1限时 2团购
            })
        },
        to_collect() {
            let url = this.collect ? 'api/User/cancel_collect' : 'api/Goods/collect_goods'
            this.$http(`get|${url}`, {
                goods_id: this.id
            }).then(res => {
                this.collect = !this.collect
            })
        },
        add_card() {
            // 添加购物车
            this.$http('post|api/Cart/ajaxAddCart', {
                goods_id: this.id,
                goods_num: this.num,
                item_id: this.item_id
            }).then(res => {
                this.$toastApp(res.msg)
            })
        },
        to_pay() {
            // #ifdef APP-PLUS
            this.$toastApp('请到公众号进行操作')
            // #endif
            // 下单
            // #ifdef H5
            uni.navigateTo({
                url: `/index/create_order/create_order?id=${this.id}&num=${this.num}&item=${this.item_id}&action=buy_now`
            })
            // #endif
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
        item_active(ind, index) {
            this.type[index].item_value.forEach(el => {
                el.active = false
            })
            this.type[index].item_value[ind].active = true
            let key = []
            this.type.forEach(el => {
                let find = el.item_value.find(row => row.active)
                key.push(find.item_id)
            })
            let num = this.spec_goods_price.find(row => row.key === key.join('_'))
            this.item_price = num.price
            this.item_id = num.item_id
            this.good_active()
        },
        add_num(num) {
            this.num = this.num + num <= 0 ? 1 : (this.num += num)
        },
        option_tap(index) {
            this.option.forEach(el => {
                el.active = false
            })
            this.option[index].active = true
            this.option_index = index
        },
        to_home() {
            uni.switchTab({
                url: '/pages/index'
            })
        },
        to_shop_card() {
            uni.switchTab({
                url: '/pages/shop_card'
            })
        },
        to_user_detail() {
            uni.navigateTo({
                url: `/index/user_reviews/user_reviews?goods_id=${this.id}`
            })
        },
        to_share() {
            this.$http('get|api/Goods/poster_share', {
                goods_id: this.id
            }).then(res => {
                if (uni.getStorageSync('level') === 1) {
                    this.$toastApp('暂无权限')
                    return
                }
                this.share_dialog = true
            })
        }
    },
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
                this.time_value = {
                    hour,
                    min,
                    sec
                }
            } else {
                this.time_value = {
                    hour: '00',
                    min: '00',
                    sec: '00'
                }
            }
        }
    },
    // eslint-disable-next-line
    onUnload() {
        this.remScroll()
    },
    components: {
        evaluation,
        specification,
        goodContent,
        attr,
        shareImg,
        bindAccount
    }
}
</script>

<style lang="scss">
.plan {
    height: 750rpx;
    width: 100%;
    position: relative;

    .swiper {
        height: 100%;
        width: 100%;
    }

    image {
        height: 100%;
        width: 100%;
    }

    .home {
        height: 48rpx;
        width: 48rpx;
        background-size: 100%;
        background-image: url(../../static/home.png);
        position: absolute;
        top: 18rpx;
        right: 108rpx;
    }

    .shop-card {
        height: 48rpx;
        width: 48rpx;
        background-size: 100%;
        background-image: url(../../static/to_shop_card.png);
        position: absolute;
        top: 18rpx;
        right: 30rpx;
    }
}

.good-title {
    display: flex;
    justify-content: space-between;
    padding: 0 30rpx;
    box-sizing: border-box;
    align-items: flex-start;
    margin-top: 24rpx;

    .title {
        max-width: 580rpx;
        line-height: 42rpx;
    }

    .share {
        height: 48rpx;
        width: 52rpx;
        background-image: url(../../static/share.png);
        background-size: 100%;
    }
}

.vice-title {
    padding: 0 30rpx;
    box-sizing: border-box;
    max-width: 640rpx;
    color: #666666;
    margin-top: 10rpx;
}

.price {
    margin-top: 30rpx;
    padding: 0 30rpx;
    box-sizing: border-box;
    color: #ff3f3f;
}

.other {
    display: flex;
    margin-top: 20rpx;
    color: #999999;

    > view {
        flex: 1;
        text-align: center;
    }
}

.solid {
    height: 18rpx;
    width: 100%;
    background-color: #f7f7f7;
    margin-top: 30rpx;
}
.flex {
    padding: 0 30rpx;
    height: 100rpx;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    .label {
        width: 90rpx;
        color: #777777;
    }
}

.have-more {
    padding: 0 30rpx;
    height: 100rpx;
    box-sizing: border-box;
    display: flex;
    align-items: center;

    .label {
        width: 90rpx;
        color: #777777;
    }

    .more {
        color: rgba(0, 0, 0, 0.7);
    }
}

.have-more::after {
    content: '';
    height: 36rpx;
    width: 36rpx;
    background-image: url(../../static/more.png);
    background-size: 100%;
    right: 30rpx;
    position: absolute;
}

.evaluation {
    padding: 0 30rpx;
    box-sizing: border-box;
    height: 100rpx;
    line-height: 100rpx;
    position: relative;
}

.evaluation::after {
    content: '';
    height: 24rpx;
    width: 14rpx;
    background-image: url(../../static/small_more.png);
    background-size: 100%;
    right: 30rpx;
    position: absolute;
    top: 50%;
    margin-top: -12rpx;
}

.evaluation::before {
    content: '';
    width: 690rpx;
    height: 4rpx;
    position: absolute;
    bottom: 0;
    left: 50%;
    margin-left: -345rpx;
    background-color: #ededed;
}

.option {
    height: 100rpx;
    background: rgba(255, 255, 255, 1);
    border-radius: 10rpx 10rpx 0px 0px;
    display: flex;
    position: relative;

    > view {
        flex: 1;
        text-align: center;
        line-height: 100rpx;
        color: #666666;
        font-size: 28rpx;
    }

    .active {
        color: #333333;
        position: relative;
    }

    .active::after {
        position: absolute;
        content: '';
        width: 64rpx;
        height: 6rpx;
        background: var(--theme);
        border-radius: 3rpx;
        bottom: 0;
        left: 50%;
        margin-left: -32rpx;
    }
}

.option::after {
    width: 2rpx;
    height: 48rpx;
    background: rgba(227, 228, 230, 1);
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    margin-top: -24rpx;
    transform: scaleX(0.5);
}

.page::after {
    height: 100rpx;
    width: 100%;
    display: block;
    content: '';
}

.fixed-buttom {
    position: fixed;
    bottom: 0;
    width: 100vw;
    height: 100rpx;
    box-shadow: 0px -1px 0px 0px rgba(223, 227, 230, 1);
    background-color: #fff;
    display: flex;
    z-index: 999;

    image {
        height: 40rpx;
        width: 40rpx;
        display: block;
    }

    .message,
    .collect {
        width: 112rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .message {
        border-right: 1rpx solid #f3f3f3;
    }

    .add_card,
    .to_buy {
        line-height: 100rpx;
        flex: 1;
        text-align: center;
        color: #fff;
    }

    .add_card {
        background-color: #f5a623;
    }

    .to_buy {
        background-color: var(--theme);
    }
}

.service {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 99;
    background-color: rgba(0, 0, 0, 0.7);

    .service-content {
        background-color: #ffffff;
        position: absolute;
        bottom: 0;
        width: 100%;
        padding-top: 20rpx;
        animation: toShow 0.3s;

        > image {
            position: absolute;
            right: 30rpx;
            top: 30rpx;
            height: 36rpx;
            width: 36rpx;
        }
    }

    .title {
        text-align: center;
        line-height: 80rpx;
    }

    .text {
        padding: 30rpx;
        max-height: 300rpx;
        overflow: scroll;
    }

    .service-buttom {
        width: 100%;
        height: 100rpx;
        background-color: var(--theme);
        color: #ffffff;
        text-align: center;
        line-height: 100rpx;
    }
}

.snap {
    height: 100rpx;
    background: rgba(244, 22, 19, 1);
    padding-right: 280rpx;
    padding-left: 30rpx;
    box-sizing: border-box;
    position: relative;
    display: flex;
    align-items: center;
    color: #ffffff;

    .price-right {
        position: relative;
        flex: 1;
        height: 74rpx;

        .right-top {
            position: absolute;
            top: 8rpx;
            left: -6rpx;
        }

        .is-old-price {
            position: absolute;
            bottom: 0;
            color: rgba(255, 255, 255, 0.75);
        }
    }

    .snap-right {
        position: absolute;
        right: 0;
        height: 100%;
        top: 0;
        width: 280rpx;
        background-image: url(../../static/snap.png);
        background-repeat: no-repeat;
        background-size: 100%;
        padding: 10rpx 30rpx;
        box-sizing: border-box;

        .font-26 {
            color: #f41613;
            text-align: right;
            // padding-right: 28rpx;
            box-sizing: border-box;
        }

        .time-color {
            height: 32rpx;
            width: 32rpx;
            background-color: #333333;
            border-radius: 4rpx;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .flex {
            margin-top: 10rpx;
            display: flex;
            justify-content: flex-end;
            align-items: flex-start;

            .font-28 {
                line-height: 32rpx;
                margin: 0 6rpx;
                color: #666666;
            }
        }
    }
}

.group-buy {
    height: 100rpx;
    background: var(--theme);
    padding: 0 30rpx;
    box-sizing: border-box;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #ffffff;
    position: relative;

    .price-right {
        position: relative;
        height: 74rpx;
        width: 200rpx;

        .right-top {
            position: absolute;
            top: 8rpx;
            left: -6rpx;
        }

        .is-old-price {
            position: absolute;
            bottom: 0;
            color: rgba(255, 255, 255, 0.75);
        }
    }

    .group-buy-left {
        display: flex;
    }

    .grop-buy-right {
        padding-right: 20rpx;

        .font-32 {
            position: relative;
        }

        .tuan {
            position: absolute;
            left: -46rpx;
            bottom: 0rpx;
        }

        .dan {
            position: absolute;
            right: -24rpx;
            bottom: 0rpx;
        }
    }
}
</style>

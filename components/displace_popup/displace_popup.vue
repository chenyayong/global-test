<template>
    <view class="displace_popup">
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
export default {
    name: 'displace_popup',
    props: {
        pageShowStatus: {
            type: Boolean,
            default: false
        }
    },
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
            ]
        }
    },
    methods: {
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
            // console.log('displaceConfirm', this.displaceStatus, this.displaceData[this.displaceCurrent].value)
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
        }
    },
    watch: {
        displaceStatus(val) {
            if (val !== 0) {
                this.$refs.popup.open()
            } else {
                uni.setStorageSync('displaceExpire', Date.now())
                this.displaceCurrent = 0
                this.$refs.popup.close()
            }
        },
        pageShowStatus: {
            immediate: true,
            handler(val) {
                if (val) {
                    const expire = this.displaceExpire()
                    // console.log('pageShowStatus', val)
                    if (expire) {
                        this.$store.dispatch('setDisplaceStatus')
                        // this.$store.commit('set_displaceStatus', 1)
                    }
                    // this.$store.commit('set_displaceStatus', 1)
                }
            }
        }
    },
    computed: {
        displaceStatus() {
            return this.$store.state.displaceStatus
        },
        displaceData() {
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
    }
}
</script>

<style  lang="scss">
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
</style>

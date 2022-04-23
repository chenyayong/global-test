<template>
    <view class="specification" v-if="dialog">
        <view class="content">
            <image src="/static/close.png" class="close" @tap="dialog = false" mode="" />
            <view class="image">
                <!-- <image :src="src" mode="" /> -->
                <image :src="imageSrc" mode="" />
                <view>
                    <view class="price">
                        <view class="font-24 inline">￥</view>
                        <view class="font-36 inline">{{ price }}</view>
                    </view>
                    <view class="font-28">请选择规格与数量</view>
                </view>
            </view>
            <view class="type">
                <view class="type-item" v-for="(item, index) in type" :key="index">
                    <view class="title font-32">{{ item.item_name }}</view>
                    <view class="item-item">
                        <view v-for="(ite, ind) in item.item_value" :key="ind" @tap="to_active(ind, index)" :class="[ite.active ? 'active' : '', 'list-item font-28']">
                            {{ ite.item }}
                        </view>
                    </view>
                </view>
            </view>
            <view class="num">
                <view class="font-32">请选择数量</view>
                <view class="counter">
                    <view class="less" @tap="add(-1)">-</view>
                    <view class="number">{{ num }}</view>
                    <view class="add" @tap="add(1)">+</view>
                </view>
            </view>
            <view class="buttom">
                <view @tap="add_card" v-if="open">加入购物车</view>
                <view class="buy-btn" @tap="to_pay">立即购买</view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    props: {
        value: {},
        type: {},
        num: {},
        src: {},
        spec_goods_price: {},
        price: {},
        open: {}
    },
    data() {
        return {
            dialog: false,
            typeIndex: 0,
            itemIndex: 0
        }
    },
    methods: {
        to_active(ind, index) {
            this.typeIndex = index
            this.itemIndex = ind
            this.$emit('to_active', ind, index)
        },
        add(num) {
            this.$emit('add', num)
        },
        add_card() {
            this.$emit('add_card')
        },
        to_pay() {
            this.$emit('to_pay')
            setTimeout(() => {
                this.dialog = false
            }, 500)
        }
    },
    watch: {
        value(val) {
            this.dialog = val
            if (val) {
                this.noScroll()
            } else {
                this.remScroll()
            }
        },
        dialog(val) {
            this.$emit('input', val)
        }
    },
    computed: {
        imageSrc() {
            if (this.type && this.type.length) {
                // console.log('imageSrc', this.type)
                const item = this.type[this.typeIndex]
                const item2 = item.item_value[this.itemIndex]
                return this.$image + item2.src
            } else {
                return this.src
            }
        }
    }
}
</script>

<style lang="scss">
.specification {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 99;
    background-color: rgba(0, 0, 0, 0.7);
    .content {
        position: absolute;
        bottom: 0;
        width: 100%;
        animation: toShow 0.3s;
        background-color: #ffffff;
        padding-top: 40rpx;
        .close {
            position: absolute;
            right: 30rpx;
            top: 30rpx;
            height: 36rpx;
            width: 36rpx;
        }
        .image {
            padding: 0 30rpx;
            display: flex;
            box-sizing: border-box;
            > image {
                height: 176rpx;
                width: 176rpx;
            }
            > view {
                flex: 1;
                padding-left: 36rpx;
                display: flex;
                flex-direction: column;
                justify-content: center;
                .price {
                    color: #ff4242;
                }
                .font-28 {
                    color: #666666;
                    margin-top: 10rpx;
                }
            }
        }
        .type {
            max-height: 480rpx;
            overflow-y: scroll;
            padding-left: 30rpx;
            box-sizing: border-box;
            .type-item {
                margin-top: 50rpx;
                .title {
                    color: #424242;
                }
                .item-item {
                    margin-top: 30rpx;
                    color: #777777;
                    .list-item {
                        line-height: 60rpx;
                        border-radius: 10rpx;
                        border: 2rpx solid;
                        margin-top: 30rpx;
                        padding: 0 30rpx;
                        float: left;
                        margin-right: 30rpx;
                    }
                    .active {
                        color: var(--theme);
                    }
                }
            }
            .type-item::after {
                content: '';
                display: block;
                clear: both;
            }
        }
        .num {
            display: flex;
            justify-content: space-between;
            padding: 0 30rpx;
            box-sizing: border-box;
            margin-top: 30rpx;
            align-items: center;
            .counter {
                display: flex;
                line-height: 58rpx;
                align-items: center;
                color: #666666;
                text-align: center;
                box-sizing: border-box;
                .less,
                .add {
                    width: 58rpx;
                    border: 1rpx solid #cfcfcf;
                }
                .number {
                    width: 96rpx;
                    border-top: 1rpx solid #cfcfcf;
                    border-bottom: 1rpx solid #cfcfcf;
                }
            }
        }
        .buttom {
            margin-top: 70rpx;
            height: 100rpx;
            display: flex;
            > view {
                flex: 1;
                color: white;
                font-size: 30rpx;
                text-align: center;
                line-height: 100rpx;
                background-color: #f5a623;
                color: #ffffff;
            }
            .buy-btn {
                background-color: var(--theme);
            }
        }
    }
}
</style>

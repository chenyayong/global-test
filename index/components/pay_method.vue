<template>
	<view class="pay_method" v-if="dialog" @touchmove.stop.prevent>
		<view class="content">
			<image src="/static/close.png" @tap="close" class="close" />
			<view class="header font-32">
				选择支付方式
			</view>
			<!-- <view class="pay-item" @tap="to_over_pay">
				<image src="/static/over.png" class="image-44" mode="" />
				<view class="value">
					<view>余额支付</view>
					<view class="num">{{user_money}}可用</view>
				</view>
			</view> -->
			<view class="pay-item" @tap="integral_pay" v-if="!offline_dialog">
				<image src="/static/over.png" class="image-44" mode="" />
				<view class="value">
					<view>积分支付</view>
					<view class="num">{{pay_points}}可用</view>
				</view>
			</view>
			<view class="pay-item" @tap="offline_pay" v-if="offline_dialog">
				<image src="/static/icon_3.png" class="image-44" mode="" />
				<view class="value">
					<view>线下支付</view>
					<view class="num"></view>
				</view>
			</view>
			<view class="pay-item" @tap="paypal_pay" v-if="offline_dialog">
			    <image src="/static/icon_3.png" class="image-44" mode="" />
			    <view class="value">
			        <view>国际支付</view>
			        <view class="num"></view>
			    </view>
			</view>
			<!-- #ifdef H5 -->
			<!-- <view class="pay-item" @tap="user_pay" v-if="offline_dialog">
				<image src="/static/wechat.png" class="image-44" mode="" />
				<view class="value">
					<view>微信好友代付</view>
					<view class="num"></view>
				</view>
			</view> -->
			<!-- #endif -->
			<view class="pay-item" v-for="(item,index) in list" :key="index" @tap="other_pay(item)">
				<image :src="$image+item.icon" class="image-44" mode="" />
				<view class="value">
					<view>{{item.name}}</view>
					<view class="num"></view>
				</view>
			</view>
			<!-- <view class="pay-item" @tap="to_replace_pay" v-if="!isFirend">
				<image src="/static/replace_icon.png" class="image-44" mode="" />
				<view class="value">
					<view>找人代付</view>
					<view class="num"></view>
				</view>
			</view> -->
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			value: {},
			list: {},
			user_money: {},
			pay_points: {
				default: 0
			},
			offline_dialog: {
				default: true
			},
			isFirend:false
		},
		data() {
			return {
				dialog: false,
			}
		},
		methods: {
			to_over_pay() {
				this.$emit("over_pay");
				this.dialog = false
			},
			offline_pay() {
				this.$emit("offline_pay");
			},
			other_pay(e) {
				this.$emit('other_pay', e)
			},
			close() {
				this.dialog = false;
				this.$emit('close')
			},
			user_pay() {
				this.dialog = false;
				this.$emit('user_pay')
			},
			integral_pay() {
				//    this.dialog=false;
				this.$emit("integral_pay");
			},
			paypal_pay() {
				this.$emit("paypal_pay");
				// this.$toast('暂未开放')
			},
			to_replace_pay(){
				this.dialog = false;
				this.$emit('replace_pay')
			}
		},
		watch: {
			value(val) {
				this.dialog = val;
				if (val) {
					this.noScroll();
				} else {
					this.remScroll();
				}
			},
			dialog(val) {
				this.$emit("input", val);
			}
		}
	}
</script>

<style lang="scss">
	.pay_method {
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

			.close {
				position: absolute;
				right: 30rpx;
				top: 30rpx;
				height: 36rpx;
				width: 36rpx;
			}

			.header {
				padding: 0 30rpx;
				box-sizing: border-box;
				text-align: center;
				line-height: 90rpx;
				border-bottom: 2rpx solid #F4F4F4;
			}

			.pay-item {
				padding: 0 30rpx;
				box-sizing: border-box;
				display: flex;
				align-items: center;
				height: 120rpx;
				position: relative;

				// border-bottom: 1rpx solid #F4F4F4;
				.value {
					padding-left: 20rpx;
					box-sizing: border-box;
					display: flex;
					justify-content: space-between;
					align-items: center;
					flex: 1;
					font-size: 30rpx;

					.num {
						color: #999999;
					}
				}
			}

			.pay-item::after {
				position: absolute;
				height: 2rpx;
				width: 690rpx;
				background-color: #F4F4F4;
				content: '';
				bottom: 0;
				left: 50%;
				margin-left: -345rpx;
			}
		}
	}
</style>

<template>
	<view class="pay_method" v-if="dialog" @touchmove.stop.prevent>
		<view class="content">
			<image src="/static/close.png" @tap="dialog = false" class="close" />
			<view class="header font-32">
				选择支付方式
			</view>
			<view class="pay-item" @tap="to_over_pay">
				<image src="/static/over.png" class="image-44" mode="" />
				<view class="value">
					<view>余额支付</view>
					<!-- <view class="num">{{user_money}}可用</view> -->
				</view>
			</view>
			<!-- <view class="pay-item" @tap="integral_pay">
				<image src="/static/icon_3.png" class="image-44" mode="" />
				<view class="value">
					<view>积分支付</view>
					<view class="num">{{pay_points}}可用</view>
				</view>
			</view> -->
			<view class="ios-btm"></view>
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
			}
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
			integral_pay() {
				//    this.dialog=false;
				this.$emit("integral_pay");
			},
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
	.ios-btm {
		height: constant(safe-area-inset-bottom);
		/* 兼容 iOS < 11.2 */
		height: env(safe-area-inset-bottom);
		/* 兼容 iOS >= 11.2 */
	}
</style>

<template>
	<view class="instead-pay">
		<view class="title">
			<view class="content font-36">
				<!-- <view style="font-size:86rpx;">“</view> -->
				<view class="font-36">
					我在Global3商城挑了样好东西，请你帮我付款吧~
				</view>
			</view>
		</view>
		<view class="flex s-center center user-info font-32">
			<view>代付金额</view>
			<view>收货人：{{order_info.consignee}}</view>
		</view>
		<view class="flex s-center center price">
			<view class="font-60">
				<view class="font-36 inline">￥</view>
				<view class="bold inline">
					{{order_info.order_amount}}
				</view>
			</view>
			<view class="flex s-center center">
				<view class="time font-28" style="margin-right:14rpx">剩余支付时间</view>
				<view class="time-num color">{{time.hour}}</view>
				<view class="font-28 dian">:</view>
				<view class="time-num color">{{time.min}}</view>
				<view class="font-28 dian">:</view>
				<view class="time-num color">{{time.sec}}</view>
			</view>
		</view>
		<view class="tip">
			<view>
				付款说明：
			</view>
			<view v-for="(item,index) in explain" :key="index">
				{{item}}
			</view>
		</view>
		<view class="to-pay" @tap="to_pay">
			立即支付
		</view>
		<view class="good-list-title">
			代付商品
		</view>
		<view class="flex good-item" v-for="(item,index) in order_info.goods_list" :key="index">
			<image :src="$image+item.original_img" class="good-img" mode="" />
			<view class="flex-item flex">
				<view class="flex-item flex s-center good-info">
					<view class="font-28 ellipsis-two">
						{{item.goods_name}}
					</view>
					<view class="font-26">
						{{item.spec_key_name}}
					</view>
					<view class="font-32">
						¥{{item.goods_price}}
					</view>
				</view>
				<view class="font-34">x{{item.goods_num}}</view>
			</view>
		</view>
		<view class="mengban" v-if="show">
			点击右上角分享给好友完成支付
		</view>
		<pay-method v-model="is_pay" :isFirend="true" :user_money="user_money" :pay_points="pay_points" :list="pay_list"
			:offline_dialog="false" @over_pay="over_pay" @integral_pay="integral_pay" @other_pay="other_pay">
			<!-- 支付方式 -->
		</pay-method>
		<no-password v-model="no_password" @check="set_password" :back="false" />
		<pay-password ref="pay" :pay_price="order_info.order_amount" v-model="pay_password" @check_word="check_word">
			<!-- 输入密码 -->
		</pay-password>
	</view>
</template>

<script>
	import payMethod from '../../index/components/pay_method.vue'
	import payPassword from '../../index/components/pay_password.vue'
	import noPassword from '../../index/components/no_password.vue'

	export default {
		data() {
			return {
				order_id: "",
				show: false,
				explain: [],
				order_info: {
					goods_list: [],
				},
				remaining_time: 0,
				timer: null,
				time: {
					hour: '00',
					min: '00',
					sec: '00'
				},
				is_pay: false,
				user_money: 0,
				pay_points: 0,
				pay_list: [],
				pay_password: false,
				pay_type: 1,
				no_password: false
			}
		},
		onLoad(val) {
			this.order_id = +val.order_id;
		},
		onShow() {
			this.$http("get|api/Order/another_order_detail", {
				order_id: this.order_id
			}).then(res => {
				this.explain = res.result.explain
				this.order_info = res.result.order_info;
				this.remaining_time = parseInt((this.order_info.auto_cancel_date * 1000 - new Date()) / 1000)
				this.timer = setInterval(() => {
					this.remaining_time--;
				}, 1000);
				// #ifdef H5
				this.$get_appId(['showMenuItems', 'updateAppMessageShareData', 'hideAllNonBaseMenuItem'], () => {
					$wx.hideAllNonBaseMenuItem();
					if (this.order_info.oneself === 1) {
						this.show = true;
						let url = window.location.origin + '/h5';
						url = url.split('#')[0];
						if (/\?/.test(url)) {
							url = url.split('?')[0]
						}
						url = url + '/#/' + 'shop_card/instead_pay/instead_pay?order_id=' + this.order_id
						$wx.showMenuItems({
							menuList: ['menuItem:share:appMessage']
						})
						this.$http('get|api/Index/share_detail').then(res => {
							$wx.updateAppMessageShareData({
								title: '请你帮我付款吧', // 分享标题
								desc: '我在Global3商城挑了样好东西，请你帮我付款吧~', // 分享描述
								link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
								imgUrl: this.$image + res.result.logo, // 分享图标
								success: res => {
									// alert('设置成功')
								}
							})
						})
					}
				})
				// #endif
			}).catch(e => {
				uni.showModal({
					title: '提示',
					content: e.msg,
					success: () => {
						uni.switchTab({
							url: '/pages/index'
						});
					}
				});
			})
		},
		methods: {
			to_pay() {
				this.$http('post|api/Cart/cart4', {
					order_id: this.order_id,
					type: 1
				}).then(res => {
					this.is_pay = true;
					this.user_money = res.result.user_money;
					// this.pay_list=res.result.paymentList;
					this.pay_points = res.result.pay_points;
				}).catch(e => {
					this.$toastApp(e.msg);
				})
			},
			check_word(e) {
				if (this.pay_type === 1) {
					this.$http('post|api/Order/pay_user_money', {
						order_id: this.order_id,
						paypwd: e,
						pay_radio: 'user_money',
						type: 1
					}).then(res => {
						this.$toastApp(res.msg);
						setTimeout(() => {
							uni.redirectTo({
								url: `/index/pay_success/pay_success?show=1`
							});
						}, 2000);
					}).catch(e => {
						this.$toastApp(e.msg);
						this.$refs.pay.passworld = [];
					})
				} else {
					this.$http('post|api/Order/another_pay_points', {
						order_id: this.order_id,
						paypwd: e,
						pay_radio: 'pay_points',
						type: 1
					}).then(res => {
						this.$toastApp(res.msg);
						setTimeout(() => {
							uni.redirectTo({
								url: `/index/pay_success/pay_success?show=1`
							});
						}, 2000);
					}).catch(e => {
						this.$toastApp(e.msg);
						this.$refs.pay.passworld = [];
					})
				}
			},
			over_pay() {
				//余额支付
				this.$http('get|api/User/is_paypwd').then(res => {
					this.no_password = true; //没有密码
				}).catch(e => {
					this.pay_password = true;
					this.pay_type = 1;
				})
				// this.pay_password=true
			},
			set_password() {
				//todo设置密码
				this.no_password = false;
				setTimeout(() => {
					uni.navigateTo({
						url: '/my/mdf_password/mdf_password'
					});
				}, 500)
			},
			integral_pay() {
				//积分支付
				this.$http('get|api/User/is_paypwd').then(res => {
					this.no_password = true; //没有密码
					this.no_password = false;
				}).catch(e => {
					this.pay_password = true;
					this.pay_type = 2;
				})
			},
			other_pay(e) {
				this.$http('post|api/Payment/getCode', {
					order_id: this.order_id,
					pay_radio: 'pay_code=' + e.code,
					type: 1
				}).then(res => {
					let code = res.result;
					this.$get_appId(['chooseWXPay'], _ => {
						$wx.chooseWXPay({
							timestamp: code.timeStamp,
							nonceStr: code.nonceStr,
							package: code.package,
							signType: 'MD5',
							paySign: code.paySign,
							success: ok => {
								uni.redirectTo({
									url: `/index/pay_success/pay_success?show=1`
								});
							}
						});
					})
				})
				// 其他支付  微信
			},
		},
		watch: {
			remaining_time(val) {
				let _time = val * 1000;
				if (_time > 0) {
					var hour = Math.floor(_time % (3600 * 1e3 * 24) / (1e3 * 60 * 60)); //相差小时
					var min = Math.floor(_time % (3600 * 1e3) / (1000 * 60)); //相差分钟
					var sec = Math.floor(_time % (3600 * 1e3) % (1000 * 60) / 1000);
					if (hour < 10) {
						hour = "0" + hour
					}
					if (min < 10) {
						min = "0" + min
					}
					if (sec < 10) {
						sec = "0" + sec
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
						sec: '00',
					}
				}
			}
		},
		components: {
			payMethod,
			payPassword,
			noPassword
		}
	}
</script>

<style lang="less" scoped>
	.instead-pay {
		padding-bottom: 20rpx;

		.title {
			height: 300rpx;
			// background-image: url("/static/instead_pay.png");
			//       background-size: 100%;
			background: linear-gradient(225deg, #02D86D 0%, #00B159 100%);
			display: flex;
			justify-content: center;
			align-items: center;

			.content {
				width: 500rpx;
				display: flex;
				color: #ffffff;
				align-items: flex-start;

				.font-36 {
					padding-top: 30rpx;
				}
			}
		}

		.user-info {
			padding: 30rpx;
			box-sizing: border-box;
			color: #969799;
		}

		.price {
			padding: 0 30rpx;
			box-sizing: border-box;

			.font-60 {
				color: #FF340A;
			}

			.color {
				color: #ffffff;
			}

			.dian {
				margin: 0 6rpx;
				color: #FF340A;
			}

			.time-num {
				height: 36rpx;
				width: 36rpx;
				border-radius: 4rpx;
				background-color: #FF340A;
				font-size: 24rpx;
				line-height: 36rpx;
				text-align: center;
				transform: scale(0.9);
			}
		}

		.tip {
			width: 690rpx;
			// height: 194rpx;
			background: #f7f7f7;
			border-radius: 10rpx;
			margin: 60rpx auto 0 auto;
			padding: 30rpx;
			box-sizing: border-box;
			font-size: 26rpx;
			line-height: 46rpx;
			color: #969799;
			flex-direction: column;
			justify-content: space-around;
		}

		.to-pay {
			font-size: 32rpx;
			width: 660rpx;
			height: 90rpx;
			background: var(--theme);
			border-radius: 46rpx;
			margin: 60rpx auto 0 auto;
			line-height: 90rpx;
			text-align: center;
			color: #ffffff;
		}

		.good-list-title {
			margin-top: 50rpx;
			color: #969799;
			font-size: 32rpx;
			line-height: 130rpx;
			padding: 0 30rpx;
			box-sizing: border-box;
		}

		.good-item {
			height: 240rpx;
			padding: 20rpx 30rpx;
			box-sizing: border-box;
			position: relative;

			&::after {
				position: absolute;
				content: '';
				height: 2rpx;
				width: 690rpx;
				left: 30rpx;
				transform: scaleY(0.5);
				background-color: #dfe3e6;
				bottom: 0;
			}

			.good-img {
				height: 200rpx;
				width: 200rpx;
			}

			>.flex-item {
				padding-left: 20rpx;
				box-sizing: border-box;
			}

			.good-info {
				flex-direction: column;
				padding-right: 60rpx;
				box-sizing: border-box;

				.font-26 {
					color: #999999;
				}
			}
		}
	}

	.mengban {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background-color: rgba(0, 0, 0, 0.8);
		padding-top: 300rpx;
		color: #ffffff;
		box-sizing: border-box;
		text-align: center;
	}
</style>

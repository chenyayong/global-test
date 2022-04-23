<template>
	<view class="offline-pay">
		<view class="tip">
			<image src="/static/tip.png" mode="" />
			<view class="font-24">线下支付完成后，请将支付凭证上传到订单，等待财务审核</view>
		</view>
		<!-- <view class="title font-26">
			银行收款账户
		</view>
		<view class="content">
			<view class="content-item font-30">
				<view class="label">账户名称: </view>
				<input type="" placeholder="" v-model="from.real_name"/>
			</view>
			<view class="content-item font-30">
				<view class="label">银行名称:  </view>
				<input type="" placeholder="" v-model="from.bank_name"/>
			</view>
			<view class="content-item font-30">
				<view class="label">账号:  </view>
				<input type="" placeholder="" v-model="from.bank_card"/>
			</view>
			<view class="content-item font-30">
				<view class="label">支行: </view>
				<input type="" placeholder="" v-model="from.bank_branch"/>
			</view>
		</view> -->
		<view class="update-image">
			<view class="font-28">上传支付凭证</view>
			<image :src="src" mode="" @tap="choose_img" />
		</view>
		<view class="submit font-30" @tap="submit">
			提交
		</view>
		<view class="bank font-26">
			<view>
				银行账号：{{bank_card}}
				<view class="copy" @tap="$copy(bank_card)">
					复制
				</view>
			</view>
			<view>
				银行名称：{{bank_name}}
				<view class="copy" @tap="$copy(bank_name)">
					复制
				</view>
			</view>
			<view>
				开户人姓名：{{real_name}}
				<view class="copy" @tap="$copy(real_name)">
					复制
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				src: '/static/update_image.png',
				from: {
					pay_radio: 'offline_pay',
					order_id: '',
					real_name: '',
					bank_card: '',
					bank_name: '',
					bank_branch: '',
					pay_doc: '',
				},
				bank_card: '',
				bank_name: '',
				real_name: ''
			}
		},
		onLoad({
			order_id
		}) {
			console.log(order_id);
			this.from.order_id = +order_id
			this.$http('get|api/Order/offline_pay', this.from).then(res => {
				this.bank_card = res.result.bank.bank_card;
				this.bank_name = res.result.bank.bank_name;
				this.real_name = res.result.bank.real_name;
			})
		},
		methods: {
			submit() {
				// if(this.from.real_name===''){
				// 	this.$toastApp('账户名称不能为空')
				// 	return
				// }
				// if(this.from.bank_card===''){
				// 	this.$toastApp('账号不能为空')
				// 	return
				// }
				// if(this.from.bank_branch===''){
				// 	this.$toastApp('支行不能为空')
				// 	return
				// }
				// if(this.from.pay_doc===''){
				// 	this.$toastApp('支付凭证不能为空')
				// 	return
				// }
				// #ifndef H5
				uni.showLoading()
				// #endif
				this.$http("post|api/Order/offline_pay", this.from).then(res => {
					// this.$toastApp(res.msg);
					uni.redirectTo({
						url: '../../shop_card/order_detail/order_detail?id=' + this.from.order_id
					})
				}).catch(e => {
					this.$toastApp(e.msg);
				})
			},
			choose_img() {
				uni.chooseImage({
					sourceType: ['compressed', 'original'],
					success: url => {
						uni.showLoading({
							title: "正在上传",
							mask: true
						})
						console.log(this.$serve);
						uni.uploadFile({
							url: `${this.$serve}/api/Api/add_pay_doc`,
							filePath: url.tempFilePaths[0],
							name: 'pay_doc',
							success: res => {
								res.data = JSON.parse(res.data);
								this.src = this.$image + res.data.result;
								this.from.pay_doc = res.data.result;
								uni.hideLoading();
							}
						});
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.offline-pay {
		background-color: #F7F7F7;
		min-height: calc(100vh - 88rpx);

		.tip {
			height: 76rpx;
			width: 100%;
			padding: 0 30rpx;
			box-sizing: border-box;
			background-color: #FEFCEB;
			display: flex;
			align-items: center;

			image {
				height: 34rpx;
				width: 38rpx;
			}

			.font-24 {
				color: #F96A0E;
				margin-left: 18rpx;
			}
		}

		.title {
			padding-left: 30rpx;
			line-height: 74rpx;
			color: #B3B3B3;
		}

		.content {
			background-color: #ffffff;
			padding: 0 30rpx;
			box-sizing: border-box;

			.content-item {
				display: flex;
				align-items: center;
				height: 100rpx;
				border-bottom: 2rpx solid #EFEFEF;

				.label {
					width: 200rpx;
					color: #999999;
				}
			}
		}

		.update-image {
			margin-top: 20rpx;
			padding: 30rpx;
			box-sizing: border-box;
			background-color: #ffffff;

			image {
				height: 184rpx;
				width: 184rpx;
				margin-top: 24rpx;
			}
		}

		.submit {
			width: 690rpx;
			height: 90rpx;
			background: rgba(78, 110, 243, 1);
			border-radius: 200rpx;
			text-align: center;
			line-height: 90rpx;
			color: #ffffff;
			margin: 0 auto;
			margin-top: 60rpx;
		}

		.bank {
			padding: 15px;
			line-height: 48rpx;
			color: #556DEB;

			.copy {
				font-size: 24rpx;
				padding: 0 3px;
				line-height: 13px;
				border: 1px solid #ccc;
				border-radius: 3px;
				color: #333;
				margin-left: 5px;
				display: inline-block;
			}
		}
	}
</style>

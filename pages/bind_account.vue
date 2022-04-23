<template>
	<view>
		<view class="login-title">绑定已有账号</view>
		<view class="from">
			<view class="from-item">
				<view class="label font-28">手机号码</view>
				<input class="font-28" v-model="from.mobile" type="number" placeholder="请输入手机号" placeholder-class="placeholder" />
			</view>
			<view>
				<picker :range="list" range-key="area_name" @change="picker_change">
					<view class="from-item">
						<view class="font-30 label">
							归属地
						</view>
						<view class="font-30" :style="{
					                textAlign:'left',
					                flex:1,
					                color:area_name?'#333333':'grey'
					                }">
							{{area_name?area_name:'号码归属地'}}
						</view>
					</view>
				</picker>
				<view class="from-item rel">
					<view class="label font-28">验证码</view>
					<input class="font-28" v-model="from.code" type="number" maxlength="4" placeholder="验证码" placeholder-class="placeholder" />
					<vercode class="right" v-model="from.mobile" :timeout="timeout" :area="area"></vercode>
				</view>
				<view class="from-item">
					<view class="label font-28">邀请码</view>
					<input class="font-28" v-model="from.invite" type="invite" placeholder="请输入推荐码" placeholder-class="placeholder" />
				</view>
			</view>
		</view>
		<view class="buttom font-32" @tap="save">立即绑定</view>
	</view>
</template>

<script>
	import vercode from "@/components/get_verification.vue"
	import bindAccount from '../index/components/bind_account.vue';
	export default {
		data() {
			return {
				from: {
					mobile: '',
					code: '',
					invite: '',
					oauth_child:'app'
				},
				area: '',
				area_name: '',
				list: [],
				timeout: 0,
			}
		},
		mounted() {
			this.$http('get|api/Api/send_validate_code').then(res => {
				this.list = res.result.country_area;
				this.timeout = +res.result.sms_time_out
			})
		},
		methods: {
			save() {
				if (this.from.mobile || this.from.code) {
					this.$http('post|api/User/bind_account', this.from).then(res => {
						this.$toastApp(res.msg);
						setTimeout(() => {
							uni.switchTab({
								url:'/pages/index'
							})
						}, 1000);
					}).catch(err => {
						this.$toastApp(err.msg);
					})
				} else {
					this.$toastApp('手机号或验证码不能为空');
				}
			},
			picker_change(e) {
				let index = e.detail.value;
				this.area = this.list[index].area
				this.area_name = this.list[index].area_name
			}
		},
		components: {
			vercode
		}
	}
</script>

<style lang="scss">
	.login-title {
		height: 66rpx;
		font-size: 48rpx;
		font-family: PingFangSC, PingFangSC-Medium;
		font-weight: 500;
		text-align: left;
		color: #313133;
		line-height: 66rpx;
		margin-top: 20rpx;
		margin-left: 60rpx;
	}

	.register {
		height: 36rpx;
		font-size: 26rpx;
		font-family: PingFangSC, PingFangSC-Regular;
		font-weight: 400;
		text-align: left;
		color: #919298;
		line-height: 36rpx;
		margin-left: 60rpx;
		margin-top: 14rpx;

		.blue {
			color: var(--theme);
		}
	}

	.psw-login {
		position: relative;
		height: 36rpx;
		font-size: 26rpx;
		font-family: PingFangSC, PingFangSC-Regular;
		font-weight: 400;
		text-align: left;
		color: #919298;
		line-height: 36rpx;
		margin-top: 24rpx;

		.forget-psw {
			position: absolute;
			right: 0;
			padding: 10rpx;
		}
	}

	.from {
		padding: 60rpx;
		padding-bottom: 0;
		box-sizing: border-box;

		.rel {
			position: relative;
		}

		.right {
			position: absolute;
			right: 0;
		}

		.from-item {
			display: flex;
			border-bottom: 1rpx solid #F2F3F6;
			height: 100rpx;
			width: 630rpx;
			align-items: center;

			.label {
				width: 140rpx;
			}

			.placeholder {
				color: #D7D7D9;
			}

			input {
				width: 80%;
			}
		}
	}

	.buttom {
		width: 630rpx;
		height: 100rpx;
		background: var(--theme);
		border-radius: 50rpx;
		text-align: center;
		line-height: 100rpx;
		margin: 0 auto;
		margin-top: 60rpx;
		color: #ffffff;
	}

	.wx-login {
		position: absolute;
		bottom: 60rpx;
		left: 0;
		right: 0;

		.line {
			display: inline-block;
			width: 122rpx;
			height: 4rpx;
			vertical-align: middle;
			background-color: #d7d7d7;
		}

		.wx-title {
			// display: inline-block;
			font-size: 28rpx;
			font-family: PingFangSC, PingFangSC-Medium;
			font-weight: 500;
			// text-align: left;
			color: #b9b9b9;
			line-height: 40rpx;
			letter-spacing: 1rpx;
			text-align: center;

			text {
				padding: 0 20rpx;
			}
		}

		.logo-box {
			margin-top: 70rpx;
			text-align: center;

			image {
				width: 68rpx;
				height: 68rpx;
			}

			text {
				display: block;
				font-size: 26rpx;
				font-family: PingFangSC, PingFangSC-Medium;
				font-weight: 500;
				text-align: center;
				color: #999999;
				line-height: 36rpx;
				letter-spacing: -1px;
			}
		}
	}
</style>

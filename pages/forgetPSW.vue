<template>
	<view>
		<view v-if="type != 1" class="login-title">忘记密码</view>
		<view class="from">
			<view class="from-item">
				<view class="label font-28">手机号</view>
				<input v-if="type != 1" class="font-28" v-model="from.mobile" type="number" placeholder="请输入手机号码" placeholder-class="placeholder" />
				<view v-if="type == 1" class="font-28">{{mobile}}</view>
				<image v-if="type != 1" class="item-img" src="../static/close_new.png" @tap="clearMobile"></image>
			</view>
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
				<input class="font-28" v-model="from.mobile_code" type="number" maxlength="4" placeholder="验证码" placeholder-class="placeholder" />
				<vercode class="right" v-model="from.mobile" :timeout="timeout" :area="area"></vercode>
			</view>
			<view class="from-item">
				<view class="label font-28">登录密码</view>
				<input class="font-28 no-bor" v-model="from.new_password" :type="isPsw?'text':'password'" placeholder="设置密码6-12位字母+数字" placeholder-class="placeholder" />
				<image class="item-img" :src="isPsw?pswYes:pswNo" @tap="isPsw = !isPsw"></image>
			</view>
			<view class="from-item">
				<view class="label font-28">确认密码</view>
				<input class="font-28 no-bor" v-model="from.confirm_password" :type="isPsw2?'text':'password'" placeholder="请输入确认密码" placeholder-class="placeholder" />
				<image class="item-img" :src="isPsw2?pswYes:pswNo" @tap="isPsw2 = !isPsw2"></image>
			</view>
		</view>
		<button class="buttom font-32" @tap="save">确定</button>
	</view>
</template>

<script>
	import vercode from "@/components/forget_captcha.vue"
	export default {
		data() {
			return {
				from: {
					mobile: '',
					mobile_code: '',
					new_password: '',
					confirm_password: ''
				},
				area: '',
				area_name: '',
				list: [],
				timeout: 0,
				isPsw:false,
				isPsw2:false,
				pswNo:'../static/psw_no.png',
				pswYes:'../static/psw_yes.png',
				type:'',
				mobile:''
			};
		},
		mounted() {
			this.$http('get|api/Api/send_validate_code').then(res => {
				this.list = res.result.country_area;
				this.timeout = +res.result.sms_time_out
			})
		},
		methods: {
			clearMobile(){
				this.from.mobile = ''
			},
			picker_change(e) {
				let index = e.detail.value;
				this.area = this.list[index].area
				this.area_name = this.list[index].area_name
			},
			save() {
				this.$http('post|api/User/find_pwd',this.from).then(res => {
					this.$toastApp(res.msg);
					setTimeout(()=>{
						uni.navigateBack()
					},1000)
				}).catch(err => {
					this.$toastApp(err.msg);
				})
			}
		},
		components: {
			vercode
		},
		onLoad(options) {
			if (options.type == 1) {
				uni.setNavigationBarTitle({
					title:'修改登录密码'
				})
				this.$http('get|api/User/set_pwd').then(res=>{
					this.from.mobile=res.result.mobile;
					this.mobile=res.result.mobile1
				})
			}
			this.type = options.type
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

	.from {
		padding: 60rpx;
		box-sizing: border-box;
		padding-right: 0;

		.rel {
			position: relative;
		}

		.right {
			position: absolute;
			right: 0;

			text {
				font-size: 28rpx;
				color: var(--theme);
			}
		}

		.from-item {
			display: flex;
			border-bottom: 1rpx solid #F2F3F6;
			height: 100rpx;
			width: 630rpx;
			align-items: center;
			position: relative;

			.label {
				width: 140rpx;
			}

			.placeholder {
				color: #D7D7D9;
			}

			.item-img{
				position: absolute;
				right: 20rpx;
				width: 36rpx;
				height: 36rpx;
			}
			
			.no-bor{
				border: none;
				outline:none;
				width: 60%;
			}
		}
	}

	.buttom {
		width: 630rpx;
		height: 90rpx;
		background: rgba(78, 110, 243, 1);
		border-radius: 45rpx;
		text-align: center;
		line-height: 90rpx;
		margin: 0 auto;
		margin-top: 20rpx;
		color: #ffffff;
	}
</style>

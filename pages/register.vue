<template>
	<view>
		<view class="login-title">
			<view>注册账号</view>
			<!-- <view class="language-box">
				<view class="language-item">
					<view class="checks" @tap="showCountry = !showCountry,showLanguage = false">
						<image style="border-radius: 50%;" :src="`/static/${checkCountry.icon}.jfif`"></image>
						<text>{{checkCountry.name}}</text>
						<image src="/static/filter_b.png"></image>
					</view>
					<view class="check-box" style="width: 140rpx;" v-show="showCountry">
						<view class="check-item" v-for="(item,index) in countryList" :key="index"
							@tap="checkC(item)">
							<image :src="`/static/${item.icon}.jfif`"></image>
							<text>{{item.name}}</text>
						</view>
					</view>
				</view>
				<view class="language-item">
					<view class="checks" @tap="showLanguage = !showLanguage,showCountry = false">
						<image src="/static/lan_b.png"></image>
						<text>中文</text>
						<image src="/static/filter_b.png"></image>
					</view>
					<view class="check-box" v-show="showLanguage">
						<view class="check-item" @tap="showLanguage=false,$toast('暂未开放')">En</view>
					</view>
				</view>
			</view> -->
		</view>
		<view class="register">
			<text>已有账号？</text>
			<text class="blue" @click="go_login">立即登录</text>
		</view>
		<form @submit="formSubmit" >
			<view class="from">
				<view class="from-item">
					<view class="label font-28">手机号</view>
					<input class="font-28" v-model="from.mobile" name="mobile" type="number" placeholder="请输入手机号码" placeholder-class="placeholder" />
					<image class="item-img" src="../static/close_new.png" @tap="clearMobile"></image>
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
					<input class="font-28" v-model="from.mobile_code" name="mobile_code" type="number" maxlength="4" placeholder="验证码" placeholder-class="placeholder" />
					<vercode class="right" v-model="from.mobile" :timeout="timeout" :area="area"></vercode>
				</view>
				<view class="from-item">
					<view class="label font-28">密码</view>
					<input class="font-28 no-bor" :type="isPsw?'text':'password'" v-model="from.password" name="password" placeholder="设置密码6-12位字母+数字" placeholder-class="placeholder" />
					<image class="item-img" :src="isPsw?pswYes:pswNo" @tap="isPsw = !isPsw"></image>
				</view>
				<view class="from-item">
					<view class="label font-28">确认密码</view>
					<input class="font-28 no-bor" :type="isPsw2?'text':'password'" v-model="from.password2" name="password2" placeholder="请确认密码" placeholder-class="placeholder" />
					<image class="item-img" :src="isPsw2?pswYes:pswNo" @tap="isPsw2 = !isPsw2"></image>
				</view>
				<view class="from-item">
					<view class="label font-28">邀请码</view>
					<input class="font-28" v-model="from.invite" name="invite" placeholder="请输入推荐码" placeholder-class="placeholder" />
				</view>
				<view class="radio">
					<radio-group @change="isChange">
						<!-- 深圳快来互娱网络科技有限公司 -->
						<!-- <radio color="#4E6EF3" value="agree" />我已阅读并同意<text @tap="go_agree(3)">网络服务协议</text>和<text @tap="go_agree(6)">隐私政策</text> -->
						
						<!-- 深圳市创星视界科技有限公司 -->
						<radio color="#4E6EF3" value="agree" />我已阅读并同意<text @tap="go_agree(3)">网络服务协议</text>和<text @tap="go_agree(4)">隐私政策</text>
					</radio-group>
				</view>
			</view>
			<button form-type="submit" class="buttom font-32">注册</button>
		</form>
	</view>
</template>

<script>
	import vercode from "@/components/get_verification.vue"
	var graceChecker = require("@/globe/checker.js")
	export default {
		data() {
			return {
				from: {
					mobile: '',
					mobile_code: '',
					password: '',
					password2: '',
					push_id: plus.push.getClientInfo().clientid,
					invite: '',
					isAgree:''
				},
				area: '',
				area_name: '',
				list: [],
				timeout: 0,
				isPsw:false,
				isPsw2:false,
				pswNo:'../static/psw_no.png',
				pswYes:'../static/psw_yes.png',
				showLanguage: false,
				showCountry: false,
				checkCountry: {
					icon: 'china',
					name: '中国'
				},
				countryList: [{
					icon: 'china',
					name: '中国'
				}, {
					icon: 'hk',
					name: '香港'
				}, {
					icon: 'am',
					name: '澳门'
				}, {
					icon: 'canada',
					name: '加拿大'
				}, {
					icon: 'mg',
					name: '美国'
				}, {
					icon: 'tw',
					name: '台湾'
				}, {
					icon: 'mlxy',
					name: '马来西亚'
				}, {
					icon: 'xjp',
					name: '新加坡'
				}, {
					icon: 'rb',
					name: '日本'
				}, {
					icon: 'yn',
					name: '越南'
				}],
			}
		},
		mounted() {
			this.$http('get|api/Api/send_validate_code').then(res => {
				this.list = res.result.country_area;
				this.timeout = +res.result.sms_time_out
			})
		},
		methods: {
			checkC(item){
				this.checkCountry = item
				this.showCountry = false
			},
			clearMobile(){
				this.from.mobile = ''
			},
			formSubmit(e) {
				//定义表单规则
				var rule = [{
						name: "mobile",
						checkType: "notnull",
						errorMsg: "手机号码不能为空"
					},
					{
						name: "mobile_code",
						checkType: "notnull",
						errorMsg: "请输入验证码"
					},
					{
						name: "password",
						checkType: "notnull",
						errorMsg: "请输入密码"
					},
					{
						name: "password",
						checkType: "string",
						checkRule: "6,12",
						errorMsg: "密码应为6-12位字母+数字"
					},
					{
						name: "password2",
						checkType: "notnull",
						errorMsg: "请输入确认密码"
					},
					{
						name: "password",
						checkType: "same",
						checkRule: this.from.password2,
						errorMsg: "两次密码输入不一致"
					},
					{
						name: "password2",
						checkType: "same",
						checkRule: this.from.password,
						errorMsg: "两次密码输入不一致"
					}
				]
				//进行表单检查 e.detail.value 内存放着表单数据
				var formData = e.detail.value;
				var checkRes = graceChecker.check(formData, rule);
				if (checkRes) {
					if (this.isAgree) {
						this.$http('post|api/User/reg', this.from).then(res => {
							this.$toastApp(res.msg);
							setTimeout(() => {
								uni.navigateBack();
							}, 500);
						}).catch(err => {
							this.$toastApp(err.msg, 'none');
						})
					}else{
						this.$toastApp('请先阅读并同意协议', 'none');
					}
				} else {
					uni.showToast({
						title: graceChecker.error,
						icon: "none"
					});
				}
			},
			picker_change(e) {
				let index = e.detail.value;
				this.area = this.list[index].area
				this.area_name = this.list[index].area_name
			},
			go_login() {
				uni.redirectTo({
					url: '/pages/login'
				})
			},
			go_agree(type){
				this.$http('get|api/Article/regulation',{
					id:type
				}).then(res => {
					uni.navigateTo({
						url:'/pages/agreement?type='+ type + '&title=' + res.result.topic_title
					})
				})
			},
			isChange(e){
				this.isAgree = e.detail.value
			}
		},
		components: {
			vercode
		}
	}
</script>

<style lang="scss">
	.login-title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 66rpx;
		font-size: 48rpx;
		font-family: PingFangSC, PingFangSC-Medium;
		font-weight: 500;
		text-align: left;
		color: #313133;
		line-height: 66rpx;
		// padding: 0 20rpx;
		margin-left: 60rpx;
		.language-box {
			// position: absolute;
			// top: 24rpx;
			// right: 20rpx;
			display: flex;
			align-items: center;
			margin-right: 20rpx;
		
			.language-item {
				margin-left: 20rpx;
			}
		
			.checks {
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 24rpx;
				color: #333333;
		
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
				background-color: #FFFFFF;
				border: 2rpx solid #CCCCCC;
		
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
		}

		.from-item {
			display: flex;
			border-bottom: 1rpx solid #F2F3F6;
			height: 100rpx;
			align-items: center;
			width: 630rpx;
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
			}
		}
	}
	.radio{
		font-size: 24rpx;
		font-family: PingFangSC, PingFangSC-Regular;
		font-weight: 400;
		text-align: left;
		color: #a7aab3;
		line-height: 32rpx;
		margin-top: 26rpx;
		
		radio{
			transform: scale(0.7);
			vertical-align: middle;
		}
		
		text{
			color: #ff5a3c;
			text-decoration: underline;
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

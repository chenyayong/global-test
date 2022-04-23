<template>
	<view>
		<view class="from">
			<view class="from-item">
				<view class="font-30">姓名</view>
				<input type="text" v-model="from.realname" class="font-30" placeholder="请输入真实姓名" placeholder-class="D7">
			</view>
			<view class="from-item">
				<view class="font-30">支付宝账号</view>
				<input type="text" v-model="from.bank_card" class="font-30" placeholder="请输入支付宝账号" placeholder-class="D7">
			</view>
			<!-- <view class="from-item from-img">
				<view class="font-30">收款二维码</view>
				<image :src="src" mode="" @tap="add_image"/>
			</view> -->
		</view>
		<view class="buttom font-30" @tap="save">
			确定
		</view>
		<pay-password ref="pay" v-model="pay_dialog" :show="false" @check_word="is_save"></pay-password>
	</view>
</template>

<script>
	import payPassword from 'index/components/pay_password.vue'
	export default {
		data() {
			return {
				src:'/static/add_img.png',
				from:{
					bank_type:2,
					realname:'',
					bank_card:'',
					alipay_code:'',
					paypwd:''
				},
				pay_dialog:false,
			}
		},
		methods: {
			save(){
				if(this.from.realname==''){
					this.$toastApp('姓名不能为空');
					return
				}
				if(this.from.bank_card==''){
					this.$toastApp('账号不能为空');
					return
				}
				// if(this.from.alipay_code==''){
				// 	this.$toastApp('请上传收款码');
				// 	return
				// }
				this.pay_dialog=true;
			},
			is_save(e){
				// #ifndef H5
				uni.showLoading()
				// #endif
				this.from.paypwd=e;
				this.$http('post|api/User/add_bankcard',this.from).then(res=>{
					this.$toastApp(res.msg);
					setTimeout(()=>{
						uni.navigateBack();
					},2000)
				}).catch(e=>{
					this.$toastApp(e.msg);
					this.$refs.pay.passworld=[]
				})
			},
			add_image(){
				uni.chooseImage({
					sourceType:['compressed', 'original'],
					success:url=>{
						uni.showLoading({
							title:"正在加载中"
						})
						this.src=url.tempFilePaths[0];
						uni.uploadFile({
							url: `${this.$serve}/api/Api/alipay_code`,
							filePath: url.tempFilePaths[0],
							name: 'alipay_code',
							success: res => {
								if(res.data.code===0){
									this.$toastApp(res.data.msg);
									return
								}
								res.data=JSON.parse(res.data);
								console.log(res.data.result);
								this.from.alipay_code=res.data.result;
								uni.hideLoading();
							}
						});
					}
				})
			}
		},
		components:{
			payPassword
		}
	}
</script>

<style lang="scss">
	.from{
		padding: 0 30rpx;
		box-sizing: border-box;
		.from-item{
			height: 100rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			box-shadow:0px 1rpx 0px 0px rgba(223,227,230,1);
			margin-top: 2rpx;
			input{
				text-align: right;
			}
		}
		.D7{
			color: #D7D7D9;
		}
		.from-img{
			display: block;
			height: auto;
			>view{
				line-height: 90rpx;
			}
			>image{
				height: 180rpx;
				width: 180rpx;
				margin-bottom: 20rpx;
			}
		}
	}
	.buttom{
		width:690rpx;
		height:100rpx;
		background:rgba(51,135,255,1);
		border-radius:45rpx;
		margin: 0 auto;
		margin-top: 60rpx;
		text-align: center;
		line-height: 90rpx;
		color: #ffffff;
	}
</style>

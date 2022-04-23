<template>
	<view class="page">
		<view class="input">
			<input v-model="name" type="text" placeholder="" />
			<image src="/static/clear.png" mode="" @tap="name=''"/>
		</view>
		<view class="tip font-24">
			4-20个字符，可由中英文、数字组成
		</view>
		<view class="save font-32" @tap="save">
			保存
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name:""
			}
		},
		mounted(){
			this.name=this.user.nickname
		},
		methods:{
			save(){
				// #ifndef H5
				uni.showLoading()
				// #endif
				this.$http('post|api/User/userinfo',{
					nickname:this.name
				}).then(res=>{
					this.$store.dispatch('set_user',Object.assign(this.user,{nickname:this.name}))
					this.$toastApp(res.msg);
					setTimeout(()=>{
						uni.navigateBack();
					},1000)
				})
			}
		},
		computed:{
			user(){
				return this.$store.getters.get_user
			}
		}
	}
</script>

<style lang="scss">
	.page{
		min-height:calc(100vh - 88rpx);
		background-color: #F7F7F7;
		.input{
			position: relative;
		}
		input{
			height: 100rpx;
			background-color: #ffffff;
			padding: 0 30rpx;
			box-sizing: border-box;
			font-size: 30rpx;
		}
		image{
			position: absolute;
			right: 30rpx;
			top: 50%;
			margin-top: -14rpx;
			height: 28rpx;
			width: 28rpx;
		}
		.tip{
			padding-left: 30rpx;
			box-sizing: border-box;
			color: #B3B3B3;
			margin-top: 20rpx;
		}
		.save{
			width:690rpx;
			height:90rpx;
			background:var(--theme);
			border-radius:45rpx;
			line-height: 90rpx;
			text-align: center;
			margin: 0 auto;
			margin-top: 60rpx;
			color: #ffffff;
		}
	}
</style>

<template>
	<view class="success">
		<view class="content">
			<image src="/static/success.png" mode="" />
			<view style="margin-top:40rpx" class="font-32">支付成功</view>
			<view style="margin-top:30rpx" class="font-28">恭喜您支付成功！</view>
			<view class="buttom font-30" @tap="to_order" v-if="show">
				查看订单
			</view>
			<view class="buttom font-30" @tap="back" v-else>
				返回首页
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show:true
			}
		},
		onLoad(val){
			if(val.show){
				this.show=false
			}
		},
		methods: {
			to_order(){
				uni.redirectTo({
					url: `/shop_card/my_order/my_order?type=WAITSEND`
				});
			},
			back(){
				uni.switchTab({
					url: '/pages/index'
				});
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #F7F7F7;
	}
	.success{
		height: calc(100vh - 88rpx);
		background-color: #F7F7F7;
		display: flex;
		justify-content: center;
		align-items: center;
		.content{
			text-align: center;
			image{
				height: 200rpx;
				width: 200rpx;
				background-size: 100%;
			}
			.font-28{
				color: #999999;
			}
			.buttom{
				margin:40rpx auto 0 auto;
				width:278rpx;
				height:90rpx;
				background:var(--theme);
				border-radius:200rpx;
				color: #ffffff;
				line-height: 90rpx;
			}
		}
	}
</style>

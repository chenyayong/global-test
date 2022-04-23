<template>
	<view>
		<view class="header-image">
			<view  class="font-34">
				订单正在向你飞奔～
			</view>
			<image src="/static/icon_16.png" mode="" />
		</view>
		<view class="tip">
			<view class="font-28">物流公司：{{code}}</view>
			<view class="font-26 inline">物流单号：{{invoice_no}}</view>
			<view class="inline copy">
				<view class="copy-text" @tap="$copy(invoice_no)">复制</view>
			</view>
		</view>
		<view class="title font-30">
			物流跟踪
		</view>
		<view class="invoice">
			<view>
				<view v-for="(item,index) in shopping" :key="index" class="invoice-left" :style="{height:index==shopping.length-1?'0':'180rpx'}">
					<view class="bool"></view>
					<view class="active-bool" v-if="index===0">
						<view class="small-bool">
						</view>
					</view>
				</view>
			</view>
			<view style="margin-top:-12rpx">
				<view v-for="(item,index) in shopping" :key="index" class="invoice-right font-28">
					<view>
						{{item.status}}
					</view>
					<view>
						{{item.time}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id:'',
				invoice_no:'',
				shopping:[],
				code:''
			}
		},
		onLoad(val){
			this.id=val.id;
			this.invoice_no=val.invoice_no;
			this.code=val.code
			this.$http('get|api/Order/queryExpress',{
				order_id:this.id,
				invoice_no:this.invoice_no
			}).then(res=>{
				this.shopping=res.result.shopping;
			})
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
page{
	background-color: #F7F7F7;
}
	.header-image{
		padding: 40rpx 60rpx;
		box-sizing: border-box;
		/* #ifdef APP-PLUS */
		background: linear-gradient(225deg, rgba(116, 155, 255, 1) 0%, rgba(65, 100, 244, 1) 100%);
		/* #endif */
		/* #ifdef H5 */
		background: linear-gradient(225deg, #02D86D 0%, #00B159 100%);
		/* #endif */
		height:184rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: #ffffff;
		image{
			width: 100rpx;
			height: 100rpx;
		}
	}
	.tip{
		padding: 30rpx;
		box-sizing: border-box;
		background-color: #ffffff;
		.font-28{
			color: var(--theme);
		}
		.font-26{
			color: #999999;
		}
		.copy{
			width:68rpx;
			height:40rpx;
			border-radius:8rpx;
			border:1rpx solid rgba(51,51,51,1);
			position: relative;
			vertical-align: middle;
			margin-left: 14rpx;
			.copy-text{
				position: absolute;
				font-size: 24rpx;
				transform: scale(0.9);
				left: 10rpx;
				top: 4rpx;
			}
		}
	}
	.title{
		height: 110rpx;
		padding: 0 30rpx;
		line-height: 110rpx;
		background-color: #ffffff;
		margin-top:30rpx;
		color: #727272;
		position: relative;
	}
	.title::after{
		position: absolute;
		content: '';
		height: 2rpx;
		width: 726rpx;
		background-color: #D9D9D9;
		bottom: 0;
		right: 0;
	}
	.invoice{
		background-color: #ffffff;
		padding: 30rpx 40rpx;
		box-sizing: border-box;
		display: flex;
	}
	.invoice-left{
		width: 6rpx;
		background-color: #cccccc;
		position: relative;
		.bool{
			position: absolute;
			height: 14rpx;
			width: 14rpx;
			background-color: #cccccc;
			border-radius: 50%;
			margin-left: -5rpx;
		}
		.active-bool{
			width:32rpx;
			height:32rpx;
			background:rgba(78,110,243,0.2);
			position: absolute;
			border-radius: 50%;
			top: -12rpx;
			left: -14rpx;
			.small-bool{
				width:24rpx;
				height:24rpx;
				background:var(--theme);
				border-radius: 50%;
				position: absolute;
				left: 50%;
				margin-left: -12rpx;
				top: 50%;
				margin-top: -12rpx;
			}
		}
	}
	.invoice-right{
		height: 180rpx;
		padding-left: 30rpx;
		flex: 1;
		box-sizing: border-box;
		color: #999999;
	}
</style>

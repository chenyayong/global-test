<template>
	<view>
		<view class="top-box">
			<view class="search-box">
				<image src="/static/search_new.png"></image>
				<input type="number" v-model="orderId" focus placeholder="请输入订单编号" />
			</view>
			<view class="search-btn" @tap="search">搜索</view>
		</view>
		<view style="height: 88rpx;"></view>
		<view class="order-item" v-for="(oitem,oindex) in list" :key="oindex" @tap="toDetail(oitem.order_id)">
			<view class="order-top">
				<text>订单编号：{{oitem.order_sn}}</text>
				<text class="status">{{oitem.order_status_desc}}</text>
			</view>
			<view class="goods-item" v-for="(item,index) in oitem.goods_list" :key="index">
				<image class="thumb" :src="$image+item.original_img"></image>
				<view class="right-box">
					<view class="r-top-box">
						<view class="goods-tlt">{{item.goods_name}}</view>
						<view class="sum-num">x{{item.goods_num}}</view>
					</view>
					<view class="mid-box">{{item.spec_key_name}}</view>
					<view class="price-box">¥{{item.member_goods_price}}</view>
				</view>
			</view>
			<view class="btm-info">
				<text>共{{oitem.goods_list.length}}件商品</text>
				<text>运费：¥{{oitem.shipping_price}}</text>
				<text>总价：¥{{oitem.total_amount}}</text>
			</view>
			<view class="btn-box">
				<view class="btn">我要代付</view>
			</view>
		</view>
		<no-data v-if="!list.length"></no-data>
	</view>
</template>

<script>
	import noData from 'components/no_data.vue'
	export default {
		components:{
			noData
		},
		data() {
			return {
				orderId:'',
				list:[]
			}
		},
		methods:{
			toDetail(id){
				uni.navigateTo({
					url:'/shop_card/replace_pay/detail?id='+ id
				})
			},
			search(){
				this.$http('get|api/Order/multi_another_order_list',{
					order_sn: this.orderId
				}).then(res => {
					if (res.status == 1) {
						this.list = res.result.lists
					}
				}).catch(e => {
					this.$toastApp(e.msg)
				})
			}
		},
	}
</script>

<style lang="scss">
	view{
		box-sizing: border-box;
	}
	page{
		background-color: #F5F5F5;
	}
	.top-box{
		display: flex;
		align-items: center;
		position: fixed;
		/* #ifdef APP-PLUS */
		top: 0;
		/* #endif */
		/* #ifdef H5 */
		top: 80rpx;
		/* #endif */
		z-index: 999;
		width: 100vw;
		height: 88rpx;
		padding-left: 30rpx;
		background-color: #FFFFFF;
		
		.search-box{
			display: flex;
			align-items: center;
			padding: 0 30rpx;
			width: 610rpx;
			height: 60rpx;
			border-radius: 30rpx;
			background-color: #F7F7F7;
			image{
				width: 26rpx;
				height: 26rpx;
			}
			input{
				color: #2A2C33;
				font-size: 26rpx;
				// height: 100%;
				width: 530rpx;
				// line-height: 60rpx;
				margin-left: 12rpx;
			}
		}
		.search-btn{
			display: flex;
			align-items: center;
			justify-content: center;
			width: 110rpx;
			color: #333333;
			font-size: 30rpx;
			height: 100%;
		}
	}
	.order-item{
		margin-top: 20rpx;
		background-color: #FFFFFF;
		.order-top{
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 28rpx;
			color: #454545;
			padding: 0 30rpx;
			height: 80rpx;
			.status{
				color: #F41613;
			}
		}
		.goods-item{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20rpx 30rpx;
			box-shadow: 0 -2rpx 0 0 #EEEEEE;
			.thumb{
				width: 200rpx;
				height: 200rpx;
			}
			.right-box{
				display: flex;
				justify-content: space-between;
				flex-direction: column;
				width: 470rpx;
				height: 200rpx;
				.r-top-box{
					width: 470rpx;
					display: flex;
					justify-content: space-between;
					align-items: flex-start;
					.goods-tlt{
						width: 380rpx;
						color: #292D33;
						font-size: 28rpx;
						line-height: 40rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
					}
					.sum-num{
						color: #474F59;
						font-size: 34rpx;
						line-height: 48rpx;
					}
				}
				.mid-box{
					color: #999999;
					font-size: 26rpx;
					line-height: 36rpx;
				}
				.price-box{
					color: #474F59;
					font-size: 32rpx;
					line-height: 44rpx;
				}
			}
		}
	}
	.btm-info{
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: #353535;
		font-size: 28rpx;
		padding: 20rpx 30rpx;
		box-shadow: 0 -2rpx 0 0 #EEEEEE;
	}
	.btn-box{
		height: 100rpx;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding: 0 30rpx;
		box-shadow: 0 -2rpx 0 0 #EEEEEE;
		.btn{
			display: flex;
			align-items: center;
			justify-content: center;
			width: 172rpx;
			height: 60rpx;
			background: var(--theme);
			border-radius: 8rpx;
			color: #FFFFFF;
			font-size: 30rpx;
		}
	}
</style>

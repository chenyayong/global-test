<template>
	<view>
		<view class="list-box">
			<view class="item" v-for="(item,index) in list" :key="index">
				<image :src="$image+item.goods.original_img"></image>
				<view class="right">
					<view class="tlt">{{item.goods.goods_name}}</view>
					<view class="num">数量: {{item.goods_num}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[]
			}
		},
		methods:{
			getList(id){
				this.$http('get|api/Order/free_goods',{
					order_id:id
				}).then(res=>{
					console.log(res);
					this.list = res.result.free_goods
					// console.log(res);
				})
			}
		},
		onLoad(opt){
			console.log(opt);
			this.getList(opt.id)
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #F7F7F7;
	}
	.list-box{
		background-color: #FFFFFF;
		padding: 0 30rpx;
	}
	.item:nth-child(1){
		border-top: none;
	}
	.item{
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx 0;
		border-top: 1rpx solid #E5E5E5;
		image{
			width: 180rpx;
			height: 180rpx;
		}
		.right{
			height: 180rpx;
			display: flex;
			flex-flow: column;
			justify-content: space-between;
			.tlt{
				width: 490rpx;
				color: #454545;
				font-size: 28rpx;
				line-height: 40rpx;
				overflow: hidden; //超出的文本隐藏
				text-overflow: ellipsis; //溢出用省略号显示
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}
			.num{
				color: #333333;
				font-size: 28rpx;
				line-height: 40rpx;
			}
		}
	}
</style>

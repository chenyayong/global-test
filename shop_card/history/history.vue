<template>
	<view>
		<view v-for="(item,index) in history" :key="index" class="item">
			<view class="title">
				<image :src="item.head_pic" mode="" />
				<view>
					<view class="font-28">{{item.nickname}}</view>
					<view class="font-24">{{item.time}}</view>
				</view>
			</view>
			<view class="font-28">
				{{item.desc}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				history:[]
			}
		},
		onLoad({id}){
			this.$http('get|api/Order/return_goods_history',{
				id
			}).then(res=>{
				console.log(res);
				this.history=res.result.history.map(row=>{
					if(/http/.test(row.head_pic)){
						return row
					}else{
						return{
							...row,
							head_pic:this.$image+row.head_pic
						}
					}
				})
			})
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #f7f7f7;
		padding-top: 20rpx;
		box-sizing: border-box;
	}
	.item{
		padding: 30rpx;
		box-sizing: border-box;
		background-color: #ffffff;
		margin-bottom: 20rpx;
		image{
			height: 80rpx;
			width: 80rpx;
			border-radius: 50%;
		}
		.title{
			display: flex;
			align-items: center;
			>view{
				padding-left: 20rpx;
			}
			.font-24{
				color: #B3B3B3;
			}
		}
		>.font-28{
			margin-top: 20rpx;
			color: #F41613;
		}
	}
</style>

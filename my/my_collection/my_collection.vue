<template>
	<view v-if="list.length>0">
		<view v-for="(item,index) in list" :key="index" class="collection-item" @tap="to_detail(item)">
			<image :src="$image+item.original_img" mode="" class="good-img" />
			<view class="right">
				<view class="font-32 ellipsis-two">
					{{item.goods_name}}
				</view>
				<view class="flex">
					<view class="font-24">￥{{item.shop_price}}</view>
					<image src="/static/delete.png" @tap.stop="delete_good(item,index)" mode="" class="delete"/>
				</view>
			</view>
		</view>
		<!-- <no-more v-model="have" @more="more"></no-more> -->
		<view v-if="!have" class="no-more">我是有底线的</view>
	</view>
	<no-data v-else></no-data>
</template>

<script>
	export default {
		data() {
			return {
				list:[],
				page:1,
				have:true,
			}
		},
		mounted(){
			this.get_list();
		},
		methods: {
			get_list(){
				this.$http("get|api/User/collect_list",{
					p:this.page
				}).then(res=>{
					if(res.result.length==0){
						this.have=false
						return
					}
					this.list=[...this.list,...res.result];
				})
			},
			delete_good(item,index){
				this.$http('get|api/User/cancel_collect',{
					goods_id:item.goods_id
				}).then(res=>{
					this.list.splice(index,1);
				})
			},
			to_detail(item){
				uni.navigateTo({
					url: `/index/good_detail/good_detail?id=${item.goods_id}`
				});
			},
			more(){
				this.page+=1;
				this.get_list();
			}
		},
		onReachBottom() {
			uni.showLoading({
				title: '加载中...'
			})
			this.more()
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #F7F7F7;
	}
	.collection-item{
		height: 220rpx;
		width: 100%;
		box-shadow:0 1rpx 0 0  #E3E3E3;
		background-color: #ffffff;
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		display: flex;
		margin-top: 20rpx;
		.good-img{
			height: 180rpx;
			width: 180rpx;
		}
		.right{
			flex: 1;
			padding-left: 30rpx;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			.flex{
				display: flex;
				justify-content: space-between;
				align-items: center;
				.font-24{
					color: #FF4242;
				}
			}
		}
		.delete{
			height: 34rpx;
			width: 34rpx;
		}
	}
	.no-more {
		color: #999999;
		height: 80rpx;
		text-align: center;
		line-height: 80rpx;
		font-size: 26rpx;
		background-color: #F7F7F7;
	}
</style>

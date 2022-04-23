<template>
	<view v-if="list.length>0">
		<view class="box">
			<view class="list-item" v-for="(item,index) in list" :key="index">
				<view class="flex">
					<view class="font-30">提现</view>
					<view class="font-36" :style="{color:item.status>0?'#989898':'#FF4C57'}">{{item.money}}</view>
				</view>
				<view class="flex font-26">
					<view>{{item.create_time}}</view>
					<view>{{item.status_deac}}</view>
				</view>
			</view>
		</view>
		<!-- <no-more v-model="have" v-if="list.length>0" @more="more"></no-more> -->
		<view v-if="list.length>0">
			<view v-if="!have" class="no-more">我是有底线的</view>
		</view>
	</view>
	<view v-else>
		<no-data></no-data>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[],
				have:true,
				page:1
			}
		},
		mounted(){
			this.get_list();
		},
		methods: {
			get_list(){
				this.$http('post|api/User/withdrawals_list',{
					p:this.page
				}).then(res=>{
					if(res.result.length===0){
						this.have=false;
						return
					}else{
						this.list=[...this.list,...res.result]
					}
				})
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
	page{background: #F7F7F7;}
	.box{
		padding: 0 30rpx;
		box-sizing: border-box;
		background-color: #ffffff;
		.list-item{
			box-shadow: 0 0 2rpx 0 #EBEBEB;
			padding: 30rpx 0;
			.flex{
				display: flex;
				justify-content: space-between;
				align-items: center;
			}
			.font-26{
				color: #999999;
			}
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

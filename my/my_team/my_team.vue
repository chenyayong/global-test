<template>
	<view class="page">
		<view class="header">
			<view>
				<view class="font-26 op">
					直推客户数(个)
				</view>
				<view class="font-56">
					{{directly_num}}
					<!-- {{group_num}} -->
				</view>
			</view>
			<!-- <view class="flex">
				<view>
					<view class="font-40">{{directly_num}}</view>
					<view class="font-26 op">直推人数(人)</view>
				</view>
				<view>
					<view class="font-40">{{indirect_num}}</view>
					<view class="font-26 op">间推人数(人)</view>
				</view>
			</view> -->
		</view>
		<view class="title font-32">
			· 团队明细 ·
		</view>
		<template v-if="list.length>0">
			<view class="list-box">
				<view class="list-item" v-for="(item,index) in list" :key="index" @tap="to_detail(item)">
					<image :src="item.head_pic" mode="" />
					<view>
						<view class="flex">
							<view class="font-28">{{item.nickname}}{{item.mobile?`(${item.mobile})`:``}}</view>
							<view class="font-32" v-if="item.group_num>0">{{item.group_num}}个</view>
						</view>
						<view class="font-26 flex">
							<view>{{item.level_name}}</view>
							<!-- <view>团队明细 ></view> -->
						</view>
					</view>
				</view>
			</view>
			<!-- <no-more v-model="have" @more="more"></no-more> -->
			<view v-if="!have" class="no-more">我是有底线的</view>
		</template>
		<no-data v-else></no-data>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[],
				group_num:0,
				directly_num:0,
				indirect_num:0,
				page:1,
				have:true
			}
		},
		mounted(){
			this.get_list();
		},
		methods: {
			get_list(){
				this.$http('get|api/User/group',{
					p:this.page
				}).then(res=>{
					if(res.result.group.length==0){
						this.have=false;
						return
					}
					this.group_num=res.result.group_num
					this.directly_num=res.result.directly_num
					this.indirect_num=res.result.indirect_num
					this.list=[...this.list,...res.result.group];
				})
			},
			more(){
				this.page+=1;
				this.get_list();
			},
			to_detail(item){
				return
				uni.navigateTo({
					url: `/my/my_team/team_detail/team_detail?id=${item.user_id}&title=${item.nickname}`
				});
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
	.page{
		min-height: 100vh;
		// #ifdef H5
		min-height: calc( 100vh - 88rpx);
		// #endif
		background-color: #F5F5F5;
		padding-top: 20rpx;
		box-sizing: border-box;
		.header{
			width:710rpx;
			height:360rpx;
			/* #ifdef APP-PLUS */
			background:linear-gradient(225deg,rgba(116,155,255,1) 0%,rgba(65,100,244,1) 100%);
			/* #endif */
			/* #ifdef H5 */
			background: linear-gradient(225deg, #02D86D 0%, #00B159 100%);
			/* #endif */
			border-radius:10rpx;
			margin: 0 auto;
			// padding-top: 50rpx;
			box-sizing: border-box;
			color: #ffffff;
			text-align: center;
			display: flex;
			justify-content: center;
			align-items: center;
			.flex{
				display: flex;
				margin-top: 70rpx;
				position: relative;
				>view{
					flex: 1;
				}
			}
			.flex::after{
				position: absolute;
				content: '';
				width:2rpx;
				height:72rpx;
				background:rgba(255,255,255,0.5);
				top: 50%;
				margin-top: -36rpx;
				left: 50%;
			}
			.op{
				opacity: 0.8;
			}
		}
		.title{
			line-height: 90rpx;
			text-align: center;
			background-color: #ffffff;
			margin-top: 20rpx;
			box-shadow:0px -1px 0px 0px rgba(223,227,230,1);
		}
		.list-box{
			padding: 0 30rpx;
			box-sizing: border-box;
			background-color: #ffffff;
			margin-top: 1rpx;
			.list-item{
				display: flex;
				height: 144rpx;
				justify-content: space-between;
				align-items: center;
				border-bottom: 1rpx solid #F5F6F7;
				image{
					height: 84rpx;
					width: 84rpx;
				}
				>view{
					flex: 1;
					padding-left: 20rpx;
					box-sizing: border-box;
				}
				.flex{
					display: flex;
					justify-content: space-between;
					align-items: center;
				}
				.font-26{
					color: #969696;
				}
				.font-32{
					color: #E82B22;
				}
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

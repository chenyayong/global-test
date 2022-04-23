<template>
	<view v-if="list.length>0">
		<view class="list-box">
			<view class="list-item" v-for="(item,index) in list" :key="index" @tap="to_detail(item)">
				<image src="/static/user.png" mode="" />
				<view>
					<view class="flex">
						<view class="font-28">{{item.nickname}}{{item.mobile?`(${item.mobile})`:``}}</view>
						<view class="font-32" v-if="item.group_num>0">{{item.group_num}}人</view>
					</view>
					<view class="font-26 flex">
						<view>{{item.level_name}}</view>
						<view>团队明细 ></view>
					</view>
				</view>
			</view>
		</view>
		<no-more v-model="have" @more="more"></no-more>
	</view>
	<no-data v-else></no-data>
</template>

<script>
	export default {
		data() {
			return {
				title:'',
				list:[],
				page:1,
				have:true,
				id:'',
			}
		},
		onLoad({title,id}){
			uni.setNavigationBarTitle({
				title
			});
			this.title=title;
			this.id=id;
			this.get_list();
		},
		methods: {
			to_detail(item){
				uni.navigateTo({
					url: `/my/my_team/team_detail/detail_detail?id=${item.user_id}&title=${item.nickname}`
				});
			},
			get_list(){
				this.$http('get|api/User/group_list',{
					p:this.page,
					user_id:this.id
				}).then(res=>{
					if(res.result.group.length==0){
						this.have=false;
						return
					}
					this.list=[...this.list,...res.result.group];
				})
			},
			more(){
				this.page+=1;
				this.get_list();
			},
		}
	}
</script>

<style lang="scss">
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
</style>

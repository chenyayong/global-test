<template>
	<view class="page">
		<template v-if="adress_list.length>0">
			<view class="list-item" v-for="(item,index) in adress_list" :key="index">
				<view class="box" @tap="choose_adress(item)">
					<view class="flex">
						<view class="font-32">{{item.consignee}}</view>
						<view class="font-32">{{item.mobile}}</view>
					</view>
					<view class="font-28 ellipsis">{{item.address1}}{{item.address}} </view>
				</view>
				<view class="option">
					<view class="flex">
						<!-- <check-box v-model="item.active" color="#00BE5F" @click.native="to_default(item)"/> -->
						<!-- #ifdef APP-PLUS -->
						<image class="check-def" :src="item.active?'/static/is_check.png':'/static/sel_icon.png'" @click.native="to_default(item)"></image>
						<!-- #endif -->
						<!-- #ifdef H5 -->
						<image class="check-def" :src="item.active?'/static/h5_is_check.png':'/static/sel_icon.png'" @click.native="to_default(item)"></image>
						<!-- #endif -->
						<view @tap="to_default(item)" :class="[item.active?'active':'','font-28 inline']">
							设为默认地址
						</view>
					</view>
					<view class="flex option-buttom">
						<view class="font-28" @tap="edit_address(item)">编辑</view>
						<view class="font-28" @tap="del_address(item,index)">删除</view>
					</view>
				</view>
			</view>
		</template>
		<no-data v-else></no-data>
		<view class="fixed-buttom font-30" @tap="add_adress">
			+添加新地址
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				adress_list:[],
				choose:false,
			}
		},
		onLoad(val){
			if(val.choose){
				this.choose=true
			}
		},
		onShow(){
			this.get_address();
		},
		methods: {
			choose_adress(item){
				if(this.choose){
					uni.navigateBack();
					setTimeout(()=>{
						this.$store.dispatch('set_address',item.address_id);
					},500)
				}
			},
			edit_address(item){
				console.log(item)
				uni.navigateTo({
					 url: `/my/add_adress/add_adress?edit=2&id=${item.address_id}`
				});
			},
			del_address(item,index){
				this.$http("get|api/User/del_address",{id:item.address_id}).then(res=>{
					this.$toastApp(res.msg);
					this.get_address();
				}).catch(e=>{
					this.$toastApp(e.msg)
				})
			},
			get_address(){
				this.$http('get|api/User/address_list').then(res=>{
					this.adress_list=res.result.address_lists.map(row=>{
						if(row.is_default===1){
							row.active=true
						}else{
							row.active=false
						}
						return row
					})
				})
			},
			to_default(item){
				this.$http('get|api/User/set_default',{
					id:item.address_id
				}).then(res=>{
					this.adress_list.forEach(el=>{
						el.active=false
					})
					item.active=true;
				})
			},
			add_adress(){
				uni.navigateTo({
					 url: "/my/add_adress/add_adress"
				});
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #f7f7f7;
	}
	.page{
		padding-top: 20rpx;
		box-sizing: border-box;
	}
	.page::after{
		height: 90rpx;
		content: '';
		display: flex;
		width: 100%;
	}
	.box{
		padding: 20rpx 0;
		box-sizing: border-box;
		box-shadow:0px -1rpx 0px 0px rgba(223,227,230,1);
		>.font-28{
			margin-top: 20rpx;
			color: #999999;
		}
	}
	.list-item{
		margin-bottom: 20rpx;
		padding: 0 30rpx;
		background-color: #ffffff;
		.flex{
			display: flex;
			justify-content: space-between;
			align-items: center;
			.check-def{
				width: 32rpx;
				height: 32rpx;
			}
			.inline{
				margin-left: 20rpx;
			}
		}
		.option{
			margin-top: 2rpx;
			height: 100rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.active{
				color: var(--theme);
			}
			.option-buttom{
				width: 150rpx;
				color: #999999;
			}
		}
	}
	.fixed-buttom{
		height: 90rpx;
		line-height: 90rpx;
		text-align: center;
		color: #ffffff;
		background-color: var(--theme);
		position: fixed;
		bottom: 0;
		width: 100%;
	}
</style>

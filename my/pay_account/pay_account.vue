<template>
	<view class="page">
		<template v-if="list.length>0">
			<view class="list-item" v-for="(item,index) in list" :key="index">
				<view class="card-image font-28" v-if="item.bank_type===1">
					<image src="/static/bank_card.png" mode="" />
					银行卡
				</view>
				<view class="card-image font-28" v-else>
					<image src="/static/zhifubao.png" mode="" />
					支付宝
				</view>
				<view class="font-30">
					{{item.realname}}
				</view>
				<view class="flex font-32">
					<view v-if="item.bank_type===1">{{item.bankname}}({{item.bank_card}})</view>
					<view v-else>{{item.bank_card}}</view>
					<image src="/static/delete.png" mode="" @tap="detete_card(item,index)"/>
				</view>
			</view>
		</template>
		<no-data v-else></no-data>
		<view class="fixed-bottom font-30" @tap="add_account">
			添加新收款账户
		</view>
		<choose-account v-model="show"></choose-account>
	</view>
</template>

<script>
import chooseAccount from '../components/choose_account.vue'
	export default {
		data() {
			return {
				list:[],
				show:false,
				bank_type:''
			}
		},
		onLoad(option){
			this.bank_type=option.bank_type
		},
		onShow(){
			this.get_list();
		},
		methods: {
			get_list(){
				this.$http('get|api/User/bankcard_list',{
					bank_type:this.bank_type
				}).then(res=>{
					this.list=res.result.bankcard_list
				})
			},
			add_account(){
				this.show=true;
			},
			detete_card(item,index){
				uni.showModal({
					title: '提示',
					content: '确定要删除此账户吗？',
					success:  res=> {
						if (res.confirm) {
							this.$http('get|api/User/del_bankcard',{
								id:item.bank_id
							}).then(res=>{
								this.$toastApp(res.msg)
								setTimeout(()=>{
									this.list.splice(index,1)
								},2000)
							})
						} else if (res.cancel) {
							this.$toastApp('取消删除')
						}
					}
				});
				
			}
		},
		components:{
			chooseAccount
		}
	}
</script>

<style lang="scss">
	page{
		padding-top: 30rpx;
		box-sizing: border-box;
	}
	.list-item{
		width:690rpx;
		height:240rpx;
		background:rgba(255,255,255,1);
		box-shadow:0px 4rpx 18rpx 0px rgba(0,0,0,0.1);
		border-radius:6rpx;
		margin: 0 auto;
		margin-bottom: 30rpx;
		padding: 30rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		.card-image{
			display: flex;
			align-items: center;
			image{
				height: 40rpx;
				width: 40rpx;
				margin-right: 20rpx;
			}
		}
		.flex{
			display: flex;
			justify-content: space-between;
			align-items: center;
			image{
				height: 32rpx;
				width: 32rpx;
			}
		}
	}
	.fixed-bottom{
		width: 100%;
		position: fixed;
		bottom: 0;
		height:90rpx;
		line-height: 90rpx;
		background:var(--theme);
		text-align: center;
		color: #ffffff;
	}
	.page::after{
		content: '';
		height: 90rpx;
		display: block;
	}
</style>

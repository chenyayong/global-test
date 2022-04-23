<template>
	<view>
		<view class="from">
			<view class="font-30">到账账号</view>
			<view class="account-input-box">
				<input class="account-input" v-model="mobile" type="number" placeholder="请输入到账账号" @blur="get_account">
			</view>
			<view class="font-24" v-if="account">
				{{account}}
			</view>
			<view class="font-30" style="margin-top:50rpx">转账数量</view>
			<view class="account-input-box">
				<view class="font-48">￥</view>
				<input class="account-input inline" v-model="from.number" type="number" placeholder="请输入转账金额">
			</view>
			<view class="font-26 flex">
				<view>可转账余额{{user_money}}</view>
				<view class="all-with" @tap="all_num">全部转账</view>
			</view>
			<view class="buttom font-32" @tap="submit">
				转账
			</view>
		</view>
		<pay-password ref="pay" v-model="pay_dialog" :show="false" @check_word="save"></pay-password>
		<no-password v-model="no_password" @check="set_password" />
	</view>
</template>

<script>
import payPassword from 'index/components/pay_password.vue';
import noPassword from '../../index/components/no_password.vue'
	export default {
		data() {
			return {
				account:'',
				mobile:'',
				user_money:'0.00',
				// 13265646205
				from:{
					user_id:'',
					number:'',
					pay_password:''
				},
				pay_dialog:false,
				no_password:false,
			}
		},
		async onShow(){
			await this.$http('get|api/User/is_paypwd').then(res=>{
				this.no_password=true;//没有密码
			}).catch(e=>{
				this.$http('get|api/User/transfer_account').then(res=>{
					this.user_money=res.result;
				})
			})

		},
		methods: {
			submit(){
				if(this.from.user_id===''){
					this.$toastApp('请先输入正确的账号');
					return
				}
				if(!/^(-?\d+)(\.\d+)?$/.test(this.from.number)){
					this.$toastApp('金额格式不正确');
					return
				}
				if(!+this.from.number>=0.01){
					this.$toastApp('转账数量最少为0.1');
					return
				}
				this.pay_dialog=true;
			},
			save(e){
				// #ifndef H5
				uni.showLoading()
				// #endif
				this.from.pay_password=e;
				this.$http('post|api/User/transfer_info',this.from).then(res=>{
					this.$toastApp(res.msg);
					setTimeout(()=>{
						uni.navigateBack();
					},2000)
				}).catch(e=>{
					this.$toastApp(e.msg);
					this.$refs.pay.passworld=[]
				})
			},
			get_account(){
				this.$http("post|api/User/transfer_account",{
					mobile:this.mobile
				}).then(res=>{
					this.account='到账人：'+res.result.nickname;
					this.from.user_id=res.result.user_id
				}).catch(e=>{
					this.account=e.msg
				})
			},
			all_num(){
				this.from.number=this.user_money
			},
			set_password(){
				//todo设置密码
				this.no_password=false;
				setTimeout(()=>{
					uni.navigateTo({
						url: '/my/mdf_password/mdf_password'
					});
				},500)
			},
		},
		components:{
			payPassword,
			noPassword
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #F5F5F5;
		padding-top: 20rpx; 
	}
	.all-with{
		color: var(--theme);
	}
	.from{
		padding: 70rpx;
		box-sizing: border-box;
		background-color: #ffffff;
		.account-input-box{
			border-bottom: 1rpx solid #F0F0F0;
			display: flex;
			align-items: center;
		}
		.account-input{
			line-height: 100rpx;
			height: 100rpx;
		}
		.flex{
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 20rpx;
			color: #BEBEBE;
		}
		.buttom{
			margin: 0 auto;
			margin-top: 100rpx;
			width:620rpx;
			height:90rpx;
			background:var(--theme);
			border-radius:45rpx;
			text-align: center;
			line-height: 90rpx;
			color: #ffffff;
		}
		.font-24{
			color: #999999;
		}
	}
</style>

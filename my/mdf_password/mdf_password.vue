<template>
	<view>
		<view class="from">
			<view class="from-item">
				<view class="label font-28">手机号</view>
				<!-- <input class="font-28" v-model="mobile" type="text" placeholder="请输入手机号" placeholder-class="placeholder" /> -->
				<view class="font-28">{{mobile}}</view>
			</view>
			<picker :range="list" range-key="area_name" @change="picker_change">
                <view class="from-item">
                    <view class="font-30 label">
                        归属地
                    </view>
                    <view class="font-30" :style="{
                            textAlign:'left',
                            flex:1,
                            color:area_name?'#333333':'grey'
                            }">
                        {{area_name?area_name:'号码归属地'}}
                    </view>
                </view>
            </picker>
			<view class="from-item">
				<view class="label font-28">验证码</view>
				<input class="font-28" v-model="from.mobile_code" type="number"  placeholder="验证码" placeholder-class="placeholder" maxlength="4" />
				<vercode v-model="from.mobile" :timeout="timeout" :area="area"></vercode>
			</view>
			<view class="from-item">
				<view class="label font-28">支付密码</view>
				<input class="font-28 no-bor" v-model="from.password" :type="isPsw?'text':'password'" placeholder="6位纯数字" placeholder-class="placeholder" maxlength="6" />
				<image class="item-img" :src="isPsw?pswYes:pswNo" @tap="isPsw = !isPsw"></image>
			</view>
			<view class="from-item">
				<view class="label font-28">确认密码</view>
				<input class="font-28 no-bor" v-model="from.password2" :type="isPsw2?'text':'password'"  placeholder="请确认支付密码" placeholder-class="placeholder" maxlength="6" />
				<image class="item-img" :src="isPsw2?pswYes:pswNo" @tap="isPsw2 = !isPsw2"></image>
			</view>
		</view>
		<view class="buttom font-32" @tap="save">确定</view>
	</view>
</template>

<script>
import vercode from "../../components/get_verification.vue"
	export default {
		data() {
			return {
				from:{
					mobile:'',
					mobile_code:'',
					password:'',
					password2:'',
				},
				mobile:'',
				area:'',
				area_name:'',
				list:[],
				timeout:0,
				isPsw:false,
				isPsw2:false,
				pswNo:'/static/psw_no.png',
				pswYes:'/static/psw_yes.png'
			}
		},
		mounted(){
			this.$http('get|api/User/set_pwd').then(res=>{
				this.from.mobile=res.result.mobile;
				this.mobile=res.result.mobile1
			})
			this.$http('get|api/Api/send_validate_code').then(res=>{
				this.list=res.result.country_area;
				this.timeout=+res.result.sms_time_out
			})
		},
		methods: {
			save(){
				if(this.from.password.length!==6){
					this.$toastApp('密码长度为6位');
					return
				}
				if(!/^[0-9]*$/.test(this.from.password)){
					this.$toastApp('密码只能为数字');
					return
				}
				if(this.from.password!==this.from.password2){
					this.$toastApp('两次密码不一致');
					return
				}
				// #ifndef H5
				uni.showLoading()
				// #endif
				this.$http('post|api/User/set_pwd',this.from).then(res=>{
					this.$toastApp(res.msg);
					setTimeout(() => {
						uni.navigateBack();
					}, 500);
				}).catch(err=>{
					this.$toastApp(err.msg);
				})
			},
			picker_change(e){
				let index=e.detail.value;
				this.area=this.list[index].area
				this.area_name=this.list[index].area_name
			}
		},
		components:{
			vercode
		}
	}
</script>

<style lang="scss">
	.from{
		padding: 60rpx;
		box-sizing: border-box;
		.from-item{
			display: flex;
			border-bottom: 1rpx solid #F2F3F6;
			height: 100rpx;
			align-items: center;
			position: relative;
			.label{
				width: 140rpx;
			}
			.placeholder{
				color:#D7D7D9 ;
			}
			
			.item-img{
				position: absolute;
				right: 20rpx;
				width: 36rpx;
				height: 36rpx;
			}
			
			.no-bor{
				border: none;
				outline:none;
			}
		}
	}
	.buttom{
		width:630rpx;
		height:90rpx;
		background:var(--theme);
		border-radius:45rpx;
		text-align: center;
		line-height: 90rpx;
		margin: 0 auto;
		margin-top: 20rpx;
		color: #ffffff;
	}
</style>

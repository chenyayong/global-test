<template>
	<view :class="['verification-code',can_check_verification?'':'verification-code-disable','font-24']" @tap="get_verification_code">
		{{verification_code}}
	</view>
</template>

<script>
	var timeer=null;
	var $phone=/^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
	export default {
		props:{
			value:{},
			timeout:{
				type:Number,
				default:60
			},
			area:{}
		},
		data() {
			return {
				can_check_verification:true,//是否可获取验证码
				verification_code_time:0,//倒计时
			};
		},
		methods:{
			get_verification_code(){
				if(this.can_check_verification){
					// #ifndef H5
					if(!this.$check_mobel(this.value)){
						return this.$toastApp('手机格式不正确');
					}
					// #endif
					// #ifdef H5
					if(!$check_mobel(this.value)){
						return this.$toastApp('手机格式不正确');
					}
					// #endif
					if(!this.area){
						return this.$toastApp('请选择归属地');
					}
					this.$http('post|api/Api/send_validate_code',{
						mobile:this.value,
						area:this.area,
					}).then(res=>{
						this.$toastApp(res.msg);
						this.can_check_verification=false;
						this.verification_code_time=this.timeout;
						setTimeout(()=>{
							this.verification_code_time=this.timeout-1;
							this.verification_timeout();
						},1000)
					}).catch(err=>{
						this.$toastApp(err.msg);
					})
				}else{
					return
				}
			},
			verification_timeout(){
				if(this.verification_code_time<=0){
					this.can_check_verification=true;
					return ;
				}
				timeer=setTimeout(()=>{
					this.verification_code_time-=1;
					this.verification_timeout();
				},1000)
			},
		},
		computed:{
			verification_code(){
				if(this.verification_code_time===0){
					return '获取验证码'
				}else{
					return `${this.verification_code_time}S后可重发`
				}
			}
		},
		destroyed() {
			clearTimeout(timeer);
		}
	}
</script>

<style>
	.verification-code{
		width:200rpx;
		height:60rpx;
		border-radius:12rpx;
		/* border:2upx solid; */
		/* background-color: #4E6EF3; */
		font-size: 28rpx;
		color: var(--theme);
		text-align: center;
		line-height: 60rpx;
		overflow: hidden;
	}
	.verification-code-disable{
		color: #B7B7B7;
		background-color: #ffffff ;
	}
</style>

<template>
	<view class="page-background">
		<view class="feeback-type">
			<view class="title font-30">问题类型</view>
			<view class="type-box">
				<view 
					v-for="(item,index) in type" 
					@tap="to_active(item)"
					:key="index" 
					:class="['type-item font-28',item.active?'active':'']">
					{{item.label}}
				</view>
			</view>
		</view>
		<view class="idea-input">
			<view class="font-30">
				问题描述
			</view>
			<textarea type="text" v-model="content" :maxlength="500" placeholder="输入您宝贵的意见"/>
			<view class="font-26 color-999 other">
				每一条反馈我们都会认真对待
			</view>
		</view>
		<view class="register-check font-30" @tap="submit">
			提交
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				content:'',
				few:false,
				type:[]
			}
		},
		mounted(){
			this.$http('get|api/User/user_consult').then(res=>{
				this.type=res.result.consult_type.map((row,index)=>{
					return{
						label:row,
						active:false,
						value:index
					}
				})
				this.type[0].active=true
			})
		},
		methods: {
			submit(){
				let content=this.content.trim();
				if(!content){
					this.$toastApp('意见不能为空');
					return
				}
				this.$http('post|api/User/user_consult',{
					content:content,
					consult_type:this.type.find(row=>row.active).value
				}).then(res=>{
					this.$toastApp(res.msg);
					setTimeout(()=>{
						uni.navigateBack()
					},500);
				}).catch(err=>{
					this.$toastApp(err.msg)
				})
			},
			to_active(item){
				this.type.forEach(el=>{
					el.active=false
				})
				item.active=true;
			}
		}
	}
</script>

<style lang="scss">
.register-check{
	width:658rpx;
	height:90rpx;
	background:var(--theme);
	border-radius:45rpx;
	line-height: 90rpx;
	text-align: center;
	margin: 0 auto;
	margin-top: 110rpx;
	color: #FFFFFF;
}
.color-999{
	color: #999999;
}
.idea-input{
	padding: 30rpx;
	box-sizing: border-box;
	background-color: #FFFFFF;
}
.idea-input textarea{
	height: 320rpx;
	background-color: #F3F3F3;
	margin-top: 20rpx;
	font-size: 26rpx;
	line-height: 30rpx;
	box-sizing: border-box;
	width: 100%;
	padding: 20rpx;
}
.other{
	line-height: 40rpx;
	margin-top: 10rpx;
}
.register-check{
	margin-left: auto;
	margin-right: auto;
}
.feeback-type{
	padding: 36rpx 0 0 46rpx;
	box-sizing: border-box;
	.type-box::after{
		clear: both;
		content: '';
		display: block;
	}
	.type-item{
		float: left;
		width:176rpx;
		height:68rpx;
		border-radius:12rpx;
		border:1px solid #D4D4D4;
		text-align: center;
		line-height: 68rpx;
		margin-top: 30rpx;
		color: #A4A4A4;
		margin-right: 50rpx;
	}
	.active{
		color: var(--theme);
		border-color: var(--theme);
	}
}

</style>

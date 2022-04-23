<template>
	<view>
		<!-- <view class="header">
			<image src="/static/invite_buttom.png" mode="" @tap="now_invite"/>
		</view> -->
		<view class="new_bg">
			<image class="bg" src="/static/bg_new_invite.jpg" mode=""></image>
			<image class="btn" src="/static/invite_buttom.png" mode="" @tap="now_invite"/>
		</view>
		<!-- <view class="invite-body"> 
			<view class="invite-tip">
				<view>
					<view class="font-40 bold">
						{{directly_num}} 
						<view class="inline font-28">人</view>
					</view>
					<view class="font-24">累计邀请好友</view>
				</view>
				<view class="solid">
					<view class="font-40 bold ">{{commission}} 
						<view class="inline font-28">元</view></view>
					<view class="font-24">累计获得佣金</view>
				</view>
				<view>
					<view class="font-40 bold">{{pay_points}}</view>
					<view class="font-24">累计获得积分</view>
				</view>
			</view>
			<view class="invite-rule">
				<view class="font-28 bold">
					{{node_title}}
				</view>
				<view class="rule">
					<rich-text :nodes="node"></rich-text>
				</view>
			</view>
		</view> -->
		<invite-img v-model="invite_dialog"></invite-img>
	</view>
</template>

<script>
import inviteImg from './invite_img';
	export default {
		data() {
			return {
				node_title:'',
				node:'',
				invite_dialog:false,
				directly_num:0,
				commission:0,
				pay_points:0,
			}
		},
		onLoad(){
			this.$http('get|api/User/invite_poster').then(res=>{
				this.directly_num=res.result.directly_num;
				this.commission=res.result.commission;
				this.pay_points=res.result.pay_points;
				this.node_title=res.result.regulation.topic_title
				this.node=res.result.regulation.topic_content
			})
		},
		methods: {
			now_invite(){
				this.invite_dialog=true;
			}
		},
		components:{
			inviteImg
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #292585;
	}
	.new_bg{
		position: relative;
		width: 100vw;
		height: 100vh;
		.bg{
			width: 100vw;
			height: 1334rpx;
		}
		.btn{
			height: 108rpx;
			width: 480rpx;
			position: absolute;
			top: 48%;
			left: 50%;
			transform: translateX(-50%);
		}
	}
	// .header{
	// 	height: 100vh;
	// 	width: 100vw;
	// 	background-color: #000000;
	// 	background-image: url(../../static/invite_big.jpg);
	// 	background-size: cover;
	// 	position: relative;
	// 	image{
	// 		height: 108rpx;
	// 		width: 480rpx;
	// 		position: absolute;
	// 		bottom: 50%;
	// 		left: 50%;
	// 		margin-left: -240rpx;
	// 	}
	// }
	// .invite-body{
	// 	min-height: calc(100vh - 602rpx);
	// 	/* #ifdef H5 */
	// 	min-height: calc(100vh - 602rpx - 88rpx);
	// 	/* #endif */
	// 	background-color: #000000;
	// 	padding: 0 30rpx 20rpx 30rpx;
	// 	box-sizing: border-box;
	// 	padding-top: 46rpx;
	// 	.invite-tip{
	// 		width: 100%;
	// 		background-color: #ffffff;
	// 		display: flex;
	// 		height: 164rpx;
	// 		border-radius:10rpx;
	// 		padding: 30rpx 0;
	// 		box-sizing: border-box;
	// 		>view{
	// 			flex: 1;
	// 			text-align: center;
	// 			.font-40{
	// 				line-height: 56rpx;
	// 				color: #F41613;
	// 			}
	// 			.font-24{
	// 				color: #4D4D4D;
	// 			}
	// 		}
	// 		.solid{
	// 			position: relative;
	// 		}
	// 		.solid::before{
	// 			content: '';
	// 			left: 0;
	// 			top: 0;
	// 			height: 100%;
	// 			width: 2rpx;
	// 			transform: scaleX(0.5);
	// 			background-color: #ECECEC;
	// 			position: absolute;
	// 		}
	// 		.solid::after{
	// 			content: '';
	// 			right: 0;
	// 			top: 0;
	// 			height: 100%;
	// 			width: 2rpx;
	// 			transform: scaleX(0.5);
	// 			background-color: #ECECEC;
	// 			position: absolute;
	// 		}
	// 	}
	// 	.invite-rule{
	// 		padding: 40rpx 30rpx;
	// 		background-color: #ffffff;
	// 		margin-top: 20rpx;
	// 		border-radius:10rpx;
	// 		.rule{
	// 			margin-top: 16rpx;
	// 			width: 100%;
	// 			/deep/ img{
	// 				width: 100%;
	// 			}
	// 		}
	// 	}
	// }
</style>

<!-- <template>
	<div class="code">
		<div class="code-title">欢迎加入获取及公司最新资讯</div>
		<div class="code-img">
			<image src="../../static/bg_new_invite.jpg" mode=""></image>
		</div>
		<div class="code-tips-container">
			<div class="code-error">注意</div>
			<div class="code-tips">本微信群是专为尚未加入任何运营中心的会员提供最新的公司资讯服务。</div>
			<div class="code-tips">如您已加入自己运营中心沟通群的会员即无需加入!</div>
			<div class="code-tips">感谢您的配合和支持!</div>
		</div>
	</div>
</template>

<script>
</script>

<style lang="scss">
	.code{
		padding: 0 60rpx;
		font-size: 20rpx;
		color: #888;
		image {
			display: block;
			width: 100%;
		}
		.code-title{
			padding: 60rpx 0;
			font-size: 36rpx;
		}
		.code-tips-container{
			padding-top: 60rpx;
			.code-error{
				background-color: #e64340;
				font-size: 36rpx;
				border-radius: 4px;
				display: inline-block;
				padding: 10rpx 40rpx;
				color: #FFFFFF;
				margin-bottom: 20rpx;
			}
			.code-tips{
				margin-bottom: 10rpx;
			}
		}
	}

</style>
 -->
 <template>
 	<view>
 		<view class="content font-30">
     		<rich-text :nodes="node"></rich-text>
 		</view>
 	</view>
 </template>
 
 <script>
 	export default {
 		data() {
 			return {
 				node:''
 			}
 		},
 		onLoad({title,id}){
 			// uni.setNavigationBarTitle({
 			// 	title
 			// });
 			// this.title=title
 			this.$http("get|api/user/groupCode",{
 				// id:id
 			}).then(res=>{
 				this.node=res.result.topic_content;
 				this.title=res.result.topic_title;
 				// uni.setNavigationBarTitle({
 				// 	title:this.title
 				// });
 			})
 		},
 		methods: {
 			
 		}
 	}
 </script>
 
 <style lang='scss'>
 	.content{
 		padding: 0 30rpx;
 		box-sizing: border-box;
 		margin: 0 auto;
 		width: 690rpx;
 		color: #3C424D;
 		line-height: 60rpx;
 		/deep/img{
 			width: 100%;
 		}
 	}
 </style>
 
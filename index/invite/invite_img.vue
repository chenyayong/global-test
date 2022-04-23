<template>
	<view class="dialog" v-if="dialog" @tap="dialog=false">
		
		<view class="content"  @tap.stop="none">
			<image :src="src" class="invite" mode="widthFix" />
			<!-- #ifdef H5 -->
			<view class="bottom font-30">
				长按保存到相册
				<image :src="src" mode="" />
			</view>
			<!-- #endif -->
			<!-- #ifndef H5 -->
			<view class="bottom-box">
				<button class="save" @tap="saveImg">保存图片</button>
				<button class="share" @tap="isShare = true">发给朋友</button>
			</view>
			<!-- #endif -->
		</view>
		<!-- #ifndef H5 -->
		<!-- 分享弹窗 -->
		<view class="modal-bg" v-show="isShare" @click="isShare = false" @touchmove.stop.prevent>
		</view>
		<view class="modal-box" v-show="isShare" :class="[isShare?'gdIn':'gdOut']" @tap.stop="none" @touchmove.stop.prevent>
			<view class="modal-top">
				<view class="share-box" @click="wx_share">
					<image src="../../static/wx_logo.png" mode=""></image>
					<text class="">微信</text>
				</view>
				<view class="share-box" @click="pyq_share">
					<image src="../../static/pyq_logo.png" mode=""></image>
					<text class="">朋友圈</text>
				</view>
			</view>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	export default {
		props: {
			value: {},
		},
		data() {
			return {
				dialog: false,
				src: '',
				isShare: false
			}
		},
		methods: {
			async open() {
				// #ifdef H5
				await this.$http('get|api/User/getwxacode').then(res => {
					this.src = this.$image + res.result.wx_code
				})
				// #endif
				// #ifdef APP-PLUS
				await this.$http('get|api/User/getappcode').then(res => {
					this.src = this.$image + res.result.app_code
					console.log(this.src);
				})
				// #endif
			},
			none() {
				return false
			},
			saveImg() {
				uni.showLoading()
				uni.downloadFile({
				    url: this.src, //仅为示例，并非真实的资源
				    success: (res) => {
				    	console.log(res);
				    	uni.saveImageToPhotosAlbum({
				    		filePath: res.tempFilePath,
				    		success: (suc) => {
				    			uni.hideLoading()
				    			this.$toastApp('保存成功')
				    		},
				    		fail: (e) => {
				    			uni.hideLoading()
				    			console.log(e);
				    			this.$toastApp('保存失败')
				    		},
				    		complete: (com) => {
				    			console.log(com);
				    		}
				    	});
				    }
				});
			},
			wx_share() {
				uni.share({
					provider: "weixin",
					scene: "WXSceneSession",
					type: 2,
					imageUrl: this.src,
					success: (res) => {
						this.$toastApp('分享成功')
					},
					fail: (err) => {
						console.log("fail:" + JSON.stringify(err));
						this.$toastApp(JSON.stringify(err))
					}
				});
			},
			pyq_share() {
				uni.share({
					provider: "weixin",
					scene: "WXSenceTimeline",
					type: 2,
					imageUrl: this.src,
					success: (res) => {
						this.$toastApp('分享成功')
					},
					fail: (err) => {
						console.log("fail:" + JSON.stringify(err));
						this.$toastApp(JSON.stringify(err))
					}
				});
			}
		},
		watch: {
			async value(val) {
				if (val) {
					await this.open();
				}
				this.dialog = val;
			},
			dialog(val) {
				this.$emit('input', val);
			}
		}
	}
</script>

<style lang="scss">
	.content {
		width: 630rpx;
		position: fixed;
		top: 50%;
		margin-top: -490rpx;
		left: 50%;
		margin-left: -315rpx;
		transform: scale(0.8);
	}

	.invite {
		width: 630rpx;
		height: 900rpx;
		background-size: 80%;
	}

	.bottom {
		width: 100%;
		height: 90rpx;
		margin-top: 26rpx;
		background-color: #ffffff;
		color: var(--theme);
		text-align: center;
		line-height: 90rpx;
		border-radius: 10rpx;
		position: relative;

		image {
			position: absolute;
			top: 0;
			left: 0;
			height: 100%;
			width: 100%;
			opacity: 0;
		}
	}

	.bottom-box {
		display: flex;
		justify-content: space-between;

		.save {
			background-color: #F5A623;
			color: #FFFFFF;
			width: 48%;
		}

		.share {
			background-color: var(--theme);
			color: #FFFFFF;
			width: 48%;
		}
	}

	//分享弹窗
	.modal-bg {
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, 0.5);
		position: fixed;
		bottom: 0;
		z-index: 999;
	}

	.modal-box {
		width: 100%;
		position: fixed;
		bottom: 0;
		z-index: 9999;

		.modal-top {
			width: 100vw;
			height: 200rpx;
			background: #ffffff;
			color: #313133;
			font-size: 36rpx;
			margin: auto;
			padding-left: 20rpx;
		}

		.modal-bto {
			color: #7A7A80;
			margin-bottom: 20rpx;
		}

		.share-box {
			display: inline-block;
			margin-left: 30rpx;
			margin-top: 30rpx;
			text-align: center;

			image {
				width: 100rpx;
				height: 100rpx;
				// margin-top: 40rpx;
				vertical-align: middle;
			}

			text {
				display: block;
				font-size: 26rpx;
				font-family: PingFangSC, PingFangSC-Medium;
				font-weight: 500;
				color: #999999;
				line-height: 36rpx;
				letter-spacing: -1px;
			}
		}

	}

	@keyframes gdIn {
		from {
			bottom: -1000px;
		}

		100% {
			bottom: 0px;
		}
	}

	.gdIn {
		animation: gdIn 200ms ease-out forwards;
	}

	@keyframes gdOut {
		from {
			bottom: 0px;
		}

		100% {
			bottom: -1000px;
		}
	}

	.gdOut {
		animation: gdOut 200ms ease-in forwards;
	}
</style>

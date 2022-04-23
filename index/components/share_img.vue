<template>
	<view class="dialog" v-if="dialog" @tap="dialog=false" @touchmove.stop.prevent>
		<view class="content" @tap.stop="none">
			<image :src="$image+src" mode="widthFix" />
			<!-- #ifdef H5 -->
			<view class="option">
				<view class="save">长按保存图片
					<image :src="$image+src" mode="" class="image" />
				</view>
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
			id: {},
			name: {}
		},
		data() {
			return {
				dialog: false,
				src: '',
				isShare: false
			}
		},
		mounted() {

		},
		methods: {
			async open() {
				await this.$http('get|api/Goods/poster_share', {
					goods_id: this.id
				}).then(res => {
					this.src = res.result.goods_placard;
				})
			},
			async share() {
				let _this = this;
				// await this.$http('post|api/MobileBase/ajaxGetWxConfig',{
				//     askUrl:window.location.href
				// }).then(res=>{
				//     $wx.config({
				//         debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
				//         appId: res.result.appId, // 必填，公众号的唯一标识
				//         timestamp: res.result.timestamp, // 必填，生成签名的时间戳
				//         nonceStr: res.result.nonceStr, // 必填，生成签名的随机串
				//         signature: res.result.signature,// 必填，签名
				//         jsApiList: ['updateAppMessageShareData'] 
				//     })
				//     $wx.ready(_=>{   //需在用户可能点击分享按钮前就先调用
				//         $wx.updateAppMessageShareData({ 
				//             title: '发现了一个实用的商品，快来购买', // 分享标题
				//             desc: _this.name, // 分享描述
				//             link: res.result.url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
				//             imgUrl: '../../static/share.png', // 分享图标
				//             success: res=> {
				//                 console.log('设置成功')
				//             }
				//         })
				//     }); 
				// })
				this.$get_appId('updateAppMessageShareData', () => {
					$wx.updateAppMessageShareData({
						title: '发现了一个实用的商品，快来购买', // 分享标题
						desc: _this.name, // 分享描述
						link: res.result.url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
						imgUrl: '../../static/share.png', // 分享图标
						success: res => {
							console.log('设置成功')
						}
					})
				})
			},
			none() {
				return false
			},
			saveImg() {
				uni.showLoading()
				uni.getImageInfo({
					src: this.$image + this.src,
					success: function(res) {
						uni.saveImageToPhotosAlbum({
							filePath: res.path,
							success: function() {
								uni.hideLoading()
								uni.showToast({
									title: '保存成功',
									duration: 1000
								});
							},
							fail: function() {
								uni.hideLoading()
								uni.showToast({
									title: '保存失败',
									duration: 1000
								});
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
					imageUrl: this.$image + this.src,
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
					imageUrl: this.$image + this.src,
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
			dialog(val) {
				this.$emit('input', val);
			},
			async value(val) {
				if (val) {
					this.noScroll();
					await this.open();
					// await this.share();
				} else {
					this.remScroll();
				}
				this.dialog = val;
			}
		}
	}
</script>

<style lang="scss">
	.dialog {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 999;

		.content {
			position: fixed;
			width: 630rpx;
			height: 1000rpx;
			top: 50%;
			left: 50%;
			margin-top: -500rpx;
			margin-left: -315rpx;

			image {
				border-radius: 10rpx;
				width: 630rpx;
				height: 900rpx;
			}

			.option {
				margin-top: 10rpx;
				display: flex;
				justify-content: space-between;

				>view {
					width: 300rpx;
					height: 90rpx;
					border-radius: 10rpx;
					font-size: 32rpx;
					line-height: 90rpx;
					text-align: center;
					color: #ffffff;
				}

				.save {
					background-color: #F5A623;
					position: relative;
					width: 100%;
				}

				.share {
					background-color: var(--theme);
				}

				.image {
					opacity: 0;
					height: 100%;
					width: 100%;
					position: absolute;
					left: 0;
					top: 0;
				}
			}
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

<template>
	<view class="page">
		<view class="box">
			<view class="use flex">
				<view class="font-30">头像</view>
				<image :src="user.head_pic" @tap="up_header" />
			</view>
			<view class="flex more" @tap="to_name">
				<view class="font-30">昵称</view>
				<view class="font-30 value" style="padding-right:60rpx">
					{{user.nickname}}
				</view>
			</view>
			<view class="flex">
				<view class="font-30">手机号码</view>
				<view class="font-30 value">
					{{user.mobile}}
				</view>
			</view>
			<!-- <view class="flex" :class="user.is_attestation?'':'more'" @tap="to_shiming">
				<view class="font-30">实名认证</view>
				<view class="font-30" :class="user.is_attestation?'value':'red'">
					{{user.is_attestation?user.realname:'未实名'}}
				</view>
			</view> -->
		</view>
		<view class="box mar-top-20">
			<!-- #ifdef APP-PLUS -->
			<view class="flex more" @tap="to_upPsw">
				<view class="font-30">修改登录密码</view>
			</view>
			<!-- #endif -->
			<view class="flex more" @tap="to_mdf">
				<view class="font-30">修改支付密码</view>
			</view>
		</view>
		<view class="box mar-top-20">
			<view class="flex more" @tap="to_feedback">
				<view class="font-30">意见反馈</view>
			</view>
			<!-- #ifndef H5 -->
			<view class="flex more" @tap="to_about">
				<view class="font-30">关于我们</view>
			</view>
			<!-- #endif -->
		</view>
		<button class="logout" @tap="logout">退出登录</button>
		<!-- #ifdef APP-PLUS -->
		<!-- <view class="box mar-top-20">
			<view class="flex" @tap="to_version">
				<view class="font-30">版本号</view>
				<view class="font-30">{{ver}}</view>
			</view>
		</view>
		<button class="logout" @tap="logout">退出登录</button> -->
		<!-- #endif -->
		<image-cropper :src="tempFilePath" @confirm="confirm" @cancel="cancel"></image-cropper>
	</view>
</template>

<script>
	import ImageCropper from "./invinbg-image-cropper.vue";
	var _this;
	export default {
		components: {
			ImageCropper
		},
		data() {
			return {
				tempFilePath: '',
				ver: '',
				updateInfo: {}
			}
		},
		methods: {
			to_upPsw() {
				uni.navigateTo({
					url: "/pages/forgetPSW?type=1"
				});
			},
			to_version() {
				// #ifdef APP-PLUS
				this.updateApp()
				// #endif
			},
			to_name() {
				uni.navigateTo({
					url: "/my/name/name"
				});
			},
			to_shiming() {
				if (this.user.is_attestation == 0) {
					uni.navigateTo({
						url: "/my/shiming/shiming"
					});
				}
			},
			to_mdf() {
				uni.navigateTo({
					url: "/my/mdf_password/mdf_password"
				});
			},
			to_feedback() {
				uni.navigateTo({
					url: "/my/feedback/feedback"
				});
			},
			to_about() {
				uni.navigateTo({
					// #ifdef APP-PLUS
					// 深圳快来互娱网络科技有限公司 id=13
					// url: "/my/about/about?title=关于我们&id=13"
					
					// 星深圳市创视界科技有限公司 id=14
					url: "/my/about/about?title=关于我们&id=14",
					// #endif
					// #ifdef H5
					url: "/my/about/about?title=关于我们&id=1"
					// #endif
				});
			},
			logout() {
				uni.showModal({
					title: '提示',
					content: '确认退出登录吗',
					success: (res) => {
						if (res.confirm) {
							uni.showLoading({
								mask: true
							})
							this.$http('post|api/User/logout').then(res => {
								this.$toastApp('退出登录成功');
								setTimeout(() => {
									uni.reLaunch({
										url: '/pages/my'
									});
								}, 1000);
							}).catch(err => {
								this.$toastApp(err.msg, 'none');
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})
			},
			up_header() {
				uni.chooseImage({
					count: 1,
					success: (res) => {
						this.tempFilePath = res.tempFilePaths.shift()
					}
				})
			},
			confirm(e) {
				this.$uploadHeader(e.detail.tempFilePath).then(res => {
					if (res.result) {
						this.$http('post|api/User/userinfo', {
							head_pic: res.result
						}).then(res => {
							this.$toastApp(res.msg);
							uni.redirectTo({
								url: '/my/setting/setting'
							})
						})
					}
				})
			},
			cancel() {
				console.log('canceled')
			},
			getUserInfo() {
				this.$http('get|api/User/index').then(res => {
					this.users = res.result.users;
					this.user_message_count = res.result.user_message_count;
					if (/http/.test(this.users.head_pic)) {

					} else {
						this.users.head_pic = this.$image + this.users.head_pic;
					}
					this.$store.dispatch('set_user', this.users);
					uni.setStorageSync('setinvite', res.result.users.encipher);
					uni.setStorageSync('level', res.result.users.level);
				})
			},
			updateApp() {
				this.$http('get|api/Index/app_version').then(res => {
					console.log("更新")
					console.log(res)
					if (res.status == 1) {
						this.updateInfo = res.result.version
						plus.runtime.getProperty(plus.runtime.appid, function(wgtinfo) {
							// 获取当前app版本
							_this.version = wgtinfo.version;
							// 判断手机类型
							switch (uni.getSystemInfoSync().platform) {
								case 'android':
									if (_this.isUpdate(_this.version, res.result.version.app_version)) {
										_this.serverVersion = res.result.version.app_version;
										_this.clientType = 'android'
										_this.showUpdate(res.result.version.app_log)
									} else {
										uni.showToast({
											title: '当前为最新版本',
											icon: 'none'
										});
									}
									break;
								case 'ios':
									if (_this.isUpdate(_this.version, res.result.version.ios_version)) {
										_this.serverVersion = res.result.version.ios_version;
										_this.clientType = 'ios'
										_this.showUpdate(res.result.version.app_log)
									} else {
										uni.showToast({
											title: '当前为最新版本',
											icon: 'none'
										});
									}
									break;
							}
						});
					}
				})
			},
			isUpdate(curVersion, serVersion) { // 判断是否需要更新
				let [serArray, curArray] = [serVersion.split("."), curVersion.split(".")]
				if (parseInt(serArray[0]) > parseInt(curArray[0])) {
					return true
				} else if (parseInt(serArray[1]) > parseInt(curArray[1])) {
					return true
				} else if (parseInt(serArray[1]) >= parseInt(curArray[1]) && parseInt(serArray[2]) > parseInt(curArray[2])) {
					return true
				} else {
					return false
				}
			},
			showUpdate(appLog) {
				uni.showModal({
					title: '系统升级',
					content: appLog,
					showCancel: false,
					success: res => {
						if (res.confirm) {
							let version = this.version.split('.');
							let updateVersion = this.serverVersion.split('.');
							// 大更新
							if (parseInt(updateVersion[0]) > parseInt(version[0]) || (parseInt(updateVersion[0]) >= parseInt(version[0]) &&
									parseInt(updateVersion[1]) > parseInt(version[1]))) {
								if (this.clientType == 'android') {
									plus.runtime.openURL(_this.updateInfo.android_url)
								} else {
									console.log(_this.updateInfo.ios_url)
									plus.runtime.openURL(_this.updateInfo.ios_url)
								}
							} else if (parseInt(updateVersion[2]) > parseInt(version[2])) { // 小更新
								// 热更新
								this.downApp(this.$image + this.updateInfo.hot_update, 'thermalRenewal');
							}
						}
					}
				})
			},
			downApp(url, updateType) {
				console.log(url)
				let waiting = plus.nativeUI.showWaiting('下载中...');
				// 创建下载任务
				let dtask = plus.downloader.createDownload(url, {
					filename: '_doc/update/' // 文件下载保存路径
				}, function(d, status) {
					console.log(status)
					if (status == 200) {
						waiting.setTitle('安装中...');
						// 下载成功-自动安装
						plus.runtime.install(d.filename, {}, function() {
							plus.nativeUI.closeWaiting();
							plus.nativeUI.alert('更新完成！', function() {
								uni.showTabBar();
								// 清除所有下载的包
								// plus.downloader.clear(-1);
								// 重启app
								if (updateType == 'thermalRenewal') {
									plus.runtime.restart();
								}
							});
						}, function(e) {
							plus.nativeUI.closeWaiting();
							plus.nativeUI.alert('安装失败[' + e.code + ']：' + e.message);
						});
					} else {
						//下载失败
						plus.nativeUI.alert('下载失败！');
						setTimeout(() => {
							plus.nativeUI.closeWaiting();
						}, 1000)
						if (updateType == 'bigUpdate') {
							plus.runtime.openURL(url) //打开网页手动下载
						}
					}
				})
				dtask.start();
			},
		},
		computed: {
			user() {
				return this.$store.getters.get_user
			}
		},
		onShow() {
			this.getUserInfo()
			let that = this
			// #ifdef APP-PLUS
			plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
				that.ver = widgetInfo.version
			})
			// #endif
		},
		onLoad() {
			_this = this
		}
	}
</script>

<style lang="scss">
	.page {
		min-height: calc(100vh - 88rpx);
		background-color: #F7F7F7;

		.box {
			padding: 0 30rpx;
			box-sizing: border-box;
			background-color: #ffffff;

			.flex {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 10rpx 0;
				border-bottom: 1rpx solid #F5F6F7;
				min-height: 100rpx;
				position: relative;

				.value {
					color: #808080;
				}

				.red {
					color: #F53E3E;
					padding-right: 60rpx;
				}
			}

			.more::after {
				position: absolute;
				height: 40rpx;
				width: 40rpx;
				content: '';
				background-image: url(../../static/more.png);
				background-size: 100%;
				top: 50%;
				margin-top: -20rpx;
				right: 0;
			}

			.use image {
				height: 100rpx;
				width: 100rpx;
				border-radius: 50%;
			}

		}

		.mar-top-20 {
			margin-top: 20rpx;
		}

		.logout {
			width: 690rpx;
			height: 90rpx;
			background: var(--theme);
			border-radius: 46rpx;
			color: #FFFFFF;
			line-height: 90rpx;
			font-size: 32rpx;
			font-family: PingFangSC, PingFangSC-Regular;
			font-weight: 400;
			text-align: center;
			margin-top: 60rpx;
		}
	}
</style>

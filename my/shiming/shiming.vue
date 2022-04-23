<template>
	<view>
		<form @submit="formSubmit">
			<view class="info-bg">
				<view class="info-box">
					<view class="item">
						<text>姓名</text>
						<input type="text" name="realname" maxlength="30" placeholder="请输入真实姓名" placeholder-class="no" />
					</view>
					<view class="item">
						<text>证件号码</text>
						<input type="idcard" name="real_number" maxlength="18" placeholder="请输入证件号码" placeholder-class="no" />
					</view>
				</view>
			</view>
			<view class="upload-box">
				<view class="title">证件照片</view>
				<view class="upload-item">
					<image class="before-box" :src="card_front_image" @tap="chooseBefore"></image>
				</view>
				<view class="upload-item">
					<image class="after-box" :src="card_reverse_image" @tap="chooseAfter"></image>
				</view>
			</view>
			<button class="btn" form-type="submit">提交</button>
		</form>
	</view>
</template>

<script>
	var graceChecker = require("@/globe/checker.js")
	export default {
		data() {
			return {
				username: '',
				idCard: '',
				isRz: false,
				beforeSrc: '',
				afterSrc: '',
				card_front_image: '',
				card_reverse_image: ''
			};
		},
		methods: {
			formSubmit(e) {
				//定义表单规则
				var rule = [{
						name: "realname",
						checkType: "string",
						checkRule: "2,6",
						errorMsg: "请输入正确的姓名"
					},
					{
						name: "real_number",
						checkType: "notnull",
						errorMsg: "请输入证件号码"
					}
				]
				//进行表单检查 e.detail.value 内存放着表单数据
				var formData = e.detail.value;
				var checkRes = graceChecker.check(formData, rule);
				if (checkRes) {
					if (this.beforeSrc && this.afterSrc) {
						formData.identification_ob = this.beforeSrc
						formData.identification_re = this.afterSrc
						uni.showLoading({
							mask:true,
							title:'上传中'
						})
						this.$http('post|api/User/userinfo', formData).then(res => {
							console.log(res);
							uni.hideLoading()
							this.$toastApp(res.msg)
							setTimeout(() => {
								uni.redirectTo({
									url: '/my/setting/setting'
								})
							},800)
						})
					} else {
						uni.showToast({
							title: '图片不能为空',
							icon: 'none',
							duration: 2000
						});
					}
				} else {
					uni.showToast({
						title: graceChecker.error,
						icon: "none"
					});
				}
			},
			chooseBefore() {
				uni.chooseImage({
					count: 1,
					success: (chooseImageRes) => {
						console.log(chooseImageRes);
						this.card_front_image = chooseImageRes.tempFilePaths[0]
						uni.showLoading({
							mask:true,
							title:'上传中'
						})
						this.$uploadFile(chooseImageRes).then(res => {
							this.beforeSrc = res.result
							console.log(this.beforeSrc);
							uni.hideLoading()
						})
					}
				})
			},
			chooseAfter() {
				uni.chooseImage({
					count: 1,
					success: (chooseImageRes) => {
						console.log(chooseImageRes);
						this.card_reverse_image = chooseImageRes.tempFilePaths[0]
						uni.showLoading({
							mask:true,
							title:'上传中'
						})
						this.$uploadFile(chooseImageRes).then(res => {
							this.afterSrc = res.result
							uni.hideLoading()
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f5f7fa;
		overflow: hidden;
	}

	.no {
		color: #BFC2CC;
		text-align: right;
	}

	.info-bg {
		background-color: #FFFFFF;
		margin-top: 20rpx;
	}

	.item {
		margin-top: 20rpx;
		width: 690rpx;
		height: 120rpx;
		background: #fff;
		box-shadow: 0rpx -1rpx 0rpx 0rpx #edeff3 inset;
		font-size: 30rpx;
		margin: 0 auto;
		position: relative;
		line-height: 120rpx;

		input {
			position: absolute;
			right: 0;
			margin-top: 40rpx;
			text-align: right;
			display: inline-block;
			width: 80%;
		}
	}

	.upload-box {
		width: 750rpx;
		height: 362rpx;
		background: #ffffff;

		image {
			width: 330rpx;
			height: 220rpx;
		}

		.title {
			width: 690rpx;
			height: 120rpx;
			font-size: 30rpx;
			color: #313133;
			line-height: 120rpx;
			margin-left: 30rpx;
		}

		.before-box {
			background-image: url(../../static/idCard_before.png);
			background-size: 100%;
		}

		.after-box {
			background-image: url(../../static/idCard_after.png);
			background-size: 100%;
		}

		.upload-item {
			display: inline-block;
			width: 330rpx;
			height: 502rpx;
			margin: 0 auto;
			margin-left: 30rpx;
		}
	}

	.btn {
		width: 630rpx;
		height: 90rpx;
		background: var(--theme);
		border-radius: 46rpx;
		line-height: 90rpx;
		color: #fff;
		margin: 0 auto;
		margin-top: 60rpx;
	}
</style>

<template>
	<view>
		<view class="fail-box" v-if="formData.status==-1">{{formData.check_desc}}</view>
		<view class="from">
			<picker :range="list" range-key="identity_name" @change="picker_change">
				<view class="from-item">
					<view class="font-30">申请身份</view>
					<view :class="['more font-28',formData.identity_id?'':'cc']">{{typeName}}</view>
				</view>
			</picker>
		</view>
		
		<view class="small-tlt">公司信息</view>
		<view class="from">
			<view class="from-item">
				<view class="font-30">姓名</view>
				<input class="font-28" v-model="formData.name" placeholder="请输入公司法人姓名" placeholder-class="cc" />
			</view>
			<view class="from-item">
				<view class="font-30">手机号</view>
				<input class="font-28" v-model="formData.mobile" placeholder="请输入负责人手机号" placeholder-class="cc" />
			</view>
			<view class="from-item">
				<view class="font-30">邮箱地址</view>
				<input class="font-28" v-model="formData.email" placeholder="请输入负责人邮箱地址" placeholder-class="cc" />
			</view>
			<view class="from-item">
				<view class="font-30">公司地址</view>
				<textarea auto-height class="font-28" v-model="formData.address" placeholder="请输入公司详细地址" placeholder-class="cc" />
			</view>
			<view class="from-item">
				<view class="font-30">公司法人身份证正反面</view>
			</view>
			<view class="img-box">
				<image class="before-img" :src="$image+formData.identification_ob" @tap="chooseBefore"></image>
				<image class="after-img" :src="$image+formData.identification_re" @tap="chooseAfter"></image>
			</view>
			<view class="from-item">
				<view class="font-30">公司营业执照扫描件</view>
			</view>
			<view class="img-box">
				<image class="zhizhao-img" :src="$image+formData.license" @tap="chooseLin"></image>
			</view>
			<view class="from-item">
				<view class="font-30">企业支付宝截图或开户行许可证照片</view>
			</view>
			<view class="img-box">
				<image class="ali-img" :src="$image+formData.bank_license" @tap="chooseBank"></image>
			</view>
		</view>
		
		<view class="small-tlt">账户信息</view>
		<view class="from">
			<view class="from-item">
				<view class="font-30">公司名称</view>
				<input class="font-28" v-model="formData.company_name" placeholder="请输入公司名称" placeholder-class="cc" />
			</view>
			<!-- <view class="from-item">
				<view class="font-30">姓名</view>
				<input class="font-28" v-model="formData.realname" placeholder="请输入开户人姓名" placeholder-class="cc" />
			</view> -->
			<view class="from-item">
				<view class="font-30">开户行账号</view>
				<input class="font-28" v-model="formData.bank_card" placeholder="请输入开户行账号" placeholder-class="cc" />
			</view>
			<view class="from-item">
				<view class="font-30">开户行名称</view>
				<input class="font-28" v-model="formData.bank_name" placeholder="请输入开户行名称" placeholder-class="cc" />
			</view>
			<view class="from-item">
				<view class="font-30">开户行地址</view>
				<textarea auto-height class="font-28" v-model="formData.bank_address" placeholder="请输入开户行地址" placeholder-class="cc" />
			</view>
			<view class="from-item">
				<view class="font-30">备注</view>
				<textarea auto-height class="font-28" v-model="formData.desc" placeholder="请输入备注内容" placeholder-class="cc" />
			</view>
			<view class="from-item">
				<view class="font-30">附件</view>
			</view>
			<view class="img-list">
				<view class="img-box" v-for="(item,index) in imgList" :key="index">
					<image class="close-btn" src="/static/close_b.png" @tap="delImg(index)"></image>
					<image class="ali-img" :src="$image+item"></image>
				</view>
				<view class="img-box" v-if="imgList.length<3">
					<image class="ali-img" @tap="chooseAcc"></image>
				</view>
			</view>
		</view>
		
		<view class="buttom font-32" @tap="submit">提交</view>
		<view class="ios-btm"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				identity_name: '请选择',
				formData: {
					identity_id:'',
					name:'',
					mobile:'',
					email:'',
					address:'',
					identification_ob:'',
					identification_re:'',
					license:'',
					bank_license :'',
					company_name:'',
					// realname:'',
					bank_card:'',
					bank_name:'',
					bank_address:'',
					desc:'',
					accessory:''
				},
				imgList:[]
			}
		},
		onLoad() {
			this.$http('get|api/user/apply_partner').then(res => {
				console.log(res);
				this.list = res.result.identity
				if (res.result.user_embassy) {
					this.formData = res.result.user_embassy
					if (this.formData.accessory) {
						this.imgList = this.formData.accessory
					}
				}
			})
		},
		computed:{
			typeName(){
				if (!this.list.length) {
					return '请选择'
				}
				let temp = '请选择'
				this.list.forEach(item => {
					if (item.id == this.formData.identity_id) {
						temp = item.identity_name
					}
				})
				return temp
			}
		},
		methods: {
			delImg(i){
				this.imgList.splice(i,1)
			},
			picker_change(e) {
				this.formData.identity_id = this.list[e.detail.value].id;
				// this.identity_name = this.list[e.detail.value].identity_name;
			},
			submit() {
				if (!this.formData.identity_id) {
					this.$toastApp("请选择申请身份");
					return
				}
				if (!this.formData.name) {
					this.$toastApp("负责人姓名不能为空");
					return
				}
				if (!this.formData.mobile) {
					this.$toastApp("负责人手机号不能为空");
					return
				}
				if (!this.formData.email) {
					this.$toastApp("邮箱地址不能为空");
					return
				}
				if (!this.formData.address) {
					this.$toastApp("公司地址不能为空");
					return
				}
				if (!this.formData.identification_ob) {
					this.$toastApp("请上传法人身份证正面照");
					return
				}
				if (!this.formData.identification_re) {
					this.$toastApp("请上传法人身份证反面照");
					return
				}
				if (!this.formData.license) {
					this.$toastApp("请上传营业执照扫描件");
					return
				}
				if (!this.formData.company_name) {
					this.$toastApp("公司名称不能为空");
					return
				}
				// if (!this.formData.realname) {
				// 	this.$toastApp("开户人姓名不能为空");
				// 	return
				// }
				if (!this.formData.bank_card) {
					this.$toastApp("开户行账号不能为空");
					return
				}
				if (!this.formData.bank_name) {
					this.$toastApp("开户行名称不能为空");
					return
				}
				if (!this.formData.bank_address) {
					this.$toastApp("开户行地址不能为空");
					return
				}
				uni.showLoading({
					mask:true
				})
				// console.log(this.from);
				this.formData.accessory = this.imgList
				this.$http('post|api/user/apply_partner', this.formData).then(res => {
					console.log(res);
					this.$toastApp(res.msg);
					setTimeout(() => {
						uni.navigateBack();
					}, 1000);
				}).catch(e => {
					console.log(e);
					this.$toastApp(e.msg)
				})
			},
			chooseBefore() {
				let that = this
				uni.chooseImage({
					count: 1,
					sizeType:'compressed',
					success: (chooseImageRes) => {
						uni.showLoading({
							mask:true,
							title:'上传中'
						})
						that.$uploadCom(chooseImageRes).then(res => {
							that.formData.identification_ob = res.result
							uni.hideLoading()
							that.$forceUpdate()
							uni.showToast({
								title:'上传成功'
							})
						})
					}
				})
			},
			chooseAfter() {
				let that = this
				uni.chooseImage({
					count: 1,
					sizeType:'compressed',
					success: (chooseImageRes) => {
						uni.showLoading({
							mask:true,
							title:'上传中'
						})
						this.$uploadCom(chooseImageRes).then(res => {
							that.formData.identification_re = res.result
							uni.hideLoading()
							that.$forceUpdate()
							uni.showToast({
								title:'上传成功'
							})
						})
					}
				})
			},
			chooseLin() {
				let that = this
				uni.chooseImage({
					count: 1,
					sizeType:'compressed',
					success: (chooseImageRes) => {
						uni.showLoading({
							mask:true,
							title:'上传中'
						})
						this.$uploadCom(chooseImageRes).then(res => {
							that.formData.license = res.result
							uni.hideLoading()
							that.$forceUpdate()
							uni.showToast({
								title:'上传成功'
							})
						})
					}
				})
			},
			chooseBank(){
				let that = this
				uni.chooseImage({
					count: 1,
					sizeType:'compressed',
					success: (chooseImageRes) => {
						uni.showLoading({
							mask:true,
							title:'上传中'
						})
						this.$uploadCom(chooseImageRes).then(res => {
							that.formData.bank_license = res.result
							uni.hideLoading()
							that.$forceUpdate()
							uni.showToast({
								title:'上传成功'
							})
							console.log(that.$image + that.formData.bank_license);
						})
					}
				})
			},
			chooseAcc(){
				let that = this
				uni.chooseImage({
					count: 1,
					sizeType:'compressed',
					success: (chooseImageRes) => {
						uni.showLoading({
							mask:true,
							title:'上传中'
						})
						this.$uploadCom(chooseImageRes).then(res => {
							that.imgList.push(res.result)
							uni.hideLoading()
							that.$forceUpdate()
							uni.showToast({
								title:'上传成功'
							})
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F7F7F7;
	}
	.fail-box{
		box-sizing: border-box;
		position: sticky;
		top: 0;
		width: 100vw;
		z-index: 999999;
		font-size: 28rpx;
		line-height: 40rpx;
		color: #FFFFFF;
		padding: 20rpx 30rpx;
		background-color: #FF615D;
	}
	.from {
		padding: 0 30rpx;
		box-sizing: border-box;
		background-color: #ffffff;

		.from-item:first-child {
			border-top: none;
		}

		.from-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-top: 1rpx solid rgba(223, 227, 230, 1);
			padding: 30rpx 0;
			color: #313133;
			font-size: 28rpx;

			.more {
				position: relative;
				padding-right: 40rpx;
			}

			.more::after {
				content: '';
				position: absolute;
				height: 40rpx;
				width: 40rpx;
				background-image: url(../../static/more.png);
				background-size: 100%;
				right: 0;
				top: 50%;
				margin-top: -20rpx;
			}

			.cc {
				color: #cccccc;
			}

			input {
				text-align: right;
				width: 70%;
			}

			textarea {
				text-align: right;
				width: 70%;
			}
		}

	}

	.small-tlt {
		display: flex;
		align-items: center;
		height: 76rpx;
		color: #A2A7BA;
		font-size: 26rpx;
		line-height: 36rpx;
		padding-left: 30rpx;
	}

	.buttom {
		width: 690rpx;
		height: 90rpx;
		background: rgba(78, 110, 243, 1);
		border-radius: 45rpx;
		text-align: center;
		line-height: 90rpx;
		margin: 0rpx auto;
		margin-top: 60rpx;
		color: #ffffff;
	}
	
	.img-box{
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 30rpx;
		image{
			width: 328rpx;
			height: 220rpx;
		}
		.close-btn{
			position: absolute;
			top: -16rpx;
			right: -16rpx;
			// transform: rotate(45deg);
			width: 40rpx;
			height: 40rpx;
			z-index: 9;
		}
		.before-img{
			background-image: url(../../static/idCard_before.png);
			background-size: 100%;
		}
		.after-img{
			background-image: url(../../static/idCard_after.png);
			background-size: 100%;
		}
		.zhizhao-img{
			background-image: url(../../static/zhizhao.png);
			background-size: 100%;
		}
		.ali-img{
			width: 180rpx;
			height: 180rpx;
			background-image: url(../../static/add_img.png);
			background-size: 100%;
		}
	}
	.img-list{
		display: flex;
		align-items: center;
		.img-box:not(:first-child){
			margin-left: 30rpx;
		}
	}
</style>

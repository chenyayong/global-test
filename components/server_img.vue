<template>
	<view class="server-dialog" v-if="dialog" @tap="dialog=false">
		<view class="content" @tap.stop="none">
			<view class="title font-36">
				<view class="tlt-item" :class="{'tlt-act':current==0}" @tap="current=0">售后客服</view>
				<view class="tlt-item" :class="{'tlt-act':current==1}" @tap="current=1">技术客服</view>
			</view>
			<swiper :current="current" @change="change">
				<swiper-item>
					<view>
						<view class="code font-28">
							微信号：{{after_service.WeChat}}
							<image src="/static/copy_icon.png" mode="" @tap="$copy(after_service.WeChat)" />
						</view>
						<view class="code font-28">
							客服电话：{{after_service.phone}}
							<image src="/static/copy_icon.png" mode="" @tap="$copy(after_service.phone)" />
						</view>
						<image :src="$image+after_service.service_code" mode="" class="code-img" />
					</view>
				</swiper-item>
				<swiper-item>
					<view>
						<view class="code font-28">
							微信号：{{technical_service.WeChat}}
							<image src="/static/copy_icon.png" mode="" @tap="$copy(technical_service.WeChat)" />
						</view>
						<view class="code font-28">
							客服电话：{{technical_service.phone}}
							<image src="/static/copy_icon.png" mode="" @tap="$copy(technical_service.phone)" />
						</view>
						<image :src="$image+technical_service.service_code" mode="" class="code-img" />
					</view>
				</swiper-item>
			</swiper>
			<view class="font-28 tip">
				扫一扫，加我微信好友
			</view>
		</view>
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
				after_service:'',
				technical_service:'',
				current:0
			}
		},
		methods: {
			change(e){
				this.current = e.detail.current
			},
			// copy(){
			//     let textarea = document.createElement('textarea');
			//     textarea.value=this.wechat;
			//     textarea.style.position='fixed'
			//     textarea.style.zIndex='-999'
			//     textarea.style.top=0;
			//     document.body.appendChild(textarea);
			//     textarea.select();
			//     document.execCommand('copy');
			//     this.$toastApp('复制成功');
			//     document.body.removeChild(textarea);
			// },
			async get_img() {
				await this.$http('get|api/Index/service_code').then(res => {
					this.after_service = res.result.after_service
					this.technical_service = res.result.technical_service
				})
			},
			none() {
				return false
			}
		},
		watch: {
			async value(val) {
				if (val) {
					await this.get_img();
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
	.server-dialog {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background-color: rgba(0, 0, 0, 0.7);
		z-index: 999;
		swiper{
			height: 614rpx;
			swiper-item{
				height: 614rpx;
			}
		}
		.content {
			height: 840rpx;
			width: 640rpx;
			background-image: url(../static/server_img.png);
			background-repeat: no-repeat;
			background-size: 100%;
			position: fixed;
			top: 50%;
			left: 50%;
			margin-left: -310rpx;
			margin-top: -420rpx;
			padding-top: 20rpx;

			.title {
				display: flex;
				align-items: center;
				justify-content: center;
				height: 100rpx;
				// line-height: 100rpx;
				text-align: center;
				.tlt-item{
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 32rpx;
					width: 180rpx;
					height: 60rpx;
					color: #333333;
					background-color: #EEEEEE;
					border-radius: 30rpx;
				}
				.tlt-act{
					color: #FFFFFF;
					background-color: #4E6EF3;
				}
				.tlt-item:not(:first-child){
					margin-left: 30rpx;
				}
			}

			.code {
				margin: 0 auto;
				margin-top: 10rpx;
				width: 450rpx;
				height: 60rpx;
				background: #DCE2FD;
				border-radius: 10rpx;
				text-align: center;
				line-height: 60rpx;

				image {
					height: 32rpx;
					width: 32rpx;
					display: inline-block;
					vertical-align: middle;
					margin-left: 10rpx;
				}
			}

			.code-img {
				height: 440rpx;
				width: 440rpx;
				margin: 0 auto;
				margin-top: 24rpx;
				display: block;
			}

			.tip {
				text-align: center;
				margin-top: 50rpx;
			}
		}
	}
</style>

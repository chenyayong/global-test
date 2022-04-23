<template>
	<view class="pay-password" v-show="show" @touchmove.stop.prevent @tap.stop>
		<view class="keyboard-bg"></view>
		<!-- 支付键盘 -->
		<view class="popup-bg mask"></view>
		<view class="keyboard" :class="{'shows':show}">
			<view class="keyboard-title">
				<view class="close" @click="closeTap"></view>
				<text>请输入支付密码</text>
			</view>
			<view class="keyboard-payword">
				<view class="keyboard-item" v-for="(item,index) in 6" :key="index">{{payword.length > index ? '●' : '' }}</view>
			</view>
			<navigator class="forget" url="/my/mdf_password/mdf_password" hover-class="none">忘记密码？</navigator>
			<view class="keyboard-num">
				<view class="num" v-for="(item,index) in 10" :key="index" @click="entry(index)">{{index}}</view>
				<view class="del" @click="delTap">
					<view class="del-icon"></view>
				</view>
			</view>
		</view>
		<!-- 支付键盘结束 -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 支付键盘
				payword: [],
				show: false
			};
		},
		props: {
			//忘记密码url
			url: {
				type: String,
				default: ''
			}
		},
		methods: {
			//显示支付键盘
			showPay() {
				this.show = true
			},
			//隐藏支付键盘
			closeTap() {
				this.show = false;
				//清空输入密码
				this.payword = [];
				this.$toastApp('提现取消')
			},
			//输入密码显示
			entry(value) {
				if (this.payword.length < 6) {
					this.payword.push(value)
				}
				this.$emit('onChange', this.payword)
			},
			//删除密码
			delTap() {
				if (this.payword.length > 0) {
					this.payword.pop()
				}
			},
			//清除密码
			clearPayWord() {
				this.payword = []
			}
		}
	}
</script>

<style>
	.keyboard-bg {
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, 0.5);
		position: fixed;
		bottom: 0;
		z-index: 9;
	}

	.keyboard {
		background: #F5F7FA;
		overflow: hidden;
		width: 100%;
		position: absolute;
		left: 0;
		bottom: 0;
		z-index: 999;
		transform: translateY(100%);
		transition: all ease .3s;
	}

	.keyboard.shows {
		transform: translateY(0);
		animation: gdIn 200ms ease-out forwards;
	}

	.keyboard-title {
		background: white;
		height: 96rpx;
		padding: 0 20rpx;
		border-bottom: 1px solid #eee;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.keyboard-title .close {
		width: 40rpx;
		height: 40rpx;
		position: absolute;
		right: 26rpx;
		top: 50%;
		transform: translateY(-50%);
		background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoBAMAAAB+0KVeAAAAFVBMVEUAAACdnZ2dnZ2dnZ2dnZ2dnZ2dnZ03OIj5AAAABnRSTlMAzRHqtWIJ/RT+AAAAkUlEQVQoz4XTwQnDMAwAQNER+ui7ha7QDtBHF+gEJSH7j5AQPQ4LgQ1JZOVCbMuO3ydKe77i/b+Pucttie92HZOPbT2upOChzpuWqNA0KOgJCkDRAIVeiwvUAfXAQEEUDDRhoQkLTVgoWJKzz/1oOiSDn03TglSItovcl6MvXF9iEAAJEO23Ioi227s9CO2R2QFLnTvnWz5f3wAAAABJRU5ErkJggg==')no-repeat;
		background-size: 100%;
		box-sizing: border-box;
	}

	.keyboard-title text {
		font-size: 32rpx;
		color: #333333;
	}

	.keyboard-payword {
		margin: 50rpx 80rpx 20rpx 80rpx;
		height: 92rpx;
		line-height: 90rpx;
		text-align: center;
		border: 1px solid #d0d0d0;
		display: flex;
		background-color: #fff;
	}

	.keyboard-item {
		flex: 1;
		border-right: 1px solid #d3d3d3;
		font-size: 36rpx;
	}

	.keyboard-item:last-of-type {
		border-right: 0;
	}

	.forget {
		line-height: 80rpx;
		display: block;
		text-align: center;
		color: #333333;
		margin-bottom: 30rpx;
		font-size: 24rpx;
		padding: 0 30rpx;
		text-align: right;
	}

	.keyboard-num {
		background: #ABB3BD;
		padding-bottom: 110rpx;
		position: relative;
		display: flex;
		flex-wrap: wrap;
	}

	.keyboard-num .num {
		background: #fff;
		line-height: 108rpx;
		border-right: 1px solid #ABB3BD;
		border-bottom: 1px solid #ABB3BD;
		font-size: 48rpx;
		text-align: center;
		width: 33.33%;
		box-sizing: border-box;
	}

	.keyboard-num .del {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 33.33%;
		position: absolute;
		right: 0;
		bottom: 0;
		height: 110rpx;
		box-sizing: border-box;
	}

	.keyboard-num .del .del-icon {
		width: 64rpx;
		height: 38rpx;
		background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAmCAMAAABDGm2rAAAAS1BMVEUAAAD///////////////////////////////////////////////////////////+ZmZn5+fns7Oyfn5+srKzMzMzGxsa/v7+pqam20vjYAAAAD3RSTlMApV5X4mH1VC0nGREK1JAztwIyAAAAvklEQVRIx73Wyw6CUAxF0YJXBERbVB7//6XegdKE0hRyEs6IydqJ8iS7hvftTtsri52BKj3bwIdLNeTzHh3m81DPqGfUM+oZ9Rq4eH7o9fg12kDkJ/n0i3/LZAKBH0VyYfEigwl4XtGvoIcm4Hplnmf1QcHxbLxTmB3P6oOC45lu6oPCbDwYwH8C/ifipxG/kPBLGb+Z8Nv5vxJ4oNjCqQ9VtIC/WNAC/nJd7XqskDqCClVNhBSKlrbW8JGvrC/rTnd+pLfbagAAAABJRU5ErkJggg==')no-repeat;
		background-size: 100%;
	}

	.keyboard-num .num:first-of-type {
		position: absolute;
		left: 33.33%;
		bottom: 0;
	}

	.keyboard-num .num:active {
		background: #d2ddeb;
		transition: .1s;
	}

	.keyboard-num .del:active {
		background: #fff;
		transition: .1s;
	}

	.pay-password .pay-money {
		height: 100rpx;
		font-size: 52rpx;
		color: #F4293F;
		text-align: center;
		line-height: 100rpx;
		margin-top: 20rpx;
	}

	@keyframes gdIn {
		from {
			bottom: -1000px;
		}

		100% {
			bottom: 0px;
		}
	}
</style>

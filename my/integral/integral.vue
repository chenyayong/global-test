<template>
	<view>
		<view class="header">
			<!-- <view class="rule font-24" @tap="to_rule">积分规则</view> -->
			<view class="yue">
				<view class="font-26">积分抵扣券</view>
				<view class="font-72 bold">{{points}}</view>
			</view>
		</view>
		<!-- <view class="top-oper flex-row">
			<navigator url="/my/integral_transfer/integral_transfer" hover-class="none" class="con-oper">
				<image src="/static/wallet_icon2.png" class="oper-icon" mode=""></image>
				<text>转账</text>
			</navigator>
		</view> -->
		<view class="option">
			<view 
				@tap="to_active(item,index)"
				v-for="(item,index) in option" 
				:key="index" 
				:class="[item.active?'active':'']">
				{{item.label}}
			</view>
		</view>
		<view class="list-box">
			<view v-for="(item,index) in option[active].list" :key="index" class="list-item">
				<view>
					<view class="font-30">{{item.desc}}</view>
					<view class="font-26">{{item.change_time}}</view>
				</view>
				<view class="font-34" :style="{color:item.pay_points<0?'#F41613':'#333333'}">{{item.pay_points}}</view>
			</view>
		</view>
		<!-- <no-more v-model="option[active].have"  @more="more(option[active])"></no-more> -->
		<view v-if="option[active].list.length>0">
			<view v-if="!option[active].have" class="no-more">我是有底线的</view>
		</view>
		<no-data v-else></no-data>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				option:[
					{
						label:'全部',
						value:'all',
						active:true,
						page:1,
						have:true,
						list:[]
					},
					{
						label:'收入',
						value:'plus',
						active:false,
						page:1,
						have:true,
						list:[]
					},
					{
						label:'支出',
						value:'minus',
						active:false,
						page:1,
						have:true,
						list:[]
					}
				],
				active:0,
				points:''
			}
		},
		onShow(){
			this.get_list(this.option[this.active],true);
		},
		methods: {
			get_list(item,bool){
				this.$http('get|api/User/points_list',{
					type:item.value,
					p:item.page
				}).then(res=>{
					if(res.result.account_log.length===0){
						item.have=false;
						// return
					}
					if(bool){
						item.list=[]
					}
					this.points=res.result.points
					item.list=[...item.list,...res.result.account_log];
				})
			},
			more(item){
				item.page+=1;
				this.get_list(item);
			},
			to_active(item,index){
				this.option.forEach(el=>{
					el.active=false;
				})
				this.active=index;
				item.page=1;
				item.active=true;
				this.get_list(item,true)
			},
			to_rule(){
				uni.navigateTo({
					url: "/my/about/about?title=积分规则&id=9"
				});
			}
		},
		onReachBottom() {
			uni.showLoading({
				title: '加载中...'
			})
			this.more(this.option[this.active])
		}
	}
</script>

<style lang="scss">
	page{background: #F7F7F7;}

	.header{
		height: 300rpx;
		/* #ifdef APP-PLUS */
		background-image: url(../../static/integral.png);
		/* #endif */
		/* #ifdef H5 */
		background-image: url(../../static/h5_integral.png);
		/* #endif */
		background-size: 100% ;
		width: 100%;
		position: relative;
		.rule{
			width:132rpx;
			height:46rpx;
			/* #ifdef APP-PLUS */
			background:#88A8FD;
			/* #endif */
			/* #ifdef H5 */
			background-color: #33DA87;
			/* #endif */
			border-radius:104rpx 0px 0px 104rpx;
			position: absolute;
			top: 30rpx;
			right: 0;
			text-align: center;
			line-height: 46rpx;
			color: rgba(255,255,255,0.7);
		}
		.yue{
			text-align: center;
			padding-top: 70rpx;
			color: #ffffff;
		}
	}
	.option{
		display: flex;
		box-shadow:0px -1rpx 0px 0px rgba(223,227,230,1);
		background-color: #ffffff;
		>view{
			flex: 1;
			text-align: center;
			font-size: 30rpx;
			line-height: 90rpx;
			color: #808080;
		}
		.active{
			color: var(--theme);
			position: relative;
		}
		.active::after{
			position: absolute;
			content: '';
			width:64rpx;
			height:2rpx;
			background-color: var(--theme);
			bottom: 0;
			left: 50%;
			margin-left: -32rpx;
		}
	}
	.list-box{
		padding: 0 30rpx;
		box-sizing: border-box;
		background-color: #ffffff;
		.list-item{
			border-bottom: 1rpx solid #ECECEC;
			height: 148rpx;
			padding: 30rpx 0;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.font-26{
				color: #999999;
			}
		}
	}
	.top-oper{width: 710rpx;height: 164rpx;margin: 20rpx auto;border-radius: 12rpx;background: white;}
	.top-oper .con-oper{flex: 1;font-size: 26rpx;color: #666666;text-align: center;}
	.top-oper .con-oper .oper-icon{width: 64rpx;height: 64rpx;margin: 0 auto 4rpx;display: block;}
	.no-more {
		color: #999999;
		height: 80rpx;
		text-align: center;
		line-height: 80rpx;
		font-size: 26rpx;
		background-color: #F7F7F7;
	}
</style>

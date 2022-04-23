<template>
	<view>
		<view class="header-input-input" @tap="to_search">
			<image src="/static/input_search.png" mode="" />
			<view class="font-26">搜索商品名称</view>
		</view>
		<view class="confition">
			<view :class="[confition[0].active?'active':'']" @tap="to_active(0)">综合</view>
			<view :class="[confition[1].active?'active':'']" @tap="to_active(1)">销量</view>
			<view :class="[confition[2].active?'active':'' ,price]" @tap="to_active(2)">价格</view>
			<view :class="[confition[3].active?'active':'']" @tap="to_active(3)">新品</view>
		</view>
		<good-list v-model="list"></good-list>
		<no-more v-model="have"></no-more>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				confition:[
					{
						active:true,
					},
					{
						active:false,
					},
					{
						active:false,
					},
					{
						active:false,
					}
				],
				list:[
					{
						image:'/static/good.png',
						title:'华为nova6钢化膜6se手机膜全屏覆盖5g版防窥膜华为nova6钢化膜6se手机膜全屏覆盖5g版防窥膜',
						price:"59.00",
						old_price:'2000',
						is_pay:200
					}
				],
				price:'',
				have:true,
				active_index:0
			};
		},
		methods:{
			to_active(index){
				if(index===2){
					this.price=this.price==='rice'?'drop':'rice';
					this.active_index=index;
				}else{
					this.price='';
					if(index===this.active_index){
						return
					}
				}
				this.confition.forEach(el=>{
					el.active=false;
				})
				this.confition[index].active=true;
				this.active_index=index;
			},
			to_search(){
				uni.navigateTo({
					url: "/index/search/search"
				});
			},
		}
	}
</script>

<style lang="scss">
	.header-input-input{
		margin-top: 14rpx;
		margin-bottom: 14rpx;
	}
	.confition{
		height:90rpx;
		background:rgba(255,255,255,1);
		box-shadow:0px 1px 0px 0px rgba(223,227,230,1);
		display: flex;
		font-size: 32rpx;
		>view{
			flex: 1;
			text-align: center;
			line-height: 90rpx;
			color: #474F59;
		}
		.active{
			color: #F41613;
		}
		.rice{
			position: relative;
		}
		.rice::after{
			content: "";
			position: absolute;
			background-image: url(../../static/rice.png);
			background-repeat: no-repeat;
			background-size: 100%;
			height: 12rpx;
			width: 8rpx;
			margin-left: 10rpx;
			top: 50%;
			margin-top: -6rpx;
		}
		.drop{
			position: relative;
		}
		.drop::after{
			content: '';
			position: absolute;
			background-image: url(../../static/drop.png);
			background-repeat: no-repeat;
			background-size: 100%;
			height: 12rpx;
			width: 8rpx;
			margin-left: 10rpx;
			top: 50%;
			margin-top: -6rpx;
		}
	}
</style>

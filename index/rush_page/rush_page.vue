<template>
	<view>
		<view class="timeline">
			<view
				v-for="(item,index) in time_list" 
				:key="index"
				@tap="to_active(item,index)"
				:class="[item.active?'active':'','time-item']">
				<view class="font-40">{{item.font}}</view>
				<view class="font-24">{{item.label}}</view>
			</view>
		</view>
		<view class="countdown">
			<view class="font-28">抢购中 抢先下单先得哦</view>
			<view>
				<view class="bold font-28">{{buy_text}}</view>
				<view class="time-item font-22">
					<view class="time">{{time.hour}}</view>
					<view class="maohao font-28">:</view>
					<view class="time">{{time.min}}</view>
					<view class="maohao font-28">:</view>
					<view class="time">{{time.sec}}</view>
				</view>
			</view>
		</view>
		<view class="list" v-for="(item,index) in time_list[time_active].list" :key="index" @tap="to_detail(item)">
			<view class="list-item">
				<image :src="$image+item.original_img" mode="" />
				<view class="content">
					<view class="title font-30">
						{{item.goods_name}}
					</view>
					<view class="progress-box">
						<view class="progress">
							<view class="progress-now" :style="{width:`${item.buy_num/item.goods_num*100}%`}"></view>
							<view class="text font-20">{{item.buy_num/item.goods_num*100}}%</view>
						</view>
						<view class="font-20">已售{{item.buy_num}}件</view>
					</view>
					<view class="price-buttom">
						<view>
							<view class="inline bold" style="color:#F41613">
								<view class="inline font-26">￥</view>
								<view class="inline font-40">{{item.spec_goods_price.price}}</view>
							</view>
							<view class="inline old-price font-24">￥{{item.market_price}}</view>
						</view>
						<view :class="[item.start?'':'await','buttom font-28']">{{item.start?'马上抢':'等待抢购'}}</view>
					</view>
				</view>
			</view>
		</view>
		<no-more v-model="time_list[time_active].have" @more="more(time_list[time_active])" v-if="time_list[time_active].list.length>0"></no-more>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				time_list:[
					{
						list:[],
						have:true
					}
				],
				time_active:0,
				time:{
					hour:'00',
					min:'00',
					sec:'00',
				},
				end_time:0,
				timer:null,
				buy_text:''
			}
		},
		mounted(){
			this.get_activity();
		},
		methods: {
			get_activity(){
				this.$http('get|api/Activity/flash_sale_list',).then(res=>{
					this.time_list=res.result.map(row=>{
						let nowtime=new Date().getTime()/1000;
						if(row.start_time<nowtime&&row.end_time>nowtime){
							row.label='抢购中'
							row.active=true;
						}else{
							row.active=false
							row.label='即将开始'
						}
						row.list=[];
						row.have=true;
						row.page=1;
						return row
					})
					if(this.time_list.length>0){
						this.get_list(this.time_list[0])
					}
				})
			},
			get_list(item,bool){
				this.$http('get|api/Activity/ajax_flash_sale',{
					p:item.page,
					start_time:item.start_time,
					end_time:item.end_time
				}).then(res=>{
					clearTimeout(this.timer);
					let start=false;
					if(new Date(item.start_time*1000)>new Date()){
						this.buy_text='距开始'
						start=false;
					}else{
						this.buy_text='距结束'
						start=true;
					}
					this.end_time=new Date(item.end_time*1000)-new Date().getTime()
					this.setTime();
					if(bool){
						item.list=[];
					}
					if(res.result.flash_sale_goods.length===0){
						item.have=false
					}else{
						item.list=[...item.list,...res.result.flash_sale_goods.map(row=>{
							row.start=start
							return row
						})]
					}
				})
			},
			more(item){
				item.page++;
				this.get_list(item);
			},
			to_detail(item){
				uni.navigateTo({
					url: `/index/good_detail/good_detail?id=${item.goods_id}&item_id=${item.item_id}`
				});
			},
			setTime(){
				this.timer=setTimeout(() => {
					if(this.end_time<=0){
						clearTimeout(this.timer)
					}else{
						this.end_time-=1000;
						this.setTime();
					}
				}, 1000);
			},
			to_active(item,index){
				this.time_list.forEach(el=>{
					el.active=false
				})
				item.active=true;
				this.time_active=index;
				item.have=true;
				item.page=1;
				this.get_list(item,true);
			}
		},
		watch:{
			end_time(val){
				let _time=val;
				if(_time>0){
					var hour = Math.floor(_time % (3600 * 1e3 * 24) / (1e3 * 60 * 60));//相差小时
					var min = Math.floor(_time % (3600 * 1e3) / (1000 * 60));//相差分钟
					var sec = Math.floor(_time % (3600 * 1e3) % (1000 * 60) / 1000);
					if (hour < 10) { hour = "0" + hour }
					if (min < 10) { min = "0" + min }
					if (sec < 10) { sec = "0" + sec }
					this.time={
						hour,
						min,
						sec
					}
				}else{
					this.time={
						hour:'00',
						min:'00',
						sec:'00',
					}
				}
			}
		}
	}
</script>

<style lang="scss">
	.timeline{
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: start;
		align-items: flex-start;
		height: 100rpx;
		.time-item{
			height: 100rpx;
			width: 20%;
			float: left;
			text-align: center;
			background-color: #333333;
			color: #ffffff;
			padding-top: 6rpx;
			box-sizing: border-box;
			position: relative;
		}
		.time-item::before{
			position: absolute;
			display: block;
			content: '';
			background-color:#F7F7F7;
			height: 20rpx;
			bottom: -20rpx;
			width: 100%;
		}
		.active{
			background-color: var(--theme);
			position: relative;
		}
		.active::after{
			position: absolute;
			content: '';
			border: 10rpx solid var(--theme);
			border-right-color: transparent;
			border-bottom-color: transparent;
			border-left-color: transparent;
			bottom: -20rpx;
			left: 50%;
			margin-left: -10rpx;
		}
	}
	.timeline::after{
		display: block;
		clear: both;
		content: '';
	}
	.countdown{
		margin-top: 10rpx;
		height:90rpx;
		background:rgba(255,255,255,1);
		box-shadow:0px 1rpx 0px 0px rgba(221,221,221,1);
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 30rpx;
		box-sizing: border-box;
		>view{
			display: flex;
			.bold{
				margin-right:22rpx ;
			}
			.time-item{
				display: flex;
				align-items: center;
				>.time{
				width:32rpx;
				text-align: center;
				height:32rpx;
				background-color: #666666;
				border-radius:4rpx;
				color: #ffffff;
				}
				.maohao{
					margin: 0 6rpx;
				}
			}
		}
	}
	.list{
		padding: 0 30rpx;
		box-sizing: border-box;
		margin-top: 2rpx;
		.list-item{
			width:100%;
			height:300rpx;
			background:rgba(255,255,255,1);
			box-shadow:0px 1rpx 0px 0px rgba(221,221,221,1);
			padding: 30rpx 0;
			box-sizing: border-box;
			display: flex;
			image{
				height: 240rpx;
				width: 240rpx;
			}
			.content{
				flex: 1;
				padding-left: 20rpx;
				box-sizing: border-box;
				.title{
					line-height: 42rpx;
					 overflow: hidden;
					text-overflow:ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}
				.progress-box{
					margin-top: 28rpx;
					display: flex;
					align-items: center;
					.progress{
						width:260rpx;
						height:24rpx;
						position: relative;
						background: linear-gradient(45deg,#A4B6FF 33%,#8198FA 34%,#8198FA 59%,#A4B6FF 60%);
						background-size: 42rpx 24rpx;
						animation: move 5s linear infinite;
						border-radius: 12rpx;
						.text{
							position: absolute;
							width: 100%;
							text-align: center;
							color: #ffffff;
							margin-top: -4rpx;
						}
					}
					.progress-now{
						height: 100%;
						position:absolute;
						border-radius: 20rpx;
						background-color: var(--theme);
					}
					>.font-20{
						margin-left: 18rpx;
						color: #999999;
					}
				}
				.price-buttom{
					margin-top: 40rpx;
					display: flex;
					justify-content: space-between;
					align-items:flex-end;
					.old-price{
						color: #cccccc;
						position: relative;
					}
					.old-price::after{
						content: '';
						width: 100%;
						height: 2rpx;
						background-color: #cccccc;
						position: absolute;
						top: 50%;
						left: 5rpx;
					}
					.buttom{
						width:144rpx;
						height:60rpx;
						background:var(--theme);
						border-radius:10rpx;
						text-align: center;
						line-height: 60rpx;
						color: #ffffff;
					}
				}
			}
		}
	}
	.await{
		background:rgba(98,197,40,1)!important;
	}
	@keyframes move{
		from{
			background-position-x: 0rpx;
		}
		to{
			background-position-x: 250rpx;
		}
	}
</style>

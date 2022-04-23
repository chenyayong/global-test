<template>
	<view>
		<view class="option">
			<view 
				@tap="to_active(item,index)"
				v-for="(item,index) in option" 
				:key="index" 
				:class="[item.active?'active':'']">
				{{item.label}}
			</view>
		</view>
		<view v-if="option[active].list.length>0">
			<view 
				v-for="(item,index) in option[active].list" 
				:key="index"
				class="list-item">
				<view class="item-title font-28" @tap="to_detail(item)">
					<view class="num-box">
						<image v-if="item.buy_user_id" src="/static/baodan.png"></image>
						<text>订单编号:{{item.order_sn}}</text>
					</view>
					<view v-if="item.order_status_desc==='已取消'" style="color:#999999">{{item.order_status_desc}}</view>
					<view v-else-if="item.order_status_desc==='待发货'" style="color:#F41613">{{item.order_status_desc}}</view>
					<view v-else-if="item.order_status_desc==='待支付'" style="color:#F41613">{{item.order_status_desc}}</view>
					<view v-else>{{item.order_status_desc}}</view>
				</view>
				<view class="item-content"  @tap="to_detail(item)">
					<template v-for="(ite,ind) in item.goods_list">
						<view :key="ind" class="item-list">
							<image :src="$image+ite.original_img" mode=""/>
							<view>
								<view class="good-title">
									<view class="title font-28 ellipsis-two">{{ite.goods_name}}</view>
									<view class="font-32">x{{ite.goods_num}}</view>
								</view>
								<view class="spec-key font-26 ellipsis-two">
									{{ite.spec_key_name}}
								</view>
								<view class="font-32 flex">
									<view>￥{{ite.member_goods_price}}</view>
									<view class="evaluation font-28" v-if="item.comment_btn===1" @tap.stop="add_comment(ite,item)">评价</view>
								</view>
							</view>
						</view>
					</template>
				</view>
				<view class="order-price font-28"  @tap="to_detail(item)">
					<view>共{{item.goods_list.length}}件商品</view>
					<view>
						运费：￥{{item.shipping_price}}
					</view>
					<view>
						总价：￥{{item.total_amount}}
					</view>
 				</view>
				<view class="option-buttom font-30">
					<!-- <view class="option-1" v-if="item.cancel_btn==1&&item.pay_status!=1" @tap="cancel(item)">取消订单</view> -->
					<view class="option-1" v-if="item.cancel_btn==1&&item.pay_status==1&&item.order_prom_type==0" @tap="cancel_pay(item)">
						取消订单
						<!-- 已支付 -->
					</view>
					<view class="option-1" v-if="item.shipping_btn==1" @tap="to_invoice(item)">查看物流</view>
					<view class="option-1" v-if="item.receive_btn==1" @tap="server_img=true">联系客服</view>
					<view class="option-2" v-if="item.pay_btn==1 && item.pay_code!='offline_pay' && item.pay_doc_status==0" @tap="to_pay(item)">立即付款</view>
					<view class="option-2" v-if="item.remind_btn==1" @tap="remind(item)">提醒发货</view>
					<view class="option-2" v-if="item.commission_btn==1" @tap="showCom(item)">确认分发</view>
					<view class="option-2" v-if="item.receive_btn==1" @tap="isConfirm(item)">确认收货</view>
				</view>
			</view>
			<!-- <no-more v-model="option[active].have" @more="more(option[active])"></no-more> -->
			<view v-if="!option[active].have" class="no-more">我是有底线的</view>
		</view>
		<no-data v-else></no-data>
		<server-img v-model="server_img"></server-img>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				option:[
					{
						label:'全部',
						value:'',
						active:true,
						list:[],
						page:1,
						have:true
					},
					{
						label:'待付款',
						value:'WAITPAY',
						active:false,
						list:[],
						page:1,
						have:true
					},
					{
						label:'待发货',
						value:'WAITSEND',
						active:false,
						list:[],
						page:1,
						have:true
					},
					{
						label:'待收货',
						value:'WAITRECEIVE',
						active:false,
						list:[],
						page:1,
						have:true
					},
					{
						label:'待评价',
						value:'WAITCCOMMENT',
						active:false,
						list:[],
						page:1,
						have:true
					}
				],
				active:0,
				server_img:false
			}
		},
		onLoad(val){
			if(val.type){
				let find=this.option.findIndex(row=>row.value===val.type);
				this.option.forEach(el=>{
					el.active=false;
				})
				this.option[find].active=true;
				this.active=find;
			}
		},
		onShow(){
			this.get_list(this.option[this.active],true)
		},
		methods: {
			showCom(item){
				uni.showModal({
					title: '提示',
					content: '是否确认分发？',
					success: re=> {
						if (re.confirm) {
							uni.showLoading({
								mask:true
							})
							this.$http("post|api/Order/exec_commission",{
								order_id:item.order_id
							}).then(res=>{
								uni.hideLoading()
								this.$toastApp(res.msg);
								setTimeout(() => {
									this.to_active(this.option[this.active],this.active)
								},300);
							}).catch(e =>{
								uni.hideLoading()
								this.$toastApp(e.msg);
							})
						}
					}
				});
			},
			to_active(item,index){
				this.option.forEach(el=>{
					el.active=false;
				})
				this.active=index;
				item.active=true;
				item.page=1;
				item.have=true;
				this.get_list(item,true)
			},
			get_list(item,bool){
				// console.log(item);
				this.$http('get|api/Order/order_list',{
					type:item.value,
					p:item.page
				}).then(res=>{
					// console.log(res);
					if(bool){
						item.list=[];
					}
					if(res.result.lists.length===0){
						item.have=false;
						return
					}
					item.list=[...item.list,...res.result.lists]
				})
			},
			cancel(item){
				uni.showModal({
					title: '提示',
					content: '确认取消订单？',
					success: re=> {
						if (re.confirm) {
							this.$http("post|api/Order/cancel_order",{
								order_id:item.order_id
							}).then(res=>{
								this.$toastApp(res.msg);
								setTimeout(() => {
									this.to_active(this.option[this.active],this.active)
								},1000);
							})
						} else if (re.cancel) {
							this.$toastApp('取消操作');
						}
					}
				});
			},
			cancel_pay(item){
				uni.navigateTo({
					url: `/shop_card/order_detail/order_detail?id=${item.order_id}&do=cancel_pay`
				});
			},
			to_pay(item){
				uni.navigateTo({
					url: `/shop_card/order_detail/order_detail?id=${item.order_id}&do=to_pay`
				});
			},
			to_invoice(item){
				uni.navigateTo({
					url: `/shop_card/invoice/invoice?id=${item.order_id}&invoice_no=${item.invoice_no}&code=${item.shipping_name}`
				});
			},
			add_comment(good,order){
				uni.navigateTo({
					url: `/shop_card/evaluation/evaluation?rec_id=${good.rec_id}&goods_id=${good.goods_id}&order_id=${order.order_id}`
				});
			},
			remind(item){
				this.$http('get|api/Order/remind_order',{
					order_id:item.order_id
				}).then(res=>{
					this.$toastApp(res.msg)
				}).catch(e=>{
					this.$toastApp(e.msg)
				})
			},
			isConfirm(item){
				uni.showModal({
					title:'提示',
					content:'确认是否已收到商品',
					success: (res) => {
						if (res.confirm) {
							this.order_confirm(item)
						}
					}
				})
			},
			order_confirm(item){
				this.$http('get|api/Order/order_confirm',{
					order_id:item.order_id
				}).then(res=>{
					this.$toastApp(res.msg);
					setTimeout(()=>{
						this.get_list(this.option[this.active],true)
					},2000)
				}).catch(e=>{
					this.$toastApp(e.msg);
				})
			},
			to_detail(item){
				uni.navigateTo({
					url: `/shop_card/order_detail/order_detail?id=${item.order_id}`
				});
			},
			more(item){
				item.page+=1;
				this.get_list(item);
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
page{
	background-color: #f7f7f7;
}
	.option{
		display: flex;
		background-color: #ffffff;
		position: sticky;
		// #ifdef H5
		top: 88rpx;
		// #endif
		z-index: 99;
		>view{
			flex: 1;
			text-align: center;
			font-size: 30rpx;
			line-height: 90rpx;
			color: #333333;
		}
		.active{
			color: var(--theme);
			position: relative;
		}
		.active::after{
			position: absolute;
			content: '';
			width:46rpx;
			height:4rpx;
			background-color: var(--theme);
			bottom: 0;
			left: 50%;
			margin-left: -23rpx;
		}
	}
	.list-item{
		margin-top: 20rpx;
		background-color: #ffffff;
		.item-title{
			height: 80rpx;
			padding: 0 30rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.num-box{
				display: flex;
				align-items: center;
				image{
					width: 48rpx;
					height: 36rpx;
					margin-right: 20rpx;
				}
			}
		}
		.item-content{
			padding: 20rpx 30rpx;
			box-sizing: border-box;
			box-shadow:0px -2rpx 0px 0px rgba(223,227,230,1);
			border-bottom: 1rpx solid rgba(223,227,230,1);
			image{
				height:200rpx;
				width: 200rpx;
			}
			.item-list{
				display: flex;
				margin-top: 20rpx;
				>view{
					flex: 1;
					padding-left: 20rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					.good-title{
						display: flex;
						justify-content: space-between;
						align-items: flex-start;
						.title{
							max-width: 380rpx;
						}
					}
					.flex{
						display: flex;
						justify-content: space-between;
						align-items: center;
					}
					.spec-key{
						color: #999999;
					}
				}
				.evaluation{
					width:108rpx;
					height:52rpx;
					border-radius:8rpx;
					border:1rpx solid var(--theme);
					line-height: 52rpx;
					text-align: center;
					color: var(--theme);
					box-sizing: border-box;
				}
			}
			.item-list:first-child{
				margin-top: 0;
			}
		}
		.order-price{
			height: 80rpx;
			width: 690rpx;
			margin: 0 auto;
			box-shadow:0px 2rpx 0px 0px rgba(223,227,230,1);
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
		.option-buttom{
			display: flex;
			justify-content: flex-end;
			box-sizing: border-box;
			align-items: center;
			padding: 20rpx 0rpx 20rpx 30rpx;
			view{
				width:172rpx;
				height:60rpx;
				border-radius:8rpx;
				border:1px solid rgba(180,180,180,1);
				line-height: 60rpx;
				text-align: center;
				box-sizing: border-box;
				margin-right: 30rpx;
			}
			.option-2{
				background-color: var(--theme);
				color: #ffffff;
				border: none;
			}
		}
	}
	.no-more {
		color: #999999;
		height: 80rpx;
		text-align: center;
		line-height: 80rpx;
		font-size: 26rpx;
		background-color: #F7F7F7;
	}
</style>

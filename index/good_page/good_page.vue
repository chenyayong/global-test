<template>
	<view>
		<view class="header-input-input" @tap="to_search">
			<image src="/static/input_search.png" mode="" />
			<view class="font-26">{{good}}</view>
		</view>
		<view class="confition">
			<view :class="[confition[0].active?'active':'']" @tap="to_active(0)">综合</view>
			<view :class="[confition[1].active?'active':'',sales]" @tap="to_active(1)">销量</view>
			<view :class="[confition[2].active?'active':'' ,price]" @tap="to_active(2)">价格</view>
			<view :class="[confition[3].active?'active':'']" @tap="to_active(3)">新品</view>
		</view>
		<good-list v-model="list" @to_detail="to_detail"></good-list>
		<!-- <no-more v-model="have" @more="more"></no-more> -->
		<view v-if="!have" class="no-more">我是有底线的</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				confition:[
					{
						active:true,
						value:'comment_count',
						label:"综合"
					},
					{
						active:false,
						value:'sales_sum',
						label:"销量",
						sort_asc:'desc',
					},
					{
						active:false,
						value:'shop_price',
						label:"价格",
						sort_asc:'desc',
					},
					{
						active:false,
						value:'is_new',
						label:"新品"
					}
				],
				list:[],
				price:'',
				sales:'',
				have:true,
				active_index:0,
				good:"",
				page:1,
				cat_id:""
			};
		},
		onLoad({cat_id,title}){
			// this.good="华为手机膜"
			// uni.setNavigationBarTitle({
			// 	title: '华为手机膜'
			// });
			this.init(cat_id,1);
			this.cat_id=cat_id;
		},
		methods:{
			init(id,p,bol=false){
				// sort sales_sum 销量；shop_price 价格；comment_count 综合
				let sort = this.confition.findIndex(ro=>ro.active)
				this.$http("post|api/Goods/goodsList",{
					cat_id:id,
					p,
					sort:this.confition[sort].value,
					is_new:this.confition[sort].value==='is_new'?1:0,
					sort_asc:this.confition[sort].sort_asc||'asc'
				}).then(res=>{
					this.good=res.result.goods_category.mobile_name;
					uni.setNavigationBarTitle({
						title:res.result.goods_category.mobile_name
					});
					if(res.result.goods_list.length===0){
						this.have=false
					}else{
						if(bol){
							this.list=[];
						}
						this.list=[...this.list,...res.result.goods_list]
						this.have=true;
					}
				})
			},
			more(){
				this.init(this.cat_id,this.page+=1)
			},
			to_active(index){
				if(index===1){
					this.sales=this.sales==='rice'?'drop':'rice';
					this.confition[1].sort_asc=this.sales==='rice'?'asc':'desc'
					this.active_index=index;
				}else{
					this.sales='';
				}
				if(index===2){
					this.price=this.price==='rice'?'drop':'rice';
					this.confition[2].sort_asc=this.sales==='rice'?'asc':'desc'
					this.active_index=index;
				}else{
					this.price='';
				}
				this.confition.forEach(el=>{
					el.active=false;
				})
				this.confition[index].active=true;
				this.active_index=index;
				this.init(this.cat_id,1,true);
			},
			to_search(){
				uni.navigateTo({
					url: "/index/search/search"
				});
			},
			to_detail(){

			}
		},
		onReachBottom() {
			uni.showLoading({
				title: '加载中...'
			})
			this.more()
		}
	}
</script>

<style lang="scss">
	.header-input-input{
		margin-top: 14rpx;
		margin-bottom: 14rpx;
		.font-26{
			color: #343434;
		}
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
	.no-more {
		color: #999999;
		height: 80rpx;
		text-align: center;
		line-height: 80rpx;
		font-size: 26rpx;
		background-color: #F7F7F7;
	}
</style>

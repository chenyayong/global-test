<template>
	<view class="user-reviews">
		<view class="header">
			<view :class="[tab[0].active?'active':'','font-28']" @tap="to_active(tab[0],0)">全部（{{all}}）</view>
			<view :class="[tab[1].active?'active':'','font-28']" @tap="to_active(tab[1],1)">有图（{{have_img}}）</view>
		</view>
		<evaluation-item class="item" :item="item" v-for="(item,index) in tab[tab_active].list" :key="index"></evaluation-item>
		<!-- <no-more v-model="tab[tab_active].have" @more="more(tab[tab_active])"></no-more> -->
		<view v-if="tab[tab_active].list.length>0">
			<view v-if="!tab[tab_active].have" class="no-more">我是有底线的</view>
		</view>
	</view>
</template>

<script>
import evaluationItem from '../components/evaluation_item.vue'
	export default {
		data() {
			return {
				tab:[
					{
						active:true,
						value:'1',
						page:1,
						have:true,
						list:[]
					},
					{
						active:false,
						value:'5',
						page:1,
						have:true,
						list:[]
					},
				],
				tab_active:0,
				all:0,
				have_img:0,
			}
		},
		onLoad({goods_id}){
			this.goods_id=goods_id;
			let item=this.tab[0]
			this.$http("get|api/Goods/ajaxComment",{
				goods_id:this.goods_id,
				commentType:item.value,
				p:item.page
			}).then(res=>{
				if(res.result.commentlist.length==0){
					item.have=false;
					return
				}
				item.list=[...item.list,...res.result.commentlist];
				this.all=res.result.count;
				this.have_img=res.result.count1;
			})
		},
		methods: {
			to_active(item,index){
				this.tab.forEach(el=>{
					el.active=false
				})
				item.active=true;
				this.tab_active=index;
				item.page=1;
				this.get_list(item,true);
			},
			get_list(item,bool){
				this.$http("get|api/Goods/ajaxComment",{
					goods_id:this.goods_id,
					commentType:item.value,
					p:item.page
				}).then(res=>{
					if(res.result.commentlist.length==0){
						item.have=false;
						return
					}
					if(bool){
						item.list=[]
					}
					item.list=[...item.list,...res.result.commentlist];
					// this.all=res.result.count;
					// this.have_img=res.result.count1;
				})
			},
			more(item){
				item.page+=1;
				this.get_list(item);
			}
		},
		components:{
			evaluationItem
		},
		onReachBottom() {
			uni.showLoading({
				title: '加载中...'
			})
			this.more(this.tab[this.tab_active])
		}
	}
</script>

<style lang='scss'>
	.user-reviews{
		background-color: #F7F7F7;
		min-height: 100vh;
		// #ifdef H5
		min-height: calc( 100vh - 88rpx);
		// #endif
		box-sizing: border-box;
		padding-top: 30rpx;
		.header{
			height:60rpx;
			margin:0 auto 30rpx auto;
			border:2rpx solid rgba(151,151,151,1);
			width: 440rpx;
			border-radius:8rpx;
			display: flex;
			>view{
				flex: 1;
				text-align: center;
				line-height: 60rpx;
			}
			.active{
				color: #ffffff;
				background-color: var(--theme);
			}
		}
		.item{
			margin-top: 2rpx;
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

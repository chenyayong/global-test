<template>
	<view>
		<swiper 
			class="swiper" 
			:indicator-dots="true" 
			:autoplay="true" 
			indicator-color="rgba(255,255,255,0.3)"
			indicator-active-color="rgb(255,255,255)"
			:interval="5000" 
			:duration="1000">
			<swiper-item v-for="(item,index) in banner"  :key="index" @tap="to_page(item)">
				<image :src="$image+item.ad_code" mode="" />
			</swiper-item>
		</swiper>
		<view class="option">
			<view>
				<view 
					:class="[item.active?'active':'','option-item font-28']" 
					v-for="(item,index) in goods_category" 
					:key="index"
					@tap="to_active(item,index)">
					{{item.mobile_name}}
				</view>
			</view>
		</view>
		<view class="list">
			<view 
				class="list-item" 
				v-for="(item,index) in goods_category[active_option].list" 
				:key="index">
				<image :src="$image+item.original_img" mode=""/>
				<view class="ellipsis-two font-30">
					{{item.goods_name}}
				</view>
				<view>
					<view class="inline font-40 price">
						￥{{item.price}}
					</view>
					<view class="is-old-price inline font-24">
						￥{{item.goods_price}}
					</view>
				</view>
				<view class="c9 font-24">
					已团{{item.virtual_num}}单
				</view>
				<view class="buttom font-28">
					去团购
				</view>
			</view>
		</view>
		<no-more v-model="goods_category[active_option].have" v-if="goods_category[active_option].list.length>0" @more="more(goods_category[active_option])"></no-more>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				banner:[],
				goods_category:[
					{list:[]}
				],
				active_option:0
			}
		},
		mounted(){
			this.$http('get|api/Activity/group_list').then(res=>{
				this.banner=res.result.banner;
				this.goods_category=res.result.goods_category.map(row=>{
					row.active=false;
					row.page=1;
					row.list=[];
					row.have=true;
					return row
				})
				this.goods_category[0].active=true;
				this.get_list(this.goods_category[0])
			})
		},
		methods: {
			get_list(item,bool){
				this.$http('get|api/Activity/group_list',{
					p:item.page,
					id:item.id
				}).then(res=>{
					if(res.result.list.length===0){
						item.have=false;
						return;
					}
					if(bool){
						item.list=[]
					}
					item.list=[...item.list,...res.result.list];
				})
			},
			more(item){
				item.page++;
				this.get_list(item)
			},
			to_active(item,index){
				this.goods_category.forEach(el=>{
					el.active=false
				})
				item.active=true;
				item.page=1;
				item.have=true;
				this.active_option=index
				this.get_list(item,true)
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #f7f7f7;
	}
	.swiper{
		height: 320rpx;
		margin:  0 auto;
		overflow: hidden;
		image{
			height: 100%;
			width: 100%;
		}
	}
	.option{
		height: 90rpx;
		width: 100%;
		overflow-x: scroll;
		background-color: #ffffff;
		margin-top: 20rpx;
		box-shadow:0px 1rpx 0px 0px rgba(223,227,230,1);
		>view{
			height: 100%;
			display: flex;
			flex-wrap: nowrap;
			.option-item{
				white-space: nowrap;
				padding:0 25rpx;
				line-height: 90rpx;
			}
			.active{
				color: var(--theme);
				position: relative;
			}
			.active::after{
				width: 96rpx;
				height: 6rpx;
				position: absolute;
				content: '';
				bottom: 0;
				left: 50%;
				margin-left: -48rpx;
				background-color: var(--theme);
				border-radius:200rpx;
			}
		}
	}
	.list{
		padding-left: 26rpx;
		box-sizing: border-box;
		>view{
			float: left;
			margin-right: 26rpx;
			width: 336rpx;
			margin-top: 26rpx;
			image{
				height: 336rpx;
				width: 336rpx;
			}
			.price{
				color: #F41613;
			}
			.is-old-price{
				margin-left: 10rpx;
			}
			.c9{
				color: #999999;
			}
			.buttom{
				width:324rpx;
				height:68rpx;
				background:var(--theme);
				border-radius:4rpx;
				color: #ffffff;
				line-height: 68rpx;
				text-align: center;
				margin-top: 16rpx;
			}
		}
	}
	.list::after{
		clear: both;
		content: '';
		display: block;
	}
</style>

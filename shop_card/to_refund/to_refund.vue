<template>
	<view>
		<view class="title font-30">
			退款商品
		</view>
		<view class="order-good">
			<view  class="order-item">
				<image :src="$image+order_goods.original_img" mode="" />
				<view class="good-item">
					<view class="flex">
						<view class="ellipsis-two font-28">{{order_goods.goods_name}}</view>
						<view class="font-34">X{{order_goods.goods_num}}</view>
					</view>
					<view class="font-26">
						{{order_goods.spec_key_name}}
					</view>
					<view class="flex flex2">
						<view class="font-32">
							￥{{order_goods.member_goods_price}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="type">
			<view class="font-30">
				退款类型
			</view>
			<view class="type-list">
				<view 
					v-for="(item,index) in type" 
					:key="index" 
					@tap="to_active(item)"
					:class="[item.active?'active':'','font-28']">
					{{item.label}}
				</view>
			</view>
		</view>
		<view class="from">
			<view class="font-30">
				退款原因
			</view>
			<picker :range="note" @change="change">
				<view class="from-item font-30 yuanyin more" :style="{color:reason=='请选择退款原因'?'#999999':'#333333'}">
				{{reason}}
			</view>
			</picker>
			<view class="from-item font-30">
				退款金额
			</view>
			<view class="from-item font-30 jine">
				￥{{order_goods.member_goods_price}}
			</view>
			<view class="from-item font-30">
				退款说明（选填）
			</view>
			<textarea :maxlength="100" v-model="describe" class="from-item font-30 shuoming" cols="30" rows="10" placeholder="请填写退款描述（限100字内）"></textarea>
		</view>
		<view class="updata-img">
			<view class="font-30">
				上传凭证（选填）
			</view>
			<view  v-for="(item,index) in imgs" :key="index" class="image-box inline">
				<image :src="$image+item" mode="" />
				<image src="/static/clear.png" @tap="remove(index)" class="clear" mode="" />
			</view>
			<image :src="src" mode="" @tap="choose_img" v-if="imgs.length<3"/>
			<view class="font-24">
				最多三张，支持jpg，jepg，png格式
			</view>
		</view>
		<view class="bottom font-30" @tap="submit">
			提交申请
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				src:'/static/update_image.png',
				id:'',
				order_goods:{},
				type:[
					{
						label:'退货',
						active:true,
						value:0
					},
					{
						label:'换货',
						active:false,
						value:1
					}
				],
				note:[],
				imgs:[],
				reason:'请选择退款原因',
				describe:''
			}
		},
		onLoad({id}){
			this.id=+id;
			this.$http('get|api/Order/return_goods',{
				rec_id:+id
			}).then(res=>{
				this.order_goods=res.result.order_goods;
				this.note=res.result.note;
			})
		},
		methods: {
			submit(){
				if(this.reason==='请选择退款原因'){
					this.$toastApp('请选择退款原因');
					return
				}
				uni.showModal({
					title: '提示',
					content: '是否确认退款',
					success: (res) => {
						if (res.confirm) {
							let data={
								rec_id:this.id,
								type:this.type.find(row=>row.active).value,
								goods_num:this.order_goods.goods_num,
								imgs:this.imgs.join(','),
								reason:this.reason,
								describe:this.describe
							}
							console.log(data);
							// #ifndef H5
							// #endif
							uni.showLoading()
							this.$http('post|api/Order/return_goods',data).then(res=>{
								this.$toastApp(res.msg);
								setTimeout(()=>{
									uni.navigateBack();
								},500)
							}).catch(e=>{
								this.$toastApp(e.msg)
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			to_active(item){
				this.type.forEach(el=>{
					el.active=false
				})
				item.active=true;
			},
			change(e){
				this.reason=this.note[e.target.value];
			},
			choose_img(){
				uni.chooseImage({
					sourceType:['compressed', 'original'],
					success:url=>{
						uni.showLoading({
							title:"上传中..."
						})
						uni.uploadFile({
							url: `${this.$serve}/api/Api/uploadReturnGoodsImg`,
							filePath: url.tempFilePaths[0],
							name: 'return_imgs',
							success: res => {
								res.data=JSON.parse(res.data);
								console.log(res.data.result);
								this.imgs.push(res.data.result);
								uni.hideLoading();
							}
						});
					}
				})
			},
			remove(index){
				this.imgs.splice(index,1);
			}
		}
	}
</script>

<style lang="scss">
page{
	background-color: #f7f7f7;
	padding-top: 20rpx;
}
	.title{
		padding-left: 30rpx;
		line-height: 90rpx;
		background-color: #ffffff;
		box-shadow:0px 1px 0px 0px rgba(223,227,230,1);
	}
	.order-good{
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		box-shadow:0px -1px 0px 0px rgba(223,227,230,1);
		background-color: #ffffff;
		image{
			height: 200rpx;
			width: 200rpx;
		}
		.order-item{
			display: flex;
			.good-item{
				flex: 1;
				padding-left: 20rpx;
				box-sizing: border-box;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				.flex{
					display: flex;
					justify-content: space-between;
					align-items: flex-start;
					.ellipsis-two{
						max-width: 380rpx;
					}
				}
				.font-26{
					color: #999999;
				}
			}
		}
	}
	.type{
		margin-top:20rpx;
		background-color: #ffffff;
		padding: 30rpx;
		padding-right: 0;
		box-sizing: border-box;
		.type-list::after{
			clear: both;
			content: '';
			display: block;
		}
		.font-28{
			line-height: 60rpx;
			border: 2rpx solid #C0C0C0;
			float: left;
			padding: 0 20rpx;
			border-radius:8rpx;
			margin-right: 30rpx;
			margin-top: 30rpx;
		}
		.active{
			color: var(--theme);
			border-color: var(--theme);
		}
	}
	.from{
		margin-top: 20rpx;
		background-color: #ffffff;
		padding: 30rpx;
		box-sizing: border-box;
		.from-item{
			margin-top: 26rpx;
		}
		.yuanyin{
			border:2rpx solid rgba(192,192,192,1);
			height: 90rpx;
			line-height: 90rpx;
			padding:0 20rpx;
			box-sizing: border-box;
		}
		.jine{
			border:2rpx solid rgba(192,192,192,1);
			height: 90rpx;
			line-height: 90rpx;
			padding:0 20rpx;
			box-sizing: border-box;
			color: #E82B22;
		}
		.shuoming{
			border:2rpx solid rgba(192,192,192,1);
			width: 100%;
			padding: 20rpx;
			box-sizing: border-box;
		}
		.more{
			position: relative;
		}
		.more::after{
			content: '';
			background-image: url(../../static/small_more.png);
			height: 24rpx;
			width: 14rpx;
			background-size: 100%;
			position: absolute;
			right: 30rpx;
			top: 50%;
			margin-top: -12rpx;
		}
	}
	.updata-img{
		margin-top: 20rpx;
		background-color: #ffffff;
		padding: 30rpx;
		box-sizing: border-box;
		image{
			height: 184rpx;
			width: 184rpx;
			margin-top: 24rpx;
			margin-right: 24rpx;
		}
		.image-box{
			position: relative;
		}
		.clear{
			top: -10rpx;
			right: -10rpx;
			height: 20rpx;
			width: 20rpx;
			position: absolute;
		}
		.font-24{
			color: #999999;
			margin-top: 26rpx;
		}
	}
	.bottom{
		height: 90rpx;
		line-height: 90rpx;
		text-align: center;
		background:var(--theme);
		color: #ffffff;
		margin-top: 60rpx;
	}
</style>

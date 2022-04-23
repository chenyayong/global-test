<template>
	<view>
		<view class="start">
			<image :src="$image+info.original_img" class="good" mode="" />
			<view class="right">
				<view 
					v-for="(item,index) in start" 
					:key="index" 
					@tap="to_active(index)"
					:class="[item.active?'active':'']">
				</view>
			</view>
		</view>
		<view class="content">
			<textarea v-model="content" class="font-30" cols="30" rows="10"></textarea>
			<view  v-for="(item,index) in img" :key="index" class="image-box inline">
				<image :src="$image+item" mode="" />
				<image src="/static/clear.png" @tap="remove(index)" class="clear" mode="" />
			</view>
			<image src="/static/update_image.png" class="add-img" mode="" @tap="choose_img" v-if="img.length<3"/>
		</view>
		<view class="hide">
			<view>
				<check-box v-model="hide_username"></check-box>
				<view class="font-30">
					匿名
				</view>
			</view>
			<view class="font-24">
				你写的评价会以匿名的形式展示
			</view>
		</view>
		<view class="bottom font-30" @tap="submit">
			提交
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				rec_id:'',
				goods_id:'',
				order_id:'',
				info:{},
				start:[
					{active:true},
					{active:false},
					{active:false},
					{active:false},
					{active:false},
				],
				content:'',
				img:[],
				hide_username:false
			}
		},
		onLoad({rec_id,goods_id,order_id}){
			this.rec_id=+rec_id;
			this.goods_id=+goods_id;
			this.order_id=+order_id;
			this.$http('get|api/Order/add_comment',{
				rec_id:this.rec_id,
				goods_id:this.goods_id,
				order_id:this.order_id
			}).then(res=>{
				this.info=res.result
			})
		},
		methods: {
			submit(){
				// #ifndef H5
				uni.showLoading()
				// #endif
				let goods_rank=this.start.findIndex(row=>!row.active);
				let data={
					rec_id:this.rec_id,
					goods_id:this.goods_id,
					order_id:this.order_id,
					hide_username:this.hide_username?1:0,
					goods_rank:goods_rank==-1?5:goods_rank,
					content:this.content,
					img:this.img
				}
				this.$http('post|api/Order/add_comment',data).then(res=>{
					this.$toastApp(res.msg);
					setTimeout(()=>{
						uni.navigateBack();
					},500);
				}).catch(e=>{
					this.$toastApp(e.msg)
				})
			},
			to_active(index){
				this.start.forEach(el=>{
					el.active=false;
				})
				for (let i = 0; i < index +1; i++) {
					this.start[i].active=true;
				}
			},
			choose_img(){
				uni.chooseImage({
					sourceType:['compressed', 'original'],
					success:url=>{
						uni.showLoading({
							title:"正在加载中"
						})
						uni.uploadFile({
							url: `${this.$serve}/api/Api/add_comment_img`,
							filePath: url.tempFilePaths[0],
							name: 'comment_img_file',
							success: res => {
								res.data=JSON.parse(res.data);
								this.img.push(res.data.result);
								uni.hideLoading();
							}
						});
					}
				})
			},
			remove(index){
				this.img.splice(index,1);
			}
		}
	}
</script>

<style lang="scss">
page{
	background-color: #f7f7f7;
	padding-top: 20rpx;
	box-sizing: border-box;
}
.start{
	height: 120rpx;
	padding: 20rpx 30rpx;
	box-sizing: border-box;
	background-color: #ffffff;
	display: flex;
	align-items: center;
	.good{
		height: 80rpx;
		width: 80rpx;
	}
	.right{
		margin-left: 30rpx;
		>view{
			height: 50rpx;
			width: 50rpx;
			background-image: url(../../static/start.png);
			background-size: 100%;
			float: left;
			margin-right: 20rpx;
		}
		.active{
			background-image: url(../../static/start_active.png);
		}
	}
	.right::after{
		clear: both;
		display: block;
		content: '';
	}
}
.content{
	margin-top: 2rpx;
	background-color: #ffffff;
	padding: 20rpx 30rpx;
	box-sizing: border-box;
	.image-box{
		position: relative;
		margin-right: 30rpx;
	}
	.clear{
		top: -10rpx;
		right: -10rpx;
		height: 20rpx;
		width: 20rpx;
		position: absolute;
	}
	image{
		height: 180rpx;
		width: 180rpx;
	}
}
.hide{
	height: 80rpx;
	padding: 0 30rpx;
	display: flex;
	align-items: center;
	background-color: #ffffff;
	position: relative;
	justify-content: space-between;
	>view{
		display: flex;
		align-items: center;
		height: 100%;
	}
	.font-30{
		margin-left: 16rpx;
	}
	.font-24{
		color: #999999;
	}
}
.hide::before{
	position: absolute;
	width:690rpx;
	height:4rpx;
	background-color: #EDEDED;
	content: '';
	top: 0;
}
.bottom{
	width:680rpx;
	height:90rpx;
	background:var(--theme);
	border-radius:45rpx;
	margin: 0 auto;
	margin-top: 60rpx;
	text-align: center;
	line-height: 90rpx;
	color: #ffffff;
}
</style>

<template>
    <view class="evaluation-item">
        <view class="use-header">
            <image :src="/http/.test(item.head_pic)?item.head_pic:$image+item.head_pi" class="use" mode=""/>
            <view class="use-name font-30">{{item.is_anonymous===0?item.nickname:'NEW 3用户'}}</view>
            <view class="start">
                <view 
                    v-for="(item,index) in start_list" 
                    :key="index"
                    :class="item.class"></view>
            </view>
        </view>
        <view class="font-24">
            {{item.add_time}}  {{item.spec_key_name}}
        </view>
        <view class="content font-28">
            {{item.content}}
        </view>
        <view class="evaluation-item-image">
            <image v-for="(ite,index) in item.img" :key="index" :src="$image+ite" mode="" />
        </view>
    </view>
</template>

<script>
export default {
    props:{
        item:{}
    },
    data(){
        return{
            // start_list:[
            //     {
            //         class:'active'
            //     },
            //     {
            //         class:'active'
            //     },
            //     {
            //         class:'active'
            //     },
            //     {
            //         class:'active'
            //     },
            //     {
            //         class:''
            //     }
            // ],
            // image_list:['/static/iphone_area.png','/static/iphone_area.png','/static/iphone_area.png','/static/iphone_area.png']
        }
    },
    computed:{
        start_list(){
            let val=this.item.goods_rank;
            let start_list=[];
            for (let i = 0; i < val; i++) {
                start_list.push({class:"active"})
            }
            for (let i = 0; i < 5-val; i++) {
                start_list.push({class:''})
            }
            return start_list
        }
    },
}
</script>

<style lang="scss">
    .evaluation-item{
        background-color: #ffffff;
		padding: 30rpx;
		position: relative;
		box-sizing: border-box;
		.use{
			height: 60rpx;
			width: 60rpx;
		}
		.use-header{
			display: flex;
			align-items: center;
			.use-name{
				margin-left: 18rpx;
			}
			.start{
				margin-left: 28rpx;
				view{
					background-image: url(../../static/start.png);
					height: 30rpx;
					width: 30rpx;
					background-size: 100%;
					display: inline-block;
				}
				view+view{
					margin-left: 10rpx;
				}
				.active{
					background-image: url(../../static/start_active.png);
				}
			}
		}
		>.font-24{
			color: #999;
			margin-top: 14rpx;
		}
		.content{
			line-height: 40rpx;
			margin-top: 16rpx;
		}
		.evaluation-item-image{
            margin-top:20rpx;
            image{
                height: 152rpx;
                width: 192rpx;
            }
            image+image{
                margin-left: 20rpx;
            }
            image:nth-child(3n+1){
                margin-left: 0;
            }
		}
	}
</style>
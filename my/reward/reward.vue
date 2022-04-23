<template>
    <view>
        <view class="header" v-if="num!==4">
			<!-- <view class="font-26 op">总收益({{unit}})</view> -->
			<view class="font-26 op">总收益</view>
			<view class="font-56">
				{{commission}}
			</view>
			<view class="flex">
				<view>
					<view class="font-40">{{into_commission}}</view>
					<!-- <view class="font-26 op">已到账({{unit}})</view> -->
					<view class="font-26 op">已到账</view>
				</view>
				<view>
					<view class="font-40">{{not_commission}}</view>
					<!-- <view class="font-26 op">冻结中({{unit}})</view> -->
					<view class="font-26 op">冻结中</view>
				</view>
			</view>
		</view>
        <template v-if="rebate_log.length>0">
            <view class="list" v-for="(item,index) in rebate_log" :key="index">
                <view class="title">
                    <view class="font-30">{{item.date}}</view>
                    <!-- <view class="font-26 c9">收入 {{unit=='元'?'￥':'积分：'}}{{item.money}}</view> -->
					<view class="font-26 c9">收入{{item.money}}</view>
                </view>
                <view class="list-item" v-for="(ite,inde) in item.list" :key="inde">
                    <image :src="ite.head_pic" mode="" />
                    <view>
                        <view class="flex">
                            <view class="font-30">{{ite.nickname||ite.goods_name}}</view>
                            <view class="font-36 bold">{{ite.money||ite.award}}</view>
                        </view>
                        <view class="flex">
                            <!-- <view class="font-26">{{num!==4?`下单消费${ite.goods_price}元`:''}}</view> -->
							<view class="font-26">{{num!==4?`下单消费${ite.goods_price}`:''}}</view>
                            <view class="font-26 F4">{{ite.status_deac}}</view>
                        </view>
                        <view class="font-26 c9">{{ite.create_time1}}</view>
                    </view>
                </view>
            </view>
            <!-- <no-more v-model="have" @more="more"></no-more> -->
			<view v-if="!have" class="no-more">我是有底线的</view>
        </template>
        <no-data v-else></no-data>
    </view>
</template>

<script>
export default {
    data(){
        return{
            page:1,
            have:true,
            url:'',
            commission:0,
            into_commission:0,
            not_commission:0,
            rebate_log:[],
            unit:'元',
            num:''
        }
    },
    onLoad({num}){
        num=+num;
        this.num=num
        switch(num){
            case 1:
                this.url='get|api/User/rebate_log';
                this.unit='元'
                break;
            case 2:
                break;
            case 3:
                this.url='get|api/User/share_award';
                this.unit='积分'
                break;
            case 4:
                this.url='get|api/User/profit';
                this.unit='元'
                break;
        }
        this.get_list();
    },
    methods:{
        get_list(){
            if(!this.url){
                return
            }
            this.$http(this.url,{
                p:this.page
            }).then(res=>{
                if(res.result.rebate_log.length==0){
                    this.have=false;
                    return
                }
                this.commission=res.result.commission
                this.into_commission=res.result.into_commission
                this.not_commission=res.result.not_commission
                this.rebate_log= [...this.rebate_log,...res.result.rebate_log]
            })
        },
        more(){
            this.page+=1;
            this.get_list();
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
    page{background-color: #F7F7F7;}
    .header{
        height:360rpx;
        /* #ifdef APP-PLUS */
        background: linear-gradient(225deg, rgba(116, 155, 255, 1) 0%, rgba(65, 100, 244, 1) 100%);
        /* #endif */
        /* #ifdef H5 */
        background: linear-gradient(225deg, #02D86D 0%, #00B159 100%);
        /* #endif */
        margin: 0 auto;
        padding-top: 50rpx;
        box-sizing: border-box;
        color: #ffffff;
        text-align: center;
        .flex{
            display: flex;
            margin-top: 70rpx;
            position: relative;
            >view{
                flex: 1;
            }
        }
        .flex::after{
            position: absolute;
            content: '';
            width:2rpx;
            height:72rpx;
            background:rgba(255,255,255,0.5);
            top: 50%;
            margin-top: -36rpx;
            left: 50%;
        }
        .op{
            opacity: 0.8;
        }
    }
    .list{
        .title{
            height: 128rpx;
            padding: 20rpx 30rpx;
            box-sizing: border-box;
        }
        .c9{
            color: #999999;
        }
        .list-item{
            padding: 30rpx;
            box-sizing: border-box;
            display: flex;
            background-color: #ffffff;
            image{
                height: 72rpx;
                width: 72rpx;
            }
            >view{
                flex: 1;
                padding-left: 30rpx;
                box-sizing: border-box;
            }
            .flex{
                display: flex;
                justify-content: space-between;
                align-items: center;
                .F4{
                    color: #F41613;
                }
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
<template>
    <view class="dialog">
        <view class="content">
            <image src="/static/close.png" class="close" mode="" @tap="dialog=false"/>
            <view class="header font-32">
                选择收货地址
            </view>
            <view class="list-item" v-for="(item,index) in adress_list" :key="index">
                <view class="box">
                    <view class="flex">
                        <view class="font-32">{{item.consignee}}</view>
                        <view class="font-32">{{item.mobile}}</view>
                    </view>
                    <view class="font-28 ellipsis">{{item.address1}}{{item.address}} </view>
                </view>
                <!-- <view class="option">
                    <view class="flex">
                        <check-box v-model="item.active"  @click.native="to_default(item)"/>
                        <view @tap="to_default(item)" :class="[item.active?'active':'','font-28 inline']">
                            设为默认地址
                        </view>
                    </view>
                    <view class="flex option-buttom">
                        <view class="font-28" @tap="edit_address(item)">编辑</view>
                        <view class="font-28" @tap="del_address(item,index)">删除</view>
                    </view>
                </view> -->
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data(){
        return{
            adress_list:[]
        }
    },
    mounted(){
        this.$http('get|api/User/address_list').then(res=>{
            this.adress_list=res.result.address_lists.map(row=>{
                if(row.is_default===1){
                    row.active=true
                }else{
                    row.active=false
                }
                return row
            })
        })
    }
}
</script>

<style lang="scss">
      .dialog{
        position: fixed;
        background-color: rgba(0,0,0,0.7);
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 999;
        .content{
            background-color: #ffffff;
            position: absolute;
            bottom: 0;
            width: 100%;
            animation: toShow 0.2s;
            .close{
                position: absolute;
                right: 30rpx;
                top: 30rpx;
                height: 36rpx;
                width: 36rpx;
            }
            .header{
                text-align: center;
                line-height:90rpx;
                box-shadow:0px 1px 0px 0px rgba(229,229,229,1);
            }
        }
      }
    .list-item{
		margin-bottom: 20rpx;
		padding: 0 30rpx;
		background-color: #ffffff;
		.flex{
			display: flex;
			justify-content: space-between;
			align-items: center;
			.inline{
				margin-left: 20rpx;
			}
		}
		.option{
			margin-top: 2rpx;
			height: 100rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.active{
				color: var(--theme);
			}
			.option-buttom{
				width: 150rpx;
				color: #999999;
			}
		}
	}
</style>
<template>
    <view>
        <view class="search">
            <view class="input-box">
                <input v-model="search" type="text" placeholder="搜索商品名称" placeholder-class="placeholder-class"/>
                <image src="/static/clear.png" mode="" @tap="search=''"/>
            </view>
            <view class="search-text font-30" @tap="is_search">搜索</view>
        </view>
        <view class="history">
            <view class="font-26">历史记录</view>
            <image src="/static/delete.png" mode="" @tap="config=true"/>
        </view>
        <view class="history-list">
            <view 
                v-for="(item,index) in history_list" 
                :key="index" 
                class="font-26 list-item"
                @tap="to_search(item)">
                {{item}}
            </view>
        </view>
        <view class="history">
            <view class="font-26">热门搜索</view>
        </view>
        <view class="history-list">
            <view 
                v-for="(item,index) in hot_list" 
                :key="index" 
                class="font-26 list-item"
                @tap="to_search(item)">
                {{item}}
            </view>
        </view>
        <view class="config" v-if="config">
            <view class="config-content">
                <view class="title font-40">提示</view>
                <view class="tip font-32">确定要清空历史记录吗？</view>
                <view class="config-buttom font-32">
                    <view @tap="config=false">取消</view>
                    <view style="color:#FF3733" @tap="remove">确定</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data(){
        return{
            search:'',
            history_list:[],
            hot_list:[],
            config:false
        }
    },
    onLoad(){
        this.$http("get|api/Goods/ajaxSearch").then(res=>{
            this.history_list=res.result.search.map(row=>row.keywords);
            this.hot_list=res.result.hot_keywords;

        })
    },
    methods:{
        goto_search(){
            //搜索s
            uni.navigateTo({
                url: `/index/good_search/good_search?q=${this.search}`
            });
        },
        to_search(item){
            this.search=item;
            this.goto_search();
        },
        is_search(){
            // if(this.history_list.length>=10){
            //     this.history_list.splice(this.history_list.length-1,1)
            // }
            // this.history_list.unshift(this.search);
            this.goto_search();
        },
        remove(){
            this.$http("get|api/Goods/del_search").then(res=>{
                this.history_list=[];
                this.config=false;
            })
        }
    }
}
</script>

<style lang="scss">
    .search{
        width: 100%;
        padding: 14rpx 30rpx;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow:0px 1rpx 0px 0px rgba(223,227,230,1);
        .input-box{
            position: relative;
             input{
                width:610rpx;
                height:60rpx;
                background:rgba(247,247,247,1);
                border-radius:29rpx;
                padding-left: 70rpx;
                padding-right: 80rpx;
                box-sizing: border-box;
                position: relative;
                font-size: 26rpx;
            }
            input::after{
                content: '';
                background-image: url(../../static/input_search.png);
                background-size: 100%;
                height: 26rpx;
                width: 26rpx;
                position: absolute;
                left: 30rpx;
                top: 50%;
                margin-top: -13rpx;
            }
            .placeholder-class{
                color: #A2A7BA;
                font-size: 26rpx;
            }
            image{
                position: absolute;
                height: 32rpx;
                width: 32rpx;
                right: 30rpx;
                top: 50%;
                margin-top: -16rpx;
            }
        }
    }
    .history{
        display: flex;
        justify-content: space-between;
        padding: 0 30rpx;
        margin-top: 50rpx;
        color: #454545;
        image{
            height: 28rpx;
            width: 28rpx;
        }
    }
    .history-list{
        padding-left:30rpx;
        box-sizing: border-box;
        .list-item{
            margin-top: 24rpx;
            background-color: #F7F7F7;
            padding: 0 20rpx;
            line-height: 50rpx;
            float: left;
            margin-right: 30rpx;
            color: #666666;
            max-width: calc(100% - 70rpx);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            border-radius:8rpx;
        }
    }
    .history-list::after{
        clear: both;
        content: '';
        display: block;
    }
</style>
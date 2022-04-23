<template>
    <view class="dialog" v-if="dialog">
        <view class="content">
            <image src="/static/close.png" class="close" mode="" @tap="dialog=false"/>
            <view class="header font-32">
                选择地区
            </view>
            <view class="adress">
                <view class="sheng">
                    <view 
                        @tap="to_active(item,'province','qu')"
                        :class="[item.active?'active':'','font-28']" 
                        v-for="(item,index) in province" 
                        :key="index">
                        {{item.name}}
                    </view>
                </view>
                <view class="qu">
                    <view 
                        @tap="to_active(item,'qu','shi')"
                        :class="[item.active?'active':'','font-28']" 
                        v-for="(item,index) in qu" 
                        :key="index">
                        {{item.name}}
                    </view>
                </view>
                <view class="shi">
                    <view 
                        @tap="choose_value(item)"
                        :class="[item.active?'active':'','font-28']" 
                        v-for="(item,index) in shi" 
                        :key="index">
                        {{item.name}}
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    props:{
        value:{}
    },
    data(){
        return{
            dialog:false,
            province:[
                // {
                //     active:true,
                //     name:'背景',
                //     id:''
                // }
            ],
            qu:[],
            shi:[]
        }
    },
    mounted(){
        this.$http('get|api/Api/getProvince').then(res=>{
            res.result.map(row=>{
                row.active=false
                return row
            })
            this.province=res.result;
        })
    },
    methods:{
        get_child(id,arr){
            this.$http('get|api/Api/getRegionByParentId',{
                parent_id:id
            }).then(res=>{
                this[arr]= res.result.map(row=>{
                    row.active=false
                    return row
                })
            })
        },
        to_active(item,label,child){
            if(label=='province'){
                this.qu=[];
                this.shi=[];
            }
            if(label=='qu'){
                this.shi=[];
            }
            this[label].forEach(el=>{
                el.active=false
            })
            item.active=true;
            this.get_child(item.id,child);
            this.emit();
        },
        choose_value(item){
            this.shi.forEach(el=>{
                el.active=false
				this.dialog = false
            })
            item.active=true;
            this.emit();
        },
        emit(){
            let arr=[];
            let province=this.province.find(row=>row.active)
            let qu=this.qu.find(row=>row.active)
            let shi=this.shi.find(row=>row.active)
            arr.push(province?province:'')
            arr.push(qu?qu:'')
            arr.push(shi?shi:'')
            this.$emit('adress',arr.map(row=>row.id),arr.map(row=>row.name).join(' '));
        }
    },
    watch:{
        value(val){
            this.dialog=val;
        },
        dialog(val){
            this.$emit('input',val);
        }
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
            .adress{
                height: 660rpx;
                display: flex;
                >view{
                    height: 100%;
                    overflow-y: scroll;
                }
                .sheng{
                    width: 220rpx;
                    border-right: 2rpx solid #D8D8D8;
                    height: 100%;
                    box-sizing: border-box;
                }
                .qu{
                    width:220rpx;
                    border-right: 2rpx solid #D8D8D8;
                    height: 100%;
                    box-sizing: border-box;
                }
                .shi{
                    flex: 1;
                }
                .font-28{
                    padding: 20rpx;
                    box-sizing: border-box;
                    // height: 78rpx;
                }
                .active{
                    background-color: #E6E6E6;
                    box-sizing: border-box;
                    width: 100%;
                }
            }
        }
    }
</style>
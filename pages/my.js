export default {
    to_information() {
        uni.navigateTo({
            url: '/my/information/information'
            // 公司资讯群
        })
    },
    to_message() {
        uni.navigateTo({
            url: '/my/news/news'
            // 消息
        })
    },
    to_setting() {
        uni.navigateTo({
            url: '/my/setting/setting'
        })
        // 设置
    },
    to_pay_detail() {
        uni.navigateTo({
            url: '/my/pay_detail/pay_detail'
        })
        // 我的消费
    },
    to_integral() {
        uni.navigateTo({
            url: '/my/integral/integral'
        })
        // 我的积分
    },
    to_gift() {
        uni.navigateTo({
            url: '/my/gift/gift'
        })
    },
    to_experience() {
        uni.navigateTo({
            url: '/my/experience/experience'
        })
    },
    to_team() {
        uni.navigateTo({
            url: '/my/my_team/my_team'
        })
        // 我的团队
    },
    to_operate() {
        uni.navigateTo({
            url: '/my/operate'
        })
    },
    to_coupon() {
        uni.navigateTo({
            url: '/my/coupon/coupon'
        })
        // 优惠券
    },
    to_mywallet() {
        uni.navigateTo({
            url: '/my/my_wallet/my_wallet'
        })
        // 我的钱包
    },
    to_reward(num) {
        uni.navigateTo({
            url: `/my/reward/reward?num=${num}`
        })
        // 奖励
    },
    to_agent() {
        this.$http('get|api/User/index').then(res => {
            // 没登陆
            if (res.result.users.is_attestation === 0) {
                uni.navigateTo({
                    url: '/my/shiming/shiming'
                })
            } else {
                this.$toastApp('您已实名认证成功')
            }
        })
        // this.$http('get|api/user/apply_partner').then(res=>{
        //     uni.navigateTo({
        //         url: "/my/agent/agent"
        //     });
        // }).catch(e=>{
        //     if(e.status==-1){
        //         this.permission_dialog=true;
        //         this.title=e.msg;
        //         this.message=e.result.desc;
        //         this.botton=e.result.is_upgrades?'购买礼包':''
        //         this.good_id=e.result.is_upgrades.goods_id
        //         return
        //     }
        //     if(e.status===-2){
        //         this.conditions={
        //             title:e.msg,
        //             message:e.result.desc,
        //             botton:'我知道了',
        //             dialog:true
        //         }
        //         return
        //     }
        //     this.$toastApp(e.msg);
        // })
        // 代理商
    },
    to_address() {
        uni.navigateTo({
            url: '/my/address_management/address_management'
        })
        // 地址管理
    },
    to_pay_account() {
        uni.navigateTo({
            url: '/my/pay_account/pay_account'
        })
        // 收款账号
    },
    to_order() {
        uni.navigateTo({
            url: '/shop_card/my_order/my_order'
        })
        // 订单
    },
    my_collection() {
        uni.navigateTo({
            url: '/my/my_collection/my_collection'
        })
        // 收藏
    },
    my_replace() {
        uni.navigateTo({
            url: '/shop_card/replace_pay/list'
        })
        // 代付
    },
    to_sale() {
        uni.navigateTo({
            url: '/shop_card/sale/sale'
        })
        // 售后
    },
    to_order_item(type) {
        uni.navigateTo({
            url: `/shop_card/my_order/my_order?type=${type}`
        })
    },
    to_invite() {
        // 推广海报
        this.$http('get|api/User/invite_poster').then(res => {
            uni.navigateTo({
                url: '/index/invite/invite'
            })
        }).catch(e => {
            if (e.status === -1) {
                this.permission_dialog = true
                this.title = e.msg
                this.message = e.result.desc
                this.botton = e.result.is_upgrades ? '购买礼包' : ''
                this.good_id = e.result.is_upgrades.goods_id
                return
            }
            if (e.status === -2) {
                // console.log(e)
                this.permission_dialog = true
                this.title = e.msg
                this.botton = '去实名'
                // console.log(this.botton)
                return
            }
            this.$toastApp(e.msg)
        })
    },
    to_contribution() {
        uni.navigateTo({
            url: '/my/contribution/contribution'
        })
    }
}

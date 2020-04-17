<template>
    <div class="experience">
        <div class="item" v-show="!loading">
            <div class="header">
                <div class="name">
                    <span>{{info.coin}}</span>
                    <span>{{info.description}}{{$t('home.description')}}</span>
                </div>
                <div class="earn">
                    <span>{{info.coin}}{{$t('home.theory')}}$ {{formatNumberFloor(info.profit,4)}}/T/{{$t('home.days')}}</span>
                </div>
            </div>
            <div class="bottom">
                <div class="con">
                    <div>
                        <span>{{$t('order.peice')}}：</span> 
                        <span>$<em>{{info.price}}</em>/T/{{$t('home.days')}}</span>
                    </div>
                    <div>
                        <span>{{$t('home.period')}}：<em>{{info.days}}</em>{{$t('home.days')}}</span>
                        <span>{{$t('home.number')}}：<em>{{info.hashMax}}</em>T</span>
                        <!--<span><em>50</em>SHA_256</span>-->
                        <span>SHA_256</span>
                    </div>
                </div>
                <div class="buy">
                    <p>{{$t('order.amount')}}：$<em class="exprience">{{amount}}</em><em> 0</em> </p>
                    <button @click="buy"  :class="{'notBuy':!status}">{{status?$t('home.buy'):$t('home.bought')}}</button>
                </div>
            </div>
            <p>{{$t('home.exprience')}}</p>
        </div>
        <b v-if="loading" class="loading"><img src="../assets/images/loading.gif" alt=""></b>
    </div>
</template>
<script>
export default {
    name: 'experience',
    data() {
        return {
            loading: false,
            info: {},
            status:true,
        }
    },
    computed: {
        amount() {
            return this.formatNumberCeil(this.info.price*this.info.hashMax*this.info.days,4)
        },
    },
    created() {
        if(localStorage.getItem('userInfo')==null||localStorage.getItem('userInfo')=='null') {
            this.status=true;
        }else{
            this.$trialStatus({cancel:'trialStatus'},res=>{
                if(res.code==0) {
                    this.status=true
                }else{
                    this.status=false
                    this.$Message.error(res.msg);
                }
            });
        }

        this.get_data();
    },
    methods:{
        // 用户是否体验过
        get_status() {
            this.$trialStatus({cancel:'trialStatus'},res=>{
                if(res.code==0) {
                    this.info.hash = this.info.hashMax
                    this.info.isHashEqual = false
                    localStorage.setItem('data',JSON.stringify(this.info));
                    this.$router.push('/order?isExprience=true')
                    localStorage.setItem('trialStatus',true);
                    this.status=true
                }else{
                    localStorage.setItem('trialStatus',false);
                    this.status=false
                    this.$Message.error(res.msg);
                }
            });
        },
        buy() {
            if(localStorage.getItem('userInfo')==null||localStorage.getItem('userInfo')=='null') {
                this.$router.push(`/user/${'login'}`);
                return;
            }
            this.get_status();
        },
        get_data() {
            this.$trial('',res=>{
                if(res.code==0){
                    this.info = res.data.trial[0];
                }
            });
        }
    }
}
</script>
<style lang="less" scoped>
.experience{
    background: url('../assets/images/experience.png') no-repeat center center;
    padding-top: 212px;
    background-color: #fff;
    background-size: 100% 100%;
    height: 736px;
    .item{
        width: 1000px;
        margin: auto;
        .header{
            >.name{
                display: flex;
                align-items: center;
                justify-content: flex-start;
                height: 47px;
                background: #FF3131;
                margin-top: 5px;
                width: 320px;
                padding: 0 11px;
                position: relative;
                span{
                    color: #fff;
                    &:nth-child(1){
                        margin-right: 10px;
                        font-size: 36px;
                    }
                    &:nth-child(2){
                        font-size: 15px;
                    }
                }
                &::after{
                    position: absolute;
                    right: -47px;
                    top: 0;
                    content: '';
                    width: 0;
                    height: 0;
                    border-top: 47px solid transparent;
                    border-left: 47px solid #FF3131;
                }
            }
            .earn{
                height: 30px;
                height: 29px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 11px;
                background:linear-gradient(90deg,rgba(33,33,33,1),rgba(80,80,80,1));
                span,a{
                    color: #fff;
                    font-size:16px;
                }
            }
        }
        .bottom{
            padding: 22px 0 34px 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #fff;
            border:1px solid rgba(220,220,220,1);
            .con{
                width: 720px;
                border-right: 1px solid #494848;
                padding: 0 78px 0 64px;
                >div{
                    &:nth-child(1){
                        margin-bottom: 50px;
                        span{
                            color: #131313;
                            font-size: 18px;
                            em{
                                font-size: 32px;
                            }
                        }
                    }
                    &:nth-child(2) {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        span{
                            color: #131313;
                            font-size: 18px;
                            em{
                                font-size: 30px;
                            }
                        }
                    }
                }
            }
            .buy{
                text-align: center;
                width: calc(100% - 720px);
                p{
                    color: #131313;
                    font-size: 18px;
                    em{
                        font-size: 30px;
                    }
                    .exprience {
                        text-decoration:line-through;
                        color: #888888;
                    }
                }
                button{
                    width: 189px;
                    height: 54px;
                    line-height: 54px;
                    background: #212121;
                    color: #fff;
                    text-align: center;
                    font-size: 16px;
                    margin-top: 30px;
                    cursor: pointer;
                }
                .notBuy{
                    background: #cacaca;
                }
            }
        }
        >p{
            width: 100%;
            text-align: right;
            color: #212121;
            font-size: 12px;
            margin-top: 14px;
        }
        
    }
}
</style>


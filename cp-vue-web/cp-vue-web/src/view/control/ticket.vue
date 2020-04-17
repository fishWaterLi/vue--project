<!--
<template>
    <div class="ticket">
        <div class="con">
            &lt;!&ndash; 代金券 &ndash;&gt;
            <div  v-if="ticketList0.allow.length>0||ticketList0.notAllow.length>0">
                <div class="title">
                    <p></p><span>代金券</span><p></p>
                </div>
                <div class="content">
                    &lt;!&ndash; 可用 &ndash;&gt;
                    <div class="item allow" v-for="(item,index) in ticketList0.allow" :key="index">
                        <div>
                            <div class="left">
                                <p>$<em>{{item.DiscountNum}}</em></p>
                                <p>注册专享优惠</p>
                            </div>
                            <div class="right">
                                <p>下单立减</p>
                                <p>使用日期:{{item.StartTime | formatDate('yyyy-MM-dd')}}至{{item.EndTime| formatDate('yyyy-MM-dd')}}</p>
                            </div>
                        </div>
                        <button @click="useTicket">使用</button>
                    </div>
                    &lt;!&ndash; 不可用 &ndash;&gt;
                    <div class="item notAllow" v-for="(item,index) in ticketList0.notAllow" :key="index">
                        <div>
                            <div class="left">
                                <p>$<em>{{item.DiscountNum}}</em></p>
                                <p>注册专享优惠</p>
                            </div>
                            <div class="right">
                                <p>下单立减</p>
                                <p>使用日期:{{item.StartTime | formatDate('yyyy-MM-dd')}}至{{item.EndTime| formatDate('yyyy-MM-dd')}}</p>
                            </div>
                        </div>
                        <button>使用</button>
                    </div>
                </div>
            </div>
            &lt;!&ndash; 满减券 &ndash;&gt;
            <div  v-if="ticketList1.allow.length>0||ticketList1.notAllow.length>0">
                <div class="title">
                    <p></p><span>满减券</span><p></p>
                </div>
                <div class="content">
                    &lt;!&ndash; 可用 &ndash;&gt;
                    <div class="item allow" v-for="(item,index) in ticketList1.allow" :key="index">
                        <div class="left">
                            <p>$<em>{{item.DiscountNum}}</em></p>
                            <p>满减券</p>
                        </div>
                        <div class="right">
                            <p>满{{item.SatisfiedNum}}使用</p>
                            <button @click="useTicket">使用</button>
                        </div>
                    </div>
                    &lt;!&ndash; 不可用 &ndash;&gt;
                    <div class="item notAllow" v-for="(item,index) in ticketList1.notAllow" :key="index">
                        <div class="left">
                            <p>$<em>{{item.DiscountNum}}</em></p>
                            <p>满减券</p>
                        </div>
                        <div class="right">
                            <p>满{{item.SatisfiedNum}}使用</p>
                            <button>立即使用</button>
                        </div>
                    </div>
                </div>
            </div>
            &lt;!&ndash; 优惠券 &ndash;&gt;
            <div v-if="ticketList2.allow.length>0||ticketList2.notAllow.length>0">
                <div class="title">
                    <p></p><span>优惠券</span><p></p>
                </div>
                <div class="content">
                    &lt;!&ndash; 可用 &ndash;&gt;
                    <div class="item allow" v-for="(item,index) in ticketList2.allow" :key="index">
                        <div class="left">
                            <p>$<em>{{item.DiscountNum}}</em></p>
                            <p>优惠券</p>
                        </div>
                        <div class="right">
                            <p>无门槛</p>
                            <div><button @click="ticketId=item.Id;idModa=true">转让</button><button @click="useTicket(item)">/使用</button></div>
                        </div>
                    </div>
                    &lt;!&ndash; 不可用 &ndash;&gt;
                    <div class="item notAllow" v-for="(item,index) in ticketList2.notAllow" :key="index">
                        <div class="left">
                            <p>$<em>{{item.DiscountNum}}</em></p>
                            <p>优惠券</p>
                        </div>
                        <div class="right">
                            <p>无门槛</p>
                            <div><button>转让</button><button>/使用</button></div>
                        </div>
                    </div>
                </div>
            </div>
             <b v-if="nodata" class="nodata"><img src="../../assets/images/nodata.png" alt="">
            <span>{{$t('noData')}}</span></b>
        </div>
        <div class="list">
            <div class="title">使用记录</div>
            <div class="nav">
                <span>时间</span>
                <span>类型</span>
                <span>券种类</span>
                <span>面值</span>
                <span>转让/接收账号</span>
            </div>
            <b v-if="useList.length==0" class="nodata"><img src="../../assets/images/nodata.png" alt="">
                <span>暂无使用记录</span></b>
            <div v-else class="item" v-for="(v,k) in useList" :key="'1'+k">
                <span>{{v.date | formatDate('yyyy-MM-dd')}}</span>
                <span>{{v.useType}}</span>
                <span>{{v.couType}}</span>
                <span>{{v.amount}}</span>
                <span>{{v.presentUserId}}</span>
            </div>
        </div>
        &lt;!&ndash; 验证码 &ndash;&gt;
        <Modal v-model="codeModal" width="601" class="code" @on-cancel="code=''">
            <p slot="header" style="text-align:center">
                <span>验证码</span>
                <img src="../../assets/images/line.png" alt="">
            </p>
            <div v-if="!isBindGACode">
                <Input v-model='code' :placeholder="$t('public.code')" ref='re' @keyup.enter.native="submit" style="width:245px;"/>
                <button v-if="s>0">{{s}}</button>
                <button @click="startDown" v-else>获取验证码</button>
            </div>
            &lt;!&ndash; <p>请输入谷歌验证码</p> &ndash;&gt;
            <div v-if="isBindGACode">
                <Input v-model='code' :placeholder="$t('public.google')" ref='re' @keyup.enter.native="submit" style="width:365px;"/>
            </div>
            <button @click="submit" :style="{'width':'365px'}">确定</button>
        </Modal>
        &lt;!&ndash; 用户id &ndash;&gt;
        <Modal v-model="idModa" width="601" class="code" @on-cancel="userID=''">
            <p slot="header" style="text-align:center">
                <span>转让优惠券</span>
                <img src="../../assets/images/line.png" alt="">
            </p>
            <div >
                <Input v-model='userID' placeholder="请输入用户ID" ref='re' @keyup.enter.native="confirm" style="width:365px;"/>
                <p v-if="!notId">ID不存在请重新输入</p>
            </div>
            <button @click="giveTicket" :style="{'width':'142px'}">确定</button>
        </Modal>
    </div>
</template>
<script>
import { all } from 'q';
export default {
    name: 'ticket',
    data() {
        return {
            codeModal: false,
            idModa: false,
            userID: '',//用户id
            notId: true,//转增用户id是否存在
            ticketId:'',
            code: '',//验证码
            s: 10,
            nodata: false,
            ticketList0:{
                allow:[],
                notAllow:[]
            },
            ticketList1:{
                allow:[],
                notAllow:[]
            },
            ticketList2:{
                allow:[],
                notAllow:[]
            },
            token:'',
            isBindGACode: false,//是否绑定谷歌
            useList:[],
            
        }
    },
    created() {
        this.get_ticketList();
        this.get_useList();
        this.isBindGACode = JSON.parse(localStorage.getItem('userInfo')).isBindGACode
    },
    mounted() {},
    methods: {
        //获取优惠券
        //优惠券  1是不可用（已使用1 已过期0）   0是可用（未使用 未过期）
        get_ticketList() {
            this.$coupon({cancel:'ticket'},res=>{
                if(res.code==0) {
                    // console.log(res);
                    let ticketList0 = res.data.coupon[0];
                    let ticketList1 = res.data.coupon[1];

                    let arr0 = [],arr1 = [],arr2 = [];
                    for(let i in ticketList0) {
                        if(ticketList0[i].Name == '代金券') {
                            arr0.push(ticketList0[i])
                        }
                        if(ticketList0[i].Name == '满减券') {
                            arr1.push(ticketList0[i])
                        }
                        if(ticketList0[i].Name == '优惠券') {
                            arr2.push(ticketList0[i])
                        }
                    }
                    
                    let arr0_0 = [],arr1_1 = [],arr2_2 = [];
                    for(let j in ticketList1) {
                        if(ticketList1[j].Name == '代金券') {
                            arr0_0.push(ticketList1[j])
                        }
                        if(ticketList1[j].Name == '满减券') {
                            arr1_1.push(ticketList1[j])
                        }
                        if(ticketList1[j].Name == '优惠券') {
                            arr2_2.push(ticketList1[j])
                        }
                    }
                    if(arr0.length==0&&arr0_0.length==0&&arr1.length==0&&arr1_1.length==0&&arr2.length==0&&arr2_2.length==0){
                        this.nodata = true;
                    }
                    this.ticketList0 = {
                        allow: arr0,
                        notAllow:arr0_0
                    }
                    this.ticketList1 = {
                        allow: arr1,
                        notAllow:arr1_1
                    }
                    this.ticketList2 = {
                        allow: arr2,
                        notAllow:arr2_2
                    }

                }
            })
        },
        // //获取验证码
        startDown() {
            let account = JSON.parse(localStorage.getItem('userInfo')).email
            this.s = 120;
            this.$getEmailCode({email:account,recaptchaCode: 'ff'},res=>{
                if(res.code == 0){
                    this.countDown();
                    this.s = 120;
                }else{
                    this.$Message.error(res.msg);
                }
            });
        },
        get_useList() {
            this.$couponRecord({cancel:'record'},res=>{
                if(res.code==0) {
                    this.useList = res.data.list;
                }
            })
        },
        useTicket(){
            this.$router.push('/price');
        },
        giveTicket(){
            this.userID = this.userID.replace(/\s+/g,"")
            if(this.userID==''){
                this.$Message.error('请输入用户ID');
                return;
            }
            let params = {
                couponId: this.ticketId,
                userId: Number(this.userID),
            }
            this.$couponOffer(params,res=>{
                if(res.code==0) {
                    if(!this.isBindGACode){
                        this.countDown();
                    }
                    this.token = res.data.tempToken;
                    this.idModa = false;
                    this.codeModal = true;
                }else{
                    this.notId = false;
                }
            })
        },
        confirm() {
            this.idModa = false;
            this.codeModal = true;
            this.countDown();
        },
        submit() {
            this.$couponVerify({tempToken:this.token,code:this.code},res=>{
                if(res.code==0) {
                    this.codeModal = false;
                    this.get_ticketList();
                }
            })
            
        },
        countDown () {
            // 直接元素必须为button
            let timer = setInterval(() => {
                this.s&#45;&#45;;
                if (this.s < 1) {
                    clearInterval(timer);
                }
            }, 1000);
        },
    }
}
</script>

<style lang="less" scoped>
.ticket{
    .con{
        background: #fff;
        padding: 20px;
        >div{
            padding-bottom: 66px;
            .title{
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-top: 12px;
                margin-bottom: 66px;
                p{
                    height: 1px;
                    width: calc((100% - 120px)/2);
                    background: #EDEDED;
                }
                span{
                    display: inline-block;
                    width: 120px;
                    height: 19px;
                    font-size: 19px;
                    line-height: 18px;
                    text-align: center;
                    color: #D9D9D9;
                }
            }
            .content{
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                justify-content: flex-start;
                .item{
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 24px 22px 32px 31px;
                }
            }
            &:nth-child(1){
                .item{
                    width: 438px;
                    height: 139px;
                    >div{
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        width: 284px;
                        .left{
                            width: 105px;
                            p{
                                text-align: center;
                                color: #fff;
                                display: flex;
                                align-items: flex-end;
                                justify-content: center;
                                &:nth-child(1){
                                    font-size: 22px;
                                    height: 39px;
                                    em{
                                    display: inline-block;
                                    height: 39px;
                                    line-height: 39px;
                                    font-size: 39px;
                                    margin-left: 3px;
                                    }
                                }
                                &:nth-child(2){
                                    font-size:11px;
                                    transform: scale(0.9,1);
                                }
                            }
                        }
                        .right{
                            text-align: center;
                            width: 184px;
                            p{
                                text-align: left;
                                width: 200px;
                                color: #fff;
                                transform: scale(0.9,1);
                                &:nth-child(1){
                                    font-size: 16px;
                                    height: 17px;
                                    line-height: 17px;
                                    margin-bottom: 13px;
                                }
                                &:nth-child(2){
                                    font-size: 12px;
                                    height: 11px;
                                    line-height: 10px;
                                }
                            }
                        }
                    }
                    >button{
                        width: 71px;
                        height: 28px;
                        text-align: center;
                        line-height: 27px;
                        font-size: 13px;
                        background:rgba(255,255,255,1);
                        box-shadow:0px 2px 6px 0px rgba(9,63,123,0.22);
                        border-radius:14px;
                    }
                }
                .allow{
                    background: url('../../assets/images/daijin.png') no-repeat center center;
                     >button{
                        color: #FBAA3F;
                        cursor: pointer;
                    }
                }
                .notAllow{
                    background: url('../../assets/images/error-daijin.png') no-repeat center center;
                    >button{
                        color: #AFAFAF;
                        cursor: not-allowed;
                    }
                }
            }
            &:nth-child(2),&:nth-child(3){
                .item{
                    width: 298px;
                    height: 124px;
                    .left{
                        width: 120px;
                        p{
                            text-align: center;
                            color: #fff;
                            display: flex;
                            align-items: flex-end;
                            justify-content: center;
                            &:nth-child(1){
                                font-size: 22px;
                                height: 39px;
                                em{
                                display: inline-block;
                                height: 39px;
                                line-height: 39px;
                                font-size: 39px;
                                margin-left: 3px;
                                }
                            }
                            &:nth-child(2){
                                font-size:11px;
                                transform: scale(0.9,1);
                            }
                        }
                    }
                    .right{
                        width: 90px;
                        text-align: center;
                        p{
                            margin-bottom: 10px;
                            color: #fff;
                            font-size: 13px;
                        }
                        
                    }
                }
            }
            &:nth-child(2){
                .item{
                    button{
                        width:66px;
                        height:17px;
                        background: #fff;
                        border-radius: 12px;
                        font-size: 14px;
                        line-height: 15px;
                    }
                }
                .allow{
                    background: url('../../assets/images/manjian.png') no-repeat center center;
                    button{
                        color: #FE3267;
                        cursor: pointer;
                    }
                }
                .notAllow{
                    background: url('../../assets/images/error-youhui.png') no-repeat center center;
                    button{
                        color: #AFAFAF;
                        cursor: not-allowed;

                    }
                }
            }
            &:nth-child(3){
                .item{
                    width: 298px;
                    height: 124px;
                    .right>div{
                        width:66px;
                        margin: auto;
                        height:17px;
                        background: #fff;
                        border-radius: 12px;
                        font-size: 14px;
                        line-height: 15px;
                    }
                }
                .allow{
                    background: url('../../assets/images/youhui.png') no-repeat center center;
                     button{
                        color: #FE3267;
                        cursor: pointer;
                    }
                }
                .notAllow{
                    background: url('../../assets/images/error-youhui.png') no-repeat center center;
                    button{
                        color: #AFAFAF;
                        cursor: not-allowed;
                    }
                }
            }
        }
    }
    .list{
        margin-top: 20px;
        background: #fff;
        .title{
            font-size: 16px;
            color: #808080;
            padding-left: 14px;
            height: 42px;
            line-height: 41px;
        }
        .nav,.item{
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-top: 1px solid #ededed;
            padding: 0 15px;
            height: 36px;
            line-height: 35px;
            span{
                display: inline-block;
                width: 20%;
                text-align: center;
            }
        }
    }
}
</style>
-->

<template>
    <div class="property">
        <div class="title">
            <div>
                <span>{{$t('control.total')}}</span>
                <em>{{totalBTC}}</em>
                <div>BTC ≈ ${{totalUSD}}</div>
            </div>
            <button>
                <router-link to="/record/recharge">{{$t('control.financial')}}</router-link>
            </button>
        </div>
        <div class="con">
            <div class="nav">
                <span>{{$t('control.coin')}}</span>
                <span>{{$t('control.available')}}</span>
                <span>{{$t('control.frozen')}}</span>
                <span>BTC{{$t('control.valuation')}}</span>
                <span>{{$t('control.actions')}}</span>
            </div>
            <div class="item" v-for="(item,index) in dataList" :key="index" v-show="dataList.length>0&&!loading">
                <div class="content">
                    <span>{{item.coin}}</span>
                    <span>{{formatNumberFloor(item.available,8)}}</span>
                    <span>{{item.frozen}}</span>
                    <span>{{formatNumberFloor(item.toBtc,8)}}</span>
                    <span>
                        <button @click="recharge(item,index)" v-if="item.can_deposit=='Y'">{{$t('control.deposit')}}</button>
                        <button v-else class="btn-N">{{$t('control.deposit')}}</button>
                        <button @click="withdraw(item,index)" v-if="item.can_withdrawal=='Y'">{{$t('control.withdraw')}}</button>
                        <button v-else class="btn-N">{{$t('control.withdraw')}}</button>
                    </span>
                </div>
                <div class="recharge" :class="{'top': showRecharge==index&&showWithdraw}">
                    <div>
                        <div>
                            <p>
                                <span>{{$t('control.depositAddress')}}
                                    <button class="copy" :data-clipboard-text="inAddress" @click="copyLink">{{$t('control.copy')}}</button>
                                </span>
                            </p>
                            <p>{{inAddress}}</p>
                        </div>
                        <div id="qrcode"></div>
                    </div>
                    <!-- <div>
                        <span>{{$t('control.prompt')}}：</span>
                        <span>此处为后台录入的充值须知内容，如最小起充额度、客服审核时间、充值需要的确认数等相关内容，此处为后台录入的充值须知内容，如最小起充额度、客服审核时间、充值需要的确认数等相关内容。</span>
                    </div> -->
                </div>
                <div class="recharge" :class="{'draw': showRecharge==index&&!showWithdraw}">
                    <div>
                        <div>{{$t('control.withdrawAddress')}}</div>
                        <input type="text" v-model="withdrawParam.outAddress"
                               :placeholder="$t('control.withdrawAddress')">
                        <p><span>{{$t('control.Amount')}}：({{formatNumberFloor(item.available,8)}} {{item.coin}})</span> <span>{{$t('record.fees')}}：{{coinInfo.withdrawalFee}} {{item.coin}}</span>
                        </p>
                        <!--<InputNumber :max="item.available<coinInfo.withdrawalMaxNum? item.available:coinInfo.withdrawalMaxNum"-->
                        <!--:min="coinInfo.withdrawalMinNum" class="inputNumber" v-model="withdrawParam.volume"-->
                        <!--:precision="coinInfo.withdrawalPrecision"/>-->
                        <input class="inputNumber" @input="changeNumber(item.available)"
                               v-model="withdrawParam.volume"/>
                        <p>{{$t('control.account')}}:{{actualAccount}} {{item.coin}}</p>
                        <button @click="withdrawCoin(item,index)">{{$t('control.withdraw')}}</button>
                    </div>
                    <div>
                        <span>{{$t('control.withdrawPrompt')}} :</span>
                        <span>{{$t('control.coinKnow')}}</span>
                    </div>
                </div>
            </div>
            <b v-if="dataList.length==0&&!loading" class="nodata"><img src="../../assets/images/nodata.png" alt="">
                <span>{{$t('noData')}}</span></b>
            <b v-if="loading" class="loading"><img src="../../assets/images/loading.gif" alt=""></b>
        </div>
    </div>
</template>
<script>
    import Clipboard from 'clipboard';
    import QRCode from 'qrcodejs2';

    const copy = new Clipboard('.copy');
    export default {
        name: 'property',
        data() {
            return {
                dataList: [],//资产列表
                loading: false,
                showRecharge: -1,//是否显示当前充币/提币 下拉详情
                showWithdraw: true,//出币下拉详情
                withdrawParam: {
                    outAddress: '',//出币地址
                    volume: 0, //提币数量
                    coin: '',
                },
                inAddress: '3ChQjAWxHBzDxbsvM7U7pS7EoscTJzGTxd',//充币地址
                userInfo: {},//用户信息
                coinInfo: {},//币信息
                totalBTC: '',//BTC估值
                totalUSD: '',//USD估值
            }
        },
        mounted() {
            this.accountList()
        },
        computed: {
            actualAccount() {
                return parseFloat(this.withdrawParam.volume) > this.coinInfo.withdrawalFee ? (parseFloat(this.withdrawParam.volume) - this.coinInfo.withdrawalFee).toFixed(this.coinInfo.withdrawalPrecision) : 0
            }
        },
        methods: {
            changeNumber(available) {
                let maxNum = Math.min(this.coinInfo.withdrawalMaxNum, available)
                if (this.withdrawParam.volume > maxNum) {//当输入的超过最大的值，就会用默认的值替换输入的值
                    this.withdrawParam.volume = maxNum;//替换用户输入的最大的值
                }
                this.withdrawParam.volume = this.formatPrecision(this.withdrawParam.volume,this.coinInfo.withdrawalPrecision)
              },
            //获取账户余额信息
            accountList() {
                this.$accountList({cancel: 'accountList'}, res => {
                    this.totalBTC = res.data.totalBTC
                    this.totalUSD = res.data.totalUSD
                    this.dataList = res.data.accounts
                })
            },
            //充值按钮---下拉展示详情
            recharge(row, index) {
                if (this.showRecharge == index) {
                    if (!this.showWithdraw) {
                        this.getInAddress(row.coin)
                        this.showWithdraw = true;
                    } else {
                        this.showRecharge = -1;
                    }
                } else {
                    this.showRecharge = index;
                    this.showWithdraw = true;
                    this.getInAddress(row.coin)
                }
            },
            //提币按钮---下拉展示详情
            withdraw(row, index) {
                // if (this.userInfo.authStatus!='authSucceed') {
                //     this.$Message.error('请先进行KYC认证');
                //     return
                // }
                this.$coinInfo({coin: row.coin}, res => {
                    if (res.code == 0) {
                        this.coinInfo = res.data.coinInfos[0]
                    } else {
                        this.$Message.error(res.msg)
                    }
                })
                this.withdrawParam.coin = row.coin;
                if (this.showRecharge == index) {
                    if (this.showWithdraw) {
                        this.showWithdraw = false;
                    } else {
                        this.showWithdraw = true;
                        this.showRecharge = -1;
                    }
                } else {
                    this.showRecharge = index;
                    this.showWithdraw = false;
                }
            },
            //提币
            withdrawCoin(item) {
                if (this.withdrawParam.outAddress == '') {
                    this.$Message.error(this.$t('record.error[0]'))
                    return
                }
                if(this.withdrawParam.volume < this.coinInfo.withdrawalMinNum){
                    this.$Message.error(this.$t('record.error[1]')+this.coinInfo.withdrawalMinNum)
                    return
                }
                let params = {
                    coin: item.coin,
                    volume: parseFloat(this.withdrawParam.volume),
                    outAddress: this.withdrawParam.outAddress,
                    tag: '',
                }
                this.$withdrawal(params, res => {
                    if (res.code == 0) {
                        this.$Message.success(this.$t('record.error[3]'))
                        this.withdrawParam = {}
                        this.accountList()
                    } else {
                        this.$Message.error(res.msg)
                    }
                })
            },
            //获取单个账户入金地址
            getInAddress(coin) {
                this.$inAddress({coin: coin}, res => {
                    if (res.code == 0) {
                        this.inAddress = res.data.address
                        document.getElementById('qrcode').innerHTML = ''
                        new QRCode('qrcode', {
                            width: 100,
                            height: 100, // 高度
                            text: this.inAddress, // 二维码内容
                        })
                    } else {
                        this.$Message.error(res.msg);
                    }
                })
            },
            //复制
            copyLink() {
                this.$Message.success(this.$t('invite.copyTip[0]'));
            },
        }
    }
</script>

<style lang="less" scoped>
    .property {
        
        .title {
            background: #fff;
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            padding: 36px 48px 25px 17px;

            span {
                font-size: 16px;
                color: #545454;
            }

            em {
                font-size: 40px;
                margin-left: 19px;
                color: #282828;
            }

            div {
                display: inline-block;
                font-size: 16px;
                color: #545454;
            }

            button {
                border: 1px solid #808080;
                border-radius: 5px;
                font-size: 13px;
                color: #808080;
                width: 130px;
                height: 32px;
                line-break: 30px;
                cursor: pointer;
                a{
                    display: block;
                    width: 130px;
                    height: 32px;
                    line-height: 32px;
                }
            }
        }

        .con {
            .item, .nav {
                background: #fff;
                border-bottom: 1px solid #ededed;
            }

            .item > {
                &:last-child {
                    border: none;
                }

                > .content {
                    padding: 0 43px 0 33px;

                    span {
                        color: #545454;
                    }
                }
            }

            .nav {
                padding: 0 43px 0 33px;

                span {
                    color: #b3b3bb;
                }
            }

            .item > .content, .nav {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                line-height: 37px;
                height: 38px;
                position: relative;

                > span {
                    display: inline-block;
                    width: 200px;
                    font-size: 14px;

                    &:nth-child(5) {
                        text-align: center;
                    }

                    button {
                        color: #545454;
                        margin-left: 15px;
                        cursor: pointer;

                        &:nth-child(1) {
                            margin-left: 0;
                        }
                    }
                }
            }

            .recharge {
                height: 0;
                overflow: hidden;
                background: #EDEDED;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                width: 100%;
                padding: 0 28px;

                > div {
                    &:nth-child(2) {
                        width: 447px;

                        span {
                            display: block;
                            font-size: 12px;
                            font-family: SourceHanSansCN-Light;
                            color: #808080;
                            line-height: 18px;

                            &:nth-child(1) {
                                font-size: 16px;
                                font-family: SourceHanSansCN-Regular;
                                color: #545454;
                                line-height: 30px;
                            }
                        }
                    }
                }

                #qrcode {
                    margin-left: 100px;
                }

                .ivu-input-number {
                    width: 452px;
                    padding: 0 10px;
                    background: rgba(242, 249, 255, 0.5);
                    border: 1px solid rgba(255, 97, 5, 0.5);
                    color: #545454;
                    font-size: 14px;
                    border-radius: 3px;
                }

                .ivu-input-number-default {
                    height: 28px;
                }

                .ivu-input-number-focused {
                    box-shadow: none;
                }

                .ivu-input-number,
                ivu-input-number-input {
                    border-radius: 0 2px 2px 0;
                }

            }

            .top {
                height: 125px !important;

                > div {
                    padding-right: 82px;

                    &:nth-child(1) {
                        width: calc(100% - 500px);
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;

                        > div {
                            p {
                                color: #808080;
                                font-size: 14px;
                                line-height: 24px;
                                height: 23px;

                                span {
                                    font-size: 12px;
                                    color: #b3b3bb;

                                    button {
                                        font-size: 14px;
                                        color: #545454;
                                        cursor: pointer;

                                    }
                                }
                            }
                        }

                        img {
                            width: 98px;
                            height: 98px;
                            margin: 0 0 0 139px;
                        }
                    }
                }
            }

            .draw {
                height: 220px !important;

                > div {
                    padding-right: 82px;

                    &:nth-child(1) {
                        width: 534px;

                        > div, > p {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            height: 34px;
                            line-height: 33px;
                            font-size: 12px;
                            font-family: SourceHanSansCN-Normal;
                            color: #808080;
                        }

                        > input, .inputNumber {
                            width: 100%;
                            padding: 0 10px;
                            height: 28px;
                            background: rgba(242, 249, 255, 0.5);
                            border: 1px solid rgba(255, 97, 5, 0.5);
                            color: #545454;
                            font-size: 14px;
                            border-radius: 3px;
                        }

                        > button {
                            width: 100%;
                            background: #212121;
                            border-radius: 3px;
                            line-height: 27px;
                            height: 28px;
                            text-align: center;
                            color: #fff;
                            cursor: pointer;
                            margin-top: 5px;

                            &:hover {
                                background: rgba(33, 33, 33, 0.85);
                            }
                        }
                    }

                }
            }
            .btn-N{
                color: #c2c2c2 !important;
            }
        }
    }
</style>

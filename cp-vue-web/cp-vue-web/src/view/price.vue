<template>
    <div class="price">
        <div class="data">
            <div v-if="!loading">
                <div class="item" v-for="(item,index) in dataList" :key="index" :id="'index'+ index">
                    <div class="header">
                        <div>
                            <p v-if="currentLanguage=='zh'">第 {{item.rounds}} 期</p>
                            <p v-if="currentLanguage=='en'">Round {{item.rounds}}</p>
                            <p v-if="currentLanguage=='ko'">{{item.rounds}} 라운드</p>
                            <p v-if="currentLanguage=='ja'">第 {{item.rounds}} ラウンド</p>
                            <p v-if="currentLanguage=='ru'">Раунд {{item.rounds}}</p>
                            <p>{{$t('home.elecFee')}}</p>
                            <p>${{formatNumberFloor(price,4)}} / T / {{$t('home.days')}}</p>
                            <p>{{$t('home.output')}}</p>
                            <p><span style="padding-left: 12px;color: #fff">开始挖矿时间 <span style="background-color: #4581FE">{{item.mineTime|formatDate('yyyy-MM-dd')}}</span></span> <span>${{formatNumberFloor(item.profit,4)}} / T / {{$t('home.days')}}</span></p>
                        </div>
                        <div>
                            <img src="../assets/images/futures.png" alt="">
                        </div>
                    </div>
                    <div class="con">
                        <div class="list" @mouseenter="active =k;parentIndex=index" @mouseleave="active=-1;parentIndex=-1" v-for="(v,k) in item.enequal" :key="k" @click="buy(v)">
                            <div v-show="v.sold>=1" class="sold-out">
                                <img src="../assets/images/soldOut.png" alt="">
                            </div>
                            <div class="title" :class="{'active':v.sold<1 && active == k && parentIndex==index,'not-active': active == -1 && parentIndex==-1,'showBorder':v.sold<1}">
                                <span>{{v.days}}{{$t('home.days')}}</span>
                                <span>1TH</span>
                            </div>
                            <div class="main">
                                <p>$ {{v.price}}/T/{{$t('home.days')}}<span></span></p>
                                <button v-if="v.sold < 1">{{$t('home.buy')}}</button>
                                <button v-else>{{$t('home.notBuying')}}</button>
                                <div>
                                    <span>{{$t('home.sellOut')}}：</span>
                                    <span><Progress :percent="formatNumberCeil(v.sold*100,2)" hide-info/></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <b v-if="loading" class="loading"><img src="../assets/images/loading.gif" alt=""></b>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'price',
        data() {
            return {
                period: 0,//周期 天数
                sliderValue: 0,//算力值
                loading: false,
                dataList: [],
                userChoose: [],//算理不相同的数组
                days: [],
                info: {},
                price: '',
                active: -1,
                parentIndex:-1,
            }
        },
        created() {
            if (this.$route.query.custom) {
                window.scrollTo(0, 460);
            }
            this.get_dataList();
            this.powerPrice();

        },
        computed: {
            currentLanguage() {
                return this.$store.state.language
            }
        },
        methods: {
            //购买
            buy(item) {
                if (localStorage.getItem('userInfo') == null || localStorage.getItem('userInfo') == 'null') {
                    localStorage.setItem('oldPath', this.$route.path);
                    this.$router.push(`/user/${'login'}`);
                    return;
                }
                if (item.sold >= 1) {
                    return;
                }
                item.hash = item.hashMax;
                item.isHashEqual = false;
                localStorage.setItem('data', JSON.stringify(item));
                this.$router.push('/order')
            },
            //自定义购买
            userBuy() {
                if (this.period == 0) {
                    return;
                }
                if (localStorage.getItem('userInfo') == null || localStorage.getItem('userInfo') == 'null') {
                    localStorage.setItem('oldPath', this.$route.path);
                    this.$router.push(`/user/${'login'}`);
                    return;
                }
                var number = Number(document.getElementsByClassName('ivu-slider-button')[0].innerText);
                if (number > this.info.hashMax || number < this.info.hashMin) {
                    this.$Message.error(this.$t('order.error[2]') + this.info.hashMin + '-' + this.info.hashMax);
                } else {
                    this.info.hash = number;
                    this.info.isHashEqual = false;
                    localStorage.setItem('data', JSON.stringify(this.info));
                    this.$router.push('/order');
                }
            },
            chooseDays(item) {
                this.period = item;
                for (var i in this.userChoose) {
                    if (this.userChoose[i].days == this.period) {
                        this.info = this.userChoose[i];
                    }
                }
            },
            get_dataList() {
                this.loading = true;
                this.$infoInfo({cancel: 'infoList', type: 'futures'}, res => {
                    this.loading = false;
                    if (res.code == 0) {
                        this.dataList = res.data.info;
                    }
                });
            },
            powerPrice() {
                this.$powerPrice({}, res => {
                    this.price = res.data.price
                })
            }
        }
    }
</script>
<style lang="less" scoped>

    .price {
        background: #fff;

        > div {
            width: 100%;
        }

        > .header {
            height: 360px;
            width: 100%;
            background: #72c0d8;
        }

        .data {
            #index0 {
                padding: 220px 0 0 0;
                background-size: 100% 824px;
                margin: 90px auto 0;
                background: url("../assets/images/package.png") no-repeat 50% 8%, url("../assets/images/price-bg1.png") no-repeat center;

                .header {
                    div{
                        p{
                            color: #4581FE;
                        }
                    }
                    padding-top: 40px;
                }
            }

            #index1 {
                background: url("../assets/images/price-bg2.png") no-repeat center;
                margin-top: 50px;
                .header {
                    div{
                        p{
                            color: #CCCCCC;
                        }
                    }
                }
            }

            .item {
                width: 100%;
                margin-bottom: 80px;
                position: relative;

                .header {
                    width: 1300px;
                    margin: auto;
                    text-align: right;
                    display: flex;
                    justify-content: flex-end;
                    >div {
                        &:nth-child(1){
                            > p{
                                color: #4581FE;
                                &:nth-child(1) {
                                    font-size: 42px;
                                }
                                &:nth-child(2), &:nth-child(4) {
                                    font-size: 12px;
                                    line-height: 30px;
                                }
                                &:nth-child(3), &:nth-child(5) {
                                    font-size: 16px;
                                    line-height: 28px;
                                }
                                &:nth-child(5) {
                                    width: 1200px;
                                    display: flex;
                                    justify-content: space-between;
                                }
                            }
                        }
                    }
                }

                .con {
                    position: relative;
                    margin: 10px 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding-bottom: 22px;

                    .list {
                        width: 270px;
                        height: 331px;
                        background: rgba(255, 255, 255, 1);
                        border: 1px solid rgba(220, 220, 220, 1);
                        box-shadow: 0px 0px 6px 1px rgba(0, 0, 0, 0.92);
                        &:not(:first-child) {
                            margin-left: 40px;
                        }
                        cursor: pointer;
                        position: relative;
                        .sold-out {
                            position: absolute;
                            right: 20px;
                            top: 210px;
                        }
                        .title.active{
                            transition: all .3s linear;
                            background-position: 50% 50%;
                            span{
                                color: #fff;
                                transition: all .5s linear;
                            }
                        }
                        .title.not-active{
                            transition: all .3s linear;
                            span{
                                color: rgba(75, 75, 75, 1);
                            }
                        }
                        .title {
                            padding: 35px 40px 5px;
                            border-left: 8px solid #cccccc;
                            background:url("../assets/images/coin-bg.png") no-repeat;
                            background-size: 268px 120px;
                            background-position: -270px 0;

                            span {
                                display: block;
                                color: rgba(75, 75, 75, 1);

                                &:nth-child(1) {
                                    font-weight: 500;
                                    font-size: 36px;
                                }
                                &:nth-child(2) {
                                    font-size: 14px;
                                }
                            }
                        }
                        .showBorder{
                            border-left: 8px solid #4976D3;
                        }
                        .main {
                            text-align: center;

                            > * {
                                text-align: center;
                            }

                            p {
                                text-align: left;
                                padding: 26px 40px 30px 40px;
                                color: #4976D3;
                                font-size: 24px;

                                span {
                                    display: block;
                                    height: 1px;
                                    width: 35px;
                                    margin-top: 30px;
                                    background: #BEBEBE;
                                }
                            }

                            button {
                                width: 189px;
                                height: 54px;
                                line-height: 53px;
                                text-align: center;
                                border: 1px solid #212121;
                                font-size: 16px;
                                color: #212121;
                                cursor: pointer;
                            }

                            > div {
                                display: flex;
                                justify-content: center;
                                margin-top: 10px;
                                font-size: 12px;
                                color: rgba(128, 128, 128, 1);
                            }
                        }
                    }
                }

            }
        }
    }
</style>



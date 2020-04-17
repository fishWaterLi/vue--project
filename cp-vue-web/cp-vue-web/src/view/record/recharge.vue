<template>
    <div class="top-up">
        <div class="title">
            <div>
                <span>{{$t('record.coinType')}}</span>
                <Select v-model="selectCoin" style="width:95px" class="select-coin">
                    <Option v-for="item in coinList" :value="item.code" :key="item.code">{{ item.code }}</Option>
                </Select>
            </div>
            <div class="date">
                <span>{{$t('record.date')}}</span>
                <div>
                    <DatePicker type="date" :editable="editable" v-model="startTime" placeholder="Select date"></DatePicker>
                    -
                    <DatePicker type="date" :editable="editable" v-model="endTime" placeholder="Select date"></DatePicker>
                </div>
            </div>
            <button @click="searchData" class="button">{{$t('record.search')}}</button>
        </div>
        <div class="con">
            <div class="nav">
                <span>{{$t('record.date')}}</span>
                <span>{{$t('record.coin')}}</span>
                <span>{{$t('record.type')}}</span>
                <span>{{$t('record.quantity')}}</span>
                <span>{{$t('record.status')}}</span>
                <span>{{$t('record.action')}}</span>
            </div>
            <b v-if="loading" class="loading"><img src="../../assets/images/loading.gif" alt=""></b>
            <b v-if="dataList.length==0" class="nodata"><img src="../../assets/images/nodata.png" alt="">
                <span>{{$t('noData')}}</span></b>
            <div v-else class="item" v-for="(item,index) in dataList" :class="{active: showDetail==index}" :key="index">
                <span>{{item.time | formatDate('yyyy-MM-dd hh:mm:ss')}}</span>
                <span>{{item.coin}}</span>
                <span>{{$t('control.deposit')}}</span>
                <span>{{item.volume}}</span>
                <span>{{item.status}}</span>
                <span @click="showDetail==index?showDetail=-1:showDetail=index">{{$t('record.detail')}}</span>
                <div class="detail">
                    <div>
                        <p>
                            <span>{{$t('record.processingTime')}}</span>
                            <span>{{item.time | formatDate('yyyy-MM-dd hh:mm:ss')}}</span>
                        </p>
                        <p>
                            <span>{{$t('record.TXID')}}</span>
                            <span>{{item.hash}}</span>
                        </p>
                    </div>
                </div>
            </div>
            <Page :total="totalData" class='reset-page' show-elevator :current="pageNum" :page-size="pageSizeSet" @on-change="change_page"
                  v-if="totalData > 0"></Page>
        </div>
    </div>
</template>
<script>
    import {formatDate} from '../../filters.js'

    export default {
        name: 'top-up',
        data() {
            return {
                showDetail: -1,
                selectCoin: 'All',//默认显示的币种
                startTime: formatDate(new Date().getTime() - 6 * 24 * 60 * 60 * 1000, 'yyyy-MM-dd'),//开始时间
                endTime: formatDate(new Date().getTime(), 'yyyy-MM-dd'),//结束时间
                dataList: [],
                coinList: [],
                totalData: 0,
                pageSizeSet: 10,
                pageNum: 1,
                editable: false,
                loading: false,
            }
        },
        mounted() {
            this.get_rechargeList();
            this.get_coinList();
        },
        methods: {
            //获取充币记录
            get_rechargeList() {
                let params = {
                    type: 'deposit',
                    coin: this.selectCoin == 'All' ? '' : this.selectCoin,
                    pageNum: parseInt(this.pageNum),
                    pageSize: parseInt(this.pageSizeSet),
                    startTime: new Date(this.startTime).getTime().toString(),
                    endTime: (new Date(this.endTime).getTime()+86399000).toString(),
                }
                if(params.startTime > params.endTime){
                    this.$Message.error(this.$t('record.timeRange'))
                    return
                }
                this.$withdrawalDetail(params, res => {
                    if(res.code == 0){
                        this.dataList = res.data.approveList
                        this.totalData = res.data.count
                    } else {
                        this.$Message.error(res.msg);
                    }
                })
            },
            //所搜
            searchData() {
                this.pageNum = 1
                this.get_rechargeList()
            },
            change_page(current) {
                this.pageNum = current
                this.get_rechargeList()
            },
            get_coinList() {
                this.coinList = JSON.parse(localStorage.getItem('coinList'));
                this.coinList.splice(0, 0, {code: 'All'});
            }
        }
    }
</script>
<style lang="less" scoped>
    .top-up {
        > .title {
            height: 48px;
            width: 100%;
            background: #fff;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            padding: 0 28px;
            > div {
                margin-right: 50px;
                display: flex;
                align-items: center;

                > span {
                    margin-right: 16px;
                    font-size: 14px;
                    font-family: SourceHanSansCN-Regular;
                    color: #b3b3b3;
                }
            }

            .date {
                display: flex;
                justify-content: flex-start;
                align-items: center;
            }
            .button{
                width: 80px;
                height: 32px;
                background:rgba(255,93,0,0.5);
                color: #fff;
                border-radius:3px;
                cursor: pointer;
            }
        }

        .item {
            span {
                &:last-child {
                    cursor: pointer;
                }
            }
        }
        .nav{
            padding: 0 28px;
        }
        .nav > span {
            color: #B3B3B3;
        }

        .item > span {
            color: #545454;
        }

        .con > div {
            background: #fff;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            line-height: 38px;
            height: 38px;
            margin-bottom: 2px;
            position: relative;

            > span {
                display: inline-block;
                width: 200px;
                text-align: left;
                font-size: 14px;
                &:nth-child(6) {
                    cursor: pointer;
                }
            }
            > .detail {
                visibility: hidden;
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                background: #EDEDED;
                display: flex;
                justify-content: flex-start;
                align-items: flex-start;

                > div {
                    width: 100%;

                    p {
                        width: 100%;
                        padding: 0 29px;

                        span {

                            font-family: SourceHanSansCN-Normal;

                            &:nth-child(1) {
                                font-size: 12px;
                                color: #808080;
                                margin-right: 10px;
                            }

                            &:nth-child(2) {
                                font-size: 14px;
                                color: #545454;
                            }
                        }
                    }
                }
            }
        }
        .item.active {
            height: 114px;
            > .detail {
                visibility: visible;
            }
        }

    }
</style>

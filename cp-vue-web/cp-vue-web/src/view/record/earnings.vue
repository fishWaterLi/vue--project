<template>
    <div class="other">
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
                    <DatePicker type="date" v-model="startTime" placeholder="Select date"></DatePicker>
                    -
                    <DatePicker type="date" v-model="endTime" placeholder="Select date"></DatePicker>
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
                <span>{{$t('record.tip')}}</span>
            </div>
            <b v-if="loading" class="loading"><img src="../../assets/images/loading.gif" alt=""></b>
            <b v-if="dataList.length==0&&!loading" class="nodata"><img src="../../assets/images/nodata.png" alt="">
                <span>{{$t('noData')}}</span></b>
            <div class="item" v-for="(item,index) in dataList" :key="index">
                <span>{{item.date | formatDate('yyyy-MM-dd hh:mm:ss')}}</span>
                <span>{{item.coin}}</span>
                <span>{{item.type}}</span>
                <span>{{item.profit}}</span>
                <span>{{item.remark}}</span>
            </div>
            <Page :total="count" class='reset-page' show-elevator :page-size="pageSizeSet" :current="pageNum" @on-change="change_page"
                  v-if="count > 0"></Page>
        </div>
    </div>
</template>
<script>
    import {formatDate} from '../../filters.js'
    export default {
        name: 'other',
        data() {
            return {
                showDetail: -1,
                selectCoin: 'All',//默认显示的币种
                startTime: formatDate(new Date().getTime() - 6 * 24 * 60 * 60 * 1000, 'yyyy-MM-dd'),//开始时间
                endTime: formatDate(new Date(), 'yyyy-MM-dd'),//结束时间
                loading: false,
                pageSizeSet: 10,
                count: 0,
                pageNum: 1,
                dataList: [],
                coinList: [],
            }
        },
        mounted() {
            this.get_dataList()
            this.get_coinList()
        },
        methods: {
            get_dataList() {
                let params = {
                    coin: this.selectCoin == 'All' ? '' : this.selectCoin,
                    start: new Date(this.startTime).getTime().toString(),
                    end: (new Date(this.endTime).getTime()+86399000).toString(),
                    pageNum: this.pageNum,
                    pageSize: this.pageSizeSet,
                }
                if(params.start > params.end){
                    this.$Message.error(this.$t('record.timeRange'))
                    return
                }
                this.$product(params, res => {
                    if (res.code == 0) {
                        this.dataList = res.data.product.list
                        this.count = res.data.product.count
                    } else {
                        this.$Message.error(res.msg)
                    }
                })
            },
            searchData() {
                this.pageNum = 1
                this.get_dataList()
            },
            change_page(current) {
                this.pageNum = current
                this.get_dataList()
            },
            get_coinList() {
                this.coinList = JSON.parse(localStorage.getItem('coinList'));
                this.coinList.splice(0, 0, {code: 'All'});
            }
        }
    }
</script>
<style lang="less" scoped>
    .other {
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
                background:rgba(255,93,0,1);
                opacity:0.5;
                border-radius:3px;
                cursor: pointer;
            }
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
            position: relative;
            margin-bottom: 2px;

            > span {
                display: inline-block;
                width: 200px;
                text-align: center;
                font-size: 14px;

                &:nth-child(4) {
                    text-align: left;
                }
            }

            > .detail {
                visibility: hidden;
                position: absolute;
                bottom: 10px;
                left: 10px;
                width: 100%;
                background: #f7f7f7;
                display: flex;
                justify-content: flex-start;
                align-items: flex-start;
                width: calc(100% - 20px);
                padding: 0 20px;

                > div {
                    &:nth-child(1) {
                        width: 580px;
                    }
                }
            }

        }

        .item.active {
            height: 127px;

            > .detail {
                visibility: visible;
            }
        }
    }
</style>

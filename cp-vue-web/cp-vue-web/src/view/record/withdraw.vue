<template>
    <div class="draw-money">
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
                <span>{{$t('record.fees')}}</span>
                <span>{{$t('record.status')}}</span>
                <span>{{$t('record.action')}}</span>
            </div>
            <b v-if="loading" class="loading"><img src="../../assets/images/loading.gif" alt=""></b>
            <b v-if="dataList.length==0" class="nodata"><img src="../../assets/images/nodata.png" alt=""> <span>{{$t('noData')}}</span></b>
            <div v-else class="item" v-for="(item,index) in dataList" :key="index" :class="{active: showDetail==index}">
                <span>{{item.time | formatDate('yyyy-MM-dd hh:mm:ss')}}</span>
                <span>{{item.coin}}</span>
                <!--<span>{{item.type}}</span>-->
                <span>{{$t('control.withdraw')}}</span>
                <span>{{item.volume}}</span>
                <span>{{item.money}}</span>
                <span>{{item.status}}</span>
                <span v-if="item.status=='Waitingforreview'" @click="cancel(item.id)">{{$t('record.cancel')}}</span>
                <span v-else @click="showDetail==index?showDetail=-1:showDetail=index">{{$t('record.detail')}}</span>
                <div class="detail">
                    <div>
                        <p>
                            <span>钱包处理时间</span>
                            <span>{{item.processTime | formatDate('yyyy-MM-dd hh:mm:ss')}}</span>
                        </p>
                        <p>
                            <span>区块链交易ID</span>
                            <span>{{item.address}}</span>
                        </p>
                    </div>
                    <!-- <div>
                        <span>链类型</span>
                        <span>ETH</span>
                    </div> -->
                </div>
            </div>
            <Page :total="totalData" :page-size="pageSizeSet" show-elevator class='reset-page' :current="pageNum"
                  @on-change="change_page" v-if="totalData > 0"></Page>
        </div>
    </div>
</template>
<script>
    import {formatDate} from '../../filters.js'

    export default {
        name: 'draw-money',
        data() {
            return {
                showDetail: -1,
                selectCoin: 'All',//默认显示的币种
                startTime: formatDate(new Date().getTime() - 6 * 24 * 60 * 60 * 1000, 'yyyy-MM-dd'),//开始时间
                endTime: formatDate(new Date(), 'yyyy-MM-dd'),//结束时间
                dataList: [],
                coinList: [],
                totalData: 0,
                pageSizeSet: 10,
                pageNum: 1,
                loading: false,
            }
        },
        mounted() {
            this.get_coinList()
            this.get_dataList()
        },
        methods: {
            // 获取提币列表
            get_dataList() {
                let params = {
                    type: 'withdrawal',
                    coin: this.selectCoin == 'All' ? '' : this.selectCoin,
                    pageNum: parseInt(this.pageNum),
                    pageSize: parseInt(this.pageSizeSet),
                    startTime: new Date(this.startTime).getTime().toString(),
                    endTime: (new Date(this.endTime).getTime() + 86399000).toString(),
                }
                if (params.startTime > params.endTime) {
                    this.$Message.error(this.$t('record.timeRange'))
                    return
                }
                this.$withdrawalDetail(params, res => {
                    if (res.code == 0) {
                        this.dataList = res.data.approveList
                        this.totalData = res.data.count
                    } else {
                        this.$Message.error(res.msg)
                    }
                })
            },
            // 取消提币
            cancel(id) {
                this.$withdrawalCancel({approveId: id.toString()}, res => {
                    if (res.code == 0) {
                        this.get_dataList()
                    } else {
                       this.$Message.error(res.msg)
                    }
                })
            },
            // 搜索
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
    .draw-money {
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

            .button {
                width: 80px;
                height: 32px;
                background: rgba(255, 93, 0, 1);
                opacity: 0.5;
                border-radius: 3px;
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

                &:nth-child(7) {
                    cursor: pointer;
                }
            }

            > .detail {
                visibility: hidden;
                position: absolute;
                bottom: 10px;
                left: 0;
                width: 100%;
                background: #f2f9ff;
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
            height: 127px;

            > .detail {
                visibility: visible;
            }
        }

    }
</style>

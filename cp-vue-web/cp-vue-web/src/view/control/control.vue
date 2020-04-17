<template>
    <div class="control">
        <div class="top">
            <div class="title">
                <span>BTC</span>
            </div>
            <div class="con">
                <div class="left">
                    <p>{{$t('control.top[0]')}}</p>
                    <div>
                        <span><em>{{statistic.hash?statistic.hash:0}}</em><span>TH</span></span>
                        <button>
                            <router-link to="/price">{{$t('control.top[2]')}}</router-link>
                        </button>

                    </div>
                </div>
                <div class="right">
                    <p>{{$t('control.top[1]')}}</p>
                    <p><em>{{statistic.profit?statistic.profit:0}}</em> BTC ≈ ${{statistic.usd?statistic.usd:0}}</p>
                </div>
            </div>
        </div>
        <div class="chart">
            <div class="title">
                <span :class="{'active':prowerType=='24'}" @click="cutDate('24')">24小时算力</span>
                <span :class="{'active':prowerType=='30'}" @click="cutDate('30')">30日算力</span>
            </div>
            <div class="con">
                <div class="header"></div>
                <div id="myChart"></div>
            </div>
        </div>
        <div class="bottom">
            <div class="title">
                <div class="tab">
                    <!-- 每日产出 -->
                    <span :class="{active:dataType== 0}" @click="changeTab(0)">{{$t('control.navList[0]')}}</span>
                    <!-- 每单产出 -->
                    <span :class="{active:dataType== 1}" @click="changeTab(1)">{{$t('control.navList[1]')}}</span>
                    <!-- 算力套餐值 -->
                    <span :class="{active:dataType== 2}" @click="changeTab(2)">{{$t('control.navList[2]')}}</span>
                </div>
                <div class="date" v-show="dataType== 0">
                    <DatePicker type="date" :editable="editable" v-model="startTime" placeholder="开始时间"
                                @on-change="timeChange()"></DatePicker>
                    -
                    <DatePicker type="date" :editable="editable" v-model="endTime" placeholder="结束时间"
                                @on-change="timeChange()"></DatePicker>
                </div>
                <div class="state" v-show="dataType== 2 || dataType== 1">
                    <!-- 全部 -->
                    <span :class="{'active': orderState=='all'}" @click="changeState('all')">{{$t('control.rightLab[0]')}}</span>
                    <!-- 等待中 -->
                    <span v-show="dataType== 2" :class="{'active': orderState=='wait'}"
                          @click="changeState('wait')">{{$t('control.rightLab[3]')}}</span>
                          <!-- 生效中 -->
                    <span :class="{'active': orderState=='current'}" @click="changeState('current')">{{$t('control.rightLab[1]')}}</span>
                    <!-- 已完成 -->
                    <span :class="{'active': orderState=='complete'}" @click="changeState('complete')">{{$t('control.rightLab[2]')}}</span> 

                </div>
            </div>
            <!--每日产出-->
            <div class="controlDay" v-show="dataType== 0">
                <div class="nav">
                    <span>{{$t('control.firstItem[0]')}}</span>
                    <span>{{$t('control.firstItem[1]')}}</span>
                    <span>{{$t('control.firstItem[2]')}}</span>
                </div>
                <b v-if="dayList.length==0" class="nodata"><img src="../../assets/images/nodata.png" alt="">
                    <span>{{$t('noData')}}</span></b>
                <div v-else class="item" v-for="(item,index) in dayList" :key="index">
                    <span>{{item.day | formatDate('yyyy-MM-dd')}}</span>
                    <span>{{item.hash}}T</span>
                    <span>{{formatNumberFloor(item.profit,8)}}BTC</span>
                </div>
                <Page :total="count" :page-size="pageSizeSet" show-elevator class='reset-page' @on-change="change_page"
                      v-if="count > 0"></Page>
            </div>
            <!--每单产出-->
            <div class="controlOrder" v-show="dataType== 1">
                <div class="nav">
                    <span>{{$t('control.secondItem[0]')}}</span>
                    <span>{{$t('control.secondItem[1]')}}</span>
                    <span>{{$t('control.secondItem[2]')}}</span>
                    <span>{{$t('control.secondItem[3]')}}</span>
                    <span>{{$t('control.secondItem[4]')}}</span>
                </div>
                <b v-if="orderList.length==0" class="nodata"><img src="../../assets/images/nodata.png" alt="">
                    <span>{{$t('noData')}}</span></b>
                <div v-else class="item" v-for="(item,index) in orderList" :key="index">
                    <span>{{item.id}}</span>
                    <span>{{formatNumberFloor(item.profit,8)}} BTC</span>
                    <span>{{item.hash}} T</span>
                    <span>{{item.start | formatDate('yyyy-MM-dd hh:mm:ss')}} -- {{item.end | formatDate('yyyy-MM-dd hh:mm:ss')}}</span>
                    <span>{{item.sur}} {{$t('home.days')}}</span>
                </div>
                <Page :total="count" :page-size="pageSizeSet" show-elevator class='reset-page' @on-change="change_page"
                      v-if="count > 0"></Page>
            </div>
            <!--算力套餐订单-->
            <div class="controlHash" v-show="dataType== 2">
                <div class="nav">
                    <span>{{$t('control.secondItem[0]')}}</span>
                    <span>{{$t('control.secondItem[1]')}}</span>
                    <span>{{$t('control.secondItem[2]')}}</span>
                    <span>{{$t('control.secondItem[3]')}}</span>
                    <span>{{$t('control.secondItem[4]')}}</span>
                </div>
                <b v-if="hashList.length==0" class="nodata"><img src="../../assets/images/nodata.png" alt="">
                    <span>{{$t('noData')}}</span></b>
                <div v-else class="item" v-for="(item,index) in hashList" :key="index">
                    <span>{{item.id}}</span>
                    <span>{{formatNumberFloor(item.profit,8)}}BTC</span>
                    <span>{{item.hash}}T</span>
                    <span>{{item.start | formatDate('yyyy-MM-dd hh:mm:ss')}} -- {{item.end | formatDate('yyyy-MM-dd hh:mm:ss')}}</span>
                    <span>{{item.sur}} {{$t('home.days')}}</span>
                </div>
                <Page :total="count" :page-size="pageSizeSet" show-elevator class='reset-page' :current="pageNum" @on-change="change_page"
                      v-if="count > 0"></Page>
            </div>
        </div>
        <div class="remind">
            <p>{{$t('control.remind')}}</p>
        </div>

    </div>
</template>
<script>
    import {formatDate} from '../../filters.js'
    const echarts = require('echarts/lib/echarts')
    require('echarts/lib/chart/line')
    require('echarts/lib/component/tooltip')
    require('echarts/lib/component/title')
    export default {
        name: 'control',
        data() {
            return {
                startTime: formatDate(new Date().getTime() - 6 * 24 * 60 * 60 * 1000, 'yyyy-MM-dd'),//开始时间
                endTime: formatDate(new Date(), 'yyyy-MM-dd'),//结束时间
                editable: false,
                dataType: 0,//0是每日产出  1是每单产出  2是套餐订单
                orderState: 'all',//订单状态
                statistic: {},//总算力、总收益
                count: 0,//总条数
                pageSizeSet: 10,//每页条数
                pageNum: 1, //当前页
                dayList: [], //每日产出
                orderList: [],//每单产出
                hashList: [],//算力套餐订单
                prowerType: '24',
            }
        },
        mounted() {
            this.statistics()
            this.getDay()
            this.get_statisticsCurrent();
            
        },
        methods: {
            cutDate(type) {
                if(this.prowerType!==type) {
                    if(type=='24') {
                        this.get_statisticsCurrent();
                    }else if(type=='30'){
                        this.get_quarter();
                    }
                    this.prowerType= type;
                }else{
                    return;
                }
            },
            drawLine(y,x) {
                let myChart = echarts.init(document.getElementById('myChart'));
                myChart.setOption({
                    tooltip : {
                        trigger: 'axis'
                    },
                    calculable : true,
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : false,
                            data : x
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            axisLabel : {
                                formatter: '{value}T'
                            }
                        }
                    ],
                    series : [
                        {
                            name:'算力',
                            type:'line',
                            data:  y,
                            markPoint : {
                                data : [
                                    {type : 'max', name: '最大值'},
                                    {type : 'min', name: '最小值'}
                                ]
                            },
                            markLine : {
                                data : [
                                    {type : 'average', name: '平均值'}
                                ]
                            }
                        },
                    ]
                },true);
            },
            //切换状态
            changeState(value) {
                this.orderState = value;
                this.pageNum = 1
                this.status = value == 'all' ? '' : value
                if (this.dataType == 1) {
                    this.getOrder()
                } else {
                    this.getHash()
                }
            },
            //切换页数
            change_page(current) {
                this.pageNum = current
                if (this.dataType == 0) {
                    this.getDay()
                } else if (this.dataType == 1) {
                    this.getOrder()
                } else {
                    this.getHash()
                }
            },
            //切换tab标签
            changeTab(value) {
                this.dataType = value
                this.orderState = 'all'
                if (value == 0) {
                    this.getDay()
                } else if (value == 1) {
                    this.getOrder()
                } else {
                    this.getHash()
                }
            },
            //获取每日产出数据
            getDay() {
                let param = {
                    coin: 'BTC',
                    start: new Date(this.startTime).getTime().toString(),
                    end: (new Date(this.endTime).getTime()+86399000).toString(),
                    pageSize: this.pageSizeSet,
                    pageNum: this.pageNum,
                    cancel: 'day'
                }
                if(param.start > param.end){
                    this.$Message.error(this.$t('record.timeRange'))
                    return
                }
                this.$consoleDay(param, res => {
                    if (res.code == 0) {
                        this.count = res.data.day.count
                        this.dayList = res.data.day.list
                    } else {
                        this.$Message.error(res.msg);
                    }
                })
            },
            //获取每单产出数据
            getOrder() {
                let param = {
                    coin: 'BTC',
                    status: this.orderState == 'all' ? '' : this.orderState,
                    pageSize: this.pageSizeSet,
                    pageNum: this.pageNum,
                    // cancel: 'order'
                }
                this.$consoleOrder(param, res => {
                    if (res.code == 0) {
                        this.count = res.data.order.count
                        this.orderList = res.data.order.list
                    } else {
                        this.$Message.error(res.msg);
                    }
                })
            },
            //获取算力套餐订单
            getHash() {
                let param = {
                    coin: 'BTC',
                    status: this.orderState == 'all' ? '' : this.orderState,
                    pageSize: this.pageSizeSet,
                    pageNum: this.pageNum,
                    cancel: 'hash'
                }
                this.$consoleHash(param, res => {
                    if (res.code == 0) {
                        this.count = res.data.hash.count
                        this.hashList = res.data.hash.list
                    } else {
                        this.$Message.error(res.msg);
                    }
                })
            },
            //切换日期
            timeChange() {
                this.getDay()
            },
            //总算力，总收益
            statistics() {
                let param = {
                    coin: 'BTC',
                    cancel: 'statisics'
                }
                this.$consoleStatistics(param, res => {
                    if (res.code == 0) {
                        this.statistic = res.data.statistics
                    } else {
                        this.$Message.error(res.msg);
                    }
                })
            },
            // 前30天每日算力
            get_quarter() {
                let param = {
                    coin: 'BTC',
                    cancel: 'quarter'
                }
                this.$quarter(param,res=>{
                    if(res.code==0) {
                        const date = this.getAll().reverse();
                        let y = [];
                        let flag = false;
                        for(let i in date) {
                            if(res.data.length > 0){
                                for(let j in res.data) {
                                    if(res.data[j].date===date[i]) {
                                        y.push(res.data[j].hash)
                                        flag = false;
                                        break;
                                    }else{
                                        flag = true;
                                    }
                                }
                                if(flag){
                                    y.push(0);
                                    flag = false;
                                }
                            }else {
                                y.push(0)
                            }
                        }
                        this.drawLine(y.reverse(),this.getAll());
                        
                    }else {
                        this.$Message.error(res.msg);
                    }
                })
            },
            formatDate(millSeconds,cut) {
                let rDate = new Date(millSeconds);
                let year = rDate.getFullYear();
                let month = 0;
                if(cut){
                    month = rDate.getMonth();
                }else{
                     month = rDate.getMonth() + 1;
                }
                if (month < 10) month = "0" + month;
                let date = rDate.getDate();
                if (date < 10) date = "0" + date;
                
                return (year + "-" + month + "-" + date);
            },
            getAll (begin, end) {
                if(end==null&&begin==null){
                    end = this.formatDate(new Date);
                    begin = this.formatDate(new Date,'cut');
                }
                var arr = [];
                var ab = begin.split("-");
                var ae = end.split("-");
                var db = new Date();
                db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);
                var de = new Date();
                de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);
                var unixDb = db.getTime() - 24 * 60 * 60 * 1000;
                var unixDe = de.getTime() - 24 * 60 * 60 * 1000;
                for (var k = unixDb; k <= unixDe;) {
                    //console.log((new Date(parseInt(k))).format());
                    k = k + 24 * 60 * 60 * 1000;
                    arr.push((this.formatDate(new Date(parseInt(k)))));
                }
                return arr;
            },
            // 当前总算力
            get_statisticsCurrent() {
                let param = {
                    coin: 'BTC',
                    cancel: 'statisticsCurrent'
                }
                this.$statisticsCurrent(param,res=>{
                    if(res.code==0) {
                        var arr = [],newArr=[];
                        let h = new Date().getHours();
                        for(let i=h;i<=24;i++) {
                            if(i>=h) {
                                arr.push(res.data[1].hash)
                            }
                        }
                        for(let j=0;j<24;j++) {
                            if(j<=h) {
                                arr.push(res.data[0].hash)
                            }
                        }
                        for(let k=0;k<arr.length;k++) {
                            if(k%2==0){
                                newArr.push(arr[k])
                            }
                        }



                        let today = [];
                        for(var i=0;i<=24;i++){
                            if(i<=h){
                                today.push(i)
                            }
                        }
                        var yesterDay = [];
                        for(var k=h;k<24;k++){
                            if(k>=h) {
                                yesterDay.push(k)
                            }
                        }
                        let timeArr = yesterDay.concat(today);
                        let arr1 = [];
                        let n = timeArr.length
                        for(let j=0;j<n;j++) {
                            if(j%2==0){
                                timeArr[j] = timeArr[j]+':00'
                                arr1.push(timeArr[j])
                            }
                        }
                        this.drawLine(newArr,arr1);
                    }else {
                        this.$Message.error(res.msg);
                    }
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .control {
        padding-bottom: 85px;
        .con{
            padding: 0 26px;
            #myChart{
                height: 240px;
            }
        }
        
        .top {
            background: #ffffff;
            .title {
                border-bottom: 1px solid #EDEDED;
                font-size: 24px;
                padding: 0 13px;

                span {
                    width: 50px;
                    text-align: center;
                    display: inline-block;
                    border-bottom: 3px solid #FF6005;
                    color: #FF6005;
                    height: 42px;
                    line-height: 41px;
                    cursor: pointer;
                }
            }

            .con {
                padding: 36px 20px 45px 20px;
                display: flex;
                align-items: center;
                justify-content: flex-start;

                .left {
                    margin-right: 290px;

                    p {
                        font-size: 16px;
                        color: #545454;
                    }

                    > div {
                        display: flex;
                        align-items: flex-end;
                        margin-top: 23px;

                        span {
                            display: flex;
                            align-items: flex-end;
                            font-weight: 400;

                            em {
                                color: #000000;
                                font-size: 44px;
                                margin-right: 5px;
                                line-height: 1;
                            }

                            span {
                                font-size: 14px;
                                color: #545454;
                            }
                        }
                        button {
                            width: 114px;
                            height: 32px;
                            line-height: 30px;
                            border: 1px solid #000000;
                            color: #545454;
                            font-size: 16px;
                            margin-left: 34px;
                            text-align: center;
                            a{
                                display: block;
                                width: 114px;
                                height: 32px;
                                line-height: 30px;
                            }
                        }
                    }
                }

                .right {
                    p {
                        font-size: 16px;

                        &:nth-child(2) {
                            margin-top: 23px;
                            height: 40px;
                            line-height: 39px;
                        }

                        em {
                            font-size: 40px;
                            color: #282828;
                        }
                    }
                }
            }
        }
        .chart{
            height: 333px;
            background: #fff;
            margin-top: 30px;
            .title {
                border-bottom: 1px solid #EDEDED;
                font-size: 24px;
                display: flex;
                align-items: center;
                justify-content: flex-start;
                padding: 0 27px;
                span {
                    font-size: 16px;
                    height: 52px;
                    line-height: 50px;
                    display: inline-block;
                    text-align: center;
                    color: #FF6005;
                    cursor: pointer;
                    margin-right: 76px;
                }
                span.active{
                    border-bottom: 3px solid #FF6005;
                }
            }
        }
        .bottom {
            background: #ffffff;
            margin-top: 30px;

            .title {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 27px;
                border-bottom: 1px solid #EDEDED;

                .tab {
                    span {
                        font-size: 16px;
                        height: 52px;
                        line-height: 50px;
                        display: inline-block;
                        text-align: center;
                        color: #FF6005;
                        cursor: pointer;
                        margin-right: 76px;
                    }

                    span.active {
                        border-bottom: 3px solid #FF6005;
                    }
                }

                .state {
                    background: #dcdcdc;
                    border-radius: 10px;

                    span {
                        font-size: 13px;
                        height: 26px;
                        border-radius: 10px;
                        line-height: 25px;
                        display: inline-block;
                        padding: 0 15px;
                        color: #000000;
                        cursor: pointer;
                    }

                    span.active {
                        color: #fff;
                        background: #FF873E;
                    }
                }

            }

            .nav, .item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 28px;
                border-bottom: 1px solid #EDEDED;
                span {
                    display: inline-block;
                    height: 38px;
                    line-height: 38px;
                    text-align: left;
                    min-width: 190px;
                    font-size: 14px;
                    &:nth-child(4) {
                        width: 350px;
                    }
                }
            }

            .item {
                span {
                    color: #545454;
                }
            }

            .nav {
                span {
                    color: #b3b3b3;
                }
            }

            .item {
                &:last-child {
                    border-bottom: none;
                }
            }
        }
        .remind{
            padding: 20px 0px;
            line-height: 32px;
            font-size: 15px;
            color: #545454;
        }
    }
</style>

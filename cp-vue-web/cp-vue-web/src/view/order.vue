<template>
    <div class="order" id="order">
        <div class="title">
            <p>{{$t('order.title')}}</p>
            <div></div>
        </div>
        <div class="con">
            <div class="top" :class="{'language':language=='zh'}">
                <div>
                    <span>{{$t('order.coin')}}</span>
                    <div>{{info.coin}}</div>
                </div>
                <div>
                    <span>{{$t('order.type')}}</span>
                    <div>{{$t('order.machineName')}}</div>
                </div>
                <div>
                    <span>{{$t('order.norms')}}</span>
                    <!--<div>50 SHA_256</div>-->
                    <div>SHA_256</div>
                </div>
                <div>
                    <span>{{$t('order.days')}}</span>
                    <div>{{info.days}}{{$t('home.days')}} <em>({{info.mineTime | formatDate('yyyy/MM/dd')}} - {{endTime}})</em> </div>
                </div>
                <div>
                    <span>{{$t('order.peice')}}</span>
                    <div>${{info.price}}/T/{{$t('home.days')}}</div>
                </div>
                <div>
                    <span>{{$t('order.buyNorms')}}</span>
                    <div>
                        <input type="text" v-model="info.hash" maxlength="16" @input="change_hash">
                    </div>
                    <!--<div v-if="isExprience||info.isHashEqual">{{info.hash}} -->
                        <!--<em @click="$router.push('/price?custom=true')" v-if="!isExprience">{{$t('order.custom')}}-->
                        <!--<Icon type="ios-arrow-forward" /></em> -->
                    <!--</div>-->
                </div>
                <!-- <div>
                    <span>{{$t('order.ticket')}}</span>
                    <div @click="get_ticketList" style="cursor: pointer;">{{ticket}}<Icon type="ios-arrow-forward" /></div>
                </div> -->
                <div>
                    <span>{{$t('order.amount')}}</span>
                    <div>${{amount}}</div>
                </div>
            </div>
            <div class="bottom" :class="{'language':language=='zh'}">
                <div>
                    <span>{{$t('order.payType')}}</span>
                    <div>
                        <span :class="{'active':coin==item.code}" @click="chooseType(item)" v-for="(item,index) in coinList" :key="index">{{item.code}}</span>
                    </div>
                </div>
                <div>
                    <span>{{$t('order.payAmount')}}</span>
                    <div>
                        <em :class="{'exprience':isExprience}">{{amountCoin}}</em>
                        <em v-if="isExprience">0</em>{{coin}}
                    </div>
                </div>
                <b v-if="language=='ja'"><em @click="protocolModal=true">契約書の内容</em>を詳しく読んて同意します<Checkbox v-model="agree"></Checkbox></b>
                <button @click="orderPay">{{$t('order.payOrder')}}</button>
                <b v-if="language=='ja'&&protocolName==''" style="margin:0;color:red">契約書の中のサーインを書いてください </b>
                <!-- <b v-if="language=='ja'&&protocolName!=''" style="margin:0;color:red">{{protocolName}} </b> -->
                <p>{{$t('order.usable')}}：{{account.available}} {{account.coin}} <router-link to="/control/property">{{$t('order.recharge')}}</router-link></p>
            </div>
        </div>
        <!-- 优惠券modal -->
        <Modal v-model="ticketModal" width="615" class="ticketModal">
            <p slot="header">
                <span>选择优惠券</span>
                <Icon type="md-close" @click="ticketModal=false;ticket='选择优惠券';ticketId='';DiscountNum=0"/>
                <img src="../assets/images/line.png" alt="">
            </p>
            <!-- 可用的 -->
            <div v-for="(item,index) in ticketList" :key="index" class="item">
                <!-- 代金券 -->
                <div v-if="item.Name=='代金券'" class="ticket-d">
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
                    <button @click="useTicket(item)">使用</button>
                </div>
                <!-- 满减券 -->
                <div v-if="item.Name=='满减券'"  class="ticket-m">
                    <div>
                        <div class="left">
                            <p>$<em>{{item.DiscountNum}}</em></p>
                            <p>满减券</p>
                        </div>
                        <div class="right">
                            <p>满{{item.SatisfiedNum}}使用</p>
                            <p>使用日期:{{item.StartTime | formatDate('yyyy-MM-dd')}}至{{item.EndTime| formatDate('yyyy-MM-dd')}}</p>
                        </div>
                    </div>
                    <button @click="useTicket(item)">使用</button>
                </div>
                <!-- 优惠券 -->
                <div v-if="item.Name=='优惠券'"  class="ticket-y">
                    <div>
                        <div class="left">
                            <p>$<em>{{item.DiscountNum}}</em></p>
                            <p>优惠券</p>
                        </div>
                        <div class="right">
                            <p>无门槛</p>
                            <p>使用日期:{{item.StartTime | formatDate('yyyy-MM-dd')}}至{{item.EndTime| formatDate('yyyy-MM-dd')}}</p>
                        </div>
                    </div>
                    <button @click="useTicket(item)">使用</button>
                </div>
            </div>
            <!-- 不可用的 -->
            <div v-for="(item,index) in noTicketList" :key="'0'+index" class="item">
                <!-- 满减券 -->
                <div v-if="item.Name=='满减券'"  class="ticket-m error">
                    <div>
                        <div class="left">
                            <p>$<em>{{item.DiscountNum}}</em></p>
                            <p>满减券</p>
                        </div>
                        <div class="right">
                            <p>满{{item.SatisfiedNum}}使用</p>
                            <p>使用日期:{{item.StartTime | formatDate('yyyy-MM-dd')}}至{{item.EndTime| formatDate('yyyy-MM-dd')}}</p>
                        </div>
                    </div>
                    <button>使用</button>
                </div>
            </div>
            <b v-if="noTicketList.length==0&&ticketList.length==0" class="nodata"><img src="../assets/images/nodata.png" alt=""><span>{{$t('noData')}}</span></b>
        </Modal>
        <!-- 订单确认modal -->
        <Modal v-model="orderModal" width="615" class="orderModal">
            <p slot="header">
                <span>{{$t('order.title')}}</span>
                <Icon type="md-close" @click="orderModal=false"/>
                <img src="../assets/images/line.png" alt="">
            </p>
            <div>
                <span>{{$t('order.coin')}}</span>
                <span>{{info.coin}}</span>
            </div>
            <div>
                <span>{{$t('order.days')}}</span>
                <span>{{info.days}}{{$t('home.days')}}</span>
            </div>
            <div>
                <span>{{$t('order.buyNumber')}}</span>
                <span>{{info.hash}}T</span>
            </div>
            <div>
                <span>{{$t('order.buyAmount')}}</span>
                <span><em>{{isExprience?'0':amountCoin}}</em> {{coin}}</span>
            </div>
            <button @click="affirmOrder">{{$t('order.confirmPay')}}</button>
        </Modal>
        <!-- 安全验证 -->
         <Modal v-model="verifyModal" width="610" class="verifyModal" :mask-closable='false'>
            <p slot="header">
                <span>{{$t('user.verify')}}</span>
                <Icon type="md-close" @click="verifyModal=false"/>
                <img src="../assets/images/line.png" alt="">
            </p>
            <div v-if="!isBindGACode" class="msg">
                <input type="text" v-model="code" @keyup.enter="orderVerify" :placeholder="$t('login.emailCode')">
                <button v-if="s>0">{{s}}</button>
                <button @click="startDown" v-else>{{$t('login.getCode')}}</button>
            </div>
            <div v-if="isBindGACode" class="gg">
                <!-- <div class="title">{{$t('login.codeTitle')}}</div> -->
                <input type="text" v-model="code"  @keyup.enter="orderVerify" :placeholder="$t('login.GACode')" >
            </div>
            <button @click="orderVerify">{{$t('ticket.confirm')}}</button>
        </Modal>
        <!-- 支付成功 -->
         <Modal v-model="successModal" width="610" class="successModal" @on-visible-change="toOrder">
            <p slot="header">
                <span>{{$t('order.payInfo')}}</span>
                <Icon type="md-close" @click="successModal=false"/>
                <img src="../assets/images/line.png" alt="">
            </p>
            <div>
                <p>{{$t('order.days')}}<em>{{info.days}}</em>{{$t('home.days')}}</p>
                <p>{{$t('order.succeed')}}</p>
            </div>
            
        </Modal>
        <!-- 协议 -->
        <Modal v-model="protocolModal" width="610" class="protocolModal" :mask-closable='false'>
            <p slot="header">
                <span>ELECHASHサービス契約</span>
                <Icon type="md-close" @click="protocolModal=false;protocolName=''"/>
                <img src="../assets/images/line.png" alt="">
            </p>
            <div class="text">
                <div>
                    <p>甲方：</p> 
                    <p>乙方：哈希电力（ELECHASH.COM</p> 
                    <div>
                        <p>一協力の方法</p> 
                        <p>甲方の契約期間中、乙方は甲方にクラウドマイニングサービスを提供し、マイニング収益を甲方のELECHASH.COMに登録した口座に振り込みます。</p>　
                    </div>
                   <div>
                       <p>二 支払い方法</p>
                       <p>甲方はネットで一括払いする。</p>
                   </div>
                    <div>
                        <p>三、権利と義務</p>
                        <p>（一）甲の権利と義務</p>
                        <p>1、甲は投資資金源が合法で、投資行為が法律、法規及び関連監督部門の規定に適合することを保証する。</p>
                        <p>2、甲は提供したすべての資料の真実、完備、合法、有効で、変更があったら、乙にお知らせして、変更の手続きをする。もし甲が真実の資料を提出しなかった場合、それによって発生した問題は甲が自ら責任を負うことになって、乙はこれに対していかなる責任を負担しない。</p>
                        <p>3、甲の乙に対する投資元金には契約期間中、利息は付されない。</p>
                        <p>4、甲は本契約を十分に理解しなければならない。</p>
                        <p>5、商品募集期間内に、甲の原因で投資元金がアカウントの残高から出金できない場合、本契約は有効ではなく、乙は責任を負わない。</p>
                        <p>6、甲は本契約とその条項に対して守秘義務がある、乙の書面の許可を得ず、甲はいかなる組織に対して乙と関係する業務資料と情報を提供してはならない。</p>
                        <p>7、乙は、甲が選んだ申請タイプによって甲の関連する資金口座に対して資金控除などの関連操作を行う権利があり、乙は別途甲の同意を得なくてもよい。</p>
                        <p>8、 甲はここで確認して、甲は本契約書に約束した投資商品、及び本契約書を締結する前又は後に購入した投資商品について、乙が認定したリスクが高いか、１回の取引金額が大きい標準、 乙は代金控除の際又は代金控除する前に甲と電話で再確認する必要はなく、乙は甲の承認申請に基づいて直接対応する金に対して凍結控除 などの処理を行う権利がある。</p>
                        <p>9、商品の関連規定により、甲は受けるべきその他の権利とその他の義務を履行すべきである。</p>
                        <p>（二）乙の権利と義務</p>
                        <p>1、乙は商品説明書に規定された料金標準と方法で関連費用を請求する権利がある.</p>
                        <p>2、乙は商品の説明書の約定にしたがい、支払うべき投資元金（ あれば、以下同じ） 及び収益（ あれば、以下同じ） を甲が指定した口座に引き入れる。 甲の原因によって投資の元金と収益が入金できない場合、甲は自らの責任を負わなければならない。乙はいかなる責任を負わないものとする。</p>
                        <p>3、乙は商品の規定に従って商品の関連情報を公開しなければならない。</p>
                        <p>4、別途の約束がある以外、乙は甲の税金を代納する責任を負わない。</p>
                        <p>5、乙は本契約とその条項に対して守秘義務を負って、甲の書面の許可を得ず、乙はいかなる組織に、甲と関係する業務資料及び情報を提供してはならない。</p>
                        <p>6、商品の説明書に従って乙または甲が有している事前停止権 以外、甲が違反行為を行った場合、乙は本契約を早期に中止する権利がある。</p>
                        <p>7、商品の関連規定により、乙が受けるべきその他の権利とその他の義務を履行すべきである。</p>
                        <p>8、電気料金とメンテナンス費は、為替レートと比率に基づいて毎日の収入から引かれます。</p>
                        <p></p>
                        <p></p>
                        <p></p>
                    </div>
                    <div>
                        <p>四、免责条款</p>
                        <p>（一）定価設定規則</p>
                        <p>マイニングマシン共有パッケージの価格は、仮想通貨の価格などのさまざまな要因に応じて調整されます。 実際の購入価格はユーザーの支払い時に対象となりますので、価格が変更された場合でも、ELECHASH.COMは差額に対する注文の補償を行いません</p>
                        <p>（二）計算力の変動説明</p>
                        <p>ELECHASH.COMが提供するパッケージは、実際の計算能力に対応していますが、実際の計算能力は、ネットワークやマイニングマシンの電力などの不安定な要因により変動する可能性があります。</p>
                        <p>（三）制御不能なリスクステートメント</p>
                        <p>ELECHASH.COMは、洪水、火山噴火、地震、地滑り、火災などの自然災害、そして中国政府による100年以内の評価 、暴風雨と悪天候、政府の行動と政府の指示、都市レベルの電力供給による事故、および戦争、ストライキ、混乱などの社会的異常など、予測できない、回避できない、または克服できない、次のような制御不可能なリスクによる損害については責任を負いません。</p>
                        <p>（四）返金不能</p>
                        <p>契約による、注文 が支払われた後、払い戻しはできない。</p>
                        <p>（五）使用範囲声明</p>
                        <p>ユーザーは、インターネットなどの違法行為を攻撃するためにELECHASH.COMが提供する計算能力を使用してはなりません、そうでなければ、ELECHASH.COMはあなたの計算能力を強制的に回復する 権利を持ちます。</p>
                    </div>
                    <div>
                        <p>五、紛争処理</p>
                        <p>（一）本契約の履行中に生じた紛争は、甲と乙の間の交渉によって解決されるものとする。交渉が失敗した場合、当事者は乙側地元の裁判所に提訴できる。</p>
                        <p>（二）訴訟の間、紛争中の部分は本契約の利用規約に影響しないは本契約は依然として利用規約を履行されなければならない。</p>
                    </div>
                    <div>
                        <p>六、契約の成立と終了</p>
                        <p>（一）契約が成立。</p>
                        <p>1.甲が投資商品を購入する場合は、商品が本契約に名前を入力、「同意する」をクリックして本契約の成立は（あいまいさを避けるために、本契約の成立条件ではありません）。本契約は、甲の投資元金がその取引口座から控除された場合には、投資商品の設定日に有効になる（ただし、乙が財務計画が設定されていないと宣言した場合を除く）。</p>
                        <p>2.本契約の有効発生後に製品 を取り消すことができない。この契約は、甲が名前を入力して「同意する」をクリックした後に効力を生じる。</p>
                        <p>（二）契約の終了</p>
                        <p>1、本契約は、本契約および商品の説明書に基づき、甲と乙の権利および義務の履行終了日に自動的に終了するものとする。</p>
                        <p>2、収入が電気料金を正常に支払うことができない場合、機械は停止され、60日間を超える場合は、契約を終了致します。</p>

                    </div>
                    <div>
                        <p>甲は宣言します：</p>
                        <p>（1）甲は、購入した投資商品に関する関連情報を読み、上記の文書および本契約の内容全体を十分に理解し、承認し、購入した投資商品の内容および発生する可能性のあるリスクを明確に理解します。 甲の投資決定は、甲の独立した判断のみに基づいており、投資商品の購入（販売）から生じるリスクとすべての影響を自分で引き受けます。</p>
                        <p>（2）甲は乙の関連業務担当者本契約に甲の義務を追加と甲の権利を免状、乙の責任および乙の一方的な一定の権利の保有を制限する条項は、甲に説明完了 。甲は上記の諸条件を自発的に受け入れ、両当事者はこの契約の諸条件の理解に完全に同意する。</p>
                    </div>
                    <div class="stamp">
                        <div>
                            <span>甲方署名：{{protocolName}}</span>
                            <p>日付：{{getNowFormatDate()}}</p>
                        </div>
                        <div>
                            <span>乙方署名：ELECHASH.COM</span>
                            <p>日付：{{getNowFormatDate()}}</p>
                        </div>
                    </div>
                </div>
                <div>
                    <span>甲方署名: </span>
                    <input type="text" v-model="protocolName" id="protocolName">
                </div>
                <p v-if="isProtocolName">正し名前を入力してください</p>
                <button @click="agreeProtocol">確認</button>
            </div>
        </Modal>
    </div>
</template>
<script>
//优惠券  1是不可用（已使用1 已过期0）   0是可用（未使用 未过期）
import {formatDate} from '../filters.js' 
export default {
    name: 'order',
    data() {
        return {
            coin: 'BTC',
            ticketModal: false,//优惠券modal
            orderModal: false,//订单确认modal
            verifyModal: false,//安全验证modal
            protocolModal: false, //条款协议modal
            protocolName:'',
            isProtocolName: false,
            agree: false,
            code: '',//验证码
            info: {},
            coinList: [],
            price: 0,//当前支付币种的美金价格  单位1
            ticketList: [],//可用优惠券列表
            noTicketList:[],//不可用优惠券列表
            account:{},//当前账户余额
            accountList:{},//账户余额列表
            ticket: '选择优惠券',
            ticketId:'',
            DiscountNum: 0,//优惠金额
            successModal: false,
            token:'',
            isBindGACode: false,//是否绑定谷歌
            price1: '',
            isExprience: false,
            s: 120,
            isClick: true,
            language:localStorage.getItem('language'),
            showPrecision:8,
        }
    },
    computed: {
        endTime () {
            return this.getNewData(formatDate(this.info.mineTime,'yyyy-MM-dd'),this.info.days)
        },
        amount() {
            return (this.info.price*this.info.hash*this.info.days-this.DiscountNum).toFixed(this.showPrecision)
        },
        amountCoin() {
            return this.formatNumberCeil(this.amount/this.price,this.showPrecision) 
        }
    },
    created() {
        window.addEventListener('setLanguage', ()=> {
            this.language = localStorage.getItem('language');
        })
        this.isBindGACode = JSON.parse(localStorage.getItem('userInfo')).isBindGACode
        this.info = JSON.parse(localStorage.getItem('data'));
        this.info.hash = this.info.hashMin;
        if(this.$route.query.isExprience=="true"){
            this.isExprience = true;
        }
        this.menu();
    },
    mounted() {
        this.get_price();//获取当前 币种的美元价格
        this.get_coinInfo(); //获取币种列表
        this.get_accountList();//获取账户余额
    },
    methods: {
        menu() {
          window.scrollTo(0,0);
        },
        // //获取验证码
        startDown() {
            this.grecaptcha().then((token)=>{
                let account = JSON.parse(localStorage.getItem('userInfo')).email
                this.s = 120;
                this.$getEmailCode({email:account,recaptchaCode: token},res=>{
                    if(res.code == 0){
                        this.countDown();
                        this.s = 120;
                    }else{
                        this.$Message.error(res.msg);
                    }
                });
            })
        },
        change_hash(value) {
            if(!/^([1-9][0-9]*)$/.test(this.info.hash)) {
                this.info.hash = this.info.hash.replace(value.data,'');
            }
        },
        agreeProtocol() {
            this.protocolName = this.protocolName.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
            var matches = this.protocolName.match(/\d+/g);
            if(this.protocolName=='' || matches!==null) {
                this.isProtocolName = true;
                document.getElementById('protocolName').focus()
                return;
            }
            this.isProtocolName = false;
            this.agree = true;
            this.protocolModal = false;
        },
        //选择支付方式
        chooseType(item) {
            this.coin = item.code;
            this.showPrecision = item.showPrecision;
            for(let i in this.accountList) {
                if(this.accountList[i].coin==this.coin) {
                    this.account = this.accountList[i];
                }
            }
            this.get_price();
        },
        //使用优惠券
        useTicket(value) {
            
            var amount = this.info.price*this.info.hash*this.info.days;
            if(value.Name=='满减券') {
                if(value.SatisfiedNum>amount) {
                    this.$Message.error('不满足该优惠券的使用条件');
                    return;
                }
            }
            this.ticketId = value.Id;
            this.DiscountNum = value.DiscountNum
            this.ticket = value.Name+'  -'+value.DiscountNum;
            this.ticketModal = false;
        },
        orderPay() {
            if(localStorage.getItem('userInfo')==null||localStorage.getItem('userInfo')=='null') {
                this.$router.push(`/user/${'login'}`);
            }
            if(this.language=='ja') {
                if(this.protocolName!==''&&this.agree==true) {
                    if(!this.isExprience) {
                        if(this.info.hash>this.info.hashMax||this.info.hash<this.info.hashMin){
                            this.$Message.error(this.$t('order.error[0]')+'('+this.info.hashMin+'-'+this.info.hashMax+')');
                            return;
                        }
                        if(Number(this.amountCoin)>Number(this.account.available)) {
                            this.$Message.error(this.$t('order.error[1]'));
                            return;
                        }
                        this.orderModal = true;
                    }else{
                        this.orderModal = true;
                    }
                    
                }else{
                    this.protocolModal = true;
                }
                return;
            }
            if(this.isExprience) {
                this.orderModal = true;
                return;
            }
            if(this.info.hash>this.info.hashMax||this.info.hash<this.info.hashMin){
                this.$Message.error(this.$t('order.error[0]')+'('+this.info.hashMin+'-'+this.info.hashMax+')');
                return;
            }
            if(Number(this.amountCoin)>Number(this.account.available)) {
                this.$Message.error(this.$t('order.error[1]'));
                return;
            }
           
            
            
            this.orderModal = true;
        },
        // 确认订单
        affirmOrder() {
            let params = {
                coin: this.info.coin,
                rounds: this.info.rounds,
                cycleId: this.info.days,
                realPayNum: String(this.info.hash),
                coinToUSD: this.price1,
                realPayCoin: this.coin,
                isHashEqual: false,
                name: this.protocolName,
                type: this.info.type
            }
            if(this.ticketId){
                params.couponId = this.ticketId;
            }
            this.grecaptcha().then((token)=>{
                params.recaptchaCode = token
                this.$orderNew(params,res=>{
                    if(res.code==0){
                        if(!this.isBindGACode){
                            this.countDown();
                        }
                        this.token = res.data.tempToken;
                        this.orderModal = false;
                        this.verifyModal = true;
                    }
                });
            })
        },
        // 订单支付验证
        orderVerify() {
            this.$orderVerify({tempToken:this.token,code:this.code},res=>{
                if(res.code==0){
                    this.verifyModal = false;
                    this.code=='';
                    this.successModal = true;
                }else{
                    this.$Message.error(res.msg);
                }
            });
        },
        // 支付
        toOrder(value) {
            if(!value) {
                this.$router.push('/control/control');
            }
        },
        //获取优惠券
        get_ticketList() {
            if(this.isExprience){
                this.$Message.error('体验价格不可使用优惠券')
                return
            }
            this.$coupon('',res=>{
                if(res.code==0) {
                    // this.ticketList = res.data.coupon[0].concat(res.data.coupon[1]);
                    this.ticketList = res.data.coupon[0];
                    this.noTicketList = res.data.coupon[1];
                    console.log(this.ticketList);
                    this.ticketModal = true;
                }
            });
        },
        //获取可支付的币种列表
        get_coinInfo() {
            this.$coinInfo({cancel:'coinInfo'},res=>{
                if(res.code==0) {
                   this.coinList = res.data.coinInfos;
                   
                }
            });
        },
        //获取账户余额
        get_accountList() {
             this.$accountList({cancel:'accountList'},res=>{
                if(res.code==0) {
                    this.accountList = res.data.accounts;
                    for(let i in res.data.accounts) {
                        if(res.data.accounts[i].coin==this.coin) {
                            this.account = res.data.accounts[i];
                        }
                    }
                }
            });
        },
        //换算美金价格
        get_price() {
            this.$usds({coin:this.coin,cancel:'account'},res=>{
                if(res.code==0) {
                   this.price = Number(res.data[this.coin]);
                   this.price1 = res.data[this.coin];
                }
            });
        },
        countDown () {
            if(this.isClick){
                this.isClick = false
                // 直接元素必须为button
                let timer = setInterval(() => {
                    this.s--;
                    if (this.s < 1) {
                        this.isClick = true
                        clearInterval(timer);
                    }
                }, 1000);
            }
        },
    }
}
</script>

<style lang="less" scoped>
.order{
    background: #131313;
    .title{
        width: 1171px;
        margin: auto;
        height: 117px;
        text-align: left;
        padding-top: 40px;
        >div{
            height: 30px;
            width: 100%;
            background:#212121;
        }
        >p{
            width: 290px;
            height: 47px;
            line-height: 46px;
            background: #FF6005;
            color: #fff;
            font-size: 24px;
            padding-left: 11px;
            position: relative;
            &::after{
                position: absolute;
                right: -47px;
                top: 0;
                content: '';
                width: 0; 
                height: 0; 
                border-top: 47px solid transparent;
                border-left: 47px solid #FF6005;
            }
        }
    }
    .con{
        .top{
            padding: 30px 0 15px 407px;
            background: #fff;
        }
        .bottom {
            padding: 20px 0 106px 407px;
            background: #E6E6E6;
            height: 357px;
            >div{
                &:nth-child(1) {
                    div{
                        span{
                            display: inline-block;
                            height: 25px;
                            line-height: 24px;
                            width: 73px;
                            font-size: 16px;
                            text-align: center;
                            color: #FF6005;
                            border: 1px solid #FF6005;
                            margin-right: 10px;
                            cursor: pointer;
                        }
                        span.active{
                            color: #fff;
                            background: #FF6005;
                        }
                    }
                    
                }
                &:nth-child(2) {
                    >div{
                        em{
                            margin: 0 5px;
                        }
                        .exprience{
                            text-decoration:line-through;
                            color: #888888;
                        }
                    }
                }
            }
            >b{
                display: block;
                width: 357px;
                color: #212121;
                text-align: center;
                font-weight: 400;
                margin-bottom: 15px;
                label{
                    margin-left: 5px;
                }
                em{
                    color: #FF6005;
                    cursor: pointer;
                }
            }
        }
        >div{
            width: 1171px;
            margin: auto;
            >div{
                display: flex;
                align-items: center;
                justify-content: flex-start;
                text-align: left;
                height: 25px;
                margin-bottom: 40px;
                &:last-child{
                    margin-bottom: 0;
                }
                >span{
                    width: 227px;
                    text-align: left;
                    display: inline-block;
                    height: 16px;
                    line-height: 16px;
                    color: #212121;
                    font-size: 16px;
                }
                >div{
                    height: 16px;
                    line-height: 16px;
                    color: #212121;
                    font-size: 16px;
                }
                &:nth-child(4) {
                    em{
                        color: #838383;
                        margin-left: 20px;
                    }
                }
                &:nth-child(6){
                    div{
                        height: 25px;
                        line-height: 24px;
                        display: flex;
                        align-items: center;
                        input{
                            width: 100%;
                            padding: 0 5px;
                            border: 1px solid rgba(190, 190, 190, 0.5);
                        }
                        em{
                            color: #FF6005;
                            font-size: 14px;
                            cursor: pointer;
                            margin-left: 50px;
                        }
                    }
                }
                &:nth-child(7) {
                    div,i{
                        color: #FF6005 !important;
                        
                    }
                    i{
                        font-size: 18px;
                    }
                }
                &:nth-child(8) {
                    div{
                        color: #000;
                    }
                }
            }
            >button{
                width: 357px;
                height: 36px;
                line-height: 35px;
                background: #212121;
                cursor: pointer;
                color: #fff;
                font-size: 16px;
            }
            >p{
                width: 357px;
                margin-top: 10px;
                color: #212121;
                text-align: center;
                a{
                    color: #FF6005;
                    cursor: pointer;
                }
            }
        }
        >.language{
            >div{
                >span{
                    width: 65px;
                    margin-right: 161px;
                    text-align-last:justify;
                    text-align:justify;
                    text-justify:distribute-all-lines; // 这行必加，兼容ie浏览器
                }
            }
        }
    }
}
</style>


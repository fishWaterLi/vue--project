<template>
    <div class="userInfo">
        <div class="title">
            <span>{{$t('user.title[0]')}}</span>
        </div>
        <div class="info">
            <div class="baseInfo">
                <div>
                    <h5>{{$t('user.title[1]')}}</h5>
                </div>
                <div>
                    <span>{{$t('user.account')}}</span>
                    <div>
                        <span>{{account}}</span>
                    </div>
                </div>
                <div>
                    <span>UID</span>
                    <div>
                        <span>{{UID}}</span>
                    </div>
                </div>
                <div>
                    <span>{{$t('user.lastLoginTime')}}</span>
                    <div>
                        <span>{{info.lastLoginTime | formatDate('yyyy-MM-dd hh:mm:ss')}} IP: {{info.lastLoginIp}}</span>
                    </div>
                </div>
                <div>
                    <span class="pr15">{{$t('user.certificationInfo')}}</span>
                    <div>
                        <span v-if="info.authStatus=='unAuth' || info.authStatus==''" class="unAuth">{{$t('user.notcertified')}}</span>
                        <span v-if="info.authStatus=='pending'" class="pending">{{$t('user.underReview')}}</span>
                        <span v-if="info.authStatus=='authFailed'" class="authFailed">{{$t('user.certificationFailed')}}</span>
                        <span v-if="info.authStatus=='authSucceed'" class="authSucceed">{{$t('user.certificationSuccess')}}</span>
                        <button v-if="info.authStatus=='unAuth' || info.authStatus==''" @click="toAuth">{{$t('user.goCertification')}}</button>
                        <span v-if="info.authStatus=='pending'">{{$t('user.underReview')}}</span>
                        <button v-if="info.authStatus=='authFailed'" class="fail" @click="fildModal=true">{{$t('user.viewReason')}}</button>
                        <button v-if="info.authStatus=='authSucceed'" class="succ" @click="succModal=true">{{$t('user.certificationInfo')}}</button>
                    </div>
                </div>
            </div>
            <div class="safeSet">
                <div>
                    <span>{{$t('user.title[2]')}}</span>
                    <span v-if="!$store.state.bindGoogle">{{$t('user.securityLevel')}}:<em style="color: red">{{$t('user.low')}}</em></span>
                    <span v-else>{{$t('user.securityLevel')}}:<em style="color: green">{{$t('user.height')}}</em></span>
                </div>
                <div>
                    <span>{{$t('user.loginPassword')}}</span>
                    <div>
                        <span>******</span>
                        <button @click="setPwd=true">{{$t('user.modify')}}</button>
                    </div>
                </div>
                <div>
                    <span>{{$t('user.email')}}</span>
                    <div>
                        <span>{{info.email}}</span>
                    </div>
                </div>
                <div>
                    <span>{{$t('user.cellphoneNumber')}}</span>
                    <div>
                        <span>{{$t('user.notOpen')}}</span>
                    </div>
                </div>
                <div>
                    <span class="pr15">{{$t('user.GAverify')}}</span>
                    <div>
                        <span v-if="!$store.state.bindGoogle">{{$t('user.unBing')}}</span>
                        <span v-else>{{$t('user.bing')}}</span>
                        <button v-if="!$store.state.bindGoogle"><router-link to="/google">{{$t('user.unbinding')}}</router-link></button>
                        <button v-else class="bind">{{$t('user.bing')}}</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="history">
            <div class="header">
                <span @click="history(0)" :class="{'active': loginHistory}">{{$t('user.loginHistory')}}</span>
                <span @click="history(1)" :class="{'active': !loginHistory}">{{$t('user.setHistory')}}</span>
            </div>
            <div v-show="loginHistory">
                <div class="nav">
                    <span>{{$t('user.time')}}</span>
                    <span>{{$t('user.loginStatus')}}</span>
                    <span>{{$t('user.loginDevice')}}</span>
                    <span>IP</span>
                </div>
                <div v-if="LoginHistory.length==0" class="nodata">{{$t('noData')}}</div>
                <div v-else class="item" v-for="(item,index) in LoginHistory" :key="index">
                    <span>{{item.time | formatDate('yyyy-MM-dd hh:mm:ss')}}</span>
                    <span>{{item.status}}</span>
                    <span>{{item.equipment}}</span>
                    <span>{{item.ip}}</span>
                </div>
            </div>
            <div v-show="!loginHistory">
                <div class="nav">
                    <span>{{$t('user.time')}}</span>
                    <span>{{$t('user.device')}}</span>
                    <span>{{$t('user.title[2]')}}</span>
                    <span>IP</span>
                </div>
                <div v-if="SecuritySettingsHistory.length==0" class="nodata">{{$t('noData')}}</div>
                <div v-else class="item" v-for="(item,index) in SecuritySettingsHistory" :key="index">
                    <span>{{item.time | formatDate('yyyy-MM-dd hh:mm:ss')}}</span>
                    <span>{{item.equipment}}</span>
                    <span>{{item.settings }}</span>
                    <span>{{item.ip}}</span>
                </div>
            </div>
        </div>
        <!-- 登录密码 -->
        <Modal v-model="setPwd" width="615" @on-cancel="$refs.formValidate.resetFields()" closable class="code">
            <p slot="header" style="text-align:center">
                <span>{{$t('user.modifyPassword')}}</span>
                <Icon type="md-close" @click="setPwd=false"/>
                <img src="../../assets/images/line.png" alt="">
            </p>
            <div style="text-align:center">
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate">
                    <FormItem prop="oldPassword">
                        <input v-model="formValidate.oldPassword" :placeholder="$t('login.pleasePassword')" type="password">
                    </FormItem>
                    <FormItem prop="newPassword">
                        <input v-model="formValidate.newPassword" :placeholder="$t('register.pleasePassword')" type="password">
                    </FormItem>
                    <FormItem prop="passwordCheck">
                        <input v-model="formValidate.passwordCheck" :placeholder="$t('register.regPassword')" @keyup.enter.native="sendCode('01')" type="password">
                    </FormItem>
                </Form>
            </div>
            <button  class="footer" @click="sendCode('01')">{{$t('user.confirm')}}</button>
        </Modal>
        <!--身份认证-->
        <Modal v-model="auth" width="615" @on-cancel="$refs.authInfo.resetFields()" :closable="true">
            <p slot="header" style="text-align:center">
                <span>{{$t('kyc.title')}}</span>
                <Icon type="md-close" @click="auth=false"/>
                <img src="../../assets/images/line.png" alt="">
            </p>
            <div class="kycModal">
                <Form ref="authInfo" :model="authInfo" :rules="authValidate" label-position="right" :label-width="100">
                    <FormItem prop="name" :label="$t('kyc.firstName')">
                        <Input type="text" :placeholder="$t('kyc.firstName')" v-model="authInfo.name"/>
                    </FormItem>
                    <FormItem prop="lastName" :label="$t('kyc.lastName')">
                        <Input type="text" :placeholder="$t('kyc.lastName')" v-model="authInfo.lastName"/>
                    </FormItem>
                    <FormItem prop="select" :label="$t('kyc.type')">
                        <Select v-model="authInfo.select">
                            <Option v-for="item in options" :value="item.value" :key="item.value">{{item.label}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem prop="carNum" :label="$t('kyc.number')">
                        <Input type="text" :placeholder="$t('kyc.number')" v-model="authInfo.carNum"/>
                    </FormItem>

                </Form>
            </div>
            <div class="sure">
                <Button class="footer" type="primary" size="large" long @click="authSubmit('02')">{{$t('kyc.btn')}}</Button>
            </div>
        </Modal>
        <!-- 设置资金密码 -->
        <!-- <Modal v-model="setCapital" width="615" class="delGAModal set" @on-cancel="$refs.fundPwdForm.resetFields()">
            <p slot="header" style="text-align:center">
                <span>设置资金密码</span>
            </p>
            <div style="text-align:center">
                <Form ref="fundPwdForm" :model="fundPwdForm" :rules="fundPwdRule">
                    <FormItem prop="fundPwd">
                        <Input v-model="fundPwdForm.fundPwd" :placeholder="$t('public.fundPwd')" type="password"/>
                    </FormItem>
                    <FormItem prop="reFundPwd">
                        <Input v-model="fundPwdForm.reFundPwd" :placeholder="$t('public.repassword')" @keyup.enter.native="sendCode('02')" type="password"/>
                    </FormItem>
                </Form>
            </div>
            <div>
                <Button class="footer" type="primary" size="large" long @click="sendCode('02')">确认修改</Button>
            </div>
        </Modal> -->
        <!-- 修改资金密码 -->
        <!-- <Modal v-model="updataCapital" width="615" @on-cancel="$refs.updataValidate.resetFields()" class="delGAModal set">
            <p slot="header" style="text-align:center">
                <span>修改资金密码</span>
                <img src="../../assets/images/line.png" alt="">
            </p>
            <div style="text-align:center">
                <Form ref="updataValidate" :model="updataValidate" :rules="updataRule">
                    <FormItem prop="fundPwd">
                        <Input v-model="updataValidate.fundPwd" :placeholder="$t('public.oldPassword')" type="password"/>
                    </FormItem>
                    <FormItem prop="newFundPwd">
                        <Input v-model="updataValidate.newFundPwd" :placeholder="$t('public.password')" type="password"/>
                    </FormItem>
                    <FormItem prop="reFundPwd">
                        <Input v-model="updataValidate.reFundPwd" :placeholder="$t('public.repassword')" @keyup.enter.native="sendCode('03')" type="password"/>
                    </FormItem>
                </Form>
            </div>
            <div>
                <Button class="footer" type="primary" size="large" long @click="sendCode('03')">确认修改</Button>
            </div>
        </Modal> -->
        <!-- 验证码 -->
        <Modal v-model="codeModal" width="601" class="code" @on-cancel="codeModal=false; code=''" :mask-closable='false'>
            <p slot="header" style="text-align:center">
                <span>{{$t('login.codeTitle')}}</span>
                <Icon type="md-close" @click="codeModal=false"/>
                <img src="../../assets/images/line.png" alt="">
            </p>
             <div v-if="!$store.state.bindGoogle">
                <Input v-model='code' :placeholder="$t('login.emailCode')" ref='re' @keyup.enter.native="submit" style="width:245px;"/>
                <button v-if="s>0">{{s}}</button>
                <button @click="startDown" v-else>{{$t('login.getCode')}}</button>
            </div>
            <!-- <p>请输入谷歌验证码</p> -->
            <div v-if="$store.state.bindGoogle">
                <Input v-model='code' :placeholder="$t('login.GACode')" ref='re' @keyup.enter.native="submit" style="width:365px;"/>
            </div>
            <button @click="submit" :style="{'width':'365px'}">{{$t('control.confirm')}}</button>
        </Modal>
        <!-- 关闭谷歌验证 -->
        <Modal v-model="delGAModal" width="601" class="code" :mask-closable='false'>
            <p slot="header" style="text-align:center">
                <span>{{$t('user.turnOffGA')}}</span>
                <Icon type="md-close" @click="delGAModal=false"/>
                <img src="../../assets/images/line.png" alt="">
            </p>
            <div>
                <p style="margin-bottom:10px">{{$t('user.GAtip')}}</p>
                <Input v-model='code' :placeholder="$t('login.GACode')" ref='re' @keyup.enter.native="closeGA" style="width:365px;"/>
            </div>
            <button @click="closeGA" :style="{'width':'365px'}">{{$t('control.confirm')}}</button>
        </Modal>
        <!-- 认证失败 -->
        <Modal v-model="fildModal" width="601">
            <p slot="header" style="text-align:center">
                <span>{{$t('user.idFailed')}}</span>
                <Icon type="md-close" @click="fildModal=false"/>
                <img src="../../assets/images/line.png" alt="">
            </p>
            <div style="text-align:center">
                <p>{{info.info}}</p>
            </div>
            <div>
                <Button class="footer" type="primary" size="large" long @click="$router.push('/auth')">{{$t('user.Recertification')}}</Button>
            </div>
        </Modal>
        <!-- 认证成功 -->
        <Modal v-model="succModal" width="601" class="authInfo">
            <p slot="header" style="text-align:center">
                <span>{{$t('user.certificationInfo')}}</span>
                <Icon type="md-close" @click="succModal=false"/>
                <img src="../../assets/images/line.png" alt="">
            </p>
            <div style="text-align:center" v-if="info.authStatus=='authSucceed'">
                <p><span>{{$t('user.certificationInfo')}}</span> <span>{{info.info.firstName}} {{info.info.lastName}}</span></p>
                <p v-if="info.info.idType==1"><span>{{$t('kyc.type')}}</span> <span>{{$t('kyc.idCard')}}</span></p>
                <p v-if="info.info.idType==2"><span>{{$t('kyc.type')}}</span><span>{{$t('kyc.passport')}}</span></p>
                <p v-if="info.info.idType==3"><span>{{$t('kyc.type')}}</span> <span>{{$t('kyc.driverCard')}}</span></p>
            </div>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>
<script>
    import {check_password,check_fundPwd} from '../../common'
    export default {
        name: 'userInfo',
        data() {
            //登录密码
            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error(this.$t('login.pleasePassword')));
                } else {
                    if(!check_password(value)){
                        callback(new Error(this.$t('register.errorAccount[2]')));
                    }
                    if (this.formValidate.passwordCheck !== '') {
                        // 对第二个密码框单独验证
                        this.$refs.formValidate.validateField('passwordCheck');
                    }
                    callback();
                }
            };
            const validatePassCheck = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error(this.$t('register.errorPassword[1]')));
                } else if (value !== this.formValidate.newPassword) {
                    callback(new Error(this.$t('register.errorPassword[0]')));
                } else {
                    callback();
                }
            };
            //设置资金密码
            const validateFundPwd = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('Please enter your password'));
                } else {
                    if(!check_fundPwd(value)){
                        callback(new Error('资金密码为6数字'));
                    }
                    if (this.fundPwdForm.fundPwd !== '') {
                        // 对第二个密码框单独验证
                        this.$refs.fundPwdForm.validateField('reFundPwd');
                    }
                    callback();
                }
            };
            const validateFundPwdCheck = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('Please enter your password again'));
                } else if (value !== this.fundPwdForm.fundPwd) {
                    callback(new Error('The two input passwords do not match!'));
                } else {
                    callback();
                }
            };
            //修改资金密码
            const updatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('Please enter your password'));
                } else {
                    if(!check_fundPwd(value)){
                        callback(new Error('资金密码为6数字'));
                    }
                    if (this.updataValidate.reFundPwd !== '') {
                        // 对第二个密码框单独验证
                        this.$refs.updataValidate.validateField('reFundPwd');
                    }
                    callback();
                }
            };
            const updatePassCheck = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('Please enter your password again'));
                } else if (value !== this.updataValidate.newFundPwd) {
                    callback(new Error('The two input passwords do not match!'));
                } else {
                    callback();
                }
            };
            return {
                rec_token: '', // 获取谷歌验证的token
                closeAuth: true,
                loginHistory: true,//是否显示登录历史
                setPwd: false,//修改登录密码弹框
                setCapital: false,//设置资金密码弹框
                auth: false,//身份认证
                updataCapital: false,//修改资金密码弹框
                codeModal: false,//验证码弹框
                type: '00',//01 是修改密码   02是修改资金密码
                options: [{
                    label: this.$t('kyc.idCard'),
                    value: 1
                },
                    {
                        label: this.$t('kyc.passport'),
                        value: 2
                    },
                    {
                        label: this.$t('kyc.driverCard'),
                        value: 3
                    }],
                //修改登录密码
                formValidate: {
                    oldPassword: '',//原始密码
                    newPassword: '',//新密码
                    passwordCheck: '',//修改重复密码
                },
                ruleValidate: {
                    oldPassword: [
                        { required: true, message: this.$t('register.errorPassword[1]'), trigger: 'blur' }
                    ],
                    newPassword: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    passwordCheck: [
                        { validator: validatePassCheck, trigger: 'blur' }
                    ],
                },
                //设置资金密码
                fundPwdForm:{
                    fundPwd: '',//资金密码
                    reFundPwd: ''// 重复资金密码
                },
                //KYC认证信息
                authInfo:{
                    name: '',
                    lastName: '',
                    carNum: '',
                    select: 1,
                },
                authValidate: {
                    name: [
                        { required: true, message: this.$t('kyc.error[1]'), trigger: 'blur' },
                    ],
                    lastName: [
                        { required: true, message: this.$t('kyc.error[0]'), trigger: 'blur' }
                    ],
                    carNum: [
                        { required: true, message:this.$t('kyc.error[2]'), trigger: 'blur' }
                    ]
                },
                fundPwdRule:{
                    fundPwd: [
                        { validator: validateFundPwd, trigger: 'blur' }
                    ],
                    reFundPwd: [
                        { validator: validateFundPwdCheck, trigger: 'blur' }
                    ],
                },
                //修改资金密码
                updataValidate:{
                    fundPwd: '',//旧资金密码
                    newFundPwd: '',// 新资金密码
                    reFundPwd: ''// 重复新资金密码
                },
                updataRule:{
                    fundPwd: [
                        { required: true, message: this.$t('register.errorPassword[1]'), trigger: 'blur' }
                    ],
                    newFundPwd: [
                        { validator: updatePass, trigger: 'blur' }
                    ],
                    reFundPwd: [
                        { validator: updatePassCheck, trigger: 'blur' }
                    ],
                },
                delGAModal: false,//解绑谷歌验证吗
                fildModal: false,//认证失败弹框
                succModal: false,//认证失败弹框
                token: '',//临时token
                code: '',//资金、密码、谷歌----验证码
                account: '',//账号
                UID:'',//uid
                info:{},//用户信息
                LoginHistory: [],
                SecuritySettingsHistory: [],
                s: 120,
                isClick: true,
                recordTab: 0,
            }
        },
        created() {
            this.account = JSON.parse(localStorage.getItem('userInfo')).name;
            this.UID = JSON.parse(localStorage.getItem('userInfo')).id;
            this.get_userInfo();
            this.get_logList();
        },
        computed:{
            currentLanguage(){
                return this.$store.state.language
            }
        },
        watch:{
            currentLanguage(){
                   this.options = [{
                        label: this.$t('kyc.idCard'),
                        value: 1
                    },
                    {
                        label: this.$t('kyc.passport'),
                        value: 2
                    },
                    {
                        label: this.$t('kyc.driverCard'),
                        value: 3
                    }],

                    this.authValidate =  {
                    name: [
                        { required: true, message: this.$t('kyc.error[1]'), trigger: 'blur' },
                    ],
                    lastName: [
                        { required: true, message: this.$t('kyc.error[0]'), trigger: 'blur' }
                    ],
                    carNum: [
                        { required: true, message:this.$t('kyc.error[2]'), trigger: 'blur' }
                    ]
                }
                this.ruleValidate.oldPassword = [
                        { required: true, message: this.$t('register.errorPassword[1]'), trigger: 'blur' }
                    ],
                this.history(this.recordTab);
            }
        },
        methods: {
            //倒计时
            startDown(){
                this.grecaptcha().then((token)=>{
                    this.$getEmailCode({email:this.account,recaptchaCode: token},res=>{
                        if(res.code == 0){
                            this.countDown();
                            this.s = 120;
                        }else{
                            this.$Message.error(res.msg);
                        }
                    });
                })
            },
            history(i) {
                this.recordTab = i;
                i==0?this.loginHistory=true:this.loginHistory=false;
                this.get_logList();
            },
            get_logList() {
                let data = {
                    history: this.loginHistory?1:2,
                    items: 5
                }
                this.$logList(data,res=>{
                    if(res.code==0){
                        this.loginHistory?this.LoginHistory = res.data.logList:this.SecuritySettingsHistory = res.data.logList;
                    }
                })
            },
            get_userInfo() {
                this.$userInfo({cancel:'userInfo'},res=>{
                    if(res.code==0){
                        let data = JSON.parse(localStorage.getItem('userInfo'));

                        let userArray = []; //userInfo接口返回回来的所有字段名
                        let userKeyArray = []; //userInfo接口返回回来的所有值
                        Object.keys(res.data.base).forEach(function(key){
                            userArray.push(key);
                            userKeyArray.push(res.data.base[key]);

                        });
                        Object.keys( res.data.security).forEach(function(key){
                            userArray.push(key)
                            userKeyArray.push(res.data.security[key]);

                        });
                        Object.keys(res.data.kyc).forEach(function(key){
                            userArray.push(key)
                            userKeyArray.push(res.data.kyc[key]);

                        });
                        // 本地存储的key值
                        let localAray = [];
                        Object.keys(data).forEach(function(key){
                            localAray.push(key)
                            for(let i=0;i<userArray.length;i++){
                                if(userArray[i]==key){
                                    data[key] = userKeyArray[i];
                                }
                                if(localAray.indexOf(userArray[i])==-1){
                                    data[userArray[i]] = userKeyArray[i];
                                }
                            }

                        });
                        this.$store.commit('changeGoogle',data.isBindGACode);
                        this.$store.commit('changeFundPwd',data.isSetFundPwd);
                        this.info = data;
                        // localStorage.setItem('userInfo',JSON.stringify(data));
                        this.$setItem('userInfo', JSON.stringify(data));
                    }else{
                        this.$Message.error(res.msg);
                    }
                });
            },
            //验证并且发送验证码
            sendCode(value) {
                //01 是修改密码   02是设置资金密码   03是修改资金密码
                this.type = value;
                this.grecaptcha().then((token)=>{
                    if(value=='01'){
                        this.$refs.formValidate.validate((valid) => {
                            if(valid){
                                let params = {
                                    oldUserPwd: this.formValidate.oldPassword,
                                    newUserPwd: this.formValidate.passwordCheck,
                                    recaptchaCode: token,
                                }
                                this.$changePassword(params,res=>{
                                    if(res.code==0){
                                        if(!this.$store.state.bindGoogle){
                                            this.countDown();
                                        }
                                        this.$refs.formValidate.resetFields()
                                        this.token = res.data.tempToken;
                                        this.setPwd=false;
                                        this.codeModal = true;
                                    }else {
                                        this.$Message.error(res.msg);
                                    }
                                });
                            }
                        })
                    }else if(value=='02'){
                        this.$refs.fundPwdForm.validate((valid) => {
                            if(valid){
                                let params = {
                                    fundPwd: this.fundPwdForm.fundPwd,
                                    recaptchaCode: token,
                                }
                                this.$fundPwd(params,res=>{
                                    if(res.code==0){
                                        if(!this.$store.state.bindGoogle){
                                            this.countDown();
                                        }
                                        this.$refs.fundPwdForm.resetFields();
                                        this.token = res.data.tempToken;
                                        this.setCapital=false;
                                        this.codeModal = true;
                                    }else {
                                        this.$Message.error(res.msg);
                                    }
                                });
                            }
                        })
                    }else if(value=='03'){
                        this.$refs.updataValidate.validate((valid) => {
                            if(valid){
                                let params = {
                                    oldFundPwd: this.updataValidate.fundPwd,
                                    newFundPwd: this.updataValidate.reFundPwd,
                                    recaptchaCode: token,
                                }
                                this.$updata_fundPwd(params,res=>{
                                    if(res.code==0){
                                        if(!this.$store.state.bindGoogle){
                                            this.countDown();
                                        }
                                        this.$refs.updataValidate.resetFields();
                                        this.token = res.data.tempToken;
                                        this.updataCapital=false;
                                        this.codeModal = true;
                                    }else {
                                        this.$Message.error(res.msg);
                                        // this.$Message.error(res.msg);
                                    }
                                });
                            }
                        })
                    }
                })
            },
            //关闭谷歌验证
            closeGA() {
                this.delGAModal = false;
            },
            //确认
            submit(){
                this.grecaptcha().then((token)=>{
                    let params = {
                        tempToken: this.token,
                        recaptchaCode: token,
                        code: this.code,
                    }
                    if(this.type=='01'){
                        this.$changePasswordVerify(params,res=>{
                            if(res.code==0){
                                this.code = '';
                                this.codeModal = false;
                                localStorage.removeItem('userInfo');
                                localStorage.removeItem('token');
                                this.$store.commit('changeStatus',false);
                            }else {
                                this.$Message.error(res.msg);
                            }
                        });
                    }else if(this.type=='02'){
                        this.$fundPwdVerify(params,res=>{
                            if(res.code==0){
                                this.codeModal = false;
                                this.$store.commit('changeFundPwd',true);
                            }else {
                                this.$Message.error(res.msg);
                            }
                        });
                    }else{
                        this.$updata_fundPwdVerify(params,res=>{
                            if(res.code==0){
                                this.code = '';
                                this.codeModal = false;
                            }else {
                                this.$Message.error(res.msg);
                            }
                        });
                    }
                })
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
            toAuth(){
                this.auth = true
            },
            //身份认证
            authSubmit(){
                this.$refs.authInfo.validate((valid) => {
                    if (valid) {
                        let data = {
                            lastName: this.authInfo.lastName,
                            firstName: this.authInfo.name,
                            idCard: this.authInfo.carNum,
                            idType: this.authInfo.select,
                        }
                        this.$auth(data,res=>{
                            if(res.code==0){
                                this.auth = false
                                this.authInfo = {}
                                this.$Message.success(this.$t('invite.copyTip[1]'));
                                this.get_userInfo()
                            }else{
                                this.$Message.error(res.msg);
                            }
                        })
                    }
                })
                
            }
        }
    }
</script>
<style lang="less" scoped>


    .g-recaptcha {
        width: 200px;
        height: 200px;
        position: absolute;
        left: 0;
        bottom: 0;
        background: #00a97f;
        z-index: 99999;
    }

    .recapth {
        position: absolute;
        left: 50%;
        top: 50%;
        margin: -100px 0 0 -100px;
    }
    .gooleAuth {
        width: 200px;
        height: 100px;
        background: rgba(0,0,0,0.3);
        position: absolute;
        left: 0;
        top: 50%;
        z-index: 99;
    }

    .userInfo {
        background:#EDEDED;
        font-size: 14px;
        > div {
            width: 1200px;
        }
        button{
            cursor: pointer;
        }
        .title{
            text-align: center;
            width: 1200px;
            margin: auto;
            padding:49px 0 7px 0;
            span{
                color: #FF6005;
                font-size: 20px;
                margin: 0px auto;
                border-bottom: 2px solid #FF6005;
                padding: 7px;                
            }
        }
        .info {
            margin: auto;
            padding: 40px 0 0;

            .baseInfo,.safeSet{
                height: 220px;
                background: #ffffff;
                h5{
                    font-size: 16px;
                }
                >div{
                    &:nth-child(1){
                        background: #EDEDED;
                        border-bottom: none;
                        >span:nth-child(1){
                            font-size: 16px;
                        }
                    }
                    height: 44px;
                    line-height: 44px;
                    padding: 0 15px;
                    border-bottom: 1px solid #EDEDED;
                    display: flex;
                    justify-content: space-between;
                    color: #545454;
                    >span{
                        &:nth-child(1){
                            width: 200px;
                            display: inline-block;
                        }
                    }
                    >div{
                        width: calc(100% - 150px);
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        >button,>span:nth-child(2){
                            // width: 74px;
                            padding: 0 10px;
                            height: 28px;
                            line-height: 27px;
                            border: 1px solid rgba(255, 96, 5, 0.2);
                            background: rgba(242,249,255,0.2);
                            border-radius: 3px;
                            text-align: center;
                            color: #FF6005;
                            font-size: 14px;
                            font-family: SourceHanSansCN-Normal;
                        }
                        .bind{
                            background: rgba(128,128,128,0.2);
                            border: 1px solid rgba(128, 128, 128, 0.2);
                            color: #fff;
                            cursor: auto;
                        }
                        a{
                            color: #FF6005;
                        }
                    }
                }
            }
            .baseInfo{
                .unAuth,.authFailed{
                    color: #FF0000;
                }
                .pending{
                    color: #545454;
                }

                .authSucceed{
                    color: #B3B3B3;
                }
            }
        }

        .history {
            background: #ffffff;
            /*height: 236px;*/
            margin: 40px auto;
            .header{
                padding: 0 20px;
                background: #fff;
                span{
                    display: inline-block;
                    cursor: pointer;
                    font-size:16px;
                    font-family:SourceHanSansCN-Regular;
                    color: #B3B3B3;
                    line-height: 34px;
                    height: 34px;
                    padding: 0 5px;
                    margin-right: 10px;
                }
                span.active{
                    color: #FF6005;
                    border-bottom: 2px solid #FF6005;
                }
            }

            .nav span{
                color: #B3B3B3;
            }

            .item{
                margin-top: 2px;
            }

            >div{
                padding: 1px 0;
                height: auto !important;
                border-bottom: none !important;

                >div{
                    font-size: 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-top: 1px solid #EDEDED;
                    >span{
                        background: #fff;
                        display: inline-block;
                        width: 25%;
                        text-align: center;
                        border-right: 1px solid #EDEDED;
                        color: #545454;
                        font-size:14px;
                        height: 34px;
                        line-height: 33px;
                        font-family:SourceHanSansCN-Regular;
                        &:last-child{
                            border-right:none;
                        }
                    }
                }


            }
        }
    }
    .pr15{
        padding-right: 15px;
    }
    .footer {
        margin: 20px auto 57px;
        color: #fff;
        width:283px;
        height:35px;
        background:rgba(33,33,33,1);
        border-radius:3px;
    }
    .sure{
        text-align: center;
    }
    .ivu-btn-primary{
        border-color: rgba(33,33,33,1);
    }
    .set.ivu-form-item-error-tip{
        left: 20% !important;
    }
    input, select, textarea {
        width: 340px;
        height: 35px;
        background: rgba(238,238,238,1);
        border-radius: 2px;
        border: none;
        padding: 0 15px;
        font-size: 14px;
    }
</style>
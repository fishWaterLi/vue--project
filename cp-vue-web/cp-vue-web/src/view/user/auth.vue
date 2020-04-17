<template>
    <div class="auth">
        <div>
            <div class="header">身份认证</div>
            <div class="con">
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate">
                    <FormItem prop="name">
                        <span>名字</span>
                        <Input type="text" placeholder="名" v-model="formValidate.name"/>
                    </FormItem>
                    <FormItem prop="lastName">
                        <span>姓氏</span>
                        <Input type="text" placeholder="姓" v-model="formValidate.lastName"/>
                    </FormItem>
                    <FormItem>
                        <span>证件类型</span>
                        <Select v-model="formValidate.select" @on-change="selectCar">
                            <Option v-for="item in options" :value="item.value" :key="item.value">{{item.label}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem prop="carNum">
                        <span>证件号码</span>
                        <Input type="text" placeholder="证件号码" v-model="formValidate.carNum"/>
                    </FormItem>
                
                </Form>
            </div>
        </div>
        <div>
            <div class="header">上传证件照片</div>
            <div class="con">
                <div class="ask-for">
                    <p>照片要求</p>
                    <p>1、请确保照片完整、清晰可见，格式为jpg、jpeg或png，文件大小不超过5M，证件必须在有效期限内。</p>
                    <p>2、请上传手持证件照片，照片中需附一张白纸写有“Eirenex”和当前日期，上传的图片需清晰的展示头像及文字、证件详细信息，否则将影响审核结果。</p>
                </div>
                <div class="photo">
                    <div>
                        <p>身份证正面照片</p>
                        <div>
                            <Icon type="md-add" v-if="!frontSideUrl"  class="add"/>
                            <input type="file" accept="image/png,image/gif,image/jpeg,image/jpg" @change="update($event,0)" v-if="!frontSideUrl" >
                            <img :src="frontSideUrl" alt="证件照正面" v-if="frontSideUrl">
                            <Icon type="ios-trash"  v-if="frontSideUrl" @click="delImg(0)" class="del"/>
                        </div>
                        <p @click="uploadModel=true;checkImg='0'">查看示例</p>
                    </div>
                    <div>
                        <p>身份证反面照片</p>
                        <div>
                            <Icon type="md-add" v-if="!reverseSideUrl" class="add"/>
                            <input type="file" accept="image/png,image/gif,image/jpeg,image/jpg" @change="update($event,1)" v-if="!reverseSideUrl">
                            <img :src="reverseSideUrl" alt="证件照反面" v-if="reverseSideUrl">
                            <Icon type="ios-trash"  v-if="reverseSideUrl" @click="delImg(1)" class="del"/>
                        </div>
                        <p @click="uploadModel=true;checkImg='1'">查看示例</p>
                    </div>
                    <div>
                        <p>手持身份证照片</p>
                        <div>
                            <Icon type="md-add" v-if="!handHeldIdcardUrl" class="add"/>
                            <input type="file" accept="image/png,image/gif,image/jpeg,image/jpg" @change="update($event,2)" v-if="!handHeldIdcardUrl">
                            <img :src="handHeldIdcardUrl" alt="手持证件照" v-if="handHeldIdcardUrl">
                            <Icon type="ios-trash"  v-if="handHeldIdcardUrl" @click="delImg(2)" class="del"/>
                        </div>
                        <p @click="uploadModel=true;checkImg='2'">查看示例</p>
                    </div>
                </div>
                <button @click="submit">提交认证信息</button>
            </div>
        </div>
        <Modal v-model="uploadModel" width="360" :closable="false" class="auth-uploadModel">
            <div style="text-align:center">
                <img src="../../assets/images/login-ewm.jpg" alt="" v-if="checkImg=='0'">
                <img src="../../assets/images/login-ewm.jpg" alt="" v-if="checkImg=='1'">
                <img src="../../assets/images/login-ewm.jpg" alt="" v-if="checkImg=='2'">
                <button  @click="uploadModel=false">确定</button>
            </div>
        </Modal>
        <Modal v-model="successModel" width="360" :closable="false" class="auth-successModel">
            <div style="text-align:center">
                <p>您的信息已提交成功</p>
                <button @click="successModel=false">确定</button>
            </div>
        </Modal>
    </div>
</template>
<script>
export default {
    data() {
        return {
            carID: '',//证件ID
            options: [{
                label: '身份证',
                value: 1
            },
            {
                label: '护照',
                value: 2
            },
            {
                label: '国际驾照',
                value: 3
            }],
            formValidate: {
                name: '',
                lastName: '',
                carNum: '',
                select: 1,
            },
            ruleValidate: {
                name: [
                    { required: true, message: 'email cannot be empty', trigger: 'blur' },
                ],
                lastName: [
                    { required: true, message: 'Phone cannot be empty', trigger: 'blur' }
                ],
                carNum: [
                    { required: true, message: 'password cannot be empty', trigger: 'blur' }
                ]
            },
            successModel: false,
            uploadModel: false,
            frontSideUrl: '',//正面照
            reverseSideUrl: '',//反面
            handHeldIdcardUrl: '',//手持身份证
            checkImg: '0',// 0是正面照  1是反面照  2是手持照----查看示例图
        }
    },
    mounted() {
        
    },
    methods: {
        selectCar(value) {
            this.carID = value;
        },
        update(e,i) {
            let file = e.srcElement.files[0];
            let formdata = new FormData();
            let str = '';
            if(i==0){
                str = 'frontSideUrl';
            }else{
                i == 1 ? str = "reverseSideUrl" : str="handHeldIdcardUrl";
            }
            if(/^image/.test(file.type)){
                formdata.append(str,file);
                this.$upload(formdata,res=>{
                    if(res.code==0){
                        if(i==0){
                            this.frontSideUrl = res.data.frontSideUrl;
                            return
                        }
                        if(i==1){
                            this.reverseSideUrl =  res.data.reverseSideUrl;
                            return
                        }
                        this.handHeldIdcardUrl = res.data.handHeldIdcardUrl;
                    }else{
                        this.$Message.error(res.msg);
                    }
                    
                });
            }
        },
        delImg(i) {
            if(i==0){
                this.frontSideUrl = '';
            }else{
                i == 1 ? this.reverseSideUrl = "" : this.handHeldIdcardUrl="";
            }
        },
        submit() {
            let data = {
                lastName: this.formValidate.lastName,
                firstName: this.formValidate.name,
                idCard: this.formValidate.carNum,
                idType: this.formValidate.select,
                frontSideUrl: this.frontSideUrl,
                reverseSideUrl: this.reverseSideUrl,
                handHeldIdcardUrl: this.handHeldIdcardUrl,
            }
            this.$auth(data,res=>{
                if(res.code==0){
                    this.$Message.success(this.$t('invite.copyTip[1]'));
                    this.$router.go(-1);
                }else{
                    this.$Message.error(res.msg);
                }
            })
        },
        
    }
}
</script>
<style lang="less" scoped>
.auth{
    background: rgb(242, 249, 255);
    padding-top: 45px;
    >div{
        width: 1200px;
        margin: auto;
        background: rgb(242, 249, 255);
        >div{
            background: #ffffff;
        }
        .header{
            height: 40px;
            line-height: 39px;
            padding: 0 15px;
            margin-bottom: 2px;
            font-size:16px;
            font-family:SourceHanSansCN-Regular;
            color: #0160B9;
        }
        .con{
            padding: 19px 15px 40px 15px;
            >form>div{
                margin-bottom: 19px;
                >div{
                    span{
                        float: left;
                        width: 62px;
                        text-align: right;
                        margin-right: 17px;
                        font-size:14px;
                        font-family:SourceHanSansCN-Regular;
                        color: #b3b3b3;
                    }
                    div{
                        width: 298px;
                        float: left;
                    }
                }
            }
        }
        &:nth-child(2){
            margin-top: 28px;
            .con{
                text-align: center;
                .ask-for{
                    text-align: left;
                    p{
                        font-size:12px;
                        font-family:SourceHanSansCN-Light;
                        color: #b3b3b3;
                        margin-bottom: 15px;
                    }
                }
                .photo{
                    margin-top: 20px;
                    padding: 0 80px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    >div>p{
                        text-align: left;
                        line-height: 36px;
                        color: #b3b3b3;
                        font-size: 14px;
                        font-family:SourceHanSansCN-Normal;
                        &:nth-child(3){
                            text-align: center;
                            cursor: pointer;
                        }
                    }
                    >div{
                        width: 254px;
                        >div{
                            border: 1px dashed  #bbbbbb;
                            height: 154px;
                            position: relative;
                            input{
                                width: 100%;
                                height: 100%;
                                opacity: 0;
                                cursor: pointer;
                            }
                            img{
                                width: 254px !important;
                                height: 151px !important;
                            }
                            >.add{
                                position: absolute;
                                left: 50%;
                                top: 50%;
                                transform: translate(-50%,-50%);
                                font-size: 40px;
                                color: #bbbbbb;
                            }
                            >.del{
                                position: absolute;
                                right: 5px;
                                top: 5px;
                                font-size: 26px;
                                color: #333333;
                                cursor: pointer;
                            }
                        }
                    }
                }
                 >button{
                    margin-top: 36px;
                    cursor: pointer;
                    width: 360px;
                    height: 35px;
                    line-height: 34px;
                    text-align: center;
                    color: #ffffff;
                    font-size: 14px;
                    background:rgba(2,88,153,1);
                    border-radius:3px;
                    &:hover{
                        background:rgba(2,88,153,0.85);
                    }
                }
            }
        }
       
    }
}
</style>



const {AppWithExpress} = require('dragonli-node-service-core');
const {AppConfig} = require('dragonli-node-general-service-core');
const {sleep} = require('dragonli-node-tools');
const axios = require('axios');


class Controller1 {
    async sms(){
        const {appKey,appSecret,smsSdkId,smsSign,templateId,phones,paras} = this.paras;
        // console.log('===paras',this.paras);
        var sms = new SmsHandler(appKey,appSecret,smsSdkId);
        var result = await sms.sendSms(smsSign,phones,templateId,paras);
        console.log('===r',result);
        return {result};
    }

}


const routerConf = [
    {url:'/sms',clz:Controller1,method:'sms'},
];



const config = new AppConfig();

//should pass by cmd env paras
process.env.HTTP_PORT = 20001;
process.env.TELNET_COMMAND_PORT=30002;
//just for test.


config.addRoutesConfig(routerConf);

const {SmsHandler} = require('./TencentCloudHandler');


(new AppWithExpress()).start(config);

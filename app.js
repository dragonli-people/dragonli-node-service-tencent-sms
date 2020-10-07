const {AppWithExpress,AppConfig} = require('dragonli-node-service-core');
const {SmsHandler} = require('./TencentCloudHandler');

class Controller {
    async sms(){
        const {appKey,appSecret,smsSdkId,smsSign,templateId,phones,paras} = this.paras;
        console.log('===paras',this.paras);
        var sms = new SmsHandler(appKey,appSecret,smsSdkId);
        var result = await sms.sendSms(smsSign,phones,templateId,paras);
        console.log('===r',result);
        return {result};
    }
}

const routerConf = [
    {url:'/sms',clz:Controller,method:'sms'},
];

const config = new AppConfig();


const port = parseInt( process.env.HTTP_PORT ) || 16000;
config.setPort(port);
config.addRoutesConfig(routerConf);

(new AppWithExpress()).start(config);

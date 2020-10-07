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

(async function f() {
    await sleep(3000);
    console.log('11111');
    await axios.post('http://localhost:20001/sms',{
        appKey:'AKIDzkKgASWc6KKwKabzoOhKjtoRqojJmQ5W',
        appSecret:'MdmcDXcpnd7MM7iGqMccPyLYrxPdZnEs',
        smsSdkId:'1400431983',
        smsSign:'北京传承未来网络科技有限',
        templateId:'732233',
        phones:['+8613683553919'],
        paras:['3223'],
    });
    console.log('22222');

    return ;
    var sms = new SmsHandler('AKIDzkKgASWc6KKwKabzoOhKjtoRqojJmQ5W','MdmcDXcpnd7MM7iGqMccPyLYrxPdZnEs','1400431983');
    var result = await sms.sendSms('北京传承未来网络科技有限',['+8613521011078'],'732233',['1122']);
    console.log('=====',result);
})();
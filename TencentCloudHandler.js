const tencentcloud = require("tencentcloud-sdk-nodejs");

// 导入 SMS 模块的 client models
const smsClient = tencentcloud.sms.v20190711.Client;
const models = tencentcloud.sms.v20190711.Models;

const Credential = tencentcloud.common.Credential;
const ClientProfile = tencentcloud.common.ClientProfile;
const HttpProfile = tencentcloud.common.HttpProfile;

class SmsHandler{
    constructor(appid,secret,SmsSdkAppid){
        this.appid = appid;
        this.secret = secret;
        this.SmsSdkAppid = SmsSdkAppid;
    }

    sendSms(Sign,phones,TemplateID,paras,endpoint,ExtendCode=''){
        Array.isArray(phones) || (phones = [phones]);
        //let cred = new Credential(process.env.TENCENTCLOUD_SECRET_ID, process.env.TENCENTCLOUD_SECRET_KEY);
        let cred = new Credential(this.appid, this.secret);
        /* 非必要步骤:
         * 实例化一个客户端配置对象，可以指定超时时间等配置 */
        let httpProfile = new HttpProfile();
        /* SDK 默认使用 POST 方法
         * 如需使用 GET 方法，可以在此处设置，但 GET 方法无法处理较大的请求 */
        httpProfile.reqMethod = "POST";
        /* SDK 有默认的超时时间，非必要请不要进行调整
         * 如有需要请在代码中查阅以获取最新的默认值 */
        httpProfile.reqTimeout = 30;
        httpProfile.endpoint = endpoint || "sms.tencentcloudapi.com";

        // 实例化一个 client 选项，可选，无特殊需求时可以跳过
        let clientProfile = new ClientProfile();
        /* SDK 默认用 TC3-HMAC-SHA256 进行签名，非必要请不要修改该字段 */
        // clientProfile.signMethod = "HmacSHA256";
        clientProfile.httpProfile = httpProfile;

        /* SDK 会自动指定域名，通常无需指定域名，但访问金融区的服务时必须手动指定域名
         * 例如 SMS 的上海金融区域名为 sms.ap-shanghai-fsi.tencentcloudapi.com *
         * 实例化 SMS 的 client 对象
         * 第二个参数是地域信息，可以直接填写字符串 ap-guangzhou，或者引用预设的常量 */
        let client = new smsClient(cred, "ap-guangzhou", clientProfile);

        /* 实例化一个请求对象，根据调用的接口和实际情况，可以进一步设置请求参数
         * 您可以直接查询 SDK 源码确定 SendSmsRequest 有哪些属性可以设置
         * 属性可能是基本类型，也可能引用了另一个数据结构
         * 推荐使用 IDE 进行开发，可以方便地跳转查阅各个接口和数据结构的文档说明 */
        let req = new models.SendSmsRequest();

        /* 基本类型的设置:
         * SDK 采用的是指针风格指定参数，即使对于基本类型也需要用指针来对参数赋值
         * SDK 提供对基本类型的指针引用封装函数
         * 帮助链接：
         * 短信控制台：https://console.cloud.tencent.com/smsv2
         * sms helper：https://cloud.tencent.com/document/product/382/3773 */

        /* 短信应用 ID: 在 [短信控制台] 添加应用后生成的实际 SDKAppID，例如1400006666 */
        req.SmsSdkAppid = this.SmsSdkAppid;//"1400787878";
        /* 短信签名内容: 使用 UTF-8 编码，必须填写已审核通过的签名，可登录 [短信控制台] 查看签名信息 */
        req.Sign = Sign;
        /* 短信码号扩展号: 默认未开通，如需开通请联系 [sms helper] */
        req.ExtendCode = ExtendCode || '';
        /* 国际/港澳台短信 senderid: 国内短信填空，默认未开通，如需开通请联系 [sms helper] */
        req.SenderId = "";
        /* 用户的 session 内容: 可以携带用户侧 ID 等上下文信息，server 会原样返回 */
        req.SessionContext = "";
        /* 下发手机号码，采用 e.164 标准，+[国家或地区码][手机号]
         * 例如+8613711112222， 其中前面有一个+号 ，86为国家码，13711112222为手机号，最多不要超过200个手机号*/
        req.PhoneNumberSet = phones;//["+8613711112222", "+8613711333222", "+8613711144422"];
        /* 模板 ID: 必须填写已审核通过的模板 ID，可登录 [短信控制台] 查看模板 ID */
        req.TemplateID = TemplateID;//"449739";
        /* 模板参数: 若无模板参数，则设置为空*/
        req.TemplateParamSet = paras;//["666"];

        // 通过 client 对象调用想要访问的接口，需要传入请求对象以及响应回调函数
        return new Promise( (res,rej)=>client.SendSms(req,  (err, response)=>err && rej(err) || res(response.to_json_string()))) ;
    }

}

module.exports = {
    SmsHandler,
};

// SecretId: AKIDzkKgASWc6KKwKabzoOhKjtoRqojJmQ5W
// SecretKey:MdmcDXcpnd7MM7iGqMccPyLYrxPdZnEs
// SDKAppID：1400431983
// const {MysqlHandlerFactory,UpyunStorageHandler,LocalImageHandler,Crypto} = require('dragonli-node-tools');

// (async function f() {
//     var sms = new SmsHandler('AKIDzkKgASWc6KKwKabzoOhKjtoRqojJmQ5W','MdmcDXcpnd7MM7iGqMccPyLYrxPdZnEs','1400431983');
//     var result = await sms.sendSms('北京传承未来网络科技有限',['+8613521011078'],'732233',['1234']);
//     console.log('=====',result);
// })();


/*

APPID：1257024499

SecretId:AKIDua0SQd0CltCFCvMar28euwA7nDBvrYTw
SecretKey:aPr3wc1A1hHbeS0HNDsRknohLkva0iLp

签名ID：315201
模板ID  732032

应用名
验证码
SDK AppID
1400431983
SDK AppID是短信应用的唯一标识，调用短信API接口时，需要提供该参数。
App Key
50fea871c947093471961e3f3c19a00e
隐藏
App Key是用来校验短信发送合法性的密码，与SDK AppID对应，需要业务方高度保密，切勿把密码存储在客户端。
标签
无
创建时间
2020-09-26 10:10:02
最近修改
2020-09-26 10:10:02
状态
运行中
应用简介
酷投票平台|验证码
*/
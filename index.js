// Lambda test 1
const AWS = require('aws-sdk');
// Amazon SES configuration
AWS.config.update({
  apiVersion: '2010-12-01',
  accessKeyId: '',
  secretAccessKey: '',
  region: 'us-east-1'
});

const ses = new AWS.SES();

exports.handler = function(event, context, callback) {
    console.log("AWS lambda and SNS trigger ");
    const snsmessage = event.Records[0].Sns.Message;
    console.log('Message received from SNS:', snsmessage);
    const messageParams = JSON.parse(snsmessage);
    const email = messageParams.Item.username;
    const token = messageParams.Item.token;
    const link = `http://prod.songyue.me/v1/verifyUserEmail?email=${email}&token=${token}`;
    const emailParams = {
        Destination: {
          ToAddresses: [email],
        },
        Message: {
          Subject: { Data: "Please Confirm your Email" },
          Body: {
            Html: { 
                Charset: "UTF-8",
                Data: `<html><body><a href="${link}">Click here to validate this email address.</a></body></html>`
            }
          }
        },
        Source: 'test@mail.prod.songyue.me'
    };
    ses.sendEmail(emailParams).promise().then((res,err) => {
        if(err){
          console.error(err);
        }
        else{
          console.log("Successfully sent email!");
        }
    });
};

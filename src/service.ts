import { SNS } from "aws-sdk";

export async function publishToSNS(name: string, email: string) {
    const topicArn = 'arn:aws:sns:ap-south-1:297436977708:quote-message';
    const message = `${name} with email (${email}) has subscribed. Congrats`;
    const sns = new SNS();
    await sns.publish({ TopicArn: topicArn, Message: message }).promise();
}
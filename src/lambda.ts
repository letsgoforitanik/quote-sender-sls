import { v4 as uuidv4 } from "uuid";
import { S3, DynamoDB } from "aws-sdk";
import sendgrid from "@sendgrid/mail";

import { publishToSNS } from "./service";


export async function getQuotes(event: ApiGatewayEvent) {
    try {
        const s3Client = new S3();
        const fetchParams = { Bucket: 'quotesbucket-anik', Key: 'quotes.json' };
        const response = await s3Client.getObject(fetchParams).promise();

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: response.Body?.toString('utf-8')
        }
    }
    catch (error) {
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(error)
        }
    }
}


export async function subscribeUser(event: ApiGatewayEvent) {
    try {
        const { email, name } = JSON.parse(event.body);

        if (!email || !name) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: 'Bad request' })
            }
        }

        const dynamoClient = new DynamoDB.DocumentClient();
        const currentTime = new Date().getTime();

        const params = {
            TableName: 'users',
            Item: {
                id: uuidv4(),
                email: email,
                name: name,
                subscribed: true,
                createdAt: currentTime,
                updatedAt: currentTime
            }
        };


        await dynamoClient.put(params).promise();

        console.log('User created successfully');

        await publishToSNS(name, email);

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'User created successfully' })
        }

    }
    catch (error) {

        console.log('Error :', error);

        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(error)
        }
    }
}



export async function sendEmail(event: ApiGatewayEvent) {

    try {
        const apiKey = process.env.SENDGRID_API_KEY!;
        sendgrid.setApiKey(apiKey);

        const dynamoClient = new DynamoDB.DocumentClient();
        const response = await dynamoClient.scan({ TableName: 'users', ProjectionExpression: 'email' }).promise();
        const subscriberEmails: string[] = response.Items?.map(item => item.email) ?? [];

        const s3Client = new S3();
        const fetchParams = { Bucket: 'quotesbucket-anik', Key: 'quotes.json' };
        const bucketResponse = await s3Client.getObject(fetchParams).promise();
        const { quotes }: Quotes = JSON.parse(bucketResponse.Body?.toString('utf-8') ?? '');

        const randomQuoteIndex = Math.floor(Math.random() * quotes.length);
        const { quote, author } = quotes[randomQuoteIndex];

        const data = {
            to: subscriberEmails,
            from: 'letsgoforitanik@gmail.com',
            subject: 'Daily words of wisdom',
            html: `<i>${quote} by <strong>${author}</strong></i>`
        };

        await sendgrid.sendMultiple(data);

        console.log('Email successfully sent to the subscribers');
    }
    catch (error) {
        console.log('Error :', JSON.stringify(error));
    }

}
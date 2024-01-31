# Quote Sender

This application sends random quotes every 15 minutes to its subscribers.

Details: This application has a frontend which shows a random quote everytime it is visited.
It also lets visitors to enter their name and email and let them subscribe. Once someone subscribes
a mail consisting of name and email is sent to the admin. Every 15 minutes, the application sends
random quote via email to its subscribers.

### Technical Details

Quotes are stored in an `AWS S3` bucket. Frontend of the app is built in `Next JS. Frontend fetches all the quotes
via api. All the api functionalities are implemented as `AWS Lambda`s that sit behind an AWS API gateway. A quote
is then randomly selected and displayed. Subscriber information is collected and passed to an API which store all
the subscriber information in a `AWS DynamoDB`table. When someone subscribes, a notification mail is sent to the 
admin via`AWS SNS`. Every 15 minutes, an `AWS EventBridge`rule triggers a certain lambda, which fetches all the
subscriber emails and sends them a random quote via`Twilio SendGrid` platform.

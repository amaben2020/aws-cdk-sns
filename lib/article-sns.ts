import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { join } from 'path';

export class ArticleSNS extends cdk.Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const topic = new cdk.aws_sns.Topic(this, 'topic');

    const api = new cdk.aws_apigateway.RestApi(this, 'api', {});

    const orderItem = new cdk.aws_lambda_nodejs.NodejsFunction(
      this,
      'OrderItem',
      {
        entry: join(__dirname, '..', 'services', 'lambdas', 'order-item.ts'),
        handler: 'handler',
        environment: {
          TOPIC_ARN: topic.topicArn,
        },
      }
    );
    topic.grantPublish(orderItem);
    api.root
      .addResource('orderItem')
      .addMethod('POST', new cdk.aws_apigateway.LambdaIntegration(orderItem));

    const executeOrder = new cdk.aws_lambda_nodejs.NodejsFunction(
      this,
      'ExecuteOrder',
      {
        entry: join(__dirname, '..', 'services', 'lambdas', 'execute-order.ts'),
        handler: 'handler',
      }
    );
    topic.addSubscription(
      new cdk.aws_sns_subscriptions.LambdaSubscription(executeOrder)
    );

    const requestDelivery = new cdk.aws_lambda_nodejs.NodejsFunction(
      this,
      'RequestDelivery',
      {
        entry: join(
          __dirname,
          '..',
          'services',
          'lambdas',
          'request-delivery.ts'
        ),
        handler: 'handler',
      }
    );
    topic.addSubscription(
      new cdk.aws_sns_subscriptions.LambdaSubscription(requestDelivery, {
        filterPolicy: {
          // Only triggers when the "requestDelivery" attribute is set to "true"
          requestDelivery: cdk.aws_sns.SubscriptionFilter.stringFilter({
            allowlist: ['true'],
          }),
        },
      })
    );

    const sendNotification = new cdk.aws_lambda_nodejs.NodejsFunction(
      this,
      'SendNotification',
      {
        entry: join(
          __dirname,
          '..',
          'services',
          'lambdas',
          'send-notification.ts'
        ),
        handler: 'handler',
      }
    );
    topic.addSubscription(
      new cdk.aws_sns_subscriptions.LambdaSubscription(sendNotification, {
        filterPolicy: {
          // Only triggers when the "sendNotification" attribute is set to "true"
          sendNotification: cdk.aws_sns.SubscriptionFilter.stringFilter({
            allowlist: ['true'],
          }),
        },
      })
    );
  }
}

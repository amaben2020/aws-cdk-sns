// orderItem/handler.ts
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { APIGatewayProxyResult } from 'aws-lambda';

const client = new SNSClient({});

export const handler = async (event: {
  body: string;
}): Promise<APIGatewayProxyResult> => {
  const topicArn = process.env.TOPIC_ARN;

  if (topicArn === undefined) throw new Error('TOPIC_ARN is undefined');

  const { requestDelivery, sendNotification, item, quantity } = JSON.parse(
    event.body
  ) as {
    requestDelivery?: boolean;
    sendNotification?: boolean;
    item?: string;
    quantity?: number;
  };

  if (
    requestDelivery === undefined ||
    sendNotification === undefined ||
    item === undefined ||
    quantity === undefined
  ) {
    return {
      statusCode: 400,
      body: 'Bad request',
    };
  }

  await client.send(
    new PublishCommand({
      Message: JSON.stringify({ item, quantity }),
      TopicArn: topicArn,
      MessageAttributes: {
        sendNotification: {
          DataType: 'String',
          StringValue: sendNotification.toString(),
        },
        requestDelivery: {
          DataType: 'String',
          StringValue: requestDelivery.toString(),
        },
      },
    })
  );

  return {
    statusCode: 200,
    body: 'Item ordered',
  };
};

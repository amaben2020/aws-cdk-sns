import { APIGatewayProxyResult } from 'aws-lambda';

// requestDelivery/handler.ts
export const handler = (): APIGatewayProxyResult => {
  console.log('NOTIFICATION SENT');

  return {
    statusCode: 201,
    body: '',
  };
};

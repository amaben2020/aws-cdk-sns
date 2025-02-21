import { APIGatewayProxyResult } from 'aws-lambda';

// requestDelivery/handler.ts
export const handler = (): APIGatewayProxyResult => {
  console.log('DELIVERY REQUESTED');

  return {
    statusCode: 201,
    body: '',
  };
};

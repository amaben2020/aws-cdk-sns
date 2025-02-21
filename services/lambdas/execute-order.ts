// executeOrder/handler.ts
export const handler = async (event: {
  Records: {
    Sns: {
      Message: string;
    };
  }[];
}): Promise<void> => {
  event.Records.forEach(({ Sns: { Message } }) => {
    const { item, quantity } = JSON.parse(Message) as {
      item: string;
      quantity: number;
    };

    // makes request to PaymentService
    console.log(`ORDER EXECUTED - Item: ${item}, Quantity: ${quantity}`);
  });
};

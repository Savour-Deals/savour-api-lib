import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

export async function main(event, context) {
  const params = {
    TableName: process.env.subscriberUsersTbl,
		// 'Key' defines the partition key and sort key of the item to be retrieved
    // - 'mobile_number': Mobile number identifying user
    Key: {
      mobile_number: event.pathParameters.mobile_number,
    }
  };

  try {
    await dynamoDbLib.call("delete", params);
    return success({ status: true });
  } catch (e) {
    return failure({ status: false });
  }
}
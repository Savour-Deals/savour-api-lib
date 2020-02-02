import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

export async function main(event, context) {
  const params = {
    TableName: process.env.businessUsersTbl,
		// 'Key' defines the partition key and sort key of the item to be retrieved
    // - 'uid': User ID to identify a user by Cognito
    Key: {
      uid: event.pathParameters.uid,
    }
  };

  try {
    await dynamoDbLib.call("delete", params);
    return success({ status: true });
  } catch (e) {
    return failure({ status: false });
  }
}
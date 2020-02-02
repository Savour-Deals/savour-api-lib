import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

export async function main(event, context) {
  const params = {
    TableName: process.env.unclaimedButtonTbl,
		// 'Key' defines the partition key and sort key of the item to be retrieved
    // - 'button_id': unique id of button
    Key: {
      button_id: event.pathParameters.btn_id,
    }
  };

  try {
    await dynamoDbLib.call("delete", params);
    return success({ status: true });
  } catch (e) {
    return failure({ status: false });
  }
}
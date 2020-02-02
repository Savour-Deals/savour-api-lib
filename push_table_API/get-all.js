import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

export async function main(event, context) {
  const params = {
    TableName: process.env.pushTbl,
    // 'Key' defines the partition key and sort key of the item to be retrieved
    // - 'mobile_number': Mobile number identifying user
    IndexName: "btn_id-index",

    KeyConditionExpression: "btn_id = :b",
    ExpressionAttributeValues: {
      ":b": event.pathParameters.btn_id
    }
  };

  try {
    const result = await dynamoDbLib.call("query", params);
    // Return the matching list of items in response body
    return success(result.Items);
  } catch (e) {
    return failure({ status: false });
  }
}
import * as dynamoDbLib from "../../common/dynamodb-lib";
import { success, failure } from "../../common/response-lib";

export default async function main(event, context) {
  const params = {
    TableName: process.env.subscriberUserTable,
    // 'Key' defines the partition key and sort key of the item to be retrieved
    // - 'mobile_number': Mobile number identifying user
    Key: {
      mobile_number: event.pathParameters.mobile_number,
    }
  };

  try {
    const result = await dynamoDbLib.call("get", params);
    if (result.Item) {
      // Return the retrieved item
      return success(result.Item);
    } else {
      return failure({ status: false, error: "Item not found." });
    }
  } catch (e) {
    return failure({ status: false });
  }
}
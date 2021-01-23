import * as dynamoDbLib from "../../common/dynamodb-lib";
import { success, failure } from "../../common/response-lib";

export default async function main(event, context) {
  const params = {
    TableName: process.env.businessesTbl,
    // 'Key' defines the partition key and sort key of the item to be retrieved
    // - 'place_id': Business ID identifying Google id
    Key: {
      place_id: event.pathParameters.place_id,
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
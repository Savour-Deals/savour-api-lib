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
    await dynamoDbLib.call("delete", params);
    return success({ status: true });
  } catch (e) {
    return failure({ status: false });
  }
}
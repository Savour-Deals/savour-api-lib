import * as dynamoDbLib from "../common/dynamodb-lib";
import { success, failure } from "../common/response-lib";

export default async function main(event, context) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.businessesTbl,
    Item: data
  };
  console.log(params);
  try {
    await dynamoDbLib.call("put", params);
    return success(params.Item);
  } catch (e) {
    return failure({ status: false });
  }
}
import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

export async function main(event, context) {
  console.log(event);
  console.log(context);
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.businessUsersTbl,
    Item: data
  };
  console.log(params);
  try {
    await dynamoDbLib.call("put", params);
    return success(params.Item);
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }
}
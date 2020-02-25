var stripe = require('stripe')(process.env.stripeKey);
import { success, failure } from "../libs/response-lib";

export async function main(event, context) {
	const data = JSON.parse(event.body);

	return stripe.subscriptionItems.createUsageRecord(
		data.subscription_item,
		{quantity: data.quantity, timestamp: Math.floor(Date.now()/1000)}
	).then((usageRecord) => {
		return success({ status: true, usageRecord: usageRecord });
	}).catch((err) => {
		//error occured, return error to caller
		return failure({ status: false, error: err });
  });
}
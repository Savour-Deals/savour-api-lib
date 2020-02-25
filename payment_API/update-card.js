import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

var stripe = require('stripe')(process.env.stripeKey);

export async function main(event, context) {
	const data = JSON.parse(event.body);
	//Attach a new payment method to customer
	return stripe.paymentMethods.attach(
		data.payment_method,
		{customer: data.customer_id}
	)
	.then((paymentMethod) => {
		//set this new payment method as default
		return stripe.customers.update(
			data.customer_id,
			{invoice_settings: {default_payment_method: paymentMethod}}
		);
	})
	.then(async(customer) => {
		//update database with new payment method
		const params = {
			TableName: process.env.businessesTbl,
			// 'Key' defines the partition key and sort key of the item to be retrieved
			// - 'place_id': Business ID identifying Google id
			Key: {
				place_id: event.pathParameters.place_id,
			},
			// 'UpdateExpression' defines the attributes to be updated
			// 'ExpressionAttributeValues' defines the value in the update expression
			UpdateExpression: "stripe_payment_method = :stripe_payment_method",
			ExpressionAttributeValues: {
				':stripe_payment_method': customer.invoice_settings.default_payment_method,
			},
			// 'ReturnValues' specifies if and how to return the item's attributes,
			// where ALL_NEW returns all attributes of the item after the update; you
			// can inspect 'result' below to see how it works with different settings
			ReturnValues: "ALL_NEW"
		};
		try {
			await dynamoDbLib.call("update", params);
			return success({ status: true });
		} catch (e) {
			return failure({ status: false, error: e });
		}
	})
  .catch((err) => {
		//error occured, return error to caller
		return failure({ status: false, error: err });
  });
}

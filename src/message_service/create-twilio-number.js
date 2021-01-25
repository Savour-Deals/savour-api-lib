import * as dynamoDbLib from "../../common/dynamodb-lib";
import { success, failure } from "../../common/response-lib";
const client = require('twilio')(process.env.accountSid, process.env.authToken);

export default async function main(event, context) {
	//query for phone number in US
	const data = JSON.parse(event.body);
	console.log(data);
	if (data.isDev) {
			//store new number in DB
		const params = {
			TableName: process.env.businessTable,
			// 'Key' defines the partition key and sort key of the item to be retrieved
			// - 'place_id': Business ID identifying Google id
			Key: {
				place_id: event.pathParameters.place_id,
			},
			// 'UpdateExpression' defines the attributes to be updated
			// 'ExpressionAttributeValues' defines the value in the update expression
			UpdateExpression: "SET twilio_number = :twilio_number",
			ExpressionAttributeValues: {
				':twilio_number': "+123456789"
			},
			// 'ReturnValues' specifies if and how to return the item's attributes,
			// where ALL_NEW returns all attributes of the item after the update; you
			// can inspect 'result' below to see how it works with different settings
			ReturnValues: "ALL_NEW"
		};
		try {
			await dynamoDbLib.call("update", params);
		} catch(error) {
			return failure({ status: false });
		}
		return success({ status: true, twilioNumber: "+123456789"});
	}

	var twilioNumberResource = null;
	try {
		twilioNumberResource = await client.availablePhoneNumbers('US')
		.local
		.list({
			// nearLatLong: '37.840699, -122.461853',
			// distance: 50,
			areaCode: '612',
			excludeAllAddressRequired: true,
			// inRegion: 'CA',
			limit: 1
		})
		.then(local => {
			return local[0];
		}).catch((err) => {
			//error occured, return error to caller
			console.log(err);
			return failure({ status: false, error: err });
		});

	} catch (error) {
		console.log(error);
		return failure({status: false, error});
	}

	//provision phone number
	let twilioNumber = await client.incomingPhoneNumbers
		.create({
			phoneNumber: twilioNumberResource.phoneNumber,
			friendlyName: event.pathParameters.place_id,
			smsUrl: process.env.twilioWebhookUrl
		})
		.then(incoming_phone_number => { return incoming_phone_number.phoneNumber; })
		.catch((err) => {
			//error occured, return error to caller
			console.log(err);
			return failure({ status: false, error: err });
		});

	//store new number in DB
	const params = {
		TableName: process.env.businessTable,
		// 'Key' defines the partition key and sort key of the item to be retrieved
		// - 'place_id': Business ID identifying Google id
		Key: {
			place_id: event.pathParameters.place_id,
		},
		// 'UpdateExpression' defines the attributes to be updated
		// 'ExpressionAttributeValues' defines the value in the update expression
		UpdateExpression: "SET twilio_number = :twilio_number",
		ExpressionAttributeValues: {
			':twilio_number': twilioNumber
		},
		// 'ReturnValues' specifies if and how to return the item's attributes,
		// where ALL_NEW returns all attributes of the item after the update; you
		// can inspect 'result' below to see how it works with different settings
		ReturnValues: "ALL_NEW"
	};

	try {
		await dynamoDbLib.call("update", params);
	} catch (e) {
		return failure({ status: false });
	}
	return success({ status: true, twilioNumber});
}
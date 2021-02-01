import * as dynamoDbLib from "../../common/dynamodb-lib";
import { success, failure } from "../../common/response-lib";
const client = require('twilio')(process.env.authToken, process.env.authToken);

export default async function main(event, context) {
	//query for phone number in US
	const data = JSON.parse(event.body);
	console.log(data);

	const placeId = event.pathParameters.place_id;
	const stage = process.env.stage;
	const webhook = process.env.twilioWebhookUrl;

	var number;
	if (stage == 'dev') {
		number = '+123456789';
	} else {
		var twilioNumberResource;
	
		try {
			twilioNumberResource = await client.availablePhoneNumbers('US').local
			.list({
				// nearLatLong: '37.840699, -122.461853',
				// distance: 50,
				areaCode: '612',
				excludeAllAddressRequired: true,
				// inRegion: 'CA',
				limit: 1
			})
			.then(local => local[0])
			.catch((err) => {
				//error occured, return error to caller
				console.log(err);
				return failure({ status: false, error: err });
			});
		} catch (error) {
			console.log(error);
			return failure({status: false, error});
		}

		const webhook = await ssm.getParameter(`/twilio/webhook/${stage}`).promise();
		//provision phone number
		number = await client.incomingPhoneNumbers.create({
			phoneNumber: twilioNumberResource.phoneNumber,
			friendlyName: placeId,
			smsUrl: webhook
		})
		.then(p => p.phoneNumber)
		.catch((err) => {
				//error occured, return error to caller
				console.log(err);
				return failure({ status: false, error: err });
		});
	}

	try {
		persistNumber(placeId, number);
	} catch(error) {
		return failure({ status: false });
	}
	return success({ status: true, twilioNumber: number});
}

function persistNumber(placeId, number) {
	//store new number in DB
	const params = {
		TableName: process.env.businessTable,
		// 'Key' defines the partition key and sort key of the item to be retrieved
		// - 'place_id': Business ID identifying Google id
		Key: {
			place_id: placeId,
		},
		// 'UpdateExpression' defines the attributes to be updated
		// 'ExpressionAttributeValues' defines the value in the update expression
		UpdateExpression: "SET twilio_number = :twilio_number",
		ExpressionAttributeValues: {
			':twilio_number': number
		},
		// 'ReturnValues' specifies if and how to return the item's attributes,
		// where ALL_NEW returns all attributes of the item after the update; you
		// can inspect 'result' below to see how it works with different settings
		ReturnValues: "ALL_NEW"
	};
	await dynamoDbLib.call("update", params);
}
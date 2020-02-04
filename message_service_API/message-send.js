import * as dynamoDbLib from "../libs/dynamodb-lib";
const client = require('twilio')(process.env.accountSid, process.env.authToken);
const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

function randomString(length) {
	var result = '';
	for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
	return result;
}

async function createShortUrl(longUrl, shortUrlDomain){
	var token = '';
	var shortUrl = '';
	var attempt = 0;
	while (attempt < 5){
		attempt++;
		token = randomString(parseInt(process.env.tokenSize));
		shortUrl = `${shortUrlDomain}/${token}`;
		try {
			const params = {
				TableName: process.env.redirectTbl,
				Item: {
					unique_id: token,
					destination_url: longUrl,
					shorturl: shortUrl
				},
				ConditionExpression: 'attribute_not_exists(unique_id)'
			};
			await dynamoDbLib.call("put", params);
		} catch (e) {
			console.log(e);
			shortUrl = '';
		}
	}
	return shortUrl;
}

export async function main(event, context) {
  console.log(event);
	const timestamp = new Date().toISOString();
	var messageBody = '';
	const longUrl = `${process.env.longUrlDomain}/?a=${event.ID}&b=${event.To}`;

	let shortUrl = await createShortUrl(longUrl, process.env.shortUrlDomain);
	if (shortUrl != ''){
		// we found a link for this message!
		let messageLink = `Redeem here: ${shortUrl}.`;
		messageBody = `${event.Content} ${messageLink} HELP 4 help, STOP 2 Unsub.`;
	}else{
		//we couldnt generate a link, send just the message instead. Also alert dev
		console.log("Failed to get token for this message");
		client.messages.create({
			body: `Failed to get a token for short url`,
			from: "+17633249713",
			to: "+16124812069"
		});
		messageBody = `${event.Content} HELP 4 help, STOP 2 Unsub.`;
	}

	client.messages.create({
		body: messageBody,
		from: event.From,
		to: event.To,
	});

	const params = {
		TableName: process.env.pushTbl,
		Key: {'unique_id': event.ID},
		UpdateExpression: 'SET #VALUE.#FIELD = :value',
		ExpressionAttributeNames: {
				'#VALUE': 'sent_map',
				'#FIELD': event.To
		},
		ExpressionAttributeValues: {
				':value': {status: 'SENT', timestamp: timestamp}
		},
		ReturnValues: 'UPDATED_NEW'
	};
	try {
    await dynamoDbLib.call("update", params);
  } catch (error) {
    var dict = {};
    dict[event.To] = {status: 'SENT', timestamp: timestamp};
    const params1 = {
      TableName: process.env.pushTbl,
			Key: {'unique_id': event.ID},
      UpdateExpression: 'SET sent_map = :value',
      ExpressionAttributeValues: {
          ':value': dict
      },
      ReturnValues: 'ALL_NEW'
    };
    await dynamoDbLib.call("update", params1);
  }
}
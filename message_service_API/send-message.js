// const client = require('twilio')(process.env.accountSid, process.env.authToken);
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
			break;
		} catch (e) {
			console.log(e);
			shortUrl = '';
		}
	}
	return shortUrl;
}

async function sendMessage(mobileNumber, content, twilioNumber){
	let messageBody = '';
	const longUrl = `${process.env.longUrlDomain}/?a=${mobileNumber}`;

	let shortUrl = await createShortUrl(longUrl, process.env.shortUrlDomain);

	if (shortUrl != '') {
		let messageLink = `Redeem here: ${shortUrl}`;

		messageBody = `${content} ${messageLink} HELP 4, STOP 2 Unsub.`;

	} else{
		//we couldnt generate a link, send just the message instead. Also alert dev
		console.log("Failed to get token for this message");
		client.messages.create({
			body: `MESSAGE-SEND::Failed to get a token for short url`,
			from: "+17633249713",
			to: "+16124812069"
		});
		messageBody = `${content} HELP 4 help, STOP 2 Unsub.`;
		return;
	}

	const  twilioData = {
		body: messageBody,
		from: twilioNumber,
		to: mobileNumber,
	};
	client.messages.create(twilioData);
	
}

export async function main(event, context) {
  console.log(event);

	return;
}
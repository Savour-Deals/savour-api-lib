import * as businessAPI from "./business/index.js";
import * as businessUserAPI from "./business_user/index.js";
import * as messageAPI from "./message_service/index.js";
import * as paymentAPI from "./payment/index.js";
import * as pushAPI from "./push/index.js";
import * as subcriberAPI from "./subscriber_user/index.js";
import * as urlAPI from "./url_shortener/index.js";

export const business = {
	update: businessAPI.update,
	get: businessAPI.get,
	delete: businessAPI.del,
	create: businessAPI.create
}

export const businessUser = {
	update: businessUserAPI.update,
	get: businessUserAPI.get,
	delete: businessUserAPI.del,
	create: businessUserAPI.create
}

export const message = {
	button: messageAPI.button,
	hooks: messageAPI.hooks,
	createNumber: messageAPI.createNumber,
	sendMessage: messageAPI.sendMessage
}

export const payment = {
	cancelSubscription: paymentAPI.cancelSubscription,
	create: paymentAPI.create,
	updateCard: paymentAPI.updateCard,
	updateUsage: paymentAPI.updateUsage
}

export const push = {
	getAll: pushAPI.getAll,
	get: pushAPI.get,
	delete: pushAPI.del,
	create: pushAPI.create
}

export const subscriber = {
	update: subcriberAPI.update,
	get: subcriberAPI.get,
	delete: subcriberAPI.del,
	create: subcriberAPI.create
}

export const url = {
	shorten: urlAPI.shorten,
	redirect: urlAPI.redirect
}


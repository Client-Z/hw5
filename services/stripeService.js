const stripe = require('stripe')(process.env.STRIPE_SK)

const createCustomer = async (token, userObj) => {
	const user = userObj.get({ plain: true })
	const customer = await stripe.customers.create({
		email: user.email,
		source: token
	})
	const updated = await userObj.update({ stripe_customer_id: customer.id, stripe_card_id: customer.default_source })
	if (updated) return updated
	return null
}

const createCharge = async (customerID, cardID, amount, email) => {
	const charge = await stripe.charges.create({
		customer: customerID,
		amount: amount,
		currency: process.env.CURRENCY,
		description: `Charge Pro for ${email}`,
		source: cardID
	})
	return charge ? charge.receipt_url : null
}

const getChargesAmount = async customerID => {
	const charges = await stripe.charges.list({ customer: customerID })
	let sum = 0
	charges.data.forEach(item => {
		sum += item.amount
	})
	return sum / 100
}

module.exports = { createCustomer, createCharge, getChargesAmount }

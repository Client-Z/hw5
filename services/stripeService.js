const stripe = require('stripe')(process.env.STRIPE_SK)
const asyncHandler = require('express-async-handler')
const { Users } = require('../db/models/index')

const createCustomer = asyncHandler(async (token, user) => {
	const customer = await stripe.customers.create({ email: user.email, source: token })
	const updated = await Users.update(
		{ stripe_customer_id: customer.id, stripe_card_id: customer.default_source },
		{ where: { id: user.id } }
	)
	return updated ? { stripe_customer_id: customer.id, stripe_card_id: customer.default_source } : null
})

const createCharge = asyncHandler(async (customerID, cardID, amount, email) => {
	const charge = await stripe.charges.create({
		customer: customerID,
		amount: amount,
		currency: 'usd',
		description: `Charge Pro for ${email}`,
		source: cardID
	})
	return charge ? charge.receipt_url : null
})

const getChargesAmount = asyncHandler(async customerID => {
	const charges = await stripe.charges.list({ customer: customerID })
	let sum = 0
	charges.data.forEach(item => {
		sum += item.amount
	})
	return sum / 100
})

module.exports = { createCustomer, createCharge, getChargesAmount }

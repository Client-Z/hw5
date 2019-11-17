const stripe = require('stripe')(process.env.STRIPE_SK)

const createCustomer = async () => {
	const customer = await stripe.customers.create({
		email: 'denisoleshenko@gmail.com',
		source: 'tok_visa'
	})
	console.log(customer)
}

module.exports = { createCustomer }

// oleksii pk pk_test_pd1nhgyIjpwNW2oto1hDi97d00YWWvbYyw

// charges
// const createCharge = async () => {
// 	const charge = await stripe.charges.create({
// 		customer: 'cus_GA1dLrTn10ZGsf',
// 		amount: 1000,
// 		currency: 'usd',
// 		description: `Charge Pro for ${'oleskii.n@zazmic.com'}`,
// 		source: 'card_1FdhaSADwIHUXpUzrXfi0pv7'
// 	})
// 	console.log(charge)
// }
// createCharge()

// // charges list
// const getCharges = async () => {
// 	const charges = await stripe.charges.list({
// 		customer: 'cus_GA1dLrTn10ZGsf'
// 	})
// 	console.log(charges)
// }

// getCharges()

// module.exports = {  }

/*
	{ id: 'cus_GCC3XuON16ysAM',
  object: 'customer',
  address: null,
  balance: 0,
  created: 1573996816,
  currency: null,
  default_source: 'card_1FfnfoI7bg8b1964srdM5Ki9',
  delinquent: false,
  description: null,
  discount: null,
  email: 'denisoleshenko@gmail.com',
  invoice_prefix: 'E0196AAD',
  invoice_settings:
   { custom_fields: null,
     default_payment_method: null,
     footer: null },
  livemode: false,
  metadata: {},
  name: null,
  phone: null,
  preferred_locales: [],
  shipping: null,
  sources:
   { object: 'list',
     data: [ [Object] ],
     has_more: false,
     total_count: 1,
     url: '/v1/customers/cus_GCC3XuON16ysAM/sources' },
  subscriptions:
   { object: 'list',
     data: [],
     has_more: false,
     total_count: 0,
     url: '/v1/customers/cus_GCC3XuON16ysAM/subscriptions' },
  tax_exempt: 'none',
  tax_ids:
   { object: 'list',
     data: [],
     has_more: false,
     total_count: 0,
     url: '/v1/customers/cus_GCC3XuON16ysAM/tax_ids' },
  tax_info: null,
  tax_info_verification: null }
*/

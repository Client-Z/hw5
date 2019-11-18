/*
	GET /api/v1/fees - user fees
	PUT /api/v1/fees - make a payment to reach a pro-account
*/

const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')

const authCheck = require('../services/middlewares/authCheck')
const { createCharge, getChargesAmount } = require('../services/stripeService')
const { sgMail } = require('../services/emailService')
const totalBill = 100 // the sum needs to become a pro

router.get(
	'/',
	authCheck,
	asyncHandler(async (req, res) => {
		const user = req.user.get({ plain: true })
		if (!user.stripe_customer_id) return res.send({ data: { amount: 100 } })
		if (user.is_pro) return res.send({ data: { amount: 0 } })
		const total = await getChargesAmount(user.stripe_customer_id)
		res.send({ data: { amount: totalBill - total } })
	})
)

router.put(
	'/',
	authCheck,
	asyncHandler(async (req, res) => {
		const user = req.user.get({ plain: true })
		const cents = 100
		const chargeReport = await createCharge(user.stripe_customer_id, user.stripe_card_id, req.body.amount * cents, user.email)
		const total = await getChargesAmount(user.stripe_customer_id)
		sgMail.send({
			to: user.email,
			from: 'internship@zazmic.com',
			template_id: process.env.PAYMENT_TEMPLATE,
			dynamic_template_data: {
				chargeReport: chargeReport,
				sum: req.body.amount,
				rest: total < totalBill ? totalBill - total : 0
			}
		})
		// if user reach a pro
		if (!user.is_pro && total >= totalBill) {
			await req.user.update({ is_pro: true })
			sgMail.send({
				to: user.email,
				from: 'internship@zazmic.com',
				template_id: process.env.PRO_ACCOUNT_TEMPLATE
			})
		}
		res.send({ data: { amount: totalBill - total, user: user } })
	})
)

module.exports = router

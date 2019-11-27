const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

class SendgridService {
	static async sendEmail(to, from, templateId = '', dynamicData = {}) {
		await sgMail.send({
			to,
			from,
			template_id: templateId,
			dynamic_template_data: dynamicData
		})
	}
}

module.exports = { sgMail, SendgridService }

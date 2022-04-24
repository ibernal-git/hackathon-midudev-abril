import { Twilio, jwt } from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID
const apiKey = process.env.TWILIO_API_KEY
const apiSecret = process.env.TWILIO_API_SECRET

// Initialize Twilio client
const getTwilioClient = () => {
  if (!accountSid || !apiKey || !apiSecret) {
    throw new Error('Unable to initialize Twilio client')
  }
  return new Twilio(apiKey, apiSecret, { accountSid })
}

export const twilioClient = getTwilioClient()

// JWT Token generator
const getAccessToken = () => {
  if (!accountSid || !apiKey || !apiSecret) {
    throw new Error('Unable to initialize Access Token')
  }
  return new jwt.AccessToken(accountSid, apiKey, apiSecret)
}

export const getAcessToken = getAccessToken()

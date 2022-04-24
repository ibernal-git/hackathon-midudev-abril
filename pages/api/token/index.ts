// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { jwt } from 'twilio'
import { getAcessToken } from '../../../lib/twilio'

export default function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req
  if (method === 'POST') {
    const identity: string = req.body.username || ''
    const room: string = req.body.room || ''
    const accessToken = getAcessToken
    try {
      accessToken.identity = identity

      const grant = new jwt.AccessToken.VideoGrant({ room })

      accessToken.addGrant(grant)
    } catch (e) {
    interface Error {
      code?: number;
    }
    const error = e as Error
    if (error.code === 53205) {
      return res.status(400).send({
        message: `The user ${req.body.username} is already in a room. Please Log off first.`,
        error
      })
    } else {
      console.log('Unexpected error', e)
    }
    return res.status(400).send({
      message: `Unable to create new token for user=${req.body.username}`,
      error
    })
    }

    // Serialize the token to a JWT string and include it in a JSON response
    return res.status(200).json({ token: accessToken.toJwt() })
  }
  res.setHeader('Allow', ['POST'])
  res.status(405).end(`Method ${method} Not Allowed`)
}

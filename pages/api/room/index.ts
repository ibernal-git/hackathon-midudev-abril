import type { NextApiRequest, NextApiResponse } from 'next'
import { twilioClient } from '../../../lib/twilio'

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req
  if (method === 'GET') {
    // const { query: { id } } = req
    // const sid: string = id as string

    try {
    // Call the Twilio video API to retrieve the room you created
      // const room = await twilioClient.video.rooms(sid).fetch()
      const rooms = await twilioClient.video.rooms.list({ status: 'completed', limit: 20 })

      return res.status(200).send({ rooms })
    } catch (error) {
      return res.status(400).send({
        message: 'Unable to get rooms',
        error
      })
    }
  }
  if (method === 'POST') {
    const roomName: string = req.body.roomName || ''
    console.log(roomName)

    try {
    // Call the Twilio video API to create the new room.
      const room = await twilioClient.video.rooms.create({
        uniqueName: roomName,
        type: 'group'
      })
      console.log(room)
      // const newRoom = await twilioClient.video.connect()

      // Return the room details in the response.
      return res.status(200).send(room)
    } catch (e) {
      interface Error {
        code?: number;
      }
      const error = e as Error
      if (error.code === 53113) {
        return res.status(400).send({
          message: `Room name ${roomName} already exists`,
          error
        })
      } else {
        console.log('Unexpected error', e)
      }
      return res.status(400).send({
        message: `Unable to create new room with name=${roomName}`,
        error
      })
    }
  }
  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).end(`Method ${method} Not Allowed`)
}

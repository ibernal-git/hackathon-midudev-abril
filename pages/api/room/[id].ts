import type { NextApiRequest, NextApiResponse } from 'next'
import { twilioClient } from '../../../lib/twilio'

interface Room {
  name: string;
  sid: string;
}

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req
  const { query: { id } } = req
  const sid: string = id as string
  if (method === 'GET') {
    try {
    // Call the Twilio video API to retrieve the room you created
      const room = await twilioClient.video.rooms(sid).fetch()
      return res.status(200).send({ room })
    } catch (error) {
      return res.status(400).send({
        message: `Unable to get room with sid=${sid}`,
        error
      })
    }
  }
  if (method === 'DELETE') {
    try {
      // Update the status from 'in-progress' to 'completed'.
      const room = await twilioClient.video.rooms(sid).update({ status: 'completed' })

      // Create a `Room` object with the details about the closed room.
      const closedRoom: Room = {
        sid: room.sid,
        name: room.uniqueName
      }

      return res.status(200).send({ closedRoom })
    } catch (error) {
      return res.status(400).send({
        message: `Unable to complete room with sid=${sid}`,
        error
      })
    }
  }
  res.setHeader('Allow', ['GET', 'DELETE'])
  res.status(405).end(`Method ${method} Not Allowed`)
}

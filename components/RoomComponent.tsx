import { NextPage } from 'next'
import React, { useState, useEffect } from 'react'
import Video from 'twilio-video'
import ParticipantComponent from './ParticipantComponent'
import type { Room, LocalParticipant } from 'twilio-video'

interface RoomProps {
  roomName: string;
  token: string;
  handleLogout: (event: any) => void;
}

const RoomComponent: NextPage<RoomProps> = ({ roomName, token, handleLogout }) => {
  const [room, setRoom] = useState<Room | null>(null)
  const [participants, setParticipants] = useState<LocalParticipant[]>([])

  useEffect(() => {
    const participantConnected = (participant: any) => {
      setParticipants(prevParticipants => [...prevParticipants, participant])
    }

    const participantDisconnected = (participant: any) => {
      setParticipants(prevParticipants =>
        prevParticipants.filter(p => p !== participant)
      )
    }

    Video.connect(token, {
      name: roomName
    }).then(room => {
      setRoom(room)
      room.on('participantConnected', participantConnected)
      room.on('participantDisconnected', participantDisconnected)
      room.participants.forEach(participantConnected)
    })

    return () => {
      setRoom(currentRoom => {
        if (currentRoom && currentRoom.localParticipant.state === 'connected') {
          currentRoom.localParticipant.tracks.forEach(function (trackPublication) {
            // trackPublication.track.stop()
          })
          currentRoom.disconnect()
          return null
        } else {
          return currentRoom
        }
      })
    }
  }, [roomName, token])

  const remoteParticipants = participants.map(participant => (
    <ParticipantComponent key={participant.sid} participant={participant} />
  ))

  return (
    <div className="room">
      <h2>Room: {roomName}</h2>
      <button onClick={handleLogout}>Log out</button>
      <div className="local-participant">
        {room
          ? (
          <ParticipantComponent
            key={room.localParticipant.sid}
            participant={room.localParticipant}
          />
            )
          : (
              ''
            )}
      </div>
      <h3>Remote Participants</h3>
      <div className="remote-participants">{remoteParticipants}</div>
    </div>
  )
}

export default RoomComponent

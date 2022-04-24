import { GetServerSideProps, NextPage } from 'next'
import { useState, useCallback, FormEvent, ChangeEvent, MouseEvent, useEffect } from 'react'
import Lobby from './Lobby'
import RoomComponent from './RoomComponent'
import { getSession, useSession } from 'next-auth/react'

const VideoChat: NextPage = () => {
  const [username, setUsername] = useState('')
  const [roomName, setRoomName] = useState('')
  const [token, setToken] = useState(null)
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.user) {
      const name = String(session?.user?.name)
      setUsername(name)
    }
  }, [session])

  const handleRoomNameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setRoomName(event.target.value)
  }, [])

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      try {
        /*
            const response = await fetch('/api/room/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ roomName: newRoom })
            }).then(res => res.json())
            console.log(response)
          */
        const response = await fetch('/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ roomName, username })
        }).then(res => res.json())
        console.log(response)
        setToken(response.token)
      } catch (err) {
        console.error(err)
      }
    },
    [roomName, username]
  )

  const handleLogout = useCallback((event: MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setToken(null)
  }, [])

  if (token) {
    return (
      <RoomComponent roomName={roomName} token={token} handleLogout={handleLogout} />
    )
  }
  return (
      <Lobby
        roomName={roomName}
        handleRoomNameChange={handleRoomNameChange}
        handleSubmit={handleSubmit}
      />
  )
}

export default VideoChat

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)
  return {
    props: {
      session
    }
  }
}

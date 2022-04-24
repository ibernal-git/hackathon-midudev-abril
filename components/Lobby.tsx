import { NextPage } from 'next'

interface LobbyProps {
  roomName: string;
  handleRoomNameChange: (event: any) => void;
  handleSubmit: (event: any) => void;
}

const Lobby: NextPage<LobbyProps> = ({
  roomName,
  handleRoomNameChange,
  handleSubmit
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <h2>Enter a room</h2>

      <div>
        <label htmlFor="room">Room name:</label>
        <input
          type="text"
          id="room"
          value={roomName}
          onChange={handleRoomNameChange}
          required
        />
      </div>

      <button type="submit">Submit</button>
    </form>
  )
}

export default Lobby

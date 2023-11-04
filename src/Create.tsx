import { useNavigate } from "react-router-dom";
import './App.css';

export default function Create() {
    const navigate = useNavigate();

    async function createRoom() {
        try {
          let response = await fetch("https://meeting-backend-vercel.vercel.app/create-room");
          if (!response.ok) {
            throw new Error("error creating room");
          }
          let data = await response.json();
          localStorage.setItem("room_id", data.room_id);
          navigate('/meeting')
        }
        catch(error) {
          console.error("error creating room", error);
        }
    };

  return (
    <div className="happy">
      <div><button onClick={() => navigate('/')}>Go back to home page</button></div>
        <p>Name:</p>
        <input type="text" onChange={(e) => localStorage.setItem("name", e.target.value)}></input>
        <div><button onClick={createRoom}>Create Room</button></div>
    </div>
  )
}
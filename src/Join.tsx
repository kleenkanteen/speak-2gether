import { useNavigate } from "react-router-dom";
import './App.css';
import './index.css'


export default function Join() {
    const navigate = useNavigate();

  return (
    <div className="happy">
      <div><button onClick={() => navigate('/')}>Go back to home page</button></div>

        <div>
            <p>Name:</p>
            <input type="text" onChange={(e) => localStorage.setItem("name", e.target.value)}></input>
        </div>

        <div>
            <p>Room ID:</p>
            <input type="text" onChange={(e) => localStorage.setItem("room_id", e.target.value)}></input>
        </div>

        <button onClick={() => navigate('/meeting')}>Join Room</button>
    </div>
  )
}
import { useNavigate } from "react-router-dom";
import './App.css';
import './index.css';

function App() {
  // useEffect(() => {
  //   invoke('greet', { name: 'World' }).then((response) => console.log(response));
  //   (async () => await appWindow.setAlwaysOnTop(true))();
  // }, [])

  const navigate = useNavigate();
  
  return (
    <div className="happy">
        <div><button onClick={() => navigate('/create-room')}>Create Room</button></div>
        <div><button onClick={() => navigate('/join-room')}>Join Room</button></div>
    </div>
  )
}

export default App;
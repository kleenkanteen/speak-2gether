import * as Ably from 'ably';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import './App.css';
import './index.css';

export default function Meeting() {
  const [message, updateMessage] = useState("");
  const [ably, setAbly] = useState(null);
  const [channel, setChannel] = useState(null);
  const [order, setOrder] = useState(null);

  const navigate = useNavigate();

  function updateOrder() {
    if (!order) {
      console.log("Setting order to: ", [message]);
      setOrder(() => [message]);
    }
    else if (message === order[0] && order.length === 1) {
      setOrder(() => []);
    }
    else if (message === order[0]) {
      setOrder((prev) => prev.slice(1));
    } else {
      setOrder((prev) => [...prev, message]);
    }
  }

  useEffect(() => {
    console.log("Updated message:", message);
    console.log("Updated order: plse", order);
    if (!message) return;
  }, [message])

  useEffect(() => {
    getToken();

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        talkTrigger();
      }
    };
  
    document.addEventListener('keydown', handleEscapeKey);
  
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [])

  useEffect(() => {
    console.log("Updated order:", order);
  }, [order]);


  useEffect(() => {
    if (ably) getChannel();
  }, [ably])

  // invoke('greet', { name: 'World' }).then((response) => console.log(response));
  // (async () => await appWindow.setAlwaysOnTop(true))();


  async function getToken() {
    let name = localStorage.getItem("name");
    let room_id = localStorage.getItem("room_id");
    const client = await new Ably.Realtime({ authUrl: "https://meeting-backend-vercel.vercel.app/auth", authMethod: "POST", authParams: { name: name, room_id: room_id}});
    await client.connection.once('connected');
    console.log('Connected to Ably!');
    console.log("Current room is", room_id);
    await setAbly(() => client);
    console.log(client);
  }

  async function getChannel() {
    let room_id = localStorage.getItem("room_id");
    console.dir(ably.channels.all)
    const channel = await ably.channels.get(`${room_id}`);
    await channel.subscribe("meeting", (message) => {
      console.log('User event: ' + message.data);
      updateMessage(() => message.data);
      updateOrder();
    });
    setChannel(() => channel);
    console.log(channel);
  }

  function talkTrigger() {
    channel.publish("meeting", localStorage.getItem("name"));
  }

  return (
    <div className='happy'>
      <div><button onClick={() => navigate('/')}>Go home</button></div>
        <p>{"Name: " + localStorage.getItem("name")}      </p>
        <p>{"Room ID: " + localStorage.getItem("room_id")}</p>

        <div className='happy'>
        <button onClick={talkTrigger}> 
          {!order || (order && (localStorage.getItem("name") !== order[0])) ? 
            <p>Queue in</p> : 
            <p>Stop talking</p>}
        </button>
          { order && (
            order[0] === localStorage.getItem("name") ? <div className="go"></div> : <div className="stop"></div>
          )}

          { order && order.map(ele => <p>Next up: {ele}</p>) }
        </div>
    </div>
  )
}
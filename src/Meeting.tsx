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
  const [newMessage, setNW] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!message) return;
    if (!order) {
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
  }, [message, newMessage])

  useEffect(() => {
    getToken();
  }, [])

  useEffect(() => {
    if (ably) getChannel();
  }, [ably])

  useEffect(() => {
    if (channel) {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        talkTrigger();
      }
    };
  
    document.addEventListener('keydown', handleEscapeKey);
  
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }
  }, [channel])
  


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
    await channel.subscribe("meeting", (msg) => {
      console.log('User event: ' + msg.data);
      if (msg.data == message) {
        console.log("Same user lcicked");
        setNW((prev) => !prev);
      }
      else { 
        updateMessage(() => msg.data);
      }
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
        <b>Press escape or button below:</b>

        <div className='happy'>
        <button onClick={talkTrigger}> 
          {!order || (order && (localStorage.getItem("name") !== order[0])) ? 
            <p>Queue in</p> : 
            <p>Stop talking</p>}
        </button>
          { order && (
            order[0] === localStorage.getItem("name") ? <div className="go"></div> : <div className="stop"></div>
          )}

        {order && <b>Next up</b>}

        {order && order.map((order) => <p>{order}</p>)}
      
        </div>
    </div>
  )
}
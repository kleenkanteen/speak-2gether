import * as Ably from 'ably';
import { useEffect, useState } from 'react';
import './App.css';
import './index.css'
import { useNavigate } from "react-router-dom";

export default function Meeting() {
  const [messages, updateMessages] = useState("");
  const [ably, setAbly] = useState(null);
  const [channel, setChannel] = useState(null);
  const [order, setOrder] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!messages) return;
    if (!order) {
      return setOrder(() => [messages]);
    }
    if (messages === order[0]) {
      setOrder((prev) => prev.slice(1));
    } else {
      setOrder((prev) => [...prev, messages]);
    }
  }, [messages])

  useEffect(() => {
    getToken();
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
      updateMessages(message.data);
    });
    setChannel(() => channel);
    console.log(channel);
  }
    

  return (
    <div className='happy'>
      <div><button onClick={() => navigate('/')}>Go home</button></div>
        <p>{"Name: " + localStorage.getItem("name")}      </p>
        <p>{"Room ID: " + localStorage.getItem("room_id")}</p>

        <div className='happy'>
        <button onClick={() => channel.publish("meeting", localStorage.getItem("name"))}>Queue in</button>
          { order && (
            order[0] === localStorage.getItem("name") ? <div className="go"></div> : <div className="stop"></div>
          )}
        </div>
    </div>
  )
}
import { websocket } from 'ws'

const socket = new Websocket('ws://localhost:9091')

socket.addEventListener('open' => {
  console.log("Opening socket for worker")
  const data = { type: 'message', content: "Hello I'm alive" }
  socket.send(JSON.stringify(data))
});

socket.addEventListener('message', event => {
  try {
    const data = JSON.parse(event.data)
  } catch(e) {
    console.error(error);
  }
})

<template>
  <div>
    <input placeholder="Room Number..." v-model="room" />
    <button @click="joinRoom">Join Room</button>
    <input placeholder="Message..." v-model="message" />
    <button @click="sendMessage">Send Message</button>
    <div v-for="(msg, index) in messages" :key="index">
      <h1>Message:</h1>
      {{ msg }}
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';

const socket = io.connect('http://localhost:3001');

export default {
  data() {
    return {
      room: '',
      message: '',
      messages: [],
    };
  },
  methods: {
    joinRoom() {
      if (this.room !== '') {
        socket.emit('join_room', this.room);
      }
    },
    sendMessage() {
      const data = {
        message: this.message,
        room: this.room,
      };

      this.messages.push(data.message);

      socket.emit('send_message', data);
    },
  },
  created() {
    socket.on('receive_message', (data) => {
      this.messages.push(data.message);
    });
  },
};
</script>

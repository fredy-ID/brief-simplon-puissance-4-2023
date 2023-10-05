<template>
  <div>
    <input placeholder="Room Number..." v-model="room" />
    <button @click="joinRoom" class="bg-green-900 hover:bg-green-800 text-white font-bold py-1 px-2 rounded-full">Join Room</button>
    <input placeholder="Message..." v-model="message" />
    <button @click="sendMessage"  class="bg-blue-900 hover:bg-blue-800 text-white font-bold py-1 px-2 rounded-full">Send Message</button>
    <div v-for="(msg, index) in messages" :key="index">
      <h1>Message:</h1>
      <p class="">{{ msg }}</p>
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

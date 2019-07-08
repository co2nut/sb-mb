import io from 'socket.io-client';
import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import authentication from '@feathersjs/authentication-client';

const socket = io('http://192.168.0.118:4441');
// const socket = io('https://mtse-utipay-new2.herokuapp.com/');
// const socket = io('https://utipay-api.herokuapp.com');
const client = feathers();

client.configure(socketio(socket));
client.configure(authentication({
  storage: window.localStorage
}));

export default client;

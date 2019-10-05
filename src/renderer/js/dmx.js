import { Receiver } from 'sacn';

const server = new Receiver({
  universes: [1], // TODO: allow user to select
  reuseAddr: true,
  iface: '192.168.10.39', // TODO: allow user to select
});
server.on('PacketCorruption', console.warn);
server.on('PacketOutOfOrder', console.warn);

console.log('hello');

export default server;

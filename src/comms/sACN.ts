import { Receiver } from 'sacn';

export const sACN = new Receiver({
  universes: [1], // TODO: allow user to select
  reuseAddr: true,
  iface: '192.168.10.12', // TODO: allow user to select
});
sACN.on('PacketCorruption', console.warn);
sACN.on('PacketOutOfOrder', console.warn);

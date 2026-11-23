// The story (game.js) and the phone screen (phone.js) live in the same page: this is the small bridge between them.
// Messages are delivered a moment later, like on a real connection, so neither side is called in the middle of the other.
const Link = {
  connected: true,
  onMessage: () => {},                                   // the phone answered (game.js listens)
  send: m => { setTimeout(() => Phone.receive(m), 0); }, // the story tells the phone
  toGame: m => { setTimeout(() => Link.onMessage(m), 0); },
};

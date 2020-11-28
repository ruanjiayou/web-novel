import io from 'socket.io-client';

export const ws = io(process.env.NODE_ENV !== 'production' ? "http://localhost:8097/" : '/', {
  path: '/ws'
});

ws.on('connect', (socket) => {
  console.log('connected');
  if (window.Notification && window.Notification.permission !== "granted") {
    window.Notification.requestPermission(function (status) {
      if (window.Notification.permission !== status) {
        window.Notification.permission = status;
      }
    });
  }
  ws.emit('message', '2049')
});

ws.on('disconnect', () => {
  console.log('disconnected');
});
ws.on('message', (data) => {
  const key = `${data.module}-${data.name}`;
  console.log(key, data.data)
})

ws.on('open', () => {
  console.log('open');
})

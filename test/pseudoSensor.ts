import socketManager from '../src/socket.io/socketManager';

setInterval(() => {
    socketManager.sendData({ date: new Date(), type: 'temparature', value: Math.random() * 30 })
        .then(() => console.log('+++ One log sent'))
        .catch((err) => console.log(err));
}, 1000);

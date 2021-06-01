const ENV = process.env.NODE_ENV;

let apiAddr = '/ai'; // 'http://192.168.1.201:8084/ai';
let wsAddr = 'ws://192.168.1.225';

if (ENV === 'production') {
  // apiAddr = 'http://192.168.1.222/ai';
  apiAddr = '/ai';
  wsAddr = 'ws://192.168.1.225';
}

export {
  apiAddr,
  wsAddr
};

import { wsAddr } from '@/api/config';
import { api } from '@/api/api';
let dcAIUserToken = window.localStorage.getItem('dcAIUserToken');
export const createWs = {
  methods: {
    initWs () {
      if (window.ws) {
        if (window.ws.readyState === 1) return;
        if (window.ws.readyState === 3) {
          window.ws = new WebSocket(wsAddr + api.changeProcess + this.projectId + '/' + dcAIUserToken + '/');
        }
      } else {
        window.ws = new WebSocket(wsAddr + api.changeProcess + this.projectId + '/' + dcAIUserToken + '/');
      }
    },
    closeWs () {
      if (window.ws) {
        window.ws.close();
        window.ws = null;
      }
    },
    createHeartBeat () {
      if (window.heartBeat) {
        clearInterval(window.heartBeat);
        window.heartBeat = null;
      }
      window.heartBeat = setInterval(() => {
        if (!window.ws) {
          clearInterval(window.heartBeat);
          window.heartBeat = null;
        } else {
          if (window.ws.readyState === 1) window.ws.send(JSON.stringify('hi'));
        }
      }, 10000);
    }
  }
};

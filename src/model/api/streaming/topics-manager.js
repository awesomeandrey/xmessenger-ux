import SockJS from "sockjs-client";

import {API_SERVER_URL} from "../rest/client-util";
import {Stomp} from "stompjs/lib/stomp.js";

const _stompClientClosure = _ => {
    let _stompClient = null; //
    return function (callback) {
        if (!!_stompClient && _stompClient.connected) {
            callback(_stompClient);
            return;
        }
        const _socket = SockJS(API_SERVER_URL.concat("/ws-configurator")), stompClient = Stomp.over(_socket);
        stompClient.debug = null; // disable logging;
        stompClient.connect({}, frame => {
            _stompClient = stompClient; // save to closure;
            callback(stompClient);
        });
    };
}, _getStompClient = _stompClientClosure();

export const sendMessage = ({destination, body}) => {
    return _getStompClient(stompClient => {
        stompClient.send(`/message${destination}`, {}, JSON.stringify(body));
    });
};

export const subscribe = (registrations) => {
    _getStompClient(stompClient => {
        registrations.forEach(registration => {
            stompClient.subscribe(registration.route, registration.callback);
        });
    });
};
import SockJS from "sockjs-client";

import {API_SERVER_URL} from "./../../../constants";
import {Stomp} from "stompjs/lib/stomp.js";

const _wsConfigUrlPath = "/ws-configurator", _stompClientClosure = _ => {
    let _stompClient = null; //
    return function (callback) {
        if (!!_stompClient && _stompClient.connected) {
            callback(_stompClient);
            return;
        }
        const _socket = SockJS(API_SERVER_URL.concat(_wsConfigUrlPath)), stompClient = Stomp.over(_socket);
        stompClient.debug = null; // disable logging;
        stompClient.connect({}, frame => {
            _stompClient = stompClient; // save to closure;
            callback(stompClient);
        });
    };
}, _getStompClient = _stompClientClosure();

export const sendMessage = ({destination, body}) => {
    const PATH_PREFIX = "/ws-message";
    return _getStompClient(stompClient => {
        stompClient.send(PATH_PREFIX.concat(destination), {}, JSON.stringify(body));
    });
};

export const subscribe = (registrations) => {
    _getStompClient(stompClient => {
        registrations.forEach(registration => {
            stompClient.subscribe(registration.route, registration.callback);
        });
    });
};

export const parsePayload = payload => JSON.parse(payload.body);
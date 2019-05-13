export const CustomEvents = {
    register: ({eventName, callback, capture = false}) => {
        if (!eventName || typeof callback !== "function") {
            throw "While adding event listener, make sure that 'eventName' and 'callback' params are not undefined!";
        }
        window.addEventListener(eventName, callback, capture);
    },
    fire: ({eventName, detail = {}, callback}) => {
        if (!eventName) {
            console.error("'eventName' cannot be null!");
            return;
        }
        let evt = new CustomEvent(eventName, {detail: detail});
        // Fire custom event;
        window.dispatchEvent(evt);
        // Execute callback after event firing;
        if (typeof callback === "function") {
            callback();
        }
        return Promise.resolve(null);
    }
};

export const KeyEvents = {
    register: ({eventName, handler}) => {
        document.addEventListener(eventName, handler);
    }
};

export const NodeEvents = {
    add: ({eventName, node, callback}) => {
        if (!eventName || node == null || typeof callback !== "function") {
            throw "While adding event listener, make sure that 'eventName', 'node' and 'callback' params are not undefined!";
        }
        node.addEventListener(eventName, callback);
    }
};
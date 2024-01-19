export class KeyListener {
    _keyStates;
    _keyMap;
    constructor() {
        this._keyStates = new Map;
        this._keyMap = new Map;
        window.addEventListener("keydown", this.handleKeyDown.bind(this));
        window.addEventListener("keyup", this.handleKeyUp.bind(this));
    }
    handleKeyDown(event) {
        const key = event.key;
        if (!this._keyStates.get(key)) {
            this._keyStates.set(key, true);
            const callback = this._keyMap.get(key);
            if (callback) {
                callback();
            }
        }
    }
    handleKeyUp(event) {
        const key = event.key;
        this._keyStates.set(key, false);
    }
    checkKeysPressed() {
        for (const [key, value] of this._keyStates) {
            if (value && this._keyMap.has(key)) {
                return true;
            }
        }
        return false;
    }
    addKeyCallback(key, callback) {
        this._keyMap.set(key, callback);
    }
    isKeyPressed(key) {
        const keyState = this._keyStates.get(key);
        return keyState ? keyState : false;
    }
    isKeyRegistered(key) {
        return this._keyMap.has(key);
    }
    removeKeyCallback(key) {
        this._keyMap.delete(key);
    }
}

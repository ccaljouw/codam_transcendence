
export class KeyListenerComponent {
	private _keyStates: Map<string, boolean>;
	private _keyMap: Map<string, Function | undefined>;

	constructor() {
		// Initialize the key states map and the key callback map.
		this._keyStates = new Map<string, boolean>;
		this._keyMap = new Map<string, Function | undefined>;

		window.addEventListener("keydown", this.handleKeyDown.bind(this));
		window.addEventListener("keyup", this.handleKeyUp.bind(this));
	}
  
	
	// Set the state for this key to pressed if it is not already and call the callback function.
	private handleKeyDown(event: KeyboardEvent) {
		// event.preventDefault(); // turn this on to disable normal key functionality like scrolling with arrows
		const key = event.key;
		if (!this._keyStates.get(key)) {
			this._keyStates.set(key, true);
			const callback = this._keyMap.get(key);
			if (callback) {
				callback();
			}
		}
	}

	
	// Set the state for this key to released.
	private handleKeyUp (event: KeyboardEvent) {
		const key = event.key;
		this._keyStates.set(key, false);
	}
	

	//iterate trough all keystates and check if any of them is true andif it is registered
 	public checkKeysPressed() {
		for (const [key, value] of this._keyStates) {
			if (value && this._keyMap.has(key)) {
				return true;
			}
		}
		return false;
	}
	
		
	// Set the callback function for the specified key.
	public addKeyCallback(key: string, callback: Function) {
		this._keyMap.set(key, callback);
	}
	

	// Check if the specified key is currently in a pressed state.
	public isKeyPressed(key: string) {
		const keyState = this._keyStates.get(key);
		return keyState ? keyState : false;
	}


	//check if the key is in the map
	public isKeyRegistered(key: string) {
		return this._keyMap.has(key);
	}
	

	// Remove the callback function for the specified key.
	public removeKeyCallback(key: string) {
		this._keyMap.delete(key);
	}
  }

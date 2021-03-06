var Gamepad = require("./gamepad");
var Keyboard = require("./keyboard");
var StandardController = require("../controllers/standardcontroller");

function Input( system  ) {
	this.system = system;
	this.controllers = system.controllers;
	this.inputHandlers = new Array( 2 );

	this.initConfig();

	// only enable input in browsers
	if ( typeof window !== "undefined" ) {
		this.enable();
	}
}

Input.prototype = {
	/**
	 * Enable all input.
	 */
	enable: function() {
		this._setEnabled( true );
	},

	/**
	 * Disable all input.
	 */
	disable: function() {
		this._setEnabled( false );
	},

	/**
	 * Set enabled yes/no.
	 * Helper method for enable and disable.
	 * @param {boolean} enabled - If true enable, otherwise disable.
	 */
	_setEnabled: function( enabled ) {
		var handlers,
			method = enabled ? "enable" : "disable";

		this._enabled = enabled;
		for ( var i = 0; i < this.inputHandlers.length; i++ ) {
			handlers = this.inputHandlers[ i ];
			if ( handlers )  {
				handlers[ method ]();
			}
		}
	},

	/**
	 * Initialize total input config.
	 */
	initConfig: function() {
		var item,
		    config = this.config = this.system.config.input;

		for ( var i = 0; i < config.length; i++ ) {
			item = config[ i ];
			
			this.setController( i, item.type );
			this.configure( i, item.controls.type, item.controls.config );
		}
	},

	/**
	 * Connect a controller of given type.
	 * @param {number} index - Either 0 or 1.
	 * @param {string} type - Type of controller (eg. 'standard').
	 */
	setController: function( index, type ) {
		var Controller = controllerMap[ type ];
		this.controllers.connect( index, new Controller() );
	},

	/**
	 * Configure the input for a controller
	 * @param {number} index - Either 0 or 1
	 * @param {string} input - Type of input handler (either 'keyboard' or 'gamepad')
	 * @param {object} config - Configuration for input handler (see config.json for examples)
	 */
	configure: function( index, input, config ) {
		var currentHandler,
			InputHandler = inputHandlerMap[ input ],
			controller = this.controllers.get( index );

		currentHandler = this.inputHandlers[ index ];
		if ( currentHandler ) {
			currentHandler.disable();
		}

		this.inputHandlers[ index ] = new InputHandler( controller, config );

		if ( this._enabled ) {
			this.inputHandlers[ index ].enable();
		}
	}
};

var controllerMap = {
	"standard": StandardController
};

var inputHandlerMap = {
	"gamepad": Gamepad,
	"keyboard": Keyboard
};

module.exports = Input;

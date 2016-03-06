/**
 * Represents caret view for input.
 *
 * @param {TerminalInput} INPUT
 * @constructor
 */
var TerminalInputCaret = function (INPUT) {

    /**
     * @type {TerminalInput}
     */
    this.INPUT = INPUT;

    /**
     * @type {HTMLElement}
     * @private
     */
    this._element = document.createElement("div");

    this.initialize();

};

TerminalInputCaret.prototype.CARET_CLASS_NAME = "terminalCaret";

TerminalInputCaret.prototype.initialize = function () {
    this._element.className = this.CARET_CLASS_NAME;
};

/**
 * Shows & updates terminal caret.
 */
TerminalInputCaret.prototype.update = function () {

    var line = this.INPUT.TERMINAL.output.getLineByIndex(
        this.INPUT.INITIAL_POSITION.line + Math.floor(
            (this.INPUT.INITIAL_POSITION.position + this.INPUT.getCaretPosition())
            / this.INPUT.TERMINAL.output.WIDTH
        )
    );

    if (!line) {
        console.warn("Cannot get current terminal line element.");
        return;
    }

    this._element.style.left = (this.INPUT.INITIAL_POSITION.position
        + this.INPUT.TERMINAL.elements.input.selectionStart) % this.INPUT.TERMINAL.output.WIDTH
        * this.INPUT.TERMINAL.output.SYMBOL_PIXEL_WIDTH + "px";


    this._element.style.top = line.getElement().offsetTop + "px";
    this.INPUT.TERMINAL.elements.output.appendChild(this._element);

};

/**
 * Hides input caret.
 */
TerminalInputCaret.prototype.hide = function () {

    if (this._element.parentNode) {
        this._element.parentNode.removeChild(this._element);
    }

};
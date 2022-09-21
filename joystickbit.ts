enum Buttons {
    //% block="THUMBSTICK LEFT"
    THUMBSTICK_LEFT = 0,
    //% block="THUMBSTICK RIGHT" 
    THUMBSTICK_RIGHT = 1,
    //% block="LEFT"
    BUTTON_LEFT = 2,
    //% block="RIGHT" 
    BUTTON_RIGHT = 3,
    //% block="BUTTON A"
    BUTTON_A = 4,
    //% block="BUTTON B" 
    BUTTON_B = 5,
    //% block="BUTTON AB"
    BUTTON_AB = 6,
}

enum Direction {
    //% block="None"
    NONE = 0,
    //% block="North"
    NORTH = 1,
    //% block="North East" 
    NORTH_EAST = 2,
    //% block="East"
    EAST = 3,
    //% block="South East" 
    SOUTH_EAST = 4,
    //% block="South" 
    SOUTH = 5,
    //% block="South West" 
    SOUTH_WEST = 6,
    //% block="West" 
    WEST = 7,
    //% block="North West" 
    NORTH_WEST = 8,
}

enum KeyStatus {
    //% block="DOWN"
    PRESS_DOWN = 0,   //press
    //% block="UP"
    PRESS_UP = 1,    //release
    //% block="CLICK1"
    SINGLE_CLICK = 3,     //click
    //% block="CLICK2"
    DOUBLE_CLICK = 4,    //double click
    //% block="HOLD"
    LONG_PRESS_HOLD = 6,    //long pressed
    //% block="PRESS"
    NONE_PRESS = 8,      //not pressed
}

enum Axis {
    //% block="X"
    X_AXIS = 0,
    //% block="Y"
    Y_AXIS = 1,
}

enum Stick {
    //% block="LEFT"
    LEFT = 1,
    //% block="RIGHT"
    RIGHT = 0,
}

//% color="#FF6EC7" weight=10 icon="\uf11b" block="Tiger Fancy Joystick"
//% category="Joystick"
namespace joystick {

    let alreadyStarted = false;
    const SWITCH_PRESSED = 5010;
    const THUMBSTICK_LEFT_MOVED = 6010;
    const THUMBSTICK_RIGHT_MOVED = 7010;
    const pinOffset = 1000;
    export const centered = 128;
    
    const timeToRepeatMs = 100;
    const timeToSettleMs = 50;

    const SMOOTHING_WINDOW_SIZE = 1000 / timeToRepeatMs;
    let THUMBSTICK_LEFT_X_AVERAGES: number[] = [];
    let THUMBSTICK_LEFT_Y_AVERAGES: number[] = [];
    let THUMBSTICK_RIGHT_X_AVERAGES: number[] = [];
    let THUMBSTICK_RIGHT_Y_AVERAGES: number[] = [];

    let THUMBSTICK_LEFT_X_AVERAGES_INDEX = 0;
    let THUMBSTICK_LEFT_Y_AVERAGES_INDEX = 0;
    let THUMBSTICK_RIGHT_X_AVERAGES_INDEX = 0;
    let THUMBSTICK_RIGHT_Y_AVERAGES_INDEX = 0;

    for (let i = 0; i < SMOOTHING_WINDOW_SIZE; i++) {
        THUMBSTICK_LEFT_X_AVERAGES.push(centered);
        THUMBSTICK_LEFT_Y_AVERAGES.push(centered);
        THUMBSTICK_RIGHT_X_AVERAGES.push(centered);
        THUMBSTICK_RIGHT_Y_AVERAGES.push(centered);
    }

    let PREV_THUMBSTICK_LEFT = -1
    let PREV_THUMBSTICK_RIGHT = -1
    let PREV_BUTTON_LEFT = -1
    let PREV_BUTTON_RIGHT = -1

    let PREV_THUMBSTICK_LEFT_X = centered;
    let PREV_THUMBSTICK_LEFT_Y = centered;
    let PREV_THUMBSTICK_RIGHT_X = centered;
    let PREV_THUMBSTICK_RIGHT_Y = centered;

    /**
      * Add into the start function to initialise the joystick.
    */
    //% weight=100
    //% blockId="startjoystick" block="Start Joystick"
    export function start(): void {

        //prevent running more than once
        if (alreadyStarted == true) {
            return;
        } else {
            alreadyStarted = true;
        }

        //set-up I2C fetch loop
        loops.everyInterval(timeToRepeatMs, function () {

            BUTTON_LEFT = i2cread(THUMBSTICK_I2C_ADDR, BUTTON_LEFT_REG);
            BUTTON_RIGHT = i2cread(THUMBSTICK_I2C_ADDR, BUTTON_RIGHT_REG);

            THUMBSTICK_BUTTON_LEFT = i2cread(THUMBSTICK_I2C_ADDR, THUMBSTICK_BUTTON_LEFT_REG);
            THUMBSTICK_BUTTON_RIGHT = i2cread(THUMBSTICK_I2C_ADDR, THUMBSTICK_BUTTON_RIGHT_REG);

            THUMBSTICK_LEFT_X_RAW = i2cread(THUMBSTICK_I2C_ADDR, THUMBSTICK_LEFT_X_REG);
            THUMBSTICK_LEFT_Y_RAW = i2cread(THUMBSTICK_I2C_ADDR, THUMBSTICK_LEFT_Y_REG);
            THUMBSTICK_RIGHT_X_RAW = i2cread(THUMBSTICK_I2C_ADDR, THUMBSTICK_RIGHT_X_REG);
            THUMBSTICK_RIGHT_Y_RAW = i2cread(THUMBSTICK_I2C_ADDR, THUMBSTICK_RIGHT_Y_REG);
        })

        loops.everyInterval(timeToRepeatMs, function () {

            THUMBSTICK_LEFT_X_AVERAGES[THUMBSTICK_LEFT_X_AVERAGES_INDEX] = THUMBSTICK_LEFT_X_RAW;
            THUMBSTICK_LEFT_Y_AVERAGES[THUMBSTICK_LEFT_Y_AVERAGES_INDEX] = THUMBSTICK_LEFT_Y_RAW;
            THUMBSTICK_RIGHT_X_AVERAGES[THUMBSTICK_RIGHT_X_AVERAGES_INDEX] = THUMBSTICK_RIGHT_X_RAW;
            THUMBSTICK_RIGHT_Y_AVERAGES[THUMBSTICK_RIGHT_Y_AVERAGES_INDEX] = THUMBSTICK_RIGHT_Y_RAW;

            THUMBSTICK_LEFT_X_AVERAGES_INDEX = THUMBSTICK_LEFT_X_AVERAGES_INDEX + 1;
            THUMBSTICK_LEFT_Y_AVERAGES_INDEX = THUMBSTICK_LEFT_Y_AVERAGES_INDEX + 1;
            THUMBSTICK_RIGHT_X_AVERAGES_INDEX = THUMBSTICK_RIGHT_X_AVERAGES_INDEX + 1;
            THUMBSTICK_RIGHT_Y_AVERAGES_INDEX = THUMBSTICK_RIGHT_Y_AVERAGES_INDEX + 1;

            if (THUMBSTICK_LEFT_X_AVERAGES_INDEX > SMOOTHING_WINDOW_SIZE) {
                THUMBSTICK_LEFT_X_AVERAGES_INDEX = 0;
            }
            if (THUMBSTICK_LEFT_Y_AVERAGES_INDEX > SMOOTHING_WINDOW_SIZE) {
                THUMBSTICK_LEFT_Y_AVERAGES_INDEX = 0;
            }
            if (THUMBSTICK_RIGHT_X_AVERAGES_INDEX > SMOOTHING_WINDOW_SIZE) {
                THUMBSTICK_RIGHT_X_AVERAGES_INDEX = 0;
            }
            if (THUMBSTICK_RIGHT_Y_AVERAGES_INDEX > SMOOTHING_WINDOW_SIZE) {
                THUMBSTICK_RIGHT_Y_AVERAGES_INDEX = 0;
            }

            let avg = 0;

            for (let i = 0; i < SMOOTHING_WINDOW_SIZE; i++) {
                avg = avg + THUMBSTICK_LEFT_X_AVERAGES[i];
            }

            THUMBSTICK_LEFT_X_AVG = Math.trunc(avg / SMOOTHING_WINDOW_SIZE);

            //reset to zero
            avg = 0;

            for (let i = 0; i < SMOOTHING_WINDOW_SIZE; i++) {
                avg = avg + THUMBSTICK_LEFT_Y_AVERAGES[i];
            }

            THUMBSTICK_LEFT_Y_AVG = Math.trunc(avg / SMOOTHING_WINDOW_SIZE);

            //reset to zero
            avg = 0;

            for (let i = 0; i < SMOOTHING_WINDOW_SIZE; i++) {
                avg = avg + THUMBSTICK_RIGHT_X_AVERAGES[i];
            }

            THUMBSTICK_RIGHT_X_AVG = Math.trunc(avg / SMOOTHING_WINDOW_SIZE);

            //reset to zero
            avg = 0;

            for (let i = 0; i < SMOOTHING_WINDOW_SIZE; i++) {
                avg = avg + THUMBSTICK_RIGHT_Y_AVERAGES[i];
            }

            THUMBSTICK_RIGHT_Y_AVG = Math.trunc(avg / SMOOTHING_WINDOW_SIZE);
        })

        //set-up event loop
        loops.everyInterval(timeToRepeatMs, function () {

            if (input.runningTime() > timeToSettleMs) {

                //check for button clicks
                if (PREV_THUMBSTICK_LEFT != THUMBSTICK_BUTTON_LEFT) {
                    control.raiseEvent(SWITCH_PRESSED + Buttons.THUMBSTICK_LEFT, Buttons.THUMBSTICK_LEFT + pinOffset)
                }

                if (PREV_BUTTON_LEFT != BUTTON_LEFT) {
                    control.raiseEvent(SWITCH_PRESSED + Buttons.BUTTON_LEFT, Buttons.BUTTON_LEFT + pinOffset)
                }

                if (PREV_THUMBSTICK_RIGHT != THUMBSTICK_BUTTON_RIGHT) {
                    control.raiseEvent(SWITCH_PRESSED + Buttons.THUMBSTICK_RIGHT, Buttons.THUMBSTICK_RIGHT + pinOffset)
                }

                if (PREV_BUTTON_RIGHT != BUTTON_RIGHT) {
                    control.raiseEvent(SWITCH_PRESSED + Buttons.BUTTON_RIGHT, Buttons.BUTTON_RIGHT + pinOffset)
                }

                //set previous button state
                PREV_THUMBSTICK_LEFT = THUMBSTICK_BUTTON_LEFT
                PREV_BUTTON_LEFT = BUTTON_LEFT
                PREV_THUMBSTICK_RIGHT = THUMBSTICK_BUTTON_RIGHT
                PREV_BUTTON_RIGHT = BUTTON_RIGHT

                //thumbsticks
                leftThumbstick();
                rightThumbstick();
            }
        })
    }

    function leftThumbstick() {

        if (THUMBSTICK_LEFT_X_AVG != PREV_THUMBSTICK_LEFT_X ||
            THUMBSTICK_LEFT_Y_AVG != PREV_THUMBSTICK_LEFT_Y) {
            control.raiseEvent(THUMBSTICK_LEFT_MOVED, THUMBSTICK_LEFT_X_AVG + THUMBSTICK_LEFT_Y_AVG);
        }

        //remember for next loop
        PREV_THUMBSTICK_LEFT_X = THUMBSTICK_LEFT_X_AVG;
        PREV_THUMBSTICK_LEFT_Y = THUMBSTICK_LEFT_Y_AVG;
    }

    function rightThumbstick() {

        if (THUMBSTICK_RIGHT_X_AVG != PREV_THUMBSTICK_RIGHT_X ||
            THUMBSTICK_RIGHT_Y_AVG != PREV_THUMBSTICK_RIGHT_Y) {
            control.raiseEvent(THUMBSTICK_RIGHT_MOVED, THUMBSTICK_RIGHT_X_AVG + THUMBSTICK_RIGHT_Y_AVG);
        }

        //remember for next loop
        PREV_THUMBSTICK_RIGHT_X = THUMBSTICK_RIGHT_X_AVG;
        PREV_THUMBSTICK_RIGHT_Y = THUMBSTICK_RIGHT_Y_AVG;
    }

    /**
     * Do something when a button is pushed.
     * @param button the button to be checked
     * @param handler body code to run when the event is raised
     */
    //% blockId=onButtonPressed  block="on button pressed %button"
    //% weight=90
    export function onButtonPressed(
        button: Buttons,
        handler: () => void
    ) {
        control.onEvent(
            SWITCH_PRESSED + button,
            EventBusValue.MICROBIT_EVT_ANY,
            () => {
                handler();
            }
        );
    }

    /**
 * Do something when left thumbstick is moved.
 * @param handler body code to run when the event is raised
 */
    //% blockId=onLeftThumbstickMoved block="on left thumbstick moved"
    //% weight=80
    export function onLeftThumbstickMoved(
        handler: () => void
    ) {
        control.onEvent(
            THUMBSTICK_LEFT_MOVED,
            EventBusValue.MICROBIT_EVT_ANY,
            () => {
                handler();
            }
        );
    }

    /**
* Do something when right thumbstick is moved.
* @param handler body code to run when the event is raised
*/
    //% blockId=onRightThumbstickMoved block="on right thumbstick moved"
    //% weight=70
    export function onRightThumbstickMoved(
        handler: () => void
    ) {
        control.onEvent(
            THUMBSTICK_RIGHT_MOVED,
            EventBusValue.MICROBIT_EVT_ANY,
            () => {
                handler();
            }
        );
    }

    let THUMBSTICK_LEFT_X_AVG = centered;
    let THUMBSTICK_LEFT_Y_AVG = centered;
    let THUMBSTICK_RIGHT_X_AVG = centered;
    let THUMBSTICK_RIGHT_Y_AVG = centered;

    let THUMBSTICK_LEFT_X_RAW = centered;
    let THUMBSTICK_LEFT_Y_RAW = centered;
    let THUMBSTICK_RIGHT_X_RAW = centered;
    let THUMBSTICK_RIGHT_Y_RAW = centered;

    let BUTTON_LEFT = 0xff;
    let BUTTON_RIGHT = 0xff;
    let THUMBSTICK_BUTTON_RIGHT = 0xff;
    let THUMBSTICK_BUTTON_LEFT = 0xff;

    let i2cAddr: number
    let BK: number
    let RS: number
    function setreg(d: number) {
        pins.i2cWriteNumber(i2cAddr, d, NumberFormat.Int8LE)
        basic.pause(1)
    }

    function set(d: number) {
        d = d & 0xF0
        d = d + BK + RS
        setreg(d)
        setreg(d + 4)
        setreg(d)
    }

    function lcdcmd(d: number) {
        RS = 0
        set(d)
        set(d << 4)
    }

    function lcddat(d: number) {
        RS = 1
        set(d)
        set(d << 4)
    }

    function i2cwrite(addr: number, reg: number, value: number) {
        let buf = pins.createBuffer(2)
        buf[0] = reg
        buf[1] = value
        pins.i2cWriteBuffer(addr, buf)
    }

    function i2cwrite1(addr: number, reg: number, value: number, value1: string) {
        let lengths = value1.length
        let buf = pins.createBuffer(2 + lengths)
        //let arr = value1.split('')
        buf[0] = reg
        buf[1] = value
        let betys = []
        betys = stringToBytes(value1)
        for (let i = 0; i < betys.length; i++) {
            buf[2 + i] = betys[i]
        }
        pins.i2cWriteBuffer(addr, buf)
    }

    function i2ccmd(addr: number, value: number) {
        let buf = pins.createBuffer(1)
        buf[0] = value
        pins.i2cWriteBuffer(addr, buf)
    }

    function i2cread(addr: number, reg: number) {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        let val = pins.i2cReadNumber(addr, NumberFormat.UInt8BE);
        return val;
    }

    function stringToBytes(str: string) {

        let ch = 0;
        let st = 0;
        let gm: number[];
        gm = [];
        for (let i = 0; i < str.length; i++) {
            ch = str.charCodeAt(i);
            st = 0;

            do {
                st = (ch & 0xFF);
                ch = ch >> 8;
                gm.push(st);
            }

            while (ch);

        }
        return gm;
    }

    let THUMBSTICK_I2C_ADDR = 0x5A;


    let JOYSTICK_LEFT_X_REG = 0x10;
    let JOYSTICK_LEFT_Y_REG = 0x11;
    let JOYSTICK_RIGHT_X_REG = 0x12;
    let JOYSTICK_RIGHT_Y_REG = 0x13;


    let THUMBSTICK_LEFT_X_REG = 0x10;
    let THUMBSTICK_LEFT_Y_REG = 0x11;
    
    let THUMBSTICK_RIGHT_X_REG = 0x12;
    let THUMBSTICK_RIGHT_Y_REG = 0x13;

    let BUTTON_LEFT_REG = 0x22;
    let BUTTON_RIGHT_REG = 0x23;
    let THUMBSTICK_BUTTON_RIGHT_REG = 0x21;
    let THUMBSTICK_BUTTON_LEFT_REG = 0x20;

    let NONE_PRESS = 8;

    //% blockId=isButtonPressed block="Is button %button pressed?"
    //% weight=0
    //% inlineInputMode=inline
    function isButtonPressed(button: Buttons): boolean {
        if (getButtonStatus(button) != NONE_PRESS && getButtonStatus(button) != 0xff) {
            return true;
        }
        return false;
    }

    //% blockId=isButtonReleased block="Is button %button released?"
    //% weight=0
    //% inlineInputMode=inline
    function isButtonReleased(button: Buttons): boolean {
        if (getButtonStatus(button) == NONE_PRESS) {
            return true;
        }
        return false;
    }

    //% blockId=getButtonStatus block="Read %button button status"
    //% weight=45
    //% inlineInputMode=inline
    export function getButtonStatus(button: Buttons): KeyStatus {
        switch (button) {
            case 0:
                return BUTTON_LEFT;
            case 1:
                return BUTTON_RIGHT;
            case 2:
                return THUMBSTICK_BUTTON_LEFT;
            case 3:
                return THUMBSTICK_BUTTON_RIGHT;
            default:
                return 0xff;
        }
    }

    //% blockId=setVibration block="Set vibration to %shock"
    //% shock.min=0 shock.max=1000
    //% weight=46
    //% inlineInputMode=inline
    export function setVibration(shock: number): void {
        let a = AnalogPin.P1;
        pins.analogWritePin(a, shock)
    }

    //% blockId=setBuzzer block="Set buzzer to %freq frequency"
    //% freq.min=0 freq.max=1000
    //% weight=47
    export function setBuzzer(freq: number): void {
        let a = AnalogPin.P0;
        pins.analogWritePin(a, freq)
    }

    //% blockId=getThumbstickAxis block="Read %stick thumbstick axis %axial value"
    //% weight=10
    //% inlineInputMode=inline
    export function getThumbstickAxis(stick: Stick, axial: Axis) {
        let val = 0;
        if (stick == 0) {
            if (axial == 0) {
                val = THUMBSTICK_LEFT_X_AVG;
            } else {
                val = THUMBSTICK_LEFT_Y_AVG;
            }
        } else {
            if (axial == 0) {
                val = THUMBSTICK_RIGHT_X_AVG;
            } else {
                val = THUMBSTICK_RIGHT_Y_AVG;
            }
        }
        return val;
    }

    //https://blackdoor.github.io/blog/thumbstick-controls/
    //% blockId=getDirection block="Read compass based direction for %stick thumbstick"
    //% weight=5
    //% inlineInputMode=inline
    export function getDirection(stick: Stick): Direction {

        let X = 0;
        let Y = 0;
        let maxValue = 255;

        if (stick == Stick.LEFT) {
            X = Math.trunc(Math.map(THUMBSTICK_LEFT_X_AVG, 0, maxValue, 0, 4));
            Y = Math.trunc(Math.map(THUMBSTICK_LEFT_Y_AVG, 0, maxValue, 0, 4));
        } else {
            X = Math.trunc(Math.map(THUMBSTICK_RIGHT_X_AVG, 0, maxValue, 0, 4));
            Y = Math.trunc(Math.map(THUMBSTICK_RIGHT_Y_AVG, 0, maxValue, 0, 4));
        }

        if (X == 2 && Y == 4) {
            return Direction.NORTH;
        } else if (X == 3 && Y == 3) {
            return Direction.NORTH_EAST;
        } else if (X == 4 && Y == 2) {
            return Direction.EAST;
        } else if (X == 3 && Y == 1) {
            return Direction.SOUTH_EAST;
        } else if (X == 2 && Y == 0) {
            return Direction.SOUTH;
        } else if (X == 1 && Y == 1) {
            return Direction.SOUTH_WEST;
        } else if (X == 0 && Y == 2) {
            return Direction.WEST;
        } else if (X == 1 && Y == 3) {
            return Direction.NORTH_WEST;
        } else {
            return Direction.NONE;
        }
    }

}

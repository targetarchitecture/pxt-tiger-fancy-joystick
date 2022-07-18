enum buttons {
    //% block="THUMBSTICK LEFT"
    THUMBSTICK_LEFT = 0,
    //% block="THUMBSTICK RIGHT" 
    THUMBSTICK_RIGHT = 1,
    //% block="LEFT"
    BUTTON_LEFT = 2,
    //% block="RIGHT" 
    BUTTON_RIGHT = 3,
}

enum key_status {
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
    LEFT = 0,
    //% block="RIGHT"
    RIGHT = 1,
}

//% color="#FF6EC7" weight=10 icon="\uf2c9" block="Joystick"
//% category="Joystick"
namespace joystick {

    let alreadyStarted = false;
    const SWITCH_PRESSED = 5010;
    const THUMBSTICK_LEFT_MOVED = 6010;
    const THUMBSTICK_RIGHT_MOVED = 7010;
    const pinOffset = 1000;
    const centered = 128;
    
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
    //% block="Start Joystick"
    export function start(): void {

        //prevent running more than once
        if (alreadyStarted == true) {
            return;
        } else {
            alreadyStarted = true;
        }

        //set-up I2C fetch loop
        control.inBackground(function () {
            loops.everyInterval(10, function () {

                BUTTON_LEFT = i2cread(THUMBSTICK_I2C_ADDR, BUTTON_LEFT_REG);
                BUTTON_RIGHT = i2cread(THUMBSTICK_I2C_ADDR, BUTTON_RIGHT_REG);
                THUMBSTICK_BUTTON_LEFT = i2cread(THUMBSTICK_I2C_ADDR, THUMBSTICK_BUTTON_LEFT_REG);
                THUMBSTICK_BUTTON_RIGHT = i2cread(THUMBSTICK_I2C_ADDR, THUMBSTICK_BUTTON_RIGHT_REG);

                //check for button clicks
                if (PREV_THUMBSTICK_LEFT == 0 && THUMBSTICK_BUTTON_LEFT == 1) {
                    control.raiseEvent(SWITCH_PRESSED + buttons.THUMBSTICK_LEFT, buttons.THUMBSTICK_LEFT + pinOffset)
                }
                PREV_THUMBSTICK_LEFT = THUMBSTICK_BUTTON_LEFT

                if (PREV_BUTTON_LEFT == 0 && BUTTON_LEFT == 1) {
                    control.raiseEvent(SWITCH_PRESSED + buttons.BUTTON_LEFT, buttons.BUTTON_LEFT + pinOffset)
                }
                PREV_BUTTON_LEFT = BUTTON_LEFT

                if (PREV_THUMBSTICK_RIGHT == 0 && THUMBSTICK_BUTTON_RIGHT == 1) {
                    control.raiseEvent(SWITCH_PRESSED + buttons.THUMBSTICK_RIGHT, buttons.THUMBSTICK_RIGHT + pinOffset)
                }
                PREV_THUMBSTICK_RIGHT = THUMBSTICK_BUTTON_RIGHT

                if (PREV_BUTTON_RIGHT == 0 && BUTTON_RIGHT == 1) {
                    control.raiseEvent(SWITCH_PRESSED + buttons.BUTTON_RIGHT, buttons.BUTTON_RIGHT + pinOffset)
                }
                PREV_BUTTON_RIGHT = BUTTON_RIGHT               

               //thumbsticks
                THUMBSTICK_LEFT_X = i2cread(THUMBSTICK_I2C_ADDR, THUMBSTICK_LEFT_X_REG);
                THUMBSTICK_LEFT_Y = i2cread(THUMBSTICK_I2C_ADDR, THUMBSTICK_LEFT_Y_REG);
                THUMBSTICK_RIGHT_X = i2cread(THUMBSTICK_I2C_ADDR, THUMBSTICK_RIGHT_X_REG);
                THUMBSTICK_RIGHT_Y = i2cread(THUMBSTICK_I2C_ADDR, THUMBSTICK_RIGHT_Y_REG);

                if (PREV_THUMBSTICK_LEFT_X != THUMBSTICK_LEFT_X || PREV_THUMBSTICK_LEFT_Y != THUMBSTICK_LEFT_Y) {
                    control.raiseEvent(THUMBSTICK_LEFT_MOVED, THUMBSTICK_LEFT_X + THUMBSTICK_LEFT_Y);
                }

                if (PREV_THUMBSTICK_RIGHT_X != THUMBSTICK_RIGHT_X || PREV_THUMBSTICK_RIGHT_Y != THUMBSTICK_RIGHT_Y) {
                    control.raiseEvent(THUMBSTICK_RIGHT_MOVED, THUMBSTICK_RIGHT_X + THUMBSTICK_RIGHT_Y);
                }

                PREV_THUMBSTICK_LEFT_X = THUMBSTICK_LEFT_X;
                PREV_THUMBSTICK_LEFT_Y = THUMBSTICK_LEFT_Y;
                PREV_THUMBSTICK_RIGHT_X = THUMBSTICK_RIGHT_X;
                PREV_THUMBSTICK_RIGHT_Y = THUMBSTICK_RIGHT_Y;
            })
        })
    }

    /**
     * Do something when a button is pushed.
     * @param button the button to be checked
     * @param handler body code to run when the event is raised
     */
    //% block="on button pressed %button"
    //% weight=65
    export function onButtonPressed(
        button: buttons,
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
    //% block="on left thumbstick moved"
    //% weight=65
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
    //% block="on right thumbstick moved"
    //% weight=65
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

    let THUMBSTICK_LEFT_X = 0xff;
    let THUMBSTICK_LEFT_Y = 0xff;
    let THUMBSTICK_RIGHT_X = 0xff;
    let THUMBSTICK_RIGHT_Y = 0xff;

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

    let THUMBSTICK_LEFT_X_REG = 0x10;
    let THUMBSTICK_LEFT_Y_REG = 0x11;
    let THUMBSTICK_RIGHT_X_REG = 0x12;
    let THUMBSTICK_RIGHT_Y_REG = 0x13;

    let BUTTON_LEFT_REG = 0x22;
    let BUTTON_RIGHT_REG = 0x23;
    let THUMBSTICK_BUTTON_RIGHT_REG = 0x21;
    let THUMBSTICK_BUTTON_LEFT_REG = 0x20;

    let NONE_PRESS = 8;

    function Get_Button_Status(button: number) {
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

    //% blockId=isButtonPressed block="Is button %button pressed?"
    //% weight=74
    //% inlineInputMode=inline
    export function isButtonPressed(button: buttons): boolean {
        let buttonStatus = Get_Button_Status(button);
        if (buttonStatus != NONE_PRESS && buttonStatus != 0xff) {
            return true;
        }
        return false;
    }

    //% blockId=isButtonReleased block="Is button %button released?"
    //% weight=74
    //% inlineInputMode=inline
    export function isButtonReleased(button: buttons): boolean {
        if (Get_Button_Status(button) == NONE_PRESS) {
            return true;
        }
        return false;
    }

    //% blockId=buttonStatus block="Get button %button status"
    //% weight=74
    //% inlineInputMode=inline
    export function buttonStatus(button: buttons): key_status {
        return Get_Button_Status(button)
    }

    //% blockId=Gamepad_shock block="Set vibration to %shock"  
    //% shock.min=0 shock.max=1000
    //% weight=74
    //% inlineInputMode=inline
    export function Gamepad_shock(shock: number): void {
        let a = AnalogPin.P1;
        pins.analogWritePin(a, shock)
    }

    //% blockId=SetBuzzer block="Set buzzer to %freq frequency"
    //% freq.min=0 freq.max=1000
    //% weight=74
    export function SetBuzzer(freq: number): void {
        let a = AnalogPin.P0;
        pins.analogWritePin(a, freq)
    }


    //% blockId=ReadStickAxis block="Stick %stick axis %axial"
    //% weight=74
    //% inlineInputMode=inline
    export function ReadStickAxis(stick: Stick, axial: Axis) {
        let val = 0;
        if (stick == 0) {
            if (axial == 0) {
                val =  THUMBSTICK_LEFT_X;
            } else {
                val =  THUMBSTICK_LEFT_Y;
            }
        } else {
            if (axial == 0) {
                val =  THUMBSTICK_RIGHT_X;
            } else {
                val =  THUMBSTICK_RIGHT_Y;
            }
        }
        return val;
    }
}

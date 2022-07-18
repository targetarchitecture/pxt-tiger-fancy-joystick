enum buttons {
    //% block="LEFT"
    JOYSTICK_BUTTON_LEFT_L = 0,
    //% block="RIGHT" 
    JOYSTICK_BUTTON_RIGHT_R = 1,
    //% block="LEFTA"
    JOYSTICK_BUTTON_LEFT = 2,
    //% block="RIGHTA" 
    JOYSTICK_BUTTON_RIGHT = 3,
}

enum key_status {
    //% block="DOWN"
    JOYSTICK_PRESS_DOWN = 0,   //press
    //% block="UP"
    JOYSTICK_PRESS_UP = 1,    //release
    // //% block="CLICK1"
    // SINGLE_CLICK = 3,     //click
    // //% block="CLICK2"
    // DOUBLE_CLICK = 4,    //double click
    // //% block="HOLD"
    // LONG_PRESS_HOLD = 6,    //long pressed
    // //% block="PRESS"
    // NONE_PRESS = 8,      //not pressed
}

enum Axis {
    //% block="X"
    JOYSTICK_X_Axis = 0,
    //% block="Y"
    JOYSTICK_Y_Axis = 1,
}

enum Stick {
    //% block="LEFT"
    JOYSTICK_left_wi = 0,
    //% block="RIGHT"
    JOYSTICK_right_wi = 1,
}

//% color="#FF6EC7" weight=10 icon="\uf2c9" block="Joystick"
//% category="Joystick"
namespace joystick {

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

    let JOYSTICK_I2C_ADDR = 0x5A;

    let JOYSTICK_LEFT_X_REG = 0x10;
    let JOYSTICK_LEFT_Y_REG = 0x11;
    let JOYSTICK_RIGHT_X_REG = 0x12;
    let JOYSTICK_RIGHT_Y_REG = 0x13;

    let BUTTON_LEFT_REG = 0x22;
    let BUTTON_RIGHT_REG = 0x23;
    let JOYSTICK_BUTTON_RIGHT = 0x21;
    let JOYSTICK_BUTTON_LEFT = 0x20;

    let NONE_PRESS = 8;

    function Get_Button_Status(button: number) {
        switch (button) {
            case 0:
                return i2cread(JOYSTICK_I2C_ADDR, BUTTON_LEFT_REG);
            case 1:
                return i2cread(JOYSTICK_I2C_ADDR, BUTTON_RIGHT_REG);
            case 2:
                return i2cread(JOYSTICK_I2C_ADDR, JOYSTICK_BUTTON_LEFT);
            case 3:
                return i2cread(JOYSTICK_I2C_ADDR, JOYSTICK_BUTTON_RIGHT);
            default:
                return 0xff;
        }
    }

    //% blockId=Gamepad_Press block="Is button %button pressed?" 
    //% weight=74
    //% inlineInputMode=inline
    export function Gamepad_Press(button: buttons): boolean {
        if (Get_Button_Status(button) != NONE_PRESS && Get_Button_Status(button) != 0xff) {
            return true;
        }
        return false;
    }


    //% blockId=Gamepad_Release block="Is button %button released?"
    //% weight=74
    //% inlineInputMode=inline
    export function Gamepad_Release(button: buttons): boolean {
        if (Get_Button_Status(button) == NONE_PRESS) {
            return true;
        }
        return false;
    }

    //% blockId=Gamepad_shock block="Set vibration to %shock"  
    //% shock.min=0 shock.max=1000
    //% weight=74
    //% inlineInputMode=inline
    export function Gamepad_shock(shock: number): void {
        let a = AnalogPin.P1;
        pins.analogWritePin(a, shock)
    }


    //% blockId=actuator_buzzer1 block="Set buzzer to %freq "  
    //% freq.min=0 freq.max=1000
    //% weight=74
    export function actuator_buzzer1(freq: number): void {
        let a = AnalogPin.P0;
        pins.analogWritePin(a, freq)
    }


    //% blockId=Gamepad_Wiggly block="Stick %stick axis %axial" 
    //% weight=74
    //% inlineInputMode=inline
    export function Gamepad_Wiggly(stick: Stick, axial: Axis) {
        let val = 0;
        if (stick == 0) {
            if (axial == 0) {
                val = i2cread(JOYSTICK_I2C_ADDR, JOYSTICK_LEFT_X_REG);
            } else {
                val = i2cread(JOYSTICK_I2C_ADDR, JOYSTICK_LEFT_Y_REG);
            }
        } else {
            if (axial == 0) {
                val = i2cread(JOYSTICK_I2C_ADDR, JOYSTICK_RIGHT_X_REG);
            } else {
                val = i2cread(JOYSTICK_I2C_ADDR, JOYSTICK_RIGHT_Y_REG);
            }
        }
        return val;
    }
}

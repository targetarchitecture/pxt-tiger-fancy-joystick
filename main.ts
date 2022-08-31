
function sendRadioMessage_Buttons(value: Buttons) {
    if (radioConnected == true) {
        radio.sendValue("BUTTON", KeyStatus.SINGLE_CLICK);
    }
}

function sendRadioMessage_Gesture(value: Gesture) {
    if (radioConnected == true) {
        radio.sendValue("GESTURE", value);
    }
}

function sendRadioMessage_Joystick(axis: string, value: Gesture) {
    if (radioConnected == true) {
        radio.sendValue(axis, value);
    }
}

joystick.onButtonPressed(Buttons.THUMBSTICK_RIGHT, function () {
    sendRadioMessage_Buttons(Buttons.THUMBSTICK_RIGHT);
})

joystick.onButtonPressed(Buttons.THUMBSTICK_LEFT, function () {
    sendRadioMessage_Buttons(Buttons.THUMBSTICK_LEFT);
})

input.onButtonPressed(Button.A, function () {
    sendRadioMessage_Buttons(Buttons.BUTTON_A);
})

joystick.onButtonPressed(Buttons.BUTTON_RIGHT, function () {
    sendRadioMessage_Buttons(Buttons.BUTTON_RIGHT);
})

input.onButtonPressed(Button.AB, function () {
    sendRadioMessage_Buttons(Buttons.BUTTON_AB);
})

input.onButtonPressed(Button.B, function () {
    sendRadioMessage_Buttons(Buttons.BUTTON_B);
})

joystick.onButtonPressed(Buttons.BUTTON_LEFT, function () {
    sendRadioMessage_Buttons(Buttons.BUTTON_LEFT);
})

input.onGesture(Gesture.TiltLeft, function () {
    sendRadioMessage_Gesture(Gesture.TiltLeft);
})
input.onGesture(Gesture.TiltRight, function () {
    sendRadioMessage_Gesture(Gesture.TiltRight);
})

let radioConnected = false;

function initRadio() {
    radio.setTransmitPower(7)
    radio.setGroup(76)
    radio.setTransmitSerialNumber(true)

    radioConnected = true;

    radio.sendValue("START", 1);


    // always transmit joystick positions
    loops.everyInterval(100, function () {
        const left_x = joystick.getThumbstickAxis(Stick.LEFT, Axis.X_AXIS)
        const left_y = joystick.getThumbstickAxis(Stick.LEFT, Axis.Y_AXIS)
        const right_x = joystick.getThumbstickAxis(Stick.RIGHT, Axis.X_AXIS)
        const right_y = joystick.getThumbstickAxis(Stick.RIGHT, Axis.Y_AXIS)

        sendRadioMessage_Joystick("RX", right_x);
        sendRadioMessage_Joystick("RY", right_y);
        sendRadioMessage_Joystick("LX", left_x);
        sendRadioMessage_Joystick("LY", left_y);

        led.toggle(2, 3);
    })
}

//let lastCommandSend = control.millis()
basic.showIcon(IconNames.StickFigure)
joystick.start()
initRadio()

//deal with incoming messages
radio.onReceivedValue(function (name: string, value: number) {
    if (name == "BUZZER") {
        buzzer(value);
    } else if (name == "VIBRATE") {
        vibrate(value);
    }
})

function buzzer(duration: number = 1000, freq: number = 500) {
    control.inBackground(function () {
        joystick.setBuzzer(freq)
        basic.pause(duration)
        joystick.setBuzzer(0)
    })
}

function vibrate(duration: number = 1000, shock: number = 1000) {
    control.inBackground(function () {
        joystick.setVibration(shock)
        basic.pause(duration)
        joystick.setVibration(0)
    })
}
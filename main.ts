joystick.onButtonPressed(Buttons.THUMBSTICK_RIGHT, function () {
    sendRadioMessage("THUMBSTICK_RIGHT")
})

joystick.onButtonPressed(Buttons.THUMBSTICK_LEFT, function () {
    sendRadioMessage("THUMBSTICK_LEFT")
})

input.onButtonPressed(Button.A, function () {
    sendRadioMessage("BUTTON_A")
})

joystick.onButtonPressed(Buttons.BUTTON_RIGHT, function () {
    sendRadioMessage("BUTTON_RIGHT")
})

input.onGesture(Gesture.TiltLeft, function () {
    sendRadioMessage("TILTLEFT")
})

input.onButtonPressed(Button.AB, function () {
    sendRadioMessage("BUTTON_AB")
})

input.onButtonPressed(Button.B, function () {
    sendRadioMessage("BUTTON_B")
})

function sendRadioMessage(message: string) {
    if (radioConnected == true) {
        radio.sendString(message);
    }
}

input.onGesture(Gesture.TiltRight, function () {
    sendRadioMessage("TILTRIGHT")
})
joystick.onButtonPressed(Buttons.BUTTON_LEFT, function () {
    sendRadioMessage("BUTTON_LEFT")
})

let radioConnected = false;

function initRadio(message: string) {
    radio.setTransmitPower(7)
    radio.setGroup(76)
    radio.setTransmitSerialNumber(true)

    radioConnected = true;

    sendRadioMessage(message)

    // always transmit joystick positions
    loops.everyInterval(100, function () {
        const left_x = joystick.getThumbstickAxis(Stick.LEFT, Axis.X_AXIS)
        const left_y = joystick.getThumbstickAxis(Stick.LEFT, Axis.Y_AXIS)
        const right_x = joystick.getThumbstickAxis(Stick.RIGHT, Axis.X_AXIS)
        const right_y = joystick.getThumbstickAxis(Stick.RIGHT, Axis.Y_AXIS)
        sendRadioMessage("RX:" + right_x + ",RY:" + right_y)
        sendRadioMessage("LX:" + left_x + ",LY:" + left_y)

        led.toggle(2, 3);
    })
}

//let lastCommandSend = control.millis()
basic.showIcon(IconNames.StickFigure)
joystick.start()
initRadio("START")

//deal with incoming messages
radio.onReceivedString(function (receivedString: string) {

    if (receivedString == "BUZZER") {
        buzzer();
    } else if (receivedString == "VIBRATE") {
        vibrate();
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
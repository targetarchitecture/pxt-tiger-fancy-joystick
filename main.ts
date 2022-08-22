
joystick.onButtonPressed(Buttons.BUTTON_LEFT, function () {
    led.toggle(0, 2)
    sendRadioMessage("BL");
})
joystick.onButtonPressed(Buttons.THUMBSTICK_LEFT, function () {
    led.toggle(0, 2)
    sendRadioMessage("TL");
})
input.onButtonPressed(Button.A, function () {
    sendRadioMessage("BA");
    joystick.setVibration(1000)
    basic.pause(1000)
    joystick.setVibration(0)
})

input.onButtonPressed(Button.B, function () {
    sendRadioMessage("BB");
    joystick.setBuzzer(500)
    basic.pause(1000)
    joystick.setBuzzer(0)
})

joystick.onButtonPressed(Buttons.BUTTON_RIGHT, function () {
    led.toggle(4, 2)
    sendRadioMessage("BR");
})

function sendRadioMessage(message: string) {
    radio.sendString(message)
    lastCommandSend = control.millis()
    //serial.writeLine(message)
}

function initRadio(message: string) {
    radio.setTransmitPower(7)
    radio.setGroup(76)
    radio.setTransmitSerialNumber(true)
    sendRadioMessage(message)
}

joystick.onButtonPressed(Buttons.THUMBSTICK_RIGHT, function () {
    led.toggle(4, 2)
    sendRadioMessage("TR");
})

let lastCommandSend = control.millis()
basic.showIcon(IconNames.StickFigure)
joystick.start()
initRadio("START")

//always transmit joystick positions
loops.everyInterval(500, function () {

    const left_x = joystick.getThumbstickAxis(Stick.LEFT, Axis.X_AXIS)
    const left_y = joystick.getThumbstickAxis(Stick.LEFT, Axis.Y_AXIS)

    const right_x = joystick.getThumbstickAxis(Stick.RIGHT, Axis.X_AXIS)
    const right_y = joystick.getThumbstickAxis(Stick.RIGHT, Axis.Y_AXIS)

    sendRadioMessage("RX:" + right_x + ",RY:" + right_y);
    sendRadioMessage("LX:" + left_x + ",LY:" + left_y);
})


joystick.onButtonPressed(buttons.THUMBSTICK_LEFT, function () {
    led.toggle(0, 2)
})

input.onButtonPressed(Button.A, function () {
    joystick.Gamepad_shock(1000)
    basic.pause(1000)
    joystick.Gamepad_shock(0)
})

joystick.onLeftThumbstickMoved(function () {
    let left_x = joystick.ReadStickAxis(Stick.LEFT, Axis.X_AXIS)
    let left_y = joystick.ReadStickAxis(Stick.LEFT, Axis.Y_AXIS)

    sendRadioMessage(left_x + ":" + left_y)
    led.toggle(2, 2)

    let X = Math.trunc(Math.map(left_x, 0, 255, 0, 4));
    let Y = Math.trunc(Math.map(left_y, 0, 255, 0, 4));

    serial.writeString(joystick.getDirection(Stick.LEFT) + serial.NEW_LINE);

})

joystick.onRightThumbstickMoved(function () {

    let right_x = joystick.ReadStickAxis(Stick.RIGHT, Axis.X_AXIS)
    let right_y = joystick.ReadStickAxis(Stick.RIGHT, Axis.Y_AXIS)

    sendRadioMessage(right_x + ":" + right_y)
    led.toggle(2, 2)

    //serial.writeValue("right_x", right_x)
    //serial.writeValue("right_y", right_y)
})

input.onButtonPressed(Button.B, function () {
    joystick.SetBuzzer(202)
    basic.pause(1000)
    joystick.SetBuzzer(0)
})

function sendRadioMessage(message: string) {
    radio.sendString(message)
    lastCommandSend = control.millis()
}

joystick.onButtonPressed(buttons.BUTTON_LEFT, function () {
    led.toggle(0, 2)
})

joystick.onButtonPressed(buttons.BUTTON_RIGHT, function () {
    led.toggle(4, 2)
})

joystick.onButtonPressed(buttons.THUMBSTICK_RIGHT, function () {
    led.toggle(4, 2)
})

function initRadio(message: string) {

    radio.setTransmitPower(7)
    radio.setFrequencyBand(76)
    radio.setGroup(76)
    radio.setTransmitSerialNumber(true)
    sendRadioMessage(message)
}

let lastCommandSend = 0

basic.showIcon(IconNames.Heart)
joystick.start()
initRadio("START")

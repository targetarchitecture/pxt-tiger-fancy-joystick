
joystick.onButtonPressed(buttons.BUTTON_LEFT, function () {
    led.toggle(0, 2)
})
joystick.onButtonPressed(buttons.THUMBSTICK_LEFT, function () {
    led.toggle(0, 2)
})
input.onButtonPressed(Button.A, function () {
    joystick.setVibration(1000)
    basic.pause(1000)
    joystick.setVibration(0)
})

joystick.onLeftThumbstickMoved(function () {
    left_x = joystick.getThumbstickAxis(Stick.LEFT, Axis.X_AXIS)
    left_y = joystick.getThumbstickAxis(Stick.LEFT, Axis.Y_AXIS)
    sendRadioMessage("LX:" + left_x + ",LY:" + left_y)
    led.toggle(2, 2)
})
input.onButtonPressed(Button.B, function () {
    joystick.setBuzzer(500)
    basic.pause(1000)
    joystick.setBuzzer(0)
})
joystick.onButtonPressed(buttons.BUTTON_RIGHT, function () {
    led.toggle(4, 2)
})
function sendRadioMessage(message: string) {
    radio.sendString(message)
    lastCommandSend = control.millis()
}
joystick.onRightThumbstickMoved(function () {
    right_x = joystick.getThumbstickAxis(Stick.RIGHT, Axis.X_AXIS)
    right_y = joystick.getThumbstickAxis(Stick.RIGHT, Axis.Y_AXIS)
    sendRadioMessage("RX:" + right_x + ",RY:" + right_y)
    led.toggle(2, 2)
})
function initRadio(message: string) {
    radio.setTransmitPower(7)
    radio.setFrequencyBand(76)
    radio.setGroup(76)
    radio.setTransmitSerialNumber(true)
    sendRadioMessage(message)
}
joystick.onButtonPressed(buttons.THUMBSTICK_RIGHT, function () {
    led.toggle(4, 2)
})
let right_y = 0
let right_x = 0
let lastCommandSend = 0
let left_y = 0
let left_x = 0
basic.showIcon(IconNames.Heart)
joystick.start()
initRadio("START")
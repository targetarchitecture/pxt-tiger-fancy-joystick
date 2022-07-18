let left_x = 0
let left_y = 0
let right_x = 0
let right_y = 0

function DetectJoystickCommands () {
    left_x = joystick.ReadStickAxis(Stick.JOYSTICK_LEFT, Axis.JOYSTICK_X_AXIS)
    left_y = joystick.ReadStickAxis(Stick.JOYSTICK_LEFT, Axis.JOYSTICK_Y_AXIS)
    right_x = joystick.ReadStickAxis(Stick.JOYSTICK_RIGHT, Axis.JOYSTICK_X_AXIS)
    right_y = joystick.ReadStickAxis(Stick.JOYSTICK_RIGHT, Axis.JOYSTICK_Y_AXIS)
}

function sendRadioMessage(message: string) {
    radio.sendString(message)
    lastCommandSend = control.millis()
}

let lastCommandSend = 0
lastCommandSend = control.millis()
radio.setTransmitPower(7)
radio.setFrequencyBand(76)
radio.setGroup(76)
radio.setTransmitSerialNumber(true)
sendRadioMessage("JOYSTICK_START")

basic.showIcon(IconNames.Heart)

basic.forever(function () {
    DetectJoystickCommands()
    basic.pause(100)
})
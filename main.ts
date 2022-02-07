radio.setTransmitPower(7)
radio.setFrequencyBand(76)
radio.setGroup(76)
radio.setTransmitSerialNumber(true)
radio.sendValue("hello", 1)
basic.showIcon(IconNames.Heart)

input.onButtonPressed(Button.A, function () {
    radio.sendString("MICROBIT_ID_BUTTON_A")
})


input.onButtonPressed(Button.B, function () {
    radio.sendString("MICROBIT_ID_BUTTON_B")
})

input.onButtonPressed(Button.AB, function () {
    radio.sendString("MICROBIT_ID_BUTTON_AB")
})

input.onGesture(Gesture.Shake, function() {
    radio.sendString("MICROBIT_ID_BUTTON_AB")
})


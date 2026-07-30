#include "MFRC522.hpp"


MFRC522::MFRC522(RegisterAccess& registers)
    : registers(registers)
{}


bool MFRC522::begin()
{
    if(isInitialized)
        return true;

    reset();

    return isInitialized = checkVersion();
}

void MFRC522::reset()
{
    registers.writeRegister(Register::Command, static_cast<uint8_t>(Command::Reset)); // Soft reset
    //TODO UNFINNISHED IMPLEMENT DELAY AND UPDATE REGISTER VALUES

}

uint8_t MFRC522::getVersion()
{
    return registers.readRegister(Register::Version);
}

bool MFRC522::setAntennaOn()
{
    if(isAntennaOn)
        return true;


    uint8_t value =
        registers.readRegister(Register::TxControl);


    if((value & 0x03) != 0x03)
    {
        value |= 0x03;

        registers.writeRegister(
            Register::TxControl,
            value
        );
    }


    isAntennaOn = true;

    return true;
}

bool MFRC522::setAntennaOff()
{
    uint8_t value =
        registers.readRegister(Register::TxControl);


    value &= ~0x03;


    registers.writeRegister(
        Register::TxControl,
        value
    );


    isAntennaOn = false;

    return true;
}

bool MFRC522::transceive(
    uint8_t* sendData,
    size_t sendLength,
    uint8_t* response,
    size_t& responseLength
)
{
    registers.writeRegister(Register::Command, static_cast<uint8_t>(Command::Transceive));
    //TODO UNFINNISHED IMPLEMENT TRANSCEIVE FUNCTION
}

//! Privates

bool MFRC522::checkVersion()
{
    uint8_t version = getVersion();

    if(version == 0x00 || version == 0xFF)
    {
        return false;
    }

    return true;
}
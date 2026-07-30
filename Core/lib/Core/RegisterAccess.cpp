#include "RegisterAccess.hpp"


RegisterAccess::RegisterAccess(SPIBus& spi)
    : spi(spi)
{}


void RegisterAccess::writeRegister(Register reg, uint8_t value)
{
    uint8_t packet[2];

    packet[0] = encodeWrite(reg);
    packet[1] = value;

    spi.transfer(packet, 2);
}


void RegisterAccess::readRegisters(
    Register reg,
    uint8_t* buffer,
    size_t length
)
{
    uint8_t packet[length + 1];

    packet[0] = encodeRead(reg);

    for(size_t i = 1; i < length + 1; i++)
    {
        packet[i] = 0x00;
    }

    spi.transfer(packet, length + 1);


    for(size_t i = 0; i < length; i++)
    {
        buffer[i] = packet[i + 1];
    }
}


uint8_t RegisterAccess::readRegister(Register reg)
{
    uint8_t value;

    readRegisters(reg, &value, 1);

    return value;
}


uint8_t RegisterAccess::encodeWrite(Register reg)
{
    return (static_cast<uint8_t>(reg) << 1) & 0x7E;
}


uint8_t RegisterAccess::encodeRead(Register reg)
{
    return ((static_cast<uint8_t>(reg) << 1) & 0x7E) | 0x80;
}
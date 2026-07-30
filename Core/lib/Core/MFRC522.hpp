#pragma once

#include <stdint.h>
#include <stddef.h>
#include "RegisterAccess.hpp"
#include "Registers/Registers.hpp"
#include "Registers/Commands.hpp"

class MFRC522
{
    public:
        explicit MFRC522(RegisterAccess& registers);

        bool begin();

        void reset();

        uint8_t getVersion();

        bool setAntennaOn();

        bool setAntennaOff();

        bool transceive(
            uint8_t* sendData,
            size_t sendLength,
            uint8_t* response,
            size_t& responseLength
        );
    
    private:

        void initRegisters();

        bool checkVersion();

        RegisterAccess& registers;

        bool isAntennaOn = false;
        bool isInitialized = false;

};
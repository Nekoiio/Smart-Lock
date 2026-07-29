# MFRC522 Register States

The MFRC522 uses registers to control operations and report status.

Most communication is controlled through:

- CommandReg
- CommIrqReg
- ErrorReg
- Status1Reg
- Status2Reg
- FIFOLevelReg
- ControlReg

---

# CommandReg (0x01)

Controls what operation the MFRC522 performs.

| Command | Code | Description |
|---|---|---|
| Idle | 0x00 | No action |
| Mem | 0x01 | Access internal memory |
| Generate Random ID | 0x02 | Generate random number |
| CalcCRC | 0x03 | Calculate CRC |
| Transmit | 0x04 | Transmit FIFO data |
| Receive | 0x08 | Receive data |
| Transceive | 0x0C | Send and receive |
| MFAuthent | 0x0E | MIFARE authentication |
| SoftReset | 0x0F | Reset chip |

---

# CommIrqReg (0x04)

Shows when operations finish.

| Bit | Name | Meaning |
|---|---|---|
| 7 | Set1 | Interrupt request |
| 6 | TxIRq | Transmission complete |
| 5 | RxIRq | Data received |
| 4 | IdleIRq | Command finished |
| 3 | HiAlertIRq | FIFO high alert |
| 2 | LoAlertIRq | FIFO low alert |
| 1 | ErrIRq | Error occurred |
| 0 | TimerIRq | Timer expired |

Common checks:

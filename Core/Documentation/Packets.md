# MFRC522 SPI and Packet Transformation Flow

## Complete Communication Path

```
Arduino
   |
   | SPI
   |
MFRC522 Registers
   |
   | FIFO
   |
MFRC522 RF Interface
   |
   | ISO14443A
   |
MIFARE Card
```



---

# Layer 1: Arduino → MFRC522 SPI

The first byte sent over SPI is always the register address.

However, the MFRC522 modifies this byte.

The SPI address contains:

```
Bit:

    7       6 5 4 3 2 1    0
+--------+---------------+---+
| R/W    | Register Addr | 0 |
+--------+---------------+---+
```

---

# SPI Address Transformation

## Write Register

Purpose:

```
Arduino changes a MFRC522 register value
```

Formula:

```
SPI Address = (Register << 1) & 0x7E
```

Transformation:

```
Register Address
       |
       |
       v
Shift left 1 bit
       |
       |
       v
Clear bit 7 and bit 0
       |
       |
       v
SPI Write Address
```

Example:

Write CommandReg (`0x01`)

```
Register:

00000001


Shift left:

00000010


Mask with 0x7E:

01111110
00000010
--------
00000010


SPI Address:

0x02
```

SPI transaction:

```
Arduino → MFRC522

02 0C
```

Meaning:

```
Register 0x01 = 0x0C

CommandReg = Transceive
```

---

# Read Register

Purpose:

```
Arduino retrieves information from MFRC522
```

Formula:

```
SPI Address =
((Register << 1) & 0x7E) | 0x80
```

  
Example:

Read VersionReg (`0x37`)

```
Register:

00110111


Shift left:

01101110


Set Read bit:

10000000 
   or
01101110
--------
11101110


SPI Address:

0xEE
```

SPI transaction:

```
Arduino → MFRC522

EE

MFRC522 → Arduino

92
```

Result:

```
VersionReg = 0x92
```

---

# Layer 2: Register → FIFO

After configuring the MFRC522, RFID commands are placed into the FIFO.

The FIFO is a 64-byte buffer.

Example:

Arduino wants to detect a card.

Command:

```
REQA
```

Raw RFID byte:

```
26
```

The Arduino writes:

```
FIFODataReg(address 0x09)

0x09 = 0x26
```

Then:

```
CommandReg = Transceive
```

The MFRC522 sends the FIFO contents through RF.

---

# Layer 3: MFRC522 → MIFARE Card

The MFRC522 adds the required RF protocol information.

General ISO14443A frame:

```
+-------------+-------------+-------------+
| Command     | Data        | CRC         |
+-------------+-------------+-------------+
```

The MFRC522 handles:

- RF modulation
- Bit timing
- CRC generation
- Collision handling
- Transmission

---

# Example: Detect Card

## Arduino sends to MFRC522

SPI:

```
Write FIFODataReg

SPI Address:

FIFODataReg = 0x09

(0x09 << 1) & 0x7E

= 0x12
```

Transaction:

```
12 26(REQA command byte)
```

Meaning:

```
FIFO = REQA command
```

---

Arduino starts transmission:

```
CommandReg = Transceive
```

or te raw SPI:

```
02 0C
```

---

## MFRC522 sends to Card

RF Packet:

```
+---------+
| 0x26    |
+---------+
```

Meaning:

```
REQA
```

---

## Card responds

Card sends:

```
+--------+--------+
| ATQA0  | ATQA1  |
+--------+--------+
| 0x04   | 0x00   |
+--------+--------+
```

---

## MFRC522 stores response

Response goes:

```
Card
 |
RF
 |
MFRC522
 |
FIFO
 |
Arduino
```

Arduino reads:

```
FIFODataReg
```

SPI:

Read FIFODataReg:

Register:

```
0x09
```

Transformation:

```
(0x09 << 1) & 0x7E

= 0x12
```

Read:

```
0x92
```

SPI packet:

```
Arduino → MFRC522

92

MFRC522 → Arduino

04 00
```

---

# Complete Example: Read Block

Goal:

```
Read block 4 from card
```

---

## Step 1: Arduino loads command

MIFARE command:

```
30 04
```

Meaning:

```
READ
BLOCK 4
```

Arduino writes FIFO:

```
FIFODataReg

0x30
0x04
```

---

## Step 2: Arduino starts transmission

Command:

```
CommandReg = Transceive
```

---

## Step 3: MFRC522 sends RF packet

```
+---------+---------+------+
| Command | Block   | CRC  |
+---------+---------+------+

| 0x30    | 0x04    | Auto |
```

The MFRC522 automatically handles CRC.

---

## Step 4: Card responds

```
+----------------+
| 16 Bytes Data |
+----------------+
| CRC            |
+----------------+
```

Example:

```
00 01 02 03
04 05 06 07
08 09 0A 0B
0C 0D 0E 0F
```

---

# Complete Transformation Summary

| Stage | Data Format | Example |
|---|---|---|
| Arduino Code | Register name | `CommandReg` |
| Register Address | Raw address | `0x01` |
| SPI Write Address | Transformed | `0x02` |
| SPI Data | Value | `0x0C` |
| FIFO Data | RFID command | `30 04` |
| RF Packet | ISO14443A frame | `30 04 CRC` |
| Card Response | Card data | `16 bytes` |
| FIFO Response | Received bytes | Data + CRC |
| SPI Read | Register access | FIFODataReg |

---

---


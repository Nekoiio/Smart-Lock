# Smart Lock — IoT Security Research Lab

A WiFi-connected smart lock system built end-to-end — embedded firmware, backend API, and web dashboard — paired with a deliberately engineered vulnerability chain used to demonstrate a realistic IoT attack path: authentication bypass → authorization bypass → firmware-level memory corruption.

This is a collaborative project combining full-stack development, embedded systems, and offensive security research. It's being built and documented publicly as both a working product and a security case study.

> **Status: in active development.** This README reflects what's currently built and what's planned — see the roadmap below for the full picture.

---

## What this is

A smart lock (ESP32 + servo actuator) is controlled through a REST API and a web dashboard. On top of that working system, we're constructing a real, disclosed vulnerability chain — modeled after current, real-world CVE patterns — that escalates from a web-layer bug all the way to a hand-built exploit against the device's own firmware.

The goal is to demonstrate the full skill stack an IoT security engineer actually needs: building the system, understanding how it can fail, and proving that understanding with a working exploit and a documented fix.

## Team

- **Guillermo Delgado** — backend, API design, frontend, vulnerability design and exploitation, firmware integration
- **Obie Campos** — hardware assembly, firmware (WiFi/servo/sensor logic), embedded systems

## Built so far

**Backend**
- Node.js + TypeScript + Express REST API
- PostgreSQL (Dockerized) with Prisma ORM, schema-driven migrations, and Prisma's newer driver-adapter architecture (`@prisma/adapter-pg`)
- Device management endpoints (`/api/devices`) and device-status control endpoints (`/api/status`), intentionally separated by sensitivity level
- Environment-based configuration, CORS-aware for cross-origin frontend access

**Frontend**
- React + TypeScript + Vite
- A custom-designed dashboard UI (dark, HUD-inspired interface) for registering and controlling devices in real time
- A typed API layer separating network calls from UI logic

**Infrastructure**
- Dockerized PostgreSQL for local development
- Cross-network testing via secure dev tunnels, validating the system works across separate machines/networks — not just localhost
- Git/GitHub-based version control from project start

**Hardware / Firmware (in progress)**
- ESP32-based lock controller with servo-driven physical actuation
- Reuses and integrates a custom **MFRC522 RFID reader library** ([link to that repo]) — a from-scratch hardware abstraction layer (HAL) built for SPI-based communication with the MFRC522 module, enabling RFID-based physical authentication on the device itself

## Planned — the vulnerability chain

The core research contribution of this project is a staged, 3-part attack chain, each stage modeled on a real, current vulnerability class rather than a generic textbook bug:

1. **Authentication bypass** — a predictable-credential-derivation flaw (modeled on the July 2026 SonicWall SMA appliance disclosures), where a device credential can be computed from a value that shouldn't have been exposed.
2. **Authorization bypass (IDOR)** — a missing ownership check on device-control endpoints, allowing access to devices that aren't yours.
3. **Firmware exploitation** — using access gained in the earlier stages to reach the ESP32 directly, dump its firmware, reverse-engineer it (Ghidra, Xtensa/RISC-V disassembly), and construct a working exploit chain (stack overflow → ROP-style gadget chain) to bypass the application layer entirely and control the lock at the firmware level.

Each stage will ship with a written fix and a short technical writeup explaining the underlying vulnerability class, so the project documents both the offense and the defense.

## Roadmap

- [ ] Complete device CRUD + status-control API
- [ ] JWT-based authentication and role-based authorization
- [ ] Modularized backend (services/routes/controllers separation)
- [ ] Firmware integration: ESP32 ↔ backend communication, local unlock trigger
- [ ] Stage 1: credential-derivation auth bypass
- [ ] Stage 2: IDOR on device-control endpoints
- [ ] Stage 3: firmware dump, reverse engineering, and exploit chain
- [ ] CI/CD pipeline (GitHub Actions): build/typecheck on push, CodeQL static analysis
- [ ] Full technical writeup and demo video

## Tech stack

| Layer | Tech |
|---|---|
| Backend | TypeScript, Node.js, Express |
| Database | PostgreSQL, Prisma ORM |
| Frontend | React, TypeScript, Vite |
| Firmware | C++ (Arduino core), ESP32 |
| Infra | Docker, GitHub Actions (planned) |
| Security tooling | Ghidra, custom exploit tooling (Python) |

## Why this project

Most portfolio projects show either web development *or* security research *or* embedded work — rarely all three, built by the same people, on hardware and infrastructure they own and control. This project is an attempt to show that full chain honestly: real code, a real device, a real (deliberately introduced, fully disclosed) vulnerability, and a real exploit — end to end.

---

*This system is built and tested in an isolated lab environment. All vulnerabilities described are intentionally introduced for educational and research purposes on hardware and infrastructure owned by the project authors.*

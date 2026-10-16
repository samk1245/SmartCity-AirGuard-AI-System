# Contributing to SmartCity AirGuard AI 🌬️🏛️

Thank you for your interest in contributing to **SmartCity AirGuard AI**! This project is dedicated to providing high-fidelity urban air pollution monitoring, forecasting, and public health intelligence.

---

## Code of Conduct
All contributors are expected to uphold our [Code of Conduct](CODE_OF_CONDUCT.md).

---

## How to Contribute

### 1. Reporting Bugs
- Check existing issues to verify the bug has not already been reported.
- Open an issue using the **Bug Report** template.
- Include Python / Node environment details, operating system, and reproduction steps.

### 2. Suggesting Enhancements
- Open an issue using the **Feature Request** template.
- Explain the rationale, target use case, and proposed interface.

### 3. Submitting Code Changes
1. Fork the repository and create a feature branch:
   ```bash
   git checkout -b feature/my-new-feature
   ```
2. Set up the development virtual environment and install dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
3. Run the automated tests to ensure everything passes:
   ```bash
   pytest -v
   ```
4. Verify the frontend builds cleanly:
   ```bash
   cd ../frontend
   npm ci
   npm run build
   ```
5. Follow Conventional Commits format (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`).
6. Push to your fork and submit a Pull Request.

---

## Architectural Guidelines
- **No Data Leakage:** Any modifications to the machine learning pipeline must maintain strict chronological validation. Future observations must never bleed into training features or rolling statistics.
- **CPCB NAQI Standards:** Pollution classifications must adhere to Central Pollution Control Board (CPCB) statutory breakpoints.
- **Privacy & Integrity:** Do not display fabricated live readings as real sensor data; clearly distinguish between historical observations, sample datasets, and model forecasts.

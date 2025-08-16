# 🔑 FIUI Hot Wallet Documentation

This document describes the **Hot Wallet** implementation for FIUI
projects, based on Solana and Node.js.

------------------------------------------------------------------------

## 🚲 What is a Hot Wallet?

A **hot wallet** is a cryptocurrency wallet that remains **online and
connected to the internet**.\
It is designed for convenience and real-time operations such as:

-   Creating and managing addresses
-   Checking balances
-   Sending and receiving transactions
-   Interacting with tokens or smart contracts

Unlike a **cold wallet** (offline, long-term storage), a hot wallet is
more exposed to risks but ideal for daily operations.

In this project, the hot wallet powers **micromobility payments** (e.g.,
Jinete.ar) using Solana's ecosystem.

------------------------------------------------------------------------

## ⚙️ Technologies Used

-   **Node.js + Express** → Backend server exposing REST endpoints.\
-   **[@solana/web3.js](https://github.com/solana-labs/solana-web3.js)**
    → SDK to generate keypairs, sign, and send transactions.\
-   **[@solana/spl-token](https://github.com/solana-labs/solana-program-library/tree/master/token/js)**
    → Manage SPL tokens (create mint, mint tokens, transfers).\
-   **dotenv** → Load environment variables.\
-   **crypto (Node.js built-in)** → Encrypt private keys with
    AES-256-GCM.

------------------------------------------------------------------------

## 📝 Main Endpoints (`server.js`)

-   `GET /balance` → Returns SOL balance of the hot wallet.\
-   `POST /transfer/sol` → Transfer SOL to another address.\
-   `POST /token/create` → Create a new SPL token mint.\
-   `POST /token/mint` → Mint tokens to a user's wallet.\
-   `POST /token/transfer` → Transfer SPL tokens between accounts.

------------------------------------------------------------------------

## 🛡️ Security Considerations

Hot wallets are always online, so **security is critical**:

1.  **Encryption**: Private keys are encrypted with AES-256-GCM in this
    repo (basic).\
    For production: use **HashiCorp Vault** or **Cloud KMS (AWS/GCP)**.\
2.  **Access control**: Protect API endpoints with authentication & rate
    limiting.\
3.  **Separation of funds**:
    -   **Hot wallet** → Daily operations, small balances.\
    -   **Cold storage** → Long-term reserves, offline.\
4.  **Auditing**: Log all transactions and monitor unusual activity.\
5.  **Fail-safes**:
    -   Define per-user limits.\
    -   Alerts when balances drop below threshold.

------------------------------------------------------------------------

## 📐 Architecture Overview

    +-------------------+         +-----------------------+
    |   Client (App)    | <--->   |   Hot Wallet Server   |
    | (Mobile/Web/API)  |         | (Node.js + Express)   |
    +-------------------+         +----------+------------+
                                           |
                                           v
                               +-------------------------+
                               |   Solana Blockchain    |
                               +-------------------------+

-   The server exposes endpoints.\
-   Requests are validated → signed with the wallet key → sent to Solana
    RPC.\
-   Balances and TX hashes are returned to the client.

------------------------------------------------------------------------

## 📬 Notes

-   Use **Devnet** for testing before production.\
-   Keep **secrets** outside the repo (`.env`, Vault).\
-   Plan **rotation** of keys and addresses if needed.

------------------------------------------------------------------------

👉 Back to main documentation: [README.md](README.md)

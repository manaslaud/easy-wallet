# IndexedDB Structure for Secure User Data

This document outlines the structure and storage requirements for a secure application using IndexedDB to store sensitive data such as encrypted mnemonics, derivation keys, and account information.

---

## **Database Name: `user_details`**

The `user_details` database will store the following data:

### **1. Store: `mneumonic`**
This store holds the encrypted mnemonic phrase used for deriving keys.

#### Record Format:
- **Encrypted mnemonic:** A single record holding the encrypted version of the user's mnemonic.

---

### **2. Store: `derivationKey`**
This store holds the derivation key used in the key derivation process.

#### Record Format:
- **Encrypted Derivation Key Object:** A single record holding the encrypted derivation key object.

The derivation key object contains:
- `salt`: The salt used in the key derivation process.
- `iterations`: The number of iterations used for PBKDF2.
- `keylen`: The length of the derived key.
- `iv`: The initialization vector used during encryption.
- `derivationKey`: The actual derived key used for encryption.

---

### **3. Store: `account`**
This store holds the user’s various accounts, derived from the mnemonic and derivation key.

#### Record Format:
- **Multiple accounts:** Multiple records stored under the `account` store, each representing a different account.

Each record may include:
- `accountID`: A unique identifier for each account.
- `publicKey`: The public key for the account.
- `privateKey`: The private key for the account (encrypted).
- `additionalDetails`: Any other account-specific details (optional).

---

## **Database Name: `user_details`**

### **1. Store: `mneumonic`**
- Single mnemonic encrypted record.

### **2. Store: `derivationKey`**
- Single derivation key object encrypted record.

### **3. Store: `account`**
- Multiple accounts under the user.

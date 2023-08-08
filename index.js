const { Client, PrivateKey, AccountCreateTransaction, AccountBalanceQuery, Hbar } = require("@hashgraph/sdk");
require("dotenv").config();

const client = Client.forTestnet();

const newAccountPrivateKey = PrivateKey.generateED25519(); 
const newAccountPublicKey = newAccountPrivateKey.publicKey;

console.log(newAccountPrivateKey, newAccountPublicKey)

const createNewAccount = async () => {
    
    const newAccount = await new AccountCreateTransaction()
    .setKey(newAccountPublicKey)
    .setInitialBalance(Hbar.fromTinybars(1000))
    .execute(client);
    console.log(newAccount)
}

createNewAccount();


// import { PrngTransaction, Client } from "@hashgraph/sdk";
// const client = Client.forTestnet();
// // STEP 1 ===================================
// console.log(`\nSTEP 1 ===================================\n`);
// console.log(`- Generating random numbers with the SDK...\n`);

// const lo = 0;
// const hi = 50;

// let randomNum = [];
// for (var i = 0; i < 5; i++) {
//     const randomNumTx = await new PrngTransaction().setRange(hi).execute(client);
//     const randomNumRec = await randomNumTx.getRecord(client);
//     randomNum[i] = randomNumRec.prngNumber;
//     console.log(`- Run #${i + 1}: Random number = ${randomNum[i]}`);
// }
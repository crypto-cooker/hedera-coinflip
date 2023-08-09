const privateKey = "302e020100300506032b6570042204206490fd6f79abb86181d26474824e415805e1964c027ed72639e0d1d5ca0a8fb8";
const accountId = "0.0.451770";

const { FileCreateTransaction, ContractCreateFlow, Client, AccountId, PrivateKey } = require("@hashgraph/sdk");


const bytecode = "608060405234801561001057600080fd5b5060c98061001f6000396000f3fe60806040526004361060265760003560e01c80630a4c137c14602b57806350312c9e146033575b600080fd5b60316059565b005b348015603e57600080fd5b506045605b565b60405160509190607a565b60405180910390f35b565b600047905090565b6000819050919050565b6074816063565b82525050565b6000602082019050608d6000830184606d565b9291505056fea26469706673582212205828c317e67d61299a3183d75d58f3f32bea34302152267a0e7952b609317f9b64736f6c63430008120033";
const client = Client
            .forTestnet()
            .setOperator(AccountId.fromString(accountId), PrivateKey.fromString(privateKey));

            const accountID = AccountId.fromString("0.0.460569").toSolidityAddress();
            const accountID1 = AccountId.fromString("0.0.460569").getEvmAddress();
            console.log(accountID, accountID1);
            return;

const uploadContract = async () => {
    const contractTx = new ContractCreateFlow()
            .setGas(1000000000000000)
            .setBytecode(bytecode);
    const contractRes = await contractTx.execute(client);
    console.log(contractRes, "contractRes");
    const receipt = await contractRes.getReceipt(client);
    console.log(receipt, "receipt");

    const newContractId = (await receipt).contractId;

    console.log(`Our contract id is ${newContractId}`);
}

uploadContract();


// const { Client, PrivateKey, AccountCreateTransaction, AccountBalanceQuery, Hbar } = require("@hashgraph/sdk");
// require("dotenv").config();

// const client = Client.forTestnet();

// const newAccountPrivateKey = PrivateKey.generateED25519(); 
// const newAccountPublicKey = newAccountPrivateKey.publicKey;

// console.log(newAccountPrivateKey, newAccountPublicKey)

// const createNewAccount = async () => {
    
//     const newAccount = await new AccountCreateTransaction()
//     .setKey(newAccountPublicKey)
//     .setInitialBalance(Hbar.fromTinybars(1000))
//     .execute(client);
//     console.log(newAccount)
// }

// createNewAccount();


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
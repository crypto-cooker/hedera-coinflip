import logo from './logo.svg';
import './App.css';

import Header from './components/Header';
import Footer from './components/Footer';

import { HashConnect } from 'hashconnect';

let hashconnect = new HashConnect(true);
const appMetaData = {
  name: "HashPack",
  description: "A HBAR wallet",
  icon: "https://wallet.hashpack.app/assets/favicon/favicon.ico",
  url: "http://localhost:3000"
}
let accountId = "";
let saveData = {
  topic: "",
  pairingString: "",
  privateKey: "",
  pairedWalletData: null,
  pairedAccounts: []
}

function App() {

  const connectWallet = async () => {
    let initData = await hashconnect.init(appMetaData, "testnet", false);
    console.log(initData)
    let state = await hashconnect.connect();
    console.log(state,"state")

    saveData.pairingString = await hashconnect.generatePairingString(state, "testnet", false)
    const result =hashconnect.findLocalWallets();
    console.log(result);
    hashconnect.connectToLocalWallet(saveData.pairingString);
    
    hashconnect.pairingEvent.once(pairingData => {
      console.log(pairingData,"pairingData")
      // pairingData.accountIds.forEach(id => {
      //   //console.log("conneecctgted",id);
      // });
    })
  }
  return (
    <div className="App">
      {/* <Header /> */}
      <main>
        <div className="container">
          <div className="main-content">
            <div className="flip-box">
              <div className="coins">
                <img src="./images/logo.png" alt="" data-xblocker="passed" />
              </div>
              <p className="bet-on-title">I BET ON</p>
              <div className="bet-selecte">
                <div className="coin-box">
                  <img src="./images/logo.png" alt="" />
                  <p className="text-green">HEADS</p>
                </div>
                <div className="coin-box">
                  <img src="./images/logo.png" alt="" />
                  <p className="text-purple">TAILS</p>
                </div>
              </div>
              <p className="bet-on-title">FOR</p>
              <button className="wallet-adapter-button wallet-adapter-button-trigger" tabIndex="0" onClick={connectWallet}>
                Select Wallet
              </button>
            </div>
            <div className="leaderboard">
              <h2 className="h2-plays">RECENT PLAYS (last 10 Txs)</h2>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;

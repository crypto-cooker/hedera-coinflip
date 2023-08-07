import logo from './logo.svg';
import './App.css';

import Header from './components/Header';
import Footer from './components/Footer';

import { HashConnect } from 'hashconnect';
import { useEffect, useState } from 'react';

let hashconnect = new HashConnect(true);
if(hashconnect) {
  hashconnect.foundExtensionEvent.once((walletMetadata) => {
    console.log(walletMetadata, "walletMetadata");
  })
  hashconnect.pairingEvent.once((pairingData) => {
    console.log(pairingData)
  }) 
}
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

  const [pairingData, setPairingData] = useState(null);
  const [hbarBalance, setHbarBalance] = useState(0);
  const [selectedOption, setSelectedOption] = useState(0);
  useEffect(() => {
    const findWallets = () => {
      console.log(hashconnect.hcData, "localstorage");
      const data = hashconnect.init(appMetaData, "testnet", false);
      if(data) setPairingData(data)
    }
    
    if(pairingData==null) {
      findWallets()
    }
  }, [hashconnect, pairingData])

  const connectWallet = async () => {
    let initData = await hashconnect.init(appMetaData, "testnet", false);
    console.log(initData, "initData")
    let state = await hashconnect.connect();
    console.log(state,"state")

    saveData.pairingString = await hashconnect.generatePairingString(state, "testnet", false)
    const result = await hashconnect.findLocalWallets();
    console.log(result, "REsult");
    hashconnect.connectToLocalWallet(saveData.pairingString);
    console.log(hashconnect.hcData.savedPairings, "DDFF")
  }
  return (
    <div className="App">
      {/* <Header /> */}
      <main>
        <div className="container">
          <div className="main-content">
            <div className="flip-box">
              
              <p className="bet-on-title">SAUCE-FLIP</p>
              <div className='flip-inner-box'>
                {!pairingData && <div className='logo-img-section'><img className='logo-img' src="./images/logo.png" alt="SAUCE-FLIP" /></div>}
                {pairingData && <div className="bet-selecte">
                  <div className="coin-box">
                    <img src="./images/head.png" alt="" />
                    <button className={"flip-button "+ (selectedOption==0 ? "selected":"")} onClick={()=>setSelectedOption(0)}>Heads</button>
                  </div>
                  <div className='or-section'>
                    <p>OR</p>
                  </div>
                  <div className="coin-box">
                    <img src="./images/tail.png" alt="" />
                    <button className={"flip-button "+ (selectedOption==1 ? "selected":"")} onClick={()=>setSelectedOption(1)}>Tails</button>
                  </div>
                </div>}
                <div className='connect-btn-section'>
                  {!pairingData && <button className="flip-button" tabIndex="0" onClick={connectWallet}>
                    Connect Wallet
                  </button>}
                </div>
              </div>
            </div>
            {/* <div className="leaderboard">
              <h2 className="h2-plays">RECENT PLAYS (last 10 Txs)</h2>
            </div> */}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;

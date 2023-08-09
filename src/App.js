import './App.css';

import Header from './components/Header';
import Footer from './components/Footer';

import { useEffect, useState } from 'react';

import coindata, { map } from "./constants"

import { pairClient, connectWallet, flipHBar, disconnect } from './hashgraph';




function App() {

  const [pairingData, setPairingData] = useState(null);
  const [hbarBalance, setHbarBalance] = useState(0);
  const [selectedOption, setSelectedOption] = useState(true);
  const [selectedToken, setSelectedToken] = useState(0);
  const [selectedAmount, setSelectedAmount] = useState(0)
  useEffect(() => {
    const findWallets = async () => {
      const data = await pairClient();
      setPairingData(data)
    }
    findWallets() 
  }, [])

  
  

  const flipFunc = async () => {
    
  }
  return (
    <div className="App">
      <div className='background-container'>
        {/* <img className='moon-image' src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/moon2.png" alt="" /> */}
        <div class="stars"></div>
        <div class="twinkling"></div>
        {/* <div class="clouds"></div> */}
      </div>
      <Header />
      <main>
        <div className="container">
          <div className="main-content">
            <div className="flip-box">
              
              <p className="bet-on-title">SAUCE-FLIP</p>
              <div className='flip-inner-box'>
                {!pairingData && <div className='logo-img-section'><img className='logo-img' src="./images/logo.png" alt="SAUCE-FLIP" /></div>}
                {pairingData && 
                <>
                  <div className="bet-selecte">
                    <div className="coin-box">
                      <img src="./images/head.png" alt="" />
                      <button className={"flip-button "+ (selectedOption==true ? "selected":"")} onClick={()=>(setSelectedOption(true))}>Heads</button>
                    </div>
                    <div className='or-section'>
                      <p>OR</p>
                    </div>
                    <div className="coin-box">
                      <img src="./images/tail.png" alt="" />
                      <button className={"flip-button "+ (selectedOption==false ? "selected":"")} onClick={()=>disconnect()}>Tails</button>
                    </div>
                  </div>
                  <div className='choose-text'>
                      <p>Choose Coin To Flip</p>
                  </div>
                  <div className='coin-select-box'>
                    {coindata.map((item, index) => <div className='coin-box'>
                      <button className={"flip-button "+ (selectedToken==index ? "selected":"")} onClick={()=> {setSelectedToken(index); if(index!=selectedToken) setSelectedAmount(0)}}>{item.token}</button>
                    </div>)}
                  </div>
                  <div className='choose-text'>
                      <p>Choose Amount To Flip</p>
                  </div>
                  <div className='coin-amount-box'>
                      <button className={"flip-button "+ (selectedAmount==0 ? "selected":"")} onClick={()=> setSelectedAmount(0)}>
                        <span>{coindata[selectedToken].amounts[0]}</span> <br />
                        <span>{coindata[selectedToken].token}</span>
                      </button>
                      <button className={"flip-button "+ (selectedAmount==1 ? "selected":"")} onClick={()=> setSelectedAmount(1)}>
                      <span>{coindata[selectedToken].amounts[1]}</span> <br />
                        <span>{coindata[selectedToken].token}</span>
                      </button>
                      <button className={"flip-button "+ (selectedAmount==2 ? "selected":"")} onClick={()=> setSelectedAmount(2)}>
                      <span>{coindata[selectedToken].amounts[2]}</span> <br />
                        <span>{coindata[selectedToken].token}</span>
                      </button>                 
                  </div>
                  <div className='coin-amount-box'>
                      <button className={"flip-button "+ (selectedAmount==3 ? "selected":"")} onClick={()=> setSelectedAmount(3)} style={{width:"50%"}}>
                      <span>{coindata[selectedToken].amounts[3]}</span> <br />
                        <span>{coindata[selectedToken].token}</span>
                      </button>
                      <button className={"flip-button "+ (selectedAmount==4 ? "selected":"")} onClick={()=> setSelectedAmount(4)} style={{width:"50%"}}>
                      <span>{coindata[selectedToken].amounts[4]}</span> <br />
                        <span>{coindata[selectedToken].token}</span>
                      </button>                    
                  </div>
                </>}
                <div className='connect-btn-section'>
                  {!pairingData && <button className="flip-button" tabIndex="0" onClick={connectWallet}>
                    Connect Wallet
                  </button>}
                  {pairingData && <button className="flip-button" tabIndex="0" onClick={() => flipHBar(selectedAmount,selectedOption)}>
                    Flip Now
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
      {/* <Footer /> */}
    </div>
  );
}

export default App;

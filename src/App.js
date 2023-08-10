import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { useEffect, useState } from 'react';
import coindata from "./constants"
import { pairClient, flipHBar, flipToken } from './hashgraph';
import useSound from 'use-sound';
import backgroundMusic from './assets/music/BackgroundMusic.mp3';
import soundMusic from './assets/music/Click.mp3';



function App() {

  const [pairingData, setPairingData] = useState(null);
  const [hbarBalance, setHbarBalance] = useState(0);
  const [selectedOption, setSelectedOption] = useState(true);
  const [selectedToken, setSelectedToken] = useState(0);
  const [selectedAmountIndex, setselectedAmountIndex] = useState(0)
  
  const [play, { stop }] = useSound(backgroundMusic, { volume: 0.25 });
  const [playSound] = useSound(soundMusic, { volume: 0.25 });
  const [backgroundPlaying, setBackgroundplaying] = useState(false);
  const [clickPlaying, setClickPlaying] = useState(false);
  const playBackround = () => {
    setBackgroundplaying(!backgroundPlaying);
    if(backgroundPlaying==false){
      play();
    } else {
      stop();
    }
  }

  const clickPlay = () => { if(clickPlaying==true) playSound(); }
  
  useEffect(() => {
    const findWallets = async () => {
      const data = await pairClient();
      setPairingData(data)
    }
    findWallets() 
  }, [])

  const flipFunc = async () => {
    if(selectedToken==3) {
      await flipHBar(selectedAmountIndex, selectedOption);
    } else {
      await flipToken(selectedToken, selectedAmountIndex, selectedOption);
    }    
  }
  return (
    <div className="App">
      <div className='background-container'>
        <div className="stars"></div>
        <div className="twinkling"></div>
      </div>
      <header>
        <div className="toolbar">
          <div onClick={playBackround}>
            <img className="sound-img" src={backgroundPlaying ? "./images/on.png": "./images/off.png"} />
            <p className="text-green">MUSIC</p>
          </div>
          <div onClick={()=> setClickPlaying(!clickPlaying)}>
            <img className="sound-img" src={clickPlaying ? "./images/on.png": "./images/off.png"} />
            <p className="text-green">SOUND</p>
          </div>
        </div>
      </header>
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
                      <button className={"flip-button "+ (selectedOption==true ? "selected":"")} onClick={()=>(selectedOption==false?clickPlay():null,setSelectedOption(true))}>Heads</button>
                    </div>
                    <div className='or-section'>
                      <p>OR</p>
                    </div>
                    <div className="coin-box">
                      <img src="./images/tail.png" alt="" />
                      <button className={"flip-button "+ (selectedOption==false ? "selected":"")} onClick={()=>(selectedOption==true?clickPlay():null,setSelectedOption(false))}>Tails</button>
                    </div>
                  </div>
                  <div className='choose-text'>
                      <p>Choose Coin To Flip</p>
                  </div>
                  <div className='coin-select-box'>
                    {coindata.map((item, index) => <div key={index} className='coin-box'>
                      <button className={"flip-button "+ (selectedToken==index ? "selected":"")} onClick={()=> {
                        setSelectedToken(index); if(index!=selectedToken) {clickPlay();setselectedAmountIndex(0)}}
                      }>{item.token}</button>
                    </div>)}
                  </div>
                  <div className='choose-text'>
                      <p>Choose Amount To Flip</p>
                  </div>
                  <div className='coin-amount-box'>
                      <button className={"flip-button "+ (selectedAmountIndex==0 ? "selected":"")} onClick={()=> (selectedAmountIndex!=0?clickPlay():null,setselectedAmountIndex(0))}>
                        <span>{coindata[selectedToken].text[0]}</span> <br />
                        <span>{coindata[selectedToken].token}</span>
                      </button>
                      <button className={"flip-button "+ (selectedAmountIndex==1 ? "selected":"")} onClick={()=> (selectedAmountIndex!=1?clickPlay():null,setselectedAmountIndex(1))}>
                      <span>{coindata[selectedToken].text[1]}</span> <br />
                        <span>{coindata[selectedToken].token}</span>
                      </button>
                      <button className={"flip-button "+ (selectedAmountIndex==2 ? "selected":"")} onClick={()=> (selectedAmountIndex!=2?clickPlay():null,setselectedAmountIndex(2))}>
                      <span>{coindata[selectedToken].text[2]}</span> <br />
                        <span>{coindata[selectedToken].token}</span>
                      </button>                 
                  </div>
                  <div className='coin-amount-box'>
                      <button className={"flip-button "+ (selectedAmountIndex==3 ? "selected":"")} onClick={()=> (selectedAmountIndex!=3?clickPlay():null,setselectedAmountIndex(3))} style={{width:"50%"}}>
                      <span>{coindata[selectedToken].text[3]}</span> <br />
                        <span>{coindata[selectedToken].token}</span>
                      </button>
                      <button className={"flip-button "+ (selectedAmountIndex==4 ? "selected":"")} onClick={()=> (selectedAmountIndex!=4?clickPlay():null,setselectedAmountIndex(4))} style={{width:"50%"}}>
                      <span>{coindata[selectedToken].text[4]}</span> <br />
                        <span>{coindata[selectedToken].token}</span>
                      </button>                    
                  </div>
                </>}
                <div className='connect-btn-section'>
                  {!pairingData && <button className="flip-button" tabIndex="0" onClick={pairClient}>
                    Connect Wallet
                  </button>}
                  {/* {pairingData && <button className="flip-button" tabIndex="0" onClick={() => flipHBar(selectedAmountIndex, selectedOption)}> */}
                  {pairingData && <button className="flip-button" tabIndex="0" onClick={flipFunc}>
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
      <Footer />
    </div>
  );
}

export default App;

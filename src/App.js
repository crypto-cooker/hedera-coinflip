import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { useEffect, useState, useRef } from 'react';
import coindata from "./constants"
import { pairClient, flipHBar, flipToken } from './hashgraph';
import useSound from 'use-sound';
import Confetti from "react-confetti";
import backgroundMusic from './assets/music/BackgroundMusic.mp3';
import soundMusic from './assets/music/Click.mp3';



function App() {

  const [pairingData, setPairingData] = useState(null);
  const [selectedOption, setSelectedOption] = useState(true);
  const [selectedToken, setSelectedToken] = useState(0);
  const [selectedAmountIndex, setselectedAmountIndex] = useState(0);
  const [fliping, setFliping] = useState(0);
  const [status, setStatus] = useState(false);
  const confetiRef = useRef(null);
  const [height, setHeight] = useState(null);
  const [width, setWidth] = useState(null);
  const [statusText, setStatusText] = useState("Waiting");
  useEffect(() => {
    setHeight(confetiRef.current.clientHeight);
    setWidth(confetiRef.current.clientWidth);
  }, []);
  const [play, { stop }] = useSound(backgroundMusic, { volume: 0.5 });
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
    try {
      setFliping(1);
      setStatusText("Waiting");
      let status = false;
      if(selectedToken==3) {
        status = await flipHBar(selectedAmountIndex, selectedOption);
      } else {
        status = await flipToken(selectedToken, selectedAmountIndex, selectedOption);        
      }
      setStatus(status)
      if(status) {
        setStatusText("You win!, try again");
      } else {
        setStatusText("You lost!, try again");
      }
      setFliping(2)
    } catch (error) {
      console.log("Error:", error.message);
      setFliping(2)
      setStatusText("Tx denied, try again");
      setStatus(false)
    }
  }
  const tryAgain = () => {
    setStatus(false);
    if(fliping!=1) setFliping(0);
  }
  return (
    <div className="App" ref={confetiRef}>
      <div> {status==1 && <Confetti numberOfPieces={150} width={width} height={height} /> }</div>
      <div className='background-container'>
        <div className="stars"></div>
        <div className="twinkling"></div>
      </div>
      <header>
        <div className="toolbar">
          <div onClick={playBackround}>
            <img className="sound-img" src={backgroundPlaying ? "./images/MusicON.png": "./images/off.png"} />
            <p className="text-green">MUSIC</p>
          </div>
          <div onClick={()=> setClickPlaying(!clickPlaying)}>
            <img className="sound-img" src={clickPlaying ? "./images/on.png": "./images/off.png"} />
            <p className="text-green">SOUND</p>
          </div>
        </div>
      </header>
      <main >
        <div className="container">
          <div className="main-content">
            <div className="flip-box">
              <p className="bet-on-title">SAUCE-FLIP</p>
              <div className='flip-inner-box'>
                {fliping==1 && <div className='logo-img-section'><img className='logo-img' src="./images/spinning.gif" alt="SAUCE-FLIP" /></div> }
                {fliping!=1 && !pairingData && <div className='logo-img-section'><img className='logo-img' src="./images/logo.png" alt="SAUCE-FLIP" /></div>}
                {fliping==0 && pairingData && 
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
                {!fliping&& <div className='connect-btn-section'>
                  {!pairingData && <button className="flip-button" tabIndex="0" onClick={pairClient}>
                    Connect Wallet
                  </button>}
                  {/* {pairingData && <button className="flip-button" tabIndex="0" onClick={() => flipHBar(selectedAmountIndex, selectedOption)}> */}
                  {pairingData && <button className="flip-button" tabIndex="0" onClick={flipFunc}>
                    Flip Now
                  </button>}
                </div>}
                {(fliping==1 || fliping==2 ) && <div className='connect-btn-section'>
                  <button className="flip-button" tabIndex="0" onClick={tryAgain}>
                    {statusText}
                  </button>
                </div>}
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

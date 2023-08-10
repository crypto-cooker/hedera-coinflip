import useSound from 'use-sound';
import backgroundMusic from '../assets/music/BackgroundMusic.mp3';
import { useState } from 'react';

function Header() {
  const [play, { stop }] = useSound(backgroundMusic, { volume: 0.25 });
  const [backgroundPlaying, setBackgroundplaying] = useState(false);
  const playBackround = () => {
    setBackgroundplaying(!backgroundPlaying);
    if(backgroundPlaying==false){
      play();
    } else {
      stop();
    }
  }
  return (
    <header>
        <div className="toolbar">
          <div onClick={playBackround}>
            <img className="sound-img" src={backgroundPlaying ? "./images/on.png": "./images/off.png"} />
            <p className="text-green">MUSIC</p>
          </div>
          <div>
            <img className="sound-img" src="./images/on.png" />
            <p className="text-green">SOUND</p>
          </div>
        </div>
    </header>
  );
//   return (
//     <header className="header">
//         <div className="header-content">
//             <div className="header-left">
//                 <a href="">
//                     <div className="logo">
//                         <img src="https://sauceinu.myshopify.com/cdn/shop/files/logo.png?v=1690217980&width=300" />
//                     </div>
//                 </a>
//             </div>
//             <div className="header-right">
//                 <div class="right-item"></div>
//             </div>
//         </div>
//     </header>
    
//   );
}

export default Header;

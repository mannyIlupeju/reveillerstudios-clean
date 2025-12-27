import React from 'react'

export default function MusicPlayer() {
  return (
    <div>
        MusicPlayer
        <iframe 
            allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" 
            
            height="450" 
            
            sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" 
            src="https://embed.music.apple.com/ca/playlist/calm-music/pl.u-JPAZBZ9CX2G2Ax">
        </iframe>
    </div>
  )
}



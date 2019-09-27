//
//  Bulb.swift
//  customIosApp
//
//  Created by Toni Kaplan on 9/27/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation
import MediaPlayer

//The @objc attribute makes your Swift API available in Objective-C and the Objective-C runtime.
@objc(Bulb)class Bulb: NSObject {
  

  @objc static var musicPlayer = MPMusicPlayerController.systemMusicPlayer
  @objc static var isMusicAuthorized = false;
  
  @objc static var isOn = false
  
  @objc func turnOn() {
    Bulb.isOn = true
    print("Bulb is now ON")
    
  }
  @objc func turnOff() {
    Bulb.isOn = false
    print("Bulb is now OFF")
  }
  
  @objc func getStatus(_ callback: RCTResponseSenderBlock) {
    callback([NSNull(), Bulb.isOn])
  }
  
  @objc static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
   @objc static func playGenre(genre: String){
      print("playGenre")
      print(genre)
      musicPlayer.stop()
      musicPlayer.shuffleMode = .songs
      let query = MPMediaQuery()
      let predicate = MPMediaPropertyPredicate(value: genre, forProperty: MPMediaItemPropertyGenre)
      query.addFilterPredicate(predicate)
      musicPlayer.setQueue(with: query)
      musicPlayer.play()
  }
}

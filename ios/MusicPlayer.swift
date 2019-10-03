//
//  MusicPlayer.swift
//  customIosApp
//
//  Created by Toni Kaplan on 9/27/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation
import MediaPlayer

//The @objc attribute makes your Swift API available in Objective-C and the Objective-C runtime.
@objc(MusicPlayer)class MusicPlayer: RCTEventEmitter {

  override func supportedEvents() -> [String]! {
    return ["updateProgress"]
  }
  // ReactNativeEventEmitter is instantiated by React Native with the bridge.
//  private static var eventEmitter: ReactNativeEventEmitter!
 
  //TODO: Change systemMusicPlayer to applicationMusicPlayer
  @objc var musicPlayer = MPMusicPlayerController.systemMusicPlayer
  
  @objc static var isMusicAuthorized = false;
  
  // isOn, turnOn and turnOff are just being kept around as examples/references for now
  @objc static var isOn = false
  
  @objc func turnOn() {
    MusicPlayer.isOn = true
    print("MusicPlayer is now ON")
    
  }
  @objc func turnOff() {
    MusicPlayer.isOn = false
    print("MusicPlayer is now OFF")
  }
  
  @objc func getStatus(_ callback: RCTResponseSenderBlock) {
    callback([NSNull(), MusicPlayer.isOn])
  }

  

  @objc func playGenre(_ genre: String){
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
  
//  @objc static func requiresMainQueueSetup() -> Bool {
//    return true
//  }
  
  // This works?
//   @objc let timer3 = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true, block: { timer in
//     print("here2")
//   })
  
  @objc func updateCounting(_ timer: Timer){
      print("counting..")
  }
  

  private var timer: Timer?

  // https://stackoverflow.com/questions/41755271/timer-doesnt-work-in-native-react-native-component
    @objc
    func setOnProgress(_ callback: @escaping RCTResponseSenderBlock){
    DispatchQueue.main.async(execute: {

      self.invalidateProgressTracker()
//      self.timer = Timer.scheduledTimer(
//        timeInterval: 0.1,
//        target: self,
//        selector: #selector(self.handleMyFunction),
//        userInfo: nil,
//        repeats: true)
//    })
      self.timer = Timer.scheduledTimer(
        withTimeInterval: 0.1,
        repeats: true,
        block: { timer in
//          callback([NSNull(), MusicPlayer.isOn])
          print("block")
          self.sendEvent(withName: "updateProgress", body: "updateProgress" )
        }
      )
          })
  }


   @objc func handleMyFunction() {
       // Code here
    print("yo ")
   }

  @objc func invalidateProgressTracker(){
     timer?.invalidate()
   }

  
}

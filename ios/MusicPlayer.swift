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
    return ["updateProgress", "updatePlayerState"]
  }
  // ReactNativeEventEmitter is instantiated by React Native with the bridge.
//  private static var eventEmitter: ReactNativeEventEmitter!
 
  //TODO: Change systemMusicPlayer to applicationMusicPlayer
//  @objc var musicPlayer = MPMusicPlayerController.systemMusicPlayer
   @objc var musicPlayer = MPMusicPlayerController.applicationMusicPlayer
  
  @objc static var isMusicAuthorized = false;
  
  
  
//  @objc func getStatus(_ callback: RCTResponseSenderBlock) {
//    callback([NSNull(), MusicPlayer.isOn])
//  }
  
  @objc func getCurrentPlaybackTime(_ callback: RCTResponseSenderBlock) {
    let currentPlaybackTime = self.musicPlayer.currentPlaybackTime as Double
    callback([NSNull(), currentPlaybackTime])
  }

  @objc func getCurrentSongDuration(_ callback: RCTResponseSenderBlock) {
    let nowPlayingItemDuration = self.musicPlayer.nowPlayingItem?.value(forProperty: "MPMediaItemPropertyPlaybackDuration") as! String
    callback([NSNull(), nowPlayingItemDuration])
  }
  

  @objc func pause(){
    print("pause")
    musicPlayer.pause()
  }
  
  @objc func play(){
     print("play")
     musicPlayer.prepareToPlay()
     musicPlayer.play()
   }
    
  @objc func initalizePlayerWithPlaylist(_ playlist: String){
    print("playGenre")
    print(playlist)
    let myPlaylistQuery = MPMediaQuery.playlists()
    let playlists = myPlaylistQuery.collections
    print(playlists)
//    musicPlayer.stop()
//    musicPlayer.shuffleMode = .songs
//    let query = MPMediaQuery()
    let predicate = MPMediaPropertyPredicate(value: playlist, forProperty: MPMediaPlaylistPropertyName)
    myPlaylistQuery.addFilterPredicate(predicate)
    musicPlayer.setQueue(with: myPlaylistQuery)
    musicPlayer.play()
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
  
  @objc override static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  private var timer: Timer?

  // https://stackoverflow.com/questions/41755271/timer-doesnt-work-in-native-react-native-component
    @objc
    func initalizeProgressTracker(){
      self.timer = nil;
      self.invalidateProgressTracker();
      print("initalizeProgressTracker")
        DispatchQueue.main.async(execute: {
          if(self.timer == nil){

            print("nil")
            self.timer = Timer.scheduledTimer(
              withTimeInterval: 1,
              repeats: true,
              block: { timer in
                let nowPlayingItem = self.musicPlayer.nowPlayingItem
                if(nowPlayingItem != nil){
                  let nowPlayingItemDuration = self.musicPlayer.nowPlayingItem?.value(forProperty: "playbackDuration") as! Double
                  let currentTime = self.musicPlayer.currentPlaybackTime as Double
                  let remainingTime = nowPlayingItemDuration - currentTime;

                  let params = [
                  "nowPlayingItemDuration": nowPlayingItemDuration,
                  "currentTime": currentTime,
                  "remainingTime": remainingTime
                  ]
                  
                  self.sendEvent(withName: "updateProgress", body: params )
                }
                else{
                  self.sendEvent(withName: "updateProgress", body: -1 )
                }
              }
            )
            
          }
              })
  }


  @objc func invalidateProgressTracker(){
    DispatchQueue.main.async(execute: {
      if self.timer != nil {
        self.timer!.invalidate()
        self.timer = nil
      }
    }
    )
   }
  
  
  
  @objc func updateNowPlayingInfo(){
    let nowPlayingItem = self.musicPlayer.nowPlayingItem
    
    if(nowPlayingItem != nil){
        let nowPlayingItemName = self.musicPlayer.nowPlayingItem?.value(forProperty: "title") as! String
        let nowPlayingItemArtist = self.musicPlayer.nowPlayingItem?.value(forProperty: "artist") as! String
      let params = [
                  "nowPlayingItemName": nowPlayingItemName,
                  "nowPlayingItemArtist": nowPlayingItemArtist,
                  ]
      self.sendEvent(withName: "updatePlayerState", body: params )
      }
       

    else{
      let params : [String : Any?] = [
                      "nowPlayingItemName": nil,
                      "nowPlayingItemArtist": nil,
        ]
      self.sendEvent(withName: "updatePlayerState", body: params )
    }
    }
  
  @objc func addPlayerStateObserver(){
    musicPlayer.beginGeneratingPlaybackNotifications()

    NotificationCenter.default.addObserver(self, selector:#selector(self.updateNowPlayingInfo), name: NSNotification.Name.MPMusicPlayerControllerNowPlayingItemDidChange, object: nil)
   }

  
}

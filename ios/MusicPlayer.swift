//
//  MusicPlayer.swift
//  SpookyMusic
//
//  Created by Toni Kaplan on 9/27/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation
import MediaPlayer

//The @objc attribute makes your Swift API available in Objective-C and the Objective-C runtime.
@objc(MusicPlayer)class MusicPlayer: RCTEventEmitter {
  
  private var timer: Timer?
  
  override func supportedEvents() -> [String]! {
    return ["updateProgress", "updatePlayerState"]
  }
  
  @objc override static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  // Could alternatively use systemMusicPlayer to share the same music player as the music app
  @objc var musicPlayer = MPMusicPlayerController.applicationMusicPlayer
  
  @objc static var isMusicAuthorized = false;
  
  @objc func getCurrentPlaybackTime(_ callback: RCTResponseSenderBlock) {
    let currentPlaybackTime = self.musicPlayer.currentPlaybackTime as Double
    callback([NSNull(), currentPlaybackTime])
  }
  
  @objc func getCurrentSongDuration(_ callback: RCTResponseSenderBlock) {
    let nowPlayingItemDuration = self.musicPlayer.nowPlayingItem?.value(forProperty: "MPMediaItemPropertyPlaybackDuration") as! String
    callback([NSNull(), nowPlayingItemDuration])
  }
  
  @objc func pause(){
    musicPlayer.pause()
  }
  
  @objc func play(){
    musicPlayer.prepareToPlay()
    musicPlayer.play()
  }
  
  @objc func initalizePlayerWithPlaylist(_ playlist: String){
    let myPlaylistQuery = MPMediaQuery.playlists()
    musicPlayer.stop()
    let predicate = MPMediaPropertyPredicate(value: playlist, forProperty: MPMediaPlaylistPropertyName)
    myPlaylistQuery.addFilterPredicate(predicate)
    musicPlayer.setQueue(with: myPlaylistQuery)
    musicPlayer.prepareToPlay()
    musicPlayer.play()
  }
  
  // https://stackoverflow.com/questions/41755271/timer-doesnt-work-in-native-react-native-component
  @objc
  func initalizeProgressTracker(){
    self.timer = nil;
    self.invalidateProgressTracker();
    DispatchQueue.main.async(execute: {
      if(self.timer == nil){
        self.timer = Timer.scheduledTimer(
          withTimeInterval: 1,
          repeats: true,
          block: { timer in
            let nowPlayingItem = self.musicPlayer.nowPlayingItem
            if(nowPlayingItem != nil){
              let nowPlayingItemDuration = self.musicPlayer.nowPlayingItem?.value(forProperty: "playbackDuration") as! Double
              let currentTime = self.musicPlayer.currentPlaybackTime as Double
              let remainingTime = nowPlayingItemDuration - currentTime;
              
              let params: [String : Double]  = [
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
    if(self.musicPlayer.nowPlayingItem != nil){
      let nowPlayingItemNameTemp = self.musicPlayer.nowPlayingItem?.value(forProperty: "title")
      let nowPlayingItemArtistTemp = self.musicPlayer.nowPlayingItem?.value(forProperty: "artist")
      let params: [String : String] = [
        "nowPlayingItemName": nowPlayingItemNameTemp as? String ?? "",
        "nowPlayingItemArtist": nowPlayingItemArtistTemp as? String ?? "",
      ]
      self.sendEvent(withName: "updatePlayerState", body: params )
    }
    else{
      let params : [String : String] = [
        "nowPlayingItemName": "",
        "nowPlayingItemArtist": "",
      ]
      self.sendEvent(withName: "updatePlayerState", body: params )
    }
  }
  
  @objc func addPlayerStateObserver(){
    musicPlayer.beginGeneratingPlaybackNotifications()
    
    NotificationCenter.default.addObserver(self, selector:#selector(self.updateNowPlayingInfo), name: NSNotification.Name.MPMusicPlayerControllerNowPlayingItemDidChange, object: nil)
    NotificationCenter.default.addObserver(self, selector:#selector(self.updateNowPlayingInfo), name: NSNotification.Name.MPMusicPlayerControllerPlaybackStateDidChange, object: nil)
  }
}

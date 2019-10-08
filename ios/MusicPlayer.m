//
//  MusicPlayer.m
//  customIosApp
//
//  Created by Toni Kaplan on 9/27/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>


//@interface MusicPlayer : RCTEventEmitter <RCTBridgeModule>
@interface RCT_EXTERN_MODULE(MusicPlayer, RCTEventEmitter)

  RCT_EXTERN_METHOD(initalizeProgressTracker)
  RCT_EXTERN_METHOD(invalidateProgressTracker)

  RCT_EXTERN_METHOD(addPlayerStateObserver)

  RCT_EXTERN_METHOD(playGenre: (NSString *)genre)

  RCT_EXTERN_METHOD(getCurrentPlaybackTime: (RCTResponseSenderBlock)callback)
  RCT_EXTERN_METHOD(getCurrentSongDuration: (RCTResponseSenderBlock)callback)

@end

// React Native will not expose any function of MusicPlayer to React JavaScript unless explicitly done. To do so we have used RCT_EXPORT_METHOD() macro.

//@interface RCT_EXTERN_MODULE(MusicPlayer, RCTEventEmitter)

//RCT_EXTERN_METHOD(turnOn)
//
//RCT_EXTERN_METHOD(turnOff)
//
//RCT_EXTERN_METHOD(playGenre: (NSString *)genre)
//
//RCT_EXTERN_METHOD(getStatus: (RCTResponseSenderBlock)callback)
//
//RCT_EXTERN_METHOD(setOnProgress: (RCTResponseSenderBlock)callback)

//@end

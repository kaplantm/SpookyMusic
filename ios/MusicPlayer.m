//
//  MusicPlayer.m
//  customIosApp
//
//  Created by Toni Kaplan on 9/27/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "React/RCTBridgeModule.h"

// React Native will not expose any function of MusicPlayer to React JavaScript unless explicitly done. To do so we have used RCT_EXPORT_METHOD() macro.

@interface RCT_EXTERN_MODULE(MusicPlayer, NSObject)

RCT_EXTERN_METHOD(turnOn)

RCT_EXTERN_METHOD(turnOff)

RCT_EXTERN_METHOD(playGenre: (NSString *)genre)

RCT_EXTERN_METHOD(getStatus: (RCTResponseSenderBlock)callback)


@end

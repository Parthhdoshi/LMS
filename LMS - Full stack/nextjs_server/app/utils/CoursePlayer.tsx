'use client'
import React, { FC, useEffect, useRef, useState } from "react";

type Props = {
  videoUrl: string;
  title: string;
};

const CoursePlayer: FC<Props> = ({ videoUrl }) => {

  useEffect(() => {

}, [videoUrl]);


  return (
    <div 
    style={{ padding: "56.25% 0 0 0", position: "relative" }}
    key={videoUrl}
    >
       <iframe
       style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
       src={`https://player.vimeo.com/video/${videoUrl}?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479`} width="1920" height="1080" allow="autoplay; fullscreen; picture-in-picture; clipboard-write" title="09 Plate analysis on Out-of-plane Analysis"></iframe>
      {/* <Plyr 
      ref={playerRef}
      source={{
              type: "video",
              // @ts-ignore
              sources: [{ src: videoUrl, provider: "vimeo" }],
            }}
            options={{}}
            />
           */}
    </div>
  );
};

export default React.memo(CoursePlayer, (prevProps, nextProps) => prevProps.videoUrl === nextProps.videoUrl);
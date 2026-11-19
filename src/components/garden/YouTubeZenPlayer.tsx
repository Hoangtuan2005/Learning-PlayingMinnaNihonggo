import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { X, ExternalLink, Music } from 'lucide-react';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export interface YouTubeZenPlayerRef {
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  setVolume: (val: number) => void;
  mute: () => void;
  unMute: () => void;
}

interface YouTubeZenPlayerProps {
  videoId?: string;
  startTime?: number;
  title?: string;
  volume: number; // 0 to 1
  isMuted: boolean;
  isPlaying: boolean;
  onPlayStateChange: (playing: boolean) => void;
  showVideo: boolean;
  onCloseVideo: () => void;
}

export const YouTubeZenPlayer = forwardRef<YouTubeZenPlayerRef, YouTubeZenPlayerProps>(
  (
    {
      videoId = 'b-FHfiM8ILo',
      startTime = 450,
      title = 'Nhạc Chill Không Lời - Lofi Chill',
      volume,
      isMuted,
      isPlaying,
      onPlayStateChange,
      showVideo,
      onCloseVideo,
    },
    ref
  ) => {
    const playerRef = useRef<any>(null);
    const [isApiReady, setIsApiReady] = useState<boolean>(false);
    const [isPlayerReady, setIsPlayerReady] = useState<boolean>(false);

    // Expose control methods to parent component
    useImperativeHandle(ref, () => ({
      play: () => {
        try {
          playerRef.current?.playVideo();
        } catch (e) {
          console.warn('YT play failed', e);
        }
      },
      pause: () => {
        try {
          playerRef.current?.pauseVideo();
        } catch (e) {
          console.warn('YT pause failed', e);
        }
      },
      togglePlay: () => {
        try {
          if (!playerRef.current) return;
          const state = playerRef.current.getPlayerState?.();
          if (state === 1) {
            // currently playing -> pause
            playerRef.current.pauseVideo();
          } else {
            // paused/cued/unstarted -> play
            playerRef.current.playVideo();
          }
        } catch (e) {
          console.warn('YT toggle failed', e);
        }
      },
      setVolume: (v: number) => {
        try {
          playerRef.current?.setVolume(Math.round(v * 100));
        } catch (e) {
          console.warn('YT setVolume failed', e);
        }
      },
      mute: () => {
        try {
          playerRef.current?.mute();
        } catch (e) {
          console.warn('YT mute failed', e);
        }
      },
      unMute: () => {
        try {
          playerRef.current?.unMute();
        } catch (e) {
          console.warn('YT unMute failed', e);
        }
      },
    }));

    // Step 1: Load YouTube Iframe API Script once
    useEffect(() => {
      if (window.YT && window.YT.Player) {
        setIsApiReady(true);
        return;
      }

      const existingScript = document.getElementById('youtube-iframe-api');
      if (!existingScript) {
        const tag = document.createElement('script');
        tag.id = 'youtube-iframe-api';
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      }

      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof prevCallback === 'function') prevCallback();
        setIsApiReady(true);
      };
    }, []);

    // Step 2: Initialize YouTube Player instance
    useEffect(() => {
      if (!isApiReady) return;

      const playerElementId = 'youtube-zen-iframe-instance';
      try {
        new window.YT.Player(playerElementId, {
          height: '100%',
          width: '100%',
          videoId: videoId,
          playerVars: {
            autoplay: 1,
            controls: 1,
            loop: 1,
            playlist: videoId, // required for infinite looping in YouTube API
            start: startTime || 0,
            modestbranding: 1,
            rel: 0,
            playsinline: 1,
            enablejsapi: 1,
            origin: window.location.origin,
          },
          events: {
            onReady: (event: any) => {
              playerRef.current = event.target;
              setIsPlayerReady(true);
              if (startTime && startTime > 0) {
                try {
                  event.target.seekTo(startTime, true);
                } catch (e) {
                  // ignore
                }
              }
              event.target.setVolume(Math.round(volume * 100));
              if (isMuted) {
                event.target.mute();
              } else {
                event.target.unMute();
              }
              // Attempt autoplay
              try {
                event.target.playVideo();
              } catch (err) {
                console.log('Autoplay deferred for user gesture:', err);
              }
            },
            onStateChange: (event: any) => {
              // 1 = playing, 2 = paused, 0 = ended
              if (event.data === 1) {
                onPlayStateChange(true);
              } else if (event.data === 2) {
                onPlayStateChange(false);
              } else if (event.data === 0) {
                if (startTime && startTime > 0) {
                  try {
                    event.target.seekTo(startTime, true);
                  } catch (e) {
                    // ignore
                  }
                }
                event.target.playVideo(); // Infinite loop
              }
            },
          },
        });
      } catch (e) {
        console.error('Failed to create YouTube player', e);
      }

      return () => {
        try {
          if (playerRef.current) {
            playerRef.current.stopVideo?.();
            playerRef.current.destroy?.();
            playerRef.current = null;
          }
        } catch (e) {
          // ignore cleanup errors
        }
      };
    }, [isApiReady, videoId]);

    // Step 3: Handle Volume & Mute Updates
    useEffect(() => {
      if (!isPlayerReady || !playerRef.current) return;
      try {
        playerRef.current.setVolume(Math.round(volume * 100));
        if (isMuted) {
          playerRef.current.mute();
        } else {
          playerRef.current.unMute();
        }
      } catch (e) {
        // ignore
      }
    }, [volume, isMuted, isPlayerReady]);

    // Step 4: Handle External Play / Pause state sync
    useEffect(() => {
      if (!isPlayerReady || !playerRef.current) return;
      try {
        const state = playerRef.current.getPlayerState?.();
        if (isPlaying && state !== 1 && state !== 3) {
          playerRef.current.playVideo?.();
        } else if (!isPlaying && state === 1) {
          playerRef.current.pauseVideo?.();
        }
      } catch (e) {
        // ignore
      }
    }, [isPlaying, isPlayerReady]);

    return (
      <div
        className={
          showVideo
            ? 'fixed top-24 right-3 sm:right-5 z-40 w-72 sm:w-80 rounded-2xl overflow-hidden border-3 border-[#5d4037] shadow-2xl bg-[#2d3436] transition-all animate-fadeIn flex flex-col'
            : 'fixed -left-[9999px] -top-[9999px] w-[320px] h-[180px] pointer-events-none opacity-0'
        }
      >
        {/* Video Header Bar (only visible when floating video is shown) */}
        {showVideo && (
          <div className="bg-[#4e342e] px-3 py-1.5 flex items-center justify-between text-amber-100 text-xs border-b border-[#3e2723]">
            <div className="flex items-center gap-1.5 font-bold truncate">
              <Music className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span className="truncate">{title}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={`https://www.youtube.com/watch?v=${videoId}${startTime ? `&t=${startTime}s` : ''}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-amber-300 transition-colors"
                title="Mở trên YouTube"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={onCloseVideo}
                className="p-0.5 hover:bg-black/30 rounded text-amber-200 hover:text-white"
                title="Đóng cửa sổ video (nhạc vẫn phát)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* The YouTube iframe container */}
        <div className={showVideo ? 'w-full h-44 sm:h-48 bg-black' : 'w-full h-full'}>
          <div id="youtube-zen-iframe-instance" className="w-full h-full" />
        </div>
      </div>
    );
  }
);

YouTubeZenPlayer.displayName = 'YouTubeZenPlayer';

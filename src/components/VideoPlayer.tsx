import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Meal } from '../types';

interface VideoPlayerProps {
  meal: Meal;
  isVisible: boolean;
  onLoadStart?: () => void;
  onLoad?: () => void;
  onError?: (error: any) => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  meal,
  isVisible,
  onLoadStart,
  onLoad,
  onError,
}) => {
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [playbackStatus, setPlaybackStatus] = useState<any>(null);

  useEffect(() => {
    if (videoRef.current && isVisible) {
      videoRef.current.playAsync();
      setIsPlaying(true);
    } else if (videoRef.current && !isVisible) {
      videoRef.current.pauseAsync();
      setIsPlaying(false);
    }
  }, [isVisible]);

  const handlePlayPause = async () => {
    if (!videoRef.current) return;

    try {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
        setIsPlaying(false);
      } else {
        await videoRef.current.playAsync();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error toggling video playback:', error);
    }
  };

  const handleMuteToggle = async () => {
    if (!videoRef.current) return;

    try {
      await videoRef.current.setIsMutedAsync(!isMuted);
      setIsMuted(!isMuted);
    } catch (error) {
      console.error('Error toggling mute:', error);
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    setPlaybackStatus(status);
    
    if (status.isLoaded) {
      setIsLoading(false);
      if (onLoad) onLoad();
    }
    
    if (status.error) {
      console.error('Video playback error:', status.error);
      if (onError) onError(status.error);
    }

    // Loop video when it finishes
    if (status.didJustFinish) {
      videoRef.current?.replayAsync();
    }
  };

  const handleLoadStart = () => {
    setIsLoading(true);
    if (onLoadStart) onLoadStart();
  };

  // Fallback for videos without URL
  if (!meal.video_url) {
    return (
      <View style={styles.container}>
        <View style={styles.noVideoContainer}>
          <Text style={styles.noVideoText}>📸</Text>
          <Text style={styles.noVideoSubtext}>No video available</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.videoContainer}
        onPress={handlePlayPause}
        activeOpacity={1}
      >
        <Video
          ref={videoRef}
          style={styles.video}
          source={{ uri: meal.video_url }}
          resizeMode={ResizeMode.COVER}
          shouldPlay={isVisible && isPlaying}
          isLooping
          isMuted={isMuted}
          onPlaybackStatusUpdate={onPlaybackStatusUpdate}
          onLoadStart={handleLoadStart}
        />
        
        {/* Loading indicator */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        )}

        {/* Play/Pause indicator */}
        {!isPlaying && !isLoading && (
          <View style={styles.playOverlay}>
            <View style={styles.playButton}>
              <Text style={styles.playIcon}>▶️</Text>
            </View>
          </View>
        )}
      </TouchableOpacity>

      {/* Video controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={handleMuteToggle}
        >
          <Text style={styles.controlIcon}>{isMuted ? '🔇' : '🔊'}</Text>
        </TouchableOpacity>
      </View>

      {/* Progress bar */}
      {playbackStatus?.isLoaded && playbackStatus?.durationMillis && (
        <View style={styles.progressContainer}>
          <View 
            style={[
              styles.progressBar,
              {
                width: `${(playbackStatus.positionMillis / playbackStatus.durationMillis) * 100}%`
              }
            ]}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    height: screenHeight,
    backgroundColor: '#000',
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  noVideoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  noVideoText: {
    fontSize: 48,
    marginBottom: 16,
  },
  noVideoSubtext: {
    fontSize: 16,
    color: '#999',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 24,
    marginLeft: 4,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 120,
    right: 16,
    alignItems: 'center',
    gap: 16,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlIcon: {
    fontSize: 20,
  },
  progressContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#fff',
  },
});
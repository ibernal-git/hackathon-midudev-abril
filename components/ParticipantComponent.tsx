import { NextPage } from 'next'
import { useState, useEffect, useRef, MutableRefObject } from 'react'
import type { VideoTrack, AudioTrack, LocalParticipant, LocalTrack } from 'twilio-video'
interface ParticipantProps {
  participant: LocalParticipant;
}
const ParticipantComponent: NextPage<ParticipantProps> = ({ participant }) => {
  const [videoTracks, setVideoTracks] = useState<VideoTrack[]>([])
  const [audioTracks, setAudioTracks] = useState<AudioTrack[]>([])

  const videoRef = useRef() as MutableRefObject<any>
  const audioRef = useRef() as MutableRefObject<any>

  const trackpubsToVideoTracks = (trackMap:LocalParticipant['videoTracks']) =>
    Array.from(trackMap.values())
      .map((publication) => publication.track)
      .filter((track) => track !== null)

  const trackpubsToAudioTracks = (trackMap:LocalParticipant['audioTracks']) =>
    Array.from(trackMap.values())
      .map((publication) => publication.track)
      .filter((track) => track !== null)

  useEffect(() => {
    setVideoTracks(trackpubsToVideoTracks(participant.videoTracks))
    setAudioTracks(trackpubsToAudioTracks(participant.audioTracks))

    const trackSubscribed = (track: LocalTrack) => {
      if (track.kind === 'video') {
        setVideoTracks((videoTracks) => [...videoTracks, track])
      } else if (track.kind === 'audio') {
        setAudioTracks((audioTracks) => [...audioTracks, track])
      }
    }

    const trackUnsubscribed = (track: LocalTrack) => {
      if (track.kind === 'video') {
        setVideoTracks((videoTracks) => videoTracks.filter((v) => v !== track))
      } else if (track.kind === 'audio') {
        setAudioTracks((audioTracks) => audioTracks.filter((a) => a !== track))
      }
    }

    participant.on('trackSubscribed', trackSubscribed)
    participant.on('trackUnsubscribed', trackUnsubscribed)

    return () => {
      setVideoTracks([])
      setAudioTracks([])
      participant.removeAllListeners()
    }
  }, [participant])

  useEffect(() => {
    const videoTrack = videoTracks[0]
    if (videoTrack) {
      videoTrack.attach(videoRef?.current)
      return () => {
        videoTrack.detach()
      }
    }
  }, [videoTracks])

  useEffect(() => {
    const audioTrack = audioTracks[0]
    if (audioTrack) {
      audioTrack.attach(audioRef?.current)
      return () => {
        audioTrack.detach()
      }
    }
  }, [audioTracks])

  return (
    <div className="participant">
      <h3>{participant.identity}</h3>
      <video ref={videoRef} autoPlay={true} />
      <audio ref={audioRef} autoPlay={true} muted={true} />
    </div>
  )
}

export default ParticipantComponent

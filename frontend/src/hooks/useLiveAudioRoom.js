import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Room, RoomEvent, Track, createLocalAudioTrack } from 'livekit-client';
import { config } from '../utils/config';

function assertMicrophoneSupported() {
  if (!window.isSecureContext) {
    throw new Error('Mikrofon erişimi için HTTPS gerekir. Lokal bilgisayarda localhost çalışır; ağdaki iPhone/Android cihazlarda HTTPS veya canlı domain kullanın.');
  }

  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error('Bu tarayıcı mikrofon erişimini desteklemiyor veya güvenli bağlantı olmadığı için mikrofon API kapalı.');
  }
}

export function useLiveAudioRoom() {
  const room = useMemo(() => new Room({ adaptiveStream: true, dynacast: true }), []);
  const remoteAudioElementsRef = useRef(new Map());
  const [connected, setConnected] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [remoteParticipants, setRemoteParticipants] = useState([]);
  const [remoteAudioTrackCount, setRemoteAudioTrackCount] = useState(0);
  const [localTrack, setLocalTrack] = useState(null);

  useEffect(() => {
    const detachRemoteAudioTrack = (track, publication) => {
      const key = publication?.trackSid || track?.sid;
      if (!key) return;

      const existing = remoteAudioElementsRef.current.get(key);
      if (existing) {
        existing.remove();
        remoteAudioElementsRef.current.delete(key);
      }

      track?.detach?.().forEach((element) => element.remove());
      setRemoteAudioTrackCount(remoteAudioElementsRef.current.size);
    };

    const attachRemoteAudioTrack = (track, publication) => {
      if (!track || track.kind !== Track.Kind.Audio) return;
      const key = publication?.trackSid || track.sid;
      if (!key || remoteAudioElementsRef.current.has(key)) return;

      const element = track.attach();
      element.autoplay = true;
      element.playsInline = true;
      element.dataset.livekitTrackSid = key;
      element.style.display = 'none';
      document.body.appendChild(element);
      remoteAudioElementsRef.current.set(key, element);
      setRemoteAudioTrackCount(remoteAudioElementsRef.current.size);

      element.play().catch(() => {
        // Mobile browsers may defer playback; room.startAudio() is also called from the user's click handler path.
      });
    };

    const attachExistingAudioTracks = () => {
      room.remoteParticipants.forEach((participant) => {
        participant.trackPublications.forEach((publication) => {
          if (publication.kind === Track.Kind.Audio && publication.track) {
            attachRemoteAudioTrack(publication.track, publication);
          }
        });
      });
    };

    const sync = () => {
      setConnected(room.state === 'connected');
      setRemoteParticipants(Array.from(room.remoteParticipants.values()).map((p) => p.name || p.identity));
      attachExistingAudioTracks();
    };

    room.on('connected', sync);
    room.on('disconnected', sync);
    room.on('participantConnected', sync);
    room.on('participantDisconnected', sync);
    room.on(RoomEvent.TrackSubscribed, attachRemoteAudioTrack);
    room.on(RoomEvent.TrackUnsubscribed, detachRemoteAudioTrack);

    return () => {
      room.removeAllListeners();
      room.disconnect();
      localTrack?.stop();
      remoteAudioElementsRef.current.forEach((element) => element.remove());
      remoteAudioElementsRef.current.clear();
      setRemoteAudioTrackCount(0);
    };
  }, [room, localTrack]);

  const connect = useCallback(async (token) => {
    if (!config.livekitUrl) throw new Error('LiveKit URL is not configured');
    if (room.state !== 'connected') await room.connect(config.livekitUrl, token, { autoSubscribe: true });
    await room.startAudio?.();
    setConnected(true);
  }, [room]);

  const publishMicrophone = useCallback(async () => {
    assertMicrophoneSupported();
    let track = localTrack;
    if (!track) {
      track = await createLocalAudioTrack({ echoCancellation: true, noiseSuppression: true, autoGainControl: true });
      setLocalTrack(track);
      await room.localParticipant.publishTrack(track);
    }
    await track.unmute();
    setMicEnabled(true);
  }, [localTrack, room]);

  const toggleMicrophone = useCallback(async () => {
    if (!localTrack) return publishMicrophone();
    if (micEnabled) {
      await localTrack.mute();
      setMicEnabled(false);
    } else {
      await localTrack.unmute();
      setMicEnabled(true);
    }
  }, [localTrack, micEnabled, publishMicrophone]);

  const disconnect = useCallback(async () => {
    localTrack?.stop();
    setLocalTrack(null);
    setMicEnabled(false);
    remoteAudioElementsRef.current.forEach((element) => element.remove());
    remoteAudioElementsRef.current.clear();
    setRemoteAudioTrackCount(0);
    await room.disconnect();
    setConnected(false);
  }, [localTrack, room]);

  return { room, connected, micEnabled, remoteParticipants, remoteAudioTrackCount, connect, publishMicrophone, toggleMicrophone, disconnect };
}

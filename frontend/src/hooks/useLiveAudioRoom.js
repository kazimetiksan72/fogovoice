import { useCallback, useEffect, useMemo, useState } from 'react';
import { Room, createLocalAudioTrack } from 'livekit-client';
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
  const [connected, setConnected] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [remoteParticipants, setRemoteParticipants] = useState([]);
  const [localTrack, setLocalTrack] = useState(null);

  useEffect(() => {
    const sync = () => {
      setConnected(room.state === 'connected');
      setRemoteParticipants(Array.from(room.remoteParticipants.values()).map((p) => p.name || p.identity));
    };
    room.on('connected', sync);
    room.on('disconnected', sync);
    room.on('participantConnected', sync);
    room.on('participantDisconnected', sync);
    return () => {
      room.removeAllListeners();
      room.disconnect();
      localTrack?.stop();
    };
  }, [room, localTrack]);

  const connect = useCallback(async (token) => {
    if (!config.livekitUrl) throw new Error('LiveKit URL is not configured');
    if (room.state !== 'connected') await room.connect(config.livekitUrl, token, { autoSubscribe: true });
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
    await room.disconnect();
    setConnected(false);
  }, [localTrack, room]);

  return { room, connected, micEnabled, remoteParticipants, connect, publishMicrophone, toggleMicrophone, disconnect };
}

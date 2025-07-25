"use client";

import AudioVisualizer from "@/feature/room/components/AudioVisualizer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRoom } from "@/store/context/RoomContext";
import { Check, Copy, Mic, MicOff, Send } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const iceServers = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
  { urls: "stun:stun2.l.google.com:19302" },
  { urls: "stun:stun3.l.google.com:19302" },
  { urls: "stun:stun4.l.google.com:19302" },
  {
    urls: "turn:numb.viagenie.ca",
    credential: "muazkh",
    username: "webrtc@live.com",
  },
  {
    urls: "turn:turn.anyfirewall.com:443?transport=tcp",
    credential: "webrtc",
    username: "webrtc",
  },
];

interface User {
  userName: string;
  name: string;
  imageUrl: string;
  isConnected: boolean;
}

interface Message {
  type: "system" | "user";
  userName?: string;
  name?: string;
  message: string;
  timestamp?: string;
}

interface WebSocketMessage {
  type:
    | "welcome"
    | "user_joined"
    | "user_left"
    | "message"
    | "error"
    | "room_created"
    | "voice_ready"
    | "offer"
    | "answer"
    | "ice-candidate"
    | "audio_chunk"
    | "recording_started"
    | "recording_stopped"
    | "recordings_ready";
  userName?: string;
  roomId?: string;
  message?: string;
  users?: User[];
  timestamp?: string;
  offer?: RTCSessionDescriptionInit;
  answer?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
  targetPeer?: string;
  audioData?: string;
  name?: string;
  startTime?: number;
  recordings?: Array<{
    userName: string;
    downloadUrl: string;
    startTime: number;
    duration: number;
  }>;
}

export default function RoomUI({
  roomId,
  roomNumberId,
}: {
  roomId: string;
  roomNumberId: number;
}) {
  const [copied, setCopied] = useState(false);
  const session = useSession();
  const { roomName, numberOfParticipants, isRoomCreating } = useRoom();
  const isCreating = isRoomCreating ?? false;
  const wsRef = useRef<WebSocket | null>(null);
  const wsProtocol = window.location.protocol === "https:" ? "wss:" : "wss:";
  const wsPort = process.env.NEXT_PUBLIC_WS_PORT;
  const wsHost = process.env.NEXT_PUBLIC_WS_HOST;
  const socket = new WebSocket(`${wsProtocol}//${wsHost}:${wsPort}`);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingStartTimeRef = useRef<number>(0);
  const [isRecording, setIsRecording] = useState(false);
  const remoteStreamsRef = useRef<Map<string, MediaStream>>(new Map());
  const [isMuted, setIsMuted] = useState(false);
  const [messageInput, setMessageInput] = useState<string>("");
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const initiatedConnectionsRef = useRef<Set<string>>(new Set());
  const [recordings, setRecordings] = useState<
    Array<{
      userName: string;
      downloadUrl: string;
      startTime: number;
      duration: number;
    }>
  >([]);
  const createPeerConnection = useCallback(
    (peerId: string): RTCPeerConnection => {
      console.log("Creating peer connection for:", peerId);
      const peerConnection = new RTCPeerConnection({
        iceServers: iceServers,
        iceTransportPolicy: "all",
        iceCandidatePoolSize: 10,
      });

      if (localStreamRef.current) {
        console.log("Adding local tracks to peer connection for:", peerId);
        localStreamRef.current.getTracks().forEach((track) => {
          if (localStreamRef.current) {
            console.log(`Adding ${track.kind} track to peer connection`);
            peerConnection.addTrack(track, localStreamRef.current);
          }
        });
      }

      peerConnection.onicecandidate = (event) => {
        if (event.candidate && wsRef.current?.readyState === WebSocket.OPEN) {
          console.log("Sending ICE candidate to:", peerId, event.candidate);
          wsRef.current.send(
            JSON.stringify({
              type: "ice-candidate",
              roomId,
              candidate: event.candidate.toJSON(),
              targetPeer: peerId,
              userName: session.data?.user.email,
              name: session.data?.user.name,

              imageUrl: session.data?.user.image,
              id: session.data?.user.id,
              roomNumberId: roomNumberId,
            })
          );
        }
      };

      peerConnection.onconnectionstatechange = () => {
        console.log(
          `Connection state with ${peerId}:`,
          peerConnection.connectionState
        );
        if (peerConnection.connectionState === "failed") {
          console.log("Connection failed, attempting to restart");
          peerConnection.restartIce();
        }
      };

      peerConnection.oniceconnectionstatechange = () => {
        console.log(
          `ICE connection state with ${peerId}:`,
          peerConnection.iceConnectionState
        );

        if (peerConnection.iceConnectionState === "failed") {
          console.log("ICE connection failed, attempting to restart");
          peerConnection.restartIce();
        }
      };

      peerConnection.onicegatheringstatechange = () => {
        console.log(
          `ICE gathering state with ${peerId}:`,
          peerConnection.iceGatheringState
        );
      };

      peerConnection.ontrack = (event) => {
        console.log(
          "Received remote track from:",
          peerId,
          "kind:",
          event.track.kind
        );

        const [remoteStream] = event.streams;
        if (remoteStream) {
          console.log("Setting remote stream for:", peerId);
          remoteStreamsRef.current.set(peerId, remoteStream);
          // const videoElement = document.getElementById(
          //   `video-${peerId}`
          // ) as HTMLVideoElement;
          // if (videoElement) {
          //   videoElement.srcObject = remoteStream;
          //   videoElement
          //     .play()
          //     .catch((e) => console.error("Error playing remote video:", e));
          // }

          const audioElement = document.getElementById(
            `audio-${peerId}`
          ) as HTMLAudioElement;
          if (audioElement) {
            // Only set srcObject if it's different from current
            if (audioElement.srcObject !== remoteStream) {
              audioElement.srcObject = remoteStream;

              // Wait for loadedmetadata before playing
              audioElement.addEventListener(
                "loadedmetadata",
                () => {
                  audioElement
                    .play()
                    .catch((e) =>
                      console.error("Error playing remote audio:", e)
                    );
                },
                { once: true }
              );
            }
          }
        }
      };

      return peerConnection;
    },
    [roomId, session.data?.user.email]
  );

  useEffect(() => {
    wsRef.current = socket;
    setWs(socket);
    console.log(`${wsProtocol}//${wsHost}:${wsPort}`);
    console.log("ws:   " + socket.url);
    socket.onopen = () => {
      console.log("Websocket Connected");

      const message = {
        type: isCreating ? "create_room" : "join_room",
        roomId: roomId,
        userName: session.data?.user.email,
        name: session.data?.user.name,

        imageUrl: session.data?.user.image,
        id: session.data?.user.id,
        roomNumberId: roomNumberId,
      };
      socket.send(JSON.stringify(message));
      initializeWebRTC();
    };

    socket.onmessage = async (event) => {
      const data: WebSocketMessage = JSON.parse(event.data);
      console.log("Recieved message:", data);
      switch (data.type) {
        case "welcome":
        case "room_created":
          if (data.users) {
            setUsers(data.users);
            if (wsRef.current?.readyState === WebSocket.OPEN) {
              wsRef.current.send(
                JSON.stringify({
                  type: "start_recording",
                  roomId,
                  userName: session.data?.user.email,
                  name: session.data?.user.name,
                  imageUrl: session.data?.user.image,
                  id: session.data?.user.id,
                  roomNumberId: roomNumberId,
                })
              );
            }
          }
          break;
        case "user_joined":
        case "user_left":
          if (data.users) {
            setUsers(data.users);
          }
          break;
        case "message":
          setMessages((prev) => [
            ...prev,
            {
              type: "user",
              userName: data.userName,
              message: data.message || "",
              imageUrl: session.data?.user.image,
              name: data.name,

              id: session.data?.user.id,
              roomNumberId: roomNumberId,
              timestamp: data.timestamp,
            },
          ]);
          break;
        case "voice_ready":
          if (
            data.userName &&
            data.userName != session.data?.user.email &&
            localStreamRef.current
          ) {
            console.log("Peer is ready for voice chat: ", data.userName);
            if (
              !initiatedConnectionsRef.current.has(data.userName) &&
              !peerConnectionsRef.current.has(data.userName)
            ) {
              initiatedConnectionsRef.current.add(data.userName);

              const peerConnection = createPeerConnection(data.userName);
              peerConnectionsRef.current.set(data.userName, peerConnection);

              try {
                console.log("creating offer for:", data.userName);
                const offer = await peerConnection.createOffer({
                  offerToReceiveAudio: true,
                });

                await peerConnection.setLocalDescription(offer);
                if (wsRef.current?.readyState === WebSocket.OPEN) {
                  wsRef.current.send(
                    JSON.stringify({
                      type: "offer",
                      roomId,
                      offer: offer,
                      targetPeer: data.userName,
                      userName: session.data?.user.email,
                      imageUrl: session.data?.user.image,
                      id: session.data?.user.id,
                      roomNumberId: roomNumberId,
                      name: session.data?.user.name,
                    })
                  );
                }
              } catch (error) {
                console.log("Error creating offer: ", error);
              }
            }
          }
          break;
        case "offer":
          if (
            data.userName &&
            data.userName != session.data?.user.email &&
            data.offer
          ) {
            console.log("Recieved offer from:", data.userName);
            let peerConnection = peerConnectionsRef.current.get(data.userName);
            if (!peerConnection) {
              peerConnection = createPeerConnection(data.userName);
              peerConnectionsRef.current.set(data.userName, peerConnection);
            }

            try {
              await peerConnection.setRemoteDescription(
                new RTCSessionDescription(data.offer)
              );
              const answer = await peerConnection.createAnswer();
              await peerConnection.setLocalDescription(answer);
              if (wsRef.current?.readyState === WebSocket.OPEN) {
                wsRef.current.send(
                  JSON.stringify({
                    type: "answer",
                    roomId,
                    answer: answer,
                    targetPeer: data.userName,
                    userName: session.data?.user.email,
                    imageUrl: session.data?.user.image,
                    id: session.data?.user.id,
                    roomNumberId: roomNumberId,
                    name: session.data?.user.name,
                  })
                );
              }
            } catch (error) {
              console.error("Error handling offer:", error);
            }
          }
          break;
        case "answer":
          if (
            data.userName &&
            data.userName !== session.data?.user.email &&
            data.answer
          ) {
            console.log("Received answer from:", data.userName);
            const peerConnection = peerConnectionsRef.current.get(
              data.userName
            );
            if (peerConnection) {
              try {
                await peerConnection.setRemoteDescription(
                  new RTCSessionDescription(data.answer)
                );
              } catch (error) {
                console.error("Error handling answer:", error);
              }
            }
          }
          break;
        case "ice-candidate":
          if (
            data.userName &&
            data.userName !== session.data?.user.email &&
            data.candidate
          ) {
            console.log("Recived ICE candidate from:", data.userName);
            const peerConnection = peerConnectionsRef.current.get(
              data.userName
            );
            if (peerConnection) {
              try {
                await peerConnection.addIceCandidate(
                  new RTCIceCandidate(data.candidate)
                );
              } catch (error) {
                console.log("Error adding ICE candidate:", error);
              }
            }
          }
          break;
        case "recording_started":
          if (data.userName !== session.data?.user.email && !isRecording) {
            console.log("Starting recording for joined user");
            startRecording();
          }
          break;
        case "recording_stopped":
          if (data.userName !== session.data?.user.email && isRecording) {
            console.log("Stopping recording for joined user");
            stopRecording();
          }
          break;
        case "recordings_ready":
          if (data.recordings) {
            setRecordings(data.recordings);
            console.log("Recordings ready:", data.recordings);
          }
          break;
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      console.log("Cleaning up Room component...");

      if (isRecording) {
        stopRecording();
      }

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          console.log("Stopping track:", track.kind);
          track.stop();
        });
        localStreamRef.current = null;
      }

      peerConnectionsRef.current.forEach((pc, peerId) => {
        console.log("Closing peer connection for:", peerId);
        pc.close();
      });

      peerConnectionsRef.current.clear();
      remoteStreamsRef.current.clear();

      initiatedConnectionsRef.current.clear();
    };
  }, [roomId, session.data?.user.email, isCreating, createPeerConnection]);

  const initializeWebRTC = async () => {
    try {
      console.log("Requesting media devices....");

      let constraints = { audio: true };
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (videoError) {
        toast("Unable to open the Camera");
        constraints = { audio: true };
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      }

      console.log(
        "Media stream obtained:",
        stream.getTracks().map((t) => `${t.kind}: ${t.label}`)
      );
      localStreamRef.current = stream;
      setIsVoiceEnabled(true);
      if (stream.getAudioTracks().length > 0) {
        const audioTrack = stream.getAudioTracks()[0];
        const audioStream = new MediaStream([audioTrack]);
        const mediaRecorder = new MediaRecorder(audioStream, {
          mimeType: "audio/webm;codecs=opus",
        });
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
            if (wsRef.current?.readyState === WebSocket.OPEN) {
              const reader = new FileReader();
              reader.onloadend = () => {
                const base64Data = reader.result as string;
                wsRef.current?.send(
                  JSON.stringify({
                    type: "audio_chunk",
                    roomId,
                    userName: session.data?.user.email,
                    audioData: base64Data,
                    timestamp: Date.now() - recordingStartTimeRef.current,
                    imageUrl: session.data?.user.image,
                    id: session.data?.user.id,
                    roomNumberId: roomNumberId,
                    name: session.data?.user.name,
                  })
                );
              };
              reader.readAsDataURL(event.data);
            }
          }
        };

        startRecording();
      }

      peerConnectionsRef.current.forEach((pc, peerId) => {
        console.log("Adding tracks to existing peer connection: ", peerId);
        stream.getTracks().forEach((track) => {
          pc.addTrack(track, stream);
        });
      });

      console.log(session);

      if (wsRef.current?.readyState === WebSocket.OPEN) {
        console.log("Sending voice_ready message");
        wsRef.current.send(
          JSON.stringify({
            type: "voice_ready",
            roomId,
            userName: session.data?.user.email as string,
            imageUrl: session.data?.user.image,
            id: session.data?.user.id,
            roomNumberId: roomNumberId,
            name: session.data?.user.name,
          })
        );
      }
    } catch (error) {
      console.error("Error accessing media devices:", error);
      setIsVoiceEnabled(false);
      toast("Could not access camera/microphone. Please check permissions.");
    }
  };

  const startRecording = () => {
    if (mediaRecorderRef.current && !isRecording) {
      console.log("Starting audio recording");
      recordingStartTimeRef.current = Date.now();
      audioChunksRef.current = [];
      mediaRecorderRef.current.start(1000);
      setIsRecording(true);
    }

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "recording_started",
          roomId,
          userName: session.data?.user.email,
          startTime: recordingStartTimeRef.current,
          imageUrl: session.data?.user.image,
          id: session.data?.user.id,
          roomNumberId: roomNumberId,
          name: session.data?.user.name,
        })
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      console.log("Stopping audio recording");
      const finalDataPromise = new Promise<void>((resolve) => {
        if (mediaRecorderRef.current) {
          mediaRecorderRef.current.onstop = () => {
            console.log("MediaRecorder stopped, sending final chunks");
            audioChunksRef.current.forEach((chunk) => {
              if (wsRef.current?.readyState === WebSocket.OPEN) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  const base64Data = reader.result as string;
                  wsRef.current?.send(
                    JSON.stringify({
                      type: "audio_chunk",
                      roomId,
                      userName: session.data?.user.email,
                      audioData: base64Data,
                      timestamp: Date.now() - recordingStartTimeRef.current,
                      imageUrl: session.data?.user.image,
                      id: session.data?.user.id,
                      roomNumberId: roomNumberId,
                      name: session.data?.user.name,
                    })
                  );
                };
                reader.readAsDataURL(chunk);
              }
            });
            resolve();
          };
        } else {
          resolve();
        }
      });

      mediaRecorderRef.current.stop();
      setIsRecording(false);
      finalDataPromise.then(() => {
        console.log("Sending recording_stopped message");

        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(
            JSON.stringify({
              type: "recording_stopped",
              roomId,
              userName: session.data?.user.email,
              imageUrl: session.data?.user.image,
              id: session.data?.user.id,
              roomNumberId: roomNumberId,
              name: session.data?.user.name,
            })
          );
        }
      });
    }
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
      console.log("Audio", isMuted ? "unmuted" : "muted");
    }
  };

  const sendMessage = () => {
    if (messageInput.trim() && wsRef.current?.readyState === WebSocket.OPEN) {
      const message = {
        type: "message",
        roomId,
        userName: session.data?.user.email,
        message: messageInput.trim(),
        timestamp: new Date().toISOString(),
        imageUrl: session.data?.user.image,
        id: session.data?.user.id,
        name: session.data?.user.name,

        roomNumberId: roomNumberId,
      };
      wsRef.current.send(JSON.stringify(message));
      setMessageInput("");
    }
  };

  const handleLeaveRoom = () => {
    console.log("Leaving room, stopping recording");
    stopRecording();
    setTimeout(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: "leave_room",
            roomId,
            userName: session.data?.user.email,
            imageUrl: session.data?.user.image,
            id: session.data?.user.id,
            roomNumberId: roomNumberId,
            name: session.data?.user.name,
          })
        );
      }
      router.push("/");
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const UserCard = ({ user }: { user: User }) => {
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
      const checkForStream = () => {
        const stream = remoteStreamsRef.current.get(user.userName);
        if (stream && stream !== remoteStream) {
          setRemoteStream(stream);

          if (audioRef.current && audioRef.current.srcObject !== stream) {
            audioRef.current.srcObject = stream;
            audioRef.current
              .play()
              .catch((e) => console.error("Error playing remote audio:", e));
          }
        }
      };

      checkForStream();

      const interval = setInterval(checkForStream, 2000);

      return () => clearInterval(interval);
    }, [user.userName]); // Remove 'users' dependency

    return (
      <Card className={`relative rounded-3xl bg-neutral-900`}>
        <CardContent className="p-1">
          <div className="flex flex-row items-center space-y-1 gap-5 justify-center">
            <div className="relative">
              <Avatar className="w-20 h-20 border-2 border-white">
                <AvatarImage src={user.imageUrl} />
                <AvatarFallback className="text-lg">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <audio
                ref={audioRef}
                autoPlay
                playsInline
                style={{ display: "none" }}
              />
            </div>
            <div className=" flex flex-col gap-2 justify-center items-center align-middle">
              <AudioVisualizer
                classname={
                  user.userName == session.data?.user.email ? "hidden" : ""
                }
                audioStream={remoteStream}
                colors={["#dc7702", "#dc7702", "#dc7702", "#dc7702", "#dc7702"]}
                height={30}
              />
              <div className="text-center">
                <p className=" text-xl truncate w-full">{user.name}</p>
              </div>
              <div className="w-full"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="w-screen h-screen bg-black">
      <div className="flex flex-col p-3 gap-3">
        <Card className="bg-[linear-gradient(to_bottom,_#1c1c1c,_#1c1c1c,_#1b3784)] border-none">
          <div className="px-5">
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-row gap-2 lg:gap-4 items-center">
                <div className="text-md lg:text-2xl truncate">{roomName}</div>
                <Card className="py-2 px-5 flex flex-row items-center gap-2">
                  <div>Room ID: {roomId}</div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCopy}
                          className="h-8 w-8 p-0"
                        >
                          {copied ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{copied ? "Copied!" : "Copy Room ID"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Card>
              </div>

              <div className="flex flex-row gap-2 lg:gap-3 items-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleMute}
                        className={`h-9 w-9 lg:h-13 lg:w-13 p-0 border-white border-2 ${
                          isMuted ? "bg-red-100  border-red-300" : ""
                        }`}
                      >
                        {isMuted ? (
                          <MicOff className="w-3 h-3 lg:h-5 lg:w-5 text-red-600" />
                        ) : (
                          <Mic className="w-3 h-3 lg:h-5 lg:w-5" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {isMuted ? "Turn off microphone" : "Turn on microphone"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Button
                  onClick={handleLeaveRoom}
                  className="bg-red-700 text-white lg:py-6"
                >
                  Leave Room
                </Button>
              </div>
            </div>
          </div>
        </Card>
        <div className="flex flex-col lg:flex-row gap-3">
          <Card className="lg:flex-2 lg:min-h-[550px] bg-zinc-900 border-none">
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Participants ({users.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-4">
                  {users.map((user) => (
                    <UserCard key={user.userName} user={user} />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="flex-1">
            <Card className="lg:h-[550px] flex flex-col bg-zinc-900 border-none">
              <CardContent className="p-4 flex flex-col h-full">
                <ScrollArea className="flex-1 mb-4 p-2">
                  <div className="space-y-2">
                    {messages.map((msg, index) => (
                      <div key={index} className="mb-2">
                        {msg.type === "system" ? (
                          <p className="text-sm text-muted-foreground italic">
                            {msg.message}
                          </p>
                        ) : (
                          <div>
                            <span
                              className={`font-semibold ${
                                msg.userName === session.data?.user.email
                                  ? "text-zinc-50"
                                  : "text-zinc-500"
                              }`}
                            >
                              {msg.name}:
                            </span>
                            <span className="ml-2">{msg.message}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="flex gap-2">
                  <Input
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1"
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!messageInput.trim()}
                    size="sm"
                    className="px-3"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

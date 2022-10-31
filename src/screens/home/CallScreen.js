import React, { useEffect, useState, useCallback, useRef, useContext } from 'react';
import {
  View, StyleSheet, Alert, Dimensions,
  TouchableOpacity,
  Image, Text
} from 'react-native';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native-paper';
import IconCamera from "react-native-vector-icons/Ionicons";

import { useFocusEffect } from '@react-navigation/native';
import Icon from "react-native-vector-icons/MaterialIcons";

import InCallManager from 'react-native-incall-manager';
import Modal from 'react-native-modal';

import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
  registerGlobals,
} from 'react-native-webrtc';
import UserContext from '../../contexts/UserContext';
import { COLORS } from '../../contants';
import { config } from '../../contants/config';
import { RelativeTimeFormat } from 'intl';
// import {acc} from 'react-native-reanimated';

const STUN_SERVER = 'stun:stun.l.google.com:19302';
const SOCKET_URL = 'ws://192.168.100.156:8080';

export default function VideoScreen({ navigation, ...props }) {
  const { user } = useContext(UserContext);
  const { appointment } = props.route.params;
  const [userId, setUserId] = useState(user._id);
  const [socketActive, setSocketActive] = useState(false);
  const [mic, setMic] = useState(false);
  const [isFront, setIsFront] = useState(true);
  const [calling, setCalling] = useState(false);
  const [localStream, setLocalStream] = useState({ toURL: () => null });
  const [remoteStream, setRemoteStream] = useState({ toURL: () => null });

  const conn = useRef(new WebSocket(SOCKET_URL));

  const yourConn = useRef(
    new RTCPeerConnection({
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302',
        }, {
          urls: 'stun:stun1.l.google.com:19302',
        }, {
          urls: 'stun:stun2.l.google.com:19302',
        }
      ],
    }),
  );

  const [callActive, setCallActive] = useState(false);
  const [incomingCall, setIncomingCall] = useState(false);
  const [otherId, setOtherId] = useState('');
  const [callToUsername, setCallToUsername] = useState(appointment?.user?._id);
  const connectedUser = useRef(null);
  const offerRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      if (user) {
        setUserId(user._id);
      } else {
        setUserId('');
        navigation.goBack();
      }
    }, [userId]),
  );

  // useEffect(() => {
  //   navigation.setOptions({
  //     title: 'Your ID - ' + userId,
  //     headerRight: () => (
  //       <Button mode="text" onPress={onLogout} style={{ paddingRight: 10 }}>
  //         Logout
  //       </Button>
  //     ),
  //   });
  // }, [userId]);

  /**
   * Calling Stuff
   */

  useEffect(() => {
    if (socketActive && userId.length > 0) {
      try {
        // InCallManager.start({media: 'audio'});
        // InCallManager.setForceSpeakerphoneOn(true);
        // InCallManager.setSpeakerphoneOn(true);
      } catch (err) {
        console.log('InApp Caller ---------------------->', err);
      }

      send({
        type: 'login',
        name: userId,
      });
    }
  }, [socketActive, userId]);

  const onLogin = () => { };

  useEffect(() => {
    /**
     *
     * Sockets Signalling
     */
    conn.current.onopen = () => {
      console.log('Connected to the signaling server');
      setSocketActive(true);
    };
    //when we got a message from a signaling server
    conn.current.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      // console.log('Data --------------------->', data);
      switch (data.type) {
        case 'login':
          console.log('Login');
          onCall();
          break;
        //when somebody wants to call us
        case 'offer':
          handleOffer(data.offer, data.name);
          console.log('Offer');
          break;
        case 'answer':
          handleAnswer(data.answer);
          console.log('Answer');
          break;
        //when a remote peer sends an ice candidate to us
        case 'candidate':
          handleCandidate(data.candidate);
          console.log('Candidate');
          break;
        case 'leave':
          leaveCall();
          console.log('Leave');
          break;
        default:
          break;
      }
    };
    conn.current.onerror = function (err) {
      console.log('Got error', err);
    };
    initLocalVideo();
    registerPeerEvents();
  }, []);

  useEffect(() => {
    if (!callActive) {
      // InCallManager.stop();
    } else {
      // InCallManager.setSpeakerphoneOn(true);
    }
  }, [callActive]);

  const registerPeerEvents = () => {
    yourConn.current.onaddstream = (event) => {
      console.log('On Add Remote Stream');
      setRemoteStream(event.stream);
    };

    // Setup ice handling
    yourConn.current.onicecandidate = (event) => {
      if (event.candidate) {
        send({
          type: 'candidate',
          candidate: event.candidate,
        });
      }
    };
  };

  const initLocalVideo = () => {
    // let isFront = false;
    // mediaDevices.enumerateDevices().then(sourceInfos => {
    //   let videoSourceId;
    //   for (let i = 0; i < sourceInfos.length; i++) {
    //     const sourceInfo = sourceInfos[i];
    //     if (
    //       sourceInfo.kind == 'videoinput' &&
    //       sourceInfo.facing == (isFront ? 'front' : 'environment')
    //     ) {
    //       videoSourceId = sourceInfo.deviceId;
    //     }
    //   }
    mediaDevices
      .getUserMedia({
        audio: true,
        video: {
          mandatory: {
            minWidth: 500, // Provide your own width, height and frame rate here
            minHeight: 300,
            minFrameRate: 30,
          },
          facingMode: 'user',
          // optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
        },
      })
      .then((stream) => {
        // Got stream!
        setLocalStream(stream);

        // setup stream listening
        yourConn.current.addStream(stream);
      })
      .catch((error) => {
        // Log error
      });
    // });
  };

  const send = (message) => {
    //attach the other peer username to our messages
    if (connectedUser.current) {
      message.name = connectedUser.current;
      // console.log('Connected iser in end----------', message);
    }
    console.log('Message', message);
    conn.current.send(JSON.stringify(message));
  };

  const onCall = () => {
    sendCall(callToUsername);
    setTimeout(() => {
      sendCall(callToUsername);
    }, 1000);
  };

  const sendCall = (receiverId) => {
    setCalling(true);
    const otherUser = receiverId;
    connectedUser.current = otherUser;
    console.log('Caling to', otherUser);
    // create an offer
    yourConn.current.createOffer().then((offer) => {
      yourConn.current.setLocalDescription(offer).then(() => {
        console.log('Sending Ofer');
        // console.log(offer);
        send({
          type: 'offer',
          offer: offer,
        });
        // Send pc.localDescription to peer
      });
    });
  };

  const micPhone = () => {
    InCallManager.setSpeakerphoneOn(!mic);
    setMic(!mic);
  };

  const switchCamera = () => {
    setIsFront(!isFront);
    localStream.getVideoTracks().forEach((track) => {
      console.log('sc', track);
      track._switchCamera();
    });
  };

  //when somebody sends us an offer
  const handleOffer = async (offer, name) => {
    console.log(name + ' is calling you.');
    connectedUser.current = name;
    offerRef.current = { name, offer };
    setIncomingCall(true);
    setOtherId(name);
    // acceptCall();
    if (callActive) acceptCall();
  };

  const acceptCall = async () => {
    const name = offerRef.current.name;
    const offer = offerRef.current.offer;
    setIncomingCall(false);
    setCallActive(true);
    console.log('Accepting CALL', name, offer);
    yourConn.current
      .setRemoteDescription(offer)
      .then(function () {
        connectedUser.current = name;
        return yourConn.current.createAnswer();
      })
      .then(function (answer) {
        yourConn.current.setLocalDescription(answer);
        send({
          type: 'answer',
          answer: answer,
        });
      })
      .then(function () {
        // Send the answer to the remote peer using the signaling server
      })
      .catch((err) => {
        console.log('Error acessing camera', err);
      });

    // try {
    //   await yourConn.setRemoteDescription(new RTCSessionDescription(offer));

    //   const answer = await yourConn.createAnswer();

    //   await yourConn.setLocalDescription(answer);
    //   send({
    //     type: 'answer',
    //     answer: answer,
    //   });
    // } catch (err) {
    //   console.log('Offerr Error', err);
    // }
  };

  //when we got an answer from a remote user
  const handleAnswer = (answer) => {
    setCalling(false);
    setCallActive(true);
    yourConn.current.setRemoteDescription(new RTCSessionDescription(answer));
  };

  //when we got an ice candidate from a remote user
  const handleCandidate = (candidate) => {
    setCalling(false);
    // console.log('Candidate ----------------->', candidate);
    yourConn.current.addIceCandidate(new RTCIceCandidate(candidate));
  };

  //hang up
  // const hangUp = () => {
  //   send({
  //     type: 'leave',
  //   });

  //   handleLeave();
  // };

  // const handleLeave = () => {
  //   connectedUser.current = null;
  //   setRemoteStream({toURL: () => null});

  //   // yourConn.close();
  //   // yourConn.onicecandidate = null;
  //   // yourConn.onaddstream = null;
  // };

  const onLogout = () => {
    // hangUp();

    handleLeave();

    AsyncStorage.removeItem('userId').then((res) => {
      props.navigation.navigate('LoginScreen');
    });
  };

  const rejectCall = async () => {
    send({
      type: 'leave',
    });
    // ``;
    // setOffer(null);

    // handleLeave();
  };

  const leaveCall = () => {

    setCalling(false);
    setIncomingCall(false);
    setCallActive(false);
    offerRef.current = null;
    connectedUser.current = null;
    setRemoteStream(null);
    setLocalStream(null);
    yourConn.current.onicecandidate = null;
    yourConn.current.ontrack = null;

    resetPeer();
    initLocalVideo();
    navigation.goBack();
  };

  const handleLeave = () => {
    send({
      name: userId,
      otherName: otherId,
      type: 'leave',
    });

    setCalling(false);
    setIncomingCall(false);
    setCallActive(false);
    offerRef.current = null;
    connectedUser.current = null;
    setRemoteStream(null);
    setLocalStream(null);
    yourConn.current.onicecandidate = null;
    yourConn.current.ontrack = null;

    resetPeer();
    initLocalVideo();
    navigation.goBack();
  };

  const resetPeer = () => {
    yourConn.current = new RTCPeerConnection({
      iceServers: [
        {
          urls: STUN_SERVER,
        },
      ],
    });

    registerPeerEvents();
  };

  /**
   * Calling Stuff Ends
   */

  return (

    <>
      <RTCView
        streamURL={localStream ? localStream.toURL() : ''}
        style={styles.stream}
        objectFit="cover"
        mirror
      />
      {localStream && (
        <RTCView
          streamURL={remoteStream ? remoteStream.toURL() : ''}
          style={{ right: 0, position: 'relative' }}
          objectFit="cover"
          mirror
        />
      )}
      {/* {!callActive && (
        <Image
          style={styles.stream}
          source={{
            uri: `${config.app.api_url}/laboratories/images/${appointment.laboratory
              ? appointment.laboratory.image
              : appointment.expert.image
              }`
          }}
          objectFit="cover"
        />
      )} */}

      <View
        style={{
          position: "absolute",
          alignSelf: "flex-start",
          justifyContent: "center",
          margin: 15
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-evenly",
            alignSelf: "center",
          }}
        >
          <TouchableOpacity
            style={{
              paddingHorizontal: 12,
              paddingVertical: 12,
              backgroundColor: socketActive ? '#00FF00' : '#eaf0f0',
              borderRadius: 36,
              alignItems: "center",
              top: 0,
            }}
          >
            {/* <IconCamera
name="ios-mic-outline"
size={20}
color={COLORS.primary}
/> */}
            <IconCamera
              name="ios-power"
              size={6}
              color={COLORS.primary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              alignItems: "flex-end",
              left: 10
            }}
          >
            {/* <IconCamera
name="ios-mic-outline"
size={20}
color={COLORS.primary}
/> */}
            <Text styles={{
              fontSize: 25,
              color: '#fff',
              fontWeight: 'bold'
            }}>
              {callActive ? appointment.laboratory
                ? appointment.laboratory.name
                : appointment.expert.name : 'In Call...'}
            </Text>
          </TouchableOpacity>


        </View>
      </View>

      <View
        style={{
          position: "absolute",
          right: width * 0.16,
          top: height * 0.8,
          alignSelf: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-evenly",
            alignSelf: "center",
          }}
        >
          <TouchableOpacity
            style={{
              paddingHorizontal: 12,
              paddingVertical: 12,
              backgroundColor: "#eaf0f0",
              borderRadius: 36,
              alignItems: "center",
            }}
            onPress={micPhone}
          >
            {!mic && (<IconCamera
              name="ios-mic-outline"
              size={20}
              color={COLORS.primary}
            />)}
            {mic && (<IconCamera
              name="ios-mic-off-outline"
              size={20}
              color={COLORS.primary}
            />)}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleLeave}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 12,
              backgroundColor: "#841f27",
              borderRadius: 36,
              alignItems: "center",
              marginHorizontal: width * 0.14,
            }}
          >
            <Icon name="call-end" size={25} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              paddingHorizontal: 12,
              paddingVertical: 12,
              backgroundColor: "#eaf0f0",
              borderRadius: 36,
              alignItems: "center",
            }}
            onPress={switchCamera}
          >
            <IconCamera
              name="ios-camera-reverse-outline"
              size={20}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </View>

        <Modal isVisible={incomingCall && !callActive}>
          <View
            style={{
              backgroundColor: 'white',
              padding: 22,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 4,
              borderColor: 'rgba(0, 0, 0, 0.1)',
            }}>
            <Text>{otherId + ' is calling you'}</Text>

            <Button onPress={acceptCall}>Accept Call</Button>
            <Button title="Reject Call" onPress={handleLeave}>
              Reject Call
            </Button>
          </View>
        </Modal>
      </View>
      {/* <Button title={"End Call"} onPress={() => endCall()} /> */}
    </>
  );
}

const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

const styles = StyleSheet.create({
  stream: {
    flex: 1,
  },
  root: {
    backgroundColor: '#fff',
    flex: 1,
    padding: 20,
  },
  inputField: {
    marginBottom: 10,
    flexDirection: 'column',
  },
  videoContainer: {
    flex: 1,
    minHeight: 450,
  },
  videos: {
    width: '100%',
    flex: 1,
    position: 'relative',
    overflow: 'hidden',

    borderRadius: 6,
  },
  localVideos: {
    height: 100,
    marginBottom: 10,
  },
  remoteVideos: {
    height: 400,
  },
  localVideo: {
    backgroundColor: '#f2f2f2',
    height: '100%',
    width: '100%',
  },
  remoteVideo: {
    backgroundColor: '#f2f2f2',
    height: '100%',
    width: '100%',
  },
});

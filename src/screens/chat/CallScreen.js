import {
  Text,
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import AgoraUIKit from 'agora-rn-uikit';

const VideoCall = (props) => {
  const { appointment } = props.route.params;
  const navigation = useNavigation();
  let t1 = new Date(appointment?.range?.end);
  let t2 = new Date();
  let dif = Math.abs((t1.getTime() - t2.getTime()) / 1000);
  const [seconds, setSeconds] = useState(dif);
  const [videoCall, setVideoCall] = useState(true);
  const connectionData = {
      appId: 'd99539e459d744f8aa83aa1c8357bf4c',
    channel: appointment._id,
  };
  const rtcCallbacks = {
    EndCall: () => {
      setVideoCall(false)
      navigation.goBack()
    },
  };
  const handleEnd = () => {
    navigation.goBack();
  }

  useEffect(() => {
    if(seconds > 0){
      setTimeout(() => setSeconds(seconds - 1), 1000);
    }else{
      navigation.goBack();
    }
  }, [seconds]);

  return videoCall ? (
    <>
      <AgoraUIKit connectionData={connectionData} rtcCallbacks={rtcCallbacks} />
    </>
  ) : (
    <Text onPress={() => setVideoCall(true)}></Text>
  );
}

export default VideoCall;
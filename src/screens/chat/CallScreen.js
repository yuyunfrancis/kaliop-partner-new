import {
  Text,
} from "react-native";
import React, { useState } from 'react';
import AgoraUIKit from 'agora-rn-uikit';
import CountDown from "react-native-countdown-component";

const VideoCall = (props) => {
  const { appointment } = props.route.params;
  let t1 = new Date(appointment?.range?.start);
  let t2 = new Date(appointment?.range?.end);
  let dif = Math.abs((t1.getTime() - t2.getTime()) / 1000);
  const [seconds, setSeconds] = useState(dif);
  const [videoCall, setVideoCall] = useState(true);
  const connectionData = {
    appId: 'd99539e459d744f8aa83aa1c8357bf4c',
    channel: appointment._id,
  };
  const rtcCallbacks = {
    EndCall: () => navigation.goBack(),
  };
  const handleEnd = () => {
    navigation.goBack();
  }

  return videoCall ? (
    <>
      <CountDown
        until={seconds}
        //duration of countdown in seconds
        timetoShow={['H', 'M', 'S']}
        timeLabels={{ h: '', m: '', s: '' }}
        //formate to show
        onFinish={() => handleEnd()}
        //on Finish call
        onPress={() => console.log('hello')}
        //on Press call
        size={10}
        style={{ paddingHorizontal: 8, margin: 15 }}
      />
      <AgoraUIKit connectionData={connectionData} rtcCallbacks={rtcCallbacks} />
    </>
  ) : (
    <Text onPress={() => setVideoCall(true)}></Text>
  );
}

export default VideoCall;
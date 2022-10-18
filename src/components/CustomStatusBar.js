import React from 'react'
import { SafeAreaView, StatusBar, View } from 'react-native'

export default function CustomStatusBar ({ backgroundColor, ...props }) {
  return (
    <View style={[{ backgroundColor }]}>
      <SafeAreaView>
        <StatusBar backgroundColor={backgroundColor} {...props} />
      </SafeAreaView>
    </View>
  )
}

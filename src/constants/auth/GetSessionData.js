import AsyncStorage from "@react-native-async-storage/async-storage";

const getSessionData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('user');
    const localeValue = await AsyncStorage.getItem('locale');
    const user = jsonValue != null ? (JSON.parse(jsonValue)) : null;
    const locale = localeValue != null ? (JSON.parse(localeValue)) : null;
    return {user, locale};
  } catch (e) {
    console.log('get session data error', e)
  }
};

export default getSessionData;
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Dimensions,
  Alert,
  ScrollView,
  ImageBackground,
  FlatList,
  RefreshControl,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import Icons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

import StatusBar from '../../components/StatusBar';
import {COLORS} from '../../constants';
import {config} from '../../constants/config';
import useDataFetching from '../../hooks/useDataFetching';
import UserContext from '../../contexts/UserContext';

const ImageGallery = props => {
  const {profile, userType} = props.route.params;
  const {user} = useContext(UserContext);
  let deviceHeight = Dimensions.get('window').height;
  let deviceWidth = Dimensions.get('window').width;
  const [loadimage, setLoadImage] = useState(false);
  // const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);

  let url = '';
  // let galleries = [];
  if (userType) {
    url = `${config.app.api_url}/gallery/${profile._id}`;
  } else {
    url = `${config.app.api_url}/gallery/expert/${profile._id}`;
  }
  const [loading, error, galleries, fetchData] = useDataFetching(url);

  const navigation = useNavigation();

  useEffect(() => {
    const updateData = navigation.addListener('focus', () => {
      fetchData();
    });
    return updateData;
  }, [navigation]);

  const renderGallery = ({item}) => {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
        }}>
        <View
          style={{
            paddingHorizontal: 10,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 10,
            marginRight: 20,
            backgroundColor: '#fff',
            marginBottom: 20,
            borderRadius: 8,
          }}>
          <ImageBackground
            style={{
              width: 120,
              height: 120,
              paddingHorizontal: 8,
              paddingTop: 12,
            }}
            source={{
              uri: `${config.app.api_url}/gallery/gallery/${item?.image}`,
            }}>
            <View>
              <Text style={{fontWeight: '700'}}>{item.title}</Text>
            </View>
          </ImageBackground>
        </View>
      </View>
    );
  };

  return (
    <>
      <StatusBar title="Image Gallery" />
      <ScrollView
        style={{marginHorizontal: 10}}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchData} />
        }>
        <TouchableOpacity
          style={{marginTop: 15, marginBottom: 15}}
          onPress={() => navigation.navigate('AddImage', {userType, profile})}
          // disabled={loading || loadimage ? true : false}
        >
          <View
            style={{
              backgroundColor: COLORS.primaryLight,
              padding: 10,
              width: '100%',
              borderRadius: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icons
              name="ios-cloud-upload-outline"
              size={20}
              color={COLORS.primary}
              style={{marginRight: 10}}
            />
            <Text>Add Image</Text>
          </View>
        </TouchableOpacity>
        <View style={[styles.container, styles.horizontal]}></View>
        <View style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
          {/* {!loading && !loadimage && images && images.length ? (
            images.map((image, index) => (
              <TouchableOpacity key={index}>
                <Image
                  source={{
                    uri: `${config.app.api_url}/gallery/gallery/${image.image}`,
                  }}
                  style={{
                    height: deviceHeight / 3,
                    width: deviceWidth / 2 - 16,
                    borderRadius: 10,
                    margin: 2,
                  }}
                />
              </TouchableOpacity>
            ))
          ) : loading || loadimage ? (
            <View style={{ justifyContent: "center", flex: 1 }}>
              <Loader color={COLORS.primary} />
            </View>
          ) : (
            <View></View>
          )} */}

          <FlatList
            contentContainerStyle={{
              alignSelf: 'center',
              paddingVertical: 15,
              alignItems: 'center',
            }}
            data={galleries.data}
            numColumns={2}
            // keyExtractor={(item) => item._id}
            renderItem={renderGallery}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={fetchData} />
            }
          />
        </View>
      </ScrollView>
    </>
  );
};

export default ImageGallery;

const styles = StyleSheet.create({});

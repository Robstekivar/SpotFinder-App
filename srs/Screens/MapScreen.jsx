import React, { useState, useEffect } from "react";
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

import {
  Platform,
  Text,
  View,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  NativeModules,
} from "react-native";
import * as Location from "expo-location";
import { FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/core";
import {
  ref,
  getDatabase,
  get,
  child,
} from "firebase/database";

const { width, height } = Dimensions.get("window");
const { StatusBarManager } = NativeModules;
const STATUSBAR_HEIGHT = Platform.OS === "ios" ? 20 : StatusBarManager.HEIGHT;

const CARD_HEIGHT = 220;
const CARD_WIDTH = width * 0.8;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;
const GOOGLE_MAPS_APIKEY = "AIzaSyDgNRHxwhTneQqekqKpNoB06Ww75NLBCFg";

const MapScreen = () => {
  const [errorMsg, setErrorMsg] = useState(null);
  const [destination, setDestination] = useState(null);
  const [item, setItem] = useState([]);

  //fetches data from the database
  const fetchData = () => {
    const dbRef = ref(getDatabase());
    get(child(dbRef, "data"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          console.log("All data: ", snapshot.val());
          const notifications = Object.values(snapshot.val()); //Convert object of objects into array of objects
          setItem(notifications.sort((a, b) => (a.postId < b.postId ? 1 : -1)));
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const navigation = useNavigation();

  const [mapRegion, setMapRegion] = useState({
    latitude: 28.6448,
    longitude: 77.216721,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.040434,
  });

  const getUserLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setMapRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    console.log(location.coords.latitude, location.coords.longitude);
  };

  useEffect(() => {
    getUserLocation()
  }, []);

  //Card Animation
  let mapIndex = 0;
  let mapAnimation = new Animated.Value(0);

  useEffect(() => {
    mapAnimation.addListener(({ value }) => {
      let i = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
      if (i >= i.length) {
        i = i.length - 1;
      }
      if (i <= 0) {
        i = 0;
      }

      clearTimeout(regionTimeout);

      const regionTimeout = setTimeout(() => {
        if (mapIndex !== i) {
          mapIndex = i;

          const { latitude } = item[i];
          const { longitude } = item[i]
          _map.current.animateToRegion(
            {
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            },
            350
          );
        }
      }, 10);
    });
  });

  const onMarkerPress = (mapEventData) => {
    const markerID = mapEventData._targetInst.return.key;

    let x = markerID * CARD_WIDTH + markerID * 20;
    if (Platform.OS === "ios") {
      x = x - SPACING_FOR_CARD_INSET;
    }

    _scrollView.current.scrollTo({ x: x, y: 0, animated: true });
  };

  const interpolations = item.map((marker, i) => {
    const inputRange = [
      (i - 1) * CARD_WIDTH,
      i * CARD_WIDTH,
      (i + 1) * CARD_WIDTH,
    ];

    const scale = mapAnimation.interpolate({
      inputRange,
      outputRange: [1, 1.5, 1],
      extrapolate: "clamp",
    });

    return { scale };
  });

  const _map = React.useRef(null);
  const _scrollView = React.useRef(null);

  return (
    <View style={styles.container}>
      <MapView
        ref={_map}
        style={styles.map}
        region={mapRegion}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
      >
        <Marker coordinate={mapRegion} title="My location">
          <Animated.Image
            source={require("../../Images/location-pin.gif")}
            style={[styles.marker]}
            resizeMode="cover"
          />
        </Marker>

        <MapViewDirections
          origin={mapRegion}
          destination={destination}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={3}
          strokeColor="hotpink"
        />

        {item?.map((i, index) => {
          console.log(i.latitude)
          const scaleStyle = {
            transform: [
              {
                scale: interpolations[index].scale,
              },
            ],
          };

          return (
            <Marker
              coordinate={{
                longitude: i.longitude,
                latitude: i.latitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              key={index}
              title={i.title}
              onPress={(e) => onMarkerPress(e)}
            >
              <Animated.Image
                source={require("../../Images/map_marker.png")}
                style={[styles.marker, scaleStyle]}
                resizeMode="cover"
              />
            </Marker>
          );
        })}
      </MapView>

      <Animated.ScrollView
        ref={_scrollView}
        horizontal
        scrollEventThrottle={1}
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        pagingEnabled
        snapToInterval={CARD_WIDTH + 20}
        snapToAlignment={"center"}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  x: mapAnimation,
                },
              },
            },
          ],
          { useNativeDriver: true }
        )}
      >
        {item?.map((i, index) => {
          return (
            <TouchableOpacity style={styles.card} key={index}>
              <Image
                source={i.image}
                style={styles.cardImg}
                contentFit="fill"
              />

              <View style={styles.cardInfo}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={styles.cardTitle}>{i.title}</Text>
                  <View style={styles.starcontainer}>
                    {[0, 0, 0, 0, 0].map((el, index) => (
                      <FontAwesome
                        key={index}
                        style={styles.star}
                        name={index < Math.floor(i.rating) ? "star" : "star-o"}
                        size={18}
                        color={"#e47911"}
                      />
                    ))}
                    <Text style={styles.text}>{i.reviews}</Text>
                  </View>
                </View>

                <Text
                  numberOfLines={2}
                  style={[styles.cardDetails, { fontSize: 14, color: "blue" }]}
                >
                  {i.Available} spaces left
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("DetailsScreen", {
                      title: i.title,
                      review: i.reviews,
                      rating: i.rating,
                      image: i.image,
                      Available: i.Available,
                      longitude: i.longitude,
                      latitude: i.latitude,
                      description: i.description,
                      price: i.price,
                    });
                  }}
                  style={[
                    styles.btn,
                    {
                      borderColor: "#FF8C00",
                      borderWidth: 1,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.textBtn,
                      {
                        color: "#FF8C00",
                      },
                    ]}
                  >
                    See more
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        })}
      </Animated.ScrollView>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: STATUSBAR_HEIGHT
  },
  map: {
    width: "100%",
    height: "100%",
  },
  bubble: {
    flexDirection: "column",
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 6,
    borderColor: "#ccc",
    borderWidth: 0.5,
    padding: 15,
    width: 150,
    height: 200,
  },
  arrow: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderTopColor: "#fff",
    borderWidth: 16,
    alignSelf: "center",
    marginTop: -32,
  },
  arrowBorder: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderTopColor: "#007a87",
    borderWidth: 16,
    alignSelf: "center",
    marginTop: -0.5,
    // marginBottom: -15
  },
  name: {
    fontSize: 16,
    marginBottom: 5,
  },
  image: {
    width: "100%",
    height: "70%",
  },
  scrollView: {
    position: "absolute",
    bottom: 0,
    left: 10,
    right: 0,
    paddingVertical: 10,
  },
  cardImage: {
    flex: 0.3,
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  card: {
    display: "flex",
    // padding: 10,
    elevation: 2,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: "hidden",
  },
  cardImgWrapper: {
    flex: 1,
    width: 90,
    margin: 10,
  },
  cardImg: {
    height: "57%",
    width: "100%",
    alignSelf: "center",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardInfo: {
    flex: 2,
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
    backgroundColor: "#fff",
  },
  cardTitle: {
    fontWeight: "bold",
  },
  cardDetails: {
    fontSize: 12,
    color: "#444",
    marginBottom: 7,
  },
  starcontainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  star: {
    color: "#FF8C00",
  },
  text: {
    fontSize: 12,
    marginLeft: 5,
    color: "#444",
  },
  btn: {
    width: "100%",
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3,
  },
  textBtn: {
    fontSize: 14,
    fontWeight: "bold",
  },
  marker: {
    width: 30,
    height: 30,
    margin: 7,
  },
});
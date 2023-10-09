import React, { useState, useEffect } from "react";
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from "react-native-maps";
import MapViewDirections from 'react-native-maps-directions';
import {API_KEY} from '../services/GlobalApi'
import {
  Platform,
  Text,
  View,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome, Ionicons, Fontisto, Entypo } from "@expo/vector-icons";
import GlobalApi from "../services/GlobalApi";
import { Image } from "expo-image";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/core";
import {
  database,
  storage,
  reference,
  getDownloadURL,
  collection,
  db,
} from "../services/firebase";
import {
  ref,
  set,
  onValue,
  remove,
  getDatabase,
  get,
  child,
} from "firebase/database";
import { listAll } from "firebase/storage";


const { width, height } = Dimensions.get("window");

const CARD_HEIGHT = 220;
const CARD_WIDTH = width * 0.8;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;
const GOOGLE_MAPS_APIKEY = "AIzaSyDgNRHxwhTneQqekqKpNoB06Ww75NLBCFg";


const MapDirections = () => {
  const [errorMsg, setErrorMsg] = useState(null);

  //direction
  const route = useRoute();
   const { lat, long } = route.params;

   const [destination] = useState({
    latitude: lat,
    longitude: long,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.040434,
   });

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
    //getUserLocation();
  }, []);

  const _map = React.useRef(null);

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
        <Marker coordinate={destination} title="My location">
          <Animated.Image
            source={require("../../Images/map_marker.png")}
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
      </MapView>
    </View>
  );
};

export default MapDirections;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
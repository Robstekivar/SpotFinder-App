import React, { useState } from "react";
import {
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/core";

const DetailsScreen = () => {
  const [avgRating, setAvgRating] = useState(4);
  const navigation = useNavigation();
  const route = useRoute();
  const {
    title,
    Available,
    image,
    latitude,
    longitude,
    rating,
    reviews,
    description,
    price,
  } = route.params;

  onPress = () => {
    console.log(title);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        backgroundColor: "white",
        paddingBottom: 20,
      }}
    >
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="rgba(0,0,0,0)"
      />
      <ImageBackground style={style.headerImage} source={{ uri: image }}>
        <View style={style.header}>
          <MaterialIcons
            name="arrow-back-ios"
            size={28}
            color={"white"}
            onPress={navigation.goBack}
          />
        </View>
      </ImageBackground>
      <View>
        <TouchableOpacity
          style={style.iconContainer}
          onPress={() => {
            navigation.navigate("MapDirections", {
              long: longitude,
              lat: latitude,
            });
          }}
        >
          <MaterialIcons name="place" color={"white"} size={28} />
        </TouchableOpacity>
        <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>{title}</Text>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "400",
              color: "grey",
              marginTop: 5,
            }}
          ></Text>

          {/* star rating */}
          <View
            style={{
              marginTop: 10,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row" }}>
              {[0, 0, 0, 0, 0].map((el, i) => (
                <FontAwesome
                  key={/*`${id}-${i}`*/ i}
                  style={style.star}
                  name={i < Math.floor(rating) ? "star" : "star-o"}
                  size={18}
                  color={"#e47911"}
                />
              ))}
            </View>

            <Text style={{ fontSize: 13, color: "grey" }}>
              {reviews} reviews
            </Text>
          </View>

          <View style={{ marginTop: 20 }}>
            <Text style={{ lineHeight: 20, color: "grey" }}>{description}</Text>
          </View>
        </View>
        <View
          style={{
            marginTop: 20,
            flexDirection: "row",
            justifyContent: "space-between",
            paddingLeft: 20,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            Price start from
          </Text>
          <View style={style.priceTag}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: "white",
                marginLeft: 5,
              }}
            >
              R {price} per hour
            </Text>
          </View>
        </View>
        <TouchableOpacity style={style.btn} onPress={onPress}>
          <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
            Book
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const style = StyleSheet.create({
  btn: {
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    backgroundColor: "blue",
    marginHorizontal: 20,
    borderRadius: 10,
  },

  priceTag: {
    height: 40,
    alignItems: "center",
    marginLeft: 40,
    paddingLeft: 20,
    flex: 1,
    backgroundColor: "blue",
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    flexDirection: "row",
  },
  iconContainer: {
    position: "absolute",
    height: 60,
    width: 60,
    backgroundColor: "blue",
    top: -30,
    right: 20,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  headerImage: {
    height: 400,
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 40,
    overflow: "hidden",
  },
  header: {
    marginTop: 60,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    justifyContent: "space-between",
  },
  star: {
    margin: 2,
  },
});

export default DetailsScreen;

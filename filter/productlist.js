import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator
} from "react-native";

const numColumns = 2;
const screenWidth = Dimensions.get("window").width;
const itemWidth = (screenWidth - 48) / 2;
const defaultImage = require("../assets/snooplay_logo.png");


export default function ToyGrid({ toyData = [], onselectedProduct, onScroll,  onEndReached,isLoadingMore }) {
  const renderItem = ({ item }) => {
    const title = item.title || "";
    const imageUrl =
      item.images && item.images.length > 0 ? { uri: item.images[0].url } : defaultImage;
    const discount = item.discount || 0;
    const price = item.discounted_price || item.price || 0;
    const originalPrice = price + discount;
    const discountPrice = price - discount;
    return (
      <View style={[styles.card, { width: itemWidth }]}>
        <View>
          <Image
            source={imageUrl}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.age}>
            Original Price: ₹{originalPrice.toFixed(2)}
          </Text>
          <Text style={styles.age}>Discount: ₹{discount.toFixed(2)}</Text>
          <Text style={styles.age}>
            Best Price: ₹{discountPrice.toFixed(2)}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => onselectedProduct?.(item)}
        >
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        {toyData.length != 0 ? "Top toy & game ideas" : ""}
      </Text>
      {toyData.length == 0 ? (
        <View style={{ alignItems: "center", marginTop: 40 }}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/4076/4076549.png",
            }}
            style={{ width: 80, height: 80, marginBottom: 16 }}
            resizeMode="contain"
          />
          <Text style={{ fontSize: 16, color: "#888" }}>No data found</Text>
        </View>
      ) : (
        <FlatList
          data={toyData}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={numColumns}
          onScroll={onScroll}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
         
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
      isLoadingMore ? (
        <View style={{ padding: 16 }}>
          <ActivityIndicator size="small" color="#030a12ff" />
        </View>
      ) : null
    }
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 5,
    paddingHorizontal: 16,
    width: "100%",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  grid: {
    gap: 16,
    paddingBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    marginRight: 16,
    justifyContent: "space-between",
  },
  image: {
    width: "100%",
    height: 100,
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  age: {
    fontSize: 10,
    color: "#666",
    marginBottom: 5,
  },
  button: {
    borderWidth: 1,
    borderColor: "#f0f0f0",
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "#000000",
    fontWeight: "bold",
    fontSize: 13,
  },
});

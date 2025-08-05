// components/PriceSlider.js
import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";

export default function PriceSlider({ price = 0, onselectedPrice , onSlidingComplete }) {
  const handleValueChange = (val) => {
    onselectedPrice?.(val); // notify parent
  };

  return (
    <View style={styles.row}>
      <Text style={styles.title}>Price</Text>
      <Text style={styles.labelminPrice}>₹0</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={50000}
        step={1}
        minimumTrackTintColor="#007BFF"
        maximumTrackTintColor="#ccc"
        thumbTintColor="#007BFF"
        value={price}
        onValueChange={handleValueChange}
        onSlidingComplete={onSlidingComplete}
      />
      <Text style={styles.label}>₹{price === 0 ? 50000 : price}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    // marginTop: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  label: {
    fontSize: 13,
    width: 50,
    textAlign: "center",
  },
  labelminPrice: {
    fontSize: 13,
    width: 20,
    textAlign: "center",
  },
  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: 5,
  },
});

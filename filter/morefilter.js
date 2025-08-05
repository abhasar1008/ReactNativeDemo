import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';


export default function MoreFilter({ skills = [] }) {
  return (
    <View style={styles.container}>
     
      <FlatList
        data={skills}
        horizontal
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        style={styles.flatList}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.skillBox}>
            <Text style={styles.skillText}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 17,
    marginTop: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  flatList: {
    height: 45, 
    flexGrow: 0,
  },
  listContent: {
    alignItems: 'center',
  },
  skillBox: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderColor: '#f0f0f0',
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
  },
  skillText: {
    fontSize: 14,
    color: '#333',
  },
});

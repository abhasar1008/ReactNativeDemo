import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function SkillsRow({
  skills = [],
  title = "",
  selectedSkills = [],
  onSkillPress,
}) {
  const hasTitle = title.trim().length > 0;
  const [selectedSkill, setSelectedSkill] = useState([]);
  return (
    <View style={[styles.container, !hasTitle && styles.noTitleContainer]}>
      {hasTitle && <Text style={styles.title}>{title}</Text>}

      <FlatList
        data={skills}
        horizontal
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        style={styles.flatList}
        renderItem={({ item }) => {
          const isSelected = selectedSkills.includes(item);

          return (
            <TouchableOpacity
              style={[
                styles.skillBox,
                isSelected && styles.skillBoxSelected,
                !hasTitle && styles.skillBoxDark,
              ]}
              onPress={() => onSkillPress?.(item)}
            >
              <Text
                style={[
                  styles.skillText,
                  isSelected && styles.skillTextSelected,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 17,
  },
  noTitleContainer: {
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  flatList: {
    height: 45,
    flexGrow: 0,
  },
  listContent: {
    alignItems: "center",
  },
  skillBox: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    marginRight: 10,
  },
  skillBoxDark: {
    backgroundColor: "white",
    borderColor: "#f0f0f0",
    borderWidth: 1,
  },
  skillBoxSelected: {
    backgroundColor: "red",
  },
  skillText: {
    fontSize: 14,
    color: "#333",
  },
  skillTextSelected: {
    color: "#fff",
  },
});

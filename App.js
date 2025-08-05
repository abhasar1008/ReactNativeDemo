import { StatusBar } from "expo-status-bar";
import {
  Keyboard,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import SkillsRow from "./filter/skillbased";
import PriceSlider from "./filter/pricebase";
import ToyGrid from "./filter/productlist";
import axios from "axios";
import { useEffect, useState } from "react";
import Product from "./models/ProductModel";


export default function App() {
  const skillsData = [
    "Creative",
    "Problem Solving",
    "Motor Skills",
    "Logical",
    "Puzzle",
    "Music",
    "Building",
    "Reading",
  ];
  const moddDataData = [
    "Curious",
    "Energrtic",
    "happy",
    "Relaxed",
    "Focused",
    "Playful",
    "Adventurous",
    "Calm",
  ];
  const moreFilterData = [
    "Show Something Different ",
    "i like the suggestion, Show more",
  ];
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toyListData, setToyList] = useState([]);
  const [showFilters, setShowFilters] = useState(true);
  const [selectedSkills, setselectedSkills] = useState([]);
  const [selectedMood, setselectedMood] = useState([]);
  const [selectedPrice, setselectedPrice] = useState(0);
  const [excludeIds, setExcludeIds] = useState([]); //Temparory array
  const [triggerDifferentFetch, setTriggerDifferentFetch] = useState(false);

  useEffect(() => {
    if (triggerDifferentFetch) {
      fetchSearchResults(0);
      setTriggerDifferentFetch(false);
    }
  }, [excludeIds, triggerDifferentFetch]);

  useEffect(() => {
    if (!triggerDifferentFetch) {
      setExcludeIds([]);
    }
  }, [triggerDifferentFetch]);

  useEffect(() => {
    setTriggerDifferentFetch(false);
    fetchSearchResults((skipCount = 0)); // or pass selectedSkills if needed
  }, [selectedSkills, selectedMood]);

  const fetchSearchResults = async (skipCount = 0) => {
    if (!query) return;
    Keyboard.dismiss();
    setIsLoading(true);
    await callFetchApi((skipCount = skipCount));
  };
  const callFetchApi = async (skipCount = 0) => {
    try {
      const payload = {
        query: query,
        count: 5,
        use_searchtap: true,
        skills: selectedSkills.length > 0 ? selectedSkills : [],
        mood: selectedMood.length > 0 ? selectedMood : [],
        min_price: 0,
        max_price: selectedPrice === 0 ? 50000 : selectedPrice,
      };
      if (excludeIds.length > 0) {
        payload.exclude_ids = excludeIds.map(String);
      }

      if (skipCount !== 0) {
        payload.skip = skipCount;
      }

      console.log("Payload is :", payload);
      const response = await axios.post(
        "http://10.37.55.56:8000/semantic_search",
        payload,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      setProductData(response, skipCount);
    } catch (error) {
      fetchProductData();
    } finally {
      setIsLoading(false);
    }
  };

  const setProductData = (response, count) => {
    const products = response.data.results.map((item) => new Product(item));

    setToyList((prevList) => {
      if (count === 0) {
        setToyList([]);
        return products;
      } else {
        return [...prevList, ...products];
      }
    });
  };

  const handleToyListScroll = (event) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    if (yOffset > 50 && showFilters) {
      setShowFilters(false);
    } else if (yOffset <= 50 && !showFilters) {
      setShowFilters(true);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Smart Toy Finder</Text>
      <Text>Describe the type of toys or games you'd like to find.</Text>
      <View style={styles.searchWrapper}>
        <TextInput
          style={styles.input}
          placeholder="toy for a 5 year old"
          placeholderTextColor="#999"
          value={query}
          onChangeText={setQuery}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => {
            setTriggerDifferentFetch(false);
            fetchSearchResults((skipCount = 0));
          }}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>
      {showFilters && (
        <>
          <SkillsRow
            title="Skills"
            skills={skillsData}
            selectedSkills={selectedSkills}
            onSkillPress={(skill) => {
              setselectedSkills((prev) =>
                prev.includes(skill)
                  ? prev.filter((s) => s !== skill)
                  : [...prev, skill]
              );
            }}
          />
          <SkillsRow
            title="Mood"
            skills={moddDataData}
            selectedSkills={selectedMood}
            onSkillPress={(skill) => {
              setselectedMood((prev) =>
                prev.includes(skill)
                  ? prev.filter((s) => s !== skill)
                  : [...prev, skill]
              );
            }}
          />
          <PriceSlider
            price={selectedPrice}
            onSlidingComplete={() => {
              setTriggerDifferentFetch(false);
              fetchSearchResults((skipCount = 0));
            }}
            onselectedPrice={(priceSelected = 0) => {
              console.log("Price selected is :", priceSelected);
              if (priceSelected === 0) {
              } else {
                setselectedPrice(priceSelected);
              }
            }}
          />

          {toyListData.length > 0 ? (
            <SkillsRow
              title=""
              skills={moreFilterData}
              onSkillPress={(selectedSkill) => {
                if (selectedSkill === "Show Something Different ") {
                  const ids = toyListData.map((item) => item.id);
                  setExcludeIds((prev) => {
                    // Create a new Set to remove duplicates
                    const uniqueIds = Array.from(new Set([...prev, ...ids]));
                    return uniqueIds;
                  }); // Set new IDs
                  setTriggerDifferentFetch(true);
                } else {
                  setTriggerDifferentFetch(false);
                  fetchSearchResults((skipCount = skipCount + 6));
                }
              }}
            />
          ) : (
            <></>
          )}
        </>
      )}
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#007BFF"
          style={{ marginTop: 20 }}
        />
      ) : (
        <ToyGrid
          toyData={toyListData}
          onScroll={handleToyListScroll}
          onselectedProduct={(selectedProduct) => {
            console.log("User clicked product is :", selectedProduct);
          }}
        ></ToyGrid>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 70,
    marginBottom: 10,
  },
  title: {
    fontSize: 35,
    fontWeight: "bold",
    marginBottom: 5,
  },
  searchWrapper: {
    position: "relative",
    marginTop: 10,
    width: "90%",
    marginBottom: 10,
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    paddingLeft: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  searchButton: {
    position: "absolute",
    right: 1,
    top: 1,
    bottom: 1,
    backgroundColor: "#007BFF",
    paddingHorizontal: 14,
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

const fetchProductData = async () => {
  Keyboard.dismiss();
  if (!query) return;
  setIsLoading(true);
  try {
    const response = await axios.post(
      "https://eqlmkznf35a5425vys2jy1w1-fast.searchtap.net/v2",
      {
        query: query,
        count: 50,
        use_searchtap: true,
        fields: [
          "id",
          "collections",
          "discount",
          "discounted_price",
          "images",
          "handle",
          "hasMultiplePrice",
          "price",
          "reviews_count",
          "ideal_for_months",
          "title",
          "reviews_average",
          "isActive",
          "vendor",
          "variants",
          "tags",
          "ideal_for_weights",
          "options",
          "size",
          "meta_avg_ratings",
          "meta_reviews_count",
          "variantWithMaxPrice",
          "variantWithMinPrice",
          "meta_short_desc",
        ],
        textFacets: [],
        highlightFields: [],
        searchFields: ["*"],
        filter: "isSearchable = 1 AND discounted_price > 0 AND isActive = 1",
        sort: ["-isActive", "-_rank"],
        skip: 0,
        count: 10,
        collection: "1KJ6W6DQYQI78XJQVRE666NI",
        facetCount: 100,
        groupCount: -1,
        typoTolerance: 2,
        textFacetFilters: {},
        numericFacets: {},
        numericFacetFilters: {},
        textFacetQuery: null,
        geo: {},
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Origin: "https://snooplay.in",
          Authorization: "Bearer 9DFFEFB37BILEAHUF86UPDVM",
        },
      }
    );

    const products = response.data.results.map((item) => new Product(item));
    setToyList(products);
  } catch (error) {
    console.error("Error fetching search results:", error);
  } finally {
    setIsLoading(false);
  }
};
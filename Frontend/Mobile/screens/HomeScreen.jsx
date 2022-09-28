import { ActivityIndicator, Dimensions, FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

import axios from "axios";
import { useEffect, useState } from "react";

import PizzaCard from "../components/PizzaCard";
import RecommendedCard from "../components/RecommendedCard";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const navigation = useNavigation();

  const [active, setActive] = useState("All");
  const [name, setName] = useState("");
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(false);

  const [pizzasClone, setPizzasClone] = useState([]);

  useEffect(() => {
    fetchPizzas();
  }, []);

  const fetchPizzas = async () => {
    setLoading(true);
    const res = await axios.get("http://192.168.50.87:8070/pizza");
    setPizzas(res.data);
    setPizzasClone(res.data);
    setLoading(false);
  };

  const fetchPizzasByCat = async (cat) => {
    setLoading(true);
    const res = await axios.get(`http://192.168.50.87:8070/pizzaByCategory/${cat}`);
    setPizzas(res.data);
    setLoading(false);
  };

  const handleCategory = (item) => {
    if (item === "All") {
      setActive(item);
      fetchPizzas();
    } else {
      setActive(item);
      fetchPizzasByCat(item);
    }
  };

  const searchPizzaByName = async (name) => {
    setLoading(true);
    if (name !== "") {
      setName("");
      const res = await axios.get(`http://192.168.50.87:8070/searchPizza/${name}`);
      setPizzas(res.data);
      setLoading(false);
    } else {
      setName("");
      const res = await axios.get(`http://192.168.50.87:8070/pizza`);
      setPizzas(res.data);
      setLoading(false);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <TouchableOpacity style={{ alignSelf: "flex-end" }} onPress={() => navigation.openDrawer()}>
        <FontAwesome size={35} color="#fff" name="bars" style={{ marginBottom: 30 }} />
      </TouchableOpacity>
      <Text style={styles.text}>Find the world</Text>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={styles.text}>best </Text>
        <Text style={[styles.text, { color: "#ed9754" }]}>Pizza </Text>
        <Text style={styles.text}>for you</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Search for pizza..."
          style={styles.input}
          value={name}
          onChangeText={(newName) => setName(newName)}
          onEndEditing={() => searchPizzaByName(name)}
          placeholderTextColor="#555759"
        />
        <FontAwesome name="search" size={20} color="#555759" />
      </View>
      <View style={{ marginTop: 35, marginBottom: 20 }}>
        {pizzas && (
          <FlatList
            horizontal
            keyExtractor={(item, index) => index}
            data={[{ category: "All" }, { category: "Veg" }, { category: "Non-Veg" }]}
            renderItem={({ item }) => (
              <Pressable onPress={() => handleCategory(item.category)}>
                <Text style={[styles.categoryText, active === item.category && styles.activeCategory]}>{item.category}</Text>
              </Pressable>
            )}
          />
        )}
      </View>
      <View>
        {pizzas && (
          <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal
            keyExtractor={(item) => item.id}
            data={pizzas}
            renderItem={({ item, index }) => {
              return <PizzaCard item={item} lastIndex={pizzas.indexOf(pizzas[pizzas.length - 1])} index={index} />;
            }}
          />
        )}
      </View>
      <View style={{ flex: 1 }}>
        {pizzas.length > 0 ? (
          <Text style={styles.recommendedHeading}>Recommended</Text>
        ) : (
          <Text style={{ fontWeight: "bold", fontSize: 18, color: "#fff" }}>Not found...</Text>
        )}
        {pizzas.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} scrollEnabled={false}>
            <FlatList
              style={{ width: Dimensions.get("window").width }}
              keyExtractor={(item) => item.id}
              data={pizzasClone.slice(1, 3)}
              renderItem={({ item }) => {
                return <RecommendedCard item={item} />;
              }}
            />
          </ScrollView>
        )}
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#272629",
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  text: {
    color: "#fff",
    fontSize: 39,
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: 10,
    paddingHorizontal: 20,
    backgroundColor: "#141921",
    borderRadius: 15,
    marginTop: 30,
  },
  input: {
    color: "#fff",
    width: "95%",
  },
  categoryText: {
    color: "#757474",
    textTransform: "uppercase",
    letterSpacing: 0.7,
    fontSize: 16,
    marginRight: 20,
    fontWeight: "bold",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
    paddingBottom: 10,
  },
  activeCategory: {
    paddingBottom: 10,
    borderBottomWidth: 2,
    color: "#c97642",
    borderBottomColor: "#cf7943",
  },
  recommendedHeading: {
    fontSize: 18,
    color: "#7f7d7e",
    letterSpacing: 2,
    textTransform: "uppercase",
    fontWeight: "bold",
    marginTop: 35,
    marginBottom: 10,
  },
  loading: {
    backgroundColor: "#272629",
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});

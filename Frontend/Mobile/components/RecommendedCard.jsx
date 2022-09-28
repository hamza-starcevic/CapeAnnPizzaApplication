import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, View, Image, Pressable, TouchableOpacity } from "react-native";

const RecommendedCard = ({ item }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.recommendedCard}>
      <TouchableOpacity onPress={() => navigation.navigate("PizzaDetail", { id: item.id })} style={{ flexDirection: "row", alignItems: "center" }}>
        <Image style={styles.imageRecommended} source={{ uri: item.picture }} />
        <View style={{ marginLeft: 20 }}>
          <Text style={styles.textRecommended}>{item.name}</Text>
          <Text style={styles.textRecommended}>{item.category}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default RecommendedCard;

const styles = StyleSheet.create({
  recommendedCard: {
    borderWidth: 1,
    borderColor: "#5e524c",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    width: "90%",
  },
  imageRecommended: {
    width: "50%",
    height: 100,
    resizeMode: "contain",
    borderRadius: 10,
  },
  textRecommended: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

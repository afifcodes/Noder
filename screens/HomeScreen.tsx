import { StackScreenProps } from "@react-navigation/stack";
import { useContext, useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { AppContextInterface, StackParamInterface } from "../interfaces";
import Feather from "@expo/vector-icons/Feather";
import { openDatabase } from "../services/databaseService";
import { AppContext } from "../libs/AppContext";

type HomeScreenProps = StackScreenProps<StackParamInterface, "Noder">;

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const db = openDatabase();
  const { noders, setNoders } = useContext(AppContext) as AppContextInterface;

  const getNoders = () => {
    db.transaction((tx) => {
      tx.executeSql("select * from noders", [], (_, res) => {
        setNoders(res.rows._array);
      });
    });
  };

  useEffect(() => {
    getNoders();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("New Noder");
          }}
        >
          <View style={{ padding: 12 }}>
            <Feather name="plus" size={24} />
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  return (
    <View style={{ height: "100%" }}>
      <ScrollView>
        {noders.map((noder, _) => {
          return (
            <TouchableOpacity
              key={noder.id.toString()}
              onPress={() => {
                navigation.navigate("Noder Detail", {
                  id: noder.id,
                  notif_id: noder.notif_id,
                });
              }}
            >
              <View
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  backgroundColor: "#FFFFFF",
                }}
              >
                <Text style={{ fontWeight: "500", fontSize: 16 }}>
                  {noder.title}
                </Text>
                <Text style={{ fontSize: 14 }} numberOfLines={1}>
                  {noder.desc}
                </Text>
                <Text style={{ fontSize: 12, color: "#525252" }}>
                  {noder.stamp.split("GMT")[0]}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

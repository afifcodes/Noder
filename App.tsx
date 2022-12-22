import { NavigationContainer } from "@react-navigation/native";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import { StackParamInterface } from "./interfaces";
import HomeScreen from "./screens/HomeScreen";
import NewNoderScreen from "./screens/NewNoderScreen";
import NoderDetailScreen from "./screens/NoderDetailScreen";
import * as Notifications from "expo-notifications";
import { useEffect, useRef, useState } from "react";
import { registerForPushNotificationsAsync } from "./libs/useNotification";
import { openDatabase } from "./services/databaseService";
import { AppProvider } from "./libs/AppContext";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Stack = createStackNavigator<StackParamInterface>();

const App = () => {
  const db = openDatabase();
  const [_, setExpoPushToken] = useState<any>("");
  const [__, setNotification] = useState<any>(false);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists noders (id INTEGER PRIMARY KEY NOT NULL, title TEXT, desc TEXT, stamp TEXT, notif_id TEXT)",
        [],
        (_, __) => {
          console.log(_)
          console.log(__)
          console.log("Table Created Successfully");
        },
        (_, error) => {
          console.log("Table Error");
          console.log(error.message);
          return true;
        }
      );
    });
  }, []);

  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            gestureEnabled: true,
            gestureDirection: "horizontal",
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        >
          <Stack.Screen name="Noder" component={HomeScreen} />
          <Stack.Screen name="New Noder" component={NewNoderScreen} />
          <Stack.Screen name="Noder Detail" component={NoderDetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
};

export default App;

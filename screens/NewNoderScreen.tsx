import { StackScreenProps } from "@react-navigation/stack";
import { useContext, useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AppContextInterface, StackParamInterface } from "../interfaces";
import Feather from "@expo/vector-icons/Feather";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { openDatabase } from "../services/databaseService";
import { schedulePushNotification } from "../libs/useNotification";
import { AppContext } from "../libs/AppContext";

type NewNoderScreenProps = StackScreenProps<StackParamInterface, "New Noder">;

export default function NewNoderScreen({ navigation }: NewNoderScreenProps) {
  const db = openDatabase();
  const { setNoders } = useContext(AppContext) as AppContextInterface;
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [dateShow, setDateShow] = useState(false);
  const [timeShow, setTimeShow] = useState(false);

  const handleChangeDate = (
    _: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    const currentDate = selectedDate;
    setDateShow(false);
    setDate(currentDate!);
  };

  const showDatepicker = () => {
    setDateShow(true);
  };

  const handleChangeTime = (
    _: DateTimePickerEvent,
    selectedTime: Date | undefined
  ) => {
    const currentTime = selectedTime;
    setTimeShow(false);
    setTime(currentTime!);
  };

  const showTimepicker = () => {
    setTimeShow(true);
  };
  const handleChangeTitle = (newTitle: string) => {
    setTitle(newTitle);
  };

  const handleChangeDesc = (newDesc: string) => {
    setDesc(newDesc);
  };

  const addNoder = async () => {
    if (title.length === 0 && desc.length === 0) return;
    let stamp = new Date(date.toDateString() + " " + time.toTimeString());
    const notif_id = await schedulePushNotification(title, desc, stamp);
    console.log(title, desc, stamp.toString(), notif_id);
    db.transaction((tx) => {
      tx.executeSql(
        "insert into noders (title, desc, stamp, notif_id) VALUES (?, ?, ?, ?)",
        [title, desc, stamp.toString(), notif_id],
        (_, __) => {
          console.log(_)
          console.log(__)
          console.log("Successfully Inserts New Noder");
        },
        (_, __) => {
          console.log(_)
          console.log(__)
          console.log("Failed to Insert New Noder");
          return true;
        }
      );
      tx.executeSql("select * from noders", [], (_, res) => {
        setNoders(res.rows._array);
      });
    });
    navigation.pop();
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={addNoder}>
          <View style={{ padding: 12 }}>
            <Feather name="check" size={24} />
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation, title, desc, date, time]);
  return (
    <View style={{ height: "100%" }}>
      <ScrollView>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <TouchableOpacity onPress={showDatepicker}>
            <View style={{ padding: 20 }}>
              <Text>{date.toDateString()}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={showTimepicker}>
            <View style={{ padding: 20 }}>
              <Text>{time.toLocaleTimeString()}</Text>
            </View>
          </TouchableOpacity>
          {dateShow && (
            <DateTimePicker
              value={date}
              mode="date"
              is24Hour={true}
              onChange={handleChangeDate}
            />
          )}
          {timeShow && (
            <DateTimePicker
              value={time}
              mode="time"
              is24Hour={true}
              onChange={handleChangeTime}
            />
          )}
        </View>
        <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
          <TextInput
            style={{
              padding: 4,
              fontSize: 24,
            }}
            multiline
            placeholder="Noder Title"
            value={title}
            onChangeText={handleChangeTitle}
          />
          <TextInput
            style={{
              marginTop: 12,
              padding: 4,
              fontSize: 16,
              color: "#525252",
            }}
            multiline
            placeholder="Description"
            value={desc}
            onChangeText={handleChangeDesc}
          />
        </View>
      </ScrollView>
    </View>
  );
}

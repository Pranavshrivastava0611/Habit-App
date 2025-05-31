import { View, StyleSheet,ScrollView } from "react-native";
import { Button, Text, Card, Surface } from "react-native-paper";
import { useAuth } from "@/lib/authProvider";
import { DATABASE_ID, HABIT_COLLECTION_ID, databases } from "@/lib/appwrite";
import { useEffect, useState } from "react";
import { Habit } from "@/types/database.type";
import { Query } from "react-native-appwrite";
import FontAwesomeIcon5 from "@expo/vector-icons/FontAwesome5";
import { Swipeable } from "react-native-gesture-handler";
import { useRef } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Index() {
  const { signout, user } = useAuth();
  const [Habits, setHabits] = useState<Habit[]>([]);
  const swipeableRef = useRef<{[key : string] : Swipeable | null}>({})

  const fetchHabit = async () => {
    if (!user) return;
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        HABIT_COLLECTION_ID,
        [Query.equal("user_Id", user.$id)]
      );
        setHabits(response.documents as Habit[]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchHabit();
  }, [Habits,user]);

  const renderLeftActions = () => (
    // on left swipe delete the habit ;
    <View style={styles.swipeActionLeft}>
      <MaterialCommunityIcons
        name="trash-can-outline"
        size={32}
        color="#fff"
        style={{ marginRight: 10 }}
      />
    </View>
  );
  const renderRightActions = ()=>(
    <View style={styles.swipeActionRight}>
      <MaterialCommunityIcons
        name="check-circle-outline"
        size={32}
        color="#fff"
        style={{ marginRight: 10 }}
      />
    </View>
  )


  const handleDeleteHabit = async (id : string)=>{
    try{
    await databases.deleteDocument(DATABASE_ID,HABIT_COLLECTION_ID,id);
    setHabits(Habits.filter((habit)=>habit.$id!==id))
    }catch(error){
      console.log(error);
    }
  }

  return (
   <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          {" "}
          Today's Habits
        </Text>
        <Button mode="text" onPress={signout} icon={"logout"}>
          Sign Out
        </Button>
      </View>

      {/* Habits */}
      <ScrollView showsVerticalScrollIndicator={false}>
      {Habits.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No habit found! Try adding a habit</Text>
        </View>
      ) : (
        Habits.map((habit, index) => (
          <Swipeable ref={(ref)=>{
            swipeableRef.current[habit.$id] = ref;
          }} key={index}
          overshootLeft={false}
          overshootRight = {false}
          renderLeftActions={renderLeftActions}
          renderRightActions={renderRightActions}
          onSwipeableOpen={(direction)=>{
              if(direction==="left"){
                handleDeleteHabit(habit.$id);
                swipeableRef.current[habit.$id]?.close();
              }
          }}
          >
          <Surface style={styles.card} elevation={0}>
          <View key={index} style={styles.cardContent}>
            <Text style={styles.cardTitle}>{habit.title}</Text>
            <Text style={styles.cardDescription}>{habit.description}</Text>
            <View style={styles.cardFooter}>
              <View style={styles.streakBadge}>
              <FontAwesomeIcon5 name="fire" size={20} color="#ff9800"/>
              <Text style={styles.streakText}> {habit.streak_count} day streak</Text>
              </View>
              <View style={styles.frequencyBadge}>
                <Text style={styles.frequencyText}>{" "} 
                  {habit.frequency}
                </Text>
              </View>
            </View>
          </View>
          </Surface>
          </Swipeable>
        ))
      )}
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontWeight: "bold",
  },

  card: {
    marginBottom: 16,
    borderRadius: 18,
    backgroundColor: "#f7f2fa",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },

  cardCompleted: {
    opacity: 0.6,
  },
  cardContent: {
  padding: 20,
  marginVertical: 1,
  backgroundColor: "#ffffff",
  borderRadius: 16,
  borderWidth: 1,
  borderColor: "#ddd",

  // Shadow for iOS
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.9,
  shadowRadius: 4,

  // Elevation for Android
  elevation: 6,
},

  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#22223b",
  },
  cardDescription: {
    fontSize: 15,
    marginBottom: 16,
    color: "#6c6c80",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff3e0",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  streakText: {
    marginLeft: 6,
    color: "#ff9800",
    fontWeight: "bold",
    fontSize: 14,
  },
  frequencyBadge: {
    backgroundColor: "#ede7f6",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  frequencyText: {
    color: "#7c4dff",
    fontWeight: "bold",
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    color: "#666666",
  },
  swipeActionLeft: {
    justifyContent: "center",
    alignItems: "flex-start",
    flex: 1,
    backgroundColor: "#e53935",
    borderRadius: 18,
    marginBottom: 18,
    marginTop: 2,
    paddingLeft: 16,
  },
  swipeActionRight: {
    justifyContent: "center",
    alignItems: "flex-end",
    flex: 1,
    backgroundColor: "#4caf50",
    borderRadius: 18,
    marginBottom: 18,
    marginTop: 2,
    paddingRight: 16,
  },
 
});

import React, { useCallback, useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { useAuth } from "@/lib/authProvider";
import {
  Button,
  SegmentedButtons,
  TextInput,
  useTheme,
} from "react-native-paper";
import { databases, DATABASE_ID, HABIT_COLLECTION_ID } from "@/lib/appwrite";
import { ID } from "react-native-appwrite";
import { useRouter } from "expo-router";
import { toast } from "@backpackapp-io/react-native-toast";

const FREQUENCIES = ["Daily", "Weekly", "Monthly"];

export default function AddHabitScreen() {
  type Frequency = (typeof FREQUENCIES)[number];
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [frequency, setFrequency] = useState<Frequency>("Daily");
  const [error, setError] = useState<string>("");

  const { user } = useAuth();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!user) return;
    try {
      await databases.createDocument(
        DATABASE_ID,
        HABIT_COLLECTION_ID,
        ID.unique(),
        {
          user_Id: user.$id,
          title,
          description,
          streak_count: 0,
          last_completed: new Date().toISOString(),
          frequency,
          created_at: new Date().toISOString(),
        }
      );
      router.back();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        return;
      }
      setError("There was an error creating a habit");
    }
  };

  useCallback(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create a New Habit</Text>
      <TextInput
        label="Title"
        mode="outlined"
        style={styles.input}
        onChangeText={(text) => setTitle(text)}
        value={title}
        theme={{
          roundness: 16,
          colors: { background: "#fff" },
        }}
      />
      <TextInput
        label="Description"
        mode="outlined"
        style={styles.input}
        onChangeText={(text) => setDescription(text)}
        value={description}
        theme={{
          roundness: 16,
          colors: { background: "#fff" },
        }}
      />
      <View style={styles.frequencyContainer}>
        <SegmentedButtons
          buttons={FREQUENCIES.map((item) => ({
            value: item,
            label: item,
          }))}
          value={frequency}
          onValueChange={(value) => setFrequency(value)}
          theme={{
            colors: { background: "#fff" },
          }}
        />
      </View>
      <Button
        mode="contained"
        disabled={!title || !description}
        onPress={handleSubmit}
        style={styles.button}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonLabel}
      >
        Add Habit
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#F4F1FB", // soft lavender
    justifyContent: "center",
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4B0082",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
  },
  frequencyContainer: {
    marginBottom: 30,
  },
  button: {
    borderRadius: 30,
    overflow: "hidden",
  },
  buttonContent: {
    paddingVertical: 10,
    backgroundColor: "#FFD700", // gold
  },
  buttonLabel: {
    color: "#4B0082",
    fontWeight: "bold",
    fontSize: 16,
  },
});

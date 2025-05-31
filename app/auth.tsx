import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, View, StyleSheet } from "react-native";
import { Button, Text, TextInput,useTheme } from "react-native-paper";
import { useAuth } from "@/lib/authProvider";
import { useRouter } from "expo-router";


export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>("");
  
  const theme = useTheme();
  const {signIn,signUp} = useAuth();
  const router = useRouter();


  const handleSwicthMode = () => {
    setIsSignUp(!isSignUp);
  };

  const handleAuth = async () => {
    if (!email || !password) {
      setError("Email and Password are required");
      return;
    }else if(password.length < 8){
        setError("Password must be at least 8 characters long");
        return;
    }
    setError(null);
   
        if(isSignUp){
            const error = await signUp(email, password);
            if (error) {
                setError(error);
            }else{
                router.replace("/");
            }
        }else {
            const error = await signIn(email, password);
            if (error) {
                setError(error);
            } else{
                router.replace("/");
            }
        }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          {isSignUp ? "Create Account" : "Welcome Back"}
        </Text>
        <TextInput
          keyboardType="email-address"
          placeholder="example@gmail.com"
          autoCapitalize="none"
          label={"Email"}
          mode="outlined"
          style={styles.input}
          onChangeText={(text) => setEmail(text)}
          value={email}
        />
        <TextInput
          secureTextEntry={true}
          label={"Password"}
          autoCapitalize="none"
          mode="outlined"
          style={styles.input}
          onChangeText={(text) => setPassword(text)}
          value={password}
        />
        {error ? (
          <Text style={{ color: theme.colors.error, textAlign: "center" }}>
            {error}
          </Text>
        ) : null}
        <Button mode="contained" style={styles.button} onPress={handleAuth}>
          {isSignUp ? "Sign Up" : "Sign In"}
        </Button>
        {isSignUp ? (
          <Button
            mode="text"
            onPress={handleSwicthMode}
            style={styles.swicthModeButton}
          >
            Already have an account ? Sign In
          </Button>
        ) : (
          <Button
            mode="text"
            onPress={handleSwicthMode}
            style={styles.swicthModeButton}
          >
            Don't have an account ? Sign Up
          </Button>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  swicthModeButton: {
    marginTop: 16,
  },
});

import React, { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import { AuthProvider, useAuth } from "@/lib/authProvider";
import { useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
//@ts-ignore
import {Toasts} from "@backpackapp-io/react-native-toast";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';


function RootGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const {user,loader} = useAuth();
  const segments = useSegments();
  const isAuthScreen = segments[0] === "auth";

  useEffect(()=>{
    if(!user && !isAuthScreen && !loader){ // when the getUser is completely loaded then loader become false and is redirected 
      router.replace("/auth");
    }else if(user && isAuthScreen && !loader){
      router.replace("/");
    }
    
  },[user, segments]);
  
  return <>{children}</>;
}

export default function RootLayout() {
  return (
        <GestureHandlerRootView style={{flex : 1}}>
    <AuthProvider>
      <PaperProvider>
      <SafeAreaProvider>
    <RootGuard>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </RootGuard>
    <Toasts/>
    </SafeAreaProvider>
    </PaperProvider>
    </AuthProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

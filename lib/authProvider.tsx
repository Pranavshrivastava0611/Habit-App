import React from "react";
import {useContext,createContext,useState,useEffect} from "react";
import { account } from "./appwrite";
import { ID } from "react-native-appwrite";
import { Models } from "react-native-appwrite";


type AuthContextType = {
    loader : boolean;  // this will help us to navigate to the /auth without showing the error
    user : Models.User<Models.Preferences> | null;
    signUp : (email : string , password : string)=>Promise<string | null>;
    signIn : (email : string, password : string)=>Promise<string | null>;
    signout : ()=>Promise<void>;
}
//create the context for the auth provider which will be used to wrap the layout.tsx;
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children} : {children : React.ReactNode}){
    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
    const [loader, setLoader] = useState(true);

    useEffect(()=>{
        getUser();
    },[]);

    const getUser = async ()=>{
        try{
            const user = await account.get();
            if(user){
                setUser(user);
            }else{
                setUser(null);
            }
        }catch(error){
                setUser(null);
    }finally{
            setLoader(false);
        }
}
    const signUp = async (email : string , password : string)=>{
        if(!email || !password) {
            throw new Error("Email and Password are required");
        } 
        if(password.length < 8) {
            throw new Error("Password must be at least 6 characters long");
        }
        try{
            await account.create(ID.unique(),email,password); // this will create a new user in the appwwrite authentication yet not in the databases;
            await signIn(email,password);
            return null;

        }catch(error){
            if(error instanceof Error){
                return error.message;
            }

            return "An unexpected error occurred during sign up.";
        }
    }

    const signIn  = async (email : string , password : string)=>{
        if(!email || !password) {
            throw new Error("Email and Password are required");
        } 
        if(password.length < 8) {
            throw new Error("Password must be at least 6 characters long");
        }
        try{
            //now we have to create a session for the user;
            await account.createEmailPasswordSession(email,password);
            const user = await account.get();
            setUser(user);
            return null; // if the sign in is successful we return null;

        }catch(error){
            if(error instanceof Error){
                return error.message;
            }
            return "An unexpected error occurred during sign in.";
        }
        
    }

    const signout = async ()=>{
        try{
        await account.deleteSession("current");
        setUser(null);

        }catch(error){
            console.log(error);
        }
    }
    return (
        <AuthContext.Provider value={{user,signIn, signUp,loader,signout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = ()=>{
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}



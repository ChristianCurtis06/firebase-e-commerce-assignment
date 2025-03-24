import React, { useEffect, createContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export interface UserId {
  id: string | undefined | null;
  isLoggedIn: boolean;
}

interface UserContextType {
  userId: UserId;
  setUserId: React.Dispatch<React.SetStateAction<UserId>>;
}

const UserContext = createContext<UserContextType>({
  userId: { id: null, isLoggedIn: false },
  setUserId: () => {}
});
/*
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (authUser: FirebaseUser | null) => {
    if (authUser) {
      try {
        const userDoc = doc(db, "users", authUser.uid);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          setUser(userSnapshot.data() as User);
        } else {
          console.warn("User data not found in Firestore");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    } else {
      setUser(null);
  }
});
return () => unsubscribe();
}, []);
*/

export default UserContext;
import { useState, useEffect } from "react";
import firebase from "./firebase";

const formatAuthUser = (user) => ({
  uid: user.uid,
  email: user.email,
});

export function useFirebaseAuth() {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const authStateChanged = async (authState) => {
    if (!authState) {
      setLoading(false);
      return;
    }
    setLoading(true);
    var formattedUser = formatAuthUser(authState);
    setAuthUser(formattedUser);
    setLoading(false);
  };

  const clear = () => {
    setAuthUser(null);
    setLoading(true);
  };

  const signInWithEmailAndPassword = (
    email,
    password // login
  ) => firebase.auth().signInWithEmailAndPassword(email, password);

  const createUserWithEmailAndPassword = (
    email,
    password // register
  ) => firebase.auth().createUserWithEmailAndPassword(email, password);

  const signOut = () =>
    // log out
    firebase.auth().signOut().then(clear);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(authStateChanged);
    return () => unsubscribe();
  });

  return {
    authUser,
    loading,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
  };
}
  
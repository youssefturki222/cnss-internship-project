import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.137.70:3000";
const LOGIN_ENDPOINT = `${API_BASE_URL}/api/auth/login`;

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleLogin = async () => {
    console.log("[LoginScreen] Login function triggered");

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    console.log("[LoginScreen] Collected form values:", {
      email: trimmedEmail,
      password: trimmedPassword ? trimmedPassword : "<empty>",
    });

    if (!trimmedEmail || !trimmedPassword) {
      const message = "Please enter both your email and password.";
      console.log("[LoginScreen] Login aborted because email or password is empty");
      setIsError(true);
      setFeedbackMessage(message);
      return;
    }

    const payload = {
      email: trimmedEmail,
      password: trimmedPassword,
    };

    console.log("[LoginScreen] Prepared login payload:", payload);
    console.log("[LoginScreen] Sending request to:", LOGIN_ENDPOINT);

    try {
      const response = await axios.post(LOGIN_ENDPOINT, payload, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      });

      console.log("[LoginScreen] API response received");
      console.log("[LoginScreen] Response status:", response?.status);
      console.log("[LoginScreen] Response data:", response?.data);

      if (response?.data?.success) {
        const token = response?.data?.data?.token;
        const user = response?.data?.data?.user;
        const assMat = user?.assMat;
        console.log("[LoginScreen] Login successful. Token received:", token || "<none>");
        console.log("[LoginScreen] User received:", user || "<none>");
        console.log("[LoginScreen] ASS_MAT received:", assMat || "<none>");

        try {
          await AsyncStorage.setItem("token", token || "");
          await AsyncStorage.setItem("user", JSON.stringify(user || {}));
          await AsyncStorage.setItem("assMat", assMat || "");
          console.log("[LoginScreen] Token, user and ASS_MAT saved to AsyncStorage");
        } catch (storageError) {
          console.error("[LoginScreen] Failed to save auth data:", storageError);
        }

        setIsError(false);
        setFeedbackMessage("Login successful. Welcome back!");

        navigation.reset({
          index: 0,
          routes: [{ name: "MainTabs" }],
        });
      } else {
        const message = response?.data?.message || "Invalid email or password.";
        console.log("[LoginScreen] Backend reported login failure:", message);
        setIsError(true);
        setFeedbackMessage(message);
      }
    } catch (error) {
      console.error("[LoginScreen] Login request failed");

      if (error.response) {
        console.error("[LoginScreen] Response status:", error.response?.status);
        console.error("[LoginScreen] Response data:", error.response?.data);
      } else if (error.request) {
        console.error("[LoginScreen] No response received from server:", error.request);
      } else {
        console.error("[LoginScreen] Request setup error:", error.message);
      }
      setIsError(true);
      setFeedbackMessage("Unable to connect. Please try again later.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.backgroundGlow} />
      <View style={styles.glowSecondary} />

      <View style={styles.card}>
        <Text style={styles.logo}>CNSS</Text>
        <Text style={styles.subtitle}>Secure Access Portal</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          placeholderTextColor="#9ca3af"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          placeholderTextColor="#9ca3af"
          secureTextEntry
          style={styles.input}
        />

        {feedbackMessage ? (
          <View style={[styles.feedbackBox, isError ? styles.feedbackError : styles.feedbackSuccess]}>
            <Text style={styles.feedbackText}>{feedbackMessage}</Text>
          </View>
        ) : null}

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signupButton}
          onPress={() => navigation.navigate("SignUpScreen")}
        >
          <Text style={styles.signupText}>Create a new account</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>CNSS Tunisia • Protected System</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fb",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  backgroundGlow: {
    position: "absolute",
    width: 420,
    height: 420,
    backgroundColor: "#1e40af",
    opacity: 0.06,
    borderRadius: 220,
    top: -120,
    right: -120,
  },

  glowSecondary: {
    position: "absolute",
    width: 350,
    height: 350,
    backgroundColor: "#0f172a",
    opacity: 0.04,
    borderRadius: 200,
    bottom: -120,
    left: -100,
  },

  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    elevation: 5,
  },

  logo: {
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
    color: "#111827",
    letterSpacing: 2,
  },

  subtitle: {
    textAlign: "center",
    color: "#6b7280",
    marginBottom: 24,
    fontSize: 13,
  },

  label: {
    fontSize: 13,
    color: "#374151",
    marginBottom: 6,
    marginTop: 12,
    fontWeight: "500",
  },

  input: {
    backgroundColor: "#f9fafb",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  feedbackBox: {
    marginTop: 16,
    padding: 10,
    borderRadius: 10,
  },

  feedbackError: {
    backgroundColor: "#fef2f2",
  },

  feedbackSuccess: {
    backgroundColor: "#ecfdf5",
  },

  feedbackText: {
    fontSize: 13,
    color: "#374151",
  },

  button: {
    marginTop: 20,
    backgroundColor: "#111827",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "600",
  },

  signupButton: {
    marginTop: 15,
    alignItems: "center",
  },

  signupText: {
    color: "#1e40af",
    fontWeight: "600",
    fontSize: 13,
  },

  footer: {
    marginTop: 14,
    fontSize: 11,
    color: "#9ca3af",
    textAlign: "center",
  },
});
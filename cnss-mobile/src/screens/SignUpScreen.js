import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useState } from "react";
import axios from "axios";

export default function SignUpScreen({ navigation }) {
  const [assMat, setAssMat] = useState("");
  const [assIu, setAssIu] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSignUp = async () => {
    console.log("========================================");
    console.log("[STEP 1] Signup initiated by user.");
    
    // Log state values to ensure the text inputs are updating correctly
    console.log("[DATA DIAGNOSTIC] Current Form Values:", {
      assMat,
      assIu,
      email,
      passwordLength: password.length,
      confirmPasswordLength: confirmPassword.length,
    });

    // 1. Validation Check
    if (!assMat || !assIu || !email || !password || !confirmPassword) {
      console.log("[STEP 1 FAILED] Local Validation Error: Missing fields.");
      setIsError(true);
      setFeedbackMessage("Please fill in all fields.");
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      console.log("[STEP 1 FAILED] Local Validation Error: Passwords mismatch.");
      setIsError(true);
      setFeedbackMessage("Passwords do not match.");
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    console.log("[STEP 2] Local validation passed successfully.");

    // 2. Prepare Payload
    const payload = {
      ASS_MAT: assMat,
      BEN_IU: assIu,
      email: email,
      password: password,
    };
    
    const targetUrl = "http://192.168.137.70:3000/api/auth/register";
    console.log(`[STEP 3] Preparing Network Request.`);
    console.log(`[STEP 3 Target URL]: ${targetUrl}`);
    console.log(`[STEP 3 Body payload]:`, JSON.stringify(payload));

    try {
      console.log("[STEP 4] Sending axios.post request now...");
      
      const response = await axios.post(targetUrl, payload, {
        timeout: 5000 // Throws an error if server doesn't respond in 5 seconds
      });

      console.log("[STEP 5 SUCCESS] Server responded to request.");
      console.log("[STEP 5 Server Response Status]:", response.status);
      console.log("[STEP 5 Server Response Data]:", response.data);

      setIsError(false);
      setFeedbackMessage("Account created successfully.");
      Alert.alert("Success", "Account created successfully");

      console.log("[STEP 6] Triggering navigation.goBack().");
      navigation.goBack();

    } catch (error) {
      console.error("[STEP 4 FAILED] Network request or server crash encountered.");
      
      if (error.response) {
        console.error("[SERVER ERROR] Status:", error.response.status);
        console.error("[SERVER ERROR] Data:", error.response.data);
        console.error("[SERVER ERROR] Headers:", error.response.headers);

        const backendMessage = error.response?.data?.message || "Registration failed.";
        const friendlyMessage = backendMessage.includes("Invalid ASS_MAT") || backendMessage.includes("Invalid")
          ? "Your CNSS credentials do not exist in the system, so you cannot create an account."
          : backendMessage;

        setIsError(true);
        setFeedbackMessage(friendlyMessage);
        Alert.alert("Error", friendlyMessage);
      } else if (error.request) {
        // The request was made but no response was received (Timeout / Wrong IP)
        console.error("[NETWORK ERROR] No response received from server.");
        console.error("[NETWORK ERROR] Details:", error.request);
        Alert.alert(
          "Network Error", 
          "Cannot reach the server. Verify your backend is running at http://172.16.213.51:3000 and you are using an Android Emulator."
        );
      } else {
        console.error("[AXIOS CONFIG ERROR] Message:", error.message);
        setIsError(true);
        setFeedbackMessage("Unable to reach the server. Please try again later.");
        Alert.alert("Error", `Setup issue: ${error.message}`);
      }
    }
    console.log("========================================");
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.logo}>CNSS</Text>
        <Text style={styles.subtitle}>Create your account</Text>

        {/* ASS_MAT */}
        <Text style={styles.label}>Enterprise Matricule (ASS_MAT)</Text>
        <TextInput
          value={assMat}
          onChangeText={setAssMat}
          placeholder="ASS_MAT"
          style={styles.input}
        />

        {/* BEN_IU */}
        <Text style={styles.label}>Enterprise Unique ID (BEN_IU)</Text>
        <TextInput
          value={assIu}
          onChangeText={setAssIu}
          placeholder="BEN_IU"
          style={styles.input}
        />

        {/* Email */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="example@gmail.com"
          keyboardType="email-address"
          style={styles.input}
        />

        {/* Password */}
        <Text style={styles.label}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="••••••••"
          style={styles.input}
        />

        {/* Confirm */}
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholder="••••••••"
          style={styles.input}
        />

        {feedbackMessage ? (
          <View style={[styles.feedbackBox, isError ? styles.feedbackError : styles.feedbackSuccess]}>
            <Text style={styles.feedbackText}>{feedbackMessage}</Text>
          </View>
        ) : null}

        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>
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
  },
  subtitle: {
    textAlign: "center",
    color: "#6b7280",
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    color: "#374151",
    marginTop: 10,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 12,
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
});

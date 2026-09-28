import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PROFILE_ENDPOINT = "http://192.168.137.70:3000/api/auth/me";

export default function ProfileScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const assMat = await AsyncStorage.getItem("assMat");

        console.log("[ProfileScreen] Token retrieved:", token || "<none>");
        console.log("[ProfileScreen] ASS_MAT retrieved:", assMat || "<none>");
        console.log("[ProfileScreen] API URL used:", PROFILE_ENDPOINT);

        if (!token) {
          console.log("[ProfileScreen] No token found in storage");
          setLoading(false);
          return;
        }

        const response = await axios.get(PROFILE_ENDPOINT, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000,
        });

        console.log("[ProfileScreen] API response:", response?.data);
        setProfile(response?.data?.data || null);
      } catch (error) {
        console.error("[ProfileScreen] Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const user = {
    name: [profile?.benNom, profile?.benPrenom].filter(Boolean).join(" ") || "Nom non disponible",
    lastName: profile?.benPrenom || "Non renseigné",
    address: profile?.benAdr || "Non renseigné",
  };

  const stats = [
    { label: "Cotisations", value: "15 ans", icon: "chart-line", color: "#3b82f6" },
    { label: "Solde Cotisé", value: "2,450 TND", icon: "wallet", color: "#10b981" },
    { label: "Dernière Déclaration", value: "15 juin 2025", icon: "calendar", color: "#f59e0b" },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Creative Header with gradient */}
      <View style={styles.header}>
        <View style={styles.gradientOverlay} />
        
        {/* Avatar Circle */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>ABS</Text>
          </View>
          <View style={styles.onlineIndicator} />
        </View>

        {/* User Name & Status */}
        <Text style={styles.userName}>{user.name}</Text>
        <View style={styles.statusBadge}>
          <Ionicons name="checkmark-circle" size={16} color="#10b981" />
          <Text style={styles.statusText}>{loading ? "Chargement..." : "Profil Actif"}</Text>
        </View>
      </View>

      {/* Stats Section with Cards */}
      <View style={styles.statsContainer}>
        {stats.map((stat, idx) => (
          <View key={idx} style={styles.statCard}>
            <View style={[styles.statIconBg, { backgroundColor: `${stat.color}15` }]}>
              <MaterialCommunityIcons name={stat.icon} size={24} color={stat.color} />
            </View>
            <Text style={styles.statLabel}>{stat.label}</Text>
            <Text style={styles.statValue}>{stat.value}</Text>
          </View>
        ))}
      </View>

      {/* Info Section */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Informations Personnelles</Text>
        
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoIconBg}>
              <Ionicons name="person" size={20} color="#3b82f6" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Nom</Text>
              <Text style={styles.infoValue}>{profile?.benNom || "Non renseigné"}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIconBg}>
              <Ionicons name="people" size={20} color="#f59e0b" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Prénom</Text>
              <Text style={styles.infoValue}>{user.lastName}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIconBg}>
              <Ionicons name="location" size={20} color="#ec4899" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Adresse</Text>
              <Text style={styles.infoValue}>{user.address}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Actions Rapides</Text>
        
        <TouchableOpacity style={styles.actionButton}>
          <View style={styles.actionIconBg}>
            <Ionicons name="lock-closed" size={20} color="#fff" />
          </View>
          <Text style={styles.actionText}>Modifier le Mot de Passe</Text>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <View style={styles.actionIconBg2}>
            <Ionicons name="eye" size={20} color="#fff" />
          </View>
          <Text style={styles.actionText}>Préférences de Notification</Text>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <View style={styles.actionIconBg3}>
            <Ionicons name="download" size={20} color="#fff" />
          </View>
          <Text style={styles.actionText}>Télécharger mes Données</Text>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate("Login") }>
        <Ionicons name="log-out" size={20} color="#ef4444" />
        <Text style={styles.logoutText}>Déconnexion</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    backgroundColor: "#1e3a8a",
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  gradientOverlay: {
    position: "absolute",
    shadowOpacity: 0.08,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#1e40af",
    opacity: 0.5,
  },
  avatarContainer: {
    position: "relative",
    zIndex: 10,
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: "900",
    color: "#fff",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#10b981",
    borderWidth: 3,
    borderColor: "#fff",
  },
  userName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 8,
    zIndex: 10,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 10,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: -20,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    alignItems: "center",
  },
  statIconBg: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "600",
    textAlign: "center",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1f2937",
    marginTop: 4,
    textAlign: "center",
  },
  infoSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  infoIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#9ca3af",
    fontWeight: "600",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1f2937",
  },
  divider: {
    height: 1,
    backgroundColor: "#f3f4f6",
  },
  actionsSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIconBg: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  actionIconBg2: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#8b5cf6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  actionIconBg3: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#06b6d4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  actionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#1f2937",
  },
  logoutButton: {
    marginHorizontal: 16,
    marginBottom: 24,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    backgroundColor: "#fef2f2",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#ef4444",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ef4444",
    marginLeft: 8,
  },
});

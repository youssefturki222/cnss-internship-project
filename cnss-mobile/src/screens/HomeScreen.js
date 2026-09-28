import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function HomeScreen() {
  const alerts = [
    { id: 1, title: "Déclaration Acceptée", desc: "Salaire mai 2025", icon: "check-circle", color: "#10b981" },
    { id: 2, title: "Paiement Reçu", desc: "Cotisation TND 250", icon: "wallet-plus", color: "#06b6d4" },
    { id: 3, title: "Dossier à Compléter", desc: "2 documents manquants", icon: "alert-circle", color: "#f59e0b" },
  ];

  const dashboard = [
    { label: "Années Cotisées", value: "15", color: "#3b82f6" },
    { label: "Total Cotisé", value: "2,450 TND", color: "#8b5cf6" },
    { label: "Droits Acquis", value: "100%", color: "#10b981" },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <View style={styles.heroBackground} />
        <View style={styles.heroContent}>
          <Text style={styles.greeting}>Bienvenue, Ahmed</Text>
          <Text style={styles.heroSubtitle}>Vos droits CNSS en un coup d'œil</Text>
        </View>
        <Ionicons name="notifications" size={28} color="#fff" />
      </View>

      {/* Quick Stats */}
      <View style={styles.statsSection}>
        {dashboard.map((stat, idx) => (
          <View key={idx} style={styles.statItem}>
            <View style={[styles.statDot, { backgroundColor: stat.color }]} />
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Alerts Section */}
      <View style={styles.alertsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🔔 Alertes</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>Voir tout</Text>
          </TouchableOpacity>
        </View>

        {alerts.map((alert) => (
          <TouchableOpacity key={alert.id} style={styles.alertCard}>
            <View style={[styles.alertIcon, { backgroundColor: `${alert.color}20` }]}>
              <MaterialCommunityIcons name={alert.icon} size={24} color={alert.color} />
            </View>
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>{alert.title}</Text>
              <Text style={styles.alertDesc}>{alert.desc}</Text>
            </View>
            <Ionicons name="arrow-forward" size={18} color="#d1d5db" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Actions Rapides</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionCard}>
            <View style={styles.actionIcon1}>
              <Ionicons name="document-text" size={24} color="#fff" />
            </View>
            <Text style={styles.actionText}>Relevé</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <View style={styles.actionIcon2}>
              <Ionicons name="download" size={24} color="#fff" />
            </View>
            <Text style={styles.actionText}>Certificat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <View style={styles.actionIcon3}>
              <Ionicons name="card" size={24} color="#fff" />
            </View>
            <Text style={styles.actionText}>Payer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <View style={styles.actionIcon4}>
              <Ionicons name="help-circle" size={24} color="#fff" />
            </View>
            <Text style={styles.actionText}>Aide</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  heroSection: {
    backgroundColor: "#2563eb",
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    position: "relative",
    overflow: "hidden",
  },
  heroBackground: {
    position: "absolute",
    top: 0,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  heroContent: {
    flex: 1,
    zIndex: 10,
  },
  greeting: {
    fontSize: 26,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
  },
  statsSection: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: -15,
    marginBottom: 24,
    gap: 10,
  },
  statItem: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  statDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "900",
    color: "#1f2937",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: "#6b7280",
    fontWeight: "600",
    textAlign: "center",
  },
  alertsSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1f2937",
  },
  viewAll: {
    fontSize: 12,
    color: "#2563eb",
    fontWeight: "700",
  },
  alertCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  alertIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 2,
  },
  alertDesc: {
    fontSize: 12,
    color: "#9ca3af",
    fontWeight: "500",
  },
  actionsSection: {
    paddingHorizontal: 16,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 12,
  },
  actionCard: {
    width: "23%",
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  actionIcon1: {
    width: "100%",
    height: "100%",
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  actionIcon2: {
    width: "100%",
    height: "100%",
    backgroundColor: "#8b5cf6",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  actionIcon3: {
    width: "100%",
    height: "100%",
    backgroundColor: "#10b981",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  actionIcon4: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f59e0b",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  actionText: {
    position: "absolute",
    bottom: 8,
    fontSize: 10,
    fontWeight: "700",
    color: "#1f2937",
    backgroundColor: "#fff",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
});

import { View, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function RequestsScreen() {
  const requests = [
    {
      id: 1,
      title: "Rendez-vous Agence",
      date: "25 Juillet 2025",
      time: "10:00 - 11:00",
      status: "Confirmé",
      statusColor: "#10b981",
      icon: "calendar-check",
    },
    {
      id: 2,
      title: "Demande de Certificat",
      date: "20 Juillet 2025",
      time: "En attente de traitement",
      status: "En attente",
      statusColor: "#f59e0b",
      icon: "document-pending",
    },
    {
      id: 3,
      title: "Modification Données",
      date: "15 Juillet 2025",
      time: "Traité",
      status: "Complété",
      statusColor: "#06b6d4",
      icon: "pencil-check",
    },
  ];

  const renderRequest = ({ item }) => (
    <TouchableOpacity style={styles.requestCard}>
      <View style={styles.requestLeft}>
        <View style={[styles.requestIconBg, { backgroundColor: `${item.statusColor}20` }]}>
          <MaterialCommunityIcons name={item.icon} size={24} color={item.statusColor} />
        </View>
        <View style={styles.requestInfo}>
          <Text style={styles.requestTitle}>{item.title}</Text>
          <Text style={styles.requestDate}>{item.date}</Text>\n          <Text style={styles.requestTime}>{item.time}</Text>
        </View>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: `${item.statusColor}15` }]}>
        <Text style={[styles.statusLabel, { color: item.statusColor }]}>{item.status}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📋 Mes Demandes</Text>
        <Text style={styles.headerSubtitle}>Suivi de vos requêtes</Text>
      </View>

      {/* New Request Button */}
      <TouchableOpacity style={styles.newRequestBtn}>
        <Ionicons name="add-circle" size={22} color="#fff" />
        <Text style={styles.newRequestText}>Nouvelle Demande</Text>
      </TouchableOpacity>

      {/* Active Requests */}
      <View style={styles.requestsSection}>
        <Text style={styles.sectionTitle}>Demandes Actives</Text>
        <FlatList
          data={requests}
          renderItem={renderRequest}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
        />
      </View>

      {/* Info Box */}
      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={24} color="#1e3a8a" />
        <View style={styles.infoContent}>
          <Text style={styles.infoTitle}>Délai de traitement</Text>
          <Text style={styles.infoText}>Les demandes sont généralement traitées en 5-7 jours</Text>
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
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#1f2937",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#9ca3af",
    fontWeight: "500",
  },
  newRequestBtn: {
    marginHorizontal: 16,
    marginVertical: 16,
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2563eb",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  newRequestText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 8,
  },
  requestsSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: 12,
  },
  requestCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  requestLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  requestIconBg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  requestInfo: {
    flex: 1,
  },
  requestTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 2,
  },
  requestDate: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
    marginBottom: 2,
  },
  requestTime: {
    fontSize: 11,
    color: "#9ca3af",
    fontWeight: "500",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: "700",
  },
  infoBox: {
    marginHorizontal: 16,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#eef2ff",
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#1e3a8a",
    padding: 14,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 2,
  },
  infoText: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
});

import { View, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function ReclamationsScreen() {
  const complaints = [
    {
      id: 1,
      type: "Déclaration de Salaire",
      status: "En Cours",
      date: "12 juin 2025",
      priority: "Haute",
      color: "#f59e0b",
    },
    {
      id: 2,
      type: "Cotisation Manquante",
      status: "Résolu",
      date: "5 juin 2025",
      priority: "Moyenne",
      color: "#10b981",
    },
    {
      id: 3,
      type: "Erreur de Calcul",
      status: "En Attente",
      date: "28 mai 2025",
      priority: "Basse",
      color: "#06b6d4",
    },
  ];

  const renderComplaint = ({ item }) => (
    <TouchableOpacity style={styles.complaintCard}>
      <View style={styles.complaintHeader}>
        <View style={[styles.statusDot, { backgroundColor: item.color }]} />
        <View style={styles.complaintInfo}>
          <Text style={styles.complaintType}>{item.type}</Text>
          <Text style={styles.complaintDate}>{item.date}</Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <View style={styles.priorityBar}>
        <View
          style={[
            styles.priorityIndicator,
            { backgroundColor: item.color },
            item.priority === "Haute" && { flex: 1 },
            item.priority === "Moyenne" && { flex: 0.6 },
            item.priority === "Basse" && { flex: 0.3 },
          ]}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Mes Réclamations</Text>
          <Text style={styles.headerSubtitle}>Suivi de vos demandes et réclamations</Text>
        </View>
        <View style={styles.headerIcon}>
          <MaterialCommunityIcons name="alert-box" size={40} color="#fff" />
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsRow}>
        <View style={[styles.statBox, { backgroundColor: "#fef3c7", borderLeftColor: "#f59e0b" }]}>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Réclamations</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: "#dcfce7", borderLeftColor: "#10b981" }]}>
          <Text style={styles.statNumber}>1</Text>
          <Text style={styles.statLabel}>Résolues</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: "#cffafe", borderLeftColor: "#06b6d4" }]}>
          <Text style={styles.statNumber}>2</Text>
          <Text style={styles.statLabel}>En Attente</Text>
        </View>
      </View>

      {/* New Complaint Button */}
      <TouchableOpacity style={styles.newComplaintBtn}>
        <Ionicons name="add-circle" size={24} color="#fff" />
        <Text style={styles.newComplaintText}>Déposer une Réclamation</Text>
      </TouchableOpacity>

      {/* Complaints List */}
      <View style={styles.complaintsList}>
        <Text style={styles.sectionTitle}>Historique des Réclamations</Text>
        <FlatList
          data={complaints}
          renderItem={renderComplaint}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
        />
      </View>

      {/* FAQ Section */}
      <View style={styles.faqSection}>
        <Text style={styles.sectionTitle}>Questions Fréquentes</Text>
        
        <TouchableOpacity style={styles.faqItem}>
          <View style={styles.faqHeader}>
            <Text style={styles.faqQuestion}>Comment signaler une erreur ?</Text>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.faqItem}>
          <View style={styles.faqHeader}>
            <Text style={styles.faqQuestion}>Délais de traitement ?</Text>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.faqItem}>
          <View style={styles.faqHeader}>
            <Text style={styles.faqQuestion}>Besoin d'assistance ?</Text>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </View>
        </TouchableOpacity>
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
    backgroundColor: "#dc2626",
    paddingHorizontal: 20,
    paddingVertical: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "500",
  },
  headerIcon: {
    opacity: 0.3,
  },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#4b5563",
  },
  newComplaintBtn: {
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2563eb",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  newComplaintText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
  complaintsList: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: 16,
  },
  complaintCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  complaintHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  complaintInfo: {
    flex: 1,
  },
  complaintType: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 2,
  },
  complaintDate: {
    fontSize: 12,
    color: "#9ca3af",
    fontWeight: "500",
  },
  statusBadge: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#4b5563",
  },
  priorityBar: {
    height: 4,
    backgroundColor: "#e5e7eb",
    borderRadius: 2,
    overflow: "hidden",
  },
  priorityIndicator: {
    height: "100%",
    borderRadius: 2,
  },
  faqSection: {
    paddingHorizontal: 16,
  },
  faqItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
    flex: 1,
  },
});

import { View, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function ServiceRetraiteScreen() {
  const retirementInfo = {
    currentAge: 42,
    retirementAge: 60,
    yearsUntilRetirement: 18,
    estimatedPension: "3,250 TND",
    contributionYears: 15,
  };

  const services = [
    { id: 1, title: "Simulateur Retraite", icon: "calculator", color: "#3b82f6" },
    { id: 2, title: "Relevé Carrière", icon: "document-text", color: "#8b5cf6" },
    { id: 3, title: "Demande Pension", icon: "checkmark-circle", color: "#10b981" },
    { id: 4, title: "Attestations", icon: "download", color: "#f59e0b" },
    { id: 5, title: "Historique Paiement", icon: "cash", color: "#06b6d4" },
    { id: 6, title: "Bénéficiaires", icon: "people", color: "#ec4899" },
  ];

  const renderService = ({ item }) => (
    <TouchableOpacity style={styles.serviceCard}>
      <View style={[styles.serviceIconBg, { backgroundColor: `${item.color}15` }]}>
        <MaterialCommunityIcons name={item.icon} size={28} color={item.color} />
      </View>
      <Text style={styles.serviceTitle}>{item.title}</Text>
      <Ionicons name="arrow-forward" size={16} color={item.color} />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Retirement Status Card */}
      <View style={styles.statusCard}>
        <View style={styles.statusGradient}>
          <View style={styles.statusContent}>
            <Text style={styles.statusLabel}>Âge Actuel</Text>
            <Text style={styles.statusValue}>{retirementInfo.currentAge} ans</Text>
          </View>
          <View style={styles.dividerLine} />
          <View style={styles.statusContent}>
            <Text style={styles.statusLabel}>Âge Retraite</Text>
            <Text style={styles.statusValue}>{retirementInfo.retirementAge} ans</Text>
          </View>
        </View>

        {/* Progress Ring */}
        <View style={styles.progressSection}>
          <View style={styles.progressCircle}>
            <Text style={styles.progressText}>{retirementInfo.yearsUntilRetirement}</Text>
            <Text style={styles.progressLabel}>ans restants</Text>
          </View>
          <View style={styles.progressInfo}>
            <Text style={styles.infoLabel}>Années de Cotisation</Text>
            <Text style={styles.infoValue}>{retirementInfo.contributionYears} ans</Text>
            <Text style={styles.infoHint}>15+ ans requis pour la retraite</Text>
          </View>
        </View>
      </View>

      {/* Pension Estimate Card */}
      <View style={styles.estimateCard}>
        <View style={styles.estimateHeader}>
          <Ionicons name="wallet" size={28} color="#10b981" />
          <View>
            <Text style={styles.estimateLabel}>Pension Estimée</Text>
            <Text style={styles.estimateValue}>{retirementInfo.estimatedPension}</Text>
          </View>
        </View>
        <Text style={styles.estimateHint}>Projection basée sur votre historique actuel</Text>
        <TouchableOpacity style={styles.simulatorBtn}>
          <Text style={styles.simulatorBtnText}>Utiliser le Simulateur</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Info Boxes */}
      <View style={styles.infoBoxesRow}>
        <View style={[styles.infoBox, { backgroundColor: "#eef2ff" }]}>
          <MaterialCommunityIcons name="shield-check" size={32} color="#3b82f6" />
          <Text style={styles.infoBoxTitle}>Droits Validés</Text>
          <Text style={styles.infoBoxValue}>100%</Text>
        </View>
        <View style={[styles.infoBox, { backgroundColor: "#f0fdf4" }]}>
          <MaterialCommunityIcons name="check-all" size={32} color="#10b981" />
          <Text style={styles.infoBoxTitle}>Dossier Complet</Text>
          <Text style={styles.infoBoxValue}>✓</Text>
        </View>
      </View>

      {/* Services Grid */}
      <View style={styles.servicesSection}>
        <Text style={styles.sectionTitle}>Services Retraite</Text>
        <FlatList
          data={services}
          renderItem={renderService}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.servicesGrid}
          scrollEnabled={false}
        />
      </View>

      {/* Documents Section */}
      <View style={styles.documentsSection}>
        <Text style={styles.sectionTitle}>Derniers Documents</Text>
        
        <TouchableOpacity style={styles.documentItem}>
          <View style={styles.docIconBg}>
            <Ionicons name="document" size={24} color="#ef4444" />
          </View>
          <View style={styles.docContent}>
            <Text style={styles.docTitle}>Relevé de Carrière 2025</Text>
            <Text style={styles.docDate}>Généré le 15 juin 2025</Text>
          </View>
          <Ionicons name="download" size={20} color="#3b82f6" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.documentItem}>
          <View style={styles.docIconBg}>
            <Ionicons name="document" size={24} color="#3b82f6" />
          </View>
          <View style={styles.docContent}>
            <Text style={styles.docTitle}>Attestation de Paiement</Text>
            <Text style={styles.docDate}>Généré le 10 juin 2025</Text>
          </View>
          <Ionicons name="download" size={20} color="#3b82f6" />
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
  statusCard: {
    margin: 16,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  statusGradient: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  statusContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  statusLabel: {
    fontSize: 13,
    color: "#9ca3af",
    fontWeight: "600",
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 22,
    fontWeight: "900",
    color: "#1f2937",
  },
  dividerLine: {
    width: 1,
    height: 50,
    backgroundColor: "#e5e7eb",
  },
  progressSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#3b82f6",
    marginRight: 16,
  },
  progressText: {
    fontSize: 28,
    fontWeight: "900",
    color: "#3b82f6",
  },
  progressLabel: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "600",
  },
  progressInfo: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#9ca3af",
    fontWeight: "600",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 20,
    fontWeight: "900",
    color: "#1f2937",
    marginBottom: 4,
  },
  infoHint: {
    fontSize: 11,
    color: "#10b981",
    fontWeight: "500",
  },
  estimateCard: {
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: "#f0fdf4",
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 5,
    borderLeftColor: "#10b981",
  },
  estimateHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  estimateLabel: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "600",
    marginLeft: 12,
  },
  estimateValue: {
    fontSize: 24,
    fontWeight: "900",
    color: "#10b981",
    marginLeft: 12,
  },
  estimateHint: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 12,
    fontWeight: "500",
  },
  simulatorBtn: {
    backgroundColor: "#10b981",
    paddingVertical: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  simulatorBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  infoBoxesRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  infoBox: {
    flex: 1,
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  infoBoxTitle: {
    fontSize: 12,
    color: "#4b5563",
    fontWeight: "600",
    marginTop: 8,
    marginBottom: 4,
  },
  infoBoxValue: {
    fontSize: 18,
    fontWeight: "900",
    color: "#1f2937",
  },
  servicesSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: 16,
  },
  servicesGrid: {
    gap: 12,
  },
  serviceCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  serviceIconBg: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  serviceTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 8,
  },
  documentsSection: {
    paddingHorizontal: 16,
  },
  documentItem: {
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
  docIconBg: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  docContent: {
    flex: 1,
  },
  docTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 2,
  },
  docDate: {
    fontSize: 12,
    color: "#9ca3af",
    fontWeight: "500",
  },
});

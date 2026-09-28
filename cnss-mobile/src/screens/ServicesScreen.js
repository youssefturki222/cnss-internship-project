import { View, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function ServicesScreen() {
  const services = [
    {
      id: 1,
      title: "Télécharger Relevé Carrière",
      desc: "Votre historique professionnel complet",
      icon: "file-document",
      color: "#3b82f6",
      action: "Télécharger",
    },
    {
      id: 2,
      title: "Certificat de Cotisation",
      desc: "Attestation de vos versements",
      icon: "certificate",
      color: "#8b5cf6",
      action: "Générer",
    },
    {
      id: 3,
      title: "Historique Paiements",
      desc: "Vos transactions et paiements",
      icon: "history",
      color: "#10b981",
      action: "Consulter",
    },
    {
      id: 4,
      title: "Attestation Employeur",
      desc: "Pour vos employeurs potentiels",
      icon: "briefcase",
      color: "#f59e0b",
      action: "Demander",
    },
  ];

  const renderService = ({ item }) => (
    <TouchableOpacity style={styles.serviceCard}>
      <View style={[styles.serviceIconBg, { backgroundColor: `${item.color}15` }]}>
        <MaterialCommunityIcons name={item.icon} size={28} color={item.color} />
      </View>
      <View style={styles.serviceContent}>
        <Text style={styles.serviceTitle}>{item.title}</Text>
        <Text style={styles.serviceDesc}>{item.desc}</Text>
      </View>
      <View style={[styles.actionBadge, { backgroundColor: `${item.color}15` }]}>
        <Text style={[styles.actionBadgeText, { color: item.color }]}>{item.action}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📋 Services CNSS</Text>
        <Text style={styles.headerSubtitle}>Accédez à vos documents</Text>
      </View>

      {/* Main Services */}
      <View style={styles.servicesSection}>
        <Text style={styles.sectionTitle}>Services Disponibles</Text>
        <FlatList
          data={services}
          renderItem={renderService}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
        />
      </View>

      {/* Help Section */}
      <View style={styles.helpSection}>
        <View style={styles.helpCard}>
          <MaterialCommunityIcons name="help-circle" size={32} color="#06b6d4" />
          <Text style={styles.helpTitle}>Besoin d'aide ?</Text>
          <Text style={styles.helpText}>Contactez notre support</Text>
          <TouchableOpacity style={styles.helpBtn}>
            <Text style={styles.helpBtnText}>Envoyer un message</Text>
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
  servicesSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: 12,
  },
  serviceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  serviceIconBg: {
    width: 52,
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  serviceContent: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 2,
  },
  serviceDesc: {
    fontSize: 12,
    color: "#9ca3af",
    fontWeight: "500",
  },
  actionBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionBadgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  helpSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  helpCard: {
    backgroundColor: "#f0f9ff",
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#06b6d4",
    padding: 20,
    alignItems: "center",
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1f2937",
    marginTop: 12,
    marginBottom: 4,
  },
  helpText: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 12,
  },
  helpBtn: {
    backgroundColor: "#06b6d4",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  helpBtnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
});

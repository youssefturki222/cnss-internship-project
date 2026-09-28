import { View, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function NotificationsScreen() {
  const notifications = [
    {
      id: 1,
      type: "Déclaration",
      title: "Votre déclaration a été acceptée",
      desc: "Salaire mai 2025 - Traité avec succès",
      time: "Il y a 2 heures",
      read: true,
      icon: "check-circle",
      color: "#10b981",
    },
    {
      id: 2,
      type: "Paiement",
      title: "Paiement reçu",
      desc: "Cotisation de TND 250 enregistrée",
      time: "Il y a 5 heures",
      read: true,
      icon: "wallet-plus",
      color: "#06b6d4",
    },
    {
      id: 3,
      type: "Alerte",
      title: "Documents manquants",
      desc: "2 documents requis pour votre dossier",
      time: "Hier",
      read: false,
      icon: "alert-circle",
      color: "#f59e0b",
    },
    {
      id: 4,
      type: "Retraite",
      title: "Info Retraite disponible",
      desc: "Consultez votre simulateur de retraite mis à jour",
      time: "Il y a 2 jours",
      read: false,
      icon: "calendar-heart",
      color: "#8b5cf6",
    },
  ];

  const renderNotification = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.notificationCard,
        !item.read && styles.unreadNotification
      ]}
    >
      <View style={[styles.notifIcon, { backgroundColor: `${item.color}15` }]}>
        <MaterialCommunityIcons name={item.icon} size={24} color={item.color} />
      </View>
      <View style={styles.notifContent}>
        <View style={styles.notifHeader}>
          <Text style={styles.notifTitle}>{item.title}</Text>
          {!item.read && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.notifDesc}>{item.desc}</Text>
        <Text style={styles.notifTime}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Notifications</Text>
          <Text style={styles.headerSubtitle}>Restez informé de vos mises à jour</Text>
        </View>
        <TouchableOpacity style={styles.settingsBtn}>
          <Ionicons name="settings" size={24} color="#1e3a8a" />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        <TouchableOpacity style={[styles.filterTab, styles.filterTabActive]}>
          <Text style={[styles.filterText, styles.filterTextActive]}>Tous</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterTab}>
          <Text style={styles.filterText}>Non lus</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterTab}>
          <Text style={styles.filterText}>Importants</Text>
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      <View style={styles.notificationsList}>
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsSection}>
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="checkmark-done" size={20} color="#1e3a8a" />
          <Text style={styles.actionText}>Marquer tout comme lu</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.actionBtnSecondary]}>
          <Ionicons name="trash" size={20} color="#ef4444" />
          <Text style={[styles.actionText, styles.actionTextSecondary]}>Supprimer tout</Text>
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
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerContent: {
    flex: 1,
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
  settingsBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  filterTabs: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
  },
  filterTabActive: {
    backgroundColor: "#1e3a8a",
  },
  filterText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6b7280",
  },
  filterTextActive: {
    color: "#fff",
  },
  notificationsList: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  notificationCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  unreadNotification: {
    backgroundColor: "#fafbff",
    borderLeftWidth: 3,
    borderLeftColor: "#1e3a8a",
  },
  notifIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  notifContent: {
    flex: 1,
  },
  notifHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  notifTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1f2937",
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#1e3a8a",
    marginLeft: 8,
  },
  notifDesc: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "500",
    marginBottom: 4,
  },
  notifTime: {
    fontSize: 11,
    color: "#9ca3af",
    fontWeight: "500",
  },
  actionsSection: {
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 20,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
    paddingVertical: 12,
    borderRadius: 10,
  },
  actionBtnSecondary: {
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fed7d7",
  },
  actionText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1e3a8a",
    marginLeft: 8,
  },
  actionTextSecondary: {
    color: "#ef4444",
  },
});

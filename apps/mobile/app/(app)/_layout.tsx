import { Tabs } from "expo-router";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { House, ShoppingCart, Package, ChartColumnBig, Bell, Settings, type LucideProps } from "lucide-react-native";
import { useAuth } from "../../store/auth";
import { colors, shadow } from "../../components/theme";

function TabIcon({ icon: Icon, color, focused }: { icon: React.ComponentType<LucideProps>; color: string; focused: boolean }) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <Icon size={22} color={color} strokeWidth={focused ? 2.6 : 2} />
    </View>
  );
}

export default function AppLayout() {
  const user = useAuth((s) => s.user);
  const isAdmin = user?.role === "ADMIN";
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarShowLabel: true,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "700", marginTop: 2 },
        tabBarStyle: [
          styles.tabBar,
          { height: 58 + insets.bottom, paddingBottom: insets.bottom + 6 },
        ],
        tabBarItemStyle: { paddingTop: 6 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "الرئيسية", tabBarIcon: ({ color, focused }) => <TabIcon icon={House} color={color} focused={focused} /> }}
      />
      <Tabs.Screen
        name="pos/index"
        options={{ title: "نقطة البيع", tabBarIcon: ({ color, focused }) => <TabIcon icon={ShoppingCart} color={color} focused={focused} /> }}
      />
      <Tabs.Screen
        name="inventory/index"
        options={{ title: "المخزون", tabBarIcon: ({ color, focused }) => <TabIcon icon={Package} color={color} focused={focused} /> }}
      />
      {/* تبويبات المدير فقط — تُخفى عن CASHIER (FR-040) */}
      <Tabs.Screen
        name="reports/index"
        options={{
          title: "التقارير",
          tabBarIcon: ({ color, focused }) => <TabIcon icon={ChartColumnBig} color={color} focused={focused} />,
          href: isAdmin ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="alerts/index"
        options={{
          title: "التنبيهات",
          tabBarIcon: ({ color, focused }) => <TabIcon icon={Bell} color={color} focused={focused} />,
          href: isAdmin ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="settings/index"
        options={{ title: "الإعدادات", tabBarIcon: ({ color, focused }) => <TabIcon icon={Settings} color={color} focused={focused} /> }}
      />
      {/* مسار مخفي (يُفتح من الرئيسية) — ليس تبويبًا */}
      <Tabs.Screen name="debts/index" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.card,
    borderTopWidth: 0,
    paddingTop: 6,
    ...shadow.lg,
  },
  iconWrap: { width: 46, height: 30, borderRadius: 999, alignItems: "center", justifyContent: "center" },
  iconWrapActive: { backgroundColor: colors.primaryLight },
});

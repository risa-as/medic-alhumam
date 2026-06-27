// مودال مسح باركود قابل لإعادة الاستخدام (نقطة البيع + المخزون).
import { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from "expo-camera";
import { X, ScanLine, Zap, ZapOff } from "lucide-react-native";
import { colors, spacing, radius, font } from "./theme";
import { Button } from "./ui";

const BARCODE_TYPES = ["ean13", "ean8", "upc_a", "upc_e", "code128", "code39", "code93", "codabar", "itf14", "qr"] as const;

export function BarcodeScannerModal({
  visible,
  onClose,
  onScan,
  title = "مسح الباركود",
  hint = "وجّه الكاميرا نحو الباركود",
}: {
  visible: boolean;
  onClose: () => void;
  onScan: (code: string) => void;
  title?: string;
  hint?: string;
}) {
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [torch, setTorch] = useState(false);
  const lock = useRef(false);

  // عند كل فتح: أعد ضبط القفل والفلاش، واطلب الإذن إن لزم.
  useEffect(() => {
    if (!visible) return;
    lock.current = false;
    setTorch(false);
    if (permission && !permission.granted && permission.canAskAgain) void requestPermission();
  }, [visible]);

  function handle(result: BarcodeScanningResult) {
    if (lock.current) return;
    lock.current = true; // مسحة واحدة لكل فتح — تمنع التكرار
    onScan(result.data.trim());
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.root}>
        {permission?.granted ? (
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            enableTorch={torch}
            barcodeScannerSettings={{ barcodeTypes: [...BARCODE_TYPES] }}
            onBarcodeScanned={handle}
          />
        ) : (
          <View style={styles.perm}>
            <ScanLine size={48} color={colors.white} strokeWidth={1.8} />
            <Text style={styles.permText}>نحتاج إذن الكاميرا لمسح الباركود</Text>
            <Button title="منح الإذن" onPress={() => void requestPermission()} full={false} />
          </View>
        )}

        <View style={[styles.topBar, { paddingTop: insets.top + spacing.sm }]} pointerEvents="box-none">
          <TouchableOpacity style={styles.circle} onPress={onClose} hitSlop={8}>
            <X size={22} color={colors.white} strokeWidth={2.4} />
          </TouchableOpacity>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity style={styles.circle} onPress={() => setTorch((t) => !t)} hitSlop={8}>
            {torch ? <ZapOff size={20} color={colors.white} strokeWidth={2.2} /> : <Zap size={20} color={colors.white} strokeWidth={2.2} />}
          </TouchableOpacity>
        </View>

        <View style={styles.center} pointerEvents="none">
          <View style={styles.frame} />
          <Text style={styles.hint}>{hint}</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#000" },
  perm: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center", gap: spacing.lg, padding: spacing.xxl },
  permText: { color: colors.white, fontSize: font.base, textAlign: "center" },
  topBar: { position: "absolute", top: 0, left: 0, right: 0, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  circle: { width: 42, height: 42, borderRadius: 21, backgroundColor: "rgba(0,0,0,0.45)", alignItems: "center", justifyContent: "center" },
  title: { color: colors.white, fontSize: font.md, fontWeight: "800" },
  center: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center", gap: spacing.lg },
  frame: { width: 240, height: 160, borderRadius: radius.lg, borderWidth: 3, borderColor: colors.white, backgroundColor: "transparent" },
  hint: { color: colors.white, fontSize: font.base, fontWeight: "600", textShadowColor: "rgba(0,0,0,0.6)", textShadowRadius: 4 },
});

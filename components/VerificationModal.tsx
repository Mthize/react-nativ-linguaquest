import { colors, fontFamily } from "@/constants/theme";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type VerificationModalProps = {
  email?: string;
  error?: string;
  onResend?: () => Promise<void>;
  onVerify?: (code: string) => Promise<void>;
  visible: boolean;
  onClose: () => void;
};

const CODE_LENGTH = 6;

export function VerificationModal({
  email,
  error,
  onResend,
  onVerify,
  visible,
  onClose,
}: VerificationModalProps) {
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const inputs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (!visible) {
      return;
    }

    setCode(Array(CODE_LENGTH).fill(""));
    const focusTimer = setTimeout(() => {
      inputs.current[0]?.focus();
    }, 100);

    return () => clearTimeout(focusTimer);
  }, [visible]);

  function resetAndClose() {
    setCode(Array(CODE_LENGTH).fill(""));
    onClose();
  }

  async function completeVerification(nextCode: string[]) {
    setCode(nextCode);
    if (onVerify) {
      await onVerify(nextCode.join(""));
      return;
    }

    onClose();
    router.replace("/");
  }

  async function handleDigitChange(value: string, index: number) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const nextCode = [...code];
    nextCode[index] = digit;

    if (!digit) {
      setCode(nextCode);
      return;
    }

    if (index === CODE_LENGTH - 1) {
      await completeVerification(nextCode);
      return;
    }

    setCode(nextCode);
    inputs.current[index + 1]?.focus();
  }

  function handleKeyPress(key: string, index: number) {
    if (key !== "Backspace" || code[index] || index === 0) {
      return;
    }

    inputs.current[index - 1]?.focus();
  }

  return (
    <Modal
      animationType="fade"
      onRequestClose={resetAndClose}
      transparent
      visible={visible}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.backdrop}>
          <View style={styles.card}>
            <Text style={styles.title}>Check your email</Text>
            <Text style={styles.message}>
              You have received an email. Enter the 6-digit verification code to
              continue{email ? ` sent to ${email}` : ""}.
            </Text>

            <View style={styles.codeRow}>
              {code.map((digit, index) => (
                <TextInput
                  caretHidden
                  key={index}
                  keyboardType="number-pad"
                  maxLength={1}
                  onChangeText={(value) => handleDigitChange(value, index)}
                  onKeyPress={({ nativeEvent }) =>
                    handleKeyPress(nativeEvent.key, index)
                  }
                  ref={(input) => {
                    inputs.current[index] = input;
                  }}
                  returnKeyType="done"
                  style={styles.codeInput}
                  textContentType="oneTimeCode"
                  value={digit}
                />
              ))}
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            {onResend ? (
              <Text onPress={onResend} style={styles.resendText}>
                Resend code
              </Text>
            ) : null}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "rgba(13, 19, 43, 0.42)",
    flex: 1,
    justifyContent: "flex-end",
    padding: 22,
  },
  card: {
    backgroundColor: colors.neutral.background,
    borderCurve: "continuous",
    borderRadius: 28,
    gap: 18,
    paddingBottom: 28,
    paddingHorizontal: 22,
    paddingTop: 26,
  },
  codeInput: {
    backgroundColor: colors.neutral.surface,
    borderColor: colors.neutral.border,
    borderRadius: 16,
    borderWidth: 1,
    color: colors.neutral.textPrimary,
    fontFamily: fontFamily.semiBold,
    fontSize: 20,
    height: 52,
    textAlign: "center",
    width: 44,
  },
  codeRow: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
  },
  keyboardView: {
    flex: 1,
  },
  message: {
    color: colors.neutral.textSecondary,
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
  },
  errorText: {
    color: colors.semantic.error,
    fontFamily: fontFamily.regular,
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
  },
  resendText: {
    color: colors.primary.purple,
    fontFamily: fontFamily.semiBold,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  title: {
    color: colors.neutral.textPrimary,
    fontFamily: fontFamily.bold,
    fontSize: 24,
    lineHeight: 31,
    textAlign: "center",
  },
});

export default VerificationModal;

import { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  visible: boolean;
  email: string;
  onClose: () => void;
  onVerify: (code: string) => Promise<void>;
  onResend: () => Promise<void>;
  error?: string;
}

export default function VerificationModal({
  visible,
  email,
  onClose,
  onVerify,
  onResend,
  error,
}: Props) {
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) {
      setCode("");
      setIsSubmitting(false);
      const timer = setTimeout(() => inputRef.current?.focus(), 300);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  // Reset code and loading state when parent reports an error
  useEffect(() => {
    if (error) {
      setCode("");
      setIsSubmitting(false);
    }
  }, [error]);

  const handleCodeChange = async (text: string) => {
    if (isSubmitting) {
      return;
    }

    const digits = text.replace(/[^0-9]/g, "").slice(0, 6);
    setCode(digits);

    if (digits.length === 6) {
      setIsSubmitting(true);

      try {
        await onVerify(digits);
      } catch {
        // Keep verification errors inside the modal flow.
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleResend = async () => {
    if (isSubmitting) {
      return;
    }

    setCode("");
    setIsSubmitting(true);

    try {
      await onResend();
    } catch {
      // Keep resend errors inside the modal flow.
    } finally {
      setIsSubmitting(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>

        <View className="items-center rounded-t-[28px] bg-white px-6 pt-7 pb-10">
          {/* Close button */}
          <TouchableOpacity
            onPress={onClose}
            className="absolute top-4 right-5 p-1"
          >
            <Ionicons name="close" size={22} color="#6b7280" />
          </TouchableOpacity>

          <Text className="mb-2 text-center font-poppins-semibold text-[22px] text-text-primary">
            Check your email
          </Text>
          <Text className="body-md mb-8 text-center text-text-secondary">
            We sent a 6-digit code to{"\n"}
            <Text className="font-poppins-medium text-text-primary">
              {email || "your email"}
            </Text>
          </Text>

          {/* Code boxes — tap to focus hidden input */}
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => inputRef.current?.focus()}
            className="mb-4 flex-row gap-2.5"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <View
                key={i}
                className={`h-14 w-12 items-center justify-center rounded-[14px] border-[1.5px] ${
                  code[i]
                    ? "border-lingua-purple bg-[#f5f2ff]"
                    : i === code.length
                      ? "border-lingua-purple bg-white"
                      : "border-border bg-white"
                }`}
              >
                <Text className="font-poppins-semibold text-[20px] text-text-primary">
                  {code[i] ?? ""}
                </Text>
              </View>
            ))}
          </TouchableOpacity>

          {/* Hidden number-pad input */}
          <TextInput
            ref={inputRef}
            value={code}
            onChangeText={handleCodeChange}
            keyboardType="number-pad"
            maxLength={6}
            style={styles.hiddenInput}
            editable={!isSubmitting}
          />

          {/* Error message */}
          {error ? (
            <Text className="body-sm mb-2 text-center text-error">
              {error}
            </Text>
          ) : null}

          <TouchableOpacity className="mt-2 py-1" onPress={handleResend}>
            <Text className="body-sm text-text-secondary">
              Didn&apos;t receive it?{" "}
              <Text className="font-poppins-medium text-lingua-purple">
                Resend
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  hiddenInput: {
    position: "absolute",
    opacity: 0,
    width: 1,
    height: 1,
  },
});

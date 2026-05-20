import { VerificationModal } from "@/components/verification-modal";
import { images } from "@/constants/images";
import { colors, fontFamily } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type AuthScreenProps = {
  mode: "sign-up" | "sign-in";
};

type SocialProvider = {
  icon: "google" | "facebook" | "apple";
  label: string;
};

const socialProviders: SocialProvider[] = [
  { icon: "google", label: "Continue with Google" },
  { icon: "facebook", label: "Continue with Facebook" },
  { icon: "apple", label: "Continue with Apple" },
];

export function AuthScreen({ mode }: AuthScreenProps) {
  const [email, setEmail] = useState("alex@gmail.com");
  const [modalVisible, setModalVisible] = useState(false);
  const isSignUp = mode === "sign-up";

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          accessibilityLabel="Go back"
          activeOpacity={0.7}
          className="h-10 w-10 items-start justify-center"
          onPress={() => router.back()}
        >
          <Ionicons
            name="chevron-back"
            size={33}
            color={colors.neutral.textPrimary}
          />
        </TouchableOpacity>

        <View className="mt-8">
          <Text className="font-poppins-bold text-[30px] leading-[37px] text-text-primary">
            {isSignUp ? "Create your account" : "Welcome back"}
          </Text>
          <Text className="mt-4 font-poppins text-[16px] leading-[23px] text-[#6f7594]">
            {isSignUp
              ? "Start your language journey today ✨"
              : "Continue your language journey ✨"}
          </Text>
        </View>

        <View className="relative mt-4 h-[138px] items-center overflow-hidden">
          <Text className="absolute left-[21%] top-8 text-[24px] text-[#ff8a00]">
            ✦
          </Text>
          <Text className="absolute right-[20%] top-9 text-[24px] text-[#64a7ff]">
            ✦
          </Text>
          <Text className="absolute right-[24%] top-[70px] text-[25px] text-[#ffca45]">
            ✦
          </Text>
          <Image
            className="h-[202px] w-[202px]"
            resizeMode="contain"
            source={images.mascotAuth}
          />
        </View>

        <View className="-mt-1 gap-4">
          <View style={styles.inputCard}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              inputMode="email"
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder="alex@gmail.com"
              placeholderTextColor={colors.neutral.textPrimary}
              style={styles.input}
              textContentType="emailAddress"
              value={email}
            />
          </View>

          {isSignUp ? (
            <View style={styles.inputCard}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  editable={false}
                  secureTextEntry
                  style={[styles.input, styles.passwordInput]}
                  textContentType="newPassword"
                  value="password1"
                />
                <Ionicons name="eye-outline" size={25} color="#737a9a" />
              </View>
            </View>
          ) : null}
        </View>

        <TouchableOpacity
          activeOpacity={0.86}
          className="mt-6 h-[58px] items-center justify-center rounded-[15px] bg-lingua-purple"
          onPress={() => setModalVisible(true)}
          style={styles.primaryButton}
        >
          <Text className="font-poppins-semibold text-[20px] leading-[26px] text-white">
            {isSignUp ? "Sign Up" : "Sign In"}
          </Text>
        </TouchableOpacity>

        <View className="mt-8 flex-row items-center gap-5">
          <View className="h-px flex-1 bg-border" />
          <Text className="font-poppins text-[15px] leading-[21px] text-[#747a96]">
            or continue with
          </Text>
          <View className="h-px flex-1 bg-border" />
        </View>

        <View className="mt-5 gap-3">
          {socialProviders.map((provider) => (
            <TouchableOpacity
              activeOpacity={0.78}
              className="h-[56px] flex-row items-center justify-center rounded-[15px] border border-border bg-white"
              key={provider.icon}
            >
              <View className="absolute left-[50px]">
                <SocialIcon name={provider.icon} />
              </View>
              <Text className="font-poppins-medium text-[16px] leading-[22px] text-text-primary">
                {provider.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="mt-16 flex-row justify-center">
          <Text className="font-poppins text-[15px] leading-[21px] text-[#747a96]">
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
          </Text>
          <Link href={isSignUp ? "/sign-in" : "/sign-up"} asChild>
            <TouchableOpacity activeOpacity={0.7}>
              <Text className="font-poppins-semibold text-[15px] leading-[21px] text-lingua-purple">
                {isSignUp ? "Log in" : "Sign up"}
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>

      <VerificationModal
        onClose={() => setModalVisible(false)}
        visible={modalVisible}
      />
    </SafeAreaView>
  );
}

function SocialIcon({ name }: { name: SocialProvider["icon"] }) {
  if (name === "google") {
    return <Ionicons name="logo-google" size={27} color="#0F9D58" />;
  }

  if (name === "facebook") {
    return <Ionicons name="logo-facebook" size={29} color="#1877F2" />;
  }

  return (
    <Ionicons name="logo-apple" size={29} color={colors.neutral.textPrimary} />
  );
}

const styles = StyleSheet.create({
  input: {
    color: colors.neutral.textPrimary,
    fontFamily: fontFamily.medium,
    fontSize: 16,
    lineHeight: 23,
    padding: 0,
  },
  inputCard: {
    backgroundColor: colors.neutral.background,
    borderColor: "#e9eaf2",
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
    minHeight: 80,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  inputLabel: {
    color: "#747a96",
    fontFamily: fontFamily.medium,
    fontSize: 14,
    lineHeight: 20,
  },
  passwordInput: {
    flex: 1,
  },
  passwordRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14,
  },
  primaryButton: {
    borderCurve: "continuous",
    shadowColor: "#4425d4",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.26,
    shadowRadius: 8,
  },
  safeArea: {
    backgroundColor: colors.neutral.background,
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
    paddingHorizontal: 31,
    paddingTop: 29,
  },
});

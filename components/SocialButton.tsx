import { Text, TouchableOpacity, View } from "react-native";

interface Props {
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
  onPress?: () => void;
}

export default function SocialButton({ icon, label, disabled, onPress }: Props) {
  return (
    <TouchableOpacity
      className="mb-3 flex-row items-center rounded-2xl border border-gray-200 px-4 py-3.5"
      disabled={disabled}
      onPress={onPress}
      activeOpacity={0.75}
      style={{ opacity: disabled ? 0.6 : 1 }}
    >
      <View className="w-6 items-center">{icon}</View>
      <Text className="flex-1 text-center text-[14px] font-poppins-medium text-[#001328]">
        {label}
      </Text>
    </TouchableOpacity>
  );
}

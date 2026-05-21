import { colors, fontFamily } from "@/constants/theme";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";
import { useLinkBuilder } from "@react-navigation/native";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TAB_ICON_SIZE = 22;
const TAB_BUTTON_HEIGHT = 58;

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { buildHref } = useLinkBuilder();

  return (
    <View
      style={[
        styles.shell,
        {
          paddingBottom: Math.max(insets.bottom, 12),
        },
      ]}
    >
      <View style={styles.inner}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            typeof options.tabBarLabel === "string"
              ? options.tabBarLabel
              : typeof options.title === "string"
                ? options.title
                : route.name;
          const isFocused = state.index === index;
          const icon = options.tabBarIcon?.({
            focused: isFocused,
            color: isFocused
              ? colors.primary.purple
              : colors.neutral.textSecondary,
            size: TAB_ICON_SIZE,
          });

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <PlatformPressable
              key={route.key}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              accessibilityState={isFocused ? { selected: true } : {}}
              href={buildHref(route.name, route.params)}
              onLongPress={onLongPress}
              onPress={onPress}
              style={styles.tabButton}
              testID={options.tabBarButtonTestID}
            >
              <View style={styles.tabContent}>
                {icon}
                <Text
                  style={[
                    styles.label,
                    isFocused ? styles.activeLabel : styles.inactiveLabel,
                  ]}
                >
                  {label}
                </Text>
              </View>
            </PlatformPressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    backgroundColor: "#fbfbfd",
    borderTopWidth: 0,
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 30,
    backgroundColor: "#ffffff",
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 8,
    boxShadow: "0 -4px 20px rgba(17, 24, 39, 0.08)",
    shadowColor: "#1b1f3b",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 12,
  },
  tabButton: {
    flex: 1,
    height: TAB_BUTTON_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  tabContent: {
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  label: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    lineHeight: 14,
  },
  activeLabel: {
    color: colors.primary.purple,
  },
  inactiveLabel: {
    color: colors.neutral.textSecondary,
  },
});

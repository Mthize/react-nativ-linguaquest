import { colors, fontFamily } from "@/constants/theme";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";
import { useLinkBuilder } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ACTIVE_CIRCLE_SIZE = 54;
const TAB_ICON_SIZE = 22;
const TAB_BUTTON_HEIGHT = 62;
const INNER_PADDING_HORIZONTAL = 4;
const INNER_PADDING_TOP = 6;

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { buildHref } = useLinkBuilder();
  const [barWidth, setBarWidth] = useState(0);
  const translateX = useSharedValue(0);

  const tabWidth =
    barWidth > 0
      ? (barWidth - INNER_PADDING_HORIZONTAL * 2) / state.routes.length
      : 0;

  useEffect(() => {
    if (!tabWidth) {
      return;
    }

    translateX.value = withTiming(
      INNER_PADDING_HORIZONTAL +
        state.index * tabWidth +
        (tabWidth - ACTIVE_CIRCLE_SIZE) / 2,
      {
        duration: 280,
        easing: Easing.out(Easing.cubic),
      },
    );
  }, [state.index, tabWidth, translateX]);

  const indicatorStyle = useAnimatedStyle(() => ({
    opacity: tabWidth ? 1 : 0,
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View
      style={[
        styles.shell,
        {
          paddingBottom: Math.max(insets.bottom, 12),
        },
      ]}
    >
      <View style={styles.inner} onLayout={(event) => setBarWidth(event.nativeEvent.layout.width)}>
        <Animated.View
          pointerEvents="none"
          style={[styles.activeIndicator, indicatorStyle]}
        />

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
            color: isFocused ? "#ffffff" : colors.neutral.textSecondary,
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
              {isFocused ? (
                <View style={styles.activeSlot}>{icon}</View>
              ) : (
                <View style={styles.inactiveSlot}>
                  {icon}
                  <Text style={styles.inactiveLabel}>{label}</Text>
                </View>
              )}
            </PlatformPressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    backgroundColor: "#ffffff",
    borderTopWidth: 0,
    paddingHorizontal: 14,
    paddingTop: 10,
  },
  inner: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    borderRadius: 28,
    backgroundColor: "#ffffff",
    paddingHorizontal: INNER_PADDING_HORIZONTAL,
    paddingTop: 6,
    paddingBottom: 4,
    shadowColor: "#1b1f3b",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 10,
  },
  activeIndicator: {
    position: "absolute",
    top: INNER_PADDING_TOP + (TAB_BUTTON_HEIGHT - ACTIVE_CIRCLE_SIZE) / 2,
    width: ACTIVE_CIRCLE_SIZE,
    height: ACTIVE_CIRCLE_SIZE,
    borderRadius: ACTIVE_CIRCLE_SIZE / 2,
    backgroundColor: colors.primary.purple,
  },
  tabButton: {
    flex: 1,
    height: TAB_BUTTON_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  activeSlot: {
    width: ACTIVE_CIRCLE_SIZE,
    height: ACTIVE_CIRCLE_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  inactiveSlot: {
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  inactiveLabel: {
    color: colors.neutral.textSecondary,
    fontFamily: fontFamily.medium,
    fontSize: 12,
    lineHeight: 14,
  },
});

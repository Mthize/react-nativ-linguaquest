import { colors, fontFamily } from "@/constants/theme";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";
import { useLinkBuilder } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  type LayoutChangeEvent,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ACTIVE_INDICATOR_SIZE = 52;
const TAB_BAR_HORIZONTAL_PADDING = 8;
const TAB_BUTTON_HEIGHT = 58;
const TAB_ICON_SIZE = 22;

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { buildHref } = useLinkBuilder();
  const indicatorTranslateX = useRef(new Animated.Value(0)).current;
  const [barWidth, setBarWidth] = useState(0);

  const paddedBarWidth = Math.max(barWidth - TAB_BAR_HORIZONTAL_PADDING * 2, 0);
  const tabWidth = paddedBarWidth > 0 ? paddedBarWidth / state.routes.length : 0;

  useEffect(() => {
    if (!tabWidth) {
      return;
    }

    const nextTranslateX =
      TAB_BAR_HORIZONTAL_PADDING +
      state.index * tabWidth +
      tabWidth / 2 -
      ACTIVE_INDICATOR_SIZE / 2;

    Animated.timing(indicatorTranslateX, {
      duration: 220,
      easing: Easing.out(Easing.cubic),
      toValue: nextTranslateX,
      useNativeDriver: true,
    }).start();
  }, [indicatorTranslateX, state.index, tabWidth]);

  const handleBarLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setBarWidth((currentWidth) => (currentWidth === width ? currentWidth : width));
  };

  return (
    <View
      style={[
        styles.shell,
        {
          paddingBottom: Math.max(insets.bottom, 12),
        },
      ]}
    >
      <View style={styles.inner} onLayout={handleBarLayout}>
        {tabWidth ? (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.activeIndicator,
              {
                transform: [{ translateX: indicatorTranslateX }],
              },
            ]}
          />
        ) : null}

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
              accessibilityState={{ selected: isFocused }}
              href={buildHref(route.name, route.params)}
              onLongPress={onLongPress}
              onPress={onPress}
              style={styles.tabButton}
              testID={options.tabBarButtonTestID}
            >
              <View style={styles.tabContent}>
                <View style={styles.iconSlot}>{icon}</View>
                {!isFocused ? (
                  <Text style={[styles.label, styles.inactiveLabel]}>{label}</Text>
                ) : null}
              </View>
            </PlatformPressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  activeIndicator: {
    position: "absolute",
    top: 11,
    left: 0,
    height: ACTIVE_INDICATOR_SIZE,
    width: ACTIVE_INDICATOR_SIZE,
    borderRadius: ACTIVE_INDICATOR_SIZE / 2,
    backgroundColor: colors.primary.purple,
    boxShadow: "0 14px 28px rgba(108, 78, 245, 0.28)",
    shadowColor: "#6c4ef5",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  iconSlot: {
    height: TAB_ICON_SIZE,
    width: TAB_ICON_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  inactiveLabel: {
    color: colors.neutral.textSecondary,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 30,
    backgroundColor: "#ffffff",
    paddingHorizontal: TAB_BAR_HORIZONTAL_PADDING,
    paddingTop: 8,
    paddingBottom: 8,
    boxShadow: "0 -4px 20px rgba(17, 24, 39, 0.08)",
    shadowColor: "#1b1f3b",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 12,
  },
  label: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    lineHeight: 14,
  },
  shell: {
    backgroundColor: "#fbfbfd",
    borderTopWidth: 0,
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  tabButton: {
    flex: 1,
    height: TAB_BUTTON_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  tabContent: {
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
});

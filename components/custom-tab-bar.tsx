import { colors } from "@/constants/theme";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";
import { useLinkBuilder } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  type LayoutChangeEvent,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ACTIVE_INDICATOR_SIZE = 52;
const TAB_BAR_HORIZONTAL_PADDING = 8;
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
      className="bg-[#fbfbfd] px-4 pt-1"
      style={[
        {
          paddingBottom: Math.max(insets.bottom, 12),
        },
      ]}
    >
      <View
        className="relative flex-row items-center justify-between rounded-[30px] bg-white px-2 py-2"
        onLayout={handleBarLayout}
        style={{
          boxShadow: "0 -4px 20px rgba(17, 24, 39, 0.08)",
          shadowColor: "#1b1f3b",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.06,
          shadowRadius: 16,
          elevation: 12,
        }}
      >
        {tabWidth ? (
          <Animated.View
            className="absolute left-0 top-[11px] h-[52px] w-[52px] rounded-full bg-lingua-purple"
            pointerEvents="none"
            style={{
              boxShadow: "0 14px 28px rgba(108, 78, 245, 0.28)",
              shadowColor: "#6c4ef5",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.2,
              shadowRadius: 16,
              elevation: 10,
              transform: [{ translateX: indicatorTranslateX }],
            }}
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
            <View key={route.key} className="flex-1" style={{ zIndex: 1 }}>
              <PlatformPressable
                accessibilityLabel={options.tabBarAccessibilityLabel}
                accessibilityState={{ selected: isFocused }}
                href={buildHref(route.name, route.params)}
                onLongPress={onLongPress}
                onPress={onPress}
                testID={options.tabBarButtonTestID}
              >
                <View className="h-[58px] items-center justify-center">
                  <View className="items-center justify-center gap-1.5">
                    <View className="h-[22px] w-[22px] items-center justify-center">
                      {icon}
                    </View>
                    {!isFocused ? (
                      <Text className="font-poppins-medium text-[12px] leading-[14px] text-text-secondary">
                        {label}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </PlatformPressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}

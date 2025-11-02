import { Drawer } from "@/components/drawer";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import Color from "color";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Dimensions,
  Keyboard,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDecay,
  withSpring,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

const width = Dimensions.get("window").width;
export const DRAWER_WIDTH = width * 0.8;
export const THRESHOLD = width;

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const initialOffsetX = useSharedValue(0);
  const drawerOffsetX = useSharedValue(0);
  const progress = useSharedValue(0);

  useDerivedValue(() => {
    progress.value = drawerOffsetX.value / THRESHOLD;
  });

  const closeKeyboard = () => {
    Keyboard.dismiss();
  };

  const panGesture = Gesture.Pan()
    .minDistance(5)
    .activeOffsetX([-10, 10])
    .failOffsetY([-5, 5])
    .onStart(() => {
      scheduleOnRN(closeKeyboard);
      initialOffsetX.value = drawerOffsetX.value;
    })
    .onUpdate((event) => {
      const newX = initialOffsetX.value + event.translationX;
      if (newX <= THRESHOLD) {
        drawerOffsetX.value = newX;
      } else {
        const extra = newX - THRESHOLD;
        const resisted = THRESHOLD + extra * 0.03;
        drawerOffsetX.value = resisted;
      }
    })
    .onEnd((event) => {
      const direction = event.velocityX > 0 ? "right" : "left";
      if (direction === "right") {
        drawerOffsetX.value = withSpring(width);
      } else {
        if (drawerOffsetX.value < width * 0.9) {
          drawerOffsetX.value = withDecay({
            velocity: event.velocityX,
            velocityFactor: Math.max(1000 / Math.abs(event.velocityX), 1),
            deceleration: 1,
            clamp: [0, width],
          });
        } else {
          drawerOffsetX.value = withSpring(width);
        }
      }
    });

  const outputColor =
    colorScheme === "dark"
      ? Color(DarkTheme.colors.card).darken(0.2).alpha(0.8).string()
      : Color(DefaultTheme.colors.card).darken(0.2).alpha(0.8).string();

  const animatedOverlayStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        ["transparent", outputColor]
      ),
    };
  });

  return (
    <KeyboardProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <GestureDetector gesture={panGesture}>
          <View style={{ flex: 1 }}>
            <ThemeProvider
              value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
            >
              <Animated.View
                pointerEvents="none"
                style={[
                  StyleSheet.absoluteFill,
                  animatedOverlayStyle,
                  {
                    zIndex: 1,
                  },
                ]}
              />
              <View style={{ flex: 1 }}>
                <Stack>
                  <Stack.Screen
                    name="index"
                    options={{
                      title: "GPT",
                      headerTransparent: true,
                    }}
                  />
                </Stack>
                <StatusBar style="auto" />
              </View>
              <Drawer drawerOffsetX={drawerOffsetX} />
            </ThemeProvider>
          </View>
        </GestureDetector>
      </GestureHandlerRootView>
    </KeyboardProvider>
  );
}

import { DRAWER_WIDTH } from "@/app/_layout";
import { FontAwesome6 } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import Color from "color";
import { GlassContainer, GlassView } from "expo-glass-effect";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import SquircleView from "react-native-fast-squircle";
import { Pressable as GesturePressable } from "react-native-gesture-handler";
import { useKeyboardHandler } from "react-native-keyboard-controller";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
const MARGIN = 5;

const AnimatedSquircleView = Animated.createAnimatedComponent(SquircleView);

export const Drawer = ({
  drawerOffsetX,
}: {
  drawerOffsetX: SharedValue<number>;
}) => {
  const { top } = useSafeAreaInsets();
  const theme = useTheme();

  const progress = useSharedValue(0);
  const keyboardHeight = useSharedValue(0);

  useKeyboardHandler(
    {
      onMove: (e) => {
        "worklet";
        progress.value = e.progress;
        keyboardHeight.value = e.height;
      },
      onInteractive: (e) => {
        "worklet";
        progress.value = e.progress;
        keyboardHeight.value = e.height;
      },
      onEnd: (e) => {
        "worklet";
        progress.value = e.progress;
        keyboardHeight.value = e.height;
      },
    },
    []
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: drawerOffsetX.value }],
      height: interpolate(
        progress.value,
        [0, 1],
        [height, height - keyboardHeight.value - MARGIN]
      ),
    };
  });

  const animatedDrawerStyle = useAnimatedStyle(() => {
    return {
      width: interpolate(
        progress.value,
        [0, 1],
        [DRAWER_WIDTH, width - MARGIN * 2]
      ),
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <GesturePressable
        style={[StyleSheet.absoluteFill]}
        onPress={() => {
          drawerOffsetX.value = withSpring(0);
        }}
      />
      <AnimatedSquircleView
        style={[
          styles.drawerContainer,
          {
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.border,
          },
          animatedDrawerStyle,
        ]}
        cornerSmoothing={1}
      >
        <View style={[styles.drawerContent]}>
          <GlassContainer
            spacing={10}
            style={[styles.topContainerContent, { paddingTop: top }]}
          >
            <GlassView style={styles.inputContainer} isInteractive>
              <TextInput
                placeholder="Ask anything..."
                style={[styles.inputStyle, { color: theme.colors.text }]}
              />
            </GlassView>
            <GlassView isInteractive style={styles.addButtonContainer}>
              <Pressable
                onPress={() => {
                  alert("Hello world!");
                }}
                style={styles.addButtonStyle}
              >
                <FontAwesome6
                  name="magnifying-glass"
                  size={16}
                  color={theme.colors.text}
                />
              </Pressable>
            </GlassView>
          </GlassContainer>
        </View>
      </AnimatedSquircleView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: height,
    left: -width,
    position: "absolute",
    zIndex: 2,
  },
  drawerContainer: {
    flex: 1,
    margin: MARGIN,
    width: DRAWER_WIDTH,
    borderRadius: 60,
    borderWidth: StyleSheet.hairlineWidth,
    boxShadow: `${Color("black").alpha(0.05).toString()} 0px 7px 29px 0px`,
  },
  drawerContent: {
    flex: 1,
  },
  topContainerContent: {
    paddingVertical: 10,
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 10,
  },
  addButtonContainer: {
    height: 40,
    aspectRatio: 1,
    borderRadius: 20,
  },
  addButtonStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    height: 40,
    flex: 1,
    borderRadius: 20,
  },
  inputStyle: {
    flex: 1,
    paddingHorizontal: 16,
  },
});

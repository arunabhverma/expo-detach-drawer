import { FontAwesome6 } from "@expo/vector-icons/";
import { useTheme } from "@react-navigation/native";
import { GlassContainer, GlassView } from "expo-glass-effect";
import React from "react";
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useKeyboardHandler } from "react-native-keyboard-controller";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
  const theme = useTheme();
  const { bottom } = useSafeAreaInsets();
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

  const animatedFlatListKeyboardAvoidingStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(progress.value, [0, 1], [0, -keyboardHeight.value]),
    };
  });

  const animatedKeyboardAvoidingStyle = useAnimatedStyle(() => {
    return {
      bottom: interpolate(
        progress.value,
        [0, 1],
        [0, keyboardHeight.value - bottom]
      ),
    };
  });

  const messages = [
    {
      id: "1",
      isRight: true,
      text: "hey gpt, i’m working on a FlatList with images and it’s lagging badly",
    },
    {
      id: "2",
      isRight: false,
      text: "Lag in FlatList with images is super common. It’s usually from re-renders or unoptimized image loading. Are you using react-native-fast-image or just the default Image component?",
    },
    {
      id: "3",
      isRight: true,
      text: "default image only",
    },
    {
      id: "4",
      isRight: false,
      text: "That’s the first thing you should change. The default Image component doesn’t handle caching well. Install react-native-fast-image, it’ll reduce flicker and frame drops immediately.",
    },
    {
      id: "5",
      isRight: true,
      text: "got it. what about inline styles though?",
    },
    {
      id: "6",
      isRight: false,
      text: "Yeah, remove them. Inline styles recreate a new object on every render. Use StyleSheet.create or memoized style objects. That’s one of the easiest wins for performance.",
    },
    {
      id: "7",
      isRight: true,
      text: "okay, and should i memoize renderItem too?",
    },
    {
      id: "8",
      isRight: false,
      text: "100%. Wrap your renderItem with React.memo or useCallback. That ensures FlatList doesn’t re-render every item unnecessarily. Combine that with proper keyExtractor and FastImage — you’ll see buttery smooth scrolls.",
    },
  ];

  const Bubble = ({ text, isRight }: { text: string; isRight: boolean }) => {
    const textStyle = {
      lineHeight: 20,
    };

    return (
      <View
        style={[
          {
            maxWidth: isRight
              ? Dimensions.get("window").width * 0.5
              : Dimensions.get("window").width * 0.75,
            paddingVertical: 10,
            paddingHorizontal: isRight ? 14 : 8,
            marginVertical: 6,
          },
          isRight && {
            backgroundColor: theme.colors.border,
            borderRadius: 20,
          },
        ]}
      >
        <Text style={[textStyle, { color: theme.colors.text }]}>{text}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        ListFooterComponent={
          <Animated.View style={animatedFlatListKeyboardAvoidingStyle} />
        }
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 40 + 20,
        }}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              justifyContent: item.isRight ? "flex-end" : "flex-start",
            }}
          >
            <Bubble text={item.text} isRight={item.isRight} />
          </View>
        )}
      />
      <Animated.View
        style={[
          styles.bottomContainer,
          { paddingBottom: bottom },
          animatedKeyboardAvoidingStyle,
        ]}
      >
        <GlassContainer spacing={10} style={styles.bottomContainerContent}>
          <GlassView isInteractive style={styles.addButtonContainer}>
            <Pressable style={styles.addButtonStyle}>
              <FontAwesome6 name="add" size={16} color={theme.colors.text} />
            </Pressable>
          </GlassView>
          <GlassView style={styles.inputContainer} isInteractive>
            <TextInput
              placeholder="Ask anything..."
              style={[styles.inputStyle, { color: theme.colors.text }]}
            />
          </GlassView>
        </GlassContainer>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomContainerContent: {
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

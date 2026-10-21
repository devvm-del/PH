import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

const AnimatedQuestion = ({ text, animationKey }) => {
  const [visibleWords, setVisibleWords] = useState(0);

  useEffect(() => {
    setVisibleWords(0);

    if (!text) {
      return;
    }

    const words = text.split(" ");
    let index = 0;

    const interval = setInterval(() => {
      index += 1;

      setVisibleWords(index);

      if (index >= words.length) {
        clearInterval(interval);
      }
    }, 180);

    return () => {
      clearInterval(interval);
    };
  }, [text, animationKey]);

  const words = text ? text.split(" ") : [];

  return (
    <View>
      <Text
        style={{
          color: "#F8FAFC",
          fontSize: 16,
          lineHeight: 24,
        }}
      >
        {words.slice(0, visibleWords).join(" ")}
      </Text>
    </View>
  );
};

export default AnimatedQuestion;

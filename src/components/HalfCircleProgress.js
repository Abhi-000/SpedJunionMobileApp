import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Path, G } from "react-native-svg";

const HalfCircleProgress = ({ total, completed, color, thickness }) => {
  const size = 100; // size of the component
  const radius = (size - thickness) / 2;
  const circumference = radius * Math.PI;
  const progress = (completed / total) * 100;
  const progressOffset = circumference - (progress / 100) * circumference;

  const halfCircle = {
    x: size / 2,
    y: size / 2,
    radius,
    startAngle: 0,
    endAngle: Math.PI,
  };

  const arcPath = `M ${halfCircle.x - halfCircle.radius},${halfCircle.y}
                   a ${halfCircle.radius},${halfCircle.radius} 0 1,1 ${
    halfCircle.radius * 2
  },0`;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size / 2}>
        <G rotation="360" origin={`${halfCircle.x}, ${halfCircle.y}`}>
          <Path
            d={arcPath}
            stroke="#e0e0e0"
            strokeWidth={thickness}
            fill="none"
          />
          <Path
            d={arcPath}
            stroke={color}
            strokeWidth={thickness}
            strokeDasharray={circumference}
            strokeDashoffset={progressOffset}
            fill="none"
          />
        </G>
      </Svg>
      <View style={styles.textContainer}>
        <Text style={[styles.percentageText, { color }]}>
          {Math.round(progress)}%
        </Text>
        <Text style={[styles.chapterText, { color }]}>
          {completed} / {total}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    position: "absolute",
    top: "35%",
    alignItems: "center",
  },
  percentageText: {
    top: "15%",
    fontSize: 14,
    fontWeight: "bold",
  },
  chapterText: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
  },
});

export default HalfCircleProgress;

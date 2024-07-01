// src/components/HalfCircleProgress.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';

const HalfCircleProgress = ({ total, completed }) => {
  const size = 100; // size of the component
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
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
                   a ${halfCircle.radius},${halfCircle.radius} 0 1,1 ${halfCircle.radius * 2},0`;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size / 2}>
        <G rotation="360" origin={`${halfCircle.x}, ${halfCircle.y}`}>
          <Path
            d={arcPath}
            stroke="#e0e0e0"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <Path
            d={arcPath}
            stroke="#6A53A2"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={progressOffset}
            fill="none"
          />
        </G>
      </Svg>
      <View style={styles.textContainer}>
        <Text style={styles.percentageText}>{Math.round(progress)}%</Text>
        <Text style={styles.chapterText}>{completed} / {total}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    position: 'absolute',
    top: '35%',
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6A53A2',
  },
  chapterText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6A53A2',
    marginTop: 5,
  },
});

export default HalfCircleProgress;

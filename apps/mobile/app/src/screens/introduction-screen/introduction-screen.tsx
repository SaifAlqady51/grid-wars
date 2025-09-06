import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  FlatList,
  ImageSourcePropType,
  Image,
} from "react-native";
import { styles } from "./introduction.styles";
import { useTheme } from "../../context";
import Welcome from "@/assets/images/welcom.png";
import Compete from "@/assets/images/compete.png";
import Scoreboard from "@/assets/images/scoreboard.png";

interface SlideItem {
  id: string;
  title: string;
  description: string;
  icon: string | ImageSourcePropType;
}

const slides: SlideItem[] = [
  {
    id: "1",
    title: "Welcome ",
    description:
      "One of the oldest world games now available on your smartphone device!",
    icon: Welcome,
  },
  {
    id: "2",
    title: "Compete",
    description:
      "Play the game with your friends, and prove that you’re a worthy opponent!",
    icon: Compete,
  },
  {
    id: "3",
    title: "Scoreboard",
    description:
      "Earn points and make your own way to the top of the scoreboard!",
    icon: Scoreboard,
  },
];

interface IntroSliderProps {
  onFinish: () => void;
}

export const IntroductionSlider: React.FC<IntroSliderProps> = ({
  onFinish,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const theme = useTheme();

  const RenderSlide = ({ item, index }: { item: SlideItem; index: number }) => {
    return (
      <View
        style={[styles.slide, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.content}>
          <Image
            source={item.icon as ImageSourcePropType}
            style={styles.icon}
          />
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    );
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex });
      setCurrentIndex(nextIndex);
    } else {
      onFinish();
    }
  };

  const handleSkip = () => {
    onFinish();
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      flatListRef.current?.scrollToIndex({ index: prevIndex });
      setCurrentIndex(prevIndex);
    }
  };

  const onViewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: any[];
  }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setCurrentIndex(viewableItems[0].index);
    }
  };

  const renderPagination = () => (
    <View style={styles.pagination}>
      {slides.map((_, index) => (
        <View
          key={index}
          style={[styles.dot, { opacity: index === currentIndex ? 1 : 0.3 }]}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors.background}
      />

      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={RenderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
      />

      <View style={styles.bottomContainer}>
        {renderPagination()}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.previousButton}
            onPress={handlePrevious}
            disabled={currentIndex > 0}
          >
            <Text style={styles.previousText}>Previous</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextText}>
              {currentIndex === slides.length - 1 ? "Get Started" : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

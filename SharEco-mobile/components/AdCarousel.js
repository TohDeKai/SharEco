// import {
//   FlatList,
//   Image,
//   StyleSheet,
//   Text,
//   View,
//   Dimensions,
//   LogBox,
// } from "react-native";
// import React, { useEffect, useRef, useState } from "react";

// export default function AdCarousel() {
//   const adList = useRef();
//   const width = Dimensions.get("window").width;
//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     // Autoscroll every 3 seconds.
//     let autoscroll = setautoscroll(() => {
//       if (currentIndex === data.length - 1) {
//         // End of carousell -> goes back to first
//         adList.current.scrollToIndex({
//           index: 0,
//           animation: true,
//         });
//       } else {
//         // Scroll to next item
//         adList.current.scrollToIndex({
//           index: currentIndex + 1,
//           animation: true,
//         });
//       }
//     }, 3000);

//     return () => clearautoscroll(autoscroll);
//   });

//   const getItemLayout = (data, index) => ({
//     length: width,
//     offset: width * index, // for first image - 300 * 0 = 0pixels, 300 * 1 = 300, 300*2 = 600
//     index: index,
//   });
//   // Data for carousel
//   const data = [
//     {
//       id: "01",
//       image:
//         "https://sharecomobile1f650a0a27cd4f42bd1c864b278ff20c181529-dev.s3.ap-southeast-1.amazonaws.com/public/adId-32.jpeg",
//     },
//     {
//       id: "02",
//       image:
//         "https://sharecomobile1f650a0a27cd4f42bd1c864b278ff20c181529-dev.s3.ap-southeast-1.amazonaws.com/public/adId-33.jpeg",
//     },
//     {
//       id: "03",
//       image:
//         "https://sharecomobile1f650a0a27cd4f42bd1c864b278ff20c181529-dev.s3.ap-southeast-1.amazonaws.com/public/adId-34.jpeg",
//     },
//   ];

//   const handleScroll = (event) => {
//     const scrollPosition = event.nativeEvent.contentOffset.x;
//     console.log({ scrollPosition });
//     const index = scrollPosition / width;

//     console.log({ index });
//     setCurrentIndex(index);
//   };

//   // Render Dot Indicators
//   const renderDotIndicators = () => {
//     return data.map((dot, index) => {
//       // if the active index === index

//       if (currentIndex === index) {
//         return (
//           <View
//             style={{
//               backgroundColor: "green",
//               height: 10,
//               width: 10,
//               borderRadius: 5,
//               marginHorizontal: 6,
//             }}
//           ></View>
//         );
//       } else {
//         return (
//           <View
//             key={index}
//             style={{
//               backgroundColor: "red",
//               height: 10,
//               width: 10,
//               borderRadius: 5,
//               marginHorizontal: 6,
//             }}
//           ></View>
//         );
//       }
//     });
//   };

//   return (
//     <View>
//       <FlatList
//         data={data}
//         ref={adList}
//         getItemLayout={getItemLayout}
//         renderItem={({ item, index }) => {
//           return (
//             <View>
//               <Image
//                 source={item.image}
//                 style={{ height: 200, width: width }}
//               />
//             </View>
//           );
//         }}
//         keyExtractor={(item) => item.id}
//         horizontal={true}
//         pagingEnabled={true}
//         onScroll={handleScroll}
//       />

//       <View
//         style={{
//           flexDirection: "row",
//           justifyContent: "center",
//           marginTop: 30,
//         }}
//       >
//         {renderDotIndicators()}
//       </View>
//     </View>
//   );
// }

import { FlatList, Image, StyleSheet, Dimensions, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { colours } from "./ColourPalette";
const { primary, green30 } = colours;

const viewportWidthInPixels = (percentage) => {
  const screenWidth = Dimensions.get("window").width;
  return (percentage / 100) * screenWidth;
};

const Carousel = () => {
  const adList = useRef();
  const width = viewportWidthInPixels(100);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let autoscroll = setInterval(() => {
      if (activeIndex === data.length - 1) {
        adList.current.scrollToIndex({
          index: 0,
          animation: true,
        });
      } else {
        adList.current.scrollToIndex({
          index: activeIndex + 1,
          animation: true,
        });
      }
    }, 4000);

    return () => clearInterval(autoscroll);
  });

  const getItemLayout = (data, index) => ({
    length: width,
    offset: width * index, // for first image - 300 * 0 = 0pixels, 300 * 1 = 300, 300*2 = 600
    index: index,
  });
  // Data for carousel
  const data = [
    {
      id: "01",
      image:
        "https://sharecomobile1f650a0a27cd4f42bd1c864b278ff20c181529-dev.s3.ap-southeast-1.amazonaws.com/public/adId-32.jpeg",
    },
    {
      id: "02",
      image:
        "https://sharecomobile1f650a0a27cd4f42bd1c864b278ff20c181529-dev.s3.ap-southeast-1.amazonaws.com/public/adId-33.jpeg",
    },
    {
      id: "03",
      image:
        "https://sharecomobile1f650a0a27cd4f42bd1c864b278ff20c181529-dev.s3.ap-southeast-1.amazonaws.com/public/adId-34.jpeg",
    },
  ];

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = scrollPosition / width;
    setActiveIndex(index);
  };

  const Paginators = () => {
    return (
      <View style={styles.paginators}>
        {data.map((dot, index) => {
          // if the active index === index

          if (activeIndex === index) {
            return (
              <View
                style={{
                  backgroundColor: green30,
                  height: 10,
                  width: 10,
                  borderRadius: 5,
                  marginHorizontal: 6,
                }}
              ></View>
            );
          } else {
            return (
              <View
                key={index}
                style={{
                  borderColor: green30,
                  borderWidth: 1,
                  height: 10,
                  width: 10,
                  borderRadius: 5,
                  marginHorizontal: 6,
                }}
              ></View>
            );
          }
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        ref={adList}
        getItemLayout={getItemLayout}
        renderItem={({ item, index }) => {
          return (
            <View>
              <Image
                source={{ uri: item.image }}
                style={{ height: width / 3, width: width }}
              />
            </View>
          );
        }}
        keyExtractor={(item) => item.id}
        horizontal={true}
        pagingEnabled={true}
        onScroll={handleScroll}
      />
      {/* <Paginators /> */}
    </View>
  );
};

export default Carousel;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  paginators: {
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 6,
  },
});

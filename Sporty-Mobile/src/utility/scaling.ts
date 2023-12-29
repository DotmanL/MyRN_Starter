import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

export const deviceHeight = height;

const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

export const screenTopMargin = 10;

const scale = (size: number) => (width / guidelineBaseWidth) * size;
const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;
const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

export { scale, verticalScale, moderateScale };
// copied from https://medium.com/soluto-engineering/size-matters-5aeeb462900a

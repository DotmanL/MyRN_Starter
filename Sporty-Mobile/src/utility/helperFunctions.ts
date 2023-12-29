import * as SecureStore from "expo-secure-store";

export function getFirstLettersOfWords(inputString: string) {
  const words = inputString.split(" ");
  const firstLetters = words.map((word) => {
    if (word.length > 0) {
      return word[0];
    }
    return "";
  });

  return firstLetters.join("");
}

export function convertUTCTime(date: string, deviceTimeZone: string) {
  const expirationDateUTC = new Date(date);
  const expirationDateLocal = expirationDateUTC.toLocaleString("en-US", {
    timeZone: deviceTimeZone
  });
  return expirationDateLocal;
}

export async function getExpirationDateTime() {
  const expirationDate = await SecureStore.getItemAsync("expirationDate");

  if (!expirationDate) {
    return 0;
  }
  const expirationDateTimeinMilliseconds =
    calculateExpirationTimeInMilliSeconds(expirationDate);

  return expirationDateTimeinMilliseconds;
}

function calculateExpirationTimeInMilliSeconds(expirationDate: string) {
  const parts = expirationDate.match(
    /(\d+)\/(\d+)\/(\d+)(?:, (\d+):(\d+):(\d+))?(?: (AM|PM))?/
  )!;

  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  const year = parseInt(parts[3], 10);
  let hours = parseInt(parts[4], 10) || 0;
  const minutes = parseInt(parts[5], 10) || 0;
  const seconds = parseInt(parts[6], 10) || 0;
  const period = parts[7];

  if (period === "PM" && hours !== 12) {
    hours += 12;
  }

  const expirationDateTime = new Date(
    year,
    month - 1,
    day,
    hours,
    minutes,
    seconds
  );

  const secondsUntilExpiry = expirationDateTime.getTime();
  return secondsUntilExpiry;
}

export function calculateExpirationTime(secondsUntilExpiry: number) {
  const currentDate = new Date();
  const currentUtcTimestamp =
    currentDate.getTime() + currentDate.getTimezoneOffset() * 60 * 1000;
  const currentUtcDate = new Date(currentUtcTimestamp);

  const expirationUtcTimestamp =
    currentUtcDate.getTime() + secondsUntilExpiry * 1000;
  const expirationUtcDate = new Date(expirationUtcTimestamp);

  const formattedExpirationTime = expirationUtcDate.toISOString();
  return formattedExpirationTime;
}

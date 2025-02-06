import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";
import { parse, toSeconds } from "iso8601-duration";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertISO8601ToHHMMSS(duration: string) {
  const parsed = parse(duration);

  const totalSeconds = toSeconds(parsed);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [
    hours.toString().padStart(2, "0"),
    minutes.toString().padStart(2, "0"),
    seconds.toString().padStart(2, "0"),
  ].join(":");
}

export function formatViewCount(views: number) {
  if (views >= 1_000_000) {
    return (
      new Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(views) + " views"
    );
  }
  return new Intl.NumberFormat("en-US").format(views) + " views";
}

export function formatSubscribers(count: number) {
  if (count >= 1e9) {
    return (count / 1e9).toFixed(2).replace(/\.?0+$/, "") + " B subscribers";
  } else if (count >= 1e6) {
    return (count / 1e6).toFixed(2).replace(/\.?0+$/, "") + " M subscribers";
  } else if (count >= 1e3) {
    return (count / 1e3).toFixed(2).replace(/\.?0+$/, "") + " K subscribers";
  } else {
    return count + " subscribers";
  }
}

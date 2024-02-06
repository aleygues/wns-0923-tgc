export function computeDistanceInSeconds(date1: Date, date2: Date) {
  return Math.abs(Math.floor((date2.getTime() - date1.getTime()) / 1000));
}

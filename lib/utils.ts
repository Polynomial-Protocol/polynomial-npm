/**
 * Utility to calculate a timestamp one week from now (used for order expiration).
 */
export const getWeekFromNowTimestamp = (): number => {
    return Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
};
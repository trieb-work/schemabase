import {
    isWeekend,
    addDays,
    parseISO,
    isValid,
    differenceInHours,
} from "date-fns";

// Cache for holidays to avoid repeated API calls
const holidayCache = new Map<string, Date[]>();

/**
 * Business hours configuration for Pennsylvania
 * Assuming standard business hours: 9 AM to 5 PM, Monday to Friday
 */
const BUSINESS_HOURS = {
    start: 8, // 8 AM
    end: 16.5, // 4:30 PM (16:30)
    hoursPerDay: 8.5, // 8.5 working hours per day
};

/**
 * Fetch US holidays for a specific year using Nager.Date API
 */
async function fetchUSHolidays(year: number): Promise<Date[]> {
    const cacheKey = `US-${year}`;

    if (holidayCache.has(cacheKey)) {
        return holidayCache.get(cacheKey)!;
    }

    try {
        const response = await fetch(
            `https://date.nager.at/api/v3/PublicHolidays/${year}/US`,
        );
        if (!response.ok) {
            console.warn(
                `Failed to fetch holidays for ${year}: ${response.statusText}`,
            );
            return [];
        }

        const holidays = await response.json();
        const holidayDates = holidays
            .map((holiday: any) => {
                const date = parseISO(holiday.date);
                return isValid(date) ? date : null;
            })
            .filter((date: Date | null): date is Date => date !== null);

        holidayCache.set(cacheKey, holidayDates);
        return holidayDates;
    } catch (error) {
        console.warn(`Error fetching holidays for ${year}:`, error);
        return [];
    }
}

/**
 * Check if a date is a US holiday (async)
 */
export async function isHoliday(date: Date): Promise<boolean> {
    const year = date.getFullYear();
    const holidays = await fetchUSHolidays(year);

    return holidays.some(
        (holiday) =>
            holiday.getFullYear() === date.getFullYear() &&
            holiday.getMonth() === date.getMonth() &&
            holiday.getDate() === date.getDate(),
    );
}

/**
 * Check if a date is a working day (not weekend and not holiday) - async version
 */
export async function isWorkingDay(date: Date): Promise<boolean> {
    return !isWeekend(date) && !(await isHoliday(date));
}

/**
 * Calculate working hours between two dates, considering:
 * - Only business hours (9 AM - 5 PM)
 * - Only weekdays (Monday - Friday)
 * - Excluding US holidays
 */
export async function differenceInWorkingHours(
    endDate: Date,
    startDate: Date,
): Promise<number> {
    if (endDate <= startDate) {
        return 0;
    }

    let totalWorkingHours = 0;
    let currentDate = new Date(startDate);

    while (currentDate < endDate) {
        if (await isWorkingDay(currentDate)) {
            // Calculate hours for this working day
            const dayStart = new Date(currentDate);
            dayStart.setHours(BUSINESS_HOURS.start, 0, 0, 0);

            const dayEnd = new Date(currentDate);
            dayEnd.setHours(BUSINESS_HOURS.end, 0, 0, 0);

            // Determine the actual start and end times for this day
            const actualStart = currentDate < dayStart ? dayStart : currentDate;
            const actualEnd = endDate > dayEnd ? dayEnd : endDate;

            if (actualStart < actualEnd) {
                const hoursThisDay = differenceInHours(actualEnd, actualStart);
                totalWorkingHours += hoursThisDay;
            }
        }

        // Move to next day
        currentDate = addDays(currentDate, 1);
        currentDate.setHours(BUSINESS_HOURS.start, 0, 0, 0);
    }

    return totalWorkingHours;
}

/**
 * Calculate percentile from an array of numbers
 * @param values Sorted array of numbers
 * @param percentile Percentile to calculate (0-100)
 */
export function calculatePercentile(
    values: number[],
    percentile: number,
): number {
    if (values.length === 0) return 0;

    const index = (percentile / 100) * (values.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);

    if (lower === upper) {
        return values[lower];
    }

    const weight = index - lower;
    return values[lower] * (1 - weight) + values[upper] * weight;
}

/**
 * Calculate working days between two dates, excluding weekends and holidays
 */
export async function differenceInWorkingDays(
    endDate: Date,
    startDate: Date,
): Promise<number> {
    let workingDays = 0;
    let currentDate = new Date(startDate);

    while (currentDate < endDate) {
        currentDate = addDays(currentDate, 1);
        if (await isWorkingDay(currentDate)) {
            workingDays++;
        }
    }

    return workingDays;
}

/**
 * Add working days to a date, skipping weekends and holidays
 */
export async function addWorkingDays(
    startDate: Date,
    workingDaysToAdd: number,
): Promise<Date> {
    let currentDate = new Date(startDate);
    let addedDays = 0;

    while (addedDays < workingDaysToAdd) {
        currentDate = addDays(currentDate, 1);
        if (await isWorkingDay(currentDate)) {
            addedDays++;
        }
    }

    return currentDate;
}

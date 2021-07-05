import dayjs from "dayjs"

/**
 * Validates a date for plausibility. November for example has just 30 days - this function will give you false
 * for 2020-11-31
 * @param date - The date string
 * @param format - The format of the date string. default='YYYY-MM-DD'
 */
 export function validateDate(date :string, format = "YYYY-MM-DD") {
    return dayjs(date, format).format(format) === date;
}

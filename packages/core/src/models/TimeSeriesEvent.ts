import Utils from "../utils";
import { TimeSeriesEventCell } from "./TimeSeriesEventCell";

class TimeSeriesEvent {
    public timestamp: Date;                    // Always a valid Date object
    public cells: Record<string, TimeSeriesEventCell> = {};
    public raw: any;
    // public cells = {};

    constructor(rawEvent: any) {
        this.raw = rawEvent;

        // -------------------------------------------------------------
        // CRITICAL FIX: Safely extract and normalize timestamp
        // -------------------------------------------------------------
        const tsValue = rawEvent["timestamp ($ts)"] ?? rawEvent.timestamp ?? rawEvent.$ts;

        if (tsValue === null || tsValue === undefined) {
            throw new Error("TimeSeriesEvent: Missing timestamp. Must have 'timestamp ($ts)', 'timestamp', or '$ts'.");
        }

        let isoString: string;

        if (typeof tsValue === "string") {
            // Already a string — just clean it up
            isoString = tsValue.trim();
        } else if (tsValue instanceof Date) {
            // Convert Date → proper ISO string
            isoString = tsValue.toISOString();
        } else if (tsValue && typeof tsValue.toISOString === "function") {
            // Some other date-like object (e.g. moment, luxon)
            isoString = tsValue.toISOString();
        } else if (typeof tsValue === "number") {
            // Unix timestamp in milliseconds
            isoString = new Date(tsValue).toISOString();
        } else {
            // Last resort
            isoString = String(tsValue);
        }

        // Ensure it ends with Z or has timezone offset
        if (!/Z$|[+-]\d{2}:?\d{2}$/.test(isoString)) {
            isoString += "Z";
        }

        // Final validation
        const parsed = Date.parse(isoString);
        if (isNaN(parsed)) {
            throw new Error(`TimeSeriesEvent: Invalid timestamp value: ${JSON.stringify(tsValue)} → "${isoString}"`);
        }

        this.timestamp = new Date(isoString);

        // -------------------------------------------------------------
        // Copy all other properties as cells (skip timestamp keys)
        // -------------------------------------------------------------
        for (const [key, value] of Object.entries(rawEvent)) {
            if (key === "timestamp ($ts)" || key === "timestamp" || key === "$ts") {
                continue;
            }

            this.cells[key] = {
                key,
                value,
                type: this.inferType(value)
            };
        }
    }
    private inferType(value: any): string {
        if (value === null || value === undefined) return "Null";
        if (typeof value === "number") {
            return Number.isInteger(value) ? "Long" : "Double";
        }
        if (typeof value === "boolean") return "Bool";
        if (typeof value === "string") return "String";
        if (value instanceof Date) return "DateTime";
        if (Array.isArray(value)) return "Array";
        if (typeof value === "object") return "Dynamic";
        return "String";
    }

    // Optional: helper to get formatted timestamp using TSI utils
    public getFormattedTimestamp(
        is24Hour: boolean = true,
        locale: string = "en-US",
        offset: "Local" | "UTC" = "Local"
    ): string {
        // You can plug in Utils.timeFormat() here if available
        const date = offset === "UTC" ? this.timestamp : new Date(this.timestamp.getTime() - this.timestamp.getTimezoneOffset() * 60000);
        return date.toLocaleString(locale, {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: !is24Hour
        });
    }


    // constructor(rawEvent, offset = null, offsetName: string = null, locale: string = 'en') {

    //     if (offset !== null) {
    //         let type = 'DateTime';
    //         let utcOffsetDate = Utils.offsetUTC(new Date(Date.parse(rawEvent['timestamp ($ts)'].split("Z").join(""))));
    //         rawEvent[offsetName + "_" + type] = {
    //             name: offsetName,
    //             value: () => Utils.timeFormat(true, true, offset, true, null, null, locale)(utcOffsetDate),
    //             type: type
    //         };
    //     }
    //     this.cells = Object.keys(rawEvent).reduce((cellObj, propId) => {
    //         var cell: TimeSeriesEventCell;
    //         if (propId == "timestamp ($ts)")
    //             cell = new TimeSeriesEventCell('timestamp ($ts)', rawEvent[propId], 'DateTime');
    //         else {
    //             cell = new TimeSeriesEventCell(rawEvent[propId]['name'], rawEvent[propId]['value'], rawEvent[propId]['type']);
    //         }
    //         cellObj[cell.key] = cell;
    //         return cellObj;
    //     }, {});
    // }
}
export { TimeSeriesEvent }
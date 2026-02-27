/**
 * Generates a Markdown-ready timestamp in DD/MM/YY HH:MM:SS format
 */
const getMarkdownTimestamp = (): string => {
    const now = new Date();

    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false // Force 24-hour format
    };

    // Format parts to ensure we get exactly DD/MM/YY HH:MM:SS
    const parts = new Intl.DateTimeFormat('en-GB', options).formatToParts(now);
    const p = Object.fromEntries(parts.map(part => [part.type, part.value]));

    return `${p.day}/${p.month}/${p.year} ${p.hour}:${p.minute}:${p.second}`;
};

// Example Usage for an Agent's metadata
const version = "1.0.5";
const author = "SystemAgent";
const mdLine = `**Version:** \`${version}\` | **Time:** \`${getMarkdownTimestamp()}\` | **Author:** \`${author}\``;

console.log(mdLine);

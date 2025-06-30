export default function formatToLocalDateTime(isoString) {
    const date = new Date(isoString);

    const options = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    };

    const localDate = date.toLocaleDateString(undefined, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    const localTime = date.toLocaleTimeString(undefined, options);

    return {
        date: localDate,     // DD-MM-YYYY
        time: localTime,     // HH:MM AM/PM
    };
}

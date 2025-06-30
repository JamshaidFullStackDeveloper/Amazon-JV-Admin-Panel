export function formatDateToDDMMYYYY(dateString) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');     // DD
    const month = String(date.getMonth() + 1).padStart(2, '0'); // MM (0-indexed)
    const year = date.getFullYear();                         // YYYY

    // return `${day}/${month}/${year}`;
    return `${year}-${month}-${day}`;

}

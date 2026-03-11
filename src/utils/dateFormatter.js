// converts date to readable format
const DateFormatter = {
  format: (iso) =>
    new Date(iso).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric"
    }),
};

export default DateFormatter;
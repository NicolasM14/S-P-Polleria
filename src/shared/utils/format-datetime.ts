export function formatDateTime(value: string, locale = "es-AR") {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatDate(value: string, locale = "es-AR") {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "short",
  }).format(new Date(value));
}

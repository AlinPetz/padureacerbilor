export const WHATSAPP_DISPLAY_NUMBER = '+40 744 798 501'
export const WHATSAPP_URL_NUMBER = '40744798501'
export const MAX_GUESTS = 8

export type InquiryFormValues = {
  name: string
  arrival: string
  departure: string
  guests: string
  message: string
}

export type InquiryField = keyof InquiryFormValues

export type InquiryValidationResult =
  | {
      isValid: true
      values: InquiryFormValues
      formattedArrival: string
      formattedDeparture: string
    }
  | {
      isValid: false
      errors: Partial<Record<InquiryField, string>>
      firstInvalidField: InquiryField
    }

type ParsedDate = {
  sortable: string
  formatted: string
}

const DATE_DMY_PATTERN = /^(\d{2})\.(\d{2})\.(\d{4})$/
const DATE_YMD_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/

function isValidCalendarDate(year: number, month: number, day: number) {
  if (month < 1 || month > 12 || day < 1 || day > 31) return false
  const daysInMonth = new Date(year, month, 0).getDate()
  return day <= daysInMonth
}

function toSortableDate(year: string, month: string, day: string) {
  return `${year}-${month}-${day}`
}

export function formatInputDate(value: string): string {
  return parseInputDate(value)?.formatted ?? value.trim()
}

function parseInputDate(value: string): ParsedDate | null {
  const trimmed = value.trim()
  const dmy = trimmed.match(DATE_DMY_PATTERN)
  if (dmy) {
    const [, day, month, year] = dmy
    if (!isValidCalendarDate(Number(year), Number(month), Number(day))) return null
    return {
      sortable: toSortableDate(year, month, day),
      formatted: `${day}.${month}.${year}`,
    }
  }

  const ymd = trimmed.match(DATE_YMD_PATTERN)
  if (ymd) {
    const [, year, month, day] = ymd
    if (!isValidCalendarDate(Number(year), Number(month), Number(day))) return null
    return {
      sortable: toSortableDate(year, month, day),
      formatted: `${day}.${month}.${year}`,
    }
  }

  return null
}

export function getTodaySortable() {
  const now = new Date()
  const year = String(now.getFullYear())
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function validateInquiryForm(
  values: InquiryFormValues,
  todaySortable = getTodaySortable(),
): InquiryValidationResult {
  const trimmedValues: InquiryFormValues = {
    name: values.name.trim(),
    arrival: values.arrival.trim(),
    departure: values.departure.trim(),
    guests: values.guests.trim(),
    message: values.message.trim(),
  }
  const errors: Partial<Record<InquiryField, string>> = {}

  if (!trimmedValues.name) errors.name = 'Introduceți numele.'

  const arrivalDate = parseInputDate(trimmedValues.arrival)
  if (!arrivalDate || arrivalDate.sortable < todaySortable) {
    errors.arrival = 'Selectați data sosirii.'
  }

  const departureDate = parseInputDate(trimmedValues.departure)
  if (!departureDate || (arrivalDate && departureDate.sortable <= arrivalDate.sortable)) {
    errors.departure = 'Data plecării trebuie să fie ulterioară datei sosirii.'
  }

  const guestCount = Number(trimmedValues.guests)
  if (!trimmedValues.guests || !Number.isInteger(guestCount) || guestCount < 1) {
    errors.guests = 'Introduceți numărul de persoane.'
  } else if (guestCount > MAX_GUESTS) {
    errors.guests = 'Cabana poate găzdui maximum 8 persoane.'
  }

  const fieldOrder: InquiryField[] = ['name', 'arrival', 'departure', 'guests', 'message']
  const firstInvalidField = fieldOrder.find((field) => errors[field])
  if (firstInvalidField || !arrivalDate || !departureDate) {
    return {
      isValid: false,
      errors,
      firstInvalidField: firstInvalidField ?? 'arrival',
    }
  }

  return {
    isValid: true,
    values: trimmedValues,
    formattedArrival: arrivalDate.formatted,
    formattedDeparture: departureDate.formatted,
  }
}

export function buildWhatsAppMessage(
  values: InquiryFormValues,
  formattedArrival: string,
  formattedDeparture: string,
) {
  const lines = [
    'Bună ziua!',
    '',
    'Doresc să verific disponibilitatea la Pădurea Cerbilor.',
    '',
    `Nume: ${values.name.trim()}`,
    `Data sosirii: ${formattedArrival}`,
    `Data plecării: ${formattedDeparture}`,
    `Număr de persoane: ${values.guests.trim()}`,
  ]

  const optionalMessage = values.message.trim()
  if (optionalMessage) {
    lines.push('', 'Mesaj:', optionalMessage)
  }

  lines.push('', 'Mulțumesc!')
  return lines.join('\n')
}

export function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${WHATSAPP_URL_NUMBER}?text=${encodeURIComponent(message)}`
}

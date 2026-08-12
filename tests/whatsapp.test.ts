import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  WHATSAPP_URL_NUMBER,
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  formatInputDate,
  getNextSortableDate,
  validateInquiryForm,
} from '../src/utils/whatsapp.ts'

const validValues = {
  name: 'Alin Petz',
  arrival: '2026-09-10',
  departure: '2026-09-12',
  guests: '6',
  message: 'Doresc să aflu dacă ciubărul este disponibil.',
}

const expectedMessage = `Bună ziua!

Doresc să verific disponibilitatea la Pădurea Cerbilor.

Nume: Alin Petz
Data sosirii: 10.09.2026
Data plecării: 12.09.2026
Număr de persoane: 6

Mesaj:
Doresc să aflu dacă ciubărul este disponibil.

Mulțumesc!`

test('builds the requested WhatsApp URL with one encoded message', () => {
  const validation = validateInquiryForm(validValues, '2026-08-12')
  assert.equal(validation.isValid, true)
  if (!validation.isValid) return

  const message = buildWhatsAppMessage(
    validation.values,
    validation.formattedArrival,
    validation.formattedDeparture,
  )
  const url = buildWhatsAppUrl(message)
  const parsedUrl = new URL(url)

  assert.equal(url.startsWith(`https://wa.me/${WHATSAPP_URL_NUMBER}?text=`), true)
  assert.equal(parsedUrl.pathname, `/${WHATSAPP_URL_NUMBER}`)
  assert.equal(parsedUrl.searchParams.get('text'), expectedMessage)
  assert.equal(decodeURIComponent(url.split('text=')[1]), expectedMessage)
  assert.equal(url.includes('%25'), false)
})

test('omits the optional message block when message is empty', () => {
  const validation = validateInquiryForm({ ...validValues, message: '   ' }, '2026-08-12')
  assert.equal(validation.isValid, true)
  if (!validation.isValid) return

  const message = buildWhatsAppMessage(
    validation.values,
    validation.formattedArrival,
    validation.formattedDeparture,
  )

  assert.equal(message.includes('\nMesaj:\n'), false)
  assert.equal(message.includes('\n\n\n'), false)
  assert.equal(message.endsWith('\n\nMulțumesc!'), true)
})

test('formats date inputs without timezone conversion', () => {
  assert.equal(formatInputDate('2026-09-10'), '10.09.2026')
  assert.equal(formatInputDate('10.09.2026'), '10.09.2026')
  assert.equal(getNextSortableDate('2026-09-10'), '2026-09-11')
})

test('rejects past arrival dates, invalid ranges and more than 8 guests', () => {
  const pastArrival = validateInquiryForm({ ...validValues, arrival: '10.08.2026' }, '2026-08-12')
  assert.equal(pastArrival.isValid, false)
  if (!pastArrival.isValid) assert.equal(pastArrival.errors.arrival, 'Selectați data sosirii.')

  const invalidRange = validateInquiryForm(
    { ...validValues, departure: '10.09.2026' },
    '2026-08-12',
  )
  assert.equal(invalidRange.isValid, false)
  if (!invalidRange.isValid) {
    assert.equal(
      invalidRange.errors.departure,
      'Data plecării trebuie să fie ulterioară datei sosirii.',
    )
  }

  const tooManyGuests = validateInquiryForm({ ...validValues, guests: '9' }, '2026-08-12')
  assert.equal(tooManyGuests.isValid, false)
  if (!tooManyGuests.isValid) {
    assert.equal(tooManyGuests.errors.guests, 'Cabana poate găzdui maximum 8 persoane.')
  }
})

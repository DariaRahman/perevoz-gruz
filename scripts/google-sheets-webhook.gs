const TIMEZONE = 'Europe/Minsk'
const COLUMNS = 8

const COLORS = {
  orange: '#F15A24',
  ink: '#1B1612',
  kraft: '#F3EBE3',
  cream: '#FFFDF8',
  soft: '#FFF1E8',
  muted: '#6A5E55',
  white: '#FFFFFF',
  line: '#E6D8CC',
}

const HEADERS = [
  'Дата записи',
  'ФИО',
  'Телефон',
  'Тип переезда',
  'Желаемая дата',
  'Адрес (откуда и куда)',
  'Комментарий',
  'Откуда заявка',
]

function authorizeOnce() {
  const ss = openSpreadsheet_({})
  ss.getName()
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || '{}')
    const now = new Date()
    const sheet = getSheet_(data)
    const origin = formatOrigin_(data)

    sheet.appendRow([
      data.submittedAt || formatMinsk_(now, 'dd.MM.yyyy HH:mm'),
      data.name || '',
      data.phone || '',
      data.moveType || '',
      data.moveDate || '',
      data.address || '',
      data.comment || '',
      origin,
    ])

    const row = sheet.getLastRow()
    styleDataRow_(sheet, row, origin)
    try {
      sendLeadEmail_(data, origin)
    } catch (mailError) {
      // Письмо не должно ломать запись в таблицу
      console.error(mailError)
    }
    return json_({ ok: true })
  } catch (error) {
    return json_({ ok: false, error: String(error) })
  }
}

function formatOrigin_(data) {
  const source = String(data.source || '').trim()
  if (source) return source

  const channel = String(data.sourceChannel || '').trim()
  if (channel === 'card') return 'Из карточки'
  if (channel === 'form') return 'Форма на сайте'
  return 'Кнопка на сайте'
}

function sendLeadEmail_(data, origin) {
  const props = PropertiesService.getScriptProperties()
  const to = String(data.notifyEmail || props.getProperty('NOTIFY_EMAIL') || Session.getEffectiveUser().getEmail() || '').trim()
  if (!to) return

  const lines = [
    'Новая заявка PEREVOZ_GRUZ',
    '',
    'Дата записи: ' + (data.submittedAt || ''),
    'ФИО: ' + (data.name || ''),
    'Телефон: ' + (data.phone || ''),
    'Тип переезда: ' + (data.moveType || ''),
    'Желаемая дата: ' + (data.moveDate || ''),
    'Адрес (откуда и куда): ' + (data.address || ''),
    'Комментарий: ' + (data.comment || '—'),
    'Откуда заявка: ' + origin,
  ]

  MailApp.sendEmail({
    to: to,
    subject: 'Заявка PEREVOZ_GRUZ: ' + (data.moveType || 'переезд'),
    body: lines.join('\n'),
  })
}

function formatMinsk_(date, pattern) {
  return Utilities.formatDate(date, TIMEZONE, pattern)
}

function doOptions() {
  return json_({ ok: true })
}

function openSpreadsheet_(data) {
  const props = PropertiesService.getScriptProperties()
  const id = String((data && data.spreadsheetId) || props.getProperty('SPREADSHEET_ID') || '').trim()
  if (id) return SpreadsheetApp.openById(id)

  const active = SpreadsheetApp.getActiveSpreadsheet()
  if (active) return active

  throw new Error(
    'Нет доступа к таблице. Откройте скрипт из самой таблицы: Расширения → Apps Script. ' +
    'Запустите authorizeOnce и нажмите «Разрешить». ' +
    'Либо в свойствах скрипта укажите SPREADSHEET_ID.',
  )
}

function getSheet_(data) {
  const ss = openSpreadsheet_(data)
  ss.setSpreadsheetTimeZone(TIMEZONE)

  let sheet = ss.getSheetByName('Заявки')
  if (!sheet) {
    sheet = ss.insertSheet('Заявки')
  }

  if (sheet.getLastRow() === 0) {
    formatWorkbook_(sheet)
  }

  return sheet
}

function formatWorkbook_(sheet) {
  sheet.clear()
  sheet.setFrozenRows(3)
  sheet.setHiddenGridlines(true)

  sheet.getRange('A1:H1').merge()
  const title = sheet.getRange('A1')
  title.setValue('PEREVOZ_GRUZ · Журнал заявок')
  title.setFontFamily('Arial')
  title.setFontSize(16)
  title.setFontWeight('bold')
  title.setFontColor(COLORS.white)
  title.setBackground(COLORS.orange)
  title.setVerticalAlignment('middle')
  sheet.setRowHeight(1, 44)

  sheet.getRange('A2:H2').merge()
  const subtitle = sheet.getRange('A2')
  subtitle.setValue('Оранжевый — заявка из карточки услуги. Тёмный — кнопка на сайте. Бежевый — форма внизу страницы.')
  subtitle.setFontColor(COLORS.muted)
  subtitle.setBackground(COLORS.kraft)
  subtitle.setVerticalAlignment('middle')
  sheet.setRowHeight(2, 28)

  const headerRange = sheet.getRange(3, 1, 1, HEADERS.length)
  headerRange.setValues([HEADERS])
  headerRange.setFontWeight('bold')
  headerRange.setFontColor(COLORS.white)
  headerRange.setBackground(COLORS.ink)
  headerRange.setHorizontalAlignment('center')
  headerRange.setVerticalAlignment('middle')
  sheet.setRowHeight(3, 30)

  const widths = [150, 200, 150, 140, 140, 320, 260, 260]
  widths.forEach((width, index) => sheet.setColumnWidth(index + 1, width))

  sheet.getRange(3, 1, 400, COLUMNS).createFilter()
}

function styleDataRow_(sheet, row, origin) {
  const range = sheet.getRange(row, 1, 1, COLUMNS)
  range.setVerticalAlignment('middle')
  range.setFontFamily('Arial')
  range.setFontSize(10)
  range.setBackground(row % 2 === 0 ? COLORS.soft : COLORS.cream)
  range.setBorder(true, true, true, true, false, false, COLORS.line, SpreadsheetApp.BorderStyle.SOLID)

  const sourceCell = sheet.getRange(row, COLUMNS)
  sourceCell.setFontWeight('bold')
  sourceCell.setHorizontalAlignment('center')

  if (String(origin).indexOf('Из карточки') === 0) {
    sourceCell.setBackground(COLORS.orange)
    sourceCell.setFontColor(COLORS.white)
  } else if (String(origin).indexOf('Форма') === 0) {
    sourceCell.setBackground(COLORS.kraft)
    sourceCell.setFontColor(COLORS.ink)
  } else {
    sourceCell.setBackground(COLORS.ink)
    sourceCell.setFontColor(COLORS.white)
  }
}

function json_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON)
}

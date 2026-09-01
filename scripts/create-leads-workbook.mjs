import ExcelJS from 'exceljs'
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outPath = join(__dirname, '..', 'docs', 'PEREVOZ_GRUZ-Заявки.xlsx')

mkdirSync(dirname(outPath), { recursive: true })

const workbook = new ExcelJS.Workbook()
workbook.creator = 'PEREVOZ_GRUZ'
workbook.created = new Date()
workbook.modified = new Date()

const orange = 'FFF15A24'
const ink = 'FF1B1612'
const kraft = 'FFF3EBE3'
const cream = 'FFFFFDF8'
const soft = 'FFFFF1E8'
const muted = 'FF6A5E55'
const white = 'FFFFFFFF'
const line = 'FFE6D8CC'

const sheet = workbook.addWorksheet('Заявки', {
  views: [{ state: 'frozen', ySplit: 3, showGridLines: false }],
  properties: { defaultRowHeight: 22, tabColor: { argb: orange } },
})

sheet.mergeCells('A1:H1')
const title = sheet.getCell('A1')
title.value = 'PEREVOZ_GRUZ · Журнал заявок'
title.font = { name: 'Calibri', size: 18, bold: true, color: { argb: white } }
title.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: orange } }
title.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 }
sheet.getRow(1).height = 44

sheet.mergeCells('A2:H2')
const subtitle = sheet.getCell('A2')
subtitle.value = 'Оранжевый — заявка из карточки услуги. Тёмный — кнопка на сайте. Бежевый — форма внизу страницы.'
subtitle.font = { name: 'Calibri', size: 11, color: { argb: muted } }
subtitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: kraft } }
subtitle.alignment = { vertical: 'middle', horizontal: 'left', indent: 1, wrapText: true }
sheet.getRow(2).height = 28

const headers = [
  'Дата записи',
  'ФИО',
  'Телефон',
  'Тип переезда',
  'Желаемая дата',
  'Адрес (откуда и куда)',
  'Комментарий',
  'Откуда заявка',
]

headers.forEach((label, index) => {
  const cell = sheet.getCell(3, index + 1)
  cell.value = label
  cell.font = { name: 'Calibri', size: 12, bold: true, color: { argb: white } }
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: ink } }
  cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
  cell.border = {
    bottom: { style: 'thin', color: { argb: orange } },
  }
})
sheet.getRow(3).height = 30

const examples = [
  [
    '31.08.2026 20:40',
    'Иванов Иван Иванович',
    '+375 29 000-00-00',
    'Квартирный',
    '2026-09-05',
    'Могилёв, ул. Ленина, 1 → Могилёв, пр. Мира, 10',
    '3 этаж, лифт есть',
    'Из карточки: Грузовая машина + грузчики',
  ],
  [
    '31.08.2026 21:05',
    'Петрова Анна Сергеевна',
    '+375 33 111-22-33',
    'Дачный',
    '2026-09-12',
    'Могилёв → д. Буйничи',
    'Нужна машина с тентом',
    'Кнопка на сайте',
  ],
  [
    '31.08.2026 21:20',
    'Сидоров Пётр',
    '+375 25 444-55-66',
    'Грузчики',
    '2026-09-08',
    'Могилёв, ул. Крупской → Могилёв, ул. Гришина',
    '',
    'Форма на сайте',
  ],
]

const sourceStyles = {
  card: { fill: orange, font: white },
  button: { fill: ink, font: white },
  form: { fill: kraft, font: ink },
}

examples.forEach((row, rowIndex) => {
  const excelRow = 4 + rowIndex
  const channel = rowIndex === 0 ? 'card' : rowIndex === 1 ? 'button' : 'form'
  row.forEach((value, index) => {
    const cell = sheet.getCell(excelRow, index + 1)
    cell.value = value
    cell.font = { name: 'Calibri', size: 11, color: { argb: ink } }
    cell.alignment = { vertical: 'middle', wrapText: index === 5 || index === 6 || index === 7 }
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: excelRow % 2 === 0 ? soft : cream },
    }
    cell.border = {
      bottom: { style: 'thin', color: { argb: line } },
    }

    if (index === 7) {
      const style = sourceStyles[channel]
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: style.fill } }
      cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: style.font } }
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    }
  })
  sheet.getRow(excelRow).height = 28
})

sheet.addConditionalFormatting({
  ref: 'H4:H400',
  rules: [
    {
      type: 'containsText',
      operator: 'containsText',
      text: 'Из карточки',
      style: {
        fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: orange } },
        font: { bold: true, color: { argb: white } },
      },
    },
    {
      type: 'containsText',
      operator: 'containsText',
      text: 'Кнопка на сайте',
      style: {
        fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: ink } },
        font: { bold: true, color: { argb: white } },
      },
    },
    {
      type: 'containsText',
      operator: 'containsText',
      text: 'Форма на сайте',
      style: {
        fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: kraft } },
        font: { bold: true, color: { argb: ink } },
      },
    },
  ],
})

sheet.getColumn(1).width = 20
sheet.getColumn(2).width = 28
sheet.getColumn(3).width = 20
sheet.getColumn(4).width = 16
sheet.getColumn(5).width = 16
sheet.getColumn(6).width = 46
sheet.getColumn(7).width = 32
sheet.getColumn(8).width = 38

sheet.autoFilter = {
  from: { row: 3, column: 1 },
  to: { row: 400, column: 8 },
}

await workbook.xlsx.writeFile(outPath)
console.log(`Создано: ${outPath}`)

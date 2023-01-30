import xlsx from 'xlsx'

export class ExcelBuilder {
  static jsonToExcelBuffer(data) {
    let sheet = xlsx.utils.json_to_sheet(data, {skipHeader: true});
    let book = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(book, sheet);
    return xlsx.write(book, {type:'buffer', bookType:'xlsx'});
  }
}
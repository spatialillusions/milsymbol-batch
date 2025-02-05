import { read, utils } from "xlsx";
import ms from "milsymbol";

function downloadLink(link) {
  console.log("download");
  link.click();
}

export default async function milsymbolBatch(e) {
  let format = document.getElementById("format").value;

  let files = e.target.files;
  let file_i = files.length - 1;
  const file = files[file_i];
  const data = await file.arrayBuffer();
  const workbook = read(data);

  let result = {};
  workbook.SheetNames.forEach(function (sheetName) {
    let roa = utils.sheet_to_json(workbook.Sheets[sheetName]);
    if (roa.length) result[sheetName] = roa;
  });
  let i = 0;
  for (let key in result) {
    let sheet = result[key];
    for (let row in sheet) {
      let sym = new ms.Symbol(sheet[row]);
      if (!sym.isValid()) continue;
      let link = document.createElement("a");
      link.href =
        format == "png" ? sym.asCanvas().toDataURL() : sym.toDataURL();
      link.download =
        sym.options.sidc +
        "_" +
        sheet[row].__rowNum__ +
        "_" +
        (sheet[row].uniqueDesignation || "") +
        "." +
        format;
      i++;
      window.setTimeout(downloadLink, 150 * i, link);
    }
  }
}

/* processing array buffers, only required for readAsArrayBuffer */
function fixdata(data) {
  var o = "",
    l = 0,
    w = 10240;
  for (; l < data.byteLength / w; ++l)
    o += String.fromCharCode.apply(
      null,
      new Uint8Array(data.slice(l * w, l * w + w))
    );
  o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
  return o;
}

var rABS = true; // true: readAsBinaryString ; false: readAsArrayBuffer

function downloadLink(link) {
  link.click();
}

function milsymbolBatch(e) {
  var format = document.getElementById("format").value;

  var files = e.target.files;
  var i, f;
  for (i = 0; i != files.length; ++i) {
    f = files[i];
    var reader = new FileReader();
    var name = f.name;
    reader.onload = function(e) {
      var data = e.target.result;

      var workbook;
      if (rABS) {
        /* if binary string, read with type 'binary' */
        workbook = XLSX.read(data, { type: "binary" });
      } else {
        /* if array buffer, convert to base64 */
        var arr = fixdata(data);
        workbook = XLSX.read(btoa(arr), { type: "base64" });
      }

      var result = {};
      workbook.SheetNames.forEach(function(sheetName) {
        var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        if (roa.length) result[sheetName] = roa;
      });
      var i = 0;

      for (key in result) {
        var sheet = result[key];
        for (row in sheet) {
          var sym = new ms.Symbol(sheet[row]);

          if (sym.isValid()) break;
          var link = document.createElement("a");
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
    };
    reader.readAsBinaryString(f);
  }
}

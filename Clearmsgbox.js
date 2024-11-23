function onEdit(e) {
  var sheet = e.source.getActiveSheet();
  var range = e.range;

  // Clear Msgtxt content if the cell is edited
  if (sheet.getName() === 'Form') {
    var msgRange = sheet.getRange("Msgtxt");
    msgRange.clearContent();
  }
}

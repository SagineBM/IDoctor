function addAppointment(cin, date, time, patient, reason) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var dbSheet = ss.getSheetByName('DB');
  var reservationData = dbSheet.getRange(2, 1, dbSheet.getLastRow() - 1, dbSheet.getLastColumn()).getValues();

  // Check for duplicates
  for (var i = 0; i < reservationData.length; i++) {
    var existingDate = Utilities.formatDate(new Date(reservationData[i][6]), Session.getScriptTimeZone(), "yyyy-MM-dd");
    var existingTime = Utilities.formatDate(new Date(reservationData[i][7]), Session.getScriptTimeZone(), "HH:mm:ss");
    
    if (existingDate === date && existingTime === time) {
      return "An appointment already exists for this date and time.";
    }
  }

  // Add the new appointment to the DB sheet
  dbSheet.appendRow([cin, patient, null, null, null, null, date, time, reason, null, null, null, null, new Date()]);
  return "Appointment successfully added.";
}






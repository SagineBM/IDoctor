function deleteReservation() {
var sheetDB = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DB");
  var sheetForm = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form");

  // Retrieve form values
  var CIN = sheetForm.getRange("E10").getValue();
  var reservationDate = sheetForm.getRange("L10").getValue();
  var time = sheetForm.getRange("L11").getValue();

  if (CIN === "" || reservationDate === "" || time === "") {
    SpreadsheetApp.getUi().alert("CIN, Reservation Date, and Time are mandatory to delete a reservation.");
    return;
  }

  // Get all data from DB sheet
  var data = sheetDB.getRange(2, 1, sheetDB.getLastRow() - 1, sheetDB.getLastColumn()).getValues();
  var rowIndex = -1;

  // Search for the row with the matching CIN, reservation date, and time
  for (var i = 0; i < data.length; i++) {
    if (data[i][0] == CIN &&
        data[i][6].toString() == reservationDate.toString() &&
        data[i][7].toString() == time.toString()) {
      rowIndex = i + 2;  // Adjust for header row
      break;
    }
  }

  if (rowIndex !== -1) {
    sheetDB.deleteRow(rowIndex);
    sheetForm.getRange("Msgtxt").setValue("Record with CIN " + CIN + " has been deleted.");
  } else {
    sheetForm.getRange("Msgtxt").setValue("No record found with CIN " + CIN + ".");
  }
}

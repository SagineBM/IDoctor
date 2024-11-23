function enterReservation() {
  var sheetDB = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DB");
  var sheetForm = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form");

  // Retrieve form values
  var CIN = sheetForm.getRange("E10").getValue();
  var patientName = sheetForm.getRange("E11").getValue();
  var dob = sheetForm.getRange("E12").getValue();
  var gender = sheetForm.getRange("E13").getValue();
  var email = sheetForm.getRange("H11").getValue();
  var phone = sheetForm.getRange("G11").getValue();
  var reservationDate = sheetForm.getRange("L10").getValue();
  var time = sheetForm.getRange("L11").getValue();
  var reasonForVisit = sheetForm.getRange("L12").getValue();
  var doctor = sheetForm.getRange("L13").getValue();
  var status = sheetForm.getRange("O12").getValue();
  var diagnosis = sheetForm.getRange("O11").getValue();
  var treatment = sheetForm.getRange("O10").getValue();
  var note = sheetForm.getRange("O13").getValue();
  var operation = sheetForm.getRange("Ops").getValue();

  if (CIN === "" || operation === "") {
    SpreadsheetApp.getUi().alert("CIN and Operation are mandatory to make a reservation.");
    return;
  }

  // Check for existing reservation with the same date and time
  var data = sheetDB.getRange(2, 1, sheetDB.getLastRow() - 1, 16).getValues();
  for (var i = 0; i < data.length; i++) {
    if (data[i][6].toString() === reservationDate.toString() && data[i][7].toString() === time.toString()) {
      SpreadsheetApp.getUi().alert("The selected date and time are already booked. Please choose another slot.");
      return; // Stop the function if a duplicate is found
    }
  }

  // Generate unique ID
  var namePart = patientName.substring(0, 3).toUpperCase(); // First 3 letters of the patient’s name
  var datePart = Utilities.formatDate(reservationDate, Session.getScriptTimeZone(), "yyyyMMdd"); // Date in YYYYMMDD format
  var timePart = Utilities.formatDate(time, Session.getScriptTimeZone(), "HHmm"); // Time in HHMM format
  var uniqueID = namePart + "-" + datePart + "-" + timePart + "-" + CIN;

  // Append new data with a timestamp and unique ID
  sheetDB.appendRow([CIN, patientName, dob, gender, email, phone, reservationDate, time, reasonForVisit, doctor, status, diagnosis, treatment, note, operation, new Date(), uniqueID]);

  var timeZone = Session.getScriptTimeZone();
  // Ensure to match the correct timezone
  var formattedDate = Utilities.formatDate(reservationDate, timeZone, "EEE MMM dd yyyy");
  var formattedTime = Utilities.formatDate(time, timeZone, "HH:mm");

  // Construct the success message
  var successMessage = "Reservation done for " + patientName + " on " + formattedDate + " At " + formattedTime;

  // Set the message to the appropriate range (Msgtxt)
  sheetForm.getRange("Msgtxt").setValue(successMessage);

  // Get the last 10 operations with 12 columns and include headers
  var last10Operations = sheetDB.getRange(Math.max(sheetDB.getLastRow() - 9, 2), 1, Math.min(10, sheetDB.getLastRow() - 1), 16).getValues();
  var headers = ["CIN", "Patient Name", "DOB", "Gender", "Email", "Phone", "Reservation Date", "Time", "Reason for Visit", "Doctor", "Status", "Diagnosis"];
  var filteredLast10Operations = last10Operations.map(function(row) {
    return [row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8], row[9], row[10], row[11]];
  });
  filteredLast10Operations.unshift(headers);

  // Add headers to the top of the history data
  // Clear the history range and set the new data
  var historyRange = sheetForm.getRange("History");
  historyRange.clearContent();
  historyRange.offset(0, 0, filteredLast10Operations.length, filteredLast10Operations[0].length).setValues(filteredLast10Operations);

  // Simplified formatting
  var dateFormat = "MMM dd, yyyy";
  var timeFormat = "HH:mm";
  var phoneFormat = "0000000000";

  // Apply date format to Reservation Date column (column 7)
  historyRange.offset(1, 6, filteredLast10Operations.length - 1, 1).setNumberFormat(dateFormat);
  // Apply time format to Time column (column 8)
  historyRange.offset(1, 7, filteredLast10Operations.length - 1, 1).setNumberFormat(timeFormat);
  // Apply phone format to Phone column (column 6)
  historyRange.offset(1, 5, filteredLast10Operations.length - 1, 1).setNumberFormat(phoneFormat);
}

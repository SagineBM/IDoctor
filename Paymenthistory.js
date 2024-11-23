function showHistory() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetForm = ss.getSheetByName('Form');
  var sheetDB = ss.getSheetByName('DB');
  var sheetPayment = ss.getSheetByName('Payment');

  // Retrieve CIN from the form
  var CIN1 = sheetForm.getRange("E10").getValue();
  var CIN2 = sheetForm.getRange("W18").getValue();

  if (CIN1 !== CIN2) {
    SpreadsheetApp.getUi().alert('CIN in E10 and W18 do not match. Please correct the CIN.');
    return;
  }

  var CIN = CIN1;
  if (!CIN) {
    sheetForm.getRange("Msgtxt").setValue("Please enter a CIN.");
    return;
  }

  // Get all Reservation IDs corresponding to the CIN in the DB sheet
  var dbData = sheetDB.getRange(2, 1, sheetDB.getLastRow() - 1, sheetDB.getLastColumn()).getValues();
  var reservationIDs = [];
  for (var i = 0; i < dbData.length; i++) {
    if (dbData[i][0] == CIN) { // Assuming CIN is in the first column
      reservationIDs.push(dbData[i][16]); // Assuming Reservation ID is in column Q (index 16)
    }
  }

  if (reservationIDs.length === 0) {
    sheetForm.getRange("Msgtxt").setValue("No reservations found for the given CIN.");
    return;
  }

  // Get payment history for the Reservation IDs
  var paymentData = sheetPayment.getRange(2, 1, sheetPayment.getLastRow() - 1, sheetPayment.getLastColumn()).getValues();
  var historyData = [];
  for (var i = 0; i < paymentData.length; i++) {
    if (reservationIDs.indexOf(paymentData[i][0]) !== -1) { // Check if the Reservation ID matches
      historyData.push([
        paymentData[i][0], paymentData[i][2], paymentData[i][8], paymentData[i][9], paymentData[i][10], paymentData[i][18],
        paymentData[i][19], paymentData[i][20], paymentData[i][21], paymentData[i][22], paymentData[i][24], paymentData[i][25]
      ]);
    }
  }

  if (historyData.length === 0) {
    sheetForm.getRange("Msgtxt").setValue("No payment history found for the given CIN.");
    return;
  }

  // Limit to last 10 records
  var limitedHistoryData = historyData.slice(-10);
  // Add headers to the top of the history data
  limitedHistoryData.unshift(['ReservationID', 'Patient', 'Reservation Date', 'Time', 'Reason for Visit', 'Billing Amount', 
                             'Payment Status', 'Payment Method', 'Amount Paid', 'Debt', 'Payment Timestamp', 'Settled Timestamp']);

  // Clear the history range and set the new data
  var historyRange = sheetForm.getRange("History");
  historyRange.clearContent();
  historyRange.offset(0, 0, limitedHistoryData.length, limitedHistoryData[0].length).setValues(limitedHistoryData);

  // Simplified formatting
  var dateFormat = "MMM dd, yyyy";
  var timeFormat = "HH:mm";
  var currencyFormat = "#,##0.00 \"MAD\"";
  var timestampFormat = "MM/dd/yyyy HH:mm:ss";

  // Apply date format to Reservation Date column (column 3, offset by 2 from column index)
  historyRange.offset(1, 2, limitedHistoryData.length - 1, 1).setNumberFormat(dateFormat);
  // Apply time format to Time column (column 4, offset by 3 from column index)
  historyRange.offset(1, 3, limitedHistoryData.length - 1, 1).setNumberFormat(timeFormat);
  // Apply currency format to Billing Amount, Amount Paid, and Debt columns
  historyRange.offset(1, 5, limitedHistoryData.length - 1, 1).setNumberFormat(currencyFormat); // Billing Amount (column 6)
  historyRange.offset(1, 8, limitedHistoryData.length - 1, 1).setNumberFormat(currencyFormat); // Amount Paid (column 9)
  historyRange.offset(1, 9, limitedHistoryData.length - 1, 1).setNumberFormat(currencyFormat); // Debt (column 10)
  // Apply timestamp format to Payment Timestamp and Settled Timestamp columns
  historyRange.offset(1, 10, limitedHistoryData.length - 1, 1).setNumberFormat(timestampFormat); // Payment Timestamp (column 11)
  historyRange.offset(1, 11, limitedHistoryData.length - 1, 1).setNumberFormat(timestampFormat); // Settled Timestamp (column 12)
}

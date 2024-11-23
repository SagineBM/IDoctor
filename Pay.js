function addPayment() {
  var sheetForm = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form");
  var sheetPayment = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Payment");

  // Retrieve form values
  var reservationID = sheetForm.getRange("ReservationID").getValue();
  var billingAmount = sheetForm.getRange("BillingAmount").getValue();
  var paymentStatus = sheetForm.getRange("PaymentStatus").getValue();
  var paymentMethod = sheetForm.getRange("PaymentMethod").getValue();
  var amountPaid = sheetForm.getRange("AmountPaid").getValue();
  var msgtxt = sheetForm.getRange("Msgtxt");

  // Validation
  if (!reservationID || !billingAmount || !paymentStatus || !paymentMethod || !amountPaid) {
    msgtxt.setValue("Please fill in all payment fields.");
    return;
  }

  // Check for existing reservationID in Payment sheet
  var data = sheetPayment.getRange(2, 1, sheetPayment.getLastRow() - 1, 1).getValues();
  for (var i = 0; i < data.length; i++) {
    if (data[i][0] == reservationID) {
      msgtxt.setValue("A payment record with the same reservation ID already exists. Please use a different reservation ID.");
      return;
    }
  }

  // Find the next empty row in the Payment sheet
  var nextRow = sheetPayment.getLastRow() + 1;

  // Write data to the Payment sheet
  sheetPayment.getRange(nextRow, 1).setValue(reservationID); // Column A
  sheetPayment.getRange(nextRow, 19).setValue(billingAmount); // Column S
  sheetPayment.getRange(nextRow, 20).setValue(paymentStatus); // Column T
  sheetPayment.getRange(nextRow, 21).setValue(paymentMethod); // Column U
  sheetPayment.getRange(nextRow, 22).setValue(amountPaid); // Column V
  sheetPayment.getRange(nextRow, 25).setValue(new Date()); // Column Y (Timestamp)

  // Check if Column X is True and add an additional timestamp
  if (sheetPayment.getRange(nextRow, 24).getValue() === true) {
    sheetPayment.getRange(nextRow, 26).setValue(new Date()); // Column Z (Additional Timestamp)
  }

  // Display success message
  msgtxt.setValue("Payment of " + amountPaid + " with the " + paymentMethod + " method added successfully.");
}

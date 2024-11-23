function updatePayment() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var formSheet = ss.getSheetByName('Form');
  var paymentSheet = ss.getSheetByName('Payment');

  var reservationID = formSheet.getRange("ReservationID").getValue();
  var billingAmount = formSheet.getRange("BillingAmount").getValue();
  var paymentStatus = formSheet.getRange("PaymentStatus").getValue();
  var paymentMethod = formSheet.getRange("PaymentMethod").getValue();
  var amountPaid = formSheet.getRange("AmountPaid").getValue();
  var msgtxt = formSheet.getRange("Msgtxt");

  // Logging to debug
  Logger.log("ReservationID: " + reservationID);
  Logger.log("BillingAmount: " + billingAmount);
  Logger.log("PaymentStatus: " + paymentStatus);
  Logger.log("PaymentMethod: " + paymentMethod);
  Logger.log("AmountPaid: " + amountPaid);

  if (!reservationID || !billingAmount || !paymentStatus || !paymentMethod || !amountPaid) {
    msgtxt.setValue("Please fill in all fields.");
    return;
  }

  var data = paymentSheet.getRange(2, 1, paymentSheet.getLastRow() - 1, paymentSheet.getLastColumn()).getValues();
  var headers = paymentSheet.getRange(1, 1, 1, paymentSheet.getLastColumn()).getValues()[0];
  var rowToEdit = -1;

  for (var i = 0; i < data.length; i++) {
    if (data[i][0] == reservationID) {
      rowToEdit = i + 2; // Adjust for header row
      break;
    }
  }

  if (rowToEdit != -1) {
    paymentSheet.getRange(rowToEdit, 1).setValue(reservationID); // Reservation ID
    paymentSheet.getRange(rowToEdit, 19).setValue(billingAmount); // Billing Amount
    paymentSheet.getRange(rowToEdit, 20).setValue(paymentStatus); // Payment Status
    paymentSheet.getRange(rowToEdit, 21).setValue(paymentMethod); // Payment Method
    paymentSheet.getRange(rowToEdit, 22).setValue(amountPaid); // Amount Paid
    paymentSheet.getRange(rowToEdit, 25).setValue(new Date()); // Timestamp

// Check if Column X is True
    if (paymentSheet.getRange(rowToEdit, 24).getValue() === true) {
      paymentSheet.getRange(rowToEdit, 26).setValue(new Date()); // Additional Timestamp
    }

    var confirmationMessage = "Payment edited successfully. Details: \n" +
                              "Reservation ID: " + reservationID + "\n" +
                              "Billing Amount: " + billingAmount + "\n" +
                              "Payment Status: " + paymentStatus + "\n" +
                              "Payment Method: " + paymentMethod + "\n" +
                              "Amount Paid: " + amountPaid;
    msgtxt.setValue(confirmationMessage);
  } else {
    msgtxt.setValue("No matching record found.");
  }
}

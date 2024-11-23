function clearForm() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var formSheet = ss.getSheetByName('Form');

  // Clear the specific fields
  formSheet.getRange('E10').clearContent(); // CIN
  formSheet.getRange('E11').clearContent(); // Patient Name
  formSheet.getRange('E12').clearContent(); // Date of Birth
  formSheet.getRange('E13').clearContent(); // Gender
  formSheet.getRange('H11').clearContent(); // Email
  formSheet.getRange('G11').clearContent(); // Phone
  formSheet.getRange('L10').clearContent(); // Reservation Date
  formSheet.getRange('L11').clearContent(); // Time
  formSheet.getRange('L12').clearContent(); // Reason for Visit
  formSheet.getRange('L13').clearContent(); // Doctor
  formSheet.getRange('O12').clearContent(); // Status
  formSheet.getRange('O11').clearContent(); // Diagnosis
  formSheet.getRange('O10').clearContent(); // Treatment
  formSheet.getRange('O13').clearContent(); // Notes
  formSheet.getRange('Ops').clearContent(); // Operation
  formSheet.getRange('Msgtxt').clearContent(); 
  formSheet.getRange('ReservationID').clearContent(); 
  formSheet.getRange('BillingAmount').clearContent(); 
  formSheet.getRange('PaymentStatus').clearContent(); 
  formSheet.getRange('PaymentMethod').clearContent(); 
  formSheet.getRange('AmountPaid').clearContent(); 
  formSheet.getRange('SearchV1').clearContent(); 
  formSheet.getRange('SearchV2').clearContent(); 
  formSheet.getRange('History').clearContent(); 
}

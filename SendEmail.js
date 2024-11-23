function sendReminderEmail() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form"); // Adjust to your form sheet name
  var dbSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DB"); // Adjust to your DB sheet name
  var emailSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Email"); // Adjust to your Email sheet name

  // Fetch form values
  var cin = sheet.getRange("E10").getValue();
  var patientName = sheet.getRange("E11").getValue();
  var dob = sheet.getRange("E12").getValue();
  var gender = sheet.getRange("E13").getValue();
  var email = sheet.getRange("H11").getValue();
  var phone = sheet.getRange("G11").getValue();
  var reservationDate = sheet.getRange("L10").getValue();
  var time = sheet.getRange("L11").getValue();
  var reasonForVisit = sheet.getRange("L12").getValue();
  var doctor = sheet.getRange("L13").getValue();
  var msgtxt = sheet.getRange("Msgtxt");

  // Fetch email subject and body from the Email sheet
  var emailSubject = emailSheet.getRange("EmailSubject").getValue();
  var emailBody = emailSheet.getRange("EmailBody").getValues();

  // Format the date and time
  var timeZone = Session.getScriptTimeZone();
  var formattedDate = Utilities.formatDate(new Date(reservationDate), timeZone, "EEEE, MMMM d, yyyy");
  var formattedTime = Utilities.formatDate(new Date(time), timeZone, "HH:mm:ss '(GMT'+1')'");

  // Compose the email content using the custom template from the Email sheet
  var subject = emailSubject;
  var body = emailBody[0][0] + " " + patientName + ",\n\n" + // Dear
             emailBody[1][0] + "\n" + // This is a reminder for your appointment
             emailBody[2][0] + " " + formattedDate + "\n" + // Date
             emailBody[3][0] + " " + formattedTime + "\n" + // Time
             emailBody[4][0] + " " + doctor + "\n" + // Doctor
             emailBody[5][0] + " " + reasonForVisit + "\n\n" + // Reason for Visit
             emailBody[6][0] + "\n" + // Please contact us if you need to reschedule.
             emailBody[7][0] + "\n\n" + // Best regards
             emailBody[8][0]; // Mohssine Bencaga

  // Send the email
  if (email) {
    MailApp.sendEmail(email, subject, body);
    Logger.log("Email sent to " + email);
    msgtxt.setValue("Email sent to " + patientName + " at " + email);
  } else {
    Logger.log("Email address not found.");
    msgtxt.setValue("Email address not found for " + patientName);
  }
}

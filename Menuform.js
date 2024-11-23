function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Appointments')
    .addItem('Add Appointment', 'openAppointmentFormDirect')
    .addToUi();
}
function openAppointmentFormDirect() {
  var template = HtmlService.createTemplateFromFile('AppointmentForm');
  var htmlOutput = template.evaluate()
    .setWidth(400)
    .setHeight(300);
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Add Appointment');
}

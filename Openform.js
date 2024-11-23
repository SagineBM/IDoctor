function openAppointmentFormDirect() {
  var template = HtmlService.createTemplateFromFile('AppointmentForm');
  template.date = '';
  template.time = '';
  var htmlOutput = template.evaluate()
    .setWidth(400)
    .setHeight(300);
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Add Appointment');
}

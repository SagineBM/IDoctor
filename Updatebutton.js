function updateRecord() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var formSheet = ss.getSheetByName('Form');
  var dbSheet = ss.getSheetByName('DB');

  // Get search values
  var searchKey1 = formSheet.getRange('E3').getValue();
  var searchKey2 = formSheet.getRange('I3').getValue();
  var searchV1 = formSheet.getRange('SearchV1').getValue();
  var searchV2 = formSheet.getRange('SearchV2').getValue();

  var dbData = dbSheet.getRange(2, 1, dbSheet.getLastRow() - 1, dbSheet.getLastColumn()).getValues();
  var headers = dbSheet.getRange(1, 1, 1, dbSheet.getLastColumn()).getValues()[0];

  var index1 = headers.indexOf(searchKey1);
  var index2 = headers.indexOf(searchKey2);

  if (index1 === -1 || (searchV2 && index2 === -1)) {
    SpreadsheetApp.getUi().alert('Search keys not found in headers.');
    return;
  }

  var matchedRow = null;
  var latestTimestamp = null;
  var matchedRowIndex = -1;

  for (var i = 0; i < dbData.length; i++) {
    var match1 = dbData[i][index1] == searchV1;
    var match2 = searchV2 ? dbData[i][index2] == searchV2 : true;
    if (match1 && match2) {
      var timestamp = new Date(dbData[i][15]); // Assuming Timestamp is in column P (index 15)
      if (!latestTimestamp || timestamp > latestTimestamp) {
        matchedRow = dbData[i];
        latestTimestamp = timestamp;
        matchedRowIndex = i + 2; // +2 to account for header and 1-based index
      } else if (!latestTimestamp && new Date(dbData[i][6]) > new Date(matchedRow[6])) { // Using ReservationDate as a fallback
        matchedRow = dbData[i];
        matchedRowIndex = i + 2; // +2 to account for header and 1-based index
      }
    }
  }

  if (matchedRow && matchedRowIndex > -1) {
    // Get updated values from Form sheet
    var updatedValues = [
      formSheet.getRange('E10').getValue(), // CIN
      formSheet.getRange('E11').getValue(), // Patient Name
      formSheet.getRange('E12').getValue(), // DOB
      formSheet.getRange('E13').getValue(), // Gender
      formSheet.getRange('H11').getValue(), // Email
      formSheet.getRange('G11').getValue(), // Phone
      formSheet.getRange('L10').getValue(), // ReservationDate
      formSheet.getRange('L11').getValue(), // Time
      formSheet.getRange('L12').getValue(), // Reason for Visit
      formSheet.getRange('L13').getValue(), // Doctor
      formSheet.getRange('O12').getValue(), // Status
      formSheet.getRange('O11').getValue(), // Diagnosis
      formSheet.getRange('O10').getValue(), // Treatment
      formSheet.getRange('O13').getValue(), // Notes
      formSheet.getRange('Ops').getValue(), // Operation
      new Date() // Timestamp
    ];

    // Update the row in DB sheet
    dbSheet.getRange(matchedRowIndex, 1, 1, updatedValues.length).setValues([updatedValues]);

    formSheet.getRange('Msgtxt').setValue('');
  } else {
    formSheet.getRange('Msgtxt').setValue('No matching records found to update.');
  }
}

function searchAndDisplay() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var formSheet = ss.getSheetByName('Form');
  var dbSheet = ss.getSheetByName('DB');
  var searchKey1 = formSheet.getRange('E3').getValue();
  var searchKey2 = formSheet.getRange('I3').getValue();
  var searchV1 = formSheet.getRange('SearchV1').getValue();
  var searchV2 = formSheet.getRange('SearchV2').getValue();
  var historyRange = formSheet.getRange('History');
  var dbData = dbSheet.getRange(2, 1, dbSheet.getLastRow() - 1, dbSheet.getLastColumn()).getValues();
  var headers = dbSheet.getRange(1, 1, 1, dbSheet.getLastColumn()).getValues()[0];
  var index1 = headers.indexOf(searchKey1);
  var index2 = headers.indexOf(searchKey2);

  if (index1 === -1 && index2 === -1) {
    SpreadsheetApp.getUi().alert('Search keys not found in headers.');
    return;
  }

  var matchedRow = null;
  for (var i = 0; i < dbData.length; i++) {
    var match1 = (index1 !== -1) ? dbData[i][index1].toString() === searchV1.toString() : false;
    var match2 = (index2 !== -1) ? dbData[i][index2].toString() === searchV2.toString() : false;

    // Check for exact match if both searchV1 and searchV2 are provided
    if (searchV1 && searchV2) {
      if (match1 && match2) {
        matchedRow = dbData[i];
        break;
      }
    } else if (searchV1) { // If only searchV1 is provided
      if (match1) {
        matchedRow = dbData[i];
        break;
      }
    } else if (searchV2) { // If only searchV2 is provided
      if (match2) {
        matchedRow = dbData[i];
        break;
      }
    }
  }

  if (matchedRow) {
    formSheet.getRange('E10').setValue(matchedRow[0]); // CIN
    formSheet.getRange('E11').setValue(matchedRow[1]); // Patient Name
    formSheet.getRange('E12').setValue(matchedRow[2]); // DOB
    formSheet.getRange('E13').setValue(matchedRow[3]); // Gender
    formSheet.getRange('H11').setValue(matchedRow[4]); // Email
    formSheet.getRange('G11').setValue(matchedRow[5]); // Phone
    formSheet.getRange('L10').setValue(matchedRow[6]); // Reservation Date
    formSheet.getRange('L11').setValue(matchedRow[7]); // Time
    formSheet.getRange('L12').setValue(matchedRow[8]); // Reason for Visit
    formSheet.getRange('L13').setValue(matchedRow[9]); // Doctor
    formSheet.getRange('O12').setValue(matchedRow[10]); // Status
    formSheet.getRange('O11').setValue(matchedRow[11]); // Diagnosis
    formSheet.getRange('O10').setValue(matchedRow[12]); // Treatment
    formSheet.getRange('O13').setValue(matchedRow[13]); // Notes
    formSheet.getRange('Ops').setValue(matchedRow[14]); // Operation

    var historyData = [['CIN', 'Patient Name', 'DOB', 'Gender', 'Email', 'Phone', 'Reservation Date', 'Time', 'Reason for Visit', 'Doctor', 'Status', 'Diagnosis']]; // Add headers
    var count = 0;
    for (var j = 0; j < dbData.length && count < 10; j++) {
      if (searchV1 && searchV2) {
        if (dbData[j][index1].toString() === searchV1.toString() && dbData[j][index2].toString() === searchV2.toString()) {
          historyData.push([
            dbData[j][0], dbData[j][1], dbData[j][2], dbData[j][3], dbData[j][4],
            dbData[j][5], dbData[j][6], dbData[j][7], dbData[j][8], dbData[j][9],
            dbData[j][10], dbData[j][11]
          ]);
          count++;
        }
      } else if (searchV1) {
        if (dbData[j][index1].toString() === searchV1.toString()) {
          historyData.push([
            dbData[j][0], dbData[j][1], dbData[j][2], dbData[j][3], dbData[j][4],
            dbData[j][5], dbData[j][6], dbData[j][7], dbData[j][8], dbData[j][9],
            dbData[j][10], dbData[j][11]
          ]);
          count++;
        }
      } else if (searchV2) {
        if (dbData[j][index2].toString() === searchV2.toString()) {
          historyData.push([
            dbData[j][0], dbData[j][1], dbData[j][2], dbData[j][3], dbData[j][4],
            dbData[j][5], dbData[j][6], dbData[j][7], dbData[j][8], dbData[j][9],
            dbData[j][10], dbData[j][11]
          ]);
          count++;
        }
      }
    }

    historyRange.clearContent();
    if (historyData.length > 0) {
      historyRange.offset(0, 0, historyData.length, historyData[0].length).setValues(historyData);
      
      // Formatting
      var dateFormat = "MMM dd, yyyy";
      var timeFormat = "HH:mm";
      var phoneFormat = "0000000000";

      // Apply phone format to Phone column (column 6, offset by 5 from column index)
      historyRange.offset(1, 5, historyData.length - 1, 1).setNumberFormat(phoneFormat);
      // Apply date format to Reservation Date column (column 7, offset by 6 from column index)
      historyRange.offset(1, 6, historyData.length - 1, 1).setNumberFormat(dateFormat);
      // Apply time format to Time column (column 8, offset by 7 from column index)
      historyRange.offset(1, 7, historyData.length - 1, 1).setNumberFormat(timeFormat);
    }
  } else {
    SpreadsheetApp.getUi().alert('No matching records found.');
  }
}

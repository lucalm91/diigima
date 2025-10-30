# Google Sheets Setup for "The Death of Us" RSVP Form

This guide will help you connect the RSVP form to Google Sheets so all submissions are automatically saved.

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "The Death of Us - RSVP Responses"
4. In the first row, add these column headers (in this exact order):
   - A1: `Timestamp`
   - B1: `First Name`
   - C1: `Last Name`
   - D1: `Email`
   - E1: `Number of Guests`
   - F1: `Message`
   - G1: `Consent`

## Step 2: Create Google Apps Script

1. In your Google Sheet, click on **Extensions** > **Apps Script**
2. Delete any existing code in the script editor
3. Copy and paste the following code:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Get form data
    var timestamp = new Date();
    var firstName = e.parameter.firstName || '';
    var lastName = e.parameter.lastName || '';
    var email = e.parameter.email || '';
    var guests = e.parameter.guests || '';
    var message = e.parameter.message || '';
    var consent = e.parameter.consent ? 'Yes' : 'No';
    
    // Append row to sheet
    sheet.appendRow([
      timestamp,
      firstName,
      lastName,
      email,
      guests,
      message,
      consent
    ]);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'success',
      'message': 'Data received successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch(error) {
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Click **Save** (disk icon) and give your project a name like "RSVP Form Handler"

## Step 3: Deploy the Script

1. Click on **Deploy** > **New deployment**
2. Click the gear icon next to "Select type" and choose **Web app**
3. Fill in the deployment settings:
   - **Description**: "The Death of Us RSVP Form" (or any description)
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
4. Click **Deploy**
5. You may need to authorize the script:
   - Click **Authorize access**
   - Choose your Google account
   - Click **Advanced** if you see a warning
   - Click **Go to [Project Name] (unsafe)**
   - Click **Allow**
6. **IMPORTANT**: Copy the **Web app URL** that appears - it should look like:
   ```
   https://script.google.com/macros/s/AKfycby.../exec
   ```

## Step 4: Update the Website Script

1. Open the file `script.js` in the `the-death-of-us` folder
2. Find this line near the top:
   ```javascript
   const scriptURL = 'YOUR_GOOGLE_SCRIPT_URL_HERE';
   ```
3. Replace `'YOUR_GOOGLE_SCRIPT_URL_HERE'` with your actual Web app URL from Step 3
4. Save the file

Example:
```javascript
const scriptURL = 'https://script.google.com/macros/s/AKfycby.../exec';
```

## Step 5: Test the Form

1. Open your website in a browser
2. Fill out the RSVP form with test data
3. Submit the form
4. Check your Google Sheet - you should see a new row with the submission data
5. If it doesn't work, check the browser console (F12) for error messages

## Troubleshooting

### Form submission fails
- Make sure you copied the complete Web app URL including `/exec` at the end
- Check that the script is deployed with "Who has access" set to "Anyone"
- Try redeploying the script (Deploy > Manage deployments > Edit > Deploy)

### Data not appearing in sheet
- Check that column headers match exactly (case-sensitive)
- Look at the Apps Script execution logs (in Apps Script editor: View > Executions)

### CORS errors
- Make sure the script is deployed as a Web app (not API Executable)
- The "Who has access" must be set to "Anyone"

## Optional: Email Notifications

If you want to receive email notifications when someone RSVPs, add this to your Apps Script:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Get form data
    var timestamp = new Date();
    var firstName = e.parameter.firstName || '';
    var lastName = e.parameter.lastName || '';
    var email = e.parameter.email || '';
    var guests = e.parameter.guests || '';
    var message = e.parameter.message || '';
    var consent = e.parameter.consent ? 'Yes' : 'No';
    
    // Append row to sheet
    sheet.appendRow([
      timestamp,
      firstName,
      lastName,
      email,
      guests,
      message,
      consent
    ]);
    
    // Send email notification
    var emailBody = `New RSVP for The Death of Us premiere:\n\n` +
                    `Name: ${firstName} ${lastName}\n` +
                    `Email: ${email}\n` +
                    `Number of Guests: ${guests}\n` +
                    `Message: ${message}\n` +
                    `Submitted: ${timestamp}`;
    
    MailApp.sendEmail({
      to: 'your-email@example.com', // CHANGE THIS TO YOUR EMAIL
      subject: 'New RSVP - The Death of Us',
      body: emailBody
    });
    
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'success',
      'message': 'Data received successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

Remember to change `your-email@example.com` to your actual email address and redeploy the script.

## Support

If you continue to have issues, check:
1. Google Apps Script documentation: https://developers.google.com/apps-script
2. Browser console for JavaScript errors
3. Apps Script execution logs for server-side errors

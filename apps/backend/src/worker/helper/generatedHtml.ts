
export function generateHtml(json:any,parsedBody:string) {
  let html = '<form action="https://your-backend.com/submit" method="POST">';
  
  json.forEach((field:any) => {
    html += `<label>${field.label}</label><br/>`;
    if (field.type === "text") {
      html += `<textarea name="${field.key}" rows="4" cols="50"></textarea><br/><br/>`;
    } else if (field.type === "approval/disapproval") {
      html += `
        <input type="radio" id="${field.key}_approve" name="${field.key}" value="approved">
        <label for="${field.key}_approve">Approve</label>
        <input type="radio" id="${field.key}_disapprove" name="${field.key}" value="disapproved">
        <label for="${field.key}_disapprove">Disapprove</label><br/><br/>
      `;
    }
  });

  html += '<button type="submit">Submit</button></form>';
  return html;
}


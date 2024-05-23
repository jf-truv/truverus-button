// const express = require('express');
// const fs = require('fs');
// const app = express();
// const cors = require('cors');
// const jsonToXlsx = require('tfk-json-to-xlsx');
// const bodyParser = require('body-parser');

// app.use(cors());
// app.use(express.json());
// app.use(bodyParser.json());


// app.post('generate-xlsx', (req, res) => {
//   const jsonData = req.body;
//   const xlsxData = jsonToXlsx(jsonData);
//   res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//   res.setHeader('Content-Disposition', 'attachment; filename=data.xlsx');
//   res.send(xlsxData);
//   console.log('Successful')

//   // xlsx.write('mySpreadsheet.xlsx', jsonData, function (error) {
//   //   // Error handling here
//   //   if (error) {
//   //     console.error(error)
//   //   }
//   // })
// });

// app.listen(5175, () => {
//   console.log('Server is running on port 5175');
// });




// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const json2xls = require('json2xls');

// const app = express();

// app.use(cors());
// app.use(bodyParser.json());
// app.use(json2xls.middleware);

// app.post('/generate-xlsx', (req, res) => {
//     const jsonData = req.body;
//     const xlsData = json2xls(jsonData);
//     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//     res.setHeader('Content-Disposition', 'attachment; filename=data.xlsx');
//     res.end(xlsData, 'binary');
//     console.log('Excel file generated successfully');
// });

// app.listen(5175, () => {
//     console.log('Server is running on port 5175');
// });

const express = require('express');
const fs = require('fs');
const app = express();
const cors = require('cors');

const bodyParser = require('body-parser');

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
const xlsx = require("json-as-xlsx")

app.post('/generate-xlsx', (req, res) => {
let jsonData = req.body 
let xlsData = xlsx(jsonData)
res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
res.setHeader('Content-Disposition', 'attachment; filename=data.xlsx');
res.send(xlsData);
res.end(xlsData, 'binary');

let settings = {
  fileName: "MySpreadsheet", // Name of the resulting spreadsheet
  extraLength: 3, // A bigger number means that columns will be wider
  writeMode: "writeFile", // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
  writeOptions: {}, // Style options from https://docs.sheetjs.com/docs/api/write-options
  RTL: true, // Display the columns from right-to-left (the default value is false)
}

xlsx(xlsData, settings)
})



/* [
  {
    sheet: "Adults",
    columns: [
      { label: "User", value: "user" }, // Top level data
      { label: "Age", value: (row) => row.age + " years" }, // Custom format
      { label: "Phone", value: (row) => (row.more ? row.more.phone || "" : "") }, // Run functions
    ],
    content: [
      { user: "Andrea", age: 20, more: { phone: "11111111" } },
      { user: "Luis", age: 21, more: { phone: "12345678" } },
    ],
  },
  {
    sheet: "Children",
    columns: [
      { label: "User", value: "user" }, // Top level data
      { label: "Age", value: "age", format: '# "years"' }, // Column format
      { label: "Phone", value: "more.phone", format: "(###) ###-####" }, // Deep props and column format
    ],
    content: [
      { user: "Manuel", age: 16, more: { phone: 9999999900 } },
      { user: "Ana", age: 17, more: { phone: 8765432135 } },
    ],
  },
] */

 // Will download the excel file

app.listen(5175, () => {
  console.log('Server is running on port 5175');
});

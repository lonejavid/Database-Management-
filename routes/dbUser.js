const express = require('express');
const router = express.Router();
const dbUser = require('../controllers/dbUser');
router.get('/', dbUser.createTable);
router.post('/addTable', dbUser.addTable);
router.get('/getAllTables',dbUser.getAllTables);

router.get('/getData/:tb', dbUser.getData);
router.post('/getTable',dbUser.getTable);

router.post('/insertData',dbUser.insertData);
router.post('/deleteData',dbUser.deleteData);



module.exports = router;



        
// // Function to show the user form
// function showCreateUserForm() {
//     document.getElementById("userForm").style.display = "block";
//     document.getElementById("userform").style.display = "none";
//     document.getElementById('tableData').style.display = "none";
//   }
  
//   // Function to add a new field dynamically
//   function addField() {
//     const fieldsContainer = document.getElementById("fieldsContainer");
//     const fieldDiv = document.createElement("div");
//     fieldDiv.style.display = 'flex';
//     fieldDiv.classList.add("field");
//     fieldDiv.id = "field";
//     const nameDiv = document.createElement("div");
//     const nameInput = document.createElement("input");
//     nameInput.type = "text";
//     nameDiv.appendChild(nameInput);
//     const typeSelect = document.createElement("select");
//     const options = ["integer", "string", "other"];
//     options.forEach(option => {
//       const opt = document.createElement("option");
//       opt.value = option;
//       opt.textContent = option.charAt(0).toUpperCase() + option.slice(1);
//       typeSelect.appendChild(opt);
//     });
//     fieldDiv.appendChild(nameDiv);
//     fieldDiv.appendChild(typeSelect);
//     fieldsContainer.appendChild(fieldDiv);
//   }
  
//   // Function to format and log data received in the response
//   function logInsertedData(response, userData) {
//     if (response.data !== '') {
//       document.getElementById("userForm").style.display = "none";
  
//       const users = document.getElementById('userList');
//       const table = document.getElementById('tableData');
//       table.style.display = "block";
//       const values = Object.values(userData);
//       const tableName = values.shift();
  
//       const btn = document.createElement('button');
//       btn.addEventListener('click',async(e) => {
//         e.preventDefault();
//         document.getElementById("userForm").style.display = "none";
  
//         table.innerHTML = '';
  
//         const tbody = document.createElement('tbody');
//         const tr = document.createElement('tr');
  
//         const userDataValues = Object.keys(userData);
//         userDataValues.shift();
       
//         userDataValues.forEach(value => {
//           const td = document.createElement('td');
//           td.textContent = value;
//           tr.append(td);
//         });
  
//         const createdAt = document.createElement('td');
//         createdAt.textContent = 'createdAt';
//         const updatedAt = document.createElement('td');
//         updatedAt.textContent = 'updatedAt';
//         tr.append(createdAt);
//         tr.append(updatedAt);
  
//         const insert = document.createElement('button');
//         insert.innerHTML = "Insert";
//         const [firstKey, firstValue] = Object.entries(userData)[0];
  
//         delete userData[firstKey];
//         insert.addEventListener('click', () => {
//           const myform = document.getElementById('userform');
//           myform.innerHTML = '';
//           myform.style.display = "block";
  
//           for (const key in userData) {
//             if (userData.hasOwnProperty(key)) {
//               const label = document.createElement('label');
//               label.textContent = key;
//               const input = document.createElement('input');
//               input.type = 'text';
//               input.id = key;
//               input.name = key;
//               myform.append(label);
//               myform.append(input);
//             }
//           }
  
//           const submitbtn = document.createElement('button');
//           submitbtn.innerHTML = "submit";
  
//           submitbtn.addEventListener('click', async (e) => {
//             e.preventDefault();
//             const formData = {};
//             for (const key in userData) {
//               if (userData.hasOwnProperty(key)) {
//                 formData[key] = document.getElementById(key).value;
//               }
//             }
  
//             const newformData = { [firstKey]: firstValue, ...formData };
  
//             try {
//               const response = await axios.post('http://localhost:3000/insertData', { newformData });
//               const formData = response.data;
//               myform.reset();
//               console.log(formData)
//               const rowId=formData.id;
//               delete formData.id;
  
//               // Display the inserted data in the table with timestamps
//               const table = document.getElementById('tableData');
//               const tbody = table.querySelector('tbody');
//               const tr = document.createElement('tr');
  
//               for (const key in formData) {
//                 if (formData.hasOwnProperty(key)) {
//                   const td = document.createElement('td');
//                   td.textContent = formData[key];
//                   tr.append(td);
//                 }
//               }
  
  
//               tbody.append(tr);
//             } catch (error) {
//               console.error('Error:', error);
//             }
//           });
  
//           myform.append(submitbtn);
//         });
  
//         tr.append(insert);
//         tbody.append(tr);
//         table.append(tbody);
//       });
  
//       btn.innerHTML = tableName;
//       users.append(btn);
    
//     }
//   }
  
//   // Function to handle user form submission
//   function addUser(event) {
//     event.preventDefault();
//     const fields = document.querySelectorAll(".field");
//     const tableName = document.getElementById('tb-name').value;
//     const userData = { 'table-name': tableName };
  
//     fields.forEach(field => {
//       const name = field.querySelector("input[type='text']").value;
//       const type = field.querySelector("select").value;
//       userData[name] = type;
//     });
  
//     document.getElementById("userDataInput").value = JSON.stringify(userData);
  
//     axios.post('http://localhost:3000/addUser', { userData })
//       .then(response => {
//         logInsertedData(response, userData);
//       })
//       .catch(error => {
//         console.error('Error:', error);
//       });
  
//     document.getElementById("userForm").reset();
//     document.getElementById("fieldsContainer").innerHTML = "";
//     document.getElementById("userForm").style.display = "none";
//   }
  
//   // Function to fetch user details for a specific table
//   function userDetails(tableName) {
//     axios.get(`http://localhost:3000/getData/${tableName}`)
//       .then(response => {
//         if (response.data && response.data.columns) {
//           const columns = response.data.columns;
//           const columnNames = columns.map(col => col.COLUMN_NAME);
//           const orderedColumnNames = reorderColumns(columnNames);
//           console.log(orderedColumnNames);
//         } else {
//           alert(`No columns found for table ${tableName}`);
//         }
//       })
//       .catch(error => {
//         console.error(error);
//         alert('Error fetching columns');
//       });
//   }
  
//   // Function to reorder columns (if needed)
//   function reorderColumns(columnNames) {
//     // ... (implementation if needed)
//   }
  
//   // Additional utility functions can be added as needed
  
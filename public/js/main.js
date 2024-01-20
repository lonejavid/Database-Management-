window.onload=async (e)=>{
  e.preventDefault();
  await axios.get('http://localhost:3000/getAllTables').then(tables=>{
    const list=document.getElementById('userList');
    if(tables.data.length>0)
    {
      
      tables.data.forEach(table=>{
        const btn=document.createElement('button');
        btn.innerHTML=table;
        list.append(btn);
        btn.onclick=()=>showTable(table);
        
      });
    }
      const createTb=document.createElement('button');
      createTb.innerHTML="Create Table";
      createTb.addEventListener('click',async(e)=>{
        document.getElementById("userForm").style.display = "block";
        const userForm=document.getElementById("userForm");
        document.getElementById("userform").style.display = "none";
        document.getElementById('tableData').style.display = "none";
        const addField=document.createElement('button');
        addField.innerHTML="Add Field";
        addField.onclick=add;
        userForm.appendChild(addField);
        const addTable=document.createElement('button');
        addTable.innerHTML="Add Table";
        addTable.type='submit';
        addTable.addEventListener('click',async(e)=>{
          e.preventDefault();
          console.log("hello");
          const fields = document.querySelectorAll(".field");
          const tableName = document.getElementById('tb-name').value;
          const userData = { 'table-name': tableName };
        
          fields.forEach(field => {
            const name = field.querySelector("input[type='text']").value;
            const type = field.querySelector("select").value;
            userData[name] = type;
          });
          console.log(userData)
        
          document.getElementById("userDataInput").value = JSON.stringify(userData);
          axios.post('http://localhost:3000/addTable', { userData })
          .then(response => {
            const tableCreated=document.createElement('button');
            tableCreated.innerHTML=tableName;
            list.appendChild(tableCreated);
            console.log(response)
            if(response.status==200)
            {
              window.alert("table created...");
              setTimeout(()=>{
                window.location.reload();
              },1000)
               
            }
              })
          .catch(error => {
            console.error('Error:', error);
          });
      
        document.getElementById("userForm").reset();
        document.getElementById("fieldsContainer").innerHTML = "";
        document.getElementById("userForm").style.display = "none";
          console.log(userData)
        })
        
        userForm.appendChild(addTable);
      })
      list.appendChild(createTb); 
  }).catch(error=>{
    console.log(error)
  })

}
function showTable(table) {
  axios.post('http://localhost:3000/getTable', { table })
    .then(response => {
      const { columns, data } = response.data;
      const tab = document.getElementById('tableData');
      tab.innerHTML = '';
      // Create header row
      const headerRow = document.createElement('tr');
      columns.forEach(field => {
        if(field!=='id'){
        const th = document.createElement('th');
        th.innerHTML = field;
        headerRow.appendChild(th);
        }
      });
      const insertBtn=document.createElement('button');
      insertBtn.innerHTML="Insert";
      insertBtn.addEventListener('click',async(e)=>{
        e.preventDefault();
        const myform = document.getElementById('userform');
        myform.innerHTML = '';
        myform.style.display = "block";
        columns.forEach(col=>{
          if(col!='id' && col!='createdAt' && col!='updatedAt'){
            const label = document.createElement('label');
            label.textContent = col;
            const input = document.createElement('input');
            input.type = 'text';
            input.id = col;
            input.name = col;
            myform.append(label);
            myform.append(input);
          }
        })
        const submitbtn = document.createElement('button');
        submitbtn.innerHTML = "submit";
        submitbtn.addEventListener('click',async(e)=>{
          e.preventDefault();
          const formData={};
          columns.forEach(col=>{
            if (col !== 'id' && col !== 'createdAt' && col !== 'updatedAt'){
              const inputField = document.getElementById(col);
             const inputValue = inputField.value;
             formData[col] = inputValue;
            }
          })
          console.log("data to store:",formData);
          console.log("data to be stored in :",table);
          axios.post('http://localhost:3000/insertData',{table,formData}).then(result=>{
            myform.style.display = "none";
            console.log("result i gottt",result.data)
            const tab = document.getElementById('tableData');
            const tr=document.createElement('tr');
             const vals=Object.values(result.data)
             console.log("values brfore=",vals)
             vals.shift();
             console.log("values after=",vals)
             console.log("values =",vals)
            console.log("valuessss",vals)
            vals.forEach(data=>{
              
              const td=document.createElement('td');
              td.innerHTML=data;
              tr.appendChild(td);
            });
            const deleteBtn=document.createElement('button');
            deleteBtn.innerHTML="Delete";
            const td=document.createElement('td');
            td.append(deleteBtn)
            tr.append(td)
            tab.append(tr)
            deleteBtn.addEventListener('click',async(e)=>{
              console.log("this is id",result.data.id,"and the table name is",table);
              axios.post('http://localhost:3000/deleteData', { id: result.data.id, table: table })
          .then(response => {
            
          })
          .catch(error => {
            console.error(error);
          });
          tab.removeChild(tr);
            })

          }).catch(error=>{
            console.log(error);
          })
        })
        myform.appendChild(submitbtn)
        
      })
      headerRow.appendChild(insertBtn);
      tab.appendChild(headerRow);

      // Create data rows
      console.log("i have data=",data)
      data.forEach(ele => {
        const values = Object.values(ele);
        values.shift()
        const row = document.createElement('tr');
        values.forEach(value => {
          const td = document.createElement('td');
          td.innerHTML = value;
          row.appendChild(td);
        });

        // Create delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = 'Delete';
        deleteBtn.addEventListener('click', () => {
          console.log(ele.id,table)
          axios.post('http://localhost:3000/deleteData', { id: ele.id, table: table })
          .then(response => {
            
          })
          .catch(error => {
            console.error(error);
          });
          tab.removeChild(row);
        });

        // Append delete button to the Actions column
        const actionCell = document.createElement('td');
        actionCell.appendChild(deleteBtn);
        row.appendChild(actionCell);

        // Append the row to the table
        tab.appendChild(row);
      });
    })
    .catch(error => {
      console.log(error);
    });
}
// Function to add a new field dynamically
function add(e) {
  e.preventDefault();
  console.log("button clicked")
  const fieldsContainer = document.getElementById("fieldsContainer");
  const fieldDiv = document.createElement("div");
  fieldDiv.style.display = 'flex';
  fieldDiv.classList.add("field");
  fieldDiv.id = "field";
  const nameDiv = document.createElement("div");
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameDiv.appendChild(nameInput);
  const typeSelect = document.createElement("select");
  const options = ["integer", "string", "other"];
  options.forEach(option => {
    const opt = document.createElement("option");
    opt.value = option;
    opt.textContent = option.charAt(0).toUpperCase() + option.slice(1);
    typeSelect.appendChild(opt);
  });
  fieldDiv.appendChild(nameDiv);
  fieldDiv.appendChild(typeSelect);
  fieldsContainer.appendChild(fieldDiv);
}
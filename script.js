const excludesDatesInput = document.getElementById("excludesDates");
      const excludesDatesList = document.getElementById("excludesDatesList");
      const numDaysInput = document.getElementById("numDays");
      const leadCountInput = document.getElementById("leadCount");
      const expectedDDRInput = document.getElementById("expectedDDR");
      const monthInput = document.getElementById("month");

      let excludedDates = [];
      let size = 0;

      function addExcludedDate() {
        const selectedDate = excludesDatesInput.value;

        if (selectedDate) {
          excludedDates.push(selectedDate);
          displayExcludedDates(excludedDates);
          size++;
          calculateNumberOfDays();
          calculateMonthDifference();
        }
        
        excludesDatesInput.value = ""; 
      }

      function displayExcludedDates(excludedDates) {
        excludesDatesList.innerHTML = ""; 

        for (const date of excludedDates) {
          const li = document.createElement("p");
          li.textContent = date;
          excludesDatesList.appendChild(li);
        }
      }

      function calculateNumberOfDays() {
        const startDateInput = document.querySelector(
          'input[name="startDate"]'
        );
        const endDateInput = document.querySelector('input[name="endDate"]');

        const startDate = new Date(startDateInput.value);
        const endDate = new Date(endDateInput.value);

        if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
          const timeDiff = Math.abs(endDate - startDate);
          const numDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
          numDaysInput.value = numDays - size;
        } else {
          numDaysInput.value = "";
        }
      }

      function calculateExpectedDDR() {
        const leadCount = parseFloat(leadCountInput.value);
        const numDays = parseInt(numDaysInput.value);

        if (!isNaN(leadCount) && !isNaN(numDays) && numDays > 0) {
          const expectedDDR = (leadCount / numDays).toFixed(2);
          expectedDDRInput.value = expectedDDR;
        } else {
          expectedDDRInput.value = "";
        }
      }

      function calculateMonthDifference() {
        const startDateInput = document.querySelector(
          'input[name="startDate"]'
        );
        const endDateInput = document.querySelector('input[name="endDate"]');

        const startDate = new Date(startDateInput.value);
        const endDate = new Date(endDateInput.value);

        if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
          const months =
            (endDate.getFullYear() - startDate.getFullYear()) * 12 +
            (endDate.getMonth() - startDate.getMonth());
          monthInput.value = months;
        } else {
          monthInput.value = "";
        }
      }

      const table = document.getElementById("dataTable");
      const savedRowsTable = document.querySelector("#savedRows table tbody");
      let data = [];
      const fields = [
        "action",
        "id",
        "startDate",
        "endDate",
        "excludesDates",
        "numDays",
        "leadCount",
        "expectedDDR",
        "month",
        "lastUpdatedDate",
      ];

      function addRow() {
        const newRow = table.insertRow(table.rows.length - 1);
        const rowData = {};

        fields.forEach((field) => {
          const cell = newRow.insertCell();
          const input = document.createElement("input");
          input.setAttribute(
            "type",
            field === "startDate" ||
              field === "endDate" ||
              field === "excludesDates"
              ? "date"
              : "text"
          );
          input.setAttribute("name", field);
          cell.appendChild(input);
          rowData[field] = "";
        });

        const buttonsCell = newRow.insertCell();
        buttonsCell.innerHTML =
          '<button onclick="saveRow(this)">Save Row</button><button onclick="cancelRow(this)">Cancel</button>';
        data.push(rowData);
        
      }

      function saveRow(button) {
        const row = button.parentNode.parentNode;
        const inputs = row.querySelectorAll("input");
        const rowData = {};

        
        let isEmptyField = false;

        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleString();

        inputs.forEach((input) => {
          const fieldName = input.getAttribute("name");

          if (fieldName === "excludesDates") {
            
            rowData[fieldName] = [...excludedDates]; 
          } else {
            const value = input.value.trim(); 
            if (value === "") {
              isEmptyField = true; 
            }
            rowData[fieldName] = value;
          }
        });

      
        if (isEmptyField) {
          
          alert("Please fill in all required fields before saving.");
          return;
        }

        
        rowData["lastUpdatedDate"] = formattedDate;

        data.push(rowData);
        console.log(data);
        updateSavedRowsTable();
        clearRowInputs(row);
      }


      function updateSavedRowsTable() {
        savedRowsTable.innerHTML = ""; 

        data.forEach((rowData) => {
          const newRow = savedRowsTable.insertRow();
          fields.forEach((field) => {
            const cell = newRow.insertCell();

            if (field === "month") {
              const months = rowData[field];

              if (months !== undefined) {
                const years = Math.floor(months / 12);
                const remainingMonths = months % 12;
                if(years===0){

                  cell.textContent = ` ${remainingMonths} months `;
                }else{

                  cell.textContent = `  ${years} years,${remainingMonths} months `;
                }
              } else {
                cell.textContent = "";
              }
            } else {
              cell.textContent = rowData[field];
            }
          });
        });
      }

      function clearRowInputs(row) {
        const inputs = row.querySelectorAll("input");
        inputs.forEach((input) => {
          input.value = "";
        });

        excludedDates = [];
        displayExcludedDates(excludedDates);
      }

      function cancelRow(button) {
        const row = button.parentNode.parentNode;
        clearRowInputs(row);
      }
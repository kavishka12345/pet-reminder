document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('pet-form');
    const tableBody = document.querySelector('#record-table tbody');
    const generatePDFButton = document.getElementById('generate-pdf');
    let vaccineRecords = JSON.parse(localStorage.getItem('vaccineRecords')) || [];
  
    function renderRecords() {
      tableBody.innerHTML = '';
      if (vaccineRecords.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7">No records found</td></tr>';
      } else {
        vaccineRecords.forEach((record, index) => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${record.petName}</td>
            <td>${record.petType}</td>
            <td>${record.petDOB}</td>
            <td>${record.vaccineName}</td>
            <td>${record.vaccineDate}</td>
            <td>${record.nextDate}</td>
            <td><button onclick="removeRecord(${index})">Remove</button></td>
          `;
          tableBody.appendChild(row);
        });
      }
    }
  
    form.addEventListener('submit', function (e) {
      e.preventDefault();
  
      const newRecord = {
        petName: document.getElementById('pet-name').value,
        petType: document.getElementById('pet-type').value,
        petDOB: document.getElementById('pet-dob').value,
        vaccineName: document.getElementById('vaccine-name').value,
        vaccineDate: document.getElementById('vaccine-date').value,
        nextDate: document.getElementById('next-date').value
      };
  
      vaccineRecords.push(newRecord);
      localStorage.setItem('vaccineRecords', JSON.stringify(vaccineRecords));
      form.reset();
      renderRecords();
    });
  
    window.removeRecord = function(index) {
      vaccineRecords.splice(index, 1);
      localStorage.setItem('vaccineRecords', JSON.stringify(vaccineRecords));
      renderRecords();
    };
  
    generatePDFButton.addEventListener('click', () => {
      if (vaccineRecords.length === 0) return alert('No records to export.');
  
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      doc.text('Pet Vaccine Records', 14, 20);
  
      const rows = vaccineRecords.map(r => [
        r.petName, r.petType, r.petDOB, r.vaccineName, r.vaccineDate, r.nextDate
      ]);
  
      doc.autoTable({
        head: [["Pet", "Type", "DOB", "Vaccine", "Date Given", "Next Due"]],
        body: rows,
        startY: 30,
      });
  
      doc.save("pet-vaccine-records.pdf");
    });
  
    renderRecords();
  });
  
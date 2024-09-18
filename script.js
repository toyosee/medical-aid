document.addEventListener('DOMContentLoaded', function () {
    // Hide doctor's remark section by default
    const doctorNoteSection = document.getElementById('doctor-note-section');
    doctorNoteSection.style.display = 'none';

    // Function to update notifications based on user input
    function updateNotifications() {
        // Clear previous notifications
        document.getElementById('notifications').innerHTML = '';

        // Collect findings based on input
        const findings = [];
        const age = Number(document.getElementById('age').value) || 0;
        const familyHistory = document.querySelector('input[name="family-history"]:checked')?.value === '1';
        const systolic = Number(document.getElementById('systolic').value) || 0;
        const diastolic = Number(document.getElementById('diastolic').value) || 0;
        const weight = Number(document.getElementById('weight').value) || 0;
        const height = Number(document.getElementById('height').value) || 0;

        // Check conditions for colonoscopy
        if (age >= 50) {
            findings.push('Book Patient for Colonoscopy.');
        } else if (age < 50 && familyHistory) {
            findings.push('Book Patient for Colonoscopy.');
        } else {
            findings.push('Passed.');
        }

        // Check for high blood pressure
        if (systolic > 140 || diastolic > 90) {
            findings.push('Patient has High Blood Pressure.');
        }

        // Check for obesity (BMI calculation)
        if (height > 0) {
            const bmi = weight / (height * height);
            if (bmi >= 30) {
                findings.push('Patient is Obese.');
            }
        }

        // Add findings to notification board
        findings.forEach(finding => {
            const notificationDiv = document.createElement('div');
            notificationDiv.className = 'notification';
            notificationDiv.innerText = `- ${finding}`;
            document.getElementById('notifications').appendChild(notificationDiv);
        });

        // Update findings count
        document.getElementById("findings").innerText = `(${findings.length})`;
    }

    // Show doctor's remark section when the Diagnose button is hit
    document.getElementById('medical-form').addEventListener('submit', function (event) {
        event.preventDefault();
        updateNotifications(); // Update notifications on form submission
        doctorNoteSection.style.display = 'block'; // Show the doctor's remark section
    });

    // Real-time update on input changes
    document.getElementById('age').addEventListener('input', updateNotifications);
    document.getElementById('systolic').addEventListener('input', updateNotifications);
    document.getElementById('diastolic').addEventListener('input', updateNotifications);
    document.getElementById('weight').addEventListener('input', updateNotifications);
    document.getElementById('height').addEventListener('input', updateNotifications);
    document.querySelectorAll('input[name="family-history"]').forEach(radio => {
        radio.addEventListener('change', updateNotifications);
    });

    // Function to reset the form and notifications
    function resetFormAndNotifications() {
        document.getElementById('medical-form').reset(); // Reset form fields
        document.getElementById('notifications').innerHTML = ''; // Clear notifications
        doctorNoteSection.style.display = 'none'; // Hide doctor's note section
        document.getElementById("findings").innerText = `(0)`; // Reset findings count
        document.getElementById('doctor-note').value = ''; // Clear doctor note
    }

    // Add event listener for the reset button
    document.getElementById('reset-button').addEventListener('click', resetFormAndNotifications);

    // Handle doctor's remark submission and printing
    document.getElementById('doctor-note-form').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission
        sendToPrint(); // Print findings and doctor's note
    });

    function sendToPrint() {
        // Collect all findings from the notifications area
        const findings = [];
        document.querySelectorAll('#notifications .notification').forEach((notification) => {
            findings.push(notification.innerText);
        });

        // Get the doctor's remark
        const doctorNote = document.getElementById('doctor-note').value;

        // Create print content
        let printContent = '<h2>Medical Findings</h2><ul style="list-style-type: none;">';
        findings.forEach(finding => {
            printContent += `<li>${finding}</li>`;
        });
        printContent += '</ul>';
        printContent += `<h3>Doctor's Remarks</h3><p>${doctorNote}</p>`;

        // Open new window for printing
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Medical Findings and Doctor\'s Remarks</title></head><body>');
        printWindow.document.write(printContent);
        printWindow.document.write('</body></html>');

        printWindow.document.close(); // Complete writing
        printWindow.print(); // Trigger the print dialog

        // Optionally close the print window after printing
        printWindow.onafterprint = function () {
            printWindow.close();
        };

        // Reset form after print operation
        resetFormAndNotifications()
    }
});

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
        const age = Number(document.getElementById('age').value);
        const familyHistory = document.querySelector('input[name="family-history"]:checked')?.value === '1';
        const gender = document.getElementById('gender').value;
        const systolic = Number(document.getElementById('systolic').value);
        const diastolic = Number(document.getElementById('diastolic').value);
        const weight = Number(document.getElementById('weight').value);
        const height = Number(document.getElementById('height').value);
        // const menopause = document.querySelector('input[name="menopause"]:checked')?.value === '1';

        // Check conditions for notifications
        if (age >= 50 || (age < 50 && familyHistory)) {
            findings.push({ message: 'Schedule Colonoscopy.', type: 'routine' });
        }

        if (age >= 40 && gender === '0') {
            findings.push({ message: 'Schedule Breast Cancer Screening (Q2 Years)', type: 'routine' });
        }

        if (age >= 65 && gender === '0') {
            findings.push({ message: 'Schedule Bone Density Screening.', type: 'routine' });
        }

        // if (gender === '0' && (age > 65 || (age <= 64 && menopause))) {
        //     findings.push({ message: 'Schedule Bone Density Screening.', type: 'routine' });
        // }

        if (gender === '0' && age >= 21 && age <= 65) {
            findings.push({ message: 'Schedule Pap Smear Test.', type: 'routine' });
        }

        if (age >= 15 && age <= 65) {
            findings.push({ message: 'Schedule HIV Screening.', type: 'routine' });
        }

        if (gender === "0" && (age >= 16 && age <= 55)) {
            findings.push({ message: 'Schedule HCG.', type: 'routine' });
        }

        if (systolic > 0 && diastolic > 0) {
            if (systolic > 140 || diastolic > 90) {
                findings.push({ message: 'Patient has High Blood Pressure.', type: 'critical' });
            }
            if (systolic < 90 || diastolic < 60) {
                findings.push({ message: 'Patient has Low Blood Pressure.', type: 'critical' });
            }
        }

        if (height > 0 && weight > 0) {
            const bmi = (weight / (height * height)) * 703 // Multiply by 703 for lbs and inches
            if (bmi >= 30) {
                findings.push({ message: `Patient is Obese. BMI is ${bmi.toFixed(1)}kg/m\u00B2`, type: 'critical' })
            }
            // else if (bmi >= 25) {
            //     findings.push({ message: `Patient is Overweight. BMI is ${bmi.toFixed(1)}kg/m\u00B2`, type: 'warning' })
            // } else if (bmi < 18.5) {
            //     findings.push({ message: `Patient is Underweight. BMI is ${bmi.toFixed(1)}kg/m\u00B2`, type: 'warning' }) 
            // } else {
            //     findings.push({ message: `Patient has a Normal BMI. ${bmi.toFixed(1)}kg/m\u00B2`, type: 'routine' })
            // }
        }

        // Add findings to notification board
        findings.forEach(finding => {
            const notificationDiv = document.createElement('div');
            notificationDiv.className = `notification ${finding.type}`; // Use type for styling
            const icon = finding.type === 'critical' 
                ? '<i class="fas fa-exclamation-triangle notification-icon"></i>' 
                : '<i class="fas fa-check-circle notification-icon"></i>';
            notificationDiv.innerHTML = `${icon} - ${finding.message}`;
            document.getElementById('notifications').appendChild(notificationDiv);
            setTimeout(() => {
                notificationDiv.classList.add('visible'); // Fade in
            }, 10); // Delay to allow the append to take effect
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
    document.getElementById('gender').addEventListener('input', updateNotifications);
    document.getElementById('systolic').addEventListener('input', updateNotifications);
    document.getElementById('diastolic').addEventListener('input', updateNotifications);
    document.getElementById('weight').addEventListener('input', updateNotifications);
    document.getElementById('height').addEventListener('input', updateNotifications);
    document.querySelectorAll('input[name="family-history"]').forEach(radio => {
        radio.addEventListener('change', updateNotifications);
    });
    // document.querySelectorAll('input[name="menopause"]').forEach(radio => {
    //     radio.addEventListener('change', updateNotifications);
    // });

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
        resetFormAndNotifications();
    }

    // exporting to PDF
    async function exportToPDF() {
        const { jsPDF } = window.jspdf;
    
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("Medical Findings", 10, 10);
    
        // Collect data from notifications
        const findings = [];
        document.querySelectorAll('#notifications .notification').forEach((notification) => {
            findings.push(notification.innerText);
        });
    
        // Add findings to PDF
        findings.forEach((finding, index) => {
            doc.text(`${index + 1}. ${finding}`, 10, 20 + (10 * index)); // Adjust the Y position for each line
        });
    
        // Save the PDF
        doc.save('health_findings.pdf');
    }
    
});

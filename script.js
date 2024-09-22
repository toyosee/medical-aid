document.addEventListener('DOMContentLoaded', function () {
    // Hide doctor's remark section by default
    const doctorNoteSection = document.getElementById('doctor-note-section');
    doctorNoteSection.style.display = 'none';

    // Function to get checkbox values
    function getCheckedValues(name) {
        const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`);
        return Array.from(checkboxes).map(cb => cb.value);
    }

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
        // Collect values from feet and inches inputs
        const heightFeet = Number(document.getElementById('height-feet').value);
        const heightInches = Number(document.getElementById('height-inches').value);
        const chronicIllnesses = getCheckedValues('chronic-illness');
        const sickleCell = getCheckedValues('sickle-cell').length > 0 || getCheckedValues('spleen-problems').length > 0;
        const smoker = document.querySelector('input[name="smoke"]:checked')?.value === '1';
        const reducedImmunity = getCheckedValues('reduced-immunity').length > 0;
        const specialEnvironment = document.querySelector('input[name="special-environment"]:checked')?.value === '1';

        // Convert the total height to inches
        const totalHeightInInches = (heightFeet * 12) + heightInches;

        // Check conditions for notifications
        if (age >= 50 || (age < 50 && familyHistory)) {
            findings.push({ message: 'Colonoscopy.', type: 'routine' });
        }

        if (age >= 40 && gender === '0') {
            findings.push({ message: 'Mammogram (Q2 Years)', type: 'routine' });
        }

        if (age >= 65 && gender === '0') {
            findings.push({ message: 'Bone Density Screening.', type: 'routine' });
        }

        // Check pneumococcal vaccination conditions
        const recommendVaccine = (
            age >= 65 || 
            (age >= 2 && (chronicIllnesses.length > 0 || sickleCell || smoker || reducedImmunity || specialEnvironment))
        );

        // If vaccination is recommended
        if (recommendVaccine) {
            findings.push({ message: 'Pneumococcal Vaccination.', type: 'routine' });
        }

        if (age >= 11 && age <= 16){
            findings.push({message: 'Meningococcal Conjugate Vaccine.', type: 'routine'});
        }

        if (gender === '0' && age >= 21 && age <= 65) {
            findings.push({ message: 'Pap Smear Test.', type: 'routine' });
        }

        if (age >= 15 && age <= 65) {
            findings.push({ message: 'HIV Screening.', type: 'routine' });
        }

        if (gender === "0" && (age >= 16 && age <= 55)) {
            findings.push({ message: 'HCG.', type: 'routine' });
        }

        if (systolic > 0 && diastolic > 0) {
            if (systolic > 140 || diastolic > 90) {
                findings.push({ message: 'Elevated Blood Pressure.', type: 'critical' });
            }
            if (systolic < 90 || diastolic < 60) {
                findings.push({ message: 'Low Blood Pressure.', type: 'critical' });
            }
        }

        // Ensure both height and weight are valid before calculating BMI
        if (totalHeightInInches > 0 && weight > 0) {
            const bmi = (weight / (totalHeightInInches * totalHeightInInches)) * 703; // Multiply by 703 for lbs and inches
            if (bmi >= 30) {
                findings.push({ message: `Obese. BMI is ${bmi.toFixed(1)} kg/m\u00B2`, type: 'critical' });
            }
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
    document.getElementById('height-feet').addEventListener('input', updateNotifications);
    document.getElementById('height-inches').addEventListener('input', updateNotifications);
    document.querySelectorAll('input[name="family-history"]').forEach(radio => {
        radio.addEventListener('change', updateNotifications);
    });
    document.querySelectorAll('input[name="chronic-illness"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateNotifications);
    });
    document.querySelectorAll('input[name="sickle-cell"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateNotifications);
    });
    document.querySelectorAll('input[name="spleen-problems"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateNotifications);
    });
    document.querySelectorAll('input[name="reduced-immunity"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateNotifications);
    });
    document.querySelectorAll('input[name="smoke"]').forEach(radio => {
        radio.addEventListener('change', updateNotifications);
    });
    document.querySelectorAll('input[name="special-environment"]').forEach(radio => {
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
        printWindow.document.write('<html><head><title>Print Findings</title></head><body>');
        printWindow.document.write(printContent);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
        resetFormAndNotifications()
    }
});

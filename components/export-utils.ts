import { Student, Payment } from '@/lib/store';

// 1. Export Students to Microsoft Excel-compatible CSV
export function exportToExcel(students: Student[]) {
  const headers = [
    'Student ID',
    'Full Name',
    'Email Address',
    'Mobile Number',
    'WhatsApp Number',
    'Gender',
    'DOB',
    'Address',
    'City',
    'State',
    'Pincode',
    'Course Name',
    'Course Duration',
    'Batch Timing',
    'Admission Date',
    'Total Fees',
    'Discount',
    'Final Fees',
    'Paid Amount',
    'Pending Amount',
    'Payment Status',
    'Next Due Date'
  ];

  const rows = students.map(s => [
    s.id,
    s.fullName,
    s.email,
    s.mobile,
    s.whatsapp,
    s.gender,
    s.dob,
    s.address.replace(/,/g, ' '), // sanitize commas
    s.city,
    s.state,
    s.pinCode,
    s.courseName,
    s.courseDuration,
    s.batchTiming,
    s.admissionDate,
    s.totalCourseFees,
    s.discountAmount,
    s.finalFees,
    s.paidAmount,
    s.pendingAmount,
    s.paymentStatus,
    s.nextDueDate || 'N/A'
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(val => `"${val}"`).join(','))
  ].join('\n');

  // Excel UTF-8 BOM representation to prevent Indian names or character garbling
  const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `skillsia_students_export_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// 2. Export Payment Dues / Revenue report
export function exportPaymentsReport(students: Student[], payments: Payment[]) {
  const headers = [
    'Receipt No',
    'Student ID',
    'Student Name',
    'Payment Date',
    'Amount Paid',
    'Payment Method',
    'Transaction ID',
    'Installment No',
    'Remarks'
  ];

  const rows = payments.map(p => [
    p.receiptNumber,
    p.studentId,
    p.studentName,
    p.paymentDate,
    p.amountPaid,
    p.paymentMethod,
    p.transactionId,
    p.installmentNumber,
    p.remarks || 'No remarks'
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(val => `"${val}"`).join(','))
  ].join('\n');

  const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `skillsia_payments_report_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// 3. Trigger Browser Print system for specific student record sheets
export function printStudentDetails(student: Student, payments: Payment[]) {
  // We can open a beautiful printable frame or inline print rendering
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to print/export student details.');
    return;
  }

  const studentPayments = payments.filter(p => p.studentId === student.id);

  const html = `
    <html>
      <head>
        <title>Student Profile Sheet - ${student.fullName}</title>
        <style>
          body {
            font-family: 'Segoe UI', sans-serif;
            color: #333;
            margin: 40px;
            font-size: 14px;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #6366f1;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .title {
            font-size: 24px;
            color: #6366f1;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin: 0;
          }
          .subtitle {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
          }
          .section {
            margin-bottom: 25px;
          }
          .section-title {
            font-size: 16px;
            color: #1e1b4b;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 5px;
            margin-bottom: 15px;
            font-weight: 600;
          }
          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
          }
          .grid-3 {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 15px;
          }
          .item {
            margin-bottom: 10px;
          }
          .label {
            font-weight: 600;
            color: #4b5563;
            font-size: 11px;
            text-transform: uppercase;
          }
          .value {
            font-size: 14px;
            color: #111827;
            margin-top: 2px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
          }
          th {
            background-color: #f8fafc;
            color: #475569;
            text-align: left;
            padding: 10px;
            font-size: 12px;
            font-weight: 600;
            border-bottom: 2px solid #e2e8f0;
          }
          td {
            padding: 10px;
            border-bottom: 1px solid #f1f5f9;
            font-size: 13px;
          }
          .status {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
          }
          .status-paid { background-color: #dcfce7; color: #15803d; }
          .status-partial { background-color: #fef9c3; color: #a16207; }
          .status-pending { background-color: #ffe4e6; color: #b91c1c; }
          .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 12px;
            color: #94a3b8;
            border-top: 1px solid #e2e8f0;
            padding-top: 15px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">SKILLSIA ACADEMY</div>
          <div class="subtitle">Complete Student Record Profile | Email: info@skillsia.in</div>
        </div>

        <div class="grid" style="margin-bottom: 20px;">
          <div><span class="label">Student ID:</span> <span class="value" style="font-weight:bold;color:#6366f1;">${student.id}</span></div>
          <div style="text-align: right;"><span class="label">Admission Date:</span> <span class="value">${student.admissionDate}</span></div>
        </div>

        <div class="section">
          <div class="section-title">Personal & Contact Details</div>
          <div class="grid-3">
            <div class="item"><div class="label">Full Name</div><div class="value">${student.fullName}</div></div>
            <div class="item"><div class="label">Gender</div><div class="value">${student.gender}</div></div>
            <div class="item"><div class="label">Date of Birth</div><div class="value">${student.dob}</div></div>
            <div class="item"><div class="label">Mobile Number</div><div class="value">${student.mobile}</div></div>
            <div class="item"><div class="label">WhatsApp Number</div><div class="value">${student.whatsapp}</div></div>
            <div class="item"><div class="label">Email ID</div><div class="value">${student.email}</div></div>
          </div>
          <div class="item" style="margin-top: 10px;">
            <div class="label">Address</div>
            <div class="value">${student.address}, ${student.city}, ${student.state} - ${student.pinCode}</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Academic & Course Information</div>
          <div class="grid-3">
            <div class="item"><div class="label">Enrolled Course</div><div class="value" style="font-weight:600;">${student.courseName}</div></div>
            <div class="item"><div class="label">Academy Batch Timing</div><div class="value">${student.batchTiming}</div></div>
            <div class="item"><div class="label">Course Duration</div><div class="value">${student.courseDuration}</div></div>
            <div class="item"><div class="label">Start - End Dates</div><div class="value">${student.courseStartDate} to ${student.courseEndDate}</div></div>
            <div class="item"><div class="label">Qualification</div><div class="value">${student.qualification}</div></div>
            <div class="item"><div class="label">College/School</div><div class="value">${student.collegeSchool}</div></div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Emergency Contact Details</div>
          <div class="grid-3">
            <div class="item"><div class="label">Parent / Guardian Name</div><div class="value">${student.parentName}</div></div>
            <div class="item"><div class="label">Parent Contact No.</div><div class="value">${student.parentMobile}</div></div>
            <div class="item"><div class="label">Emergency Contact</div><div class="value">${student.emergencyContact}</div></div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Fees Tracking & Installments Ledger</div>
          <div class="grid" style="grid-template-columns: repeat(4, 1fr); background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <div><div class="label">Final Dues</div><div class="value" style="font-weight:bold;">₹${student.finalFees.toLocaleString('en-IN')}</div></div>
            <div><div class="label">Paid Dues</div><div class="value" style="font-weight:bold; color: #16a34a;">₹${student.paidAmount.toLocaleString('en-IN')}</div></div>
            <div><div class="label">Balance Outstanding</div><div class="value" style="font-weight:bold; color: #dc2626;">₹${student.pendingAmount.toLocaleString('en-IN')}</div></div>
            <div>
              <div class="label">Status</div>
              <div class="value">
                <span class="status ${student.paymentStatus === 'Paid' ? 'status-paid' : student.paymentStatus === 'Partial' ? 'status-partial' : 'status-pending'}">
                  ${student.paymentStatus.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <div class="label" style="font-size:12px; margin-top:20px;">Linked Installment Receipt History</div>
          ${studentPayments.length === 0 ? `
            <p style="color:#666; font-style:italic; margin-top: 10px;">No payments recorded yet.</p>
          ` : `
            <table>
              <thead>
                <tr>
                  <th>Receipt No</th>
                  <th>Payment Date</th>
                  <th>Paid Amount</th>
                  <th>Inst. No.</th>
                  <th>Mode</th>
                  <th>Transaction ID</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                ${studentPayments.map(p => `
                  <tr>
                    <td><strong>${p.receiptNumber}</strong></td>
                    <td>${p.paymentDate}</td>
                    <td><strong>₹${p.amountPaid.toLocaleString('en-IN')}</strong></td>
                    <td>${p.installmentNumber}</td>
                    <td>${p.paymentMethod}</td>
                    <td><code style="font-family:monospace; background:#f1f5f9; padding:2px 4px; border-radius:3px;">${p.transactionId}</code></td>
                    <td>${p.remarks || '-'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `}
        </div>

        <div class="footer">
          Skillsia Academy CRM system - Dedicated and Professional Learning Partner. Created dynamically.
        </div>

        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

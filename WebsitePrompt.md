Build a complete, modern, responsive **Hospital Management System (HMS)** web application called **“Medix HMS”** using **React.js**.

The application should be designed as a professional hospital administration dashboard for managing the **complete patient journey**, starting from patient registration and appointment/checkup through doctor consultation, laboratory tests, medicines, billing, admission/discharge, and final medical reports.

The result must look like a **real production-style hospital management dashboard**, not a basic student project.

==================================================

1. TECHNOLOGY STACK
   ==================================================

Use:

* React.js
* Vite
* JavaScript / JSX
* React Router DOM
* React Hooks
* Context API where useful
* React Icons (`react-icons/fi`)
* Recharts for dashboard charts
* CSS / CSS modules or well-organized normal CSS
* LocalStorage for demo persistence
* Mock JSON/JavaScript data for initial records

Do NOT use TypeScript unless absolutely necessary.

Do NOT create one huge component.

Create reusable components and separate files.

The project must be directly runnable in VS Code with:

npm install
npm run dev

==================================================
2. APPLICATION NAME
===================

Application name:

Medix HMS

Subtitle:

Hospital Management System

Version:

v2.4.1

Brand icon:

Use a medical/heart icon such as `FiHeart`.

==================================================
3. MAIN OBJECTIVE
=================

The system should manage the complete patient flow:

Patient Registration
↓
Appointment
↓
Doctor Consultation
↓
Vitals / Diagnosis
↓
Laboratory Tests
↓
Lab Results
↓
Medicines / Prescription
↓
Pharmacy
↓
Billing
↓
Admission / Discharge if required
↓
Final Medical Report
↓
Patient History

The application should allow hospital staff to easily track where a patient is currently located in the treatment process.

==================================================
4. DESIGN STYLE
===============

Create a clean, professional healthcare SaaS dashboard.

Design goals:

* Modern
* Minimal
* Professional
* Medical
* Trustworthy
* Easy to scan
* Excellent spacing
* Rounded cards
* Soft shadows
* Clean tables
* Clear status badges
* Responsive layout
* Strong visual hierarchy
* Suitable for long hospital shift usage

Avoid:

* Excessive gradients
* Excessive animations
* Too many colors
* Huge typography
* Crowded tables
* Decorative elements that reduce usability

==================================================
5. COLOR SYSTEM
===============

Use the following exact theme colors.

Primary Brand / Header:

#1E40AF

Deep blue used for:

* Sidebar
* Main branding
* Important headers
* Primary buttons
* Active navigation where appropriate

Secondary / Interactive Accent:

#0D9488

Teal used for:

* Links
* Secondary buttons
* Tabs
* Active states
* Medical indicators
* Interactive controls

Primary Background:

#F8FAFC

Use as the main application background.

Card / Panel Background:

#FFFFFF

Text Primary:

#0F172A

Text Secondary:

#475569

Success:

#16A34A

Use for:

* Stable patients
* Completed appointments
* Completed lab tests
* Paid bills
* Available doctors
* Active status

Warning:

#D97706

Use for:

* Pending laboratory reports
* Low pharmacy stock
* Waiting patients
* Pending payments
* Pending approvals

Error:

#DC2626

Use only for:

* Emergency
* Critical patient status
* Cancelled appointments
* Failed operations
* Serious alerts

Use soft background variations of these colors for badges and status cards.

==================================================
6. OPTIONAL DARK MODE
=====================

Implement a Dark Mode toggle in Settings.

Dark mode:

Primary background:
#0F172A

Use softer blue/teal component colors.

Cards should use dark slate surfaces.

Text should use light gray/white.

Make sure contrast remains accessible.

Store the selected theme in LocalStorage.

==================================================
7. MAIN APPLICATION LAYOUT
==========================

Create the following layout:

---

## SIDEBAR

Brand:

♥ Medix HMS
Hospital Management System

Version:

v2.4.1

Navigation:

Dashboard
Patients
Doctors & Staff
Appointments
Admissions
Billing
Pharmacy
Laboratory
Reports
Settings

Bottom section:

User Profile
Logout

Use React Icons.

Recommended icons:

Dashboard:
FiHome

Patients:
FiUsers

Doctors:
FiUser

Appointments:
FiCalendar

Admissions:
FiBriefcase

Billing:
FiCreditCard

Pharmacy:
FiBox

Laboratory:
FiClipboard

Reports:
FiFileText

Settings:
FiSettings

Logout:
FiLogOut

Brand:
FiHeart

Sidebar requirements:

* Fixed desktop sidebar
* Collapsible sidebar
* Active navigation indicator
* Smooth hover state
* Icon + label
* Mobile sidebar drawer
* User profile at bottom
* Logout button
* Show tooltip when collapsed
* Sidebar state should persist when practical

==================================================
8. TOP NAVBAR
=============

Create a reusable Navbar.

Navbar should contain:

Left:

* Mobile menu button
* Current page title
* Optional breadcrumb

Right:

* Search
* Notifications
* User profile
* User avatar
* User role

Example:

Administrator
Hospital Admin

Notification icon should open a notification panel.

Notifications can include:

* 3 pending lab reports
* 2 doctors on leave
* 5 low-stock medicines
* 4 patients waiting
* 2 unpaid bills

==================================================
9. GLOBAL SEARCH
================

Create a global search.

Search should support:

* Patient name
* Patient ID
* Doctor name
* Appointment ID
* Bill ID
* Medicine name
* Lab report ID

Display search suggestions as the user types.

Clicking a search result should navigate to the relevant page.

==================================================
10. DASHBOARD
=============

Create a professional dashboard.

Top KPI cards:

1. Total Patients
2. Today's Appointments
3. Available Doctors
4. Today's Revenue

Additional cards:

* Admitted Patients
* Pending Lab Reports
* Pending Bills
* Low Stock Medicines

Dashboard sections:

A. Patient Statistics

Create a line/bar chart showing patient registrations.

Filters:

Today
This Week
This Month
This Year

B. Appointment Overview

Show:

Scheduled
Completed
Waiting
Cancelled

Use a chart.

C. Today's Appointment List

Columns:

Time
Patient
Doctor
Department
Type
Status
Action

D. Recent Patients

Columns:

Patient ID
Patient Name
Age
Gender
Doctor
Visit Type
Status
Date

E. Recent Lab Reports

Show:

Patient
Test
Status
Result
Date

F. Pharmacy Alerts

Show:

Medicine
Current Stock
Minimum Stock
Status

G. Quick Actions

Buttons:

Register Patient
Create Appointment
Add Doctor
Add Lab Test
Create Bill
Issue Medicine

==================================================
11. PATIENTS MODULE
===================

Create a complete patient management system.

Patient list page:

Title:

Patients

Top action:

* Register Patient

Search and filters:

Search by name / patient ID / phone

Filters:

Gender
Age
Blood Group
Status
Doctor
Department

Table columns:

Patient ID
Patient
Age
Gender
Phone
Blood Group
Doctor
Last Visit
Status
Actions

Actions:

View
Edit
Delete
More

Use dropdown menu for More.

Patient statuses:

Active
Admitted
Discharged
Critical
Inactive

==================================================
12. PATIENT REGISTRATION
========================

Create a proper registration form.

Fields:

Patient ID
First Name
Last Name
Date of Birth
Age
Gender
Blood Group
Phone
Email
Address
City
State
Emergency Contact
Emergency Contact Number
Known Allergies
Existing Medical Conditions
Insurance Provider
Insurance Number
Previous Medical History

Form buttons:

Cancel
Save Patient
Save & Create Appointment

Add validation.

Patient ID should be generated automatically.

Example:

PT-2026-0001

After registration:

Show success notification.

Then allow:

Create Appointment
View Patient Profile

==================================================
13. PATIENT PROFILE
===================

Patient profile must be one of the most detailed pages.

Header:

Patient profile

Show:

Patient photo/avatar
Patient name
Patient ID
Age
Gender
Blood Group
Phone
Current status

Buttons:

Edit Patient
New Appointment
Create Bill
Print Summary

Create tabs:

Overview
Medical History
Appointments
Vitals
Lab Reports
Prescriptions
Billing
Documents

Overview should show:

* Current condition
* Allergies
* Medical conditions
* Emergency contact
* Last visit
* Assigned doctor
* Current medications

Medical History timeline:

Date
Doctor
Diagnosis
Treatment
Notes

==================================================
14. PATIENT COMPLETE FLOW
=========================

This is a core requirement.

Create a patient journey/status tracker.

Example:

Registration
↓
Appointment
↓
Check-in
↓
Vitals
↓
Doctor Consultation
↓
Lab Tests
↓
Lab Results
↓
Prescription
↓
Pharmacy
↓
Billing
↓
Discharge
↓
Final Report

Display this as a visual horizontal/vertical timeline.

Each stage should have status:

Completed
Current
Pending
Skipped

Users should be able to click a stage and open the related record.

Example:

Patient:
Rahul Kumar

Current Stage:
Laboratory

Completed:
Registration
Appointment
Check-in
Vitals
Consultation

Current:
Lab Test

Pending:
Prescription
Billing
Final Report

==================================================
15. DOCTORS & STAFF
===================

Create a complete Doctor and Staff Management section.

Doctors page:

Header:

Doctors & Staff

Buttons:

* Add Doctor
* Add Staff

Doctor table:

Doctor ID
Doctor Name
Department
Specialization
Phone
Email
Working Days
Working Hours
Current Status
Actions

Status:

Available
On Duty
On Leave
Half Day
Unavailable
Inactive

Doctor profile should show:

Doctor name
Photo/avatar
Specialization
Department
Experience
Phone
Email
Room
Working schedule
Joining date
Status

Schedule:

Monday
Tuesday
Wednesday
Thursday
Friday
Saturday
Sunday

Allow:

Working
Off
Half Day

Leave management:

Leave Start
Leave End
Leave Type
Reason
Approval Status

Leave types:

Full Day
Half Day
Emergency Leave
Casual Leave
Medical Leave

Actions:

Edit
View
Set Leave
Set Half Day
Deactivate

==================================================
16. STAFF MANAGEMENT
====================

Create Staff page.

Fields:

Staff ID
Name
Role
Department
Phone
Email
Joining Date
Shift
Status

Roles:

Nurse
Receptionist
Lab Technician
Pharmacist
Accountant
Ward Staff
Admin
Other

Staff status:

Active
On Leave
Inactive

==================================================
17. APPOINTMENTS
================

Create appointment management.

Header:

Appointments

Button:

* New Appointment

Appointment form:

Appointment ID
Patient
Doctor
Department
Appointment Date
Appointment Time
Appointment Type
Reason
Priority
Notes

Appointment types:

Consultation
Follow-up
Emergency
Routine Checkup
Lab Review

Status:

Scheduled
Checked In
Waiting
In Consultation
Completed
Cancelled
No Show

Create appointment calendar view.

Views:

Day
Week
Month

Also create appointment list view.

Appointment table:

Time
Patient
Doctor
Department
Type
Status
Actions

Actions:

View
Edit
Check In
Cancel
Complete

==================================================
18. ADMISSIONS
==============

Create patient admission management.

Admission page should show:

Total Admissions
Current Inpatients
Available Beds
Discharges Today

Admission form:

Admission ID
Patient
Doctor
Department
Ward
Room
Bed
Admission Date
Admission Time
Reason
Attendant
Emergency Contact
Insurance

Admission status:

Admitted
Under Treatment
Discharge Pending
Discharged

Bed management:

Ward
Room
Bed Number
Patient
Status

Bed statuses:

Available
Occupied
Reserved
Maintenance

==================================================
19. BILLING
===========

Create complete billing module.

Dashboard cards:

Today's Billing
Pending Payments
Paid Bills
Insurance Claims

Billing table:

Bill ID
Patient
Bill Date
Services
Amount
Paid
Balance
Payment Status
Actions

Payment statuses:

Paid
Partially Paid
Pending
Cancelled

Create invoice page.

Invoice should include:

Hospital details
Patient details
Bill ID
Date
Services
Quantity
Unit Price
Amount
Subtotal
Discount
Tax
Total
Paid Amount
Balance

Payment methods:

Cash
Card
UPI
Insurance
Bank Transfer

Buttons:

Save Bill
Print Invoice
Download Invoice
Record Payment

Use browser print functionality for invoice.

==================================================
20. PHARMACY
============

Create pharmacy management.

Dashboard cards:

Total Medicines
Low Stock
Out of Stock
Today's Sales

Medicine table:

Medicine ID
Medicine Name
Category
Batch Number
Expiry Date
Stock
Unit Price
Supplier
Status

Categories:

Tablet
Capsule
Syrup
Injection
Ointment
Drops
Other

Stock status:

In Stock
Low Stock
Out of Stock
Expired

Actions:

Add Medicine
Edit
Delete
View Details
Adjust Stock

Medicine form:

Medicine Name
Generic Name
Category
Manufacturer
Batch Number
Expiry Date
Quantity
Minimum Stock
Purchase Price
Selling Price
Supplier

Highlight low-stock items.

==================================================
21. PHARMACY PRESCRIPTION FLOW
==============================

Doctor should be able to create prescriptions.

Prescription contains:

Patient
Doctor
Date
Diagnosis
Medicine
Dosage
Frequency
Duration
Instructions

Example:

Paracetamol
500mg
1 tablet
Twice daily
5 days
After food

Allow multiple medicines.

Buttons:

Add Medicine
Remove Medicine
Save Prescription
Print Prescription

Prescription should appear inside Patient Profile.

==================================================
22. LABORATORY
==============

Create laboratory management.

Dashboard:

Pending Tests
Completed Tests
Critical Results
Today's Samples

Lab test table:

Test ID
Patient
Doctor
Test
Sample Type
Date
Status
Result
Actions

Statuses:

Requested
Sample Collected
Processing
Completed
Critical
Cancelled

Lab test types:

CBC
Blood Sugar
Lipid Profile
Liver Function
Kidney Function
Urine Test
X-Ray
CT Scan
MRI
ECG
Other

==================================================
23. LAB TEST ORDER FLOW
=======================

Doctor can request laboratory tests.

Lab Request:

Request ID
Patient
Doctor
Test
Priority
Instructions
Requested Date

Priority:

Routine
Urgent
Critical

Lab technician can:

Collect Sample
Start Test
Enter Result
Upload Report
Mark Completed

==================================================
24. LAB RESULT PAGE
===================

Lab result page should contain:

Patient details
Test details
Sample information
Reference ranges
Observed values
Result
Technician
Doctor
Date

Example:

Hemoglobin
Observed: 13.5
Normal Range: 12-16
Status: Normal

Use clear indicators:

Normal → green
Abnormal → amber
Critical → red

Allow:

Print Report
Download Report
Share internally

==================================================
25. REPORTS
===========

Create Reports module.

Report categories:

Patient Reports
Financial Reports
Doctor Reports
Appointment Reports
Admission Reports
Pharmacy Reports
Laboratory Reports

Create filtering:

Date From
Date To
Department
Doctor
Status

Reports should support:

View
Print
Export CSV

Create sample visual charts.

Examples:

Patient Registration Trend
Revenue Trend
Department Performance
Appointment Statistics
Pharmacy Sales
Lab Test Statistics

==================================================
26. FINAL MEDICAL REPORT
========================

Create a final patient report page.

The final report should combine the complete treatment journey:

Patient Information
Admission Details
Doctor Information
Diagnosis
Vitals
Laboratory Results
Medications
Procedures
Billing Summary
Discharge Details
Follow-up Instructions

Final report status:

Draft
Completed
Approved

Buttons:

Save Draft
Approve Report
Print Report

When approved:

Show:

Final Report Approved

==================================================
27. SETTINGS
============

Create Settings page with tabs.

Tabs:

General
Hospital Information
Users & Roles
Notifications
Appearance
Security

Hospital information fields:

Hospital Name
Address
Phone
Email
Website
Registration Number
Logo

Appearance:

Light Mode
Dark Mode
Sidebar collapsed

Notifications:

Appointment reminders
Lab result alerts
Low stock alerts
Billing alerts

Security:

Change Password
Session Timeout
Two-factor authentication UI

==================================================
28. USER AUTHENTICATION UI
==========================

Create Login page.

Login fields:

Email
Password
Remember Me

Button:

Login

Add:

Forgot Password

Use demo credentials.

Example:

[admin@medixhms.com](mailto:admin@medixhms.com)
password123

The application can use mock authentication.

After login:

redirect to:

/dashboard

Protect private routes.

==================================================
29. ROUTING
===========

Create routes such as:

/login
/dashboard
/patients
/patients/new
/patients/:id
/patients/:id/edit
/doctors
/doctors/new
/doctors/:id
/staff
/appointments
/appointments/new
/admissions
/billing
/billing/new
/pharmacy
/pharmacy/new
/laboratory
/laboratory/new
/laboratory/:id
/reports
/settings

Use React Router.

Create a reusable protected layout.

==================================================
30. REUSABLE COMPONENTS
=======================

Create reusable components such as:

Layout
Sidebar
Navbar
PageHeader
SearchBar
NotificationPanel
UserMenu
StatCard
DataTable
StatusBadge
Modal
Drawer
ConfirmDialog
FormInput
SelectInput
DateInput
TextArea
Button
Tabs
Pagination
EmptyState
LoadingState
ErrorState
Toast
PatientCard
DoctorCard
Timeline
ProgressStepper
ChartCard

Do not duplicate the same UI code across pages.

==================================================
31. DATA TABLE FEATURES
=======================

All major tables should support:

Search
Filter
Sorting
Pagination
Row actions
Status badges
Responsive behavior

On smaller screens:

Allow horizontal scrolling or convert rows into cards.

==================================================
32. MODALS AND FORMS
====================

Forms should open as:

* Full page forms for complex records
* Modal forms for quick actions

Use validation.

Display:

Required field messages
Invalid phone
Invalid email
Invalid date
Missing values

Show success/error toast after actions.

==================================================
33. LOCAL STORAGE
=================

Use LocalStorage to persist demo data.

Persist:

Patients
Doctors
Staff
Appointments
Admissions
Bills
Medicines
Prescriptions
Lab Tests
Reports
Theme
User session

Create helper utilities such as:

storageService.js

Functions:

getData()
setData()
removeData()
updateData()

Do not rely only on hardcoded UI arrays.

==================================================
34. MOCK DATA
=============

Populate the application with realistic sample data.

Patients:

At least 10

Doctors:

At least 8

Staff:

At least 8

Appointments:

At least 12

Medicines:

At least 15

Lab tests:

At least 12

Bills:

At least 10

Admissions:

At least 8

Use realistic Indian hospital data and phone number formats.

Do not use real people's personal data.

==================================================
35. PATIENT ID / RECORD ID GENERATION
=====================================

Generate IDs automatically.

Examples:

Patient:
PT-2026-0001

Doctor:
DR-2026-0001

Appointment:
APT-2026-0001

Admission:
ADM-2026-0001

Bill:
INV-2026-0001

Lab:
LAB-2026-0001

Prescription:
RX-2026-0001

==================================================
36. DASHBOARD INTERACTIONS
==========================

Cards should be clickable.

Example:

Click "Pending Lab Reports"
→ open Laboratory
→ filter Pending

Click "Low Stock"
→ open Pharmacy
→ filter Low Stock

Click "Today's Appointments"
→ open Appointments
→ filter Today

Click "Admitted Patients"
→ open Admissions

==================================================
37. NOTIFICATIONS
=================

Create dynamic notification dropdown.

Notification examples:

"Lab result available for PT-2026-0003"

"Medicine Paracetamol 500mg is low in stock"

"Dr. Rao is on leave today"

"Patient PT-2026-0007 has an appointment in 20 minutes"

Clicking notification should open related page.

==================================================
38. USER EXPERIENCE
===================

Use:

Toast notifications
Loading indicators
Skeleton loaders where useful
Confirmation dialogs
Hover states
Focus states
Clear empty states
Clear error states

Example empty state:

No patients found.

Button:

Register New Patient

==================================================
39. RESPONSIVE DESIGN
=====================

The website must work correctly on:

Desktop
Laptop
Tablet
Mobile

Desktop:

Sidebar visible.

Tablet:

Sidebar collapsible.

Mobile:

Sidebar becomes drawer.

Tables should remain usable.

Forms should become single-column.

Cards should stack.

Charts should resize.

==================================================
40. ACCESSIBILITY
=================

Follow basic accessibility standards.

Use:

Proper labels
Keyboard navigation
ARIA labels when necessary
Visible focus states
Readable contrast
Meaningful button labels

Do not use icon-only buttons without tooltips/aria-labels.

==================================================
41. CSS REQUIREMENTS
====================

Use CSS variables for the theme.

Example:

:root {
--primary: #1E40AF;
--secondary: #0D9488;
--background: #F8FAFC;
--surface: #FFFFFF;
--text-primary: #0F172A;
--text-secondary: #475569;
--success: #16A34A;
--warning: #D97706;
--danger: #DC2626;
}

Create consistent spacing.

Use:

border-radius: 10px / 12px

Soft box shadows.

Use responsive breakpoints.

Keep CSS organized by component.

==================================================
42. FILE / FOLDER STRUCTURE
===========================

Use a structure similar to:

src/
│
├── assets/
│
├── components/
│   ├── Layout/
│   ├── Sidebar/
│   ├── Navbar/
│   ├── Common/
│   │   ├── Button/
│   │   ├── Modal/
│   │   ├── DataTable/
│   │   ├── StatusBadge/
│   │   ├── StatCard/
│   │   ├── Toast/
│   │   └── EmptyState/
│   │
│   ├── Patients/
│   ├── Doctors/
│   ├── Staff/
│   ├── Appointments/
│   ├── Admissions/
│   ├── Billing/
│   ├── Pharmacy/
│   ├── Laboratory/
│   └── Reports/
│
├── pages/
│   ├── Login/
│   ├── Dashboard/
│   ├── Patients/
│   ├── Doctors/
│   ├── Staff/
│   ├── Appointments/
│   ├── Admissions/
│   ├── Billing/
│   ├── Pharmacy/
│   ├── Laboratory/
│   ├── Reports/
│   └── Settings/
│
├── data/
│   ├── mockData.js
│   └── initialData.js
│
├── services/
│   ├── storageService.js
│   └── idGenerator.js
│
├── context/
│   ├── AuthContext.jsx
│   ├── HospitalContext.jsx
│   └── ThemeContext.jsx
│
├── utils/
│   ├── formatters.js
│   ├── validators.js
│   └── helpers.js
│
├── routes/
│   └── AppRoutes.jsx
│
├── App.jsx
├── main.jsx
└── index.css

==================================================
43. COMPONENT DESIGN
====================

Each major page should contain:

Page Header
Page Description
Primary Action
Filters
Main Content
Responsive Data Table / Cards

Example:

Patients

Manage patient registrations, medical history and treatment records.

[+ Register Patient]

[Search Patients] [Status] [Doctor] [Gender]

Then the data table.

==================================================
44. DASHBOARD VISUAL STYLE
==========================

The dashboard should resemble modern hospital/healthcare software.

Use:

White cards
Light gray background
Blue primary buttons
Teal secondary actions
Colored status badges
Professional charts
Consistent icons

Example:

+------------------+
| Total Patients   |
| 12,458            |
| ↑ 8.4%           |
+------------------+

Use subtle trends.

==================================================
45. IMPORTANT USER FLOW
=======================

Make sure the application demonstrates the following full scenario:

1. Receptionist registers a patient.
2. Patient receives Patient ID.
3. Receptionist creates appointment.
4. Patient checks in.
5. Nurse records vitals.
6. Doctor opens patient profile.
7. Doctor enters diagnosis.
8. Doctor orders lab tests.
9. Lab technician sees pending test.
10. Technician enters results.
11. Doctor views lab result.
12. Doctor creates prescription.
13. Pharmacy receives prescription.
14. Pharmacist issues medicines.
15. Billing department creates invoice.
16. Patient pays.
17. If admitted, admission details are recorded.
18. Doctor completes treatment.
19. Patient is discharged.
20. Final medical report is generated.
21. Entire history remains visible in patient profile.

==================================================
46. PATIENT TIMELINE
====================

The Patient Profile should display an activity timeline.

Example:

09:10 AM
Patient Registered

09:35 AM
Appointment Created

10:05 AM
Check-in Completed

10:15 AM
Vitals Recorded

10:30 AM
Doctor Consultation

10:45 AM
Lab Test Requested

12:20 PM
Lab Result Completed

12:40 PM
Prescription Created

01:00 PM
Medicine Dispensed

01:15 PM
Billing Completed

02:00 PM
Discharged

==================================================
47. PRINTABLE DOCUMENTS
=======================

Create printable layouts for:

Patient Summary
Prescription
Lab Report
Invoice
Admission Summary
Discharge Summary
Final Medical Report

Use CSS print media queries.

==================================================
48. ERROR HANDLING
==================

Handle:

No data
Invalid data
Failed save
Missing patient
Missing doctor
Duplicate records
Invalid appointment
Empty tables

Show friendly messages.

==================================================
49. PERFORMANCE
===============

Avoid unnecessary rendering.

Use:

useMemo when appropriate
useCallback when appropriate
Reusable components
Efficient list rendering

Do not overuse these hooks.

==================================================
50. SECURITY-STYLE UI
=====================

Since this is a hospital system:

* Keep private information inside authenticated pages.
* Show session information in the profile menu.
* Add logout functionality.
* Do not expose sensitive information unnecessarily.
* Use placeholder/demo data only.

==================================================
51. QUALITY REQUIREMENTS
========================

The generated project must:

* Compile without errors
* Have no missing imports
* Have no broken routes
* Have no undefined variables
* Have no unused critical components
* Use consistent naming
* Use reusable components
* Use clean JSX
* Use readable CSS
* Work on desktop and mobile

Do not leave pages as empty placeholders.

Every sidebar item must open a functional page.

==================================================
52. IMPORTANT IMPLEMENTATION INSTRUCTION
========================================

Do NOT simply create the UI.

Actually implement:

* Navigation
* Routing
* Forms
* CRUD operations
* Search
* Filters
* Modals
* Status changes
* Appointment creation
* Patient registration
* Doctor management
* Staff management
* Admission management
* Billing
* Pharmacy stock
* Prescription
* Lab requests
* Lab results
* Reports
* LocalStorage persistence
* Theme switching
* Notifications
* Printable documents

The application should feel like a working HMS prototype.

==================================================
53. CRUD REQUIREMENTS
=====================

Implement Create, Read, Update and Delete operations for:

Patients
Doctors
Staff
Appointments
Admissions
Medicines
Lab Tests
Bills

For dangerous delete actions:

Show confirmation modal.

Example:

Delete Patient?

This action cannot be undone.

[Cancel] [Delete]

==================================================
54. UI DETAILS
==============

Buttons should have clear variants:

Primary
Secondary
Success
Warning
Danger
Ghost

Inputs should have:

Label
Placeholder
Error message
Focus state

Tables should have:

Sticky header where useful
Hover row
Status badge
Action menu

Cards should have:

Title
Value
Supporting text
Optional icon
Optional trend

==================================================
55. FINAL RESULT
================

The final application should look like a real product named:

MEDIX HMS

It should communicate:

Trust
Healthcare
Professionalism
Efficiency
Clarity

The main visual identity should be based on:

Deep Blue #1E40AF
Healing Teal #0D9488
Clean Off-White #F8FAFC
White Cards #FFFFFF
Dark Slate #0F172A

==================================================
56. STARTUP REQUIREMENTS
========================

First create all required project files.

Then install/import required dependencies.

Make sure the project runs successfully.

If a dependency is needed, include the npm command.

Required packages should include at least:

react
react-dom
react-router-dom
react-icons
recharts

Use standard Vite React setup.

==================================================
57. DEVELOPMENT APPROACH
========================

Build the project in this order:

1. Project setup
2. Theme / global CSS
3. Layout
4. Sidebar
5. Navbar
6. Routing
7. Dashboard
8. Patients
9. Doctors & Staff
10. Appointments
11. Admissions
12. Billing
13. Pharmacy
14. Laboratory
15. Reports
16. Settings
17. Authentication
18. LocalStorage
19. Notifications
20. Printable documents
21. Responsive improvements
22. Final error fixing

After generating the project, review all imports and routes and make sure there are no compilation errors.

==================================================
58. COPILOT / ANTIGRAVITY OUTPUT RULE
=====================================

Do not give me only an explanation.

Generate the actual React project code.

For every file you create:

* Show the file path
* Create the complete code
* Keep components separated
* Keep CSS separated
* Do not use placeholder comments such as "add code here"
* Do not omit important logic
* Do not shorten files with "...existing code..."
* Do not create fake buttons that do nothing
* Make every major action functional

When the project is complete, provide:

1. Complete folder structure
2. Required npm install command
3. Complete source code
4. How to run the project
5. Demo login credentials
6. Brief explanation of the main patient flow

The final result should be a complete **React Hospital Management System called Medix HMS** with a working patient lifecycle from **registration → appointment → consultation → laboratory → prescription → pharmacy → billing → admission/discharge → final medical report**.

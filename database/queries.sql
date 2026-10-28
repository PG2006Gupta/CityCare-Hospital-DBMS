-- ============================================================
--  CITY CARE HOSPITAL - 36 SQL QUERIES FOR THE PRACTICAL FILE
--  Format:  -- QNN | Group | Plain-English question
--  SQLite dialect. Conversion notes for MySQL / MS Access are
--  in Hospital_Project_Prompt_Pack.md
-- ============================================================

-- Q01 | A. Simple SELECT | List all active doctors, their specialization and fee, highest fee first
SELECT DoctorID, FullName, Specialization, ConsultFee
FROM DOCTOR
WHERE Status = 'Active'
ORDER BY ConsultFee DESC, FullName;

-- Q02 | A. Simple SELECT | Show every appointment booked in October 2026 (BETWEEN + ORDER BY)
SELECT AppID, PatientID, DoctorID, AppDate, AppTime, Status
FROM APPOINTMENT
WHERE AppDate BETWEEN '2026-10-01' AND '2026-10-31'
ORDER BY AppDate, AppTime;

-- Q03 | A. Simple SELECT | Find patients from Chandigarh, Mohali or Kharar whose name starts with A or S
SELECT PatientID, FullName, City, Phone
FROM PATIENT
WHERE City IN ('Chandigarh','Mohali','Kharar')
  AND (FullName LIKE 'A%' OR FullName LIKE 'S%')
ORDER BY City, FullName;

-- Q04 | A. Simple SELECT | Show patient name, age in years and blood group (calculated column + date function)
SELECT FullName,
       CAST((julianday('2026-10-27') - julianday(DOB)) / 365.25 AS INTEGER) AS AgeYears,
       BloodGroup, City
FROM PATIENT
ORDER BY AgeYears DESC;

-- Q05 | B. Aggregates | Count doctors and find average, minimum and maximum consultation fee
SELECT COUNT(*) AS TotalDoctors,
       ROUND(AVG(ConsultFee),2) AS AvgFee,
       MIN(ConsultFee) AS MinFee,
       MAX(ConsultFee) AS MaxFee
FROM DOCTOR;

-- Q06 | B. Aggregates | Count doctors in each department (GROUP BY)
SELECT dp.DeptName, COUNT(d.DoctorID) AS DoctorCount
FROM DEPARTMENT dp LEFT JOIN DOCTOR d ON dp.DeptID = d.DeptID
GROUP BY dp.DeptID, dp.DeptName
ORDER BY DoctorCount DESC;

-- Q07 | B. Aggregates | Departments having MORE THAN one doctor (HAVING)
SELECT dp.DeptName, COUNT(d.DoctorID) AS DoctorCount,
       ROUND(AVG(d.ConsultFee),2) AS AvgFee
FROM DEPARTMENT dp JOIN DOCTOR d ON dp.DeptID = d.DeptID
GROUP BY dp.DeptID, dp.DeptName
HAVING COUNT(d.DoctorID) > 1
ORDER BY DoctorCount DESC;

-- Q08 | C. Joins | INNER JOIN: doctors with their department name and block
SELECT d.DoctorID, d.FullName AS Doctor, d.Specialization,
       dp.DeptName AS Department, dp.Block, d.ConsultFee
FROM DOCTOR d INNER JOIN DEPARTMENT dp ON d.DeptID = dp.DeptID
ORDER BY dp.DeptName, d.FullName;

-- Q09 | C. Joins | 3-table INNER JOIN: complete appointment register
SELECT a.AppID, a.AppDate, a.AppTime,
       p.FullName AS Patient, d.FullName AS Doctor,
       dp.DeptName AS Department, a.Status, a.ConsultFee
FROM APPOINTMENT a
JOIN PATIENT p     ON a.PatientID = p.PatientID
JOIN DOCTOR d      ON a.DoctorID  = d.DoctorID
JOIN DEPARTMENT dp ON d.DeptID    = dp.DeptID
ORDER BY a.AppDate DESC, a.AppTime;

-- Q10 | C. Joins | LEFT JOIN: patients who have NEVER booked an appointment (anti-join)
SELECT p.PatientID, p.FullName, p.City, p.Phone
FROM PATIENT p
LEFT JOIN APPOINTMENT a ON p.PatientID = a.PatientID
WHERE a.AppID IS NULL;

-- Q11 | C. Joins | LEFT JOIN: doctors with ZERO appointments, and count of appointments for all doctors
SELECT d.DoctorID, d.FullName, COUNT(a.AppID) AS AppointmentCount
FROM DOCTOR d LEFT JOIN APPOINTMENT a ON d.DoctorID = a.DoctorID
GROUP BY d.DoctorID, d.FullName
ORDER BY AppointmentCount ASC;

-- Q12 | C. Joins | SELF JOIN: pairs of patients sharing the same blood group
SELECT p1.FullName AS Patient1, p2.FullName AS Patient2, p1.BloodGroup
FROM PATIENT p1 JOIN PATIENT p2
  ON p1.BloodGroup = p2.BloodGroup AND p1.PatientID < p2.PatientID
ORDER BY p1.BloodGroup
LIMIT 12;

-- Q13 | D. Subqueries | Scalar subquery: doctors charging more than the overall average fee
SELECT FullName, Specialization, ConsultFee
FROM DOCTOR
WHERE ConsultFee > (SELECT AVG(ConsultFee) FROM DOCTOR)
ORDER BY ConsultFee DESC;

-- Q14 | D. Subqueries | CORRELATED subquery: doctors earning more than their OWN department's average
SELECT d.FullName, dp.DeptName, d.ConsultFee
FROM DOCTOR d JOIN DEPARTMENT dp ON d.DeptID = dp.DeptID
WHERE d.ConsultFee > (
    SELECT AVG(d2.ConsultFee) FROM DOCTOR d2 WHERE d2.DeptID = d.DeptID
)
ORDER BY dp.DeptName, d.ConsultFee DESC;

-- Q15 | D. Subqueries | IN subquery: patients who consulted a doctor from Cardiology
SELECT DISTINCT p.PatientID, p.FullName, p.City
FROM PATIENT p
WHERE p.PatientID IN (
    SELECT a.PatientID FROM APPOINTMENT a
    JOIN DOCTOR d ON a.DoctorID = d.DoctorID
    JOIN DEPARTMENT dp ON d.DeptID = dp.DeptID
    WHERE dp.DeptName = 'Cardiology'
)
ORDER BY p.FullName;

-- Q16 | D. Subqueries | EXISTS: patients who have a completed visit AND at least one pending bill
SELECT p.PatientID, p.FullName, p.Phone
FROM PATIENT p
WHERE EXISTS (SELECT 1 FROM APPOINTMENT a
              WHERE a.PatientID = p.PatientID AND a.Status = 'Completed')
  AND EXISTS (SELECT 1 FROM BILL b
              WHERE b.PatientID = p.PatientID AND b.PaidStatus = 'Pending');

-- Q17 | D. Subqueries | UNION: one combined contact directory of doctors and patients
SELECT 'Doctor' AS Role, FullName, Phone, Email FROM DOCTOR
UNION
SELECT 'Patient' AS Role, FullName, Phone, Email FROM PATIENT
ORDER BY Role, FullName;

-- Q18 | E. M:N Junction | Full prescription: 4-table join through PRESCRIPTION_DETAIL
SELECT pr.PrescID, pr.PrescDate, p.FullName AS Patient,
       d.FullName AS Doctor, m.MedName, pd.Dosage, pd.Frequency,
       pd.Days, pd.Qty, pd.UnitPrice, pd.LineTotal
FROM PRESCRIPTION pr
JOIN PATIENT p                  ON pr.PatientID = p.PatientID
JOIN DOCTOR d                   ON pr.DoctorID  = d.DoctorID
JOIN PRESCRIPTION_DETAIL pd     ON pr.PrescID   = pd.PrescID
JOIN MEDICINE m                 ON pd.MedicineID = m.MedicineID
ORDER BY pr.PrescDate DESC, pr.PrescID
LIMIT 25;

-- Q19 | E. M:N Junction | Top 5 most-dispensed medicines by total quantity
SELECT m.MedName, m.Category, COUNT(pd.PrescDetailID) AS TimesPrescribed,
       SUM(pd.Qty) AS TotalUnits, ROUND(SUM(pd.LineTotal),2) AS MedicineRevenue
FROM PRESCRIPTION_DETAIL pd JOIN MEDICINE m ON pd.MedicineID = m.MedicineID
GROUP BY m.MedicineID, m.MedName, m.Category
ORDER BY TotalUnits DESC
LIMIT 5;

-- Q20 | E. Business Query | Medicines below reorder level (purchase alert)
SELECT MedicineID, MedName, Category, StockQty, ReorderLevel,
       (ReorderLevel - StockQty) AS UnitsToOrder
FROM MEDICINE
WHERE StockQty < ReorderLevel
ORDER BY (ReorderLevel - StockQty) DESC;

-- Q21 | E. Business Query | Medicines expiring within the next 90 days
SELECT MedName, Manufacturer, ExpiryDate,
       CAST(julianday(ExpiryDate) - julianday('2026-10-27') AS INTEGER) AS DaysLeft
FROM MEDICINE
WHERE ExpiryDate BETWEEN '2026-10-27' AND date('2026-10-27','+90 day')
ORDER BY ExpiryDate;

-- Q22 | E. Business Query | Month-wise appointment trend (date function + GROUP BY)
SELECT strftime('%Y-%m', AppDate) AS Month,
       COUNT(*) AS TotalAppointments,
       SUM(CASE WHEN Status='Completed' THEN 1 ELSE 0 END) AS Completed,
       SUM(CASE WHEN Status='No Show'  THEN 1 ELSE 0 END) AS NoShows
FROM APPOINTMENT
GROUP BY strftime('%Y-%m', AppDate)
ORDER BY Month;

-- Q23 | E. Business Query | Currently occupied rooms with patient, doctor and days stayed
SELECT r.RoomNo, r.RoomType, p.FullName AS Patient, d.FullName AS Doctor,
       ad.Diagnosis, ad.AdmitDate,
       CAST(julianday('2026-10-27') - julianday(ad.AdmitDate) AS INTEGER) AS DaysStayed
FROM ADMISSION ad
JOIN ROOM r    ON ad.RoomID    = r.RoomID
JOIN PATIENT p ON ad.PatientID = p.PatientID
JOIN DOCTOR d  ON ad.DoctorID  = d.DoctorID
WHERE ad.Status = 'Admitted'
ORDER BY DaysStayed DESC;

-- Q24 | E. Business Query | Average length of stay by department (discharged patients only)
SELECT dp.DeptName, COUNT(*) AS Discharges,
       ROUND(AVG(julianday(ad.DischargeDate) - julianday(ad.AdmitDate)),1) AS AvgStayDays,
       ROUND(SUM((julianday(ad.DischargeDate)-julianday(ad.AdmitDate)) * r.ChargesPerDay),2) AS RoomRevenue
FROM ADMISSION ad
JOIN DOCTOR d     ON ad.DoctorID = d.DoctorID
JOIN DEPARTMENT dp ON d.DeptID   = dp.DeptID
JOIN ROOM r       ON ad.RoomID   = r.RoomID
WHERE ad.DischargeDate IS NOT NULL
GROUP BY dp.DeptID, dp.DeptName
ORDER BY AvgStayDays DESC;

-- Q25 | F. Views | Create a reusable view of doctor-wise consultation revenue (run once)
CREATE VIEW IF NOT EXISTS v_doctor_revenue AS
SELECT d.DoctorID, d.FullName AS Doctor, dp.DeptName AS Department,
       COUNT(a.AppID) AS Consultations,
       COALESCE(SUM(a.ConsultFee),0) AS ConsultRevenue
FROM DOCTOR d
JOIN DEPARTMENT dp ON d.DeptID = dp.DeptID
LEFT JOIN APPOINTMENT a ON a.DoctorID = d.DoctorID AND a.Status = 'Completed'
GROUP BY d.DoctorID, d.FullName, dp.DeptName;

-- Q26 | F. Views | Use the view + show the query plan proving idx_app_date is used
SELECT Doctor, Department, Consultations, ConsultRevenue
FROM v_doctor_revenue
ORDER BY ConsultRevenue DESC
LIMIT 10;

-- Q27 | F. Indexes | EXPLAIN QUERY PLAN - see the index being used before/after indexing
EXPLAIN QUERY PLAN
SELECT AppID, AppDate, DoctorID FROM APPOINTMENT
WHERE AppDate BETWEEN '2026-09-01' AND '2026-10-31';

-- Q28 | G. Transactions | Atomic booking: appointment + bill in ONE transaction (run once, or change the date)
BEGIN TRANSACTION;
INSERT INTO APPOINTMENT (PatientID,DoctorID,AppDate,AppTime,Reason,Status,ConsultFee)
  VALUES (30,13,'2026-12-31','17:00','Follow-up - transaction demo','Scheduled',1300);
INSERT INTO BILL (PatientID,BillDate,BillType,RefID,GrossAmount,Discount,TaxPercent,PaymentMode,PaidStatus)
  VALUES (30,'2026-12-31','Consultation',(SELECT MAX(AppID) FROM APPOINTMENT),1300,0,5,'UPI','Paid');
-- Replace COMMIT with ROLLBACK to demonstrate that BOTH inserts are undone.
COMMIT;
SELECT (SELECT COUNT(*) FROM APPOINTMENT WHERE AppDate='2026-12-31') AS NewAppointments,
       (SELECT COUNT(*) FROM BILL WHERE BillDate='2026-12-31') AS NewBills;

-- Q29 | G. DML UPDATE | Give a 10% price rise to all antibiotic medicines
UPDATE MEDICINE
SET UnitPrice = ROUND(UnitPrice * 1.10, 2)
WHERE Category = 'Antibiotic';
SELECT MedicineID, MedName, UnitPrice FROM MEDICINE WHERE Category='Antibiotic';

-- Q30 | G. DML DELETE | Remove very old cancelled appointments (ON DELETE CASCADE cleans prescriptions)
-- Run only on a COPY of the database - it deletes real rows.
-- DELETE FROM APPOINTMENT WHERE Status='Cancelled' AND AppDate < '2026-05-01';
SELECT Status, COUNT(*) AS RowsThatWouldBeDeleted
FROM APPOINTMENT
WHERE Status='Cancelled' AND AppDate < '2026-05-01'
GROUP BY Status;

-- Q31 | G. DDL ALTER | Add a new column to PATIENT (run once only)
-- ALTER TABLE PATIENT ADD COLUMN AadhaarNo VARCHAR(12);
SELECT name AS TableName, sql AS Definition
FROM sqlite_master WHERE type='table' AND name='PATIENT';

-- Q32 | H. Validation | Referential-integrity audit: orphan rows, duplicates and DB objects
SELECT 'Orphan appointments' AS CheckName, COUNT(*) AS ProblemRows
FROM APPOINTMENT a LEFT JOIN PATIENT p ON a.PatientID=p.PatientID
WHERE p.PatientID IS NULL
UNION ALL
SELECT 'Orphan prescriptions', COUNT(*)
FROM PRESCRIPTION pr LEFT JOIN APPOINTMENT a ON pr.AppID=a.AppID
WHERE a.AppID IS NULL
UNION ALL
SELECT 'Duplicate patient phones', COUNT(*)
FROM (SELECT Phone FROM PATIENT GROUP BY Phone HAVING COUNT(*) > 1)
UNION ALL
SELECT 'Triggers defined', COUNT(*) FROM sqlite_master WHERE type='trigger'
UNION ALL
SELECT 'Views defined', COUNT(*) FROM sqlite_master WHERE type='view';

-- Q33 | H. Validation | 2nd highest consultation fee using LIMIT ... OFFSET
SELECT DISTINCT ConsultFee FROM DOCTOR ORDER BY ConsultFee DESC LIMIT 1 OFFSET 1;

-- Q34 | H. Complex | Top 3 patients by total spend, with their last visit date
SELECT p.PatientID, p.FullName, p.City,
       COUNT(b.BillID) AS Bills,
       ROUND(SUM(b.NetAmount),2) AS TotalSpend,
       (SELECT MAX(a.AppDate) FROM APPOINTMENT a WHERE a.PatientID = p.PatientID) AS LastVisit
FROM PATIENT p JOIN BILL b ON p.PatientID = b.PatientID
GROUP BY p.PatientID, p.FullName, p.City
ORDER BY TotalSpend DESC
LIMIT 3;

-- Q35 | H. Complex | Department performance report: doctors, visits, revenue, avg fee
SELECT dp.DeptName,
       COUNT(DISTINCT d.DoctorID) AS Doctors,
       COUNT(a.AppID) AS TotalAppointments,
       SUM(CASE WHEN a.Status='Completed' THEN 1 ELSE 0 END) AS Completed,
       ROUND(AVG(d.ConsultFee),2) AS AvgConsultFee,
       ROUND(SUM(CASE WHEN a.Status='Completed' THEN a.ConsultFee ELSE 0 END),2) AS EarnedFees
FROM DEPARTMENT dp
LEFT JOIN DOCTOR d      ON dp.DeptID = d.DeptID
LEFT JOIN APPOINTMENT a ON d.DoctorID = a.DoctorID
GROUP BY dp.DeptID, dp.DeptName
ORDER BY EarnedFees DESC;

-- Q36 | H. Complex | Parameterised-style search: appointments for one doctor in a date range
-- In the application this becomes: WHERE d.DoctorID = ? AND a.AppDate BETWEEN ? AND ?
SELECT a.AppID, a.AppDate, a.AppTime, p.FullName AS Patient, a.Status, a.ConsultFee
FROM APPOINTMENT a
JOIN PATIENT p ON a.PatientID = p.PatientID
JOIN DOCTOR d  ON a.DoctorID  = d.DoctorID
WHERE d.DoctorID = 1
  AND a.AppDate BETWEEN '2026-09-01' AND '2026-10-31'
ORDER BY a.AppDate, a.AppTime;

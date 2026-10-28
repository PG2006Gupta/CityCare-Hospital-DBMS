-- ============================================================
--  CITY CARE HOSPITAL  -  Database Schema (SQLite / ANSI SQL)
--  10 tables | 13 foreign keys | 3 views | 3 triggers | indexes
--  For MySQL / MS Access conversion notes, see the Prompt Pack.
-- ============================================================
PRAGMA foreign_keys = ON;

-- 1. DEPARTMENT (master)
CREATE TABLE IF NOT EXISTS DEPARTMENT (
    DeptID        INTEGER PRIMARY KEY AUTOINCREMENT,
    DeptName      VARCHAR(50)  NOT NULL UNIQUE,
    HOD           VARCHAR(60),
    Block         VARCHAR(20),
    Phone         VARCHAR(15),
    Established   DATE
);

-- 2. DOCTOR (master, 1:M with DEPARTMENT)
CREATE TABLE IF NOT EXISTS DOCTOR (
    DoctorID       INTEGER PRIMARY KEY AUTOINCREMENT,
    FullName       VARCHAR(60) NOT NULL,
    Gender         CHAR(1) CHECK (Gender IN ('M','F','O')),
    DeptID         INTEGER NOT NULL,
    Specialization VARCHAR(60) NOT NULL,
    Qualification  VARCHAR(80),
    ExperienceYrs  INTEGER CHECK (ExperienceYrs >= 0),
    ConsultFee     DECIMAL(8,2) NOT NULL CHECK (ConsultFee >= 0),
    Phone          VARCHAR(15) UNIQUE,
    Email          VARCHAR(80) UNIQUE,
    JoiningDate    DATE NOT NULL,
    Status         VARCHAR(15) DEFAULT 'Active'
                   CHECK (Status IN ('Active','On Leave','Resigned')),
    FOREIGN KEY (DeptID) REFERENCES DEPARTMENT(DeptID)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- 3. PATIENT (master)
CREATE TABLE IF NOT EXISTS PATIENT (
    PatientID        INTEGER PRIMARY KEY AUTOINCREMENT,
    FullName         VARCHAR(60) NOT NULL,
    Gender           CHAR(1) CHECK (Gender IN ('M','F','O')),
    DOB              DATE NOT NULL,
    BloodGroup       VARCHAR(5),
    Phone            VARCHAR(15) NOT NULL UNIQUE,
    Email            VARCHAR(80),
    Address          VARCHAR(120),
    City             VARCHAR(40),
    State            VARCHAR(40) DEFAULT 'Punjab',
    EmergencyContact VARCHAR(15),
    RegDate          DATE NOT NULL
);

-- 4. ROOM (master)
CREATE TABLE IF NOT EXISTS ROOM (
    RoomID        INTEGER PRIMARY KEY AUTOINCREMENT,
    RoomNo        VARCHAR(10) NOT NULL UNIQUE,
    RoomType      VARCHAR(20) NOT NULL
                  CHECK (RoomType IN ('General','Semi-Private','Private','ICU','Operation Theatre')),
    DeptID        INTEGER,
    ChargesPerDay DECIMAL(8,2) NOT NULL CHECK (ChargesPerDay >= 0),
    Status        VARCHAR(15) DEFAULT 'Available'
                  CHECK (Status IN ('Available','Occupied','Maintenance')),
    FOREIGN KEY (DeptID) REFERENCES DEPARTMENT(DeptID)
);

-- 5. APPOINTMENT (transaction) - resolves M:N between DOCTOR and PATIENT
CREATE TABLE IF NOT EXISTS APPOINTMENT (
    AppID       INTEGER PRIMARY KEY AUTOINCREMENT,
    PatientID   INTEGER NOT NULL,
    DoctorID    INTEGER NOT NULL,
    AppDate     DATE NOT NULL,
    AppTime     TIME NOT NULL,
    Reason      VARCHAR(120),
    Status      VARCHAR(15) DEFAULT 'Scheduled'
                CHECK (Status IN ('Scheduled','Completed','Cancelled','No Show')),
    ConsultFee  DECIMAL(8,2) NOT NULL CHECK (ConsultFee >= 0),
    CreatedOn   DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (PatientID) REFERENCES PATIENT(PatientID) ON DELETE CASCADE,
    FOREIGN KEY (DoctorID)  REFERENCES DOCTOR(DoctorID)  ON DELETE RESTRICT,
    UNIQUE (DoctorID, AppDate, AppTime)   -- prevents double-booking a doctor
);

-- 6. ADMISSION (transaction)
CREATE TABLE IF NOT EXISTS ADMISSION (
    AdmissionID   INTEGER PRIMARY KEY AUTOINCREMENT,
    PatientID     INTEGER NOT NULL,
    DoctorID      INTEGER NOT NULL,
    RoomID        INTEGER NOT NULL,
    AdmitDate     DATETIME NOT NULL,
    DischargeDate DATETIME,
    Diagnosis     VARCHAR(120),
    Status        VARCHAR(15) DEFAULT 'Admitted'
                  CHECK (Status IN ('Admitted','Discharged','Transferred')),
    FOREIGN KEY (PatientID) REFERENCES PATIENT(PatientID),
    FOREIGN KEY (DoctorID)  REFERENCES DOCTOR(DoctorID),
    FOREIGN KEY (RoomID)    REFERENCES ROOM(RoomID),
    CHECK (DischargeDate IS NULL OR DischargeDate >= AdmitDate)
);

-- 7. MEDICINE (master / pharmacy inventory)
CREATE TABLE IF NOT EXISTS MEDICINE (
    MedicineID   INTEGER PRIMARY KEY AUTOINCREMENT,
    MedName      VARCHAR(70) NOT NULL,
    Category     VARCHAR(40),
    Manufacturer VARCHAR(60),
    UnitPrice    DECIMAL(8,2) NOT NULL CHECK (UnitPrice >= 0),
    StockQty     INTEGER NOT NULL DEFAULT 0 CHECK (StockQty >= 0),
    ReorderLevel INTEGER DEFAULT 20 CHECK (ReorderLevel >= 0),
    ExpiryDate   DATE,
    IsActive     INTEGER DEFAULT 1
);

-- 8. PRESCRIPTION (transaction, 1:1 with APPOINTMENT)
CREATE TABLE IF NOT EXISTS PRESCRIPTION (
    PrescID    INTEGER PRIMARY KEY AUTOINCREMENT,
    AppID      INTEGER NOT NULL UNIQUE,
    PatientID  INTEGER NOT NULL,
    DoctorID   INTEGER NOT NULL,
    PrescDate  DATE NOT NULL,
    Diagnosis  VARCHAR(120),
    Notes      VARCHAR(200),
    FOREIGN KEY (AppID)     REFERENCES APPOINTMENT(AppID) ON DELETE CASCADE,
    FOREIGN KEY (PatientID) REFERENCES PATIENT(PatientID),
    FOREIGN KEY (DoctorID)  REFERENCES DOCTOR(DoctorID)
);

-- 9. PRESCRIPTION_DETAIL (junction table: resolves M:N between PRESCRIPTION and MEDICINE)
CREATE TABLE IF NOT EXISTS PRESCRIPTION_DETAIL (
    PrescDetailID INTEGER PRIMARY KEY AUTOINCREMENT,
    PrescID       INTEGER NOT NULL,
    MedicineID    INTEGER NOT NULL,
    Dosage        VARCHAR(30),
    Frequency     VARCHAR(30),
    Days          INTEGER CHECK (Days > 0),
    Qty           INTEGER NOT NULL CHECK (Qty > 0),
    UnitPrice     DECIMAL(8,2) NOT NULL,
    LineTotal     DECIMAL(10,2) GENERATED ALWAYS AS (Qty * UnitPrice) VIRTUAL,
    FOREIGN KEY (PrescID)    REFERENCES PRESCRIPTION(PrescID) ON DELETE CASCADE,
    FOREIGN KEY (MedicineID) REFERENCES MEDICINE(MedicineID)  ON DELETE RESTRICT,
    UNIQUE (PrescID, MedicineID)
);

-- 10. BILL (transaction)
CREATE TABLE IF NOT EXISTS BILL (
    BillID       INTEGER PRIMARY KEY AUTOINCREMENT,
    PatientID    INTEGER NOT NULL,
    BillDate     DATE NOT NULL,
    BillType     VARCHAR(20) NOT NULL
                 CHECK (BillType IN ('Consultation','Room','Medicine','Lab','Mixed')),
    RefID        INTEGER,
    GrossAmount  DECIMAL(10,2) NOT NULL CHECK (GrossAmount >= 0),
    Discount     DECIMAL(10,2) DEFAULT 0 CHECK (Discount >= 0),
    TaxPercent   DECIMAL(5,2)  DEFAULT 5.00,
    NetAmount    DECIMAL(10,2) GENERATED ALWAYS AS
                 (ROUND((GrossAmount - Discount) * (1 + TaxPercent/100.0), 2)) VIRTUAL,
    PaymentMode  VARCHAR(15) DEFAULT 'Cash'
                 CHECK (PaymentMode IN ('Cash','UPI','Card','Insurance','Online')),
    PaidStatus   VARCHAR(15) DEFAULT 'Paid'
                 CHECK (PaidStatus IN ('Paid','Pending','Partial','Refunded')),
    FOREIGN KEY (PatientID) REFERENCES PATIENT(PatientID)
);

-- ---------- Indexes (for the performance demo in Query Q26) ----------
CREATE INDEX IF NOT EXISTS idx_app_date        ON APPOINTMENT(AppDate);
CREATE INDEX IF NOT EXISTS idx_app_patient     ON APPOINTMENT(PatientID);
CREATE INDEX IF NOT EXISTS idx_bill_patient    ON BILL(PatientID, BillDate);
CREATE INDEX IF NOT EXISTS idx_presc_med       ON PRESCRIPTION_DETAIL(MedicineID);
CREATE INDEX IF NOT EXISTS idx_patient_name    ON PATIENT(FullName);

-- ---------- Views ----------
CREATE VIEW IF NOT EXISTS v_doctor_schedule AS
SELECT d.DoctorID, d.FullName AS Doctor, dp.DeptName AS Department,
       a.AppDate, a.AppTime, p.FullName AS Patient, a.Status
FROM APPOINTMENT a
JOIN DOCTOR d     ON a.DoctorID  = d.DoctorID
JOIN DEPARTMENT dp ON d.DeptID   = dp.DeptID
JOIN PATIENT p    ON a.PatientID = p.PatientID;

CREATE VIEW IF NOT EXISTS v_available_rooms AS
SELECT RoomID, RoomNo, RoomType, ChargesPerDay, Status
FROM ROOM WHERE Status = 'Available';

CREATE VIEW IF NOT EXISTS v_patient_spend AS
SELECT p.PatientID, p.FullName, p.City,
       COUNT(b.BillID)              AS BillCount,
       COALESCE(SUM(b.NetAmount),0) AS TotalSpend
FROM PATIENT p LEFT JOIN BILL b ON p.PatientID = b.PatientID
GROUP BY p.PatientID, p.FullName, p.City;

-- ---------- Triggers ----------
CREATE TRIGGER IF NOT EXISTS trg_admission_insert
AFTER INSERT ON ADMISSION
BEGIN
    UPDATE ROOM SET Status = 'Occupied' WHERE RoomID = NEW.RoomID;
END;

CREATE TRIGGER IF NOT EXISTS trg_admission_discharge
AFTER UPDATE OF DischargeDate ON ADMISSION
WHEN NEW.DischargeDate IS NOT NULL
BEGIN
    UPDATE ROOM SET Status = 'Available' WHERE RoomID = NEW.RoomID;
END;

CREATE TRIGGER IF NOT EXISTS trg_presc_detail_stock
AFTER INSERT ON PRESCRIPTION_DETAIL
BEGIN
    UPDATE MEDICINE
       SET StockQty = StockQty - NEW.Qty
     WHERE MedicineID = NEW.MedicineID;
END;

# iSCAN Inventory Workflow

## Inventory Scanning, Counting, Analysis & Normalization

**Tagline:** Accurate Inventory. Reliable Data. Better Decisions.

## 1. Overview

> **Scope note:** This extracted workflow describes the intended end-to-end
> product. The current implementation is Phase 2: scanning, count capture, and
> persistence using Supabase PostgreSQL. MSSQL connectivity, Odoo
> reconciliation, approvals, reporting, and ERP adjustment posting are future
> phases and are not required dependencies for the current POC.

iSCAN describes a five-stage inventory workflow that starts with
scanning physical items using a mobile device and ends with posting
approved inventory adjustments to Odoo ERP.

The workflow connects physical inventory counting with the inventory
records maintained in the system. It captures item-level details,
locations, and quantities; compares the physical count against the
system quantity; identifies and reviews discrepancies; generates
Inventory Record Accuracy (IRA) reports; and, when approved, updates
inventory balances in Odoo.

### Workflow at a glance

1.  **Scan Items** --- Capture item information, barcode, location, and
    quantity using a mobile device.
2.  **Record Counts** --- Encode and save physical inventory counts.
3.  **Analyze & Reconcile** --- Compare physical counts with system
    inventory and investigate variances.
4.  **Generate Reports** --- Produce IRA reports, variance analysis,
    summaries, and supporting details.
5.  **Post Adjustments** --- Upload or post approved adjustments to Odoo
    ERP, update balances, and close the reconciliation process.

## 2. Stage 1 --- Scan Items Using a Mobile Device

### Purpose

Capture item details at the point of physical inventory so that the
count is associated with the correct item and location.

### Key activities

-   Scan 1D or 2D barcodes using a mobile device.
-   Capture item details, location, and quantity in real time.
-   Validate or complete the required item fields.
-   Support online and offline operation.
-   Capture inventory data with item details.

### Information captured

The infographic explicitly identifies these data points: - **Item:** The
inventory item being counted. - **Location:** Where the item is
physically located. - **Quantity:** The observed or counted quantity. -
**Barcode:** A 1D or 2D barcode used to identify the item.

### Process flow

1.  The operator opens the iSCAN mobile interface.
2.  The operator scans the item's barcode.
3.  The operator captures or confirms the item information.
4.  The operator records the item's location.
5.  The operator enters or captures the physical quantity.
6.  The application records the details for the inventory count process.

### Output

A captured inventory record containing item identification and relevant
count details, ready to be recorded and synchronized.

### Operational notes

-   The infographic states that the mobile scanning process works
    online/offline.
-   It also describes real-time data capture.
-   It does not specify the exact offline synchronization rules,
    conflict handling, supported barcode formats beyond 1D/2D, or
    validation rules. Those details would need to be defined in the
    system requirements.

## 3. Stage 2 --- Record Counts: Physical Inventory

### Purpose

Record the actual quantities observed during the physical inventory
activity and save them for comparison with system records.

### Key activities

-   Encode counted quantities.
-   Support batch counting by location.
-   Validate required fields.
-   Save and synchronize counts to a central database.

### Example shown in the infographic

  Item          Location     Physical quantity
  ------------- ---------- -------------------
  T-Shirts      Aisle 1                    120
  Jeans         Aisle 2                     85
  Shoes         Aisle 3                     60
  Bags          Aisle 4                     42
  Accessories   Aisle 5                     25

These are illustrative values displayed in the infographic.

### Process flow

1.  Review the scanned item and location.
2.  Enter the physical count for the item.
3.  Repeat for other items and locations.
4.  Use batch counting by location when appropriate.
5.  Validate required fields before saving.
6.  Save the count and synchronize it to the central database.

### Output

Saved physical count records that can be matched against system
inventory.

### Important distinction

The physical count is the quantity found during the inventory activity.
It is not automatically the same as the quantity recorded in the ERP
system. The next stage compares the two.

## 4. Stage 3 --- Analyze & Reconcile: Compare with System

### Purpose

Compare physical count data collected through iSCAN with the inventory
quantities recorded in Odoo ERP, identify differences, and support
review of those differences.

### Key activities

-   Match physical counts with system inventory.
-   Identify variances, including shortages and overages.
-   Review and analyze discrepancies.
-   Support an approval workflow when required.

### Core concepts

-   **System quantity:** The quantity recorded in the inventory system.
-   **Counted quantity:** The quantity physically counted and recorded
    through iSCAN.
-   **Variance:** The difference between the counted quantity and the
    system quantity.

The examples in the infographic use this calculation:

**Variance = Counted Quantity − System Quantity**

Under this convention: - A **negative variance** means the physical
count is lower than the system quantity (a shortage). - A **positive
variance** means the physical count is higher than the system quantity
(an overage). - A **zero variance** means the physical count matches the
system quantity.

### Example reconciliation table from the infographic

  ------------------------------------------------------------------------------
  Item          System quantity         Counted        Variance Interpretation
                                       quantity                 
  ------------- --------------- --------------- --------------- ----------------
  T-Shirts                  120             120               0 Matches

  Jeans                      80              78              -2 Shortage of 2

  Shoes                      60              60               0 Matches

  Bags                       40              42              +2 Overage of 2

  Accessories                25              25               0 Matches
  ------------------------------------------------------------------------------

### Process flow

1.  Retrieve or reference the corresponding system inventory quantities.
2.  Match the physical count records to the correct inventory items and
    locations.
3.  Compare each counted quantity with its system quantity.
4.  Calculate the variance for each matched item.
5.  Identify shortages, overages, and exact matches.
6.  Review discrepancies and investigate their causes.
7.  Route variances for approval if the organization's process requires
    it.

### Output

A reconciled dataset showing system quantity, counted quantity, and
variance, with discrepancies identified for review.

### Control point

A variance is a finding, not necessarily authorization to change
inventory. The infographic indicates that an approval workflow may be
supported when required. Inventory changes should follow the
organization's authorization policy.

## 5. Stage 4 --- Generate Reports: Inventory Record Accuracy (IRA)

### Purpose

Turn the reconciliation results into reports that help stakeholders
understand inventory accuracy, discrepancies, and the details supporting
proposed adjustments.

### Key activities

-   Generate an **Inventory Record Accuracy (IRA)** report.
-   Provide variance analysis and summaries.
-   Export reports to Excel or PDF.
-   Include item-level details.
-   Provide an audit trail and supporting reports.

### Report contents shown in the infographic

The sample report highlights: - Total items counted. - Items with
variance. - Accuracy rate. - Variance breakdown.

The sample also depicts charts, including a bar chart and a pie chart,
to summarize inventory results.

### Process flow

1.  Use the reconciled count data as the reporting source.
2.  Summarize the inventory items counted.
3.  Identify how many items have a variance.
4.  Calculate or present the inventory accuracy rate.
5.  Break down variances for review.
6.  Include item-level detail and supporting audit information.
7.  Export the report to Excel or PDF as needed.

### Output

An inventory report that supports operational review, decision-making,
approval, and audit documentation.

### Reporting note

The infographic does not define the precise formula for the IRA accuracy
rate, the treatment of partial counts, or the reporting filters. Those
definitions should be agreed upon before implementation so that the
metric is calculated consistently.

## 6. Stage 5 --- Post Adjustments to ERP (If Approved)

### Purpose

Apply authorized inventory corrections to Odoo ERP so that system
balances reflect the approved reconciliation outcome.

### Key activities

-   Upload or post approved adjustments to Odoo.
-   Update inventory balances.
-   Maintain a complete audit trail.
-   Close the inventory reconciliation process.

### Process flow

1.  Review the reconciliation results and supporting report.
2.  Obtain the required approval for proposed inventory adjustments.
3.  Prepare the approved adjustment data for posting.
4.  Upload or post the approved adjustments to Odoo ERP.
5.  Confirm that the relevant inventory balances have been updated.
6.  Preserve the audit trail and supporting records.
7.  Close the reconciliation process after the required checks are
    complete.

### Example Odoo adjustment screen

The infographic depicts an Odoo inventory adjustment interface with
product, location, quantity, and status columns. Example entries include
T-Shirts, Jeans, Shoes, Bags, and Accessories, with statuses shown as
**Posted**.

### Output

Approved inventory adjustments reflected in Odoo, with a record of the
action and the reconciliation process closed.

### Important control

This stage is explicitly conditional: adjustments are posted **if
approved**. The infographic does not establish the exact Odoo
integration method, API behavior, posting permissions, error handling,
or rollback procedure.

## 7. End-to-End Workflow and Handoffs

  ------------------------------------------------------------------------------
  Stage          Main input       Main action    Main output    Handoff to
  -------------- ---------------- -------------- -------------- ----------------
  1\. Scan Items Physical items   Scan and       Captured       Count recording
                 and their        capture item,  inventory      
                 barcodes         location, and  details        
                                  quantity                      
                                  details                       

  2\. Record     Captured item    Encode,        Saved physical Reconciliation
  Counts         details          validate,      count records  
                                  save, and                     
                                  synchronize                   
                                  physical                      
                                  counts                        

  3\. Analyze &  Physical counts  Match records  Reconciled     Reporting and
  Reconcile      and Odoo system  and calculate  quantities and review
                 quantities       variances      discrepancy    
                                                 list           

  4\. Generate   Reconciliation   Summarize      IRA report and Approval and
  Reports        results          accuracy and   supporting     adjustment
                                  variances;     details        
                                  export reports                

  5\. Post       Approved         Post           Updated ERP    Process closure
  Adjustments    adjustment data  corrections to inventory and  
                                  Odoo and       audit trail    
                                  verify updated                
                                  balances                      
  ------------------------------------------------------------------------------

## 8. Key Benefits

The infographic identifies four principal benefits:

### Accurate

Improves inventory record accuracy by comparing physical counts with
system records and identifying discrepancies.

### Timely

Supports faster reconciliation and reporting by organizing scanning,
count recording, comparison, and reporting into a connected workflow.

### Controlled

Helps ensure data integrity and accountability through validation,
variance review, approval where required, and audit trails.

### Integrated

Provides a connection with Odoo ERP so approved inventory adjustments
can be posted and inventory balances updated.

## 9. Data and Control Considerations

The infographic establishes the overall workflow but does not provide a
full technical specification. The following details should be defined
during implementation:

-   **Item matching:** How barcodes, product identifiers, and locations
    are matched to Odoo records.
-   **Location handling:** Whether counts are tracked by warehouse,
    aisle, bin, or another location hierarchy.
-   **Duplicate scans:** How repeated scans of the same item are
    detected or handled.
-   **Offline operation:** How offline counts are stored, synchronized,
    and resolved if conflicting edits occur.
-   **Count validation:** Which fields are mandatory and which quantity
    values are permitted.
-   **Variance policy:** What variance thresholds require investigation
    or approval.
-   **Approval workflow:** Who can review, approve, reject, or return an
    adjustment for recounting.
-   **IRA formula:** The agreed definition and calculation of the
    accuracy rate.
-   **Odoo integration:** The method for submitting adjustments and
    receiving success or failure results.
-   **Audit trail:** Which user, timestamp, source count, approval, and
    posting details are retained.
-   **Error handling:** How failed synchronization or ERP posting is
    retried without creating duplicate adjustments.
-   **Process closure:** What checks must pass before the reconciliation
    is considered complete.

These are implementation considerations, not additional features
confirmed by the infographic.

## 10. Plain-Language Summary

iSCAN digitizes the physical inventory process. Staff scan items with a
mobile device and record the quantities they find. The system's physical
count data is then compared with Odoo's recorded quantities. Differences
are identified as shortages or overages and reviewed. The results are
summarized in an Inventory Record Accuracy report, which can be exported
to Excel or PDF. Once any required approvals are obtained, approved
adjustments are posted to Odoo, inventory balances are updated, and the
reconciliation is closed.

**Core principle:** Count first, compare and investigate, report the
findings, then post only approved adjustments.

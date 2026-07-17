import ExcelJS from "exceljs";
import { User } from "../models/user.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Setting } from "../models/setting.js";

export const exportPatients = asyncHandler(async (req, res) => {
    const patients = await User.find({ role: "patient" })
        .select("-password")
        .sort({ createdAt: -1 });

    const setting = await Setting.findOne();
    const clinicName = setting?.name || "PhysioCare";

    const workbook = new ExcelJS.Workbook();
    workbook.creator = clinicName;
    workbook.lastModifiedBy = "Admin";
    workbook.created = new Date();
    workbook.modified = new Date();

    const worksheet = workbook.addWorksheet("Patients");

    // Configure individual columns directly to avoid ExcelJS duplicate headers side effects
    worksheet.getColumn(1).width = 8;   // No.
    worksheet.getColumn(2).width = 25;  // Name
    worksheet.getColumn(3).width = 35;  // Email
    worksheet.getColumn(4).width = 18;  // Phone
    worksheet.getColumn(5).width = 10;  // Age
    worksheet.getColumn(6).width = 15;  // Gender
    worksheet.getColumn(7).width = 20;  // Registered On

    // Centered titles layout
    worksheet.mergeCells("A1:G1");
    const titleCell = worksheet.getCell("A1");
    titleCell.value = clinicName;
    titleCell.font = {
        name: "Calibri",
        size: 20,
        bold: true,
        color: { argb: "1E293B" }, // Slate-800
    };
    titleCell.alignment = {
        horizontal: "center",
        vertical: "middle",
    };
    worksheet.getRow(1).height = 35;

    worksheet.mergeCells("A2:G2");
    const reportTitle = worksheet.getCell("A2");
    reportTitle.value = "Patient Registry Directory";
    reportTitle.font = {
        name: "Calibri",
        size: 13,
        bold: true,
        color: { argb: "475569" }, // Slate-600
    };
    reportTitle.alignment = {
        horizontal: "center",
        vertical: "middle",
    };
    worksheet.getRow(2).height = 25;

    // Generated Metadata
    worksheet.getCell("A4").value = `Generated On: ${new Date().toLocaleString()}`;
    worksheet.getCell("A4").font = { name: "Calibri", size: 10, italic: true, color: { argb: "64748B" } };

    worksheet.getCell("G4").value = `Total Patients: ${patients.length}`;
    worksheet.getCell("G4").font = { name: "Calibri", size: 11, bold: true, color: { argb: "0F172A" } };
    worksheet.getCell("G4").alignment = { horizontal: "right" };

    // Header Table Row
    const headerRow = worksheet.getRow(6);
    headerRow.values = [
        "No.",
        "Name",
        "Email",
        "Phone",
        "Age",
        "Gender",
        "Registered On",
    ];
    headerRow.height = 26;
    headerRow.font = {
        name: "Calibri",
        bold: true,
        color: { argb: "FFFFFFFF" },
    };
    headerRow.alignment = {
        horizontal: "center",
        vertical: "middle",
    };
    headerRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "2563EB" }, // Primary HSL theme blue
    };

    const thinBorder = {
        top: { style: "thin", color: { argb: "E2E8F0" } }, // Light slate grey borders
        left: { style: "thin", color: { argb: "E2E8F0" } },
        bottom: { style: "thin", color: { argb: "E2E8F0" } },
        right: { style: "thin", color: { argb: "E2E8F0" } },
    };

    headerRow.eachCell((cell) => {
        cell.border = thinBorder;
    });

    // Populate patient records
    patients.forEach((patient, index) => {
        const row = worksheet.addRow([
            index + 1,
            patient.name,
            patient.email,
            patient.phone || "-",
            patient.age || "-",
            patient.gender || "-",
            patient.createdAt ? new Date(patient.createdAt).toLocaleDateString() : "-",
        ]);

        row.height = 22;

        row.eachCell((cell, colNumber) => {
            cell.font = {
                name: "Calibri",
                size: 11,
            };
            cell.border = thinBorder;
            
            // Align text left for name/email, center for metadata/numbers
            cell.alignment = {
                vertical: "middle",
                horizontal: colNumber === 2 || colNumber === 3 ? "left" : "center",
            };
        });

        // Alternating row background fill (zebra striping)
        if (index % 2 === 1) {
            row.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "F8FAFC" }, // Slate-50 background tint
            };
        }
    });

    // Freeze headers row
    worksheet.views = [
        {
            state: "frozen",
            ySplit: 6,
        },
    ];

    worksheet.autoFilter = {
        from: "A6",
        to: "G6",
    };

    worksheet.pageSetup = {
        orientation: "landscape",
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 0,
    };

    worksheet.pageSetup.margins = {
        left: 0.5,
        right: 0.5,
        top: 0.75,
        bottom: 0.75,
        header: 0.3,
        footer: 0.3,
    };

    // Sanitize clinic name for Content-Disposition header filename safety
    const sanitizedName = clinicName.replace(/[^a-zA-Z0-9]/g, "_");

    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
        "Content-Disposition",
        `attachment; filename="${sanitizedName}_Patients.xlsx"`
    );

    await workbook.xlsx.write(res);
    res.end();
});
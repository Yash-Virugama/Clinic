import { useState, useEffect } from "react";
import api from "../../../api/axios";
import toast from "react-hot-toast";

const useClinicReport = () => {
  const [reportData, setReportData] = useState({
    totalPatients: 0,
    totalCases: 0,
    totalAppointments: 0,
    netRevenue: 0,
    outstanding: 0,
    caseStatus: { active: 0, closed: 0, suspended: 0 },
    appointmentCompletion: { completed: 0, missed: 0, cancelled: 0, scheduled: 0 },
    locationPreferences: { clinic: 0, home: 0, online: 0 },
    outstandingPayments: [],
    therapistPerformance: [],
    todayVisits: { completed: 0, scheduled: 0, cancelled: 0, total: 0 },
  });
  const [loading, setLoading] = useState(true);

  const fetchReportData = async (option = "this month", customStart = null, customEnd = null) => {
    try {
      setLoading(true);
      const [patientsRes, casesRes, appointmentsRes, visitsRes] = await Promise.all([
        api.get("/clinic/patients"),
        api.get("/clinic/cases"),
        api.get("/clinic/appointments"),
        api.get("/clinic/visits"),
      ]);

      const patients = patientsRes.data || [];
      const cases = casesRes.data || [];
      const appointments = appointmentsRes.data || [];
      const visits = visitsRes.data || [];

      // Determine date range limits
      const now = new Date();
      let startDate = new Date(0); // default far past
      let endDate = new Date(2100, 0, 1); // default far future

      switch (option) {
        case "today":
          startDate = new Date();
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date();
          endDate.setHours(23, 59, 59, 999);
          break;
        case "this week":
          const day = now.getDay();
          startDate = new Date(now);
          startDate.setDate(now.getDate() - day);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(now);
          endDate.setHours(23, 59, 59, 999);
          break;
        case "this month":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
          endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
          break;
        case "last month":
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
          endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
          break;
        case "this year":
          startDate = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
          endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
          break;
        case "custom":
          if (customStart) {
            startDate = new Date(customStart);
            startDate.setHours(0, 0, 0, 0);
          }
          if (customEnd) {
            endDate = new Date(customEnd);
            endDate.setHours(23, 59, 59, 999);
          }
          break;
      }

      // Filter patients by createdAt
      const filteredPatients = patients.filter((p) => {
        const d = new Date(p.createdAt);
        return d >= startDate && d <= endDate;
      });

      // Filter cases by createdAt
      const filteredCases = cases.filter((c) => {
        const d = new Date(c.createdAt);
        return d >= startDate && d <= endDate;
      });

      // Filter appointments by date
      const filteredAppointments = appointments.filter((a) => {
        const d = new Date(a.date);
        return d >= startDate && d <= endDate;
      });

      // Filter visits by visitDate
      const filteredVisits = visits.filter((v) => {
        if (!v.visitDate) return false;
        const d = new Date(v.visitDate);
        return d >= startDate && d <= endDate;
      });

      // Calculate Case Status Outlines
      const activeCases = filteredCases.filter((c) => c.status?.toLowerCase() === "active").length;
      const closedCases = filteredCases.filter((c) => c.status?.toLowerCase() === "closed").length;
      const suspendedCases = filteredCases.filter((c) => c.status?.toLowerCase() === "suspended").length;

      // Calculate Completion Ratios
      const completed = filteredAppointments.filter((a) => a.status === "complete").length;
      const missed = filteredAppointments.filter((a) => a.status === "missed").length;
      const cancelled = filteredAppointments.filter((a) => a.status === "cancel").length;
      const scheduled = filteredAppointments.filter((a) => a.status === "scheduled").length;

      // Calculate Location Preferences
      const clinic = filteredAppointments.filter((a) => a.location === "clinic").length;
      const home = filteredAppointments.filter((a) => a.location === "home").length;
      const online = filteredAppointments.filter((a) => a.location === "online").length;

      // Calculate Financials and Outstanding Payments per Case based on filteredVisits
      let netRevenue = 0;
      let outstanding = 0;
      const casePaymentsMap = {};

      filteredVisits.forEach((v) => {
        const amt = v.paymentAmount || 0;
        if (v.paymentStatus === "Paid") {
          netRevenue += amt;
        } else {
          outstanding += amt;
        }

        if (v.clinicCase) {
          const caseId = v.clinicCase._id || v.clinicCase;
          if (!casePaymentsMap[caseId]) {
            casePaymentsMap[caseId] = {
              caseId,
              caseName: v.clinicCase.title || "General",
              patientName: v.clinicCase.patient?.name || "Unknown Patient",
              paid: 0,
              unpaid: 0,
            };
          }
          if (v.paymentStatus === "Paid") {
            casePaymentsMap[caseId].paid += amt;
          } else {
            casePaymentsMap[caseId].unpaid += amt;
          }
        }
      });

      const outstandingPayments = Object.values(casePaymentsMap)
        .filter((item) => item.unpaid > 0)
        .map((item) => ({
          patientName: item.patientName,
          caseName: item.caseName,
          totalFee: item.paid + item.unpaid,
          paid: item.paid,
          unpaid: item.unpaid,
        }));

      // Calculate Today's Visits (matching local today)
      const todayDateStr = new Date().toDateString();
      const todayVisitsList = visits.filter((v) => {
        if (!v.visitDate) return false;
        return new Date(v.visitDate).toDateString() === todayDateStr;
      });

      const todayCompleted = todayVisitsList.filter((v) => v.status === "Completed").length;
      const todayScheduled = todayVisitsList.filter((v) => v.status === "Scheduled").length;
      const todayCancelled = todayVisitsList.filter((v) => v.status === "Cancelled").length;
      const todayTotal = todayVisitsList.length;

      // Calculate Therapist Performance based on filteredVisits
      const therapistMap = {};
      filteredVisits.forEach((v) => {
        const amt = v.paymentAmount || 0;
        const therapistId = v.therapist?._id || v.therapist || "unassigned";
        const therapistName = v.therapist?.name || "Unassigned Therapist";

        if (!therapistMap[therapistId]) {
          therapistMap[therapistId] = {
            therapistName,
            totalVisits: 0,
            completedVisits: 0,
            patientIds: new Set(),
            revenue: 0,
            outstanding: 0,
          };
        }

        therapistMap[therapistId].totalVisits += 1;
        if (v.status === "Completed") {
          therapistMap[therapistId].completedVisits += 1;
        }

        const patientId = v.clinicCase?.patient?._id || v.clinicCase?.patient;
        if (patientId) {
          therapistMap[therapistId].patientIds.add(patientId.toString());
        }

        if (v.paymentStatus === "Paid") {
          therapistMap[therapistId].revenue += amt;
        } else {
          therapistMap[therapistId].outstanding += amt;
        }
      });

      const therapistPerformance = Object.values(therapistMap)
        .map((item) => ({
          therapistName: item.therapistName,
          totalVisits: item.totalVisits,
          completedVisits: item.completedVisits,
          uniquePatients: item.patientIds.size,
          revenue: item.revenue,
          outstanding: item.outstanding,
        }))
        .sort((a, b) => b.totalVisits - a.totalVisits);

      setReportData({
        totalPatients: filteredPatients.length,
        totalCases: filteredCases.length,
        totalAppointments: filteredAppointments.length,
        netRevenue,
        outstanding,
        caseStatus: { active: activeCases, closed: closedCases, suspended: suspendedCases },
        appointmentCompletion: { completed, missed, cancelled, scheduled },
        locationPreferences: { clinic, home, online },
        outstandingPayments,
        therapistPerformance,
        todayVisits: {
          completed: todayCompleted,
          scheduled: todayScheduled,
          cancelled: todayCancelled,
          total: todayTotal,
        },
      });
    } catch (error) {
      console.error("Failed to load clinic report statistics:", error);
      if (error.response?.status !== 401 && error.response?.status !== 403) {
        toast.error("Failed to compile clinic performance reports");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData("this month");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    reportData,
    loading,
    fetchReportData,
  };
};

export default useClinicReport;

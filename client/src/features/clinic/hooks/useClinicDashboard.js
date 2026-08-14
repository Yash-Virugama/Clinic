import { useState, useEffect } from "react";
import api from "../../../api/axios";
import toast from "react-hot-toast";

const useClinicDashboard = () => {
  const [metrics, setMetrics] = useState({
    visitsTomorrow: 0,
    visitsToday: 0,
    appointmentsToday: 0,
    unpaidPayments: "₹0.00",
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
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

      // Determine today's local date string matching database dates
      const todayStr = new Date().toDateString();
      const todayAppointments = appointments.filter((app) => {
        return new Date(app.date).toDateString() === todayStr;
      });

      const todayVisits = visits.filter((v) => {
        if (!v.visitDate) return false;
        return new Date(v.visitDate).toDateString() === todayStr;
      });

      // Tomorrow's appointments (sessions)
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toDateString();
      const tomorrowAppointments = appointments.filter((app) => {
        if (!app.date) return false;
        return new Date(app.date).toDateString() === tomorrowStr;
      });

      // Filter upcoming scheduled sessions (limit to top 5, today onwards)
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const upcoming = appointments
        .filter((app) => {
          const isScheduled = app.status === "scheduled" || app.status === "Scheduled";
          if (!isScheduled) return false;
          if (!app.date) return false;
          const appDate = new Date(app.date);
          appDate.setHours(0, 0, 0, 0);
          return appDate >= todayStart;
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      // Group visits by case to calculate unpaid payments incorporating discounts
      const casesObjMap = {};
      cases.forEach((c) => {
        casesObjMap[c._id.toString()] = {
          discountAmount: c.discountAmount || 0,
          discountType: c.discountType || "",
          subtotal: 0,
          paid: 0,
        };
      });

      visits.forEach((v) => {
        const caseId = v.clinicCase ? (v.clinicCase._id || v.clinicCase).toString() : null;
        if (caseId && casesObjMap[caseId]) {
          casesObjMap[caseId].subtotal += v.paymentAmount || 0;
          if (v.paymentStatus === "Paid") {
            casesObjMap[caseId].paid += v.paymentAmount || 0;
          }
        }
      });

      let unpaidSum = 0;
      Object.values(casesObjMap).forEach((cData) => {
        let calculatedDiscount = 0;
        if (cData.discountType === "percentage") {
          calculatedDiscount = (cData.subtotal * cData.discountAmount) / 100;
        } else if (cData.discountType === "rupee") {
          calculatedDiscount = cData.discountAmount;
        }
        calculatedDiscount = Math.min(calculatedDiscount, cData.subtotal);
        const caseGrandTotal = cData.subtotal - calculatedDiscount;
        const caseRemaining = Math.max(0, caseGrandTotal - cData.paid);
        unpaidSum += caseRemaining;
      });

      // Add any unpaid amount for visits that are not associated with any active case
      visits.forEach((v) => {
        const caseId = v.clinicCase ? (v.clinicCase._id || v.clinicCase).toString() : null;
        if ((!caseId || !casesObjMap[caseId]) && v.paymentStatus !== "Paid") {
          unpaidSum += (v.paymentAmount || 0);
        }
      });

      // Get recent 10 unique patients based on completed visits only (excluding future visits)
      const now = new Date();
      const completedVisits = visits.filter((v) => {
        const isCompleted =
          v.status === "Completed" ||
          v.status === "completed" ||
          v.status === "Complete" ||
          v.status === "complete";
        if (!isCompleted) return false;
        if (!v.visitDate) return false;

        const visitDateTime = new Date(v.visitDate);
        if (v.visitTime) {
          const [hours, minutes] = v.visitTime.split(":");
          if (hours && minutes) {
            visitDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
          }
        }
        return visitDateTime <= now;
      });

      const sortedVisits = [...completedVisits].sort((a, b) => {
        const dateA = new Date(a.visitDate);
        const dateB = new Date(b.visitDate);
        if (dateA.getTime() !== dateB.getTime()) {
          return dateB - dateA;
        }
        return (b.visitTime || "").localeCompare(a.visitTime || "");
      });

      const recentPatientsMap = new Map();
      sortedVisits.forEach((v) => {
        const patientRaw = v.clinicCase?.patient;
        if (patientRaw) {
          const patientId = patientRaw._id || patientRaw;
          const patientIdStr = patientId.toString();

          // Look up patient object from preloaded patients list as a fallback
          const patientObj = patients.find(
            (p) => (p._id || p).toString() === patientIdStr
          );

          if (patientObj) {
            if (!recentPatientsMap.has(patientIdStr)) {
              recentPatientsMap.set(patientIdStr, {
                _id: patientIdStr,
                name: patientObj.name || "Unknown Patient",
                phone: patientObj.phone || "—",
                lastVisitDate: v.visitDate,
                lastVisitTime: v.visitTime,
              });
            }
          }
        }
      });
      const recent = Array.from(recentPatientsMap.values()).slice(0, 10);

      setMetrics({
        visitsTomorrow: tomorrowAppointments.length,
        visitsToday: todayVisits.length,
        appointmentsToday: todayAppointments.length,
        unpaidPayments: `₹${unpaidSum.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      });

      setUpcomingAppointments(upcoming);
      setRecentPatients(recent);
    } catch (error) {
      console.error("Failed to load clinic dashboard metrics:", error);
      // Suppress toast notifications for unauthorized loads before login redirects
      if (error.response?.status !== 401 && error.response?.status !== 403) {
        toast.error("Failed to load clinic workspace metrics");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    metrics,
    upcomingAppointments,
    recentPatients,
    loading,
    fetchDashboardData,
  };
};

export default useClinicDashboard;

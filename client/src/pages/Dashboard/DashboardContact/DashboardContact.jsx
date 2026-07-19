import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../../api/axios";
import { Link } from "react-router-dom";

const DashboardContact = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchContactHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get("/contact/my-history");
      setContacts(res.data.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch contact history."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactHistory();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "replied":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 border border-rose-200 text-rose-600">
            <span className="w-1 h-1 rounded-full bg-rose-500 animate-ping" />
            Replied
          </span>
        );
      case "read":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 border border-amber-200 text-amber-600">
            Read
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 border border-emerald-200 text-emerald-600 animate-pulse">
            Received
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-76.71px-64px)] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-bold uppercase tracking-widest text-slate-450 font-accent">
          Loading conversation history...
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 text-left">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="inline-block text-primary text-[10px] font-bold tracking-wider uppercase mb-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 font-accent">
            Communication Log
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-secondary font-heading leading-tight">
            Contact History
          </h2>
          <p className="text-xs text-text-muted font-body mt-0.5">
            View your clinical check-ins, queries, and direct replies from our specialists.
          </p>
        </div>

        <Link
          to="/contact"
          className="shrink-0 self-start px-5 py-3 rounded-2xl bg-primary hover:bg-primary/95 text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-premium cursor-pointer text-center"
        >
          Send New Message
        </Link>
      </div>

      {/* Main Conversation Logs */}
      {contacts.length === 0 ? (
        <div className="bg-white border border-slate-200/70 rounded-[32px] p-10 sm:p-16 text-center shadow-sm max-w-2xl mx-auto w-full mt-4">
          <span className="text-4xl block mb-3">💬</span>
          <h3 className="text-sm font-bold text-secondary font-heading uppercase tracking-wider mb-2">No Messages Found</h3>
          <p className="text-xs text-text-muted font-body leading-relaxed max-w-sm mx-auto mb-6">
            You haven't submitted any enquiries or messages yet. If you have clinical questions, reach out to our team.
          </p>
          <Link
            to="/contact"
            className="inline-block px-6 py-3 rounded-2xl border border-primary text-primary hover:bg-primary/5 text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Contact Clinic
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6 max-w-4xl">
          {contacts.map((item) => (
            <div
              key={item._id}
              className="bg-white border border-slate-200/70 rounded-[28px] p-5 sm:p-6 shadow-sm flex flex-col gap-5 hover:border-primary/15 transition-premium"
            >
              {/* Card Header metadata */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-slate-450 font-body">
                    Inquiry Subject
                  </span>
                  <span className="text-sm font-bold text-secondary font-heading leading-snug">
                    {item.subject}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  {getStatusBadge(item.status)}
                  <span className="text-[10px] text-slate-405 font-accent">
                    {new Date(item.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Message thread bubbles */}
              <div className="flex flex-col gap-4">
                {/* User original inquiry message */}
                <div className="flex flex-col gap-1.5 self-end max-w-[85%] text-right">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 font-heading">
                    Your Message
                  </span>
                  <div className="bg-primary/5 text-secondary border border-primary/10 rounded-2xl rounded-tr-none px-4 py-3 text-xs sm:text-sm font-body leading-relaxed text-left select-text">
                    {item.message}
                  </div>
                </div>

                {/* Admin Reply bubble if exists */}
                {item.replyMessage && (
                  <div className="flex flex-col gap-1.5 self-start max-w-[85%]">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 font-heading flex items-center gap-1">
                      <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                      Response from Clinic Staff
                    </span>
                    <div className="bg-emerald-50 text-emerald-950 border border-emerald-100 rounded-2xl rounded-tl-none px-4 py-3 text-xs sm:text-sm font-body leading-relaxed select-text shadow-sm">
                      {item.replyMessage}
                    </div>
                    <span className="text-[9px] text-slate-400 font-accent pl-1">
                      Replied on {new Date(item.repliedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardContact;

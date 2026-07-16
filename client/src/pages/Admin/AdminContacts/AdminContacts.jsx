import "./AdminContacts.css";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import api from "../../../api/axios";
import useAdminContacts from "../../../hooks/useAdminContacts";
import CustomSelect from "../../../components/CustomSelect/CustomSelect";
import CustomConfirmModal from "../../../components/CustomConfirmModal/CustomConfirmModal";

const AdminContacts = () => {
  const { contacts, loading, fetchContacts } = useAdminContacts();
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [contactsPerPage, setContactsPerPage] = useState(
    window.innerWidth < 768 ? 5 : 6
  );

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleResize = () => {
      setContactsPerPage(window.innerWidth < 768 ? 5 : 6);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [filteredContacts.length, contactsPerPage, currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);
  const displayedContacts = filteredContacts.slice(
    (currentPage - 1) * contactsPerPage,
    currentPage * contactsPerPage
  );

  const handleStatus = async (id, status) => {
    try {
      await api.patch(`/contact/${id}/status`, { status });
      toast.success("Inquiry status updated successfully.");
      fetchContacts();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update status."
      );
    }
  };

  const handleDelete = (id) => {
    setDeleteConfirmId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;

    try {
      await api.delete(`/contact/${deleteConfirmId}`);
      toast.success("Contact inquiry deleted.");
      fetchContacts();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete contact."
      );
    } finally {
      setDeleteConfirmId(null);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-76.71px-64px)] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-bold uppercase tracking-widest text-slate-450 font-accent">
          Loading contact records...
        </span>
      </div>
    );
  }

  const statusOptions = [
    { value: "new", label: "New" },
    { value: "read", label: "Read" },
    { value: "replied", label: "Replied" },
  ];

  return (
    <>
      <div className="flex flex-col gap-8 text-left relative">
        {/* Page Header */}
        <div>
          <span className="inline-block text-primary text-[10px] font-bold tracking-wider uppercase mb-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 font-accent animate-pulse">
            Clinic Messages
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-secondary font-heading leading-tight">
            Inbound Inquiries
          </h2>
          <p className="text-xs text-text-muted font-body mt-0.5">
            Review patient contact submissions, manage message read states, and prune records.
          </p>
        </div>

        {contacts.length === 0 ? (
          <div className="bg-white border border-slate-200/60 rounded-[32px] p-12 text-center shadow-sm">
            <svg className="w-12 h-12 text-slate-300 mx-auto stroke-[1.5] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25 2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            <span className="text-sm font-bold text-secondary block font-heading mb-1">No messages found</span>
            <p className="text-xs text-text-muted max-w-xs mx-auto">All customer contact inquiries will compile here for review.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Actions Row with Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 pl-10 rounded-xl border border-slate-200/80 bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-secondary text-xs font-medium transition-all shadow-sm"
                />
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg className="w-4 h-4 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-secondary text-[10px] font-bold uppercase tracking-wider font-accent cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {filteredContacts.length === 0 ? (
              <div className="bg-white border border-slate-200/60 rounded-[32px] p-12 text-center shadow-sm">
                <span className="text-sm font-bold text-secondary block font-heading mb-1">No messages match your search</span>
                <p className="text-xs text-text-muted max-w-xs mx-auto">Try adjusting your keywords to locate the message.</p>
              </div>
            ) : (
              <>
                {/* Grid of modern inbox cards (No Tables) */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 z-10">
                  {displayedContacts.map((contact) => (
                    <div
                      key={contact._id}
                      className="bg-white border border-slate-200/60 rounded-[32px] p-6 shadow-lg flex flex-col justify-between gap-6 hover:shadow-md hover:border-slate-300/80 transition-all duration-300 relative overflow-visible"
                    >
                      {/* Header: Sender details and Status select */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          {contact.userImage ? (
                            <img
                              src={contact.userImage}
                              alt={contact.name}
                              className="w-10 h-10 rounded-2xl object-cover border border-slate-200/60 shadow-inner bg-slate-50 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/10 flex items-center justify-center font-bold text-sm text-primary shadow-inner shrink-0 font-heading">
                              {contact.name ? contact.name.charAt(0).toUpperCase() : "M"}
                            </div>
                          )}
                          <div className="min-w-0">
                            <span className="text-sm font-bold text-secondary block font-heading truncate">
                              {contact.name}
                            </span>
                            <span className="text-xs text-text-muted font-body block truncate">
                              {contact.email}
                            </span>
                          </div>
                        </div>

                        {/* Custom Status Dropdown Picker */}
                        <div className="relative shrink-0 w-28">
                          <CustomSelect
                            value={contact.status}
                            onChange={(value) => handleStatus(contact._id, value)}
                            options={statusOptions}
                            placeholder="Status"
                            theme="dark"
                          />
                        </div>
                      </div>

                      {/* Message Details */}
                      <div className="flex flex-col gap-2 min-w-0 text-left">
                        <span className="text-xs font-bold text-secondary font-heading block truncate">
                          {contact.subject}
                        </span>
                        <p className="text-xs text-text-muted leading-relaxed line-clamp-3">
                          "{contact.message}"
                        </p>
                      </div>

                      {/* Footer: Date and Action controls */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                        <span className="text-[10px] font-bold text-slate-400 font-accent uppercase tracking-wider block">
                          {new Date(contact.createdAt).toLocaleDateString()}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedContact(contact)}
                            title="View Message Details"
                            style={{ cursor: "pointer" }}
                            className="p-2 rounded-xl border border-slate-200/80 bg-text-light hover:bg-primary text-primary hover:text-text-light transition-colors cursor-pointer shadow-sm"
                          >
                            <svg className="w-4 h-4 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </button>

                          <button
                            onClick={() => handleDelete(contact._id)}
                            title="Delete Message Inquiry"
                            style={{ cursor: "pointer" }}
                            className="p-2 rounded-xl border border-slate-200/80 bg-text-light hover:bg-primary text-primary hover:text-text-light transition-colors cursor-pointer shadow-sm"
                          >
                            <svg className="w-4 h-4 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8 z-20 relative">
                    {/* Prev Button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex items-center justify-center w-9 h-9 rounded-lg border border-secondary/10 bg-white text-secondary transition-premium shadow-sm cursor-pointer hover:border-primary hover:text-primary hover:shadow-md disabled:opacity-40 disabled:pointer-events-none disabled:shadow-none"
                      aria-label="Previous page"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-9 h-9 font-accent font-bold text-xs rounded-lg transition-premium cursor-pointer border flex items-center justify-center ${currentPage === page
                          ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                          : "bg-white text-secondary border-secondary/10 hover:border-primary hover:text-primary hover:shadow-md"
                          }`}
                      >
                        {page}
                      </button>
                    ))}

                    {/* Next Button */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="flex items-center justify-center w-9 h-9 rounded-lg border border-secondary/10 bg-white text-secondary transition-premium shadow-sm cursor-pointer hover:border-primary hover:text-primary hover:shadow-md disabled:opacity-40 disabled:pointer-events-none disabled:shadow-none"
                      aria-label="Next page"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Details View Modal */}
        {selectedContact && createPortal(
          <>
            {/* Backdrop Blur Overlay */}
            <div
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[90] animate-fade-in"
              onClick={() => setSelectedContact(null)}
              style={{ cursor: "pointer" }}
            />

            {/* Centered Modal Card */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/95 border border-slate-200/60 backdrop-blur-md rounded-[32px] p-6 sm:p-8 shadow-2xl w-[calc(100%-2rem)] sm:w-full sm:max-w-lg h-[480px] max-h-[80vh] flex flex-col justify-between z-[100] animate-page-entrance text-left">

              {/* Header (Fixed) */}
              <div className="shrink-0 pb-4 border-b border-slate-100">
                {/* <span className="text-[10px] font-accent font-bold uppercase tracking-widest text-primary block mb-0.5">Inquiry Details</span> */}
                <h3 className="text-lg font-bold text-primary font-heading">
                  Message Details
                </h3>
              </div>

              {/* Scrollable Content Body */}
              <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-4 sm:gap-5 pr-1.5 no-scrollbar">
                <div className="flex flex-col sm:grid sm:grid-cols-3 gap-1 sm:gap-2 sm:items-center shrink-0">
                  <span className="text-xs font-bold text-slate-450 uppercase tracking-wider font-heading">Sender</span>
                  <span className="text-sm font-semibold text-secondary col-span-2 flex items-center gap-2">
                    {selectedContact.userImage && (
                      <img src={selectedContact.userImage} alt="" className="w-6 h-6 rounded-full object-cover border border-slate-200/60 shadow-inner" />
                    )}
                    {selectedContact.name}
                  </span>
                </div>

                <div className="flex flex-col sm:grid sm:grid-cols-3 gap-1 sm:gap-2 sm:items-center shrink-0">
                  <span className="text-xs font-bold text-slate-450 uppercase tracking-wider font-heading">Email Address</span>
                  <span className="text-sm font-semibold text-secondary col-span-2 select-all truncate">{selectedContact.email}</span>
                </div>

                <div className="flex flex-col sm:grid sm:grid-cols-3 gap-1 sm:gap-2 sm:items-center shrink-0">
                  <span className="text-xs font-bold text-slate-450 uppercase tracking-wider font-heading">Phone Line</span>
                  <span className="text-sm font-semibold text-secondary col-span-2">{selectedContact.phone || "Not provided"}</span>
                </div>

                <div className="flex flex-col sm:grid sm:grid-cols-3 gap-1 sm:gap-2 sm:items-center shrink-0">
                  <span className="text-xs font-bold text-slate-450 uppercase tracking-wider font-heading">Subject</span>
                  <span className="text-sm font-semibold text-secondary col-span-2">{selectedContact.subject}</span>
                </div>

                <div className="flex flex-col gap-2 pt-2 shrink-0">
                  <span className="text-xs font-bold text-slate-450 uppercase tracking-wider font-heading">Message Body</span>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs leading-relaxed text-secondary font-body select-text whitespace-pre-wrap">
                    {selectedContact.message}
                  </div>
                </div>
              </div>

              {/* Footer (Fixed) */}
              <div className="shrink-0 pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setSelectedContact(null)}
                  style={{ cursor: "pointer" }}
                  className="px-5 py-2.5 rounded-2xl border border-slate-200 bg-primary hover:bg-primary-hover text-text-light font-bold tracking-wider transition-colors shadow-sm cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </>,
          document.body
        )}
      </div>

      <CustomConfirmModal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Contact Inquiry"
        message="Are you sure you want to permanently delete this contact inquiry? This action cannot be undone."
      />
    </>
  );
};

export default AdminContacts;
import "./AdminTestimonials.css";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../../api/axios";
import useAdminTestimonials from "../../../hooks/useAdminTestimonials";
import CustomConfirmModal from "../../../components/CustomConfirmModal/CustomConfirmModal";

const AdminTestimonials = () => {
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const ITEMS_PER_PAGE = 10;

  const {
    testimonials,
    loading,
    fetchTestimonials,
  } = useAdminTestimonials();

  const filteredTestimonials = testimonials.filter((testimonial) =>
    testimonial.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    testimonial.treatment.toLowerCase().includes(searchQuery.toLowerCase()) ||
    testimonial.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    const totalPages = Math.ceil(filteredTestimonials.length / ITEMS_PER_PAGE);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [filteredTestimonials.length, currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  const totalPages = Math.ceil(filteredTestimonials.length / ITEMS_PER_PAGE);
  const displayedTestimonials = filteredTestimonials.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleToggleApprove = async (testimonial) => {
    if (togglingId) return;
    setTogglingId(testimonial._id);

    try {
      await api.put(`/testimonials/${testimonial._id}`, {
        approved: !testimonial.approved,
        patientName: testimonial.patientName,
        content: testimonial.content,
        rating: testimonial.rating,
        treatment: testimonial.treatment,
      });

      toast.success(
        testimonial.approved
          ? "Feedback unapproved (hidden from public view)."
          : "Feedback approved (published live successfully)."
      );
      await fetchTestimonials();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update testimonial status."
      );
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = (id) => {
    setDeleteConfirmId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;

    try {
      await api.delete(`/testimonials/${deleteConfirmId}`);
      toast.success("Testimonial deleted successfully.");
      await fetchTestimonials();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete testimonial."
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
          Loading recovery reviews...
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 text-left">
      {/* Page Header */}
      <div>
        <span className="inline-block text-primary text-[10px] font-bold tracking-wider uppercase mb-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 font-accent animate-pulse">
          Patient Feedback
        </span>
        <h2 className="text-2xl font-bold tracking-tight text-secondary font-heading leading-tight">
          Testimonial Moderation
        </h2>
        <p className="text-xs text-text-muted font-body mt-0.5">
          Approve, block, or delete patient reviews featured on the public website.
        </p>
      </div>

      {testimonials.length === 0 ? (
        <div className="bg-white border border-slate-200/60 rounded-[32px] p-12 text-center shadow-sm">
          <svg className="w-12 h-12 text-slate-300 mx-auto stroke-[1.5] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c-.107-.16-.3-.251-.512-.251-.213 0-.405.091-.512.251l-7.06 10.584c-.1.15-.102.342-.006.494.096.152.263.242.443.242h14.187c.18 0 .347-.09.443-.242.096-.152.094-.344-.006-.494l-7.06-10.584z" />
          </svg>
          <span className="text-sm font-bold text-secondary block font-heading mb-1">No testimonials found</span>
          <p className="text-xs text-text-muted max-w-xs mx-auto">Patient submissions will compile here for approval controls.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Actions Row with Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Search testimonials..."
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

          {filteredTestimonials.length === 0 ? (
            <div className="bg-white border border-slate-200/60 rounded-[32px] p-12 text-center shadow-sm">
              <span className="text-sm font-bold text-secondary block font-heading mb-1">No testimonials match your search</span>
              <p className="text-xs text-text-muted max-w-xs mx-auto">Try adjusting your keywords to locate the review.</p>
            </div>
          ) : (
            <>
              {/* 1. Desktop structured table (hidden on mobile/tablet) */}
              <div className="hidden lg:block bg-white border border-slate-200/60 rounded-[32px] overflow-hidden shadow-sm relative z-10">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-550/5 border-b border-slate-100">
                      <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-slate-500 font-heading w-64">Patient</th>
                      <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-slate-500 font-heading w-24">Rating</th>
                      <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-slate-500 font-heading w-44">Treatment</th>
                      <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-slate-500 font-heading">Quote Excerpt</th>
                      <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-slate-500 font-heading w-28 text-center">Status</th>
                      <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-slate-500 font-heading w-48 text-center">Moderation Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {displayedTestimonials.map((testimonial) => (
                  <tr key={testimonial._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {testimonial.user?.image ? (
                          <img
                            src={testimonial.user.image}
                            alt="Avatar"
                            className="w-10 h-10 rounded-2xl object-cover border border-slate-200/60 shadow-inner bg-slate-50"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200/60 flex items-center justify-center font-bold text-xs text-text-muted shadow-inner">
                            {testimonial.patientName ? testimonial.patientName.charAt(0).toUpperCase() : "P"}
                          </div>
                        )}
                        <span className="text-sm font-bold text-secondary font-heading">
                          {testimonial.patientName}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-amber-500 font-accent flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {testimonial.rating || 5}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-block bg-slate-100/80 border border-slate-200/50 text-[10px] font-bold text-slate-600 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {testimonial.treatment}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-xs text-text-muted line-clamp-2 leading-relaxed max-w-sm">
                        "{testimonial.content}"
                      </p>
                    </td>

                    <td className="px-6 py-4 text-center">
                      {testimonial.approved ? (
                        <span className="inline-block bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-600 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          Approved
                        </span>
                      ) : (
                        <span className="inline-block bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-amber-600 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          Pending
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <button
                          onClick={() => handleToggleApprove(testimonial)}
                          disabled={togglingId === testimonial._id}
                          style={{ cursor: "pointer" }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border ${testimonial.approved
                            ? "bg-slate-50 text-slate-500 border-slate-200 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200"
                            : "bg-emerald-500/10 text-emerald-600 border-emerald-500/25 hover:bg-emerald-500/20"
                            }`}
                        >
                          {togglingId === testimonial._id ? (
                            "..."
                          ) : testimonial.approved ? (
                            <span className="flex items-center gap-1">
                              <svg className="w-3.5 h-3.5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                              </svg>
                              Revoke
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <svg className="w-3.5 h-3.5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Approve
                            </span>
                          )}
                        </button>

                        <button
                          onClick={() => handleDelete(testimonial._id)}
                          title="Delete Review"
                          style={{ cursor: "pointer" }}
                          className="p-2.5 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 hover:border-slate-350 text-slate-550 hover:text-primary transition-all duration-200 cursor-pointer shadow-sm"
                        >
                          <svg className="w-4 h-4 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 2. Mobile/Tablet card-based grid (hidden on desktop) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
            {displayedTestimonials.map((testimonial) => (
              <div
                key={testimonial._id}
                className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-sm flex flex-col justify-between gap-4"
              >
                <div className="flex flex-col gap-3">
                  {/* Card Header */}
                  <div className="flex items-center gap-3">
                    {testimonial.user?.image ? (
                      <img
                        src={testimonial.user.image}
                        alt="Avatar"
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200/60 shadow-inner bg-slate-50"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/60 flex items-center justify-center font-bold text-xs text-text-muted shadow-inner">
                        {testimonial.patientName ? testimonial.patientName.charAt(0).toUpperCase() : "P"}
                      </div>
                    )}
                    <div className="min-w-0">
                      <span className="text-sm font-bold text-secondary block font-heading truncate">
                        {testimonial.patientName}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">
                        {testimonial.treatment}
                      </span>
                    </div>
                  </div>

                  {/* Card Quote */}
                  <p className="text-xs text-text-muted leading-relaxed line-clamp-3 italic">
                    "{testimonial.content}"
                  </p>
                </div>

                {/* Card Action Row */}
                <div className="flex items-center justify-between pt-3.5 border-t border-slate-100">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-amber-500 font-accent flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {testimonial.rating || 5}
                    </span>
                    <div>
                      {testimonial.approved ? (
                        <span className="inline-block bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-600 px-2 py-0.2 rounded-full uppercase tracking-wider">
                          Approved
                        </span>
                      ) : (
                        <span className="inline-block bg-amber-500/10 border border-amber-500/20 text-[9px] font-bold text-amber-600 px-2 py-0.2 rounded-full uppercase tracking-wider">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleApprove(testimonial)}
                      disabled={togglingId === testimonial._id}
                      style={{ cursor: "pointer" }}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer border ${testimonial.approved
                        ? "bg-slate-50 text-slate-500 border-slate-200 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200"
                        : "bg-emerald-500/10 text-emerald-600 border-emerald-500/25 hover:bg-emerald-500/20"
                        }`}
                    >
                      {togglingId === testimonial._id ? (
                        "..."
                      ) : testimonial.approved ? (
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                          </svg>
                          Revoke
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Approve
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => handleDelete(testimonial._id)}
                      title="Delete Review"
                      style={{ cursor: "pointer" }}
                      className="p-2 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-555 hover:text-primary transition-colors cursor-pointer shadow-sm"
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
                  className={`w-9 h-9 font-accent font-bold text-xs rounded-lg transition-premium cursor-pointer border flex items-center justify-center ${
                    currentPage === page
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
      <CustomConfirmModal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Testimonial"
        message="Are you sure you want to permanently delete this testimonial? This action cannot be undone."
      />
    </div>
  );
};

export default AdminTestimonials;
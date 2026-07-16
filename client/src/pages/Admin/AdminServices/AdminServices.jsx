import "./AdminServices.css";
import useAdminServices from "../../../hooks/useAdminServices";
import { useEffect, useState } from "react";
import ServiceForm from "../../../components/ServiceForm/ServiceForm";
import CustomConfirmModal from "../../../components/CustomConfirmModal/CustomConfirmModal";
import api from "../../../api/axios";
import toast from "react-hot-toast";

const AdminServices = () => {
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const ITEMS_PER_PAGE = 10;

  const { services, loading, fetchServices } = useAdminServices();

  const filteredServices = services.filter((service) =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [filteredServices.length, currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);
  const displayedServices = filteredServices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleCreate = async (data) => {
    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("order", data.order);

      if (data.image?.[0]) {
        formData.append("image", data.image[0]);
      }

      await api.post("/services", formData);
      toast.success("Service added successfully.");
      fetchServices();
      setShowForm(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to add service."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (data) => {
    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("order", data.order);

      if (data.image?.[0]) {
        formData.append("image", data.image[0]);
      }

      await api.put(
        `/services/${editingService._id}`,
        formData
      );

      toast.success("Service updated successfully.");
      await fetchServices();
      setEditingService(null);
      setShowForm(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to update service."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id) => {
    setDeleteConfirmId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;

    try {
      await api.delete(`/services/${deleteConfirmId}`);
      toast.success("Service deleted successfully.");
      fetchServices();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to delete service."
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
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-bold uppercase tracking-widest text-slate-450 font-accent">
          Loading clinic services...
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 text-left">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-block text-primary text-[10px] font-bold tracking-wider uppercase mb-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 font-accent animate-pulse">
            Clinic Catalog
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-secondary font-heading leading-tight">
            Manage Services
          </h2>
          <p className="text-xs text-text-muted font-body mt-0.5">
            Add, update, or remove physical therapy services offered at the clinic.
          </p>
        </div>

        <button
          onClick={() => {
            if (editingService) {
              setEditingService(null);
            } else {
              setShowForm(!showForm);
            }
          }}
          style={{ cursor: "pointer" }}
          className={`px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-premium cursor-pointer border self-start sm:self-center ${showForm || editingService
            ? "bg-slate-100 text-slate-600 border-slate-200/80 hover:bg-slate-200/50"
            : "bg-primary hover:bg-primary/95 text-white border-primary shadow hover:shadow-md hover:scale-[1.01]"
            }`}
        >
          {showForm || editingService ? (
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel Edit
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Service
            </span>
          )}
        </button>
      </div>

      {/* Editor Panel Card */}
      {(showForm || editingService) && (
        <div className="w-full bg-white border border-slate-200/60 rounded-[32px] p-8 shadow-sm relative overflow-visible animate-fade-in">
          <div className="absolute inset-0 bg-grid-blueprint opacity-[0.015] pointer-events-none rounded-[32px]" />

          <h3 className="text-base font-bold text-secondary font-heading mb-6 border-b border-slate-100 pb-4">
            {editingService ? "Edit Service Parameters" : "Publish New Treatment Service"}
          </h3>

          <ServiceForm
            key={editingService ? editingService._id : "new"}
            defaultValues={
              editingService
                ? {
                  title: editingService.title,
                  description: editingService.description,
                  order: editingService.order,
                }
                : {
                  title: "",
                  description: "",
                  order: "",
                }
            }
            onSubmit={editingService ? handleUpdate : handleCreate}
            loading={saving}
            submitText={
              editingService ? "Update Treatment" : "Publish Treatment"
            }
          />
        </div>
      )}

      {/* Services Directory */}
      {services.length === 0 ? (
        <div className="bg-white border border-slate-200/60 rounded-[32px] p-12 text-center shadow-sm">
          <svg className="w-12 h-12 text-slate-300 mx-auto stroke-[1.5] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
          </svg>
          <span className="text-sm font-bold text-secondary block font-heading mb-1">No services found</span>
          <p className="text-xs text-text-muted max-w-xs mx-auto">Create your first physiotherapy treatment option above to populate this catalog.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Actions Row with Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Search services..."
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

          {filteredServices.length === 0 ? (
            <div className="bg-white border border-slate-200/60 rounded-[32px] p-12 text-center shadow-sm">
              <span className="text-sm font-bold text-secondary block font-heading mb-1">No services match your search</span>
              <p className="text-xs text-text-muted max-w-xs mx-auto">Try adjusting your keywords to locate the service.</p>
            </div>
          ) : (
            <>
              {/* 1. Desktop structured table (hidden on mobile/tablet) */}
              <div className="hidden lg:block bg-white border border-slate-200/60 rounded-[32px] overflow-hidden shadow-sm relative z-10">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-550/5 border-b border-slate-100">
                      <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-slate-500 font-heading w-24">Image</th>
                      <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-slate-500 font-heading">Service Details</th>
                      <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-slate-500 font-heading w-24 text-center">Order</th>
                      <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-slate-500 font-heading w-32 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {displayedServices.map((service) => (
                      <tr key={service._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      {service.image ? (
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-16 h-10 rounded-xl object-cover border border-slate-200/60 shadow-inner bg-slate-50"
                        />
                      ) : (
                        <div className="w-16 h-10 rounded-xl bg-slate-100 border border-slate-200/60 flex items-center justify-center shadow-inner">
                          <svg className="w-4 h-4 text-slate-400 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909" />
                          </svg>
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-secondary block font-heading mb-0.5">
                        {service.title}
                      </span>
                      <p className="text-xs text-text-muted line-clamp-1 max-w-lg leading-relaxed">
                        {service.description}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className="inline-block bg-slate-100/80 border border-slate-200/50 text-[10px] font-bold text-slate-600 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {service.order}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <button
                          onClick={() => {
                            setEditingService(service);
                            setShowForm(false);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          title="Edit Service"
                          style={{ cursor: "pointer" }}
                          className="p-2.5 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 hover:border-slate-350 text-slate-500 hover:text-primary transition-all duration-200 cursor-pointer shadow-sm"
                        >
                          <svg className="w-4 h-4 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-3.85.87a.375.375 0 01-.448-.448l.87-3.85a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                          </svg>
                        </button>

                        <button
                          onClick={() => handleDelete(service._id)}
                          title="Delete Service"
                          style={{ cursor: "pointer" }}
                          className="p-2.5 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 hover:border-slate-350 text-slate-500 hover:text-primary transition-all duration-200 cursor-pointer shadow-sm"
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
            {displayedServices.map((service) => (
              <div
                key={service._id}
                className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-sm flex flex-col justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  {service.image ? (
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-16 h-12 rounded-2xl object-cover border border-slate-200/60 shadow-inner bg-slate-50 shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-12 rounded-2xl bg-slate-100 border border-slate-200/60 flex items-center justify-center shadow-inner shrink-0">
                      <svg className="w-4 h-4 text-slate-400 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909" />
                      </svg>
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-bold text-secondary block font-heading truncate">
                      {service.title}
                    </span>
                    <p className="text-xs text-text-muted line-clamp-2 mt-0.5 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3.5 border-t border-slate-100">
                  <span className="inline-block bg-slate-100/80 border border-slate-200/50 text-[10px] font-bold text-slate-600 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Order: {service.order}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingService(service);
                        setShowForm(false);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      title="Edit Service"
                      style={{ cursor: "pointer" }}
                      className="p-2 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-500 hover:text-primary transition-colors cursor-pointer shadow-sm"
                    >
                      <svg className="w-4 h-4 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-3.85.87a.375.375 0 01-.448-.448l.87-3.85a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                      </svg>
                    </button>

                    <button
                      onClick={() => handleDelete(service._id)}
                      title="Delete Service"
                      style={{ cursor: "pointer" }}
                      className="p-2 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-550 hover:text-primary transition-colors cursor-pointer shadow-sm"
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
        title="Delete Service"
        message="Are you sure you want to permanently delete this service? This action cannot be undone."
      />
    </div>
  );
};

export default AdminServices;
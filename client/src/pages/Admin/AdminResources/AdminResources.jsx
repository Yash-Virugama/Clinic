import "./AdminResources.css";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../../api/axios";
import useAdminResources from "../../../hooks/useAdminResources";
import ResourceForm from "../../../components/ResourceForm/ResourceForm";
import CustomConfirmModal from "../../../components/CustomConfirmModal/CustomConfirmModal";

const AdminResources = () => {
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const { resources, loading, fetchResources } = useAdminResources();

  const filteredResources = resources.filter((resource) =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (resource.fileName && resource.fileName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    resource.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    const totalPages = Math.ceil(filteredResources.length / ITEMS_PER_PAGE);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [filteredResources.length, currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  const totalPages = Math.ceil(filteredResources.length / ITEMS_PER_PAGE);
  const displayedResources = filteredResources.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleCreate = async (data) => {
    if (!data.file?.[0]) {
      toast.error("Please upload a file for the new resource.");
      return;
    }

    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("published", data.published);
      formData.append("file", data.file[0]);

      await api.post("/resources", formData);
      toast.success("Resource created successfully.");
      await fetchResources();
      setShowForm(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create resource."
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
      formData.append("category", data.category);
      formData.append("published", data.published);

      if (data.file?.[0]) {
        formData.append("file", data.file[0]);
      }

      await api.put(`/resources/${editingResource._id}`, formData);
      toast.success("Resource updated successfully.");
      await fetchResources();
      setEditingResource(null);
      setShowForm(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update resource."
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
      await api.delete(`/resources/${deleteConfirmId}`);
      toast.success("Resource deleted successfully.");
      await fetchResources();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete resource."
      );
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const handleDownload = async (e, resource) => {
    e.preventDefault();

    if (downloadingId === resource._id) return;
    setDownloadingId(resource._id);

    try {
      const response = await fetch(resource.fileUrl);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = resource.fileName || "download";

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error(
        "Download failed, falling back to direct link",
        error
      );
      window.open(resource.fileUrl, "_blank");
    } finally {
      setDownloadingId(null);
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
          Loading library resources...
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
            Clinic Library
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-secondary font-heading leading-tight">
            Manage Resources
          </h2>
          <p className="text-xs text-text-muted font-body mt-0.5">
            Upload stretching guides, training templates, physical handouts, and rehabilitation media.
          </p>
        </div>

        <button
          onClick={() => {
            if (editingResource) {
              setEditingResource(null);
            } else {
              setShowForm(!showForm);
            }
          }}
          style={{ cursor: "pointer" }}
          className={`px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-premium cursor-pointer border self-start sm:self-center ${showForm || editingResource
            ? "bg-slate-100 text-slate-600 border-slate-200/80 hover:bg-slate-200/50"
            : "bg-primary hover:bg-primary/95 text-white border-primary shadow hover:shadow-md hover:scale-[1.01]"
            }`}
        >
          {showForm || editingResource ? (
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
              Add Resource
            </span>
          )}
        </button>
      </div>

      {/* Editor Panel Card */}
      {(showForm || editingResource) && (
        <div className="w-full bg-white border border-slate-200/60 rounded-[32px] p-6 sm:p-8 shadow-sm relative overflow-visible animate-fade-in">
          <div className="absolute inset-0 bg-grid-blueprint opacity-[0.015] pointer-events-none rounded-[32px]" />

          <h3 className="text-base font-bold text-secondary font-heading mb-6 border-b border-slate-100 pb-4">
            {editingResource ? "Edit Resource Specifications" : "Publish New Download File"}
          </h3>

          <ResourceForm
            key={editingResource ? editingResource._id : "new"}
            defaultValues={
              editingResource
                ? {
                  title: editingResource.title,
                  description: editingResource.description,
                  category: editingResource.category,
                  published: editingResource.published,
                  fileName: editingResource.fileName,
                }
                : undefined
            }
            onSubmit={editingResource ? handleUpdate : handleCreate}
            loading={saving}
            submitText={editingResource ? "Update File" : "Publish File"}
            isEdit={!!editingResource}
          />
        </div>
      )}

      {/* Resources Listings */}
      {resources.length === 0 ? (
        <div className="bg-white border border-slate-200/60 rounded-[32px] p-12 text-center shadow-sm">
          <svg className="w-12 h-12 text-slate-300 mx-auto stroke-[1.5] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <span className="text-sm font-bold text-secondary block font-heading mb-1">No documents found</span>
          <p className="text-xs text-text-muted max-w-xs mx-auto">Upload your first PDF or Word exercise sheet above to construct the registry.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Actions Row with Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Search resources..."
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

          {filteredResources.length === 0 ? (
            <div className="bg-white border border-slate-200/60 rounded-[32px] p-12 text-center shadow-sm">
              <span className="text-sm font-bold text-secondary block font-heading mb-1">No resources match your search</span>
              <p className="text-xs text-text-muted max-w-xs mx-auto">Try adjusting your keywords to locate the resource.</p>
            </div>
          ) : (
            <>
              {/* 1. Desktop structured table (hidden on mobile/tablet) */}
              <div className="hidden lg:block bg-white border border-slate-200/60 rounded-[32px] overflow-hidden shadow-sm relative z-10">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-550/5 border-b border-slate-100">
                      <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-slate-500 font-heading">Document Details</th>
                      <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-slate-500 font-heading w-44">Category</th>
                      <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-slate-500 font-heading w-28 text-center">Status</th>
                      <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-slate-500 font-heading w-32 text-center">Download</th>
                      <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-slate-500 font-heading w-32 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {displayedResources.map((resource) => (
                  <tr key={resource._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-secondary block font-heading mb-0.5 truncate max-w-sm">
                        {resource.title}
                      </span>
                      <p className="text-xs text-text-muted font-mono leading-relaxed truncate max-w-xs">
                        {resource.fileName || "unspecified_file.dat"}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-block bg-slate-100/80 border border-slate-200/50 text-[10px] font-bold text-slate-600 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {resource.category}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      {resource.published ? (
                        <span className="inline-block bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-600 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          Visible
                        </span>
                      ) : (
                        <span className="inline-block bg-slate-150/70 border border-slate-250/50 text-[10px] font-bold text-slate-550 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          Hidden
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-center">
                      {resource.fileUrl ? (
                        <button
                          onClick={(e) => handleDownload(e, resource)}
                          title="Download Document"
                          style={{
                            cursor: downloadingId === resource._id ? "wait" : "pointer",
                          }}
                          className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary hover:text-primary/80 transition-colors bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-xl cursor-pointer border-0"
                        >
                          <svg className="w-3.5 h-3.5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                          </svg>
                          {downloadingId === resource._id ? "..." : "Get"}
                        </button>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">No file</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <button
                          onClick={() => {
                            setEditingResource(resource);
                            setShowForm(false);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          title="Edit Resource"
                          style={{ cursor: "pointer" }}
                          className="p-2.5 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 hover:border-slate-350 text-slate-500 hover:text-primary transition-all duration-200 cursor-pointer shadow-sm"
                        >
                          <svg className="w-4 h-4 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-3.85.87a.375.375 0 01-.448-.448l.87-3.85a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                          </svg>
                        </button>

                        <button
                          onClick={() => handleDelete(resource._id)}
                          title="Delete Resource"
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
            {displayedResources.map((resource) => (
              <div
                key={resource._id}
                className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-sm flex flex-col justify-between gap-4"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-sm font-bold text-secondary block font-heading truncate">
                    {resource.title}
                  </span>
                  <p className="text-xs text-text-muted font-mono leading-relaxed truncate">
                    {resource.fileName || "unspecified_file.dat"}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3.5 border-t border-slate-100">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Category: {resource.category}
                    </span>
                    <div>
                      {resource.published ? (
                        <span className="inline-block bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-600 px-2 py-0.2 rounded-full uppercase tracking-wider">
                          Visible
                        </span>
                      ) : (
                        <span className="inline-block bg-slate-100 border border-slate-200/50 text-[9px] font-bold text-slate-550 px-2 py-0.2 rounded-full uppercase tracking-wider">
                          Hidden
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {resource.fileUrl && (
                      <button
                        onClick={(e) => handleDownload(e, resource)}
                        title="Download Document"
                        style={{
                          cursor: downloadingId === resource._id ? "wait" : "pointer",
                        }}
                        className="p-2 rounded-xl bg-slate-50 text-slate-500 hover:text-primary transition-colors cursor-pointer border border-slate-200/80 shadow-sm"
                      >
                        <svg className="w-4 h-4 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setEditingResource(resource);
                        setShowForm(false);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      title="Edit Resource"
                      style={{ cursor: "pointer" }}
                      className="p-2 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-500 hover:text-primary transition-colors cursor-pointer shadow-sm"
                    >
                      <svg className="w-4 h-4 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-3.85.87a.375.375 0 01-.448-.448l.87-3.85a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                      </svg>
                    </button>

                    <button
                      onClick={() => handleDelete(resource._id)}
                      title="Delete Resource"
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
        title="Delete Resource"
        message="Are you sure you want to permanently delete this resource? This action cannot be undone."
      />
    </div>
  );
};

export default AdminResources;
import { useState, useEffect } from "react";
import { useBranding } from "../../../context/BrandingContext";
import toast from "react-hot-toast";
import { settingSchema } from "../../../validations/settingSchema";

const AdminSettings = () => {
  const { settings, updateBranding } = useBranding();
  const [name, setName] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [heroImageFile, setHeroImageFile] = useState(null);
  const [faviconFile, setFaviconFile] = useState(null);
  const [pwaIconFile, setPwaIconFile] = useState(null);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [emailGeneral, setEmailGeneral] = useState("");
  const [emailRehab, setEmailRehab] = useState("");
  const [workingHours, setWorkingHours] = useState("");
  const [closedHours, setClosedHours] = useState("");
  const [mapLink, setMapLink] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [youtube, setYoutube] = useState("");
  const [appName, setAppName] = useState("");
  const [shortName, setShortName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (settings) {
      setName(settings.name || "PhysioCare");
      setAddress(settings.address || "");
      setPhone(settings.phone || "");
      setEmergencyPhone(settings.emergencyPhone || "");
      setEmailGeneral(settings.emailGeneral || "");
      setEmailRehab(settings.emailRehab || "");
      setWorkingHours(settings.workingHours || "");
      setClosedHours(settings.closedHours || "");
      setMapLink(settings.mapLink || "");
      setFacebook(settings.facebook || "");
      setInstagram(settings.instagram || "");
      setYoutube(settings.youtube || "");
      setAppName(settings.appName || "");
      setShortName(settings.shortName || "");
    }
  }, [settings]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Schema validation
    const validationResult = settingSchema.safeParse({
      name,
      address,
      phone,
      emergencyPhone,
      emailGeneral,
      emailRehab,
      workingHours,
      closedHours,
      mapLink,
      facebook,
      instagram,
      youtube,
      appName,
      shortName,
    });

    if (!validationResult.success) {
      const errorMsg = validationResult.error.errors[0]?.message || "Validation failed";
      toast.error(errorMsg);
      return;
    }

    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("address", address);
      formData.append("phone", phone);
      formData.append("emergencyPhone", emergencyPhone);
      formData.append("emailGeneral", emailGeneral);
      formData.append("emailRehab", emailRehab);
      formData.append("workingHours", workingHours);
      formData.append("closedHours", closedHours);
      formData.append("mapLink", mapLink);
      formData.append("facebook", facebook);
      formData.append("instagram", instagram);
      formData.append("youtube", youtube);
      formData.append("appName", appName);
      formData.append("shortName", shortName);

      if (logoFile) {
        formData.append("logo", logoFile);
      }
      if (heroImageFile) {
        formData.append("heroImage", heroImageFile);
      }
      if (faviconFile) {
        formData.append("favicon", faviconFile);
      }
      if (pwaIconFile) {
        formData.append("pwaIcon", pwaIconFile);
      }

      await updateBranding(formData);
      toast.success("Branding settings updated successfully.");
      setLogoFile(null);
      setHeroImageFile(null);
      setFaviconFile(null);
      setPwaIconFile(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update branding settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 text-left max-w-3xl mx-auto relative overflow-visible">
      {/* Page Header */}
      <div>
        <span className="inline-block text-primary text-[10px] font-bold tracking-wider uppercase mb-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 font-accent animate-pulse">
          System Panel
        </span>
        <h2 className="text-2xl font-bold tracking-tight text-secondary font-heading leading-tight">
          System Configurations
        </h2>
        <p className="text-xs text-text-muted font-body mt-0.5">
          Adjust website brand identity, contact coordinates, operating schedules, and social links.
        </p>
      </div>

      {/* Settings Card */}
      <section className="bg-white/80 border border-slate-200/60 backdrop-blur-md rounded-[32px] p-6 sm:p-8 sm:p-10 shadow-sm relative overflow-visible">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">

          {/* Logo Brand Row */}
          <div className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b border-slate-100">
            <div className="flex flex-col gap-2 items-center text-center shrink-0">
              <span className="text-xs font-bold text-slate-450 uppercase tracking-wider font-heading">Current Logo</span>
              <div className="w-24 h-24 rounded-full bg-bg-offwhite border border-slate-200 flex items-center justify-center p-3 shadow-inner relative overflow-hidden">
                {settings.logo ? (
                  <img src={settings.logo} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <div className="text-[9px] text-slate-400 font-semibold italic text-center leading-tight">
                    Default SVG Active
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-4 w-full text-left">
              {/* Brand Name Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
                  Website Title / Brand Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. PhysioCare"
                  required
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200/80 bg-white/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-secondary text-sm font-medium transition-all shadow-sm"
                />
              </div>

              {/* Logo File Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
                  Upload Custom Logo (PNG, SVG, JPG)
                </label>
                <input
                  type="file"
                  accept="image/png, image/svg+xml, image/jpeg"
                  onChange={(e) => setLogoFile(e.target.files[0])}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-wider file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:cursor-pointer cursor-pointer border border-slate-200/80 rounded-2xl p-2 bg-white/50 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary shadow-sm"
                />
                <p className="text-[10px] text-text-muted">Recommended: Square logo with dark contrast or transparent background.</p>
              </div>
            </div>
          </div>

          {/* Hero Image Row */}
          <div className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b border-slate-100">
            <div className="flex flex-col gap-2 items-center text-center shrink-0">
              <span className="text-xs font-bold text-slate-450 uppercase tracking-wider font-heading">Current Hero Image</span>
              <div className="w-24 h-24 rounded-2xl bg-bg-offwhite border border-slate-200 flex items-center justify-center p-1 shadow-inner relative overflow-hidden">
                {settings.heroImage ? (
                  <img src={settings.heroImage} alt="Hero Image" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <div className="text-[9px] text-slate-400 font-semibold italic text-center leading-tight">
                    Default Image Active
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-4 w-full text-left">
              {/* Hero Image File Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
                  Upload Custom Hero Image (1:1 / Square Ratio)
                </label>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={(e) => setHeroImageFile(e.target.files[0])}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-wider file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:cursor-pointer cursor-pointer border border-slate-200/80 rounded-2xl p-2 bg-white/50 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary shadow-sm"
                />
                <p className="text-[10px] text-text-muted">Recommended: Square image (1:1 aspect ratio, e.g. 800x800 px) for optimal layout in the hero section.</p>
              </div>
            </div>
          </div>

          {/* Favicon Icon Row */}
          <div className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b border-slate-100">
            <div className="flex flex-col gap-2 items-center text-center shrink-0">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-heading">Current Favicon</span>
              <div className="w-24 h-24 rounded-full bg-bg-offwhite border border-slate-200 flex items-center justify-center p-4 shadow-inner relative overflow-hidden">
                {settings.favicon ? (
                  <img src={settings.favicon} alt="Favicon" className="w-full h-full object-contain" />
                ) : (
                  <div className="text-[9px] text-slate-400 font-semibold italic text-center leading-tight">
                    Default Tab Icon
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-4 w-full text-left">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
                  Upload Custom Favicon (1:1 Aspect Ratio)
                </label>
                <input
                  type="file"
                  accept="image/png, image/x-icon, image/svg+xml"
                  onChange={(e) => setFaviconFile(e.target.files[0])}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-wider file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:cursor-pointer cursor-pointer border border-slate-200/80 rounded-2xl p-2 bg-white/50 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary shadow-sm"
                />
                <p className="text-[10px] text-text-muted">Recommended: Square image with 1:1 ratio (e.g. 32x32 pixels) in PNG or ICO format. This is shown in your browser's address tab.</p>
              </div>
            </div>
          </div>

          {/* PWA Icon Row */}
          <div className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b border-slate-100">
            <div className="flex flex-col gap-2 items-center text-center shrink-0">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-heading">Current PWA Icon</span>
              <div className="w-24 h-24 rounded-2xl bg-bg-offwhite border border-slate-200 flex items-center justify-center p-3 shadow-inner relative overflow-hidden">
                {settings.pwaIcon ? (
                  <img src={settings.pwaIcon} alt="PWA Icon" className="w-full h-full object-contain" />
                ) : (
                  <div className="text-[9px] text-slate-400 font-semibold italic text-center leading-tight">
                    Default PWA Icon
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-4 w-full text-left">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
                  Upload Custom PWA Launcher Icon (1:1 Aspect Ratio)
                </label>
                <input
                  type="file"
                  accept="image/png"
                  onChange={(e) => setPwaIconFile(e.target.files[0])}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-wider file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:cursor-pointer cursor-pointer border border-slate-200/80 rounded-2xl p-2 bg-white/50 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary shadow-sm"
                />
                <p className="text-[10px] text-text-muted">Recommended: High-resolution square PNG (1:1 ratio, minimum 512x512 pixels). Used as the app icon on mobile screens when installed.</p>
              </div>
            </div>
          </div>

          {/* Section: PWA App Customizations */}
          <div className="flex flex-col gap-5 pb-8 border-b border-slate-100">
            <h3 className="border-s-3 text-sm font-bold text-primary p-1 bg-text-light font-heading uppercase tracking-wider pl-4 shadow-sm">
              PWA App Customizations
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
              {/* App Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
                  PWA App Name (Full Title)
                </label>
                <input
                  type="text"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  placeholder="e.g. PhysioCare Clinic"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200/80 bg-white/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-secondary text-sm font-medium transition-all shadow-sm"
                />
                <p className="text-[10px] text-text-muted">Full application name displayed during app installation prompts.</p>
              </div>

              {/* Short Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
                  PWA Short Name (Launcher Title)
                </label>
                <input
                  type="text"
                  value={shortName}
                  onChange={(e) => setShortName(e.target.value)}
                  placeholder="e.g. PhysioCare"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200/80 bg-white/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-secondary text-sm font-medium transition-all shadow-sm"
                />
                <p className="text-[10px] text-text-muted">Short name displayed under the icon on mobile home screens (max 12 characters recommended).</p>
              </div>
            </div>
          </div>

          {/* Section: Clinic Address coordinates */}
          <div className="flex flex-col gap-5">
            <h3 className="border-s-3 text-sm font-bold text-primary p-1 bg-text-light font-heading uppercase tracking-wider pl-4 shadow-sm">
              Clinic Coordinates
            </h3>

            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
                Physical Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 123 Health Street, Ahmedabad, Gujarat 380015"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200/80 bg-white/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-secondary text-sm font-medium transition-all shadow-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200/80 bg-white/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-secondary text-sm font-medium transition-all shadow-sm"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
                  General Email
                </label>
                <input
                  type="email"
                  value={emailGeneral}
                  onChange={(e) => setEmailGeneral(e.target.value)}
                  placeholder="e.g. contact@physiocare.com"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200/80 bg-white/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-secondary text-sm font-medium transition-all shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Section: Operating Schedule Hours */}
          <div className="flex flex-col gap-5 border-t border-slate-100 pt-8">
            <h3 className="border-s-3 text-sm font-bold text-primary p-1 bg-text-light font-heading uppercase tracking-wider pl-4 shadow-sm">
              Operating Schedule
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
                  Working Hours (Mon-Sat)
                </label>
                <input
                  type="text"
                  value={workingHours}
                  onChange={(e) => setWorkingHours(e.target.value)}
                  placeholder="e.g. Mon-Sat: 9 AM-7 PM"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200/80 bg-white/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-secondary text-sm font-medium transition-all shadow-sm"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
                  Closed Hours (Sunday)
                </label>
                <input
                  type="text"
                  value={closedHours}
                  onChange={(e) => setClosedHours(e.target.value)}
                  placeholder="e.g. Sunday: Closed"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200/80 bg-white/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-secondary text-sm font-medium transition-all shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Section: Google Maps Src embed */}
          <div className="flex flex-col gap-5 border-t border-slate-100 pt-8">
            <h3 className="border-s-3 text-sm font-bold text-primary p-1 bg-text-light font-heading uppercase tracking-wider pl-4 shadow-sm">
              Google Maps Location
            </h3>

            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
                Map Embed Source URL (Iframe Src Link)
              </label>
              <input
                type="text"
                value={mapLink}
                onChange={(e) => setMapLink(e.target.value)}
                placeholder="https://www.google.com/maps/embed?..."
                className="w-full px-4 py-3 rounded-2xl border border-slate-200/80 bg-white/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-secondary text-sm font-medium transition-all shadow-sm"
              />
              <p className="text-[10px] text-text-muted">Enter only the dynamic src parameter URL inside the Google Maps share/embed iframe tag.</p>
            </div>
          </div>

          {/* Section: Social Profiles Link channels */}
          <div className="flex flex-col gap-5 border-t border-slate-100 pt-8">
            <h3 className="border-s-3 text-sm font-bold text-primary p-1 bg-text-light font-heading uppercase tracking-wider pl-4 shadow-sm">
              Social Profiles Link Channels
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-left">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
                  Facebook Link
                </label>
                <input
                  type="text"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="https://facebook.com/..."
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200/80 bg-white/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-secondary text-sm font-medium transition-all shadow-sm"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
                  Instagram Link
                </label>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200/80 bg-white/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-secondary text-sm font-medium transition-all shadow-sm"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
                  YouTube Link
                </label>
                <input
                  type="text"
                  value={youtube}
                  onChange={(e) => setYoutube(e.target.value)}
                  placeholder="https://youtube.com/..."
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200/80 bg-white/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-secondary text-sm font-medium transition-all shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Form Action submit button */}
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={saving}
              style={{ cursor: saving ? "wait" : "pointer" }}
              className={`px-6 py-3.5 rounded-2xl w-full sm:w-auto flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-premium cursor-pointer ${saving
                  ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                  : "bg-primary hover:bg-primary/95 text-white border-primary shadow hover:shadow-md hover:scale-[1.01]"
                }`}
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                  Saving settings...
                </>
              ) : (
                "Save Branding & Details"
              )}
            </button>
          </div>

        </form>
      </section>
    </div>
  );
};

export default AdminSettings;

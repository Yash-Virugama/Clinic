import CustomSelect from "../../../components/CustomSelect/CustomSelect";
import ModalShell from "./ModalShell";

const PatientFormModal = ({ isOpen, onClose, title, form, submitLabel = "Register Patient", submittingLabel = "Registering..." }) => (
  <ModalShell isOpen={isOpen} onClose={onClose} title={title}>
    <form onSubmit={form.handleSubmit} className="space-y-5" noValidate>
      <div>
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-accent block mb-1.5">
          Patient Full Name
        </label>
        <input
          type="text"
          value={form.values.name}
          onChange={(e) => form.handleNameChange(e.target.value)}
          placeholder="e.g. John Doe"
          className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-xs text-secondary placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all font-medium ${
            form.errors.name ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-200" : "border-slate-200 focus:border-primary"
          }`}
        />
        {form.errors.name && <p className="text-[10px] text-rose-500 font-bold uppercase mt-1">{form.errors.name}</p>}
      </div>

      <div>
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-accent block mb-1.5">
          Phone Number (10 digits)
        </label>
        <input
          type="tel"
          value={form.values.phone}
          onChange={(e) => form.handlePhoneChange(e.target.value)}
          placeholder="e.g. 9876543210"
          className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-xs text-secondary placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all font-medium ${
            form.errors.phone ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-200" : "border-slate-200 focus:border-primary"
          }`}
        />
        {form.errors.phone && <p className="text-[10px] text-rose-500 font-bold uppercase mt-1">{form.errors.phone}</p>}
      </div>

      <div>
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-accent block mb-1.5">
          Gender
        </label>
        <CustomSelect
          value={form.values.gender}
          onChange={(value) => form.setGender(value)}
          options={[
            { value: "Male", label: "Male" },
            { value: "Female", label: "Female" },
            { value: "Other", label: "Other" },
          ]}
          placeholder="Select Gender"
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={form.submitting}
          className="w-full py-3 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-primary-hover shadow-sm disabled:opacity-50 transition-premium cursor-pointer"
        >
          {form.submitting ? submittingLabel : submitLabel}
        </button>
      </div>
    </form>
  </ModalShell>
);

export default PatientFormModal;

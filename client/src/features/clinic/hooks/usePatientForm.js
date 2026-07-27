import { useState } from "react";
import { patientCreateSchema } from "../../../validations/patientSchema";
import { mapZodErrors } from "../utils/clinicFormatters";

const emptyErrors = { name: "", phone: "" };

const usePatientForm = ({ addPatient, onSuccess } = {}) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("Male");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState(emptyErrors);

  const resetForm = () => {
    setName("");
    setPhone("");
    setGender("Male");
    setErrors(emptyErrors);
  };

  const handleNameChange = (value) => {
    setName(value);
    if (value.trim()) {
      setErrors((prev) => ({ ...prev, name: "" }));
    }
  };

  const handlePhoneChange = (value) => {
    const digitsOnly = value.replace(/\D/g, "");
    setPhone(digitsOnly);
    if (digitsOnly.length === 10) {
      setErrors((prev) => ({ ...prev, phone: "" }));
    }
  };

  const validateForm = () => {
    const result = patientCreateSchema.safeParse({ name, phone, gender });
    if (!result.success) {
      setErrors(mapZodErrors(result.error.issues, emptyErrors));
      return false;
    }

    setErrors(emptyErrors);
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      const result = await addPatient({
        name: name.trim(),
        phone: phone.trim(),
        gender,
      });
      resetForm();
      onSuccess?.(result);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    values: { name, phone, gender },
    setGender,
    submitting,
    errors,
    resetForm,
    handleNameChange,
    handlePhoneChange,
    handleSubmit,
  };
};

export default usePatientForm;

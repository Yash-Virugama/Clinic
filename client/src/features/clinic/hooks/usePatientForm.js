import { useState } from "react";
import { patientCreateSchema } from "../../../validations/patientSchema";
import { mapZodErrors } from "../utils/clinicFormatters";

const emptyErrors = { name: "", phone: "", age: "" };

const usePatientForm = ({ addPatient, onSuccess } = {}) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("Male");
  const [age, setAge] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState(emptyErrors);

  const resetForm = () => {
    setName("");
    setPhone("");
    setGender("Male");
    setAge("");
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

  const handleAgeChange = (value) => {
    setAge(value);
    if (value) {
      setErrors((prev) => ({ ...prev, age: "" }));
    }
  };

  const validateForm = () => {
    const result = patientCreateSchema.safeParse({ name, phone, gender, age });
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
        age: parseInt(age, 10),
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
    values: { name, phone, gender, age },
    setGender,
    submitting,
    errors,
    resetForm,
    handleNameChange,
    handlePhoneChange,
    handleAgeChange,
    handleSubmit,
  };
};

export default usePatientForm;

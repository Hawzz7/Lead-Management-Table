import { useState } from "react";
import { toast } from "react-toastify";
import API from "../services/api";

function LeadForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    college: "",
    year: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { name, email, phone, course, college, year } = form;

    if (!name.trim()) {
      toast.error("Name is required");
      return false;
    }

    if (!email.trim()) {
      toast.error("Email is required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format");
      return false;
    }

    if (!phone.trim()) {
      toast.error("Phone number is required");
      return false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      toast.error("Phone must be 10 digits");
      return false;
    }

    if (!course.trim()) {
      toast.error("Course is required");
      return false;
    }

    if (!college.trim()) {
      toast.error("College is required");
      return false;
    }

    if (!year.trim()) {
      toast.error("Year is required");
      return false;
    }

    const yearRegex = /^[0-9]{4}$/;
    if (!yearRegex.test(year)) {
      toast.error("Year must be 4 digits (e.g. 2024)");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await API.post("/leads", {
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        course: form.course.trim(),
        college: form.college.trim()
      });

      toast.success(res.data.message || "Lead submitted successfully!");

      setForm({
        name: "",
        email: "",
        phone: "",
        course: "",
        college: "",
        year: ""
      });
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (name, type = "text") => (
    <div>
      <fieldset className="border border-gray-300 rounded-lg px-3 py-2 focus-within:border-blue-600 transition">
        <legend className="px-1 text-sm text-gray-600">
          {name.charAt(0).toUpperCase() + name.slice(1)}
        </legend>

        <input
          type={type}
          name={name}
          value={form[name]}
          onChange={handleChange}
          className="w-full bg-transparent outline-none text-gray-800"
        />
      </fieldset>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-5"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Enroll Now
        </h2>

        {renderInput("name")}
        {renderInput("email", "email")}
        {renderInput("phone")}
        {renderInput("course")}
        {renderInput("college")}
        {renderInput("year")}

        <button
          type="submit"
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-white font-medium transition ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading && (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default LeadForm;

import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import { ChevronDown } from "lucide-react"; // ✅ arrow icon

// Static fields (as per your previous code)
const FORM_FIELDS = [
  {
    name: "name",
    label: "Name",
    type: "text",
    placeholder: "Enter name",
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "example@gmail.com",
  },
  {
    name: "phone",
    label: "Phone Number",
    type: "phone",
    placeholder: "Enter phone number",
  },
  {
    name: "role",
    label: "Role",
    type: "select",
    options: ["Admin", "Manager", "Cashier"],
  },
  {
    name: "posAddress",
    label: "POS Locations",
    type: "multiselect",
    options: ["Outlet 1", "Outlet 2", "Outlet 3"], // Static for now
    fullWidth: true,
  },
];

export default function EditEmployeeForm({ data, onSubmit }) {
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [phoneErrors, setPhoneErrors] = useState([]);

  const initialValues = {
    name: data?.name ?? "",
    email: data?.email ?? "",
    phone: data?.phone ?? "",
    role: data?.role ?? "",
    posAddress: data?.posAddress ?? [],
  };

  return (
    <div className="w-full max-w-[840px] rounded-2xl bg-white p-6 md:p-8">
      <h3 className="text-[22px] font-bold text-[#2E2E2E]">Edit Employee</h3>

      <Formik
        initialValues={initialValues}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true);
          try {
            // Simulate form submission (you can integrate backend later)
            console.log(values);
            onSubmit?.(values);
          } catch (error) {
            console.error("Error in submission:", error);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2">
            {FORM_FIELDS.map((f) => (
              <div
                key={f.name}
                className={`flex flex-col relative ${f.fullWidth ? "md:col-span-2" : ""}`}
              >
                <label className="mb-2 text-[15px] text-[#2E2E2E] capitalize font-semibold">
                  {f.label}
                </label>

                {f.type === "select" ? (
                  <div className="relative">
                    <Field
                      as="select"
                      name={f.name}
                      className="w-full rounded-lg border border-[#E5E7EB] px-4 py-3 text-sm outline-none 
                                 focus:ring-2 focus:ring-[#1D50AB]/30 bg-white appearance-none"
                    >
                      <option value="" disabled hidden>
                        Select {f.label}
                      </option>
                      {f.options?.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </Field>
                    <ChevronDown className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 pointer-events-none right-3 top-1/2" />
                  </div>
                ) : f.type === "multiselect" ? (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setDropdownOpen((prev) => ({
                          ...prev,
                          [f.name]: !prev[f.name],
                        }))
                      }
                      className="w-full rounded-lg border border-[#E5E7EB] px-4 py-3 text-sm outline-none 
                                 focus:ring-2 focus:ring-[#1D50AB]/30 bg-white text-left flex items-center justify-between"
                    >
                      <span className="truncate">
                        {values[f.name]?.length > 0
                          ? `${values[f.name].length} location${
                              values[f.name].length > 1 ? "s" : ""
                            } selected`
                          : `Select ${f.label}`}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-gray-400 transition-transform ${
                          dropdownOpen[f.name] ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {dropdownOpen[f.name] && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-[#E5E7EB] rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {f.options?.map((opt) => {
                          const isSelected = values[f.name]?.includes(opt);
                          return (
                            <div
                              key={opt}
                              onClick={() => {
                                const currentValues = values[f.name] || [];
                                if (isSelected) {
                                  setFieldValue(f.name, currentValues.filter((v) => v !== opt));
                                } else {
                                  setFieldValue(f.name, [...currentValues, opt]);
                                }
                              }}
                              className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-50"
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                readOnly
                                className="w-4 h-4 text-[#1D50AB] border-gray-300 rounded focus:ring-[#1D50AB]"
                              />
                              <span className="text-sm">{opt}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : f.type === "phone" ? (
                  <Field
                    name={f.name}
                    type="tel"
                    placeholder={f.placeholder}
                    className="w-full rounded-lg border border-[#E5E7EB] px-4 py-3 placeholder:text-[#9CA3AF] text-sm outline-none focus:ring-2 focus:ring-[#1D50AB]/30 bg-white"
                  />
                ) : (
                  <Field
                    name={f.name}
                    type={f.type}
                    placeholder={f.placeholder}
                    className="w-full rounded-lg border border-[#E5E7EB] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#1D50AB]/30 bg-white"
                  />
                )}

                <ErrorMessage
                  name={f.name}
                  component="div"
                  className="mt-1 text-xs text-red-600"
                />
              </div>
            ))}

            <div className="flex items-center justify-between gap-3 mt-6 md:col-span-2">
              <button
                type="button"
                className="w-full md:w-auto rounded-full border border-[#E5E7EB] bg-white px-5 py-2.5 text-[#2E2E2E]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto rounded-full bg-gradient-to-r from-[#9EE7E6] to-[#1D50AB] px-5 py-2.5 text-white disabled:opacity-60"
              >
                {isSubmitting ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

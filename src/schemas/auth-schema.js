import { EMAIL_REGEX } from "@/lib/endpoints";
import * as Yup from "yup";

// Shared Password Validation
const passwordValidation = Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
        /^(?=(?:[^ ]* ){0,1}[^ ]*$)(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and at most one space"
    );

// Shared Email Validation
const emailValidation = Yup.string()
    .email("Invalid email address. Please try again")
    .matches(
        EMAIL_REGEX,
        "Email must end with a valid TLD (e.g., .com, .org, .net, .io)"
    )
    .required("Email is required");

// Login validation schema
export const loginSchema = Yup.object({
    email: emailValidation,
    password: passwordValidation,
});

// Register validation schema
export const registerSchema = Yup.object({
    name: Yup.string()
        .required("Name is required")
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must not exceed 50 characters")
        .matches(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
    email: emailValidation,
    password: passwordValidation,
    acceptedTerms: Yup.boolean()
        .oneOf([true], "You must accept the Terms & Conditions")
        .required("You must accept the Terms & Conditions"),
    sellerType: Yup.string().when('role', {
        is: 'seller',
        then: (schema) => schema.oneOf(['private', 'professional'], 'Invalid seller type').required('Seller type is required'),
        otherwise: (schema) => schema.notRequired(),
    }),
    businessName: Yup.string().when(['role', 'sellerType'], {
        is: (role, sellerType) => role === 'seller' && sellerType === 'professional',
        then: (schema) => schema.required('Business name is required').trim(),
        otherwise: (schema) => schema.notRequired(),
    }),
    registrationNumber: Yup.string().when(['role', 'sellerType'], {
        is: (role, sellerType) => role === 'seller' && sellerType === 'professional',
        then: (schema) => schema.required('Registration number is required').trim(),
        otherwise: (schema) => schema.notRequired(),
    }),
    vatNumber: Yup.string().when(['role', 'sellerType'], {
        is: (role, sellerType) => role === 'seller' && sellerType === 'professional',
        then: (schema) => schema.required('VAT number is required').trim(),
        otherwise: (schema) => schema.notRequired(),
    }),
    businessAddress: Yup.string().when(['role', 'sellerType'], {
        is: (role, sellerType) => role === 'seller' && sellerType === 'professional',
        then: (schema) => schema.required('Business address is required').trim(),
        otherwise: (schema) => schema.notRequired(),
    }),
});

// Forgot Password Schemas
export const forgotPasswordEmailSchema = Yup.object({
    email: emailValidation,
});

export const verifyOTPSchema = Yup.object({
    otp: Yup.string()
        .length(6, "OTP must be 6 digits")
        .required("OTP is required"),
});

export const resetPasswordSchema = Yup.object({
    password: passwordValidation,
    confirm_password: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm Password is Required"),
});

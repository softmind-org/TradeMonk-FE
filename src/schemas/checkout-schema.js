import * as Yup from "yup";

export const checkoutSchema = Yup.object().shape({
    fullName: Yup.string()
        .min(2, "Name must be at least 2 characters")
        .max(35, "SendCloud limit: Name must be at most 35 characters")
        .required("Full name is required"),
    address: Yup.string()
        .min(5, "Address must be at least 5 characters")
        .max(35, "SendCloud limit: Address must be at most 35 characters")
        .required("Delivery address is required"),
    city: Yup.string()
        .min(2, "City must be at least 2 characters")
        .max(30, "SendCloud limit: City must be at most 30 characters")
        .required("City is required"),
    zipCode: Yup.string()
        .min(3, "Zip code must be at least 3 characters")
        .max(15, "SendCloud limit: Zip code must be at most 15 characters")
        .required("Zip code is required"),
    country: Yup.string()
        .length(2, "Country must be a 2-letter ISO code")
        .required("Country is required"),
});

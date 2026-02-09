import * as Yup from "yup";

export const checkoutSchema = Yup.object().shape({
    fullName: Yup.string()
        .min(2, "Name must be at least 2 characters")
        .required("Full name is required"),
    address: Yup.string()
        .min(5, "Address must be at least 5 characters")
        .required("Delivery address is required"),
    city: Yup.string()
        .min(2, "City must be at least 2 characters")
        .required("City is required"),
    zipCode: Yup.string()
        .min(3, "Zip code must be at least 3 characters")
        .required("Zip code is required"),
});

import { brand_logo } from "@/assets/images";
import { Link } from "react-router";

const ForgotHEader = ({ title, description }) => (
  <div className="mb-8 text-center">
    <img src={brand_logo} className="mx-auto mb-12" />
    <h1 className="mb-2 text-2xl font-semibold text-foreground sm:text-3xl">
      {title}
    </h1>
    <p className="text-muted-foreground text-base sm:text-base">
      {description}
    </p>
  </div>
);

export default ForgotHEader;

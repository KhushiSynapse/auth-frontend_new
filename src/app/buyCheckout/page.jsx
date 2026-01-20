// app/buyCheckout/page.tsx
import { Suspense } from "react";
import BuyCheckout from "./buyCheckout";

export default function BuyCheckoutPage() {
  return (
    <Suspense fallback={<div>Loading checkout...</div>}>
      <BuyCheckout />
    </Suspense>
  );
  
}

"use client";

import RootLayoutComponent from "../../../../components/RootLayout";
import OrderDetails from "../../../../components/OrderDetails";

type PageProps = {
  params: Promise<{
    orderId: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { orderId } = await params;

  return (
    <RootLayoutComponent>
      <OrderDetails orderId={orderId} />
    </RootLayoutComponent>
  );
}
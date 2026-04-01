import RootLayoutComponent from "../../../../components/RootLayout";
import OrderChat from "../../../../components/OrderChat";

type PageProps = {
  params: Promise<{
    orderId: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { orderId } = await params;

  return (
    <RootLayoutComponent>
      <OrderChat orderId={orderId} />
    </RootLayoutComponent>
  );
}
import OrderChat from "../../components/OrderChat";
import RootLayoutComponent from "../../components/RootLayout";

export default function ChatPage() {
  return (
    <RootLayoutComponent>
      <OrderChat orderId="general" />
    </RootLayoutComponent>
  );
}

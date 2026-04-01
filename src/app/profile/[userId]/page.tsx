import RootLayoutComponent from "../../../components/RootLayout";
import UserProfile from "../../../components/UserProfile";

type PageProps = {
  params: Promise<{
    userId: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { userId } = await params;

  return (
    <RootLayoutComponent>
      <UserProfile userId={userId} />
    </RootLayoutComponent>
  );
}
import RootLayoutComponent from "../../../components/RootLayout";
import SkillDetails from "../../../components/SkillDetails";

type PageProps = {
  params: Promise<{
    skillId: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { skillId } = await params;

  return (
    <RootLayoutComponent>
      <SkillDetails skillId={skillId} />
    </RootLayoutComponent>
  );
}
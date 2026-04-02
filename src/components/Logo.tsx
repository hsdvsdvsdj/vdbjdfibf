export default function Logo() {
  return (
    <img
      src="/skillswap-logo.png"
      alt="SkillSwap Exchange Logo"
      width="36"
      height="36"
      style={{ 
        marginRight: "2px", 
        flexShrink: 0,
        filter: "invert(1) brightness(1.1)",
      }}
    />
  );
}

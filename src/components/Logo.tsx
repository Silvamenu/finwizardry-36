import logo from "@/assets/logo.png";

interface LogoProps {
  className?: string;
  showText?: boolean;
  textSize?: string;
}

const Logo = ({ className = "w-10 h-10", showText = true, textSize = "text-2xl" }: LogoProps) => {
  return (
    <div className="flex items-center space-x-3">
      <img src={logo} alt="MoMoney" className={className} />
      {showText && (
        <span className={`${textSize} font-bold gradient-text`}>MoMoney</span>
      )}
    </div>
  );
};

export default Logo;

import Image from "next/image";
import React from "react";

export const SendHorizontalIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    viewBox="0 0 23 23"
    fill="none"
  >
    <g clip-path="url(#clip0_3114_1001)">
      <path
        d="M16.9551 1.63569L1.29024 10.0226C0.805041 10.2999 0.805041 11.0623 1.35955 11.2703L15.7768 17.3005C16.1926 17.5085 16.6778 17.1619 16.7471 16.746L17.9255 2.32882C17.9948 1.705 17.4403 1.35843 16.9551 1.63569Z"
        stroke="white"
        strokeWidth="2"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.6773 2.39062L7.6665 13.4808V18.5407C7.6665 19.1645 8.49827 19.5111 8.91415 19.0259L11.8253 15.5602"
        stroke="white"
        strokeWidth="2"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_3114_1001">
        <rect width="22.1803" height="22.1803" rx="11.0902" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export const TooltipIconButton: React.FC<{
  tooltip: string;
  variant?: string;
  size?: string;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}> = ({ children, onClick, disabled, className = "" }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`p-1 rounded hover:bg-gray-100 transition-colors ${
      disabled ? "opacity-50 cursor-not-allowed" : ""
    } ${className}`}
  >
    {children}
  </button>
);

export const DollarSign: React.FC = () => (
  <div className="text-white text-lg">💰</div>
);

export const User: React.FC = () => (
  <div className="text-white text-lg">👤</div>
);

export const Heart: React.FC = () => (
  <div className="text-white text-lg">💕</div>
);

export const Calendar: React.FC = () => (
  <div className="text-white text-lg">📅</div>
);

export const CheckCircle: React.FC<{ className?: string }> = ({
  className,
}) => <div className={`text-xl ${className}`}>✅</div>;

export const Home: React.FC = () => (
  <div className="text-white text-lg">🏠</div>
);

export const CompanyLogo: React.FC<{ src?: string }> = ({ src }) => {
  if (src) {
    return <Image src={src} width="60" height="41" alt="Company Logo" />;
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="60"
      height="41"
      viewBox="0 0 60 41"
      fill="none"
    >
      <path
        d="M12.7905 7.42385L1.20752 31.1693C-0.502414 34.6745 1.17634 38.2925 4.9571 39.2503C8.73794 40.2081 13.189 38.1427 14.899 34.6375L26.482 10.892C28.192 7.38677 26.5131 3.76859 22.7323 2.81097C18.9515 1.85316 14.5005 3.91858 12.7905 7.42385Z"
        fill="url(#paint0_linear_7768_1391)"
      />
      <path
        d="M27.7745 7.0597L34.9048 21.6752C36.5827 25.1143 34.9357 28.6641 31.2263 29.6037C27.5169 30.5435 23.1499 28.5174 21.4722 25.0783L14.3417 10.4628C12.6637 7.02373 14.3107 3.47396 18.0201 2.53433C21.7295 1.59451 26.0967 3.62062 27.7745 7.0597Z"
        fill="url(#paint1_linear_7768_1391)"
      />
      <path
        d="M30.0391 7.08014L22.9286 21.6547C21.2453 25.1051 22.8975 28.6665 26.6189 29.6095C30.3406 30.5523 34.7221 28.5195 36.4055 25.0691L43.5158 10.4946C45.1993 7.04417 43.547 3.48272 39.8253 2.53993C36.1039 1.59696 31.7224 3.62975 30.0391 7.08014Z"
        fill="url(#paint2_linear_7768_1391)"
      />
      <path
        d="M45.5962 7.19045L57.2931 31.1693C59.0031 34.6746 57.3244 38.2927 53.5436 39.2504C49.7629 40.2082 45.3116 38.1427 43.6017 34.6375L31.9048 10.6586C30.1948 7.15337 31.8737 3.53519 35.6544 2.57757C39.435 1.61976 43.8864 3.68518 45.5962 7.19045Z"
        fill="url(#paint3_linear_7768_1391)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_7768_1391"
          x1="4.04851"
          y1="38.9984"
          x2="28.5694"
          y2="6.83259"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#69DEC6" />
          <stop offset="1" stopColor="#49C2D4" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_7768_1391"
          x1="16.9186"
          y1="3.08128"
          x2="44.3829"
          y2="35.4655"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#48C2D4" />
          <stop offset="1" stopColor="#1595EA" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_7768_1391"
          x1="25.1579"
          y1="29.422"
          x2="62.1925"
          y2="-12.9475"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#1695EA" />
          <stop offset="1" stopColor="#548CE7" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_7768_1391"
          x1="36.5681"
          y1="2.06437"
          x2="61.2194"
          y2="35.6826"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#518DE7" />
          <stop offset="1" stopColor="#7687E5" />
        </linearGradient>
      </defs>
    </svg>
  );
};

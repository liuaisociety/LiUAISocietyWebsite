import Image from "next/image";
import { ArcSceneClient } from "@/components/home/ArcSceneClient";

export default function LogoPage() {
  return (
    <div className="logo-page">
      <ArcSceneClient />
      <div className="logo-page-content">
        <Image
          src="/images/AI%20Society%20LiU.svg"
          className="hero-wordmark logo-page-wordmark"
          alt="LiU AI Society"
          width={656}
          height={188}
          priority
        />
        <p className="hero-subtitle logo-page-subtitle">Linköping University</p>
      </div>
    </div>
  );
}

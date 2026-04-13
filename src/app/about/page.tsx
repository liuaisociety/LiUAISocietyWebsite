import type { Metadata } from "next";
import Image from "next/image";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "About | LiU AI Society",
  description:
    "Meet the board and founders of LiU AI Society — Linköping University's student association for AI. Learn who leads the organisation and how to get in touch.",
  openGraph: {
    title: "About | LiU AI Society",
    description:
      "Meet the board and founders of LiU AI Society — Linköping University's student association for AI. Learn who leads the organisation and how to get in touch.",
    url: "https://liuais.se/about",
  },
};

const boardMembers = [
  { name: "Nils Alenäs",             role: "President",              img: "NilsAlenas-BRO-wBIP.jpeg",            linkedin: "https://www.linkedin.com/in/nils-alen%C3%A4s-7a3214324",          email: "nils@liuais.com" },
  { name: "Pontus Hedman",           role: "Vice President",         img: "PontusHedman-DBplX17Q.jpeg",          linkedin: "https://www.linkedin.com/in/pontus-hedman/",                        email: "pontus@liuais.com" },
  { name: "Simon Harrysson",         role: "Treasurer & Business",   img: "SimonHarrysson-BQdNKskJ.jpeg",        linkedin: "https://www.linkedin.com/in/simonharrysson",                        email: "simon@liuais.com" },
  { name: "Daniel Walker Tunek",     role: "Business",               img: "DanielWalkerTunek-CyZne9Jw.jpeg",     linkedin: "https://www.linkedin.com/in/daniel-walker-tunek-b75474330/",        email: "daniel@liuais.com" },
  { name: "Emil Bergqvist",          role: "Education",              img: "EmilBergqvist-CcZ_4YTj.jpeg",         linkedin: "https://www.linkedin.com/in/emil-bergqvist-6b6b61195/",             email: "emil@liuais.com" },
  { name: "Veronica Avendaño Velez", role: "Communication",          img: "VeronicaAvendanoVelez-C59k46VE.jpeg", linkedin: "https://www.linkedin.com/in/veronica-avendano-velez-6b3052197/",    email: "veronica@liuais.com" },
  { name: "Karl-Henrik Gallarbo",    role: "Communication",          img: "KarlHenrikGallarbo-Cug4Us2S.jpeg",    linkedin: "https://www.linkedin.com/in/karl-henrik-gallardo-0553201a4/",       email: "karl-henrik@liuais.com" },
  { name: "William Eriksson",        role: "Development",            img: "WilliamEriksson-CfcKhA2J.jpeg",       linkedin: "https://www.linkedin.com/in/william-eriksson-01691a193/",           email: "william@liuais.com" },
  { name: "Tobias Berglind",         role: "Development",            img: "TobiasBerglind-krgdcTuI.jpeg",        linkedin: "https://www.linkedin.com/in/tobias-berglind",                       email: "tobias@liuais.com" },
  { name: "Emma Bertmar",            role: "Development",            img: "emma.png",                             linkedin: "https://www.linkedin.com/in/emma-bertmar-b43006339/",               email: "emma@liuais.com" },
  { name: "Fredrik Kämmerling",      role: "Development",            img: "fredrik.png",                          linkedin: "https://www.linkedin.com/in/fredrik-kammerling/",                   email: "fredrik@liuais.com" },
  { name: "Gabriel Engström",        role: "Development",            img: "gabriel_cb_2.png",                     linkedin: "https://www.linkedin.com/in/gabriel-engstrom/",                     email: "gabriel@liuais.com" },
  { name: "Martin Hallbäck",         role: "Communication",          img: "martin.png",                           linkedin: "https://www.linkedin.com/in/martin-hallback/",                      email: "martin.h@liuais.com" },
  { name: "Joel Hultman",            role: "Communication",          img: "joel.png",                             linkedin: "https://www.linkedin.com/in/joel-hultman/",                         email: "joel@liuais.com" },
  { name: "Johan Hultgren",          role: "Business",               img: "johan.png",                            linkedin: "https://www.linkedin.com/in/johan-hultgren-3991a2265/",             email: "johan@liuais.com" },
];

const founders = [
  { name: "Niklas Wretblad",  role: "Founder",    img: "founders/Niklas Wretblad-BMal3_Aj.jpeg", linkedin: "https://www.linkedin.com/in/niklaswretblad/",         posX: "left center" },
  { name: "Fredrik Gordh",    role: "Co-Founder", img: "founders/FredrikGordh-Cg8TIzSp.jpeg",    linkedin: "https://www.linkedin.com/in/fredrik-gordh-riseby/" },
  { name: "Erik Larsson",     role: "Co-Founder", img: "founders/ErikLarsson-uK5pZ8ot.jpeg",     linkedin: "https://www.linkedin.com/in/erik-larsson-b19b42183/" },
  { name: "Axel Wiksäter",   role: "Co-Founder", img: "founders/AxelWiksäter-BTuHUF4k.jpeg",    linkedin: "https://www.linkedin.com/in/axel-wiks%C3%A4ter-536785218/" },
];

type Member = { name: string; role: string; img: string; linkedin: string; email?: string; posX?: string };

function MemberCard({ member }: { member: Member }) {
  return (
    <div className="member-card">
      <div className="member-img">
        <Image
          src={`/images/board-members/${member.img}`}
          alt={member.name}
          fill
          sizes="(max-width: 600px) 50vw, 160px"
          style={{ objectFit: "cover", objectPosition: member.posX ?? "center" }}
        />
      </div>
      <h3 className="member-name">{member.name}</h3>
      <p className="member-role">{member.role}</p>
      <div className="member-icons">
        <a href={member.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn" className="member-icon-link">
          <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
        </a>
        {member.email && (
          <a href={`mailto:${member.email}`} aria-label="Email" className="member-icon-link">
            <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z"/><path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z"/></svg>
          </a>
        )}
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <>
      <Nav />
      <div className="about-content about-page">
        <section className="about-intro">
          <h1 className="section-heading">The Board</h1>
          <p className="about-description">Meet the dedicated team driving LiU AI Society&apos;s mission to connect students with the world of artificial intelligence.</p>
        </section>

        <section className="about-section">
          <div className="members-grid">
            {boardMembers.map(m => <MemberCard key={m.name} member={m} />)}
          </div>
        </section>

        <section className="about-section">
          <h2 className="section-heading">Founders</h2>
          <div className="members-grid">
            {founders.map(m => <MemberCard key={m.name} member={m} />)}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

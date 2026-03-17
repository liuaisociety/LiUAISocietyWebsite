import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";

const boardMembers = [
  { name: "Nils Alenäs",           role: "President",              img: "NilsAlenas-BRO-wBIP.jpeg",         linkedin: "https://www.linkedin.com/in/nils-alen%C3%A4s-7a3214324" },
  { name: "Pontus Hedman",         role: "Vice President",         img: "PontusHedman-DBplX17Q.jpeg",       linkedin: "https://www.linkedin.com/in/pontus-hedman/" },
  { name: "Simon Harrysson",       role: "Treasurer & Business",   img: "SimonHarrysson-BQdNKskJ.jpeg",    linkedin: "https://www.linkedin.com/in/simonharrysson" },
  { name: "Daniel Walker Tunek",   role: "Business",               img: "DanielWalkerTunek-CyZne9Jw.jpeg", linkedin: "https://www.linkedin.com/in/daniel-walker-tunek-b75474330/" },
  { name: "William Eriksson",      role: "Event",                  img: "WilliamEriksson-CfcKhA2J.jpeg",   linkedin: "https://www.linkedin.com/in/william-eriksson-01691a193/" },
  { name: "Tobias Berglind",       role: "Event",                  img: "TobiasBerglind-krgdcTuI.jpeg",    linkedin: "https://www.linkedin.com/in/tobias-berglind" },
  { name: "Emil Bergqvist",        role: "Education",              img: "EmilBergqvist-CcZ_4YTj.jpeg",     linkedin: "https://www.linkedin.com/in/emil-bergqvist-6b6b61195/" },
  { name: "Veronica Avendaño Velez", role: "Communication",        img: "VeronicaAvendanoVelez-C59k46VE.jpeg", linkedin: "https://www.linkedin.com/in/veronica-avendano-velez-6b3052197/" },
  { name: "Karl-Henrik Gallarbo", role: "Communication",           img: "KarlHenrikGallarbo-Cug4Us2S.jpeg", linkedin: "https://www.linkedin.com/in/karl-henrik-gallardo-0553201a4/" },
  // { name: "Oscar Gustafsson",      role: "IT & Web",               img: "OscarGustafsson-DViJhA2g.jpeg",   linkedin: "https://www.linkedin.com/in/oscar-gustafsson-7304111a2/" },
  { name: "Emma Bertmar",          role: "Development",            img: "emma.png",                         linkedin: "https://www.linkedin.com/in/emma-bertmar-b43006339/" },
  { name: "Fredrik Kämmerling",   role: "Development",            img: "fredrik.png",                      linkedin: "https://www.linkedin.com/in/fredrik-kammerling/" },
  { name: "Gabriel Engström",     role: "Development",            img: "gabriel_cb_2.png",                 linkedin: "https://www.linkedin.com/in/gabriel-engstrom/" },
  { name: "Martin Hallbäck",      role: "Communication",          img: "martin.png",                       linkedin: "https://www.linkedin.com/in/martin-hallback/" },
  { name: "Joel Hultman",         role: "Communication",          img: "joel.png",                         linkedin: "https://www.linkedin.com/in/joel-hultman/" },
  { name: "Johan Hultgren",       role: "Business",               img: "johan.png",                        linkedin: "https://www.linkedin.com/in/johan-hultgren-3991a2265/" },
];

const founders = [
  { name: "Niklas Wretblad",  role: "Founder",    img: "founders/Niklas Wretblad-BMal3_Aj.jpeg", linkedin: "https://www.linkedin.com/in/niklaswretblad/", posX: "left center" },
  { name: "Fredrik Gordh",    role: "Co-Founder", img: "founders/FredrikGordh-Cg8TIzSp.jpeg",    linkedin: "https://www.linkedin.com/in/fredrik-gordh-riseby/" },
  { name: "Erik Larsson",     role: "Co-Founder", img: "founders/ErikLarsson-uK5pZ8ot.jpeg",     linkedin: "https://www.linkedin.com/in/erik-larsson-b19b42183/" },
  { name: "Axel Wiksäter",   role: "Co-Founder", img: "founders/AxelWiksäter-BTuHUF4k.jpeg",    linkedin: "https://www.linkedin.com/in/axel-wiks%C3%A4ter-536785218/" },
];

function MemberCard({ member }: { member: typeof boardMembers[0] & { posX?: string } }) {
  return (
    <a href={member.linkedin} target="_blank" rel="noopener" className="member-card">
      <div className="member-img" style={{ backgroundImage: `url('/images/board-members/${member.img}')`, backgroundPosition: (member as { posX?: string }).posX ?? "center" }} />
      <h3 className="member-name">{member.name}</h3>
      <p className="member-role">{member.role}</p>
    </a>
  );
}

export default function AboutPage() {
  return (
    <>
      <Nav />
      <div className="about-content">
        <section className="about-intro">
          <h2 className="section-heading">The Board</h2>
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

import type { Metadata } from "next";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "AI Courses at LiU | LiU AI Society",
  description:
    "Discover AI, machine learning, NLP, computer vision, and robotics courses at Linköping University — curated by LiU AI Society to help you build your expertise.",
  openGraph: {
    title: "AI Courses at LiU | LiU AI Society",
    description:
      "Discover AI, machine learning, NLP, computer vision, and robotics courses at Linköping University — curated by LiU AI Society to help you build your expertise.",
    url: "https://liuais.se/courses",
  },
};

const generalCourses = [
  { code: "TDDE01", name: "Machine Learning",                                        area: "General",         semester: "Autumn", period: "2", block: "1", credits: "6",  level: "A1X", ec: "V" },
  { code: "TDDE15", name: "Advanced Machine Learning",                               area: "General",         semester: "Autumn", period: "1", block: "1", credits: "6",  level: "A1X", ec: "E" },
  { code: "TDDE19", name: "Advanced Project Course - AI and Machine Learning",       area: "General",         semester: "Autumn", period: "1", block: "4", credits: "6*", level: "A1X", ec: "E" },
  { code: "TNM114", name: "Artificial Intelligence for Interactive Media, Project",  area: "General",         semester: "Autumn", period: "1", block: "2", credits: "6",  level: "A1X", ec: "E" },
  { code: "TDDD89", name: "Scientific Method",                                       area: "General",         semester: "Autumn", period: "2", block: "3", credits: "6",  level: "A1X", ec: "C" },
  { code: "TDDC17", name: "Artificial Intelligence",                                 area: "General",         semester: "Autumn", period: "1", block: "3", credits: "6",  level: "G2X", ec: "C" },
  { code: "TNM095", name: "Artificial Intelligence for Interactive Media",           area: "General",         semester: "Autumn", period: "1", block: "2", credits: "6",  level: "A1X", ec: "E" },
  { code: "TDDD48", name: "Automated Planning",                                      area: "General",         semester: "Spring", period: "2", block: "1", credits: "6",  level: "A1X", ec: "E" },
  { code: "TDDD08", name: "Logic Programming",                                       area: "General",         semester: "Autumn", period: "1", block: "4", credits: "6",  level: "A1X", ec: "E" },
  { code: "TBMI26", name: "Neural Networks and Learning Systems",                    area: "Neural Networks", semester: "Spring", period: "1", block: "2", credits: "6",  level: "A1X", ec: "E" },
  { code: "TDDE70", name: "Deep Learning",                                           area: "Neural Networks", semester: "Spring", period: "1", block: "1", credits: "6",  level: "A1X", ec: "E" },
];

const appliedCourses = [
  { code: "TSBB19", name: "Machine Learning for Computer Vision",                             area: "Computer Vision", semester: "Autumn", period: "1",     block: "2",    credits: "6",  level: "A1X", ec: "E" },
  { code: "TBMI02", name: "Medical Image Analysis",                                           area: "Computer Vision", semester: "Autumn", period: "2",     block: "1",    credits: "6",  level: "A1X", ec: "E" },
  { code: "TSBB34", name: "Computer Vision for Video Analysis",                               area: "Computer Vision", semester: "Spring", period: "2",     block: "-",    credits: "6",  level: "A1X", ec: "E" },
  { code: "TSBB33", name: "3D Computer Vision",                                               area: "Computer Vision", semester: "Spring", period: "2",     block: "-",    credits: "6",  level: "A1X", ec: "E" },
  { code: "TSBB06", name: "Multidimensional Signal Analysis",                                 area: "Computer Vision", semester: "Autumn", period: "1 & 2", block: "",     credits: "6",  level: "A1X", ec: "E" },
  { code: "TBMI04", name: "eHealth: Aims and Applications",                                   area: "Medtech",         semester: "Autumn", period: "2",     block: "2 & 4",credits: "6",  level: "G2X", ec: "E" },
  { code: "TDDE09", name: "Natural Language Processing",                                      area: "NLP",             semester: "Spring", period: "1",     block: "2",    credits: "6",  level: "A1X", ec: "E" },
  { code: "TDDE16", name: "Text Mining",                                                      area: "NLP",             semester: "Autumn", period: "2",     block: "2",    credits: "6",  level: "A1X", ec: "E" },
  { code: "TDDE05", name: "AI Robotics",                                                      area: "Robotics",        semester: "Spring", period: "1",     block: "4",    credits: "6*", level: "A1X", ec: "E" },
  { code: "TSRT14", name: "Sensor Fusion",                                                    area: "Robotics",        semester: "Spring", period: "1",     block: "3",    credits: "6",  level: "A1X", ec: "E" },
  { code: "TSFS12", name: "Autonomous Vehicles - Planning, Control, and Learning Systems",    area: "Robotics",        semester: "Autumn", period: "1",     block: "1",    credits: "6",  level: "A1X", ec: "E" },
  { code: "TSRT92", name: "Modelling and Learning for Dynamical Systems",                     area: "Robotics",        semester: "Autumn", period: "1",     block: "3",    credits: "6",  level: "A1X", ec: "E" },
];

const statisticsCourses = [
  { code: "TDDE07", name: "Bayesian Learning",                                               area: "Statistics", semester: "Spring", period: "2", block: "2", credits: "6",  level: "A1X", ec: "E" },
  { code: "TAMS43", name: "Probability Theory and Bayesian Networks",                        area: "Statistics", semester: "Autumn", period: "1", block: "4", credits: "6*", level: "A1X", ec: "E" },
  { code: "TPPE78", name: "Quantitative Models and Analysis in Operations Management",       area: "Statistics", semester: "Spring", period: "1", block: "1", credits: "6",  level: "A1X", ec: "E" },
  { code: "TAMS41", name: "Statistisk modellering med regressionsmetoder",                  area: "Statistics", semester: "Autumn", period: "2", block: "3", credits: "6",  level: "A1X", ec: "V" },
];

function CourseTable({ courses }: { courses: typeof generalCourses }) {
  return (
    <div className="table-wrap">
      <table className="course-table">
        <thead>
          <tr>
            <th>Code</th><th>Name</th><th>Area</th><th>Semester</th>
            <th>Period</th><th>Block</th><th>Credits</th><th>Level</th><th>E/C</th>
          </tr>
        </thead>
        <tbody>
          {courses.map(c => (
            <tr key={c.code}>
              <td><a href={`https://studieinfo.liu.se/en/kurs/${c.code}`} target="_blank" rel="noopener">{c.code}</a></td>
              <td>{c.name}</td><td>{c.area}</td><td>{c.semester}</td>
              <td>{c.period}</td><td>{c.block}</td><td>{c.credits}</td>
              <td>{c.level}</td><td>{c.ec}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CoursesPage() {
  return (
    <>
      <Nav />
      <div className="courses-content">
        <section className="courses-intro">
          <h1 className="page-heading">Courses</h1>
          <p className="courses-description">Discover AI and machine learning courses offered at Linköping University to build your expertise.</p>
        </section>

        <section className="courses-section">
          <h2 className="section-heading">General AI &amp; Machine Learning</h2>
          <CourseTable courses={generalCourses} />
        </section>

        <section className="courses-section">
          <h2 className="section-heading">Applied AI &amp; Machine Learning</h2>
          <CourseTable courses={appliedCourses} />
        </section>

        <section className="courses-section">
          <h2 className="section-heading">Statistics</h2>
          <CourseTable courses={statisticsCourses} />
        </section>
      </div>
      <Footer />
    </>
  );
}

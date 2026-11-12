/* MANHAL — demo data (clearly labelled as sample data in the UI) */

const SUBJECTS = [
  { id: "math", ar: "رياضيات", en: "Mathematics" },
  { id: "arabic", ar: "لغة عربية", en: "Arabic" },
  { id: "english", ar: "لغة إنجليزية", en: "English" },
  { id: "science", ar: "علوم", en: "Science" },
  { id: "physics", ar: "فيزياء", en: "Physics" },
  { id: "chemistry", ar: "كيمياء", en: "Chemistry" },
  { id: "biology", ar: "أحياء", en: "Biology" },
  { id: "ict", ar: "حاسوب", en: "Computer Science" },
  { id: "islamic", ar: "تربية إسلامية", en: "Islamic Studies" },
  { id: "social", ar: "دراسات اجتماعية", en: "Social Studies" }
];

const GRADES = [
  { id: "primary", ar: "ابتدائي", en: "Primary" },
  { id: "middle", ar: "متوسط", en: "Middle school" },
  { id: "secondary", ar: "ثانوي", en: "Secondary" }
];

const DISTRICTS = [
  { id: "mukalla", ar: "المكلا القديمة", en: "Old Mukalla" },
  { id: "fuh", ar: "فوه", en: "Fuwah" },
  { id: "dis", ar: "الديس", en: "Al-Dis" },
  { id: "sharj", ar: "الشرج", en: "Al-Sharj" },
  { id: "rokob", ar: "روكب", en: "Rokob" },
  { id: "buwaysh", ar: "بويش", en: "Buwaysh" },
  { id: "khalaf", ar: "خلف", en: "Khalaf" },
  { id: "jul-mas-ha", ar: "جول مسحة", en: "Jul Mas-ha" },
  { id: "ghalilah", ar: "الغليلة", en: "Al-Ghalilah" }
];

const MODES = [
  { id: "inperson", key: "common.inperson" },
  { id: "online", key: "common.online" },
  { id: "both", key: "common.both" }
];

const TEACHERS = [
  {
    id: "t1",
    name: "أ. سارة بامطرف",
    nameEn: "Sara Bamatraf",
    subject: "math",
    grades: ["middle", "secondary"],
    district: "mukalla",
    mode: "both",
    experience: 9,
    price: 4500,
    rating: 4.9,
    reviews: 38,
    verified: { identity: true, qualification: true, experience: true },
    availability: "instant",
    match: 96,
    bio: "معلمة رياضيات بخبرة تسع سنوات في المرحلة المتوسطة والثانوية، متخصصة في تبسيط الجبر والهندسة وبناء أساس قوي للطلاب.",
    bioEn: "Mathematics teacher with nine years of experience in middle and secondary school, specialising in simplifying algebra and geometry."
  },
  {
    id: "t2",
    name: "أ. أحمد بن سلمان",
    nameEn: "Ahmed bin Salman",
    subject: "physics",
    grades: ["secondary"],
    district: "mukalla",
    mode: "inperson",
    experience: 12,
    price: 5500,
    rating: 4.8,
    reviews: 27,
    verified: { identity: true, qualification: true, experience: false },
    availability: "partial",
    match: 91,
    bio: "مدرس فيزياء للمرحلة الثانوية، خبرة في تدريس المنهج اليمني والدولي، وتركيز على حل المسائل والتجارب العملية.",
    bioEn: "Secondary physics teacher with experience in Yemeni and international curricula, focused on problem solving and practical experiments."
  },
  {
    id: "t3",
    name: "أ. نورة العولقي",
    nameEn: "Noura Al-Awlaki",
    subject: "english",
    grades: ["primary", "middle"],
    district: "sharj",
    mode: "both",
    experience: 6,
    price: 3500,
    rating: 4.9,
    reviews: 44,
    verified: { identity: true, qualification: true, experience: true },
    availability: "instant",
    match: 94,
    bio: "معلمة لغة إنجليزية متخصصة في المهارات الأساسية للمرحلة الابتدائية والمتوسطة، مع أنشطة تفاعلية ومتابعة أسبوعية.",
    bioEn: "English teacher focused on core skills for primary and middle school, with interactive activities and weekly follow-up."
  },
  {
    id: "t4",
    name: "أ. خالد الحبشي",
    nameEn: "Khalid Al-Habashi",
    subject: "ict",
    grades: ["middle", "secondary"],
    district: "fuh",
    mode: "online",
    experience: 7,
    price: 4000,
    rating: 4.7,
    reviews: 19,
    verified: { identity: true, qualification: false, experience: false },
    availability: "partial",
    match: 87,
    bio: "مدرّس حاسوب وبرمجة، يقدّم دروسًا عن بُعد في الأساسيات والبرمجة بلغة بايثون ومهارات الحاسب.",
    bioEn: "Computer science and programming tutor offering online lessons in fundamentals and Python."
  },
  {
    id: "t5",
    name: "أ. مريم باوزير",
    nameEn: "Maryam Bawazir",
    subject: "arabic",
    grades: ["primary", "middle"],
    district: "dis",
    mode: "inperson",
    experience: 11,
    price: 3800,
    rating: 5.0,
    reviews: 52,
    verified: { identity: true, qualification: true, experience: true },
    availability: "instant",
    match: 93,
    bio: "معلمة لغة عربية بخبرة أحد عشر عامًا، متخصصة في القراءة والكتابة والإملاء وتأسيس الطلاب في المرحلة الابتدائية.",
    bioEn: "Arabic teacher with eleven years of experience in reading, writing and foundational literacy for primary students."
  },
  {
    id: "t6",
    name: "أ. عبدالله بن حفيظ",
    nameEn: "Abdullah bin Hafiz",
    subject: "chemistry",
    grades: ["secondary"],
    district: "rokob",
    mode: "both",
    experience: 15,
    price: 6000,
    rating: 4.8,
    reviews: 31,
    verified: { identity: true, qualification: true, experience: true },
    availability: "booked",
    match: 84,
    bio: "مدرس كيمياء للمرحلة الثانوية بخبرة خمسة عشر عامًا، مع متابعة نتائج الطلاب وتدريبات على أسئلة الاختبارات.",
    bioEn: "Secondary chemistry teacher with fifteen years of experience, including exam practice and student progress tracking."
  },
  {
    id: "t7",
    name: "أ. هند السقاف",
    nameEn: "Hind Al-Saqqaf",
    subject: "science",
    grades: ["primary", "middle"],
    district: "khalaf",
    mode: "both",
    experience: 5,
    price: 3200,
    rating: 4.6,
    reviews: 16,
    verified: { identity: true, qualification: false, experience: false },
    availability: "instant",
    match: 90,
    bio: "معلمة علوم للمرحلة الابتدائية والمتوسطة، تعتمد الشرح المبسّط والأنشطة العملية لتقريب المفاهيم العلمية.",
    bioEn: "Science teacher for primary and middle school, using simple explanations and hands-on activities."
  },
  {
    id: "t8",
    name: "أ. ياسر بن عمر",
    nameEn: "Yasser bin Omar",
    subject: "social",
    grades: ["middle", "secondary"],
    district: "buwaysh",
    mode: "inperson",
    experience: 8,
    price: 3600,
    rating: 4.5,
    reviews: 12,
    verified: { identity: true, qualification: true, experience: false },
    availability: "partial",
    match: 81,
    bio: "مدرس دراسات اجتماعية وتاريخ، يهتم بربط المنهج بالسياق المحلي وتنمية مهارات التحليل لدى الطلاب.",
    bioEn: "Social studies and history teacher who connects the curriculum to local context and builds analytical skills."
  }
];

const REQUESTS = [
  { id: "REQ-1042", title: "معلم رياضيات — الصف الثالث الثانوي", type: "urgent", status: "open", date: "2026-11-08", applicants: 4 },
  { id: "REQ-1038", title: "وظيفة: معلمة لغة إنجليزية — متوسط", type: "job", status: "review", date: "2026-11-04", applicants: 9 },
  { id: "REQ-1029", title: "مدرس خصوصي فيزياء — حضوري", type: "contact", status: "accepted", date: "2026-10-29", applicants: 1 },
  { id: "REQ-1018", title: "معلمة علوم — ابتدائي", type: "urgent", status: "closed", date: "2026-10-20", applicants: 6 }
];

const TEACHER_REQUESTS = [
  { id: "RQ-2201", from: "مدرسة النهضة الأهلية", subject: "math", grade: "secondary", district: "mukalla", mode: "inperson", date: "2026-11-09", status: "pending" },
  { id: "RQ-2198", from: "ولي أمر — أحمد ب.", subject: "math", grade: "middle", district: "mukalla", mode: "both", date: "2026-11-07", status: "accepted" },
  { id: "RQ-2190", from: "مدرسة الأمل", subject: "physics", grade: "secondary", district: "sharj", mode: "inperson", date: "2026-11-02", status: "declined" }
];

const NOTIFICATIONS = [
  { id: "n1", text: "طلب تواصل جديد من مدرسة النهضة الأهلية", textEn: "New contact request from Al-Nahda School", time: "قبل ساعتين", timeEn: "2 hours ago", unread: true },
  { id: "n2", text: "تم توثيق مؤهلك العلمي بنجاح", textEn: "Your qualification has been verified", time: "أمس", timeEn: "Yesterday", unread: true },
  { id: "n3", text: "طلب عاجل مطابق لموادك في المكلا", textEn: "Urgent request matching your subjects in Mukalla", time: "قبل 3 أيام", timeEn: "3 days ago", unread: false }
];

/* Helpers */
const SUBJ = (id) => SUBJECTS.find((s) => s.id === id) || { ar: id, en: id };
const GRADE = (id) => GRADES.find((g) => g.id === id) || { ar: id, en: id };
const DIST = (id) => DISTRICTS.find((d) => d.id === id) || { ar: id, en: id };
const MODE_LABEL = (id) => (MODES.find((m) => m.id === id) || { key: id }).key;

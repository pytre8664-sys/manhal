import { TEACHERS, type Teacher } from "./data";
import { supabase } from "./supabase";

export type TeacherRow = {
  id: string;
  name: string;
  name_en: string | null;
  subject: string;
  grades: string[] | null;
  district: string;
  mode: string;
  experience: number | null;
  price: number | null;
  rating: number | null;
  reviews: number | null;
  verified_identity: boolean | null;
  verified_qualification: boolean | null;
  verified_experience: boolean | null;
  availability: string | null;
  match: number | null;
  bio: string | null;
  bio_en: string | null;
  published: boolean | null;
};

export function mapTeacher(row: TeacherRow): Teacher {
  return {
    id: row.id,
    name: row.name,
    nameEn: row.name_en || row.name,
    subject: row.subject,
    grades: row.grades || [],
    district: row.district,
    mode: row.mode,
    experience: row.experience ?? 0,
    price: row.price ?? 0,
    rating: Number(row.rating ?? 0),
    reviews: row.reviews ?? 0,
    verified: {
      identity: Boolean(row.verified_identity),
      qualification: Boolean(row.verified_qualification),
      experience: Boolean(row.verified_experience),
    },
    availability: row.availability || "booked",
    match: row.match ?? 0,
    bio: row.bio || "",
    bioEn: row.bio_en || "",
  };
}

export async function fetchTeachers(): Promise<{ teachers: Teacher[]; live: boolean }> {
  if (!supabase) return { teachers: TEACHERS, live: false };
  const { data, error } = await supabase
    .from("teachers")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });
  if (error) return { teachers: TEACHERS, live: false };
  const rows = (data as TeacherRow[] | null) || [];
  return { teachers: rows.map(mapTeacher), live: true };
}

export async function fetchAllTeachersForAdmin(): Promise<TeacherRow[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("teachers")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as TeacherRow[]) || [];
}

export type RequestRecord = {
  id: string;
  title: string;
  type: string;
  status: string;
  date: string;
  applicants: number;
  notes: string | null;
};

export type VacancyRecord = {
  id: string;
  title: string;
  subject: string;
  grade: string;
  district: string;
  type: string;
  salary: string | null;
  deadline: string | null;
  description: string | null;
  requirements: string | null;
  published: boolean | null;
};

export async function fetchRequests(): Promise<RequestRecord[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("requests")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as RequestRecord[]) || [];
}

export async function fetchVacancies(): Promise<VacancyRecord[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("vacancies")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as VacancyRecord[]) || [];
}

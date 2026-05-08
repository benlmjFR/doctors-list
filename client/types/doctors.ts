export type Doctor = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  city: string;
  specialty: string;
  years_experience: number;
  status: "active" | "retired";
  rating: number;
  created_at: string;
  updated_at: string;
};

export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

export interface CropData {
  id: string;
  crop_name: string;
  variety: string;
  planting_date: string;
  status:
  | "planned"
  | "planted"
  | "growing"
  | "flowering"
  | "harvested"
  | "failed";
  yield_amount: number | null;
  country: string;
  region: string;
}

export interface CropDetail extends CropData {
  scientific_name?: string;
  field_id?: string;
  plot_number?: string;
  latitude?: string;
  longitude?: string;
  soil_type?: string;
  irrigation_type?: string;
  growing_season?: string;
  expected_harvest_date?: string;
  actual_harvest_date?: string;
  yield_quality_grade?: string;
  plant_height_cm?: string;
  fertilizer_type?: string;
  fertilizer_amount_kg?: string;
  pesticide_applied?: boolean;
  pesticide_type?: string;
  avg_temperature_c?: string;
  total_rainfall_mm?: string;
  researcher_name?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
}

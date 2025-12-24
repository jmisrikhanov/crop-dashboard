import { apiClient } from "./apiClient";

export interface FormPayload {
  fullName: string;
  email: string;
  password?: string;
  phone?: string;
  age?: number;
  website?: string;
  bio?: string;
  country?: string;
  agreeTerms: boolean;
  contactMethod: "email" | "phone" | "both";
}

export const formService = {
  submit: async (data: FormPayload): Promise<void> => {
    const payload = {
      full_name: data.fullName,
      email: data.email,
      password: data.password,
      phone: data.phone,
      age: data.age,
      website: data.website,
      bio: data.bio,
      country: data.country,
      agree_terms: data.agreeTerms,
      contact_method: data.contactMethod,
    };

    await apiClient.post("/api/form/submit/", payload);
  },
};

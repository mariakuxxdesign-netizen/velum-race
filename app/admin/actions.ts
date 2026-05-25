"use server";

import { revalidatePath } from "next/cache";
import { Clinic, saveClinics } from "@/lib/clinics";

export async function saveClinicList(clinics: Clinic[]) {
  await saveClinics(clinics);
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function uploadClinicImage(formData: FormData) {
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Please choose an image file.");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files can be uploaded.");
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    throw new Error("Supabase is not configured yet.");
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeName = `${crypto.randomUUID()}.${extension}`;
  const objectPath = `clinics/${safeName}`;
  const uploadUrl = `${supabaseUrl}/storage/v1/object/clinic-images/${objectPath}`;

  const uploadResponse = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${serviceKey}`,
      apikey: serviceKey,
      "Content-Type": file.type,
      "x-upsert": "true"
    },
    body: file
  });

  if (!uploadResponse.ok) {
    const details = await uploadResponse.text();
    throw new Error(`Image upload failed: ${details}`);
  }

  return `${supabaseUrl}/storage/v1/object/public/clinic-images/${objectPath}`;
}

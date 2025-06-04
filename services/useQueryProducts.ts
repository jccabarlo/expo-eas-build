import { useQuery } from "@tanstack/react-query";
import { supabase } from "~/lib/supabase";

export function useQueryProducts() {
  const query = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  return query;
}

export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
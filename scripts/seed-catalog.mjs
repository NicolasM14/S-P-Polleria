/**
 * Carga el catálogo S&F en Supabase (mismo contenido que seed-catalog-sf.sql).
 * Uso: node scripts/seed-catalog.mjs
 * Requiere .env.local con NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY
 * (o anon key si RLS lo permite para inserts de prueba).
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnv() {
  const path = join(root, ".env.local");
  if (!existsSync(path)) {
    console.error("Falta .env.local");
    process.exit(1);
  }
  const env = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
  return env;
}

const env = loadEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key =
  env.SUPABASE_SERVICE_ROLE_KEY ||
  env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("Faltan NEXT_PUBLIC_SUPABASE_URL y una key en .env.local");
  process.exit(1);
}

const supabase = createClient(url, key);

const categories = [
  { name: "Por kilo", sort_order: 1 },
  { name: "Elaborados", sort_order: 2 },
  { name: "Huevos", sort_order: 3 },
];

const catalog = [
  { category: "Por kilo", name: "Milanesa", sale_unit: "kg", price: 9000 },
  { category: "Por kilo", name: "Alitas", sale_unit: "kg", price: 4000 },
  { category: "Por kilo", name: "Pata muslo", sale_unit: "kg", price: 5000 },
  { category: "Por kilo", name: "Trozado de pollo", sale_unit: "kg", price: 5800 },
  { category: "Por kilo", name: "Pechuga", sale_unit: "kg", price: 14000 },
  { category: "Por kilo", name: "Menudo", sale_unit: "kg", price: 2500 },
  { category: "Por kilo", name: "Puchero", sale_unit: "kg", price: 2000 },
  { category: "Por kilo", name: "Pollo entero", sale_unit: "kg", price: 5500 },
  { category: "Elaborados", name: "Albóndigas", sale_unit: "kg", price: 6500 },
  { category: "Elaborados", name: "Albóndigas rellenas", sale_unit: "kg", price: 7000 },
  { category: "Elaborados", name: "Kupi común", sale_unit: "kg", price: 7500 },
  { category: "Elaborados", name: "Kupi relleno", sale_unit: "kg", price: 8000 },
  { category: "Elaborados", name: "Crocantes común", sale_unit: "kg", price: 7500 },
  { category: "Elaborados", name: "Crocantes rellenos", sale_unit: "kg", price: 7500 },
  {
    category: "Huevos",
    name: "Maple huevos selección (30 u.)",
    sale_unit: "unit",
    price: 6000,
  },
];

async function main() {
  const catMap = new Map();

  for (const cat of categories) {
    const { data: existing } = await supabase
      .from("categories")
      .select("id, name")
      .eq("name", cat.name)
      .maybeSingle();

    if (existing) {
      catMap.set(cat.name, existing.id);
      await supabase.from("categories").update({ sort_order: cat.sort_order }).eq("id", existing.id);
      continue;
    }

    const { data, error } = await supabase
      .from("categories")
      .insert(cat)
      .select("id, name")
      .single();
    if (error) throw new Error(`Categoría ${cat.name}: ${error.message}`);
    catMap.set(cat.name, data.id);
  }

  let created = 0;
  let skipped = 0;

  for (const item of catalog) {
    const { data: existing } = await supabase
      .from("products")
      .select("id")
      .eq("name", item.name)
      .maybeSingle();

    if (existing) {
      skipped++;
      continue;
    }

    const { error } = await supabase.from("products").insert({
      category_id: catMap.get(item.category),
      name: item.name,
      kind: "simple",
      sale_unit: item.sale_unit,
      price: item.price,
      stock: 0,
      min_stock: 0,
      is_active: true,
    });
    if (error) throw new Error(`Producto ${item.name}: ${error.message}`);
    created++;
  }

  console.log(`Listo: ${created} productos creados, ${skipped} ya existían.`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});

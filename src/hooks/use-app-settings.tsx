import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AppSettings = Record<string, string>;

export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings>({});
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    const { data } = await supabase
      .from("app_settings" as any)
      .select("key, value");
    const map: AppSettings = {};
    (data as any[])?.forEach((row: any) => {
      map[row.key] = row.value;
    });
    setSettings(map);
    setLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSetting = async (key: string, value: string) => {
    const { error } = await supabase
      .from("app_settings" as any)
      .update({ value, updated_at: new Date().toISOString() } as any)
      .eq("key", key);
    if (!error) {
      setSettings((prev) => ({ ...prev, [key]: value }));
    }
    return { error };
  };

  return { settings, loading, updateSetting, refetch: fetchSettings };
}

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://emhwyclgklgnamlflfij.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_ErQUBN9xQQ4nK-LrDsblmQ_Yvmtn1EZ";

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseUrl.startsWith("http") && 
  supabaseAnonKey
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ==========================================
// CHAT MESSAGES SUPABASE HELPERS
// ==========================================

export async function fetchSupabaseMessages() {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("community_messages")
      .select("*")
      .order("timestamp", { ascending: true });

    if (error) {
      // Table may not exist yet or RLS policy pending
      return [];
    }
    return (data || []).map(row => ({
      id: row.id,
      user: row.user_name,
      userEmail: row.user_email,
      channel: row.channel,
      text: row.text,
      avatar: row.avatar,
      timestamp: row.timestamp
    }));
  } catch (err) {
    console.warn("Supabase fetch messages error:", err);
    return [];
  }
}

export async function saveSupabaseMessage(msg) {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from("community_messages")
      .upsert({
        id: msg.id,
        user_name: msg.user,
        user_email: msg.userEmail || null,
        channel: msg.channel,
        text: msg.text,
        avatar: msg.avatar,
        timestamp: msg.timestamp || new Date().toISOString()
      });

    if (error) {
      console.warn("Supabase save message notice:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Supabase save message catch:", err);
    return false;
  }
}

export async function deleteSupabaseMessage(msgId) {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from("community_messages")
      .delete()
      .eq("id", msgId);

    if (error) return false;
    return true;
  } catch (err) {
    return false;
  }
}

// ==========================================
// CHANNELS SUPABASE HELPERS
// ==========================================

export async function fetchSupabaseChannels() {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("community_channels")
      .select("name");

    if (error || !data) return [];
    return data.map(row => row.name);
  } catch (err) {
    return [];
  }
}

export async function saveSupabaseChannel(name) {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from("community_channels")
      .upsert({ name }, { onConflict: "name" });

    if (error) return false;
    return true;
  } catch (err) {
    return false;
  }
}

export async function deleteSupabaseChannel(name) {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from("community_channels")
      .delete()
      .eq("name", name);

    if (error) return false;
    return true;
  } catch (err) {
    return false;
  }
}

// ==========================================
// RESOURCES SUPABASE HELPERS
// ==========================================

export async function fetchSupabaseResources() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("community_resources")
      .select("*");

    if (error || !data || data.length === 0) return null;

    // Group by category
    const grouped = {};
    for (const row of data) {
      const cat = row.category || "learning";
      if (!grouped[cat]) {
        grouped[cat] = {
          title: cat.charAt(0).toUpperCase() + cat.slice(1) + " Center",
          items: []
        };
      }
      grouped[cat].items.push({
        id: row.id,
        name: row.name,
        type: row.type,
        rating: Number(row.rating) || 5.0,
        learners: Number(row.learners) || 1,
        duration: row.duration,
        description: row.description,
        content: row.content,
        videoUrl: row.video_url,
        aiVerified: Boolean(row.ai_verified),
        postedBy: row.posted_by,
        createdAt: row.created_at
      });
    }
    return grouped;
  } catch (err) {
    return null;
  }
}

export async function saveSupabaseResource(item, category) {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from("community_resources")
      .upsert({
        id: item.id,
        name: item.name,
        category: category || "learning",
        type: item.type || "guide",
        rating: item.rating || 5.0,
        learners: item.learners || 1,
        duration: item.duration || "45m",
        description: item.description,
        content: item.content,
        video_url: item.videoUrl || null,
        ai_verified: item.aiVerified ?? true,
        posted_by: item.postedBy || "Admin Ronald",
        created_at: item.createdAt || new Date().toISOString()
      });

    if (error) return false;
    return true;
  } catch (err) {
    return false;
  }
}

export async function deleteSupabaseResource(resourceId) {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from("community_resources")
      .delete()
      .eq("id", resourceId);

    if (error) return false;
    return true;
  } catch (err) {
    return false;
  }
}

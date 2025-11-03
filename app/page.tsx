"use client";
import { useEffect, useMemo, useState } from "react";
import Form, { type LogbookInputs } from "@/components/Form";
import Output from "@/components/Output";
import { loadJSON, saveJSON, debounce } from "@/lib/storage";
import { motion } from "framer-motion";

export default function Home() {
  const [generated, setGenerated] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [currentInputs, setCurrentInputs] = useState<LogbookInputs | null>(null);

  // hydrate generated from localStorage
  useEffect(() => {
    const v = loadJSON<{ text: string; imageUrl?: string }>("logbook:output");
    if (v?.text) setGenerated(v.text);
    if (v?.imageUrl) setImageUrl(v.imageUrl);
  }, []);
  
  const saveOut = useMemo(() => 
    debounce((text: string, img: string) => 
      saveJSON("logbook:output", { text, imageUrl: img }), 300
    ), []
  );
  
  useEffect(() => {
    if (generated) saveOut(generated, imageUrl);
  }, [generated, imageUrl, saveOut]);

  const onGenerate = async (values: LogbookInputs) => {
    try {
      setLoading(true);
      setGenerated("");
      setImageUrl("");
      setCurrentInputs(values);
      
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputs: values }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to generate");
      setGenerated(data.text as string);
    } catch (e: any) {
      setGenerated(`Error: ${String(e?.message || e)}`);
    } finally {
      setLoading(false);
    }
  };

  const onGenerateImage = async () => {
    if (!currentInputs) return;
    
    try {
      setGeneratingImage(true);
      
      // Determine entry type based on date range
      const start = new Date(currentInputs.startDate);
      const end = new Date(currentInputs.endDate);
      const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      const entryType = daysDiff <= 4 ? "daily" : daysDiff <= 24 ? "weekly" : "monthly";
      
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          description: currentInputs.description,
          entryType 
        }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to generate image");
      
      setImageUrl(data.imageUrl);
    } catch (e: any) {
      console.error("Image generation error:", e);
      alert(`Failed to generate image: ${e.message}`);
    } finally {
      setGeneratingImage(false);
    }
  };

  return (
    <div className="flex min-h-screen items-start justify-center bg-zinc-50 p-6 font-sans dark:bg-black">
      <main className="mx-auto w-full max-w-3xl space-y-8">
        <header className="space-y-1">
          <motion.h1 initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            Logbook
          </motion.h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Generate a professional, top 1% logbook entry from your details.</p>
        </header>
        <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-black">
          <Form onGenerate={onGenerate} loading={loading} />
        </section>
        {generated && (
          <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-black">
            <Output 
              value={generated} 
              onChange={setGenerated}
              imageUrl={imageUrl}
              onGenerateImage={onGenerateImage}
              isGeneratingImage={generatingImage}
            />
          </section>
        )}
      </main>
    </div>
  );
}

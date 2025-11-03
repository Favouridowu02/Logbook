"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { debounce, loadJSON, saveJSON } from "@/lib/storage";

export type LogbookInputs = {
  description: string;
  startDate: string;
  endDate: string;
  days: string[];
  tools?: string;
  skills?: string;
  challenges?: string;
  supervisor?: string;
};

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

type Props = {
  defaultValues?: Partial<LogbookInputs>;
  onGenerate: (values: LogbookInputs) => Promise<void> | void;
  loading?: boolean;
};

export default function Form({ defaultValues, onGenerate, loading }: Props) {
  const [values, setValues] = useState<LogbookInputs>({
    description: "",
    startDate: "",
    endDate: "",
    days: [],
    tools: "",
    skills: "",
    challenges: "",
    supervisor: "",
    ...(defaultValues || {}),
  });

  // hydrate from localStorage on mount
  useEffect(() => {
    const v = loadJSON<LogbookInputs>("logbook:inputs");
    if (v) setValues((prev) => ({ ...prev, ...v }));
  }, []);

  // autosave on change (debounced)
  const autosave = useMemo(() => debounce((v: LogbookInputs) => saveJSON("logbook:inputs", v), 400), []);
  useEffect(() => {
    autosave(values);
  }, [values, autosave]);

  const toggleDay = (day: string) => {
    setValues((prev) => {
      const has = prev.days.includes(day);
      return { ...prev, days: has ? prev.days.filter((d) => d !== day) : [...prev.days, day] };
    });
  };

  const canSubmit = values.description.trim().length > 10 && !!values.startDate;

  return (
    <motion.form
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (canSubmit) onGenerate(values);
      }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="w-full space-y-6"
    >
      <div>
        <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">Description</label>
        <textarea
          className="mt-2 w-full min-h-32 resize-y rounded-md border border-zinc-300 bg-white p-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-black dark:text-zinc-100 dark:focus:ring-zinc-100"
          placeholder="Describe your daily or weekly activities with specific tasks, contexts, and outcomes..."
          value={values.description}
          onChange={(e) => setValues((p) => ({ ...p, description: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">Start Date</label>
          <input
            type="date"
            className="mt-2 w-full rounded-md border border-zinc-300 bg-white p-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-black dark:text-zinc-100 dark:focus:ring-zinc-100"
            value={values.startDate}
            onChange={(e) => setValues((p) => ({ ...p, startDate: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">End Date</label>
          <input
            type="date"
            className="mt-2 w-full rounded-md border border-zinc-300 bg-white p-2.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-black dark:text-zinc-100 dark:focus:ring-zinc-100"
            value={values.endDate}
            onChange={(e) => setValues((p) => ({ ...p, endDate: e.target.value }))}
          />
        </div>
      </div>

      <div>
        <span className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">Days of the Week</span>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {DAYS.map((d) => (
            <label key={d} className="flex items-center gap-2 text-sm text-zinc-800 dark:text-zinc-200">
              <input
                type="checkbox"
                checked={values.days.includes(d)}
                onChange={() => toggleDay(d)}
                className="h-4 w-4 accent-black dark:accent-white"
              />
              {d}
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">Tools/Equipment Used</label>
          <input
            type="text"
            className="mt-2 w-full rounded-md border border-zinc-300 bg-white p-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-black dark:text-zinc-100 dark:focus:ring-zinc-100"
            placeholder="e.g., Git, Docker, MATLAB, Oscilloscope"
            value={values.tools}
            onChange={(e) => setValues((p) => ({ ...p, tools: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">Skills Learned</label>
          <input
            type="text"
            className="mt-2 w-full rounded-md border border-zinc-300 bg-white p-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-black dark:text-zinc-100 dark:focus:ring-zinc-100"
            placeholder="e.g., REST API design, Soldering, Agile planning"
            value={values.skills}
            onChange={(e) => setValues((p) => ({ ...p, skills: e.target.value }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">Challenges Faced</label>
          <input
            type="text"
            className="mt-2 w-full rounded-md border border-zinc-300 bg-white p-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-black dark:text-zinc-100 dark:focus:ring-zinc-100"
            placeholder="e.g., race conditions, calibration drift"
            value={values.challenges}
            onChange={(e) => setValues((p) => ({ ...p, challenges: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">Supervisor Comments (optional)</label>
          <input
            type="text"
            className="mt-2 w-full rounded-md border border-zinc-300 bg-white p-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-black dark:text-zinc-100 dark:focus:ring-zinc-100"
            placeholder="Any feedback or notes from supervisor"
            value={values.supervisor}
            onChange={(e) => setValues((p) => ({ ...p, supervisor: e.target.value }))}
          />
        </div>
      </div>

      <div className="pt-2">
        <motion.button
          type="submit"
          disabled={!canSubmit || loading}
          whileTap={{ scale: canSubmit && !loading ? 0.98 : 1 }}
          className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white dark:border-black/40 dark:border-t-black" />
              Generating…
            </span>
          ) : (
            "Generate Logbook"
          )}
        </motion.button>
      </div>
    </motion.form>
  );
}

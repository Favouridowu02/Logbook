"use client";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import Image from "next/image";

type Props = {
  value: string;
  onChange: (text: string) => void;
  imageUrl?: string;
  onGenerateImage?: () => void;
  isGeneratingImage?: boolean;
};

export default function Output({ value, onChange, imageUrl, onGenerateImage, isGeneratingImage }: Props) {
  const textRef = useRef<HTMLDivElement | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      // ignore
    }
  };

  const downloadPDF = async () => {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // A4 dimensions: 210mm x 297mm
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 20;
    const maxLineWidth = pageWidth - 2 * margin;
    const lineHeight = 7;
    const fontSize = 11;
    let yPosition = margin;

    // Add image if available
    if (imageUrl) {
      try {
        const img = await loadImageForPDF(imageUrl);
        const imgWidth = 170; // width in mm
        const imgHeight = 100; // height in mm
        pdf.addImage(img, "PNG", margin, yPosition, imgWidth, imgHeight);
        yPosition += imgHeight + 10; // Add spacing after image
      } catch (err) {
        console.error("Failed to add image to PDF:", err);
      }
    }

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(fontSize);

    // Split text into lines that fit the page width
    const lines = pdf.splitTextToSize(value, maxLineWidth);
    
    let pageNumber = 1;

    lines.forEach((line: string, index: number) => {
      // Check if we need a new page
      if (yPosition + lineHeight > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
        pageNumber++;
      }

      pdf.text(line, margin, yPosition);
      yPosition += lineHeight;
    });

    // Add page numbers
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(9);
      pdf.text(
        `Page ${i} of ${totalPages}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
      );
    }

    // Generate filename with current date
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    pdf.save(`logbook_${dateStr}.pdf`);
  };

  const loadImageForPDF = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = document.createElement('img');
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = reject;
      img.src = url;
    });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="w-full space-y-3"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Generated Logbook</h2>
        <div className="flex gap-2">
          {onGenerateImage && (
            <button 
              onClick={onGenerateImage}
              disabled={isGeneratingImage}
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-900 transition-colors hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
            >
              {isGeneratingImage ? "Generating..." : imageUrl ? "Regenerate Image" : "Generate Image"}
            </button>
          )}
          <button 
            onClick={copy} 
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
          >
            {copySuccess ? "Copied!" : "Copy"}
          </button>
          <button 
            onClick={downloadPDF} 
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
          >
            Download PDF
          </button>
        </div>
      </div>
      <div className="space-y-4">
        {imageUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-black"
          >
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <Image
                src={imageUrl}
                alt="Generated logbook illustration"
                fill
                className="object-contain rounded-lg"
                unoptimized
              />
            </div>
          </motion.div>
        )}
        <div className="rounded-lg border border-zinc-200 bg-white p-4 text-sm leading-7 text-zinc-900 shadow-sm dark:border-zinc-800 dark:bg-black dark:text-zinc-100">
          <textarea
            ref={textRef as any}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="min-h-80 w-full resize-y bg-transparent outline-none font-mono"
            style={{ lineHeight: "1.75" }}
          />
        </div>
      </div>
    </motion.section>
  );
}

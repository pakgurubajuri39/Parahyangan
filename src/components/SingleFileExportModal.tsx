import React, { useState } from 'react';
import { generateSingleFileHTML } from '../standaloneTemplate';
import { X, Copy, Check, Download, ExternalLink, Code2 } from 'lucide-react';

interface SingleFileExportModalProps {
  onClose: () => void;
}

export const SingleFileExportModal: React.FC<SingleFileExportModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);
  const singleFileCode = generateSingleFileHTML();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(singleFileCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = singleFileCode;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([singleFileCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'parahyangan_harvest_tale.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-stone-900 border-2 border-amber-600 rounded-3xl p-5 sm:p-6 shadow-2xl text-stone-100 flex flex-col gap-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-700/50 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-950 border border-amber-500 flex items-center justify-center text-2xl">
              📄
            </div>
            <div>
              <h2 className="text-xl font-black text-amber-200">Ekspor Single File HTML</h2>
              <p className="text-xs text-amber-400">
                100% Berkas Tunggal mandiri tanpa build-step, siap untuk Google Apps Script & Browser
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feature Explanations */}
        <div className="bg-amber-950/60 border border-amber-700/60 rounded-2xl p-4 text-xs space-y-2 text-stone-200">
          <p className="font-bold text-amber-300 flex items-center gap-2">
            <Code2 className="w-4 h-4 text-emerald-400" /> Kompatibilitas Penuh Google Apps Script Web App:
          </p>
          <p className="text-stone-300 leading-relaxed">
            Kode ini telah dikemas dalam format <strong>Single File HTML murni</strong> dengan CDN Tailwind CSS,
            Web Audio API internal (tanpa dependensi audio eksternal), canvas renderer mandiri, dan touch controls.
          </p>
          <div className="bg-stone-950 p-2.5 rounded-xl border border-stone-800 font-mono text-[11px] text-amber-200">
            <code>
              function doGet() &#123;<br />
              &nbsp;&nbsp;return HtmlService.createHtmlOutputFromFile('Index')<br />
              &nbsp;&nbsp;&nbsp;&nbsp;.setTitle('Parahyangan: A Harvest Tale')<br />
              &nbsp;&nbsp;&nbsp;&nbsp;.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);<br />
              &#125;
            </code>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleCopy}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                Berhasil Disalin ke Clipboard!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Salin Seluruh Kode HTML (Copy)
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="flex-1 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98"
          >
            <Download className="w-4 h-4" />
            Unduh Berkas (.html)
          </button>
        </div>

        {/* Direct Link in Applet */}
        <div className="text-center">
          <a
            href="/parahyangan_single_file.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-200 underline"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Buka versi berkas tunggal langsung di tab baru
          </a>
        </div>
      </div>
    </div>
  );
};

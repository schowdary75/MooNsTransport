'use client';

import { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, Button } from '@moon/ui';
import Link from 'next/link';
import { ArrowLeft, Upload, FileCheck2, AlertCircle, RefreshCw, Terminal, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function OperatorSchedulePage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [logLines, setLogLines] = useState<string[]>([]);
  const [ingestStep, setIngestStep] = useState(0);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setLogLines([]);
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setIngestStep(0);
    setLogLines(['[00:01] Ingesting zip feed stream...', '[00:02] Authenticating GTFS headers...']);
  };

  // Log simulation interval
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (uploading && file) {
      const logs = [
        `[00:03] Found agency.txt. Bound to operator Clerk Identity.`,
        `[00:04] Loading routes.txt... Detected 12 valid transit lines.`,
        `[00:06] Loading stops.txt... Found 342 coordinates. Boundary check: OK.`,
        `[00:07] Loading stop_times.txt... Computing interpolated arrivals...`,
        `[00:08] Processing calendar.txt... Active timetable bounds validated.`,
        `[00:10] Ingesting into OpenTripPlanner graph engine... Re-routing GPS trackers...`,
        `[00:12] Network index refresh completed successfully!`
      ];

      if (ingestStep < logs.length) {
        timer = setTimeout(() => {
          setLogLines(prev => [...prev, logs[ingestStep]!]);
          setIngestStep(prev => prev + 1);
        }, 800);
      } else {
        setUploading(false);
        toast({
          title: 'GTFS Feed Synced',
          description: `Successfully parsed and scheduled ${file.name} feeds.`,
        });
        setFile(null);
      }
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [uploading, ingestStep, file]);

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden pb-20 pt-16">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-brand-500/5 blur-[130px] -z-10" />
      <div className="absolute bottom-0 left-[10%] h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-[120px] -z-10" />

      <Container className="max-w-3xl py-8 space-y-6">
        
        {/* Back and Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-6">
          <div className="flex items-center gap-4">
            <Link href="/operator" className="p-2 border border-white/10 rounded-full hover:bg-white/5 transition text-slate-400 hover:text-white">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <Badge className="bg-brand-500/10 text-brand-400 border-brand-500/20 font-bold">Operator Dashboard</Badge>
              <h1 className="text-3xl font-extrabold tracking-tight mt-1 text-white">Transit Schedules</h1>
            </div>
          </div>
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-bold px-3 py-1 rounded-xl">
            Live Sync Ready
          </Badge>
        </div>

        <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-[2.2rem] overflow-hidden">
          <CardHeader className="border-b border-white/5 p-6">
            <CardTitle className="text-white text-lg">GTFS Static Scheduling Feed</CardTitle>
            <CardDescription className="text-slate-400">Upload GTFS zip or text transit calendar files to configure timetables and route durations.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleUpload} className="space-y-6">
              
              {/* File Dropzone */}
              <div className="border-2 border-dashed border-white/10 hover:border-brand-500/50 rounded-3xl p-8 flex flex-col items-center justify-center bg-slate-950/40 hover:bg-slate-950/70 transition cursor-pointer relative">
                <input 
                  type="file" 
                  accept=".zip,.txt" 
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploading}
                />
                <Upload className="h-10 w-10 text-slate-500 mb-3" />
                <div className="text-sm font-semibold text-slate-300">
                  {file ? file.name : 'Click or Drag & Drop GTFS files here'}
                </div>
                <div className="text-xs text-slate-500 mt-1.5">Supports GTFS zip archives or plain CSV text schedules</div>
              </div>

              {file && (
                <div className="flex items-center gap-3 p-4 bg-brand-500/10 border border-brand-500/20 rounded-2xl text-brand-400 text-sm">
                  <FileCheck2 className="h-5 w-5 text-brand-400 shrink-0" />
                  <div>
                    <span className="font-bold text-white">{file.name}</span> selected ({(file.size / 1024).toFixed(1)} KB). Ready for ingestion.
                  </div>
                </div>
              )}

              {/* Action Button */}
              <Button 
                type="submit" 
                disabled={!file || uploading} 
                className="w-full bg-brand-500 hover:bg-brand-600 text-white rounded-2xl py-3.5 font-bold shadow-lg shadow-brand-500/20 disabled:opacity-40"
              >
                {uploading ? (
                  <span className="flex items-center justify-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" /> Ingesting Calendars...
                  </span>
                ) : (
                  'Sync Timetables'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Live Parsing Log Console */}
        {logLines.length > 0 && (
          <Card className="border-white/10 bg-slate-950/80 rounded-[2rem] overflow-hidden p-5 shadow-2xl">
            <CardHeader className="p-0 pb-3 border-b border-white/5 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 font-mono">
                <Terminal className="h-4 w-4 text-brand-400" /> GTFS INGESTION LOGS
              </div>
              {uploading ? (
                <Badge className="bg-brand-500/10 text-brand-400 border-none font-bold text-[9px]">PARSING</Badge>
              ) : (
                <Badge className="bg-emerald-500/10 text-emerald-400 border-none font-bold text-[9px] flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> SUCCESS
                </Badge>
              )}
            </CardHeader>
            <CardContent className="p-0 pt-3 max-h-56 overflow-y-auto font-mono text-[11px] text-slate-300 space-y-1.5 leading-relaxed">
              {logLines.map((line, idx) => (
                <div key={idx} className={line.includes('SUCCESS') || line.includes('successful') ? 'text-emerald-400' : ''}>
                  {line}
                </div>
              ))}
            </CardContent>
          </Card>
        )}
        
        {/* Guidelines Card */}
        <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-[2rem]">
          <CardHeader className="border-b border-white/5 px-6 py-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-brand-400" />
              <CardTitle className="text-white text-base font-bold">Timetable Ingest Guidelines</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 text-xs text-slate-400 space-y-2.5 leading-relaxed">
            <p>1. Ingested GTFS files should include standard headers: `agency.txt`, `routes.txt`, `trips.txt`, `stop_times.txt` and `stops.txt`.</p>
            <p>2. Verify calendar bounds check before syncing; invalid future dates will cause feed mismatch anomalies on the maps.</p>
          </CardContent>
        </Card>
      </Container>
    </main>
  );
}

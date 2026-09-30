import { useState, useEffect, useCallback } from 'react';
import {
  FileText, FolderOpen,
  Search, Trash2, RotateCcw, Shield,
  CheckCircle, AlertCircle, Info,
  ChevronUp, ChevronDown,
  FileCheck, Zap, History,
  Eye, Code, BarChart3,
  AlertTriangle, Clock,
  User, FileType, Sparkles, Languages,
  Download, RefreshCw
} from 'lucide-react';

type Lang = 'en' | 'ar';

const translations = {
  en: {
    analyze: 'Analyze', clean: 'Clean', revise: 'Revise', verify: 'Verify', audit: 'Audit', baseline: 'Baseline',
    analyzeDesc: 'Provenance & style audit', cleanDesc: 'Remove provenance artifacts',
    reviseDesc: 'AI-assisted revision', verifyDesc: 'Before/after comparison',
    auditDesc: 'Create audit package', baselineDesc: 'Author style profile',
    selectDocument: 'Select document to analyze', selectDocumentClean: 'Select document to clean',
    selectDocumentRevise: 'Select document to revise', originalDocument: 'Original document',
    revisedDocument: 'Revised document', revisedDocumentOptional: 'Revised document (optional)',
    addSampleDocs: 'Add sample documents (3-5 recommended)',
    authorBaseline: 'Author Baseline (optional)', authorBaselineOptional: 'Author Baseline (optional)',
    none: 'None (generic analysis)', noneShort: 'None',
    analyzeDocument: 'Analyze Document', cleanDocument: 'Clean Document',
    generateRevision: 'Generate Revision Suggestions', verifyChanges: 'Verify Changes',
    createAudit: 'Create Audit Package', createBaseline: 'Create Baseline',
    baselineName: 'Baseline name', baselineNamePlaceholder: 'e.g., my_academic_style',
    existingBaselines: 'Existing Baselines', noBaselines: 'No baselines created yet',
    view: 'View', close: 'Close', result: 'Result', clear: 'Clear',
    change: 'Change', select: 'Select', options: 'Options',
    stripMetadata: 'Strip metadata (keep title/author)',
    enableLayerB: 'Enable Layer B (statistical watermark rewrite)',
    runDetection: 'Run detection before/after',
    useLLM: 'Use LLM for revision (requires Ollama)',
    enableBaseline: 'Enable author baseline comparison',
    sessionFile: 'Session file (for resume)',
    sessionFilePlaceholder: 'Optional: path to session.json for resume',
    includeInPackage: 'Include in package',
    analysisReport: 'Analysis report', verificationReport: 'Verification report',
    revisionSuggestions: 'Revision suggestions', sessionLog: 'Session log', auditLog: 'Audit log',
    dragDrop: 'Drag & drop or click to select document...',
    analysisComplete: 'Analysis complete', cleaned: 'Cleaned', revisionGenerated: 'Revision suggestions generated',
    verificationComplete: 'Verification complete', auditCreated: 'Audit package created',
    baselineCreated: 'Baseline "{name}" created',
    selectBaseline: 'Select a baseline', selectFileFirst: 'Select a file first',
    selectBothFiles: 'Select both original and revised files',
    fileNotAvailable: 'File path is not available',
    failedToSelect: 'Failed to select file', failedToSave: 'Failed to save file',
    failedToLoadBaselines: 'Failed to load baselines',
    words: 'Words', sentences: 'Sentences', avgWordsPerSentence: 'Avg Words/Sentence',
    paragraphs: 'Paragraphs', sentenceVariety: 'Sentence Variety',
    veryUniform: 'Very Uniform', somewhatUniform: 'Somewhat Uniform',
    moderateVariation: 'Moderate Variation', naturalVariation: 'Natural Variation',
    veryUniformDesc: 'Sentences are very similar in length',
    somewhatUniformDesc: 'Limited variation in sentence length',
    moderateVariationDesc: 'Some natural variation in sentence length',
    naturalVariationDesc: 'Good mix of short and long sentences',
    formalConnectives: 'Formal Connectives', formalConnectivesDesc: 'Words like "Furthermore", "Moreover"',
    hedgingWords: 'Hedging Words', hedgingWordsDesc: 'Words like "might", "could", "possibly"',
    qualifiers: 'Qualifiers', qualifiersDesc: 'Words like "very", "quite", "rather"',
    repeatedOpenings: 'Repeated Openings', repeatedOpeningsDesc: 'Sentences starting the same way',
    found: 'found', noStyleMarkers: 'No significant style markers detected.',
    noPatterns: 'No specific patterns detected. The writing appears natural.',
    noMetadata: 'No metadata found.', noUnicode: 'No suspicious Unicode characters found.',
    whatThisMeans: 'What this means', foundLabel: 'Found', tip: 'Tip',
    author: 'Author', created: 'Created', lastModified: 'Last Modified',
    c2paSignature: 'C2PA Signature', exifData: 'EXIF/XMP Data',
    info: 'info', warning: 'warning', error: 'error',
    cleanAssessment: 'Clean', minorPatterns: 'Minor Patterns', notablePatterns: 'Notable Patterns',
    cleanAssessmentDesc: 'No significant issues detected',
    minorPatternsDesc: 'A few writing patterns detected',
    notablePatternsDesc: 'Several writing patterns detected',
    selectTab: 'Select a tab',
    fallbackMeaning: 'A writing pattern was detected',
    fallbackTip: 'Review this pattern in your writing',
    analysisReportTitle: 'Analysis Report',
    documentSummary: 'Document Summary', writingStyleMarkers: 'Writing Style Markers',
    detectedPatterns: 'Detected Patterns', documentInfo: 'Document Information',
    hiddenCharacters: 'Hidden Characters Detected',
    hiddenCharsDesc: 'These are invisible or unusual characters that can be used to hide information or manipulate text:',
    technicalJson: 'Technical: Raw JSON Data',
    overusedConnectives: { title: 'Overused Connectives', meaning: 'Frequent use of formal connecting words like "Furthermore", "Moreover", "Additionally"', tip: 'Try varying your transitions or using simpler connections' },
    hedgingDensity: { title: 'Excessive Hedging', meaning: 'Frequent use of uncertain language like "might", "could", "possibly"', tip: 'Be more direct and confident in your statements' },
    inflatedImportance: { title: 'Inflated Importance', meaning: 'Overuse of dramatic words like "unprecedented", "revolutionary", "groundbreaking"', tip: 'Use more measured, precise language' },
    forcedTrios: { title: 'Forced Groups of Three', meaning: 'Excessive use of three-item lists (e.g., "healthcare, finance, and education")', tip: 'Vary your list lengths naturally' },
    repeatedOpeningsPattern: { title: 'Repeated Openings', meaning: 'Multiple sentences or paragraphs starting the same way', tip: 'Vary your sentence openings for better flow' },
    lowBurstiness: { title: 'Low Burstiness', meaning: 'Sentences are very similar in length — natural writing has more variation', tip: 'Mix short and long sentences for a more natural rhythm' },
    lowPerplexity: { title: 'Predictable Language', meaning: 'Word choices are very common and predictable', tip: 'Use more varied and specific vocabulary' },
    lexical: 'lexical', rhetorical: 'rhetorical', structural: 'structural',
    createNewBaseline: 'Create New Baseline',
    updateTo: 'Update to v{version}',
    downloading: 'Downloading {percent}%',
    restartToUpdate: 'Restart to update',
    installing: 'Installing…',
    updateFailed: 'Update failed',
  },
  ar: {
    analyze: 'تحليل', clean: 'تنظيف', revise: 'مراجعة', verify: 'تحقق', audit: 'تدقيق', baseline: 'خط أساس',
    analyzeDesc: 'تدقيق المصدر والأسلوب', cleanDesc: 'إزالة آثار المصدر',
    reviseDesc: 'مراجعة بمساعدة الذكاء الاصطناعي', verifyDesc: 'مقارنة قبل/بعد',
    auditDesc: 'إنشاء حزمة تدقيق', baselineDesc: 'ملف أسلوب الكاتب',
    selectDocument: 'اختر مستند للتحليل', selectDocumentClean: 'اختر مستند للتنظيف',
    selectDocumentRevise: 'اختر مستند للمراجعة', originalDocument: 'المستند الأصلي',
    revisedDocument: 'المستند المُعدّل', revisedDocumentOptional: 'المستند المُعدّل (اختياري)',
    addSampleDocs: 'أضف مستندات نموذجية (3-5 مُوصى بها)',
    authorBaseline: 'خط أساس الكاتب (اختياري)', authorBaselineOptional: 'خط أساس الكاتب (اختياري)',
    none: 'بدون (تحليل عام)', noneShort: 'بدون',
    analyzeDocument: 'تحليل المستند', cleanDocument: 'تنظيف المستند',
    generateRevision: 'إنشاء اقتراحات المراجعة', verifyChanges: 'التحقق من التغييرات',
    createAudit: 'إنشاء حزمة التدقيق', createBaseline: 'إنشاء خط أساس',
    baselineName: 'اسم خط الأساس', baselineNamePlaceholder: 'مثال: my_academic_style',
    existingBaselines: 'خطوط الأساس الموجودة', noBaselines: 'لم يتم إنشاء خطوط أساس بعد',
    view: 'عرض', close: 'إغلاق', result: 'النتيجة', clear: 'مسح',
    change: 'تغيير', select: 'اختيار', options: 'خيارات',
    stripMetadata: 'إزالة البيانات الوصفية (احتفاظ بالعنوان/المؤلف)',
    enableLayerB: 'تفعيل الطبقة ب (إعادة كتابة العلامة المائية الإحصائية)',
    runDetection: 'تشغيل الكشف قبل/بعد',
    useLLM: 'استخدام النموذج اللغوي للمراجعة (يتطلب Ollama)',
    enableBaseline: 'تفعيل مقارنة خط أساس الكاتب',
    sessionFile: 'ملف الجلسة (للاستئناف)',
    sessionFilePlaceholder: 'اختياري: مسار session.json للاستئناف',
    includeInPackage: 'تضمين في الحزمة',
    analysisReport: 'تقرير التحليل', verificationReport: 'تقرير التحقق',
    revisionSuggestions: 'اقتراحات المراجعة', sessionLog: 'سجل الجلسة', auditLog: 'سجل التدقيق',
    dragDrop: 'اسحب وأفلت أو انقر لاختيار مستند...',
    analysisComplete: 'اكتمل التحليل', cleaned: 'تم التنظيف', revisionGenerated: 'تم إنشاء اقتراحات المراجعة',
    verificationComplete: 'اكتمل التحقق', auditCreated: 'تم إنشاء حزمة التدقيق',
    baselineCreated: 'تم إنشاء خط الأساس "{name}"',
    selectBaseline: 'اختر خط أساس', selectFileFirst: 'اختر ملف أولاً',
    selectBothFiles: 'اختر المستند الأصلي والمُعدّل',
    fileNotAvailable: 'مسار الملف غير متوفر',
    failedToSelect: 'فشل اختيار الملف', failedToSave: 'فشل حفظ الملف',
    failedToLoadBaselines: 'فشل تحميل خطوط الأساس',
    words: 'كلمات', sentences: 'جمل', avgWordsPerSentence: 'متوسط الكلمات/جملة',
    paragraphs: 'فقرات', sentenceVariety: 'تنوع الجمل',
    veryUniform: 'موحد جداً', somewhatUniform: 'موحد إلى حد ما',
    moderateVariation: 'تنوع معتدل', naturalVariation: 'تنوع طبيعي',
    veryUniformDesc: 'الجمل متشابهة جداً في الطول',
    somewhatUniformDesc: 'تنوع محدود في طول الجمل',
    moderateVariationDesc: 'بعض التنوع الطبيعي في طول الجمل',
    naturalVariationDesc: 'مزيج جيد من الجمل القصيرة والطويلة',
    formalConnectives: 'أدوات الربط الرسمية', formalConnectivesDesc: 'كلمات مثل "علاوة على ذلك"، "بالإضافة إلى"',
    hedgingWords: 'كلمات التحوط', hedgingWordsDesc: 'كلمات مثل "قد"، "يمكن"، "ربما"',
    qualifiers: 'المحددات', qualifiersDesc: 'كلمات مثل "جداً"، "إلى حد ما"، "بعض الشيء"',
    repeatedOpenings: 'بدايات مكررة', repeatedOpeningsDesc: 'جمل تبدأ بنفس الطريقة',
    found: 'موجود', noStyleMarkers: 'لم يتم اكتشاف علامات أسلوب مهمة.',
    noPatterns: 'لم يتم اكتشاف أنماط محددة. الكتابة تبدو طبيعية.',
    noMetadata: 'لم يتم العثور على بيانات وصفية.', noUnicode: 'لم يتم العثور على أحرف يونيكود مشبوهة.',
    whatThisMeans: 'ما يعني هذا', foundLabel: 'تم العثور على', tip: 'نصيحة',
    author: 'المؤلف', created: 'تاريخ الإنشاء', lastModified: 'آخر تعديل',
    c2paSignature: 'توقيع C2PA', exifData: 'بيانات EXIF/XMP',
    info: 'معلومات', warning: 'تحذير', error: 'خطأ',
    cleanAssessment: 'نظيف', minorPatterns: 'أنماط طفيفة', notablePatterns: 'أنماط ملحوظة',
    cleanAssessmentDesc: 'لم يتم اكتشاف مشاكل مهمة',
    minorPatternsDesc: 'تم اكتشاف بعض أنماط الكتابة',
    notablePatternsDesc: 'تم اكتشاف عدة أنماط كتابة',
    selectTab: 'اختر تبويباً',
    fallbackMeaning: 'تم اكتشاف نمط كتابة',
    fallbackTip: 'راجع هذا النمط في كتابتك',
    analysisReportTitle: 'تقرير التحليل',
    documentSummary: 'ملخص المستند', writingStyleMarkers: 'علامات أسلوب الكتابة',
    detectedPatterns: 'الأنماط المكتشفة', documentInfo: 'معلومات المستند',
    hiddenCharacters: 'أحرف مخفية مكتشفة',
    hiddenCharsDesc: 'هذه أحرف غير مرئية أو غير عادية يمكن استخدامها لإخفاء المعلومات أو التلاعب بالنص:',
    technicalJson: 'تقني: بيانات JSON الخام',
    overusedConnectives: { title: 'أدوات ربط مفرطة', meaning: 'استخدام متكرر لكلمات الربط الرسمية مثل "علاوة على ذلك"، "بالإضافة إلى"، "أيضاً"', tip: 'حاول تنوع انتقالاتك أو استخدام روابط أبسط' },
    hedgingDensity: { title: 'تحوط مفرط', meaning: 'استخدام متكرر للغة غير مؤكدة مثل "قد"، "يمكن"، "ربما"', tip: 'كن أكثر مباشرة وثقة في تصريحاتك' },
    inflatedImportance: { title: 'أهمية مبالغ فيها', meaning: 'الإفراط في استخدام كلمات درامية مثل "غير مسبوق"، "ثوري"، "رائد"', tip: 'استخدم لغة أكثر دقة واعتدالاً' },
    forcedTrios: { title: 'مجموعات ثلاثية مفروضة', meaning: 'استخدام مفرط لقوائم من ثلاثة عناصر (مثل "الصحة، المالية، والتعليم")', tip: 'تنوع أطوال قوائمك بشكل طبيعي' },
    repeatedOpeningsPattern: { title: 'بدايات مكررة', meaning: 'جمل أو فقرات متعددة تبدأ بنفس الطريقة', tip: 'تنوع بدايات جملك لتدفق أفضل' },
    lowBurstiness: { title: 'تنوع منخفض', meaning: 'الجمل متشابهة جداً في الطول — الكتابة الطبيعية بها تنوع أكثر', tip: 'امزج الجمل القصيرة والطويلة لإيقاع أكثر طبيعية' },
    lowPerplexity: { title: 'لغة متوقعة', meaning: 'اختيارات الكلمات شائعة جداً ومتوقعة', tip: 'استخدم مفردات أكثر تنوعاً وتحديداً' },
    lexical: 'معجمي', rhetorical: 'بلاغي', structural: 'هيكلي',
    createNewBaseline: 'إنشاء خط أساس جديد',
    updateTo: 'التحديث إلى v{version}',
    downloading: 'جارٍ التنزيل {percent}%',
    restartToUpdate: 'أعد التشغيل للتحديث',
    installing: 'جارٍ التثبيت…',
    updateFailed: 'فشل التحديث',
  },
};

const getTabConfig = (t: typeof translations.en) => [
  { id: 'analyze' as const, label: t.analyze, icon: Search, desc: t.analyzeDesc },
  { id: 'clean' as const, label: t.clean, icon: Shield, desc: t.cleanDesc },
  { id: 'revise' as const, label: t.revise, icon: RotateCcw, desc: t.reviseDesc },
  { id: 'verify' as const, label: t.verify, icon: FileCheck, desc: t.verifyDesc },
  { id: 'audit' as const, label: t.audit, icon: History, desc: t.auditDesc },
  { id: 'baseline' as const, label: t.baseline, icon: Zap, desc: t.baselineDesc },
];

type TabId = 'analyze' | 'clean' | 'revise' | 'verify' | 'audit' | 'baseline';

interface FileInfo {
  path: string | null;
  name: string | null;
  size: number;
}

interface Toast {
  id: number;
  type: 'success' | 'error' | 'info';
  message: string;
}

function App() {
  const [lang, setLang] = useState<Lang>('en');
  const [activeTab, setActiveTab] = useState<TabId>('analyze');
  const [file, setFile] = useState<FileInfo | null>(null);
  const [revisedFile, setRevisedFile] = useState<FileInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  const [reviseSession, setReviseSession] = useState<string | null>(null);
  const [baselines, setBaselines] = useState<string[]>([]);
  const [selectedBaseline, setSelectedBaseline] = useState<string>('');

  // Installed app version (from package.json via the main process) and update lifecycle
  const [appVersion, setAppVersion] = useState('');
  const [updater, setUpdater] = useState<{
    phase: 'idle' | 'available' | 'downloading' | 'downloaded' | 'installing';
    version?: string;
    percent?: number;
  }>({ phase: 'idle' });

  const t = translations[lang];
  const isRTL = lang === 'ar';
  const tabConfig = getTabConfig(t);

  useEffect(() => {
    loadBaselines();
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [lang, isRTL]);

  // App version + update lifecycle: check once on launch, stream status from main.
  useEffect(() => {
    let disposed = false;

    window.api.getVersion()
      .then(v => { if (!disposed && v) setAppVersion(v); })
      .catch(e => console.error('Failed to read app version:', e));

    const offStatus = window.api.onUpdaterStatus((status) => {
      if (disposed) return;
      if (status.state === 'downloading') {
        setUpdater(prev => prev.phase === 'idle' ? prev : {
          ...prev,
          phase: 'downloading',
          percent: typeof status.percent === 'number' ? status.percent : prev.percent
        });
      } else if (status.state === 'downloaded') {
        setUpdater(prev => prev.phase === 'idle' ? prev : { ...prev, phase: 'downloaded', version: status.version ?? prev.version });
      } else if (status.state === 'installing') {
        setUpdater(prev => prev.phase === 'idle' ? prev : { ...prev, phase: 'installing' });
      } else if (status.state === 'available') {
        setUpdater(prev => prev.phase === 'idle' ? { phase: 'available', version: status.version } : prev);
      } else if (status.state === 'error') {
        // Revert in-flight states so the user can retry. Errors are toasted only
        // from the click handlers below — a failed launch check stays silent.
        setUpdater(prev => {
          if (prev.phase === 'downloading') return { ...prev, phase: 'available', percent: undefined };
          if (prev.phase === 'installing') return { ...prev, phase: 'downloaded' };
          return prev;
        });
      }
    });

    window.api.updaterCheck()
      .then(res => {
        if (disposed || !res || res.state !== 'available') return;
        setUpdater(prev => prev.phase === 'idle' ? { phase: 'available', version: res.version } : prev);
      })
      .catch(e => console.error('Update check failed:', e));

    return () => { disposed = true; offStatus(); };
  }, []);

  const loadBaselines = async () => {
    try {
      const result = await window.api.baseline('list', '', []);
      if (result && Array.isArray(result)) {
        setBaselines(result);
      }
    } catch (e) {
      console.error('Failed to load baselines:', e);
    }
  };

  const handleFileSelect = useCallback(async (multiple = false) => {
    try {
      const paths = multiple
        ? await window.api.openFiles([{ name: 'Documents', extensions: ['docx', 'tex', 'pdf', 'md', 'txt'] }])
        : [await window.api.openFile([{ name: 'Documents', extensions: ['docx', 'tex', 'pdf', 'md', 'txt'] }])];

      if (paths && paths[0]) {
        return paths.filter((p): p is string => p != null).map(p => ({ path: p, name: p.split('\\').pop() || p.split('/').pop() || p, size: 0 }));
      }
    } catch (e) {
      showToast('error', t.failedToSelect);
    }
    return [];
  }, [lang]);

  const showToast = (type: Toast['type'], message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  };

  // Update button: first press downloads, second press installs and restarts.
  const handleUpdateClick = async () => {
    if (updater.phase === 'available') {
      setUpdater(prev => ({ ...prev, phase: 'downloading', percent: 0 }));
      try {
        const res = await window.api.updaterDownload();
        if (res && res.state === 'downloaded') {
          setUpdater(prev => ({ ...prev, phase: 'downloaded', version: res.version ?? prev.version }));
        } else if (res && res.state === 'error') {
          setUpdater(prev => ({ ...prev, phase: 'available', percent: undefined }));
          showToast('error', res.message ? `${t.updateFailed}: ${res.message}` : t.updateFailed);
        }
      } catch (e: any) {
        setUpdater(prev => ({ ...prev, phase: 'available', percent: undefined }));
        showToast('error', e?.message ? `${t.updateFailed}: ${e.message}` : t.updateFailed);
      }
    } else if (updater.phase === 'downloaded') {
      setUpdater(prev => ({ ...prev, phase: 'installing' }));
      try {
        const res = await window.api.updaterInstall();
        if (res && res.state === 'error') {
          setUpdater(prev => ({ ...prev, phase: 'downloaded' }));
          showToast('error', res.message ? `${t.updateFailed}: ${res.message}` : t.updateFailed);
        }
        // Success: the main process quits this window, installs, and relaunches.
      } catch (e: any) {
        setUpdater(prev => ({ ...prev, phase: 'downloaded' }));
        showToast('error', e?.message ? `${t.updateFailed}: ${e.message}` : t.updateFailed);
      }
    }
  };

  const handleSaveFile = useCallback(async (defaultName: string, filters?: any) => {
    try {
      const path = await window.api.saveFile(defaultName, filters);
      return path;
    } catch (e: any) {
      // Surface the underlying reason (e.g. a rejected dialog call) instead of
      // failing with an unexplained generic message.
      showToast('error', e?.message ? `${t.failedToSave}: ${e.message}` : t.failedToSave);
      return null;
    }
  }, [lang]);

  const handleAnalyze = async () => {
    if (!file) return showToast('error', t.selectFileFirst);
    if (!file.path) return showToast('error', t.fileNotAvailable);
    setLoading(true);
    try {
      const result = await window.api.analyze({
        filepath: file.path,
        baseline: selectedBaseline || undefined,
        json_output: true
      });
      setResult({ type: 'analyze', data: result });
      showToast('success', t.analysisComplete);
    } catch (e: any) {
      showToast('error', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClean = async () => {
    if (!file) return showToast('error', t.selectFileFirst);
    const output = await handleSaveFile(`${file.name?.replace(/\.[^.]+$/, '') || 'file'}.cleaned.docx`, [
      { name: 'Word Document', extensions: ['docx'] }
    ]);
    if (!output) return;

    setLoading(true);
    try {
      await window.api.clean({
        filepath: file.path || '',
        use_service: false,
        strip_metadata: true,
        layer_b: false,
        detect: false,
        metadata_keep: ['title', 'author'],
        output
      });
      showToast('success', `${t.cleaned}: ${output}`);
    } catch (e: any) {
      showToast('error', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRevise = async () => {
    if (!file) return showToast('error', t.selectFileFirst);
    const output = await handleSaveFile(`${file.name?.replace(/\.[^.]+$/, '') || 'file'}.revised.json`, [
      { name: 'JSON', extensions: ['json'] }
    ]);
    if (!output) return;

    const session = await handleSaveFile(`${file.name?.replace(/\.[^.]+$/, '') || 'file'}.session.json`, [
      { name: 'Session', extensions: ['json'] }
    ]);

    setLoading(true);
    try {
      await window.api.revise({
        filepath: file.path || '',
        llm: false,
        session_file: session || undefined,
        output
      });
      showToast('success', t.revisionGenerated);
    } catch (e: any) {
      showToast('error', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!file || !revisedFile) return showToast('error', t.selectBothFiles);
    const output = await handleSaveFile(`verification_${Date.now()}.json`, [
      { name: 'JSON', extensions: ['json'] }
    ]);

    setLoading(true);
    try {
      await window.api.verify({
        original: file.path || '',
        revised: revisedFile.path || '',
        baseline: selectedBaseline || undefined,
        output,
        json_output: true
      });
      showToast('success', t.verificationComplete);
    } catch (e: any) {
      showToast('error', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAudit = async () => {
    if (!file) return showToast('error', t.selectFileFirst);
    const output = await handleSaveFile(`audit_${file.name || 'file'}_${Date.now()}.zip`, [
      { name: 'ZIP Archive', extensions: ['zip'] }
    ]);
    if (!output) return;

    setLoading(true);
    try {
      await window.api.audit({
        original: file.path || '',
        revised: revisedFile?.path || undefined,
        analysis: undefined,
        verification: undefined,
        suggestions: undefined,
        session_log: reviseSession || undefined,
        output
      });
      showToast('success', `${t.auditCreated}: ${output}`);
    } catch (e: any) {
      showToast('error', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBaselineAdd = async () => {
    const files = await handleFileSelect(true);
    if (!files || !files.length) return;

    const name = prompt(`${t.baselineName}:`);
    if (!name) return;

    setLoading(true);
    try {
      await window.api.baseline('add', name, files.map(f => f.path));
      showToast('success', t.baselineCreated.replace('{name}', name));
      loadBaselines();
    } catch (e: any) {
      showToast('error', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBaselineShow = async () => {
    if (!selectedBaseline) return showToast('error', t.selectBaseline);
    setLoading(true);
    try {
      const result = await window.api.baseline('show', selectedBaseline, []);
      setResult({ type: 'baseline', data: result });
    } catch (e: any) {
      showToast('error', e.message);
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const JsonViewer = ({ data }: { data: any }) => {
    const highlight = (json: string) => {
      return json
        .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?)/g, '<span class="json-string">$1</span>')
        .replace(/(\b\d+\.?\d*\b)/g, '<span class="json-number">$1</span>')
        .replace(/\b(true|false)\b/g, '<span class="json-boolean">$1</span>')
        .replace(/\bnull\b/g, '<span class="json-null">$1</span>')
        .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*")/g, '<span class="json-key">$1</span>');
    };

    const jsonStr = JSON.stringify(data, null, 2);
    return (
      <pre
        className="json-viewer scrollbar-thin"
        dangerouslySetInnerHTML={{ __html: highlight(jsonStr) }}
      />
    );
  };

  const ReadableAnalysisView = ({ data }: { data: any }) => {
    const [showRaw, setShowRaw] = useState(false);
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
      summary: true,
      style: true,
      evidence: true,
      metadata: true,
    });

    if (!data) return null;

    const toggleSection = (key: string) => {
      setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const getOverallAssessment = () => {
      const evidenceCount = data.section_stats?.[0]?.evidence_matches?.length || 0;
      const unicodeCount = data.unicode_findings?.length || 0;
      const totalIssues = evidenceCount + unicodeCount;

      if (totalIssues === 0) return { label: t.cleanAssessment, color: 'var(--success)', icon: CheckCircle, description: t.cleanAssessmentDesc };
      if (totalIssues <= 2) return { label: t.minorPatterns, color: 'var(--warning)', icon: AlertTriangle, description: t.minorPatternsDesc };
      return { label: t.notablePatterns, color: 'var(--error)', icon: AlertCircle, description: t.notablePatternsDesc };
    };

    const assessment = getOverallAssessment();
    const AssessmentIcon = assessment.icon;

    const getEvidenceExplanation = (patternId: string) => {
      const explanations: Record<string, { title: string; meaning: string; tip: string }> = {
        overused_connectives: t.overusedConnectives,
        hedging_density: t.hedgingDensity,
        inflated_importance: t.inflatedImportance,
        forced_trios: t.forcedTrios,
        repeated_openings: t.repeatedOpeningsPattern,
        low_burstiness: t.lowBurstiness,
        low_perplexity: t.lowPerplexity,
      };
      return explanations[patternId] || { title: patternId, meaning: t.fallbackMeaning, tip: t.fallbackTip };
    };

    const getBurstinessLabel = (score: number) => {
      if (score < 0.3) return { label: t.veryUniform, desc: t.veryUniformDesc, color: 'var(--error)' };
      if (score < 0.5) return { label: t.somewhatUniform, desc: t.somewhatUniformDesc, color: 'var(--warning)' };
      if (score < 0.7) return { label: t.moderateVariation, desc: t.moderateVariationDesc, color: 'var(--accent)' };
      return { label: t.naturalVariation, desc: t.naturalVariationDesc, color: 'var(--success)' };
    };

    const burstiness = data.section_stats?.[0]?.burstiness_score || 0;
    const burstinessInfo = getBurstinessLabel(burstiness);

    const formatDate = (dateStr: string) => {
      try {
        return new Date(dateStr).toLocaleDateString(lang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      } catch {
        return dateStr;
      }
    };

    return (
      <div style={{ marginTop: 20 }}>
        {/* Header */}
        <div className="card" style={{ padding: 20, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <FileText size={24} className="text-muted" />
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 600 }}>{t.analysisReportTitle}</h3>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{data.file?.split('\\').pop() || data.file}</div>
              </div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => setResult(null)}>
              <ChevronUp size={16} /> {t.close}
            </button>
          </div>

          {/* Overall Assessment */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 16,
            padding: 16, borderRadius: 'var(--radius-md)',
            background: assessment.color === 'var(--success)' ? 'var(--success-light)' :
                       assessment.color === 'var(--warning)' ? 'var(--warning-light)' : 'var(--error-light)',
            border: `1px solid ${assessment.color}20`
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: assessment.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0
            }}>
              <AssessmentIcon size={24} color="white" />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: assessment.color }}>{assessment.label}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{assessment.description}</div>
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="card" style={{ marginBottom: 16, overflow: 'hidden' }}>
          <div
            onClick={() => toggleSection('summary')}
            style={{ padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <BarChart3 size={18} className="text-muted" />
              <span style={{ fontWeight: 600 }}>{t.documentSummary}</span>
            </div>
            {expandedSections.summary ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          {expandedSections.summary && (
            <div style={{ padding: '0 16px 16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
                <div className="stat-box" style={{ padding: 12, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: 24, fontWeight: 700 }}>{data.section_stats?.[0]?.word_count || 0}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.words}</div>
                </div>
                <div className="stat-box" style={{ padding: 12, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: 24, fontWeight: 700 }}>{data.section_stats?.[0]?.sentence_count || 0}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.sentences}</div>
                </div>
                <div className="stat-box" style={{ padding: 12, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: 24, fontWeight: 700 }}>{data.section_stats?.[0]?.avg_sentence_length?.toFixed(1) || 0}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.avgWordsPerSentence}</div>
                </div>
                <div className="stat-box" style={{ padding: 12, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: 24, fontWeight: 700 }}>{data.blocks || 0}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.paragraphs}</div>
                </div>
              </div>

              {/* Burstiness Bar */}
              <div style={{ marginTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{t.sentenceVariety}</span>
                  <span style={{ fontSize: 13, color: burstinessInfo.color, fontWeight: 600 }}>{burstinessInfo.label}</span>
                </div>
                <div className="progress-bar" style={{ height: 8 }}>
                  <div className="progress-fill" style={{ width: `${Math.min(burstiness * 100, 100)}%`, background: burstinessInfo.color }} />
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{burstinessInfo.desc}</div>
              </div>
            </div>
          )}
        </div>

        {/* Writing Style Section */}
        <div className="card" style={{ marginBottom: 16, overflow: 'hidden' }}>
          <div
            onClick={() => toggleSection('style')}
            style={{ padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Sparkles size={18} className="text-muted" />
              <span style={{ fontWeight: 600 }}>{t.writingStyleMarkers}</span>
            </div>
            {expandedSections.style ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          {expandedSections.style && (
            <div style={{ padding: '0 16px 16px' }}>
              {(() => {
                const stats = data.section_stats?.[0];
                const markers = [
                  { label: t.formalConnectives, count: stats?.connective_count || 0, desc: t.formalConnectivesDesc },
                  { label: t.hedgingWords, count: stats?.hedge_count || 0, desc: t.hedgingWordsDesc },
                  { label: t.qualifiers, count: stats?.qualifier_count || 0, desc: t.qualifiersDesc },
                  { label: t.repeatedOpenings, count: stats?.repeated_openings || 0, desc: t.repeatedOpeningsDesc },
                ];
                const hasAny = markers.some(m => m.count > 0);
                if (!hasAny) {
                  return <div style={{ padding: 12, color: 'var(--text-muted)', fontSize: 14 }}>{t.noStyleMarkers}</div>;
                }
                return markers.filter(m => m.count > 0).map(m => (
                  <div key={m.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{m.label}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{m.desc}</div>
                    </div>
                    <span className="badge badge-warning">{m.count} {t.found}</span>
                  </div>
                ));
              })()}
            </div>
          )}
        </div>

        {/* Evidence Matches Section */}
        <div className="card" style={{ marginBottom: 16, overflow: 'hidden' }}>
          <div
            onClick={() => toggleSection('evidence')}
            style={{ padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Search size={18} className="text-muted" />
              <span style={{ fontWeight: 600 }}>{t.detectedPatterns}</span>
              {(data.section_stats?.[0]?.evidence_matches?.length || 0) > 0 && (
                <span className="badge badge-warning">{data.section_stats[0].evidence_matches.length}</span>
              )}
            </div>
            {expandedSections.evidence ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          {expandedSections.evidence && (
            <div style={{ padding: '0 16px 16px' }}>
              {(() => {
                const matches = data.section_stats?.[0]?.evidence_matches || [];
                if (matches.length === 0) {
                  return <div style={{ padding: 12, color: 'var(--text-muted)', fontSize: 14 }}>{t.noPatterns}</div>;
                }
                return matches.map((match: any, i: number) => {
                  const explanation = getEvidenceExplanation(match.pattern_id);
                  return (
                    <div key={i} style={{ padding: 12, marginBottom: 8, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', borderInlineStart: '3px solid var(--warning)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <AlertTriangle size={14} style={{ color: 'var(--warning)' }} />
                        <span style={{ fontSize: 14, fontWeight: 600 }}>{explanation.title}</span>
                        <span className="badge badge-info">{match.category}</span>
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>
                        <strong>{t.whatThisMeans}:</strong> {explanation.meaning}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>
                        <strong>{t.foundLabel}:</strong> "{match.match}"
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--accent)' }}>
                        <strong>{t.tip}:</strong> {explanation.tip}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          )}
        </div>

        {/* Metadata Section */}
        <div className="card" style={{ marginBottom: 16, overflow: 'hidden' }}>
          <div
            onClick={() => toggleSection('metadata')}
            style={{ padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <FileCheck size={18} className="text-muted" />
              <span style={{ fontWeight: 600 }}>{t.documentInfo}</span>
            </div>
            {expandedSections.metadata ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          {expandedSections.metadata && (
            <div style={{ padding: '0 16px 16px' }}>
              {(() => {
                const meta = data.metadata_findings || [];
                if (meta.length === 0) {
                  return <div style={{ padding: 12, color: 'var(--text-muted)', fontSize: 14 }}>{t.noMetadata}</div>;
                }
                return meta.map((m: any, i: number) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 0', borderBottom: i < meta.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                    <div style={{ marginTop: 2 }}>
                      {m.source === 'docx_core' && m.key === 'author' && <User size={14} className="text-muted" />}
                      {m.source === 'docx_core' && (m.key === 'created' || m.key === 'modified') && <Clock size={14} className="text-muted" />}
                      {m.source === 'c2pa' && <Shield size={14} className="text-muted" />}
                      {m.source === 'exif_xmp' && <FileType size={14} className="text-muted" />}
                      {!['docx_core', 'c2pa', 'exif_xmp'].includes(m.source) && <Info size={14} className="text-muted" />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>
                        {m.source === 'docx_core' && m.key === 'author' && t.author}
                        {m.source === 'docx_core' && m.key === 'created' && t.created}
                        {m.source === 'docx_core' && m.key === 'modified' && t.lastModified}
                        {m.source === 'c2pa' && t.c2paSignature}
                        {m.source === 'exif_xmp' && t.exifData}
                        {!['docx_core', 'c2pa', 'exif_xmp'].includes(m.source) && m.key}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        {m.source === 'docx_core' && m.key === 'created' && formatDate(m.value)}
                        {m.source === 'docx_core' && m.key === 'modified' && formatDate(m.value)}
                        {m.source !== 'docx_core' && m.description}
                        {m.source === 'docx_core' && m.key === 'author' && m.value}
                      </div>
                    </div>
                    <span className={`badge badge-${m.severity === 'info' ? 'info' : m.severity === 'warning' ? 'warning' : 'error'}`}>
                      {m.severity === 'info' ? t.info : m.severity === 'warning' ? t.warning : t.error}
                    </span>
                  </div>
                ));
              })()}
            </div>
          )}
        </div>

        {/* Unicode Findings */}
        {(data.unicode_findings?.length || 0) > 0 && (
          <div className="card" style={{ marginBottom: 16, padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <AlertCircle size={18} style={{ color: 'var(--error)' }} />
              <span style={{ fontWeight: 600 }}>{t.hiddenCharacters}</span>
              <span className="badge badge-error">{data.unicode_findings.length}</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
              {t.hiddenCharsDesc}
            </div>
            {data.unicode_findings.map((f: any, i: number) => (
              <div key={i} style={{ padding: 8, background: 'var(--error-light)', borderRadius: 'var(--radius-sm)', marginBottom: 6 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{f.name} ({f.codepoint})</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{f.description}</div>
              </div>
            ))}
          </div>
        )}

        {/* Raw JSON Toggle */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div
            onClick={() => setShowRaw(!showRaw)}
            style={{ padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Code size={16} className="text-muted" />
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>{t.technicalJson}</span>
            </div>
            {showRaw ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>
          {showRaw && (
            <div style={{ padding: '0 12px 12px' }}>
              <JsonViewer data={data} />
            </div>
          )}
        </div>
      </div>
    );
  };

  const ResultViewer = () => {
    if (!result) return null;

    if (result.type === 'analyze') {
      return <ReadableAnalysisView data={result.data} />;
    }

    return (
      <div className="card" style={{ marginTop: 20 }}>
        <div className="section-header">
          <h3 className="section-title">{t.result}</h3>
          <button className="btn btn-ghost btn-sm" onClick={() => setResult(null)}>
            <ChevronUp size={16} /> {t.close}
          </button>
        </div>
        <JsonViewer data={result.data} />
      </div>
    );
  };

  const FilePicker = ({
    label,
    file,
    onSelect,
    onClear
  }: {
    label: string;
    file: FileInfo | null;
    onSelect: () => void;
    onClear?: () => void;
  }) => (
    <div className="card" style={{ padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <FileText className="text-muted" size={24} />
          <div>
            <div style={{ fontWeight: 500 }}>{file ? file.name : label}</div>
            {file && <div className="text-sm text-muted">{formatBytes(file.size)}</div>}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary" onClick={onSelect}>
            <FolderOpen size={16} /> {file ? t.change : t.select}
          </button>
          {file && onClear && (
            <button className="btn btn-ghost" onClick={onClear}>
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'analyze':
        return (
          <div className="section">
            <FilePicker
              label={t.selectDocument}
              file={file}
              onSelect={() => handleFileSelect().then(f => f && setFile(f[0]))}
              onClear={() => setFile(null)}
            />
            <div className="input-group" style={{ marginTop: 16 }}>
              <label className="input-label">{t.authorBaseline}</label>
              <select
                value={selectedBaseline}
                onChange={e => setSelectedBaseline(e.target.value)}
                style={{ width: '100%', maxWidth: 300 }}
              >
                <option value="">{t.none}</option>
                {baselines.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <button
              className="btn btn-primary mt-4"
              onClick={handleAnalyze}
              disabled={loading || !file}
              style={{ width: '100%', maxWidth: 300 }}
            >
              <Search size={16} /> {t.analyzeDocument}
            </button>
          </div>
        );

      case 'clean':
        return (
          <div className="section">
            <FilePicker
              label={t.selectDocumentClean}
              file={file}
              onSelect={() => handleFileSelect().then(f => f && setFile(f[0]))}
              onClear={() => setFile(null)}
            />
            <div className="input-group" style={{ marginTop: 16 }}>
              <label className="input-label">{t.options}</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked /> {t.stripMetadata}
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" /> {t.enableLayerB}
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" /> {t.runDetection}
                </label>
              </div>
            </div>
            <button
              className="btn btn-primary mt-4"
              onClick={handleClean}
              disabled={loading || !file}
              style={{ width: '100%', maxWidth: 300 }}
            >
              <Shield size={16} /> {t.cleanDocument}
            </button>
          </div>
        );

      case 'revise':
        return (
          <div className="section">
            <FilePicker
              label={t.selectDocumentRevise}
              file={file}
              onSelect={() => handleFileSelect().then(f => f && setFile(f[0]))}
              onClear={() => setFile(null)}
            />
            <div className="input-group" style={{ marginTop: 16 }}>
              <label className="input-label">{t.options}</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked /> {t.useLLM}
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" /> {t.enableBaseline}
                </label>
              </div>
            </div>
            <div className="input-group" style={{ marginTop: 16 }}>
              <label className="input-label">{t.sessionFile}</label>
              <input
                type="text"
                placeholder={t.sessionFilePlaceholder}
                style={{ maxWidth: 400 }}
                value={reviseSession || ''}
                onChange={e => setReviseSession(e.target.value)}
              />
            </div>
            <button
              className="btn btn-primary mt-4"
              onClick={handleRevise}
              disabled={loading || !file}
              style={{ width: '100%', maxWidth: 300 }}
            >
              <RotateCcw size={16} /> {t.generateRevision}
            </button>
          </div>
        );

      case 'verify':
        return (
          <div className="section">
            <FilePicker
              label={t.originalDocument}
              file={file}
              onSelect={() => handleFileSelect().then(f => f && setFile(f[0]))}
              onClear={() => setFile(null)}
            />
            <FilePicker
              label={t.revisedDocument}
              file={revisedFile}
              onSelect={() => handleFileSelect().then(f => f && setRevisedFile(f[0]))}
              onClear={() => setRevisedFile(null)}
            />
            <div className="input-group" style={{ marginTop: 16 }}>
              <label className="input-label">{t.authorBaseline}</label>
              <select
                value={selectedBaseline}
                onChange={e => setSelectedBaseline(e.target.value)}
                style={{ width: '100%', maxWidth: 300 }}
              >
                <option value="">{t.noneShort}</option>
                {baselines.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <button
              className="btn btn-primary mt-4"
              onClick={handleVerify}
              disabled={loading || !file || !revisedFile}
              style={{ width: '100%', maxWidth: 300 }}
            >
              <FileCheck size={16} /> {t.verifyChanges}
            </button>
          </div>
        );

      case 'audit':
        return (
          <div className="section">
            <FilePicker
              label={t.originalDocument}
              file={file}
              onSelect={() => handleFileSelect().then(f => f && setFile(f[0]))}
              onClear={() => setFile(null)}
            />
            <FilePicker
              label={t.revisedDocumentOptional}
              file={revisedFile}
              onSelect={() => handleFileSelect().then(f => f && setRevisedFile(f[0]))}
              onClear={() => setRevisedFile(null)}
            />
            <div className="input-group" style={{ marginTop: 16 }}>
              <label className="input-label">{t.includeInPackage}</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked /> {t.analysisReport}
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked /> {t.verificationReport}
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked /> {t.revisionSuggestions}
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked /> {t.sessionLog}
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked /> {t.auditLog}
                </label>
              </div>
            </div>
            <button
              className="btn btn-primary mt-4"
              onClick={handleAudit}
              disabled={loading || !file}
              style={{ width: '100%', maxWidth: 300 }}
            >
              <History size={16} /> {t.createAudit}
            </button>
          </div>
        );

      case 'baseline':
        return (
          <div className="section">
            <div className="card" style={{ padding: 16, marginBottom: 16 }}>
              <h3 style={{ marginBottom: 16 }}>{t.createNewBaseline}</h3>
              <FilePicker
                label={t.addSampleDocs}
                file={null}
                onSelect={handleBaselineAdd}
              />
              <div className="input-group" style={{ marginTop: 16, maxWidth: 300 }}>
                <label className="input-label">{t.baselineName}</label>
                <input
                  type="text"
                  placeholder={t.baselineNamePlaceholder}
                  style={{ width: '100%' }}
                  onKeyDown={e => e.key === 'Enter' && handleBaselineAdd()}
                />
              </div>
              <button
                className="btn btn-primary mt-4"
                onClick={handleBaselineAdd}
                disabled={loading}
                style={{ width: '100%', maxWidth: 300 }}
              >
                <Zap size={16} /> {t.createBaseline}
              </button>
            </div>

            <div className="card" style={{ padding: 16 }}>
              <h3 style={{ marginBottom: 16 }}>{t.existingBaselines}</h3>
              {baselines.length === 0 ? (
                <p className="text-sm text-muted">{t.noBaselines}</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {baselines.map(b => (
                    <div key={b} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                      <span style={{ fontWeight: 500 }}>{b}</span>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => { setSelectedBaseline(b); handleBaselineShow(); }}
                      >
                        <Eye size={14} /> {t.view}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return <div>{t.selectTab}</div>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header style={{
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/icon.png" alt="ai-tell" style={{ width: 32, height: 32, borderRadius: 8 }} />
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>ai-tell</h1>
            {appVersion && <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>v{appVersion}</div>}
          </div>
        </div>
        <nav style={{ display: 'flex', gap: 2 }}>
          {tabConfig.map(tab => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id as TabId)}
              title={tab.desc}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 300,
            position: 'relative'
          }}>
            <FileText className="text-muted" style={{ position: 'absolute', insetInlineStart: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', width: 16, height: 16 }} />
            <input
              type="text"
              placeholder={t.dragDrop}
              style={{
                width: '100%',
                padding: isRTL ? '8px 36px 8px 12px' : '8px 12px 8px 36px',
                fontSize: 13,
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)'
              }}
              onClick={() => handleFileSelect().then(f => f && setFile(f[0]))}
              readOnly
              value={file?.name || ''}
            />
          </div>
          {file && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setFile(null)}
            >
              <Trash2 size={14} /> {t.clear}
            </button>
          )}
          {updater.phase !== 'idle' && (
            <button
              className="btn btn-primary btn-sm"
              onClick={handleUpdateClick}
              disabled={updater.phase === 'installing'}
              data-testid="update-button"
              title={
                updater.phase === 'available' ? t.updateTo.replace('{version}', updater.version ?? '')
                : updater.phase === 'downloaded' ? t.restartToUpdate
                : t.installing
              }
              style={{ fontWeight: 600 }}
            >
              {updater.phase === 'available' && (
                <><Download size={14} /><span>{t.updateTo.replace('{version}', updater.version ?? '')}</span></>
              )}
              {updater.phase === 'downloading' && (
                <><Download size={14} /><span>{t.downloading.replace('{percent}', String(updater.percent ?? 0))}</span></>
              )}
              {updater.phase === 'downloaded' && (
                <><RefreshCw size={14} /><span>{t.restartToUpdate}</span></>
              )}
              {updater.phase === 'installing' && (
                <span>{t.installing}</span>
              )}
            </button>
          )}
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            aria-label={lang === 'en' ? 'التبديل إلى العربية' : 'Switch to English'}
            title={lang === 'en' ? 'التبديل إلى العربية' : 'Switch to English'}
            style={{ fontWeight: 600 }}
          >
            <Languages size={14} />
            <span>{lang === 'en' ? 'عربي' : 'EN'}</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, padding: 24, maxWidth: 1000, width: '100%', margin: '0 auto' }}>
        {renderTabContent()}
        <ResultViewer />
      </main>

      {/* Toasts */}
      <div style={{ position: 'fixed', bottom: 24, right: isRTL ? 'auto' : 24, left: isRTL ? 24 : 'auto', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`toast toast-${toast.type}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 20px',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              minWidth: 300
            }}
          >
            {toast.type === 'success' && <CheckCircle size={20} />}
            {toast.type === 'error' && <AlertCircle size={20} />}
            {toast.type === 'info' && <Info size={20} />}
            <span style={{ flex: 1 }}>{toast.message}</span>
            <button onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
import type { Article } from './articles';

/**
 * Arabic article metadata + hero overlays (professional business Arabic;
 * dates and read-times localized, author names transliterated).
 *
 * TODO: add `bodyHtml` per slug with the fully translated article body —
 * until then the Arabic locale renders the English body (forced LTR) under
 * an Arabic hero and chrome. Adding bodyHtml here automatically switches
 * the body to Arabic with no further code changes.
 */
export const AR_ARTICLES: Record<string, Partial<Article>> = {
  "high-density-storage": {
    title: "خارطة طريق التخزين عالي الكثافة 2025",
    h1: "تطور التخزين عالي الكثافة: خارطة طريق الصناعة 2025",
    description: "كيف تعيد وحدات الأرفف شبه المؤتمتة والذكاء الاصطناعي المتكامل تعريف كفاءة الإنتاجية لمراكز التصدير العالمية — تحليل معمّق لمستقبل التخزين عالي الكثافة حتى 2025.",
    heroAlt: "مخزن مؤتمت",
    readTime: "12 دقيقة قراءة",
    heroOverlayHtml: "<div class=\"absolute bottom-0 left-0 right-0 px-6 md:px-10 pb-12 max-w-4xl mx-auto\">\n    <div class=\"hero-animate\" style=\"animation-delay:.1s\">\n      <span class=\"inline-block bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4\">ابتكارات المنتجات</span>\n    </div>\n    <h1 class=\"hero-animate font-black text-white leading-tight mb-4\" style=\"font-size:clamp(1.6rem,4vw,2.75rem);letter-spacing:-.02em;animation-delay:.25s\">تطور التخزين عالي الكثافة:<br/>خارطة طريق الصناعة 2025</h1>\n    <div class=\"hero-animate flex flex-wrap items-center gap-4 text-white/70 text-sm\" style=\"animation-delay:.4s\">\n      <div class=\"flex items-center gap-2\">\n        <div class=\"w-8 h-8 rounded-full bg-primary flex items-center justify-center\"><span class=\"material-symbols-outlined text-white\" style=\"font-size:14px\">person</span></div>\n        <span class=\"font-semibold text-white\">د. ماركوس فانس</span>\n        <span>·</span><span>المدير التقني</span>\n      </div>\n      <span>·</span><span>3 يونيو 2024</span><span>·</span><span>12 دقيقة قراءة</span>\n    </div>\n  </div>",
  },
  "net-zero-2030": {
    title: "التزام صافي الانبعاثات الصفري 2030",
    h1: "لوجستيات مستدامة: التزامنا بصافي انبعاثات صفري 2030",
    description: "خفض البصمة الكربونية عبر تصميم منشآت متكاملة مع الطاقة الشمسية وحلول نقل كهربائية — خطة جاينت ستوريدج للوصول إلى صافي انبعاثات صفري بحلول 2030.",
    heroAlt: "مخزن مستدام",
    readTime: "8 دقائق قراءة",
    heroOverlayHtml: "<div class=\"absolute bottom-0 left-0 right-0 px-6 md:px-10 pb-12 max-w-4xl mx-auto\">\n    <span class=\"hero-animate inline-block bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4\" style=\"animation-delay:.1s\">المسؤولية المؤسسية</span>\n    <h1 class=\"hero-animate font-black text-white leading-tight mb-4\" style=\"font-size:clamp(1.6rem,4vw,2.75rem);letter-spacing:-.02em;animation-delay:.25s\">لوجستيات مستدامة:<br/>التزامنا بصافي انبعاثات صفري 2030</h1>\n    <div class=\"hero-animate flex flex-wrap items-center gap-3 text-white/70 text-sm\" style=\"animation-delay:.4s\">\n      <div class=\"w-8 h-8 rounded-full bg-primary flex items-center justify-center\"><span class=\"material-symbols-outlined text-white\" style=\"font-size:14px\">person</span></div>\n      <span class=\"font-semibold text-white\">سارة المنصوري</span><span>·</span><span>رئيسة قطاع الاستدامة</span><span>·</span><span>24 مايو 2024</span><span>·</span><span>8 دقائق قراءة</span>\n    </div>\n  </div>",
  },
  "urban-fulfillment": {
    title: "مراكز التوزيع الحضرية",
    h1: "تعظيم مساحات التشغيل في مراكز التوزيع الحضرية",
    description: "كيف تُمكِّن أنظمة الترفيف الرأسي التوصيل في اليوم التالي داخل المدن العالمية عالية الكثافة — استراتيجيات تعظيم المساحة في مراكز التوزيع الحضرية.",
    heroAlt: "نظام ترفيف",
    readTime: "10 دقائق قراءة",
    heroOverlayHtml: "<div class=\"absolute bottom-0 left-0 right-0 px-6 md:px-10 pb-12 max-w-4xl mx-auto\">\n    <span class=\"hero-animate inline-block bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4\" style=\"animation-delay:.1s\">اتجاهات اللوجستيات</span>\n    <h1 class=\"hero-animate font-black text-white leading-tight mb-4\" style=\"font-size:clamp(1.6rem,4vw,2.75rem);letter-spacing:-.02em;animation-delay:.25s\">تعظيم مساحات التشغيل في<br/>مراكز التوزيع الحضرية</h1>\n    <div class=\"hero-animate flex flex-wrap items-center gap-3 text-white/70 text-sm\" style=\"animation-delay:.4s\">\n      <div class=\"w-8 h-8 rounded-full bg-primary flex items-center justify-center\"><span class=\"material-symbols-outlined text-white\" style=\"font-size:14px\">person</span></div>\n      <span class=\"font-semibold text-white\">جيمس أوكافور</span><span>·</span><span>رئيس هندسة اللوجستيات</span><span>·</span><span>18 مايو 2024</span><span>·</span><span>10 دقائق قراءة</span>\n    </div>\n  </div>",
  },
  "southeast-asia": {
    title: "التوسع في جنوب شرق آسيا",
    h1: "توسيع انتشارنا: مراكز توزيع جديدة في جنوب شرق آسيا",
    description: "تعلن جاينت ستوريدج عن شراكات استراتيجية ومراكز توزيع جديدة لتعزيز البنية التحتية للتخزين في أسواق جنوب شرق آسيا الناشئة.",
    heroAlt: "شبكة لوجستيات عالمية",
    readTime: "7 دقائق قراءة",
    heroOverlayHtml: "<div class=\"absolute bottom-0 left-0 right-0 px-6 md:px-10 pb-12 max-w-4xl mx-auto\">\n    <span class=\"hero-animate inline-block bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4\" style=\"animation-delay:.1s\">التصدير العالمي</span>\n    <h1 class=\"hero-animate font-black text-white leading-tight mb-4\" style=\"font-size:clamp(1.6rem,4vw,2.75rem);letter-spacing:-.02em;animation-delay:.25s\">توسيع انتشارنا:<br/>مراكز توزيع جديدة في جنوب شرق آسيا</h1>\n    <div class=\"hero-animate flex flex-wrap items-center gap-3 text-white/70 text-sm\" style=\"animation-delay:.4s\">\n      <div class=\"w-8 h-8 rounded-full bg-primary flex items-center justify-center\"><span class=\"material-symbols-outlined text-white\" style=\"font-size:14px\">person</span></div>\n      <span class=\"font-semibold text-white\">بريا سوندارام</span><span>·</span><span>نائبة الرئيس للاستراتيجية الدولية</span><span>·</span><span>12 مايو 2024</span><span>·</span><span>7 دقائق قراءة</span>\n    </div>\n  </div>",
  },
};

import React, { useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import {
  Home,
  ArrowRight,
  Check,
  X,
  ArrowLeft,
  Award,
  Trophy,
  Star,
} from "lucide-react";
import "./commoncss/global.css";

const quizTopics = [
  {
    id: "airwayQuestions",
    title: "פרק 1",
    questions: [
      {
        question:
          "מה נכון לגבי מטופל שאין לו GAG REFLEX בהכרה מלאה ושומר על אוורור וחמצון תקינים?",
        answers: [
          "חוסר ב-GAG REFLEX מחייב אינטובציה דחופה",
          "בערך ל-20% מהאוכלוסיה הבוגרת אין בכלל GAG REFLEX. אין להתייחס ל-GAG REFLEX כמדד לאינטובציה דחופה",
          "ל-5% מהאוכלוסיה הבוגרת אין GAG REFLEX",
          "אין חשיבות ליכולת של מטופל לבלוע או לשלוט בהפרשות בהתייחס ליכולת שלו לשמור על נתיב אוויר",
        ],
        correct: 1,
        explanation:
          "ל-12-25% מהאוכלוסייה הבוגרת אין GAG REFLEX ואין לזה קשר ליכולת לשמור על נתיב אוויר",
      },
      {
        question:
          "באם התרחש קושי להנשים מטופל באמצעות אמבו ומסכה בחדר מיון, מה הסיכוי להיכשל באינטובציה?",
        answers: [
          "פי עשר ויותר",
          "עד פי חמש",
          "בין פי חמש לפי עשר",
          "אין קשר בין קושי בהנשמה באמבו ומסכה להערכת כישלון באינטובציה",
        ],
        correct: 0,
        explanation:
          "קושי בהנשמה באמבו מעלה את הסיכוי לכישלון באינטובציה פי 12",
      },
      {
        question:
          "נקראת לחדר הלם לצורך אינטובציה דחופה. במסגרת הערכת נתיב האוויר, ראית מלמפטי סקור 3. מה משמעות הדבר?",
        answers: [
          "צפויה אינטובציה קלה",
          "צפויה אינטובציה בינונית",
          "צפויה אינטובציה קשה",
          "לא ניתן לנבא את דרגת הקושי",
        ],
        correct: 2,
        explanation: "מלמפטי סקור 3 מעיד על צפי לאינטובציה קשה",
      },
      {
        question:
          "ביצעת הערכת LEMON והמרחק בין ה-apple Adams לצד התחתון של הסנטר הוא פחות משתי אצבעות. מה נכון?",
        answers: [
          "יתכן קושי באינטובציה בלבד",
          "ייתכן קושי בהנשמה עם אמבו וכן קושי באינטובציה",
          "ייתכן קושי בהכנסת LMA וכן קושי באינטובציה",
          "ייתכן קושי בהנשמה עם אמבו ובהכנסת LMA",
        ],
        correct: 2,
        explanation: "מרחק קצר מדי מעיד על אפשרות לקושי בהכנסת LMA ובאינטובציה",
      },
      {
        question:
          "ביצעת לרינגוסקופיה, והצלחת להבחין רק בארטינואידים. איזו דרגת cormack lehane תתן למראה זה?",
        answers: ["1", "2", "3", "4"],
        correct: 1,
        explanation: "ראיית ארטינואידים בלבד מתאימה לדרגה 2",
      },
      {
        question:
          "לאחר ביצוע לרינגוסקופיה, כמה גלים של ETCo2 (הנשמות), יאשרו שאנו בדרכי האוויר?",
        answers: ["3", "4", "5", "6"],
        correct: 3,
        explanation: "נדרשים 6 גלי ETCo2 לאישור מיקום הטובוס בדרכי האוויר",
      },
      {
        question:
          "תוך כמה נסיונות אינטובציה (הטובים ביותר שלך) תעבור מ-Difficult Airway Algorithm ל-Failed Airway Algorithm?",
        answers: ["1", "2", "3", "זה תלוי אם ביצעתי אינטובציה DL או VL"],
        correct: 0,
        explanation: "יש לעבור לאלגוריתם Failed Airway לאחר ניסיון אחד",
      },
      {
        question:
          "אתה כבר נמצא ב-Failed Airway Algorithm, אינך יכול להנשים עם אמבו ומסכה, סטורציה 91%. מה השלב הבא באלגוריתם?",
        answers: [
          "ניסיון אינטובציה נוסף באמצעות VL",
          "Cricothyrotomy",
          "תמיד מומלץ ניסיון עם EGD לפני Cricothyrotomy",
          "שינוי תנוחת ראש המטופל, וניסיון נוסף בהנשמה עם אמבו ומסכה",
        ],
        correct: 1,
        explanation:
          "במצב של Failed Airway עם חוסר יכולת להנשים, יש לבצע Cricothyrotomy",
      },
      {
        question:
          "לצורך RSI במטופל השוקל 70 קילו עם מחלות רקע מרובות, נתת 70 מ״ג של סקולין לאחר חמצון מתאים. לא הצלחת אינטובציה. האם סביר שיתאושש ממתן המשתק לפני דסטורציה?",
        answers: [
          "כן. משך הפעולה של סקולין נמשך בין 7 ל-12 דקות",
          "כן. בדרך כלל המינון של סקולין ל-RSI הוא 2 מ״ג לקג",
          "לא. בשל מחלות הרקע המרובות של המטופל",
          "לא ניתן לשער",
        ],
        correct: 2,
        explanation:
          "בשל מחלות הרקע המרובות, יש סיכון מוגבר לדסטורציה לפני התאוששות מהסקולין",
      },
      {
        question:
          "מי מהחולים הבאים בסבירות גבוהה יותר עלול לקרוס בעת ביצוע RSI?",
        answers: [
          "חולה עם ספיקת לב שמאלית",
          "חולה עם ספיקת לב ימנית",
          "חולה עם יתר ל.ד לא מאוזן",
          "חולה בהתקף אסתמה חריף",
        ],
        correct: 1,
        explanation:
          "חולים עם ספיקת לב ימנית נמצאים בסיכון גבוה יותר לקריסה המודינמית בעת RSI",
      },
      {
        question: "באופן כללי בחדר מיון, מה נכון לגבי ביצוע אינטובציה?",
        answers: [
          "השימוש במשתק שרירים מאוד מומלץ",
          "השימוש במשתק שרירים אינו מומלץ",
          "תמיד יש עדיפות לאינטובציה בזמן ערות",
          "אין החלטה גורפת לגבי שימוש/אי שימוש במשתקי שרירים לצורך ביצוע אינטובציה בחדר מיון",
        ],
        correct: 0,
        explanation: "השימוש במשתק שרירים מומלץ מאוד בחדר מיון",
      },
      {
        question:
          "לחדר הלם הגיע מטופל בן 80, ברקע ניתוח לתיקון בקע טבורי מלפני כשנתיים. מזה כשבוע אי נוחות בבטן וכאבים מתגברים. בקבלתו - בהכרה מעורפלת, נראה סובל מכאבים בבטנו. נלקחו מדדים: RR - 26, סטורציה 88% עם משקפי חמצן, ל.ד 86/56, 131 פעימות לדקה, חום 37.9. החלטת על RSI. מה נכון לגבי שימוש בסקולין בחולה זה?",
        answers: [
          "לאור מצבו הנשימתי של המטופל, אעדיף שימוש בסקולין (במינון מתאים, מרגע מתן הסקולין עד השיתוק הדרוש לאינטובציה, תעבורנה 45 שניות)",
          "לאור מצבו הקרדיאלי של המטופל, אעדיף שימוש בסקולין (סקולין יכול למתן את הטכיקרדיה - נקשר לרצפטורים מוסקרניים בלב)",
          "בשל הרקע של המטופל (בריא, ללא בעיית כליות), אין כל מניעה משימוש בסקולין",
          "בשל חשש מזיהום בטני אצל מטופל זה, אמנע משימוש בסקולין",
        ],
        correct: 3,
        explanation:
          "במקרה של חשד לזיהום בטני, יש להימנע משימוש בסקולין עקב סיכון לעליית אשלגן",
      },
      {
        question: "מה נכון לגבי RSI אצל מטפל הנמצא במצב שוק?",
        answers: [
          "קטמין זו תרופת הבחירה, במינון גבוה מהרגיל (2 מג לקג), בשל התגובה הסימפתטית שהיא תעורר",
          "ניתן לתת אטומידאט, במינון מופחת, בשל חשש מדיכוי אדרנל",
          "ישנה התווית נגד מוחלטת נגד שימוש בפרופפול",
          "באם אין התווית נגד, ניתן להשתמש בסקולין",
        ],
        correct: 3,
        explanation: "בהעדר התוויות נגד, ניתן להשתמש בסקולין גם במטופל בשוק",
      },
      {
        question:
          'על פי המחקר שנערך ע"י ה-National Emergency Airway Registry, מהי בערך הסבירות לאירוע שלילי (adverse events) סביב אינטובציות במחלקה לרפואה דחופה (ED)?',
        answers: ["3 - 5", "7 - 10", "10 - 12", "13 - 15"],
        correct: 2,
        explanation: "הסבירות לאירוע שלילי היא בין 10 ל-12 אחוזים",
      },
    ],
  },

  {
    id: "mechanicalVentilationQuestions",
    title: "פרק 2",
    questions: [
      {
        question:
          "מה נכון לגבי ההבדלים הפיזיולוגים בין נשימה ספונטנית, להנשמה בלחץ חיובי?",
        answers: [
          "אין הבדל בהפרש הלחצים בין חדר שמאל לאבי העורקים בשני סוגי ההנשמות",
          "בנשימה ספונטנית, הפרש הלחצים בין חדר שמאל לאבי העורקים גדול יותר מהפרש הלחצים בזמן הנשמה בלחץ חיובי",
          "בנשימה ספונטנית, הפרש הלחצים בין חדר שמאל לאבי העורקים קטן יותר מהפרש הלחצים בזמן הנשמה בלחץ חיובי",
          "בזמן הנשמה בלחץ חיובי ישנה עלייה בתפוקת הלב",
        ],
        correct: 2,
        explanation:
          "בנשימה ספונטנית הפרש הלחצים קטן יותר מאשר בהנשמה בלחץ חיובי",
      },
      {
        question: "מה הכוונה במונח inspiratory flow rate?",
        answers: [
          "כמות הנשימות/הנשמות בזמן מסויים",
          "משך הנשימה בזמן אינספיריום",
          "מהירות זרימת האוויר במערכת ההנשמה",
          "זהו מונח המתקיים רק בזמן הנשמה במצב של volume-controlled ventilation",
        ],
        correct: 2,
        explanation:
          "inspiratory flow rate מתייחס למהירות זרימת האוויר במערכת ההנשמה",
      },
      {
        question: "מה מהבאים נכון?",
        answers: [
          "בזמן הנשמה ב-Pressure-controlled ventilation ה-inspiratory flow rate נשאר קבוע",
          "בזמן הנשמה ב-volume-controlled ventilation ה-end-inspiratory alveolar pressure נשאר קבוע",
          "לחולה ARDS מורדם ומונשם, מומלצת הנשמה מסוג Pressure-controlled ventilation",
          "לחולה עם salicylate toxicity מורדם ומונשם, מומלצת הנשמה מסוג Pressure-controlled ventilation",
        ],
        correct: 2,
        explanation:
          "לחולי ARDS, הנשמה מסוג Pressure-controlled ventilation מומלצת יותר",
      },
      {
        question: "מה נכון לגבי הנשמת מטופל במנשם במצב של Assist-control?",
        answers: [
          "הנשימה הספונטנית של המטופל תאפס מחדש את קצב ההנשמות של המנשם",
          "במצב של Assist-control קצב ההנשמות הוא קבוע ללא תלות בנשימות הספונטניות של המטופל",
          "Assist-control זהו מצב מנשם הבטוח לחולה עם סכנה לאיוורור יתר",
          "ה-Tidal volume תמיד קבוע במצב של Assist-control",
        ],
        correct: 1,
        explanation:
          "במצב Assist-control, קצב ההנשמות נשאר קבוע ללא תלות בנשימות הספונטניות של המטופל",
      },
      {
        question:
          "איזה פרמטר מהבאים אחראי על סיום מתן סיוע בהנשמה (end of inhalation) כאשר המנשם מכוון ל-Continuous Spontaneous Ventilation?",
        answers: [
          "Tidal volume",
          "inspiratory flow",
          "Target pressure",
          "PEEP",
        ],
        correct: 1,
        explanation:
          "ה-inspiratory flow אחראי על סיום מתן סיוע בהנשמה במצב של Continuous Spontaneous Ventilation",
      },
      {
        question: "מה נכון בהתייחס ל-Positive End-Expiratory Pressure?",
        answers: [
          "מקטין את ה-shunt הקיים בריאות",
          "מקטין את הנפח המת הקיים בריאות",
          "מקטין את ה-FRC",
          "מגדיל את ההחזר הורידי אל העלייה הימנית",
        ],
        correct: 0,
        explanation: "PEEP מקטין את ה-shunt הקיים בריאות",
      },
      {
        question:
          "בהסתמך על מחקרים, מה נכון בהתייחס להנשמה לא פולשנית מסוג NPPV אצל חולים עם דלקת ריאות?",
        answers: [
          "NPPV אצל חולים עם דלקת ריאות, הוכחה כיעילה",
          "הנשמה NPPV ממושכת, מפחיתה את הצורך באינטובציה אצל חולים עם דלקת ריאות",
          "הנשמה מסוג NPPV אינה מומלצת בשום שלב כחלק מהטיפול אצל חולה עם דלקת ריאות",
          "אם ישנו כשלון טיפולי באמצעות NPPV אצל חולה עם דלקת ריאות, מומלץ לבצע אינטובציה מוקדם ככל הניתן",
        ],
        correct: 3,
        explanation:
          "במקרה של כשלון טיפולי ב-NPPV בחולה עם דלקת ריאות, מומלץ לבצע אינטובציה מוקדם ככל האפשר",
      },
      {
        question:
          "מה נכון לגבי ROX index אצל מטופל המונשם באמצעות High-Flow Nasal Cannula, ועם הערכים הבאים: RR - 25, SPO2 - 97%, FIO2 - 50%?",
        answers: [
          "מומלץ לבדוק ROX לאחר כשעה עם הנשמה באמצעות HFNC",
          "למטופל זה קיים סיכוי גבוה לכישלון באמצעות HFNC",
          "למטופל זה קיים סיכוי נמוך לכישלון באמצעות HFNC",
          "חסרים נתונים בשאלה בכדי לקבוע מהו ה-ROX index",
        ],
        correct: 2,
        explanation:
          "עם הערכים הנתונים, למטופל קיים סיכוי נמוך לכישלון באמצעות HFNC",
      },
      {
        question:
          "ביצעת אינטובציה, וחיברת מטופל למכונת הנשמה. המכונה החלה לצפצף, ולסמן HIGH PIP אולם Pplat בגדר הנורמה. מה הכי סביר באבחנה מבדלת?",
        answers: [
          "bronchospasm",
          "Pneumothorax",
          "Abdominal distention",
          "Inadequate sedation",
        ],
        correct: 0,
        explanation:
          "bronchospasm (התכווצות סימפונות) הוא הגורם הסביר ביותר במצב זה",
      },
      {
        question:
          "ביצעת אינטובציה, וחיברת מטופל למכונת הנשמה. המכונה החלה לצפצף. שמת לב כי המטופל איננו יציב המודינמית והסטורציה במגמת ירידה. מה הדבר הראשון אשר תעשה?",
        answers: [
          "אשתק את המטופל",
          "אעמיק את הסדציה",
          "אנתק את המכונה ואנשים עם אמבו",
          "אבצע POCUS",
        ],
        correct: 2,
        explanation:
          "הפעולה הראשונה היא לנתק את המכונה ולהנשים את המטופל עם אמבו",
      },
    ],
  },
  {
    id: "shockQuestions",
    title: "פרק 3",
    questions: [
      {
        question: "מה הם אחוזי התמותה כתוצאה משוק?",
        answers: ["מתחת לחמישה אחוז", "5 - 10%", "10 - 20%", "מעל 20%"],
        correct: 3,
        explanation: "ב-mortality rates exceed 20% בכל מצבי השוק השונים",
      },
      {
        question: "מה נכון לגבי מיטוכונדריה?",
        answers: [
          "מתפקדת בסביבה בעלת מתח חמצן נמוך, וצורכת מעט חמצן",
          "מתפקדת בסביבה בעלת מתח חמצן נמוך, וצורכת הרבה חמצן",
          "מתפקדת בסביבה בעלת מתח חמצן גבוה, וצורכת מעט חמצן",
          "מתפקדת בסביבה בעלת מתח חמצן גבוה, וצורכת הרבה חמצן",
        ],
        correct: 1,
        explanation:
          "המיטוכונדריה מתפקדת במתח חמצן נמוך אך צורכת כמעט את כל החמצן בגוף",
      },
      {
        question:
          "מה צפוי להיות בשלב הראשון של שוק המורגי, אצל מטופל ללא מחלות רקע?",
        answers: [
          "היפרקלמיה",
          "PCo2 מעל 35 ממ״כ",
          "רמות לקטט מעל 4 מילימול לליטר",
          "פגיעה של הריאות על ידי נויטרופילים",
        ],
        correct: 2,
        explanation:
          "בשלב הראשון של שוק המורגי מופיעה עליית לקטט מעל 4 מילימול/ליטר",
      },
      {
        question: "מי מהבאים עונה על הקריטריונים של שוק קרדיוגני?",
        answers: [
          "בן 50, מתייצג עם כאבים בחזה, באקג - עדות לשינויים איסכמיים, דיספניאה (RR - 18/MIN) בצקת ריאות, בצקת פריפרית, לקטט 3 מילמול/ליטר, כיחלון",
          "בן 50, מתייצג עם כאבים בחזה, באקג - עדות לשינויים איסכמיים, נראה חולה, כיחלון, PCO2 31 mmHg, טכיקרדיה של 110 פעימות בדקה, BE - מינוס 5 מיליאקוויולנט לליטר",
          "בן 50, מתייצג עם כאבים בחזה, באקג - עדות לשינויים איסכמיים, נראה חולה, ל.ד סיסטולי 95 ממ״כ, טכיפניאה 25 נשימות בדקה, בצקת פריפרית, כיחלון",
          "בן 50, מתייצג עם כאבים בחזה, באקג - עדות לשינויים איסכמיים, נראה חולה, ל.ד סיסטולי 85 ממ״כ, טכיפניאה 25 נשימות בדקה, בצקת פריפרית, כיחלון",
        ],
        correct: 1,
        explanation:
          "המטופל מציג סימנים קלאסיים של שוק קרדיוגני עם שינויים באק״ג ותמונה קלינית תואמת",
      },
      {
        question:
          "מהו ה-SOFA SCORE למטופל עם הערכים הבאים: PaO2/FiO2 - 201-300, Cardiovascular - Dopamine ≤5 mcg/kg/min or any dose of dobutamine, Coagulation (platelet count) - 50-99, Renal (Creatinine) - 2.0-3.4, Liver (Bilirubin) - 2.0-5.9, Neurologic (GCS) - 10-12",
        answers: ["1", "2", "3", "4"],
        correct: 1,
        explanation: "לפי טבלת SOFA, הערכים הנ״ל מסתכמים לציון 2",
      },
      {
        question: "מה מהבאים הוא הטיפול הנכון?",
        answers: [
          "בעת שוק המורגי, יש לתת 30 קריסטלואידים במינון של 30 מ״ל לקילו",
          "בעת שוק קרדיוגני, יש לתת דובוטמין במינון של 0.5 מקג/ק״ג/לדקה",
          "בעת שוק קרדיוגני, יש לתת נוראפינפרין במינון של 5 מקג/ק״ג/לדקה",
          "בעת שוק ספטי, יש לתת 30 קריסטלואידים במינון של 30 מ״ל לקילו",
        ],
        correct: 3,
        explanation: "בשוק ספטי יש לתת קריסטלואידים במינון של 30 מ״ל לקילו",
      },
      {
        question: "בעת מתן נוזלים למטופל בשוק, מה מהבאים הוא המטרה?",
        answers: [
          "העלאת הלחץ הסיסטולי בעלייה ימין",
          "העלאת הלחץ הדיאסטולי בעלייה ימין",
          "העלאת הלחץ הסיסטולי בחדר שמאל",
          "העלאת הלחץ הדיאסטולי בחדר שמאל",
        ],
        correct: 3,
        explanation: "המטרה היא העלאת הלחץ הדיאסטולי בחדר שמאל",
      },
      {
        question:
          "מה המינון של מתן דם (PRBCs) לילד בריא בן 7, הנמצא בשוק המורגי?",
        answers: [
          "1 - 5 מ״ל לקג",
          "5 - 10 מ״ל לקג",
          "10 - 20 מ״ל לקג",
          "20 - 25 מ״ל לקג",
        ],
        correct: 1,
        explanation: "המינון המומלץ הוא 5-10 מ״ל לקג",
      },
      {
        question:
          "מהו ה-mean arterial pressure הרצוי בטיפול בשוק ספטי? (ערכים ב-mm Hg)",
        answers: [
          "מעל סיסטולי 110 ודיאסטולי 62",
          "מעל סיסטולי 100 ודיאסטולי 57",
          "מעל סיסטולי 90 ודיאסטולי 53",
          "מעל סיסטולי 95 ודיאסטולי 54",
        ],
        correct: 2,
        explanation: "הערכים הרצויים הם מעל סיסטולי 90 ודיאסטולי 53",
      },
      {
        question: "מה מהבאים יכולה להיות תופעת לוואי של דובוטמין?",
        answers: [
          "ברדיקרדיה",
          "ירידה בלחץ דם",
          "שבץ (STROKE)",
          "נמק של הרקמות (tissue necrosis)",
        ],
        correct: 1,
        explanation: "ירידה בלחץ דם היא תופעת לוואי אפשרית של דובוטמין",
      },
    ],
  },
];

const HomeButton = ({ onClick }) => (
  <Button
    onClick={onClick}
    className="flex items-center gap-2 bg-[var(--buttons-background-color)] text-[var(--buttons-color)] transition-all duration-300 "
  >
    <Home className="w-4 h-4" />
    דף הבית
  </Button>
);

const HomePage = ({ onTopicSelect }) => (
  <Card className="max-w-lg mx-auto mt-8 p-6 bg-[var(--page-background-color)] border-[var(--border-color)]">
    <CardContent className="space-y-4">
      <h1 className="text-2xl font-bold text-center mb-6 text-[var(--page-font-color)]">
        בחר נושא
      </h1>
      <div className="space-y-4">
        {quizTopics.map((topic) => (
          <Button
            key={topic.id}
            className="w-full text-lg bg-[var(--buttons-background-color)] text-[var(--buttons-color)] transition-all duration-300 "
            onClick={() => onTopicSelect(topic.id)}
          >
            {topic.title}
          </Button>
        ))}
      </div>
    </CardContent>
  </Card>
);

const QuizPage = ({ questions, onComplete, onHome }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
    setShowAnswer(true);
    if (index === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    } else {
      onComplete(Math.round((score / questions.length) * 100));
    }
  };

  return (
    <Card className="max-w-2xl mx-auto mt-8 p-6 bg-[var(--page-background-color)] border-[var(--border-color)]">
      <CardContent className="space-y-4">
        <div className="text-sm mb-4 text-[var(--header-text-color)]">
          שאלה {currentQuestion + 1} מתוך {questions.length}
        </div>
        <h2 className="text-xl font-semibold mb-4 text-[var(--page-font-color)]">
          {questions[currentQuestion].question}
        </h2>
        <div className="space-y-3">
          {questions[currentQuestion].answers.map((answer, index) => (
            <Button
              key={index}
              className={`w-full text-right ${
                showAnswer
                  ? index === questions[currentQuestion].correct
                    ? "bg-green-100 text-[var(--page-font-color)] border border-green-300"
                    : selectedAnswer === index
                    ? "bg-[#fff0f0] text-[var(--page-font-color)] border border-[#ff9999]"
                    : "bg-[var(--header-background)] text-[var(--page-font-color)] border border-gray-300"
                  : "bg-[var(--header-background)] text-[var(--page-font-color)] border border-gray-300 hover:bg-[var(--header-background)] hover:opacity-80"
              }`}
              onClick={() => !showAnswer && handleAnswer(index)}
              disabled={showAnswer}
            >
              <div className="flex w-full items-center">
                <div className="w-5 h-5 shrink-0 ml-2">
                  {showAnswer &&
                    (index === questions[currentQuestion].correct ? (
                      <Check className="w-full h-full text-green-600" />
                    ) : selectedAnswer === index ? (
                      <X className="w-full h-full text-[#ff9999]" />
                    ) : null)}
                </div>
                <span className="w-full text-right">{answer}</span>
              </div>
            </Button>
          ))}
        </div>
        {showAnswer && (
          <div className="mt-4 space-y-4">
            <div className="p-4 bg-[var(--header-background)] rounded-lg border border-[var(--buttons-background-color)]">
              <h3 className="font-semibold mb-2 text-[var(--page-font-color)]">
                הסבר:
              </h3>
              <p className="text-[var(--header-text-color)]">
                {questions[currentQuestion].explanation}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <HomeButton onClick={onHome} />
              <Button
                onClick={nextQuestion}
                className="flex items-center gap-2 bg-[var(--buttons-background-color)] text-[var(--buttons-color)] "
              >
                {currentQuestion + 1 === questions.length ? "סיים" : "הבא"}
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ScorePage = ({ score, onHome }) => (
  <Card className="max-w-lg mx-auto mt-8 p-6 text-center border-[var(--border-color)] bg-[var(--page-background-color)]">
    <CardContent className="space-y-6">
      <div className="relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-[var(--header-background)] border-4 border-[var(--buttons-background-color)] flex items-center justify-center">
          <Trophy className="w-10 h-10 text-[var(--buttons-background-color)]" />
        </div>
      </div>

      <div className="pt-8 space-y-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-[var(--page-font-color)]">
            ציון סופי
          </h1>
          <div className="flex items-center justify-center gap-2">
            <Star className="w-5 h-5 text-[var(--buttons-background-color)]" />
            <p className="text-5xl font-bold text-[var(--buttons-background-color)]">
              {score}
            </p>
            <Star className="w-5 h-5 text-[var(--buttons-background-color)]" />
          </div>
        </div>

        <div className="w-full h-2 bg-[var(--header-background)] rounded-full my-6">
          <div
            className="h-full bg-[var(--buttons-background-color)] rounded-full transition-all duration-1000"
            style={{ width: `${score}%` }}
          />
        </div>
        <div className="flex justify-center">
          <HomeButton onClick={onHome} />
        </div>
      </div>
    </CardContent>
  </Card>
);

const App = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [quizType, setQuizType] = useState(null);
  const [finalScore, setFinalScore] = useState(null);

  const handleTopicSelect = (topicId) => {
    setQuizType(topicId);
    setCurrentPage("quiz");
  };

  const handleQuizComplete = (score) => {
    setFinalScore(score);
    setCurrentPage("score");
  };

  const handleRestart = () => {
    setCurrentPage("home");
    setQuizType(null);
    setFinalScore(null);
  };

  const getCurrentQuestions = () => {
    const selectedTopic = quizTopics.find((topic) => topic.id === quizType);
    return selectedTopic ? selectedTopic.questions : [];
  };

  return (
    <div className="flex flex-col items-center min-h-screen w-full max-w-[700px] mx-auto">
      <header className="w-full h-[50px] bg-[var(--header-background)] border border-[var(--border-color)] flex justify-between items-center">
        <img
          src="/assets/IconOnly_mashlomme.png"
          alt="Emek Logo"
          className="max-h-[42px] pr-[5px] pb-[5px] max-w-[100px] rounded-[50px]"
        />
        <span className="w-[65%] max-h-full text-[var(--header-text-color)] text-center font-semibold text-[13px] font-helvetica pr-[15px]">
          mashlom.me - כלי עזר לצוות רפואה
        </span>
        <div className="w-[100px]" />
      </header>

      <main className="w-full flex-grow bg-[var(--main-content-background-color)] border border-[var(--border-color)] overflow-y-auto text-center h-[calc(92dvh-45px)]">
        <div dir="rtl">
          {currentPage === "home" && (
            <HomePage onTopicSelect={handleTopicSelect} />
          )}
          {currentPage === "quiz" && (
            <QuizPage
              questions={getCurrentQuestions()}
              onComplete={handleQuizComplete}
              onHome={handleRestart}
            />
          )}
          {currentPage === "score" && (
            <ScorePage score={finalScore} onHome={handleRestart} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;

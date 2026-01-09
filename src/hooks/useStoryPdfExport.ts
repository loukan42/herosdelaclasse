import { useState } from 'react';
import { jsPDF } from 'jspdf';
import { Story, StoryPage, processText } from '@/data/stories';
import { useCombinedStories } from './useCombinedStories';
import { useLanguage, Language } from '@/contexts/LanguageContext';

type Genre = 'masculin' | 'feminin' | 'neutre';

interface TranslatedContent {
  title: string;
  text: string;
  choices: { label: string; targetPageId: string }[];
}

export function useStoryPdfExport() {
  const [isExporting, setIsExporting] = useState(false);
  const { getStory, getStoryPages } = useCombinedStories();
  const { language, translateText } = useLanguage();

  const loadImageAsDataUrl = (src: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  };

  const wrapTextWithFont = (pdf: jsPDF, text: string, maxWidth: number, fontSize: number): string[] => {
    pdf.setFontSize(fontSize);
    const lines: string[] = [];
    const paragraphs = text.split('\n');
    
    for (const paragraph of paragraphs) {
      if (paragraph.trim() === '') {
        lines.push('');
        continue;
      }
      
      const words = paragraph.split(' ');
      let currentLine = '';
      
      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const testWidth = pdf.getTextWidth(testLine);
        
        if (testWidth > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      
      if (currentLine) {
        lines.push(currentLine);
      }
    }
    
    return lines;
  };

  // Calculate optimal font size to fit all content on one page
  const calculateOptimalFontSize = (
    pdf: jsPDF,
    text: string,
    choices: { label: string; targetPageId: string }[],
    availableHeight: number,
    contentWidth: number,
    pageIdToNumber: Map<string, number>,
    isEnding: boolean,
    choicePrompt: string
  ): { fontSize: number; lineHeight: number } => {
    // Try font sizes from largest to smallest
    const fontSizes = [12, 11, 10, 9, 8, 7, 6];
    
    for (const fontSize of fontSizes) {
      const lineHeight = fontSize * 0.45; // Line height proportional to font size
      
      // Calculate text height
      const textLines = wrapTextWithFont(pdf, text, contentWidth, fontSize);
      let totalHeight = textLines.length * lineHeight;
      
      // Add space for empty lines (paragraph breaks)
      const emptyLines = textLines.filter(l => l === '').length;
      totalHeight += emptyLines * (lineHeight * 0.3);
      
      // Add space for choices
      if (!isEnding && choices.length > 0) {
        totalHeight += 8; // Space before "Que fais-tu?"
        totalHeight += 6; // "Que fais-tu?" line
        
        const choiceFontSize = Math.max(fontSize - 1, 6);
        for (const choice of choices) {
          const targetPageNum = pageIdToNumber.get(choice.targetPageId);
          const pageRef = targetPageNum ? ` (→ page ${targetPageNum})` : '';
          const choiceText = `→ ${choice.label}${pageRef}`;
          const choiceLines = wrapTextWithFont(pdf, choiceText, contentWidth - 10, choiceFontSize);
          totalHeight += choiceLines.length * (choiceFontSize * 0.5) + 2;
        }
      }
      
      // Add space for ending badge
      if (isEnding) {
        totalHeight += 15;
      }
      
      // Check if it fits
      if (totalHeight <= availableHeight) {
        return { fontSize, lineHeight };
      }
    }
    
    // If nothing fits, use smallest size
    return { fontSize: 6, lineHeight: 3 };
  };

  const getAllReachablePages = (pages: StoryPage[], startPageId: string): StoryPage[] => {
    const visited = new Set<string>();
    const orderedPages: StoryPage[] = [];
    const pageMap = new Map(pages.map(p => [p.id, p]));
    
    const traverse = (pageId: string) => {
      if (visited.has(pageId)) return;
      const page = pageMap.get(pageId);
      if (!page) return;
      
      visited.add(pageId);
      orderedPages.push(page);
      
      for (const choice of page.choices) {
        if (choice.targetPageId && choice.targetPageId !== 'menu') {
          traverse(choice.targetPageId);
        }
      }
    };
    
    traverse(startPageId);
    return orderedPages;
  };

  // Translate content if needed
  const translateContent = async (
    text: string,
    lang: Language
  ): Promise<string> => {
    if (lang === 'fr') return text;
    
    try {
      return await translateText(text, lang);
    } catch (e) {
      console.warn('Translation failed, using original:', e);
      return text;
    }
  };

  // Get localized UI strings for PDF
  const getPdfStrings = (lang: Language) => {
    const strings: Record<Language, { whatDoYouDo: string; happyEnd: string; altEnd: string; page: string; continued: string }> = {
      fr: { whatDoYouDo: 'Que fais-tu ?', happyEnd: 'FIN HEUREUSE', altEnd: 'FIN ALTERNATIVE', page: 'Page', continued: 'suite' },
      en: { whatDoYouDo: 'What do you do?', happyEnd: 'HAPPY ENDING', altEnd: 'ALTERNATIVE ENDING', page: 'Page', continued: 'continued' },
      de: { whatDoYouDo: 'Was machst du?', happyEnd: 'GLÜCKLICHES ENDE', altEnd: 'ALTERNATIVES ENDE', page: 'Seite', continued: 'Fortsetzung' },
      ru: { whatDoYouDo: 'Что ты делаешь?', happyEnd: 'СЧАСТЛИВЫЙ КОНЕЦ', altEnd: 'АЛЬТЕРНАТИВНЫЙ КОНЕЦ', page: 'Страница', continued: 'продолжение' },
      es: { whatDoYouDo: '¿Qué haces?', happyEnd: 'FINAL FELIZ', altEnd: 'FINAL ALTERNATIVO', page: 'Página', continued: 'continuación' },
      zh: { whatDoYouDo: '你做什么？', happyEnd: '美好结局', altEnd: '其他结局', page: '页', continued: '续' },
      'pt-br': { whatDoYouDo: 'O que você faz?', happyEnd: 'FINAL FELIZ', altEnd: 'FINAL ALTERNATIVO', page: 'Página', continued: 'continuação' },
    };
    return strings[lang] || strings.fr;
  };

  const exportStoryToPdf = async (
    storyId: string,
    prenom: string = 'Aventurier',
    genre: Genre = 'neutre'
  ): Promise<void> => {
    setIsExporting(true);
    
    try {
      const story = getStory(storyId);
      if (!story) throw new Error('Story not found');
      
      const allPages = getStoryPages(storyId);
      if (!allPages.length) throw new Error('No pages found');
      
      const pages = getAllReachablePages(allPages, story.startPageId);
      const pdfStrings = getPdfStrings(language);
      
      // Create page ID to number mapping
      const pageIdToNumber = new Map<string, number>();
      pages.forEach((page, index) => {
        pageIdToNumber.set(page.id, index + 1);
      });
      
      // Pre-translate all content
      const translatedTitle = await translateContent(story.title, language);
      const translatedDescription = await translateContent(story.description, language);
      
      const translatedPages: TranslatedContent[] = [];
      for (const page of pages) {
        const processedText = processText(
          page.text,
          prenom,
          genre,
          page.textMasculine,
          page.textFeminine
        );
        
        const translatedText = await translateContent(processedText, language);
        const translatedPageTitle = page.title ? await translateContent(page.title, language) : '';
        
        const translatedChoices = [];
        for (const choice of page.choices) {
          const processedLabel = processText(choice.label, prenom, genre);
          const translatedLabel = await translateContent(processedLabel, language);
          translatedChoices.push({
            label: translatedLabel,
            targetPageId: choice.targetPageId
          });
        }
        
        translatedPages.push({
          title: translatedPageTitle,
          text: translatedText,
          choices: translatedChoices
        });
      }
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 12;
      const contentWidth = pageWidth - (margin * 2);
      
      // ============ COVER PAGE ============
      try {
        const coverDataUrl = await loadImageAsDataUrl(story.coverImage);
        
        const coverMaxWidth = contentWidth;
        const coverMaxHeight = pageHeight - margin * 4 - 60;
        
        const img = new Image();
        img.src = coverDataUrl;
        await new Promise(resolve => { img.onload = resolve; });
        
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        let coverWidth = coverMaxWidth;
        let coverHeight = coverWidth / aspectRatio;
        
        if (coverHeight > coverMaxHeight) {
          coverHeight = coverMaxHeight;
          coverWidth = coverHeight * aspectRatio;
        }
        
        const coverX = (pageWidth - coverWidth) / 2;
        const coverY = margin + 15;
        
        pdf.addImage(coverDataUrl, 'JPEG', coverX, coverY, coverWidth, coverHeight);
        
        // Title
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(22);
        pdf.setTextColor(51, 51, 51);
        
        const titleY = coverY + coverHeight + 12;
        const titleLines = wrapTextWithFont(pdf, translatedTitle, contentWidth, 22);
        titleLines.forEach((line, i) => {
          const lineWidth = pdf.getTextWidth(line);
          pdf.text(line, (pageWidth - lineWidth) / 2, titleY + (i * 9));
        });
        
        // Description
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(11);
        pdf.setTextColor(100, 100, 100);
        
        const descY = titleY + (titleLines.length * 9) + 8;
        const descLines = wrapTextWithFont(pdf, translatedDescription, contentWidth - 20, 11);
        descLines.forEach((line, i) => {
          const lineWidth = pdf.getTextWidth(line);
          pdf.text(line, (pageWidth - lineWidth) / 2, descY + (i * 5));
        });
        
      } catch (e) {
        console.warn('Could not load cover image:', e);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(26);
        pdf.setTextColor(51, 51, 51);
        pdf.text(translatedTitle, pageWidth / 2, pageHeight / 2, { align: 'center' });
      }
      
      // ============ STORY PAGES ============
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const translated = translatedPages[i];
        pdf.addPage();
        
        let yPosition = margin;
        
        // Page number
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(150, 150, 150);
        pdf.text(`${pdfStrings.page} ${i + 1}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
        
        // Page title
        let titleHeight = 0;
        if (translated.title) {
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(13);
          pdf.setTextColor(51, 51, 51);
          
          const titleLines = wrapTextWithFont(pdf, translated.title, contentWidth, 13);
          titleLines.forEach((line, idx) => {
            const lineWidth = pdf.getTextWidth(line);
            pdf.text(line, (pageWidth - lineWidth) / 2, yPosition + (idx * 5));
          });
          titleHeight = (titleLines.length * 5) + 4;
          yPosition += titleHeight;
        }
        
        // Page image - compact
        let imageHeight = 0;
        try {
          const imageDataUrl = await loadImageAsDataUrl(page.image);
          
          const img = new Image();
          img.src = imageDataUrl;
          await new Promise(resolve => { img.onload = resolve; });
          
          const aspectRatio = img.naturalWidth / img.naturalHeight;
          const maxImgWidth = contentWidth * 0.65;
          const maxImgHeight = 45;
          
          let imgWidth = maxImgWidth;
          let imgHeight = imgWidth / aspectRatio;
          
          if (imgHeight > maxImgHeight) {
            imgHeight = maxImgHeight;
            imgWidth = imgHeight * aspectRatio;
          }
          
          const imgX = (pageWidth - imgWidth) / 2;
          
          pdf.setFillColor(255, 255, 255);
          pdf.roundedRect(imgX - 1, yPosition - 1, imgWidth + 2, imgHeight + 2, 2, 2, 'F');
          
          pdf.addImage(imageDataUrl, 'JPEG', imgX, yPosition, imgWidth, imgHeight);
          imageHeight = imgHeight + 5;
          yPosition += imageHeight;
          
        } catch (e) {
          console.warn(`Could not load image for page ${page.id}:`, e);
          yPosition += 3;
        }
        
        // Calculate available height for text and choices
        const bottomMargin = 15; // Space for page number
        const availableHeight = pageHeight - yPosition - bottomMargin;
        
        // Calculate optimal font size
        const { fontSize, lineHeight } = calculateOptimalFontSize(
          pdf,
          translated.text,
          translated.choices,
          availableHeight,
          contentWidth,
          pageIdToNumber,
          page.isEnding || false,
          pdfStrings.whatDoYouDo
        );
        
        // Render text with calculated font size
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(fontSize);
        pdf.setTextColor(51, 51, 51);
        
        const textLines = wrapTextWithFont(pdf, translated.text, contentWidth, fontSize);
        
        for (const line of textLines) {
          if (line === '') {
            yPosition += lineHeight * 0.5;
          } else {
            pdf.text(line, margin, yPosition);
            yPosition += lineHeight;
          }
        }
        
        // Choices
        if (!page.isEnding && translated.choices.length > 0) {
          yPosition += 5;
          
          pdf.setFont('helvetica', 'bold');
          const choiceTitleSize = Math.max(fontSize, 8);
          pdf.setFontSize(choiceTitleSize);
          pdf.setTextColor(80, 80, 80);
          pdf.text(pdfStrings.whatDoYouDo, margin, yPosition);
          yPosition += 5;
          
          pdf.setFont('helvetica', 'normal');
          const choiceFontSize = Math.max(fontSize - 1, 6);
          pdf.setFontSize(choiceFontSize);
          pdf.setTextColor(70, 100, 150);
          
          translated.choices.forEach((choice) => {
            const targetPageNum = pageIdToNumber.get(choice.targetPageId);
            const pageRef = targetPageNum ? ` (→ ${pdfStrings.page.toLowerCase()} ${targetPageNum})` : '';
            const choiceText = `→ ${choice.label}${pageRef}`;
            const choiceLines = wrapTextWithFont(pdf, choiceText, contentWidth - 8, choiceFontSize);
            
            choiceLines.forEach(line => {
              pdf.text(line, margin + 4, yPosition);
              yPosition += choiceFontSize * 0.5;
            });
            yPosition += 2;
          });
        }
        
        // Ending badge
        if (page.isEnding) {
          yPosition += 8;
          
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(12);
          
          if (page.endingType === 'happy') {
            pdf.setTextColor(34, 139, 34);
            pdf.text(`🏆 ${pdfStrings.happyEnd}`, pageWidth / 2, yPosition, { align: 'center' });
          } else {
            pdf.setTextColor(100, 100, 200);
            pdf.text(`✨ ${pdfStrings.altEnd}`, pageWidth / 2, yPosition, { align: 'center' });
          }
        }
      }
      
      // Save
      const safeTitle = translatedTitle.replace(/[^a-zA-Z0-9àâäéèêëïîôùûüçÀÂÄÉÈÊËÏÎÔÙÛÜÇäöüßÄÖÜñÑ\s-]/g, '').replace(/\s+/g, '-');
      const fileName = `${safeTitle}.pdf`;
      pdf.save(fileName);
      
    } finally {
      setIsExporting(false);
    }
  };

  return {
    exportStoryToPdf,
    isExporting
  };
}

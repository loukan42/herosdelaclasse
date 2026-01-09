import { useState } from 'react';
import { jsPDF } from 'jspdf';
import { Story, StoryPage, processText } from '@/data/stories';
import { useCombinedStories } from './useCombinedStories';

type Genre = 'masculin' | 'feminin' | 'neutre';

export function useStoryPdfExport() {
  const [isExporting, setIsExporting] = useState(false);
  const { getStory, getStoryPages } = useCombinedStories();

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

  const wrapText = (pdf: jsPDF, text: string, maxWidth: number): string[] => {
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
      
      // Follow choices in order
      for (const choice of page.choices) {
        if (choice.targetPageId && choice.targetPageId !== 'menu') {
          traverse(choice.targetPageId);
        }
      }
    };
    
    traverse(startPageId);
    return orderedPages;
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
      
      // Get pages in reading order
      const pages = getAllReachablePages(allPages, story.startPageId);
      
      // Create a mapping from page ID to PDF page number (1-indexed)
      const pageIdToNumber = new Map<string, number>();
      pages.forEach((page, index) => {
        pageIdToNumber.set(page.id, index + 1);
      });
      
      // Create PDF - A4 format
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 15;
      const contentWidth = pageWidth - (margin * 2);
      
      // ============ COVER PAGE ============
      // Load cover image
      try {
        const coverDataUrl = await loadImageAsDataUrl(story.coverImage);
        
        // Full page cover with margins
        const coverMaxWidth = contentWidth;
        const coverMaxHeight = pageHeight - margin * 4;
        
        // Calculate aspect ratio
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
        const coverY = margin + 20;
        
        pdf.addImage(coverDataUrl, 'JPEG', coverX, coverY, coverWidth, coverHeight);
        
        // Title below cover
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(24);
        pdf.setTextColor(51, 51, 51);
        
        const titleY = coverY + coverHeight + 15;
        const titleLines = wrapText(pdf, story.title, contentWidth);
        titleLines.forEach((line, i) => {
          const lineWidth = pdf.getTextWidth(line);
          pdf.text(line, (pageWidth - lineWidth) / 2, titleY + (i * 10));
        });
        
        // Description
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(12);
        pdf.setTextColor(100, 100, 100);
        
        const descY = titleY + (titleLines.length * 10) + 10;
        const descLines = wrapText(pdf, story.description, contentWidth - 20);
        descLines.forEach((line, i) => {
          const lineWidth = pdf.getTextWidth(line);
          pdf.text(line, (pageWidth - lineWidth) / 2, descY + (i * 6));
        });
        
      } catch (e) {
        console.warn('Could not load cover image:', e);
        // Simple text cover
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(28);
        pdf.setTextColor(51, 51, 51);
        pdf.text(story.title, pageWidth / 2, pageHeight / 2, { align: 'center' });
      }
      
      // ============ STORY PAGES ============
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        pdf.addPage();
        
        let yPosition = margin;
        
        // Page number
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.setTextColor(150, 150, 150);
        pdf.text(`Page ${i + 1}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
        
        // Page title
        if (page.title) {
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(18);
          pdf.setTextColor(51, 51, 51);
          
          const titleLines = wrapText(pdf, page.title, contentWidth);
          titleLines.forEach((line, idx) => {
            const lineWidth = pdf.getTextWidth(line);
            pdf.text(line, (pageWidth - lineWidth) / 2, yPosition + (idx * 8));
          });
          yPosition += (titleLines.length * 8) + 8;
        }
        
        // Page image - reduced size to fit everything on one page
        try {
          const imageDataUrl = await loadImageAsDataUrl(page.image);
          
          const img = new Image();
          img.src = imageDataUrl;
          await new Promise(resolve => { img.onload = resolve; });
          
          const aspectRatio = img.naturalWidth / img.naturalHeight;
          const maxImgWidth = contentWidth * 0.85; // Reduce width to 85%
          const maxImgHeight = 70; // Reduced max height for better fit
          
          let imgWidth = maxImgWidth;
          let imgHeight = imgWidth / aspectRatio;
          
          if (imgHeight > maxImgHeight) {
            imgHeight = maxImgHeight;
            imgWidth = imgHeight * aspectRatio;
          }
          
          const imgX = (pageWidth - imgWidth) / 2;
          
          // Add rounded corners effect with a white background
          pdf.setFillColor(255, 255, 255);
          pdf.roundedRect(imgX - 2, yPosition - 2, imgWidth + 4, imgHeight + 4, 3, 3, 'F');
          
          pdf.addImage(imageDataUrl, 'JPEG', imgX, yPosition, imgWidth, imgHeight);
          yPosition += imgHeight + 8;
          
        } catch (e) {
          console.warn(`Could not load image for page ${page.id}:`, e);
          yPosition += 10;
        }
        
        // Process text with name and gender
        const processedText = processText(
          page.text,
          prenom,
          genre,
          page.textMasculine,
          page.textFeminine
        );
        
        // Story text - slightly smaller font for better fit
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(11);
        pdf.setTextColor(51, 51, 51);
        
        const textLines = wrapText(pdf, processedText, contentWidth);
        const lineHeight = 5.5;
        
        for (const line of textLines) {
          // Check if we need a new page
          if (yPosition + lineHeight > pageHeight - margin - 30) {
            pdf.addPage();
            yPosition = margin;
            
            // Page number on new page
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(10);
            pdf.setTextColor(150, 150, 150);
            pdf.text(`Page ${i + 1} (suite)`, pageWidth - margin, pageHeight - 10, { align: 'right' });
            
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(13);
            pdf.setTextColor(51, 51, 51);
          }
          
          if (line === '') {
            yPosition += lineHeight / 2;
          } else {
            pdf.text(line, margin, yPosition);
            yPosition += lineHeight;
          }
        }
        
        // Choices (if not ending)
        if (!page.isEnding && page.choices.length > 0) {
          yPosition += 8;
          
          // Check if we have space for choices
          const estimatedChoicesHeight = page.choices.length * 12 + 10;
          if (yPosition + estimatedChoicesHeight > pageHeight - margin - 10) {
            pdf.addPage();
            yPosition = margin;
          }
          
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(11);
          pdf.setTextColor(80, 80, 80);
          pdf.text('Que fais-tu ?', margin, yPosition);
          yPosition += 8;
          
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(11);
          pdf.setTextColor(70, 100, 150);
          
          page.choices.forEach((choice) => {
            // Get the target page number
            const targetPageNum = pageIdToNumber.get(choice.targetPageId);
            const pageRef = targetPageNum ? ` (→ page ${targetPageNum})` : '';
            const choiceText = `→ ${processText(choice.label, prenom, genre)}${pageRef}`;
            const choiceLines = wrapText(pdf, choiceText, contentWidth - 10);
            
            choiceLines.forEach(line => {
              if (yPosition + 6 > pageHeight - margin - 10) {
                pdf.addPage();
                yPosition = margin;
              }
              pdf.text(line, margin + 5, yPosition);
              yPosition += 6;
            });
            yPosition += 3;
          });
        }
        
        // Ending badge
        if (page.isEnding) {
          yPosition += 10;
          
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(14);
          
          if (page.endingType === 'happy') {
            pdf.setTextColor(34, 139, 34);
            pdf.text('🏆 FIN HEUREUSE', pageWidth / 2, yPosition, { align: 'center' });
          } else {
            pdf.setTextColor(100, 100, 200);
            pdf.text('✨ FIN ALTERNATIVE', pageWidth / 2, yPosition, { align: 'center' });
          }
        }
      }
      
      // Save the PDF
      const fileName = `${story.title.replace(/[^a-zA-Z0-9àâäéèêëïîôùûüç\s-]/g, '').replace(/\s+/g, '-')}.pdf`;
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

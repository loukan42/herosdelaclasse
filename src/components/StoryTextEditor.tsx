import { useState, useEffect } from 'react';
import { Edit3, Save, X, RotateCcw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useStoryOverrides } from '@/hooks/useStoryOverrides';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

interface StoryTextEditorProps {
  storyId: string;
  pageId: string;
  originalText: string;
  originalTextMasculine?: string;
  originalTextFeminine?: string;
  currentText: string;
  onTextUpdate: (newText: string) => void;
}

export function StoryTextEditor({
  storyId,
  pageId,
  originalText,
  originalTextMasculine,
  originalTextFeminine,
  currentText,
  onTextUpdate
}: StoryTextEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(currentText);
  const [isSaving, setIsSaving] = useState(false);
  const { saveOverride, deleteOverride, getOverride } = useStoryOverrides();
  const { t } = useLanguage();

  const hasOverride = !!getOverride(storyId, pageId);

  useEffect(() => {
    setEditedText(currentText);
  }, [currentText]);

  const handleSave = async () => {
    setIsSaving(true);
    const result = await saveOverride(
      storyId,
      pageId,
      editedText,
      originalTextMasculine,
      originalTextFeminine
    );
    setIsSaving(false);

    if (result.success) {
      onTextUpdate(editedText);
      setIsEditing(false);
      toast.success(t('editor.textUpdated'));
    } else {
      toast.error(t('editor.saveError'));
    }
  };

  const handleRevert = async () => {
    setIsSaving(true);
    const result = await deleteOverride(storyId, pageId);
    setIsSaving(false);

    if (result.success) {
      onTextUpdate(originalText);
      setEditedText(originalText);
      setIsEditing(false);
      toast.success(t('editor.textRestored'));
    } else {
      toast.error(t('editor.restoreError'));
    }
  };

  const handleCancel = () => {
    setEditedText(currentText);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="mb-6 p-4 bg-amber-50 border-2 border-amber-300 rounded-xl">
        <div className="flex items-center gap-2 mb-3 text-amber-700">
          <Edit3 className="w-4 h-4" />
          <span className="font-semibold text-sm">{t('editor.adminMode')}</span>
        </div>
        <Textarea
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          className="min-h-[200px] mb-3 bg-white text-foreground"
          placeholder={t('editor.placeholder')}
        />
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            size="sm"
            className="gap-2"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {t('general.save')}
          </Button>
          <Button
            onClick={handleCancel}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <X className="w-4 h-4" />
            {t('general.cancel')}
          </Button>
          {hasOverride && (
            <Button
              onClick={handleRevert}
              variant="secondary"
              size="sm"
              className="gap-2"
              disabled={isSaving}
            >
              <RotateCcw className="w-4 h-4" />
              {t('editor.restoreOriginal')}
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-end mb-2">
      <Button
        onClick={() => setIsEditing(true)}
        variant="outline"
        size="sm"
        className="gap-2 bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100"
      >
        <Edit3 className="w-4 h-4" />
        {t('general.edit')}
        {hasOverride && <span className="text-xs">({t('editor.modified')})</span>}
      </Button>
    </div>
  );
}

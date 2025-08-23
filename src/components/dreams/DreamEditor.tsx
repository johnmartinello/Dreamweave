import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Calendar, Trash2, Edit3, AlertTriangle, Sparkles, X, Check, Link, Search } from 'lucide-react';
import { useDreamStore } from '../../store/dreamStore';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { TagPill } from './TagPill';
import { Card } from '../ui/Card';
import { formatDateForInput, getCurrentDateString } from '../../utils';
import { useDebounce } from '@uidotdev/usehooks';
import { cn } from '../../utils';



export function DreamEditor() {
  const {
    dreams,
    selectedDreamId,
    currentView,
    setCurrentView,
    updateDream,
    deleteDream,
    generateAITags,
    generateAITitle,
    aiConfig,
    getTagColor,
    addCitation,
    removeCitation,

    getDreamsThatCite,
  } = useDreamStore();

  const dream = dreams.find((d) => d.id === selectedDreamId);

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showCitedDreamModal, setShowCitedDreamModal] = useState(false);
  const [citedDreamPreview, setCitedDreamPreview] = useState<{
    id: string;
    title: string;
    date: string;
    description: string;
    tags: string[];
  } | null>(null);
  const [showDateMenu, setShowDateMenu] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);
  const [showAITagModal, setShowAITagModal] = useState(false);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const [suggestedTitle, setSuggestedTitle] = useState<string>('');
  const [showTitleSuggestion, setShowTitleSuggestion] = useState(false);
  const [editingTag, setEditingTag] = useState<string>('');
  const [editingIndex, setEditingIndex] = useState<number>(-1);
  
  // Citation state
  const [showCitationSearch, setShowCitationSearch] = useState(false);
  const [citationSearchQuery, setCitationSearchQuery] = useState('');
  const [citedDreams, setCitedDreams] = useState<string[]>([]);

  // Inline mention ("@") state
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editorWrapperRef = useRef<HTMLDivElement>(null);
  const [mentionOpen, setMentionOpen] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionStart, setMentionStart] = useState<number | null>(null);
  const [mentionSelectedIndex, setMentionSelectedIndex] = useState(0);
  const [mentionPosition, setMentionPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  // Modal refs (no longer using useClickOutside)
  const deleteModalRef = useRef<HTMLDivElement>(null);
  const dateModalRef = useRef<HTMLDivElement>(null);
  const aiTagModalRef = useRef<HTMLDivElement>(null);

  // Debounced values for auto-save
  const debouncedTitle = useDebounce(title, 500);
  const debouncedDescription = useDebounce(description, 1000);
  const debouncedDate = useDebounce(date, 500);

  // Initialize form when dream changes
  useEffect(() => {
    if (dream) {
      const formattedDate = dream.date ? formatDateForInput(dream.date) : getCurrentDateString();
      setTitle(dream.title);
      setDate(formattedDate);
      setDescription(dream.description);
      setTags(dream.tags);
      setCitedDreams(dream.citedDreams || []);
      // Reset initialization flag and set it after a small delay to ensure debounced values are ready
      setIsInitialized(false);
      setTimeout(() => setIsInitialized(true), 100);
    } else {
      setIsInitialized(false);
    }
  }, [dream]);

  // Auto-save effect - only runs after initialization and when values actually change
  useEffect(() => {
    if (dream && selectedDreamId && isInitialized) {
      // Detect citations created via inline "@Title" mentions and sync with citations
      const mentionsFromDescription: string[] = dreams
        .filter((d) => d.id !== selectedDreamId && description.includes(`@${d.title}`))
        .map((d) => d.id);
      
      // Remove citations that no longer exist in the description
      const updatedCitations = citedDreams.filter(citationId => {
        const citedDream = dreams.find(d => d.id === citationId);
        return citedDream && description.includes(`@${citedDream.title}`);
      });
      
      // Add new citations from mentions
      const finalCitations = Array.from(new Set([...updatedCitations, ...mentionsFromDescription]));
      
      if (JSON.stringify(finalCitations) !== JSON.stringify(citedDreams)) {
        setCitedDreams(finalCitations);
      }

      // Only save if the debounced values are different from the original dream values
      // and the debounced values are not empty (which happens during initialization)
      const hasChanges = 
        (debouncedTitle !== dream.title && debouncedTitle !== '') ||
        (debouncedDate !== dream.date && debouncedDate !== '') ||
        (debouncedDescription !== dream.description && debouncedDescription !== '') ||
        JSON.stringify(tags) !== JSON.stringify(dream.tags) ||
        JSON.stringify(finalCitations) !== JSON.stringify(dream.citedDreams || []);

      if (hasChanges) {
        setIsSaving(true);
        console.log('Auto-saving dream:', {
          id: selectedDreamId,
          title: debouncedTitle,
          date: debouncedDate,
          description: description, // Use current description instead of debounced
          tags,
          citedDreams: finalCitations
        });
        updateDream(selectedDreamId, {
          title: debouncedTitle,
          date: debouncedDate,
          description: description, // Use current description instead of debounced
          tags,
          citedDreams: finalCitations,
        });
        setTimeout(() => setIsSaving(false), 1000);
      }
    }
  }, [debouncedTitle, debouncedDate, debouncedDescription, tags, citedDreams, dream, selectedDreamId, updateDream, isInitialized, description]);

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleGenerateAITags = async () => {
    if (!description.trim()) {
      alert('Please add some dream content first');
      return;
    }

    setIsGeneratingTags(true);
    try {
      const generatedTags = await generateAITags(description);
      
      // Filter out tags that already exist
      const newTags = generatedTags.filter((tag: string) => !tags.includes(tag));
      
      if (newTags.length > 0) {
        setSuggestedTags(newTags);
        setShowAITagModal(true);
      } else {
        alert('No new tags were generated');
      }
    } catch (error) {
      console.error('Error generating categories:', error);
      alert(`Failed to generate categories: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGeneratingTags(false);
    }
  };

  const handleGenerateAITitle = async () => {
    if (!description.trim()) {
      alert('Please add some dream content first');
      return;
    }

    setIsGeneratingTitle(true);
    try {
      const generatedTitle = await generateAITitle(description);
      
      if (generatedTitle && generatedTitle.trim()) {
        setSuggestedTitle(generatedTitle.trim());
        setShowTitleSuggestion(true);
      } else {
        alert('No title was generated');
      }
    } catch (error) {
      console.error('Error generating title:', error);
      alert(`Failed to generate title: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGeneratingTitle(false);
    }
  };

  const handleAcceptTitleSuggestion = () => {
    setTitle(suggestedTitle);
    setShowTitleSuggestion(false);
    setSuggestedTitle('');
  };

  const handleRejectTitleSuggestion = () => {
    setShowTitleSuggestion(false);
    setSuggestedTitle('');
  };

  const handleConfirmAITags = () => {
    setTags([...tags, ...suggestedTags]);
    setShowAITagModal(false);
    setSuggestedTags([]);
  };

  const handleCancelAITags = () => {
    setShowAITagModal(false);
    setSuggestedTags([]);
  };

  const handleRemoveSuggestedTag = (index: number) => {
    setSuggestedTags(suggestedTags.filter((_, i) => i !== index));
  };

  const handleEditSuggestedTag = (index: number) => {
    setEditingIndex(index);
    setEditingTag(suggestedTags[index]);
  };

  const handleSaveEditedTag = () => {
    if (editingTag.trim() && editingIndex >= 0) {
      const newSuggestedTags = [...suggestedTags];
      newSuggestedTags[editingIndex] = editingTag.trim();
      setSuggestedTags(newSuggestedTags);
      setEditingIndex(-1);
      setEditingTag('');
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(-1);
    setEditingTag('');
  };

  const handleAddSuggestedTag = () => {
    if (editingTag.trim() && !suggestedTags.includes(editingTag.trim())) {
      setSuggestedTags([...suggestedTags, editingTag.trim()]);
      setEditingTag('');
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (dream) {
      deleteDream(dream.id);
      setShowDeleteModal(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleBack = () => {
    // Save current state before navigating away
    if (dream && selectedDreamId) {
      const hasChanges = 
        title !== dream.title ||
        date !== dream.date ||
        description !== dream.description ||
        JSON.stringify(tags) !== JSON.stringify(dream.tags) ||
        JSON.stringify(citedDreams) !== JSON.stringify(dream.citedDreams || []);

      if (hasChanges) {
        setIsSaving(true);
        console.log('Saving before navigation:', {
          id: selectedDreamId,
          title,
          date,
          description,
          tags,
          citedDreams
        });
        updateDream(selectedDreamId, {
          title,
          date,
          description,
          tags,
          citedDreams,
        });
        setTimeout(() => setIsSaving(false), 1000);
      }
    }
    setCurrentView('home');
  };

  // Citation handlers
  const handleAddCitation = (citedDreamId: string) => {
    if (selectedDreamId) {
      addCitation(selectedDreamId, citedDreamId);
      setCitedDreams([...citedDreams, citedDreamId]);
      setShowCitationSearch(false);
      setCitationSearchQuery('');
    }
  };

  const handleRemoveCitation = (citedDreamId: string) => {
    if (selectedDreamId) {
      removeCitation(selectedDreamId, citedDreamId);
      setCitedDreams(citedDreams.filter(id => id !== citedDreamId));
    }
  };

  const getFilteredDreamsForCitation = () => {
    return dreams.filter(d => 
      d.id !== selectedDreamId && // Don't show current dream
      !citedDreams.includes(d.id) && // Don't show already cited dreams
      (citationSearchQuery === '' || 
       d.title.toLowerCase().includes(citationSearchQuery.toLowerCase()) ||
       d.description.toLowerCase().includes(citationSearchQuery.toLowerCase()))
    );
  };

  // Inline mention helpers
  const getFilteredMentionDreams = () => {
    const query = mentionQuery.trim().toLowerCase();
    const list = dreams.filter((d) => d.id !== selectedDreamId);
    if (!query) return list.slice(0, 20);
    return list.filter((d) => d.title.toLowerCase().includes(query)).slice(0, 20);
  };

  const updateMentionDropdownPosition = () => {
    const ta = textareaRef.current;
    const wrapper = editorWrapperRef.current;
    if (!ta || !wrapper) return;
    const caretIndex = ta.selectionStart || 0;

    // Create mirror element to measure caret position
    const div = document.createElement('div');
    const style = window.getComputedStyle(ta);
    const properties = [
      'boxSizing','width','paddingTop','paddingRight','paddingBottom','paddingLeft','borderTopWidth','borderRightWidth','borderBottomWidth','borderLeftWidth',
      'fontStyle','fontVariant','fontWeight','fontStretch','fontSize','fontFamily','lineHeight','letterSpacing','textTransform','textIndent','textAlign'
    ];
    properties.forEach((prop) => {
      // @ts-ignore
      div.style[prop] = style.getPropertyValue(prop);
    });
    div.style.position = 'absolute';
    div.style.top = `${ta.offsetTop}px`;
    div.style.left = `${ta.offsetLeft}px`;
    div.style.whiteSpace = 'pre-wrap';
    div.style.visibility = 'hidden';
    div.style.wordWrap = 'break-word';
    div.style.overflow = 'hidden';
    div.style.width = `${ta.clientWidth}px`;
    div.style.height = `${ta.clientHeight}px`;

    const before = ta.value.substring(0, caretIndex);
    const span = document.createElement('span');
    span.textContent = '\u200b'; // zero-width marker at caret

    const pre = document.createElement('span');
    pre.textContent = before;
    div.appendChild(pre);
    div.appendChild(span);

    wrapper.appendChild(div);
    const wrapperRect = wrapper.getBoundingClientRect();
    const spanRect = span.getBoundingClientRect();

    const caretTop = spanRect.top - wrapperRect.top - ta.scrollTop;
    const caretLeft = spanRect.left - wrapperRect.left - ta.scrollLeft;

    const left = Math.max(0, Math.min(caretLeft, ta.clientWidth - 240));
    const top = Math.max(0, Math.min(caretTop, ta.clientHeight - 40)) + 24;

    setMentionPosition({ top, left });
    wrapper.removeChild(div);
  };

  const insertMention = (d: { id: string; title: string }) => {
    const ta = textareaRef.current;
    if (!ta || mentionStart === null) return;
    const caret = ta.selectionStart || 0;
    const before = description.substring(0, mentionStart);
    const between = description.substring(mentionStart, caret);
    const after = description.substring(caret);
    const hasAt = between.startsWith('@') ? '' : '@';
    const insertText = `${hasAt}${d.title}`;
    const newValue = `${before}@${insertText.replace(/^@/, '')}${after}`;
    setDescription(newValue);
    // Move caret to end of inserted text
    const nextPos = before.length + insertText.length + 1; // include '@'
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(nextPos, nextPos);
    });
    // Add citation id locally (dedup later in autosave)
    if (!citedDreams.includes(d.id)) {
      setCitedDreams([...citedDreams, d.id]);
    }
    setMentionOpen(false);
    setMentionQuery('');
    setMentionStart(null);
  };

  // Custom date picker helpers
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getMonthName = (month: number) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month];
  };

  const handleDateSelect = (day: number) => {
    setSelectedDay(day);
    const newDate = new Date(selectedYear, selectedMonth, day);
    setDate(formatDateForInput(newDate.toISOString().split('T')[0]));
    setShowDateMenu(false);
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  if (!dream) {
    // Avoid showing the fallback while navigating away to home to prevent flicker
    if (currentView !== 'dream') return null;
    return (
      <div className="h-full flex items-center justify-center">
        <Card variant="glass" className="text-center p-12">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-pink-500/20 flex items-center justify-center mx-auto mb-6 border border-red-400/30">
            <Edit3 className="w-8 h-8 text-red-300" />
          </div>
          <h2 className="text-2xl font-semibold text-gradient-pink mb-4">Dream not found</h2>
          <Button onClick={handleBack} variant="primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dreams
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="h-full overflow-auto">
        {/* Top Navigation Bar - unified transparent style */}
        <div className="sticky top-0 z-20">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={handleBack} className="flex items-center justify-center">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              
              <div className="flex items-center gap-3">
                
                <Button 
                  variant="secondary" 
                  onClick={handleDelete} 
                  className="text-red-300 hover:text-red-200 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Combined Dream Info Card */}
          <Card variant="glass" className="p-6 mb-8">
            <div className="space-y-4">
              {/* Title and Date Row */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Dream title..."
                      variant="transparent"
                      className="text-3xl font-bold px-0 py-2 rounded-xl border border-white/10 text-white/80 hover:glass hover:text-white/90 hover:font-medium hover:shadow-inner-lg hover:border-white/20 transition-all duration-300"
                    />
                    {/* AI Title Generation Button */}
                    {aiConfig.enabled && (
                      <Button
                        onClick={handleGenerateAITitle}
                        disabled={isGeneratingTitle || !description.trim()}
                        size="sm"
                        variant="ghost"
                        className="text-gray-300 hover:text-gray-200 hover:glass hover:bg-gray-500/10 px-3 py-1 rounded-xl transition-all duration-300 border border-gray-400/20"
                      >
                        {isGeneratingTitle ? 'Thinking...' : 'Suggestion'}
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300 ml-4">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <Button
                    variant="ghost"
                    onClick={() => setShowDateMenu(!showDateMenu)}
                    className="text-gray-300 hover:text-gray-200 px-2 py-1 relative"
                  >
                    {formatDateForInput(date)}
                  </Button>
                </div>
              </div>
              
              {/* Tags Row */}
              <div className="space-y-3">
                {/* Tag Input */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Add Category..."
                      variant="transparent"
                      className="w-24 border-b border-white/20 focus:border-gray-400 px-0 py-1 text-sm"
                    />
                    {newTag.trim() && (
                      <Button 
                        onClick={handleAddTag} 
                        size="sm" 
                        variant="ghost"
                        className="text-white/60 hover:glass hover:text-white/90 hover:font-medium hover:shadow-inner-lg hover:border-white/20 px-3 py-1 rounded-xl transition-all duration-300 border border-white/10"
                      >
                        Add
                      </Button>
                    )}
                  </div>
                  
                  {/* AI Tag Generation Button */}
                  {aiConfig.enabled && (
                    <Button
                      onClick={handleGenerateAITags}
                      disabled={isGeneratingTags || !description.trim()}
                      size="sm"
                      variant="ghost"
                      className="text-gray-300 hover:text-gray-200 hover:glass hover:bg-gray-500/10 px-3 py-1 rounded-xl transition-all duration-300 border border-gray-400/20"
                    >
                      {isGeneratingTags ? 'Thinking...' : 'Suggestions'}
                    </Button>
                  )}
                </div>
                
                {/* Tag Listing */}
                {tags.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {tags.map((tag) => (
                      <TagPill
                        key={tag}
                        tag={tag}
                        removable
                        onRemove={handleRemoveTag}
                        size="sm"
                        variant="gradient"
                        color={getTagColor(tag)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Enhanced Description Section */}
          <Card variant="glass" className="p-8 shadow-depth-3">
            <div ref={editorWrapperRef} className="relative">
              <Textarea
                ref={textareaRef}
                value={description}
                onChange={(e) => {
                  const value = e.target.value;
                  setDescription(value);
                  if (mentionOpen && mentionStart !== null) {
                    const caret = (e.target as HTMLTextAreaElement).selectionStart || 0;
                    // Close if caret moved to/before trigger or '@' was deleted
                    if (caret <= mentionStart || value[mentionStart] !== '@') {
                      setMentionOpen(false);
                      setMentionQuery('');
                      setMentionStart(null);
                      return;
                    }
                    const slice = value.slice(mentionStart, caret);
                    if (/\s/.test(slice) || slice.includes('\n')) {
                      setMentionOpen(false);
                      setMentionQuery('');
                      setMentionStart(null);
                    } else {
                      setMentionQuery(slice.replace(/^@/, ''));
                      requestAnimationFrame(() => updateMentionDropdownPosition());
                    }
                  }
                }}
                onKeyDown={(e) => {
                  // Open mention dropdown when typing '@'
                  if (e.key === '@') {
                    setMentionOpen(true);
                    const ta = textareaRef.current;
                    if (ta) {
                      setMentionStart(ta.selectionStart);
                      setMentionQuery('');
                      setMentionSelectedIndex(0);
                      requestAnimationFrame(() => updateMentionDropdownPosition());
                    }
                    return; // allow input of '@'
                  }

                  if (mentionOpen) {
                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      setMentionSelectedIndex((idx) => Math.min(idx + 1, getFilteredMentionDreams().length - 1));
                      return;
                    }
                    if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      setMentionSelectedIndex((idx) => Math.max(idx - 1, 0));
                      return;
                    }
                    if (e.key === 'Enter') {
                      const list = getFilteredMentionDreams();
                      if (list.length > 0) {
                        e.preventDefault();
                        insertMention(list[Math.max(0, Math.min(mentionSelectedIndex, list.length - 1))]);
                      }
                      return;
                    }
                    if (e.key === 'Escape') {
                      e.preventDefault();
                      setMentionOpen(false);
                      return;
                    }
                  }
                }}
                onClick={() => {
                  if (mentionOpen) updateMentionDropdownPosition();
                }}
                onKeyUp={() => {
                  if (mentionOpen) updateMentionDropdownPosition();
                }}
                onScroll={() => {
                  if (mentionOpen) updateMentionDropdownPosition();
                }}
                placeholder="Describe your dream in detail... Let your thoughts flow naturally..."
                variant="transparent"
                className="min-h-[500px] text-base leading-relaxed w-full"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              />

              {mentionOpen && (
                <div
                  className="absolute z-20 w-60 max-h-56 overflow-y-auto bg-black/60 backdrop-blur rounded-lg border border-white/10 shadow-lg"
                  style={{ top: mentionPosition.top, left: mentionPosition.left }}
                >
                  {getFilteredMentionDreams().length === 0 ? (
                    <div className="px-3 py-2 text-sm text-gray-400">No matches</div>
                  ) : (
                    getFilteredMentionDreams().map((d, idx) => (
                      <div
                        key={d.id}
                        className={cn(
                          'px-3 py-2 cursor-pointer text-sm flex items-center justify-between',
                          idx === mentionSelectedIndex ? 'bg-white/10 text-white' : 'text-gray-200 hover:bg-white/5'
                        )}
                        onMouseDown={(e) => {
                          // prevent textarea blur before we insert
                          e.preventDefault();
                          insertMention(d);
                        }}
                      >
                        <span className="truncate flex-1">{d.title}</span>
                        <span className="ml-3 text-xs text-gray-400 w-20 text-right">{d.date}</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* Citation Section */}
          <Card variant="glass" className="p-6 shadow-depth-3 mt-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Link className="w-5 h-5 text-grey-300" />
                  <h3 className="text-lg font-semibold text-white">Dream Citations</h3>
                </div>
                                 <Button
                   onClick={() => setShowCitationSearch(!showCitationSearch)}
                   variant="ghost"
                   size="sm"
                   className="text-grey-300 hover:text-purple-200 hover:glass hover:bg-purple-500/10 p-2 rounded-xl transition-all duration-300 border border-purple-400/20 flex items-center justify-center"
                 >
                   <Search className="w-4 h-4" />
                 </Button>
              </div>

              {/* Citation Search */}
              {showCitationSearch && (
                <div className="space-y-3 p-4 bg-white/5 rounded-lg border border-white/10">
                  <Input
                    value={citationSearchQuery}
                    onChange={(e) => setCitationSearchQuery(e.target.value)}
                    placeholder="Search dreams to cite..."
                    variant="transparent"
                    className="bg-white/5 border-white/20 text-white placeholder-gray-400"
                  />
                  
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {getFilteredDreamsForCitation().length === 0 ? (
                      <div className="text-center py-4 text-gray-400">
                        {citationSearchQuery ? 'No dreams found' : 'No dreams available to cite'}
                      </div>
                    ) : (
                      getFilteredDreamsForCitation().map((citedDream) => (
                        <div
                          key={citedDream.id}
                          className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="font-medium text-white">{citedDream.title}</div>
                            <div className="text-sm text-gray-400">{citedDream.date}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {citedDream.description.substring(0, 100)}...
                            </div>
                          </div>
                          <Button
                            onClick={() => handleAddCitation(citedDream.id)}
                            variant="ghost"
                            size="sm"
                            className="text-purple-300 hover:text-purple-200 hover:glass hover:bg-purple-500/10"
                          >
                            <Link className="w-4 h-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Current Citations */}
              {citedDreams.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-300">Cited Dreams:</h4>
                  {citedDreams.map((citedDreamId) => {
                    const citedDream = dreams.find(d => d.id === citedDreamId);
                    if (!citedDream) return null;
                    
                    return (
                      <div
                        key={citedDreamId}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-white">{citedDream.title}</div>
                          <div className="text-sm text-gray-400">{citedDream.date}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {citedDream.description.substring(0, 80)}...
                          </div>
                        </div>
                        <Button
                          onClick={() => handleRemoveCitation(citedDreamId)}
                          variant="ghost"
                          size="sm"
                          className="text-red-300 hover:text-red-200 hover:glass hover:bg-red-500/10"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Dreams that cite this dream */}
              {dream && getDreamsThatCite(dream.id).length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-300">Dreams that cite this dream:</h4>
                  {getDreamsThatCite(dream.id).map((citingDream) => (
                    <div
                      key={citingDream.id}
                      className="p-3 bg-white/5 rounded-lg border border-white/10 cursor-pointer hover:bg-white/10 transition-colors"
                      onClick={() => {
                        setCitedDreamPreview({
                          id: citingDream.id,
                          title: citingDream.title,
                          date: citingDream.date,
                          description: citingDream.description,
                          tags: citingDream.tags,
                        });
                        setShowCitedDreamModal(true);
                      }}
                    >
                      <div className="font-medium text-white">{citingDream.title}</div>
                      <div className="text-sm text-gray-400">{citingDream.date}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {citingDream.description.substring(0, 80)}...
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
          {/* Cited Dream Preview Modal */}
          <Modal
            isOpen={showCitedDreamModal}
            onClose={() => setShowCitedDreamModal(false)}
            title={citedDreamPreview?.title || 'Dream Preview'}
            className="max-w-4xl max-h-[80vh]"
          >
            {citedDreamPreview && (
              <div className="space-y-4">
                <div className="text-sm text-gray-300">{citedDreamPreview.date}</div>
                {citedDreamPreview.tags.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {citedDreamPreview.tags.map((tag) => (
                      <TagPill
                        key={tag}
                        tag={tag}
                        size="sm"
                        variant="gradient"
                        color={getTagColor(tag)}
                      />
                    ))}
                  </div>
                )}
                <div className="text-gray-200 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto pr-2 break-words overflow-x-hidden" style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
                  {citedDreamPreview.description}
                </div>
                
              </div>
            )}
          </Modal>

          {/* Enhanced Auto-save indicator */}
          <div className="mt-6 text-center">
            <div className={cn(
              "inline-flex items-center px-4 py-2 rounded-lg text-sm transition-all duration-300",
              isSaving 
                ? "text-gray-300 bg-gradient-to-r from-gray-500/10 to-gray-600/10 border border-gray-400/30" 
                : "text-gray-400 bg-white/5 border border-white/10"
            )}>
              {isSaving ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-green-600 mr-2 animate-pulse"></div>
                  Saving changes...
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-green-600 mr-2"></div>
                  All changes are automatically saved
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" onClick={() => setShowDeleteModal(false)}>
          <Card ref={deleteModalRef} variant="glass-dark" className="p-6 w-96 max-w-sm" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-pink-500/20 flex items-center justify-center mx-auto mb-4 border border-red-400/30">
                <AlertTriangle className="w-8 h-8 text-red-300" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Delete Dream</h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete "{dream?.title}"? This action will move it to the trash.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  onClick={cancelDelete}
                  className="flex-1 text-gray-300 hover:text-white hover:glass"
                >
                  Cancel
                </Button>
                <Button
                  variant="ghost"
                  onClick={confirmDelete}
                  className="flex-1 text-red-300 hover:text-red-200 hover:bg-red-500/10"
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Date Modal - Rendered outside main content to ensure it appears above everything */}
      {showDateMenu && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" onClick={() => setShowDateMenu(false)}>
          <Card ref={dateModalRef} variant="glass" className="p-4 w-80" onClick={(e) => e.stopPropagation()}>
            {/* Month/Year Navigation */}
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (selectedMonth === 0) {
                    setSelectedMonth(11);
                    setSelectedYear(selectedYear - 1);
                  } else {
                    setSelectedMonth(selectedMonth - 1);
                  }
                }}
                className="text-gray-400 hover:text-white"
              >
                ←
              </Button>
              <div className="text-center">
                <div className="font-semibold text-white">{getMonthName(selectedMonth)}</div>
                <div className="text-sm text-gray-300">{selectedYear}</div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (selectedMonth === 11) {
                    setSelectedMonth(0);
                    setSelectedYear(selectedYear + 1);
                  } else {
                    setSelectedMonth(selectedMonth + 1);
                  }
                }}
                className="text-gray-400 hover:text-white"
              >
                →
              </Button>
            </div>
            
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-3">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-xs text-gray-400 py-1">
                  {day}
                </div>
              ))}
              {generateCalendarDays().map((day, index) => (
                <div key={index} className="text-center">
                  {day ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDateSelect(day)}
                      className={cn(
                        "w-8 h-8 text-sm p-0",
                        day === selectedDay 
                          ? "bg-gray-600 text-white" 
                          : "text-gray-300 hover:text-white hover:bg-white/10"
                      )}
                    >
                      {day}
                    </Button>
                  ) : (
                    <div className="w-8 h-8"></div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  const today = new Date();
                  setSelectedYear(today.getFullYear());
                  setSelectedMonth(today.getMonth());
                  setSelectedDay(today.getDate());
                  setDate(formatDateForInput(today.toISOString().split('T')[0]));
                  setShowDateMenu(false);
                }}
                className="flex-1 text-xs"
              >
                Today
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDateMenu(false)}
                className="flex-1 text-xs"
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* AI Tag Suggestion Modal */}
      {showAITagModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" onClick={() => setShowAITagModal(false)}>
          <Card ref={aiTagModalRef} variant="glass" className="p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-white/70" />
                <h3 className="text-xl font-semibold text-white">Categories Suggestions</h3>
              </div>
              <Button variant="ghost" onClick={handleCancelAITags} className="text-gray-300 hover:text-white">
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            {/* Add new tag input */}
            <div className="mb-4">
              <div className="flex gap-2">
                <Input
                  value={editingTag}
                  onChange={(e) => setEditingTag(e.target.value)}
                  placeholder="Add a new tag..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSuggestedTag();
                    }
                  }}
                  className="flex-1 bg-white/5 border-white/20 text-white placeholder-gray-400"
                />
                <Button 
                  onClick={handleAddSuggestedTag}
                  disabled={!editingTag.trim()}
                  size="sm"
                  variant="ghost"
                  className="text-white/60 hover:glass hover:text-white/90 px-3"
                >
                  Add
                </Button>
              </div>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {suggestedTags.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No tags suggested yet</p>
                  <p className="text-sm">Add tags manually above</p>
                </div>
              ) : (
                suggestedTags.map((tag, index) => (
                  <div key={index} className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/10">
                    {editingIndex === index ? (
                      <div className="flex-1">
                        <Input
                          value={editingTag}
                          onChange={(e) => setEditingTag(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleSaveEditedTag();
                            }
                          }}
                          onBlur={handleSaveEditedTag}
                          className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-white/40 focus:ring-white/20"
                        />
                      </div>
                    ) : (
                      <TagPill 
                        tag={tag} 
                        size="sm" 
                        variant="gradient"
                        color={getTagColor(tag)}
                      />
                    )}
                    <div className="flex items-center gap-1">
                      {editingIndex === index ? (
                        <>
                          <Button variant="ghost" onClick={handleSaveEditedTag} className="text-green-300 hover:text-green-200 p-1">
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" onClick={handleCancelEdit} className="text-gray-300 hover:text-white p-1">
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button variant="ghost" onClick={() => handleEditSuggestedTag(index)} className="text-gray-300 hover:text-white p-1">
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" onClick={() => handleRemoveSuggestedTag(index)} className="text-red-300 hover:text-red-200 p-1">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-white/10">
              <Button variant="ghost" onClick={handleCancelAITags} className="text-gray-300 hover:text-white">
                Cancel
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleConfirmAITags} 
                disabled={suggestedTags.length === 0}
                className="text-white/60 hover:glass hover:text-white/90 hover:shadow-inner-lg hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add {suggestedTags.length} Tag{suggestedTags.length !== 1 ? 's' : ''}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Title Suggestion Modal */}
      {showTitleSuggestion && (
        <Modal
          isOpen={showTitleSuggestion}
          onClose={handleRejectTitleSuggestion}
          title="AI Title Suggestion"
          className="max-w-md"
        >
          <div className="space-y-4">
            <div className="text-center">
              <Sparkles className="w-8 h-8 mx-auto mb-3 text-blue-400" />
              <p className="text-gray-300 mb-2">AI suggests this title for your dream:</p>
              <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                <h3 className="text-xl font-semibold text-white">{suggestedTitle}</h3>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <Button variant="ghost" onClick={handleRejectTitleSuggestion} className="text-gray-300 hover:text-white">
                Reject
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleAcceptTitleSuggestion}
                className="text-white/60 hover:glass hover:text-white/90 hover:shadow-inner-lg hover:border-white/20"
              >
                Use This Title
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

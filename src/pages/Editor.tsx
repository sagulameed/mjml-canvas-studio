
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { EditorToolbar } from "@/components/EditorToolbar";
import { CodeEditor } from "@/components/CodeEditor";
import { MjmlPreview } from "@/components/MjmlPreview";
import { 
  getTemplate, 
  saveTemplate, 
  createNewTemplate, 
  Template 
} from "@/lib/templates";
import { useToast } from "@/hooks/use-toast";

const Editor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [template, setTemplate] = useState<Template>(createNewTemplate());
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    if (id && id !== 'new') {
      const existingTemplate = getTemplate(id);
      if (existingTemplate) {
        setTemplate(existingTemplate);
      } else {
        toast({
          title: "Template not found",
          description: "The template you're looking for doesn't exist.",
          variant: "destructive",
        });
        navigate('/');
      }
    }
  }, [id, navigate, toast]);
  
  const handleContentChange = (newContent: string) => {
    setTemplate(prev => ({ ...prev, content: newContent }));
  };
  
  const handleTitleChange = (newTitle: string) => {
    setTemplate(prev => ({ ...prev, title: newTitle }));
  };
  
  const handleSave = () => {
    setIsSaving(true);
    
    // Simulate a network delay
    setTimeout(() => {
      try {
        const savedTemplate = saveTemplate(template);
        setTemplate(savedTemplate);
        
        toast({
          title: "Template saved",
          description: "Your changes have been saved successfully.",
        });
        
        // Redirect to the proper URL if this was a new template
        if (!id || id === 'new') {
          navigate(`/editor/${savedTemplate.id}`, { replace: true });
        }
      } catch (error) {
        toast({
          title: "Error saving template",
          description: "There was a problem saving your template.",
          variant: "destructive",
        });
      } finally {
        setIsSaving(false);
      }
    }, 800);
  };
  
  const togglePreview = () => {
    setIsPreviewMode(!isPreviewMode);
  };
  
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col h-screen">
        <EditorToolbar
          title={template.title}
          onTitleChange={handleTitleChange}
          onSave={handleSave}
          onTogglePreview={togglePreview}
          isPreviewMode={isPreviewMode}
          isSaving={isSaving}
        />
        
        <div className="flex-1 flex overflow-hidden">
          {!isPreviewMode && (
            <div className="w-1/2 h-full border-r">
              <CodeEditor value={template.content} onChange={handleContentChange} />
            </div>
          )}
          
          <div className={isPreviewMode ? "w-full h-full" : "w-1/2 h-full"}>
            <MjmlPreview mjmlCode={template.content} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;

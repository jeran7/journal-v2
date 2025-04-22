"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, SplitSquareVertical } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/navigation/header"
import { Sidebar } from "@/components/navigation/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Editor } from "@/components/journal/editor"
import { TemplateSelector, type Template } from "@/components/journal/template-selector"
import { PsychologicalTracker, type EmotionState } from "@/components/journal/psychological-tracker"
import { AIPrompts } from "@/components/journal/ai-prompts"
import { MediaToolbar, type MediaItem } from "@/components/journal/media-toolbar"

export default function NewJournalEntryPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [isPageLoaded, setIsPageLoaded] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("write")
  const [splitView, setSplitView] = useState(false)

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [emotionalState, setEmotionalState] = useState<EmotionState>({
    type: "focused",
    intensity: 3,
    notes: "",
  })
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [tags, setTags] = useState<string[]>([])

  useEffect(() => {
    setIsClient(true)

    // Simulate page load animation
    const timeout = setTimeout(() => {
      setIsPageLoaded(true)
    }, 100)

    return () => clearTimeout(timeout)
  }, [])

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template)

    // Generate content from template sections
    let templateContent = ""
    template.sections.forEach((section) => {
      if (section.type === "text") {
        templateContent += `<h3>${section.title}</h3><p>${section.placeholder || ""}</p>`
      } else if (section.type === "checklist" && section.options) {
        templateContent += `<h3>${section.title}</h3><ul>`
        section.options.forEach((option) => {
          templateContent += `<li>[ ] ${option}</li>`
        })
        templateContent += `</ul>`
      }
    })

    setContent(templateContent)
  }

  const handleAddMedia = (media: MediaItem) => {
    setMediaItems((prev) => [...prev, media])
  }

  const handleRemoveMedia = (id: string) => {
    setMediaItems((prev) => prev.filter((item) => item.id !== id))
  }

  const handleSelectPrompt = (prompt: string) => {
    // Add the prompt to the content
    const promptHtml = `<blockquote>${prompt}</blockquote><p></p>`
    setContent((prev) => prev + promptHtml)
  }

  const handleSave = async () => {
    setIsSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // In a real app, this would save to a database
    console.log({
      title,
      content,
      template: selectedTemplate?.id,
      emotionalState,
      mediaItems,
      tags,
    })

    setIsSaving(false)

    // Navigate to journal list
    router.push("/journal")
  }

  if (!isClient) {
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar className="hidden md:flex" />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="grid gap-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" asChild>
                  <Link href="/journal">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Back to journal</span>
                  </Link>
                </Button>
                <h1
                  className={`text-2xl font-bold tracking-tight font-sf-pro transition-all duration-500 ${
                    isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                  }`}
                >
                  New Journal Entry
                </h1>
              </div>
              <div
                className={`flex gap-2 transition-all duration-500 ${
                  isPageLoaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                }`}
                style={{ transitionDelay: "100ms" }}
              >
                <Button variant="outline" size="sm" onClick={() => setSplitView(!splitView)}>
                  <SplitSquareVertical className="mr-2 h-4 w-4" />
                  {splitView ? "Single View" : "Split View"}
                </Button>
                <Button size="sm" onClick={handleSave} disabled={isSaving || !title.trim()}>
                  {isSaving ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Entry
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div
              className={`grid gap-6 ${splitView ? "md:grid-cols-2" : "md:grid-cols-1"} transition-all duration-500 ${
                isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              <div className="space-y-6">
                <GlassCard className="p-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Entry Title</Label>
                      <Input
                        id="title"
                        placeholder="Enter a title for your journal entry"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Template</Label>
                      <TemplateSelector
                        onSelectTemplate={handleSelectTemplate}
                        selectedTemplateId={selectedTemplate?.id}
                      />
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="p-4">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="write">Write</TabsTrigger>
                      <TabsTrigger value="media">Media</TabsTrigger>
                      <TabsTrigger value="emotion">Emotional State</TabsTrigger>
                    </TabsList>

                    <TabsContent value="write" className="mt-4 space-y-4">
                      <Editor
                        initialContent={content}
                        onChange={setContent}
                        placeholder="Start writing your journal entry..."
                        autoFocus
                      />
                    </TabsContent>

                    <TabsContent value="media" className="mt-4">
                      <MediaToolbar
                        onAddMedia={handleAddMedia}
                        onRemoveMedia={handleRemoveMedia}
                        mediaItems={mediaItems}
                      />
                    </TabsContent>

                    <TabsContent value="emotion" className="mt-4">
                      <PsychologicalTracker initialState={emotionalState} onChange={setEmotionalState} />
                    </TabsContent>
                  </Tabs>
                </GlassCard>
              </div>

              {splitView && (
                <div className="space-y-6">
                  <GlassCard className="p-4">
                    <h2 className="mb-4 text-lg font-semibold">AI-Powered Assistance</h2>
                    <AIPrompts onSelectPrompt={handleSelectPrompt} tradeType="win" />
                  </GlassCard>

                  <GlassCard className="p-4">
                    <h2 className="mb-4 text-lg font-semibold">Preview</h2>
                    <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
                  </GlassCard>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

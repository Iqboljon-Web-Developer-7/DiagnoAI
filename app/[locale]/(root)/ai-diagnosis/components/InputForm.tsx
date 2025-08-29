"use client";

import React from "react";
import { X, FileText, ImageIcon, Loader2, Send, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

interface InputFormProps {
  symptoms: string;
  setSymptoms: (value: string) => void;
  files: File[];
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeFile: (idx: number) => void;
  handleSendMessage: (e: React.FormEvent) => void;
  analyzing: boolean;
  progress: number;
}

const InputForm: React.FC<InputFormProps> = ({
  symptoms,
  setSymptoms,
  files,
  handleFileUpload,
  removeFile,
  handleSendMessage,
  analyzing,
  progress,
}) => {
  return (
    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
      <CardContent className="p-6">
        <form onSubmit={handleSendMessage} className="space-y-4">
          <div className="relative">
            <Textarea
              placeholder="Describe your symptoms in detail..."
              value={symptoms}
              rows={4}
              onChange={(e) => setSymptoms(e.target.value)}
              className="pr-12 border-2 border-gray-200 focus:border-blue-400 rounded-xl "
              aria-label="Symptom description"
            />
            <div className="rounded-xl text-center transition-colors absolute bottom-3 right-3">
              <input
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.pdf"
                id="file-upload"
                className="hidden"
                onChange={handleFileUpload}
              />
              <label htmlFor="file-upload" className="cursor-pointer" aria-label="Upload file">
                <Paperclip className="h-4 w-4" />
              </label>
            </div>
          </div>

          {files && files.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Uploaded Files</h4>
              {files.map((file, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {file.type.startsWith("image/") ? (
                        <ImageIcon className="h-4 w-4 text-blue-600" />
                      ) : (
                        <FileText className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(i)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    aria-label={`Remove ${file.name}`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <Button
            type="submit"
            disabled={analyzing || (!symptoms.trim() && !(files && files.length))}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg h-12"
            aria-label="Submit diagnosis"
          >
            {analyzing ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Analyzing...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Get AI Diagnosis
              </>
            )}
          </Button>

          {analyzing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Analysis Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" aria-label="Analysis progress" />
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default InputForm;
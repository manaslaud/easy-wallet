import React from "react";
import { cn } from "@/lib/utils";

interface CodeSnippetProps {
  language: string;
  children: React.ReactNode;
  className?: string;
}

export default function CodeSnippet({
  language,
  children,
  className,
}: CodeSnippetProps) {
  return (
    <div className={cn("rounded-lg overflow-hidden", className)}>
      <div className="font-mono text-sm overflow-auto p-4 bg-muted/70 dark:bg-muted/30 rounded-md">
        <pre>
          <code>{children}</code>
        </pre>
      </div>
    </div>
  );
}
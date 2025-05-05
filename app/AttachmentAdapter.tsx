import { AttachmentAdapter } from "@assistant-ui/react";
import {
  
  PendingAttachment,
  CompleteAttachment,
  ThreadUserContentPart,
} from "@assistant-ui/react";

export class CustomAttachmentAdapter implements AttachmentAdapter {
  accept = "image/*, .pdf, audio/*";
  maxSizeMB = 1;

  private createPendingAttachment(file: File): PendingAttachment {
    const isImage = file.type.startsWith("image/");
    const isPDF = file.type === "application/pdf";
    const isAudio = file.type.startsWith("audio/");

    return {
      id: file.name + "-" + Date.now(),
      type: isImage ? "image" : isPDF ? "document" : isAudio ? "file" : "file",
      name: file.name,
      contentType: file.type,
      file,
      status: {
        type: "running",
        reason: "uploading",
        progress: 0,
      },
    };
  }

  private async readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private async completeAttachment(pending: PendingAttachment): Promise<CompleteAttachment> {
    const isImage = pending.contentType.startsWith("image/");
    const isAudio = pending.contentType.startsWith("audio/");
    const base64Data = await this.readFileAsDataURL(pending.file);

    let contentPart: ThreadUserContentPart;

    if (isImage) {
      contentPart = {
        type: "image",
        image: base64Data,
      };
    } else if (isAudio) {
      const format = pending.contentType.includes("wav") ? "wav" : "mp3";
      contentPart = {
        type: "audio",
        audio: {
          data: base64Data,
          format,
        },
      };
    } else {
      contentPart = {
        type: "file",
        data: base64Data,
        mimeType: pending.contentType,
      };
    }

    return {
      ...pending,
      file: undefined,
      content: [contentPart],
      status: {
        type: "complete",
      },
    };
  }

  async add({ file }: { file: File }): Promise<PendingAttachment> {
    console.log(file,"fduhfiu")
    const maxSizeBytes = this.maxSizeMB * 1024 * 1024;


    if (file.size > maxSizeBytes) {
      throw new Error(`File too large. Max allowed size is ${this.maxSizeMB}MB.`);
    }

    return this.createPendingAttachment(file);
  }

  async send(attachment: PendingAttachment): Promise<CompleteAttachment> {
    await new Promise((res) => setTimeout(res, 500)); // Simulate delay
    return this.completeAttachment(attachment);
  }

  async remove(): Promise<void> {
    return;
  }
}

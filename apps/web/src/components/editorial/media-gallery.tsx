"use client";

import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { Maximize2, X } from "lucide-react";
import { mediaItems } from "@/lib/editorial";

/** Only approved design assets, visibly identified as concepts rather than actual news photography. */
export function MediaGallery() {
  return (
    <div className="editorial-gallery">
      <div className="editorial-gallery-heading">
        <p className="eyebrow">Visual language / design studies</p>
        <h2>Inside the <em>visual archive.</em></h2>
        <p className="body-copy">Original illustrative artwork prepared for the MOUNDWEB design system. These are not photos of actual events, clients, teams, or published projects.</p>
      </div>
      <div className="editorial-gallery-grid">
        {mediaItems.map((item, index) => (
          <Dialog.Root key={item.slug}>
            <Dialog.Trigger asChild>
              <button className={"editorial-gallery-tile editorial-gallery-tile--" + index} type="button"
                aria-label={"View concept artwork: " + item.title}>
                <Image src={item.artwork} alt="" fill sizes="(max-width: 700px) 100vw, 50vw" />
                <span className="editorial-gallery-overlay">
                  <span><strong>{item.title}</strong><small>Illustrative concept · Not published coverage</small></span>
                  <Maximize2 size={21} aria-hidden="true" />
                </span>
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="dialog-overlay" />
              <Dialog.Content className="dialog-content editorial-lightbox">
                <Dialog.Title>{item.title} — Concept artwork</Dialog.Title>
                <Dialog.Description>{item.caption}</Dialog.Description>
                <div className="editorial-lightbox-image">
                  <Image src={item.artwork} width={1200} height={900} alt={item.caption}
                    sizes="(max-width: 720px) 92vw, 760px" />
                </div>
                <Dialog.Close className="icon-button dialog-close" aria-label="Close artwork"><X size={20}/></Dialog.Close>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        ))}
      </div>
    </div>
  );
}

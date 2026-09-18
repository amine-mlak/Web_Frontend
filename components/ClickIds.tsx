"use client";

import { useEffect } from "react";
import { captureClickIds } from "@/lib/conversion";

export default function ClickIds() {
  useEffect(() => {
    captureClickIds();
  }, []);

  return null;
}

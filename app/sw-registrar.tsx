"use client";
import { useEffect } from "react";
import { registerSW } from "@/lib/sw-register";

export default function SWRegistrar() {
  useEffect(() => {
    registerSW();
  }, []);
  return null;
}

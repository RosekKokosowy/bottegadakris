'use client';

import axios from "axios";
import { useMemo } from "react";

export const useServer = () => {
  return useMemo(() => {
    return axios.create({
      baseURL: '/api',
      headers: { "Content-Type": "application/json" },
    });
  }, []);
}

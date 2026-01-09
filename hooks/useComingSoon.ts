"use client";
import { useToast } from './../app/Components/ToasterProvider';

export const useComingSoon = () => {
  const { showComingSoon } = useToast();

  const handleComingSoon = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    showComingSoon();
  };

  return { handleComingSoon };
};
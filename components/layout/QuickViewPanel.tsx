'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useUIStore } from '@/stores/useUIStore';
import { ScrollArea } from '@/components/ui/scroll-area';

interface QuickViewPanelProps {
  children?: React.ReactNode;
  title?: string;
}

export function QuickViewPanel({ children, title = 'Detail' }: QuickViewPanelProps) {
  const { quickViewOpen, closeQuickView } = useUIStore();

  return (
    <AnimatePresence>
      {quickViewOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeQuickView}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] lg:hidden"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md border-l bg-background shadow-2xl"
          >
            <div className="flex h-14 items-center justify-between border-b px-4">
              <h3 className="font-semibold">{title}</h3>
              <button
                onClick={closeQuickView}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <ScrollArea className="h-[calc(100vh-56px)]">
              <div className="p-4">{children}</div>
            </ScrollArea>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

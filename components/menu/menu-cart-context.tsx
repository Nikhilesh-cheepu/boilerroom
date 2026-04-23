"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { MenuCategory } from "@/lib/content/site";

export type MenuKind = "food" | "beverage" | "happyhours";

export type CartLine = {
  key: string;
  menuKind: MenuKind;
  categoryLabel: string;
  itemId: string;
  name: string;
  price: string;
  qty: number;
};

type MenuCartContextValue = {
  lines: CartLine[];
  addOne: (args: {
    menuKind: MenuKind;
    category: MenuCategory;
    itemId: string;
    name: string;
    price: string;
  }) => void;
  removeOne: (key: string) => void;
  clear: () => void;
  totalQty: number;
};

const MenuCartContext = createContext<MenuCartContextValue | null>(null);

function lineKey(menuKind: MenuKind, categoryId: string, itemId: string) {
  return `${menuKind}:${categoryId}:${itemId}`;
}

export function MenuCartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  const addOne = useCallback(
    ({
      menuKind,
      category,
      itemId,
      name,
      price,
    }: {
      menuKind: MenuKind;
      category: MenuCategory;
      itemId: string;
      name: string;
      price: string;
    }) => {
      const key = lineKey(menuKind, category.id, itemId);
      setLines((prev) => {
        const i = prev.findIndex((l) => l.key === key);
        if (i === -1) {
          return [
            ...prev,
            {
              key,
              menuKind,
              categoryLabel: category.label,
              itemId,
              name,
              price,
              qty: 1,
            },
          ];
        }
        const next = [...prev];
        const cur = next[i]!;
        next[i] = { ...cur, qty: cur.qty + 1 };
        return next;
      });
    },
    [],
  );

  const removeOne = useCallback((key: string) => {
    setLines((prev) => {
      const i = prev.findIndex((l) => l.key === key);
      if (i === -1) return prev;
      const cur = prev[i]!;
      if (cur.qty <= 1) {
        return prev.filter((l) => l.key !== key);
      }
      const next = [...prev];
      next[i] = { ...cur, qty: cur.qty - 1 };
      return next;
    });
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const totalQty = useMemo(
    () => lines.reduce((s, l) => s + l.qty, 0),
    [lines],
  );

  const value = useMemo(
    () => ({
      lines,
      addOne,
      removeOne,
      clear,
      totalQty,
    }),
    [lines, addOne, removeOne, clear, totalQty],
  );

  return (
    <MenuCartContext.Provider value={value}>
      {children}
    </MenuCartContext.Provider>
  );
}

export function useMenuCart() {
  const ctx = useContext(MenuCartContext);
  if (!ctx) {
    throw new Error("useMenuCart must be used within MenuCartProvider");
  }
  return ctx;
}
